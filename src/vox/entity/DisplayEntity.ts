/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import RSEntityFlag from '../../vox/scene/RSEntityFlag';
import Vector3D from "../../vox/math/Vector3D";
import Matrix4 from "../../vox/math/Matrix4";
import AABB from "../../vox/geom/AABB";
import MouseEvent from "../../vox/event/MouseEvent";
import IEvtDispatcher from "../../vox/event/IEvtDispatcher";
import IDisplayEntityContainer from "../../vox/entity/IDisplayEntityContainer";
import RendererState from "../../vox/render/RendererState";
import MeshBase from "../../vox/mesh/MeshBase";
import MaterialBase from "../../vox/material/MaterialBase";
import ROTransform from "../../vox/display/ROTransform";
import { SpaceCullingMask } from "../../vox/space/SpaceCullingMask";
import IRODisplay from "../../vox/display/IRODisplay";
import RODisplay from "../../vox/display/RODisplay";
import IRenderEntity from "../../vox/render/IRenderEntity";
import IEntityTransform from "../../vox/entity/IEntityTransform";
import IDisplayEntity from "../../vox/entity/IDisplayEntity";

import RenderProxy from "../../vox/render/RenderProxy";
import TextureProxy from '../../vox/texture/TextureProxy';
import DebugFlag from '../debug/DebugFlag';

export default class DisplayEntity implements IRenderEntity, IDisplayEntity, IEntityTransform {
    private static s_uid: number = 0;
    private m_uid: number = 0;
    protected m_transfrom: ROTransform = null;
    protected m_mouseEvtDispatcher: IEvtDispatcher = null;
    constructor(transform: ROTransform = null) {
        this.m_uid = DisplayEntity.s_uid++;
        if (transform == null) {
            this.m_transfrom = ROTransform.Create();
        }
        else {
            this.m_transfrom = transform;
        }
        this.createBounds();
    }
    private m_visible: boolean = true;
    private m_drawEnabled: boolean = true;
    private m_rcolorMask: number = RendererState.COLOR_MASK_ALL_TRUE;
    private m_renderState: number = RendererState.BACK_CULLFACE_NORMAL_STATE;
    private m_display: RODisplay = null;
    protected m_mesh: MeshBase = null;
    // 如果一个entity如果包含了多个mesh,则这个bounds就是多个mesh aabb 合并的aabb
    protected m_globalBounds: AABB = null;
    protected m_parent: IDisplayEntityContainer = null;
    protected m_renderProxy: RenderProxy = null;

    /**
     * renderer scene entity flag, be used by the renderer system
     * 第0位到第19位总共20位存放自身在space中的 index id(最小值为1, 最大值为1048575,默认值是0, 也就是最多只能展示1048575个entitys),
     * 第20位开始到26位为总共7位止存放在renderer中的状态数据(renderer unique id and others)
     * 第27位存放是否在container里面
     * 第28位开始到29位总共二位存放renderer 载入状态 的相关信息
     * 第30位位存放是否渲染运行时排序
     */
    __$rseFlag: number = RSEntityFlag.DEFAULT;
    name: string = "DisplayEntity";
    // 可见性裁剪是否开启, 如果不开启，则摄像机和遮挡剔除都不会裁剪, 取值于 SpaceCullingMask, 默认只会有摄像机裁剪
    spaceCullMask: SpaceCullingMask = SpaceCullingMask.CAMERA;
    // recorde a draw status
    drawEnabled: boolean = false;
    // mouse interaction enabled
    mouseEnabled: boolean = false;
    //
    vbWholeDataEnabled: boolean = true;
    protected createBounds(): void {
        this.m_globalBounds = new AABB();
    }
    __$setRenderProxy(rc: RenderProxy): void {
        this.m_renderProxy = rc;
    }
    __$setParent(parent: IDisplayEntityContainer): void {
        if (this.m_parent == null) {
        }
        this.m_parent = parent;
    }
    __$getParent(): IDisplayEntityContainer {
        return this.m_parent;
    }
    __$testSpaceEnabled(): boolean {
        //return this.__$spaceId < 0 && this.__$contId < 1;
        return RSEntityFlag.TestSpaceEnabled2(this.__$rseFlag);
    }
    __$testContainerEnabled(): boolean {
        //return this.__$wuid < 0 && this.__$contId < 1;
        return RSEntityFlag.TestContainerEnabled(this.__$rseFlag);
    }
    __$testRendererEnabled(): boolean {
        //return this.__$wuid < 0 && this.__$weid < 0 && this.__$contId < 1;
        return RSEntityFlag.TestRendererEnabled(this.__$rseFlag);
    }
    getRendererUid(): number {
        return RSEntityFlag.GetRendererUid(this.__$rseFlag);
    }
    /**
     * @returns 自身是否未必任何渲染器相关的系统使用
     */
    isFree(): boolean {
        return this.__$rseFlag == RSEntityFlag.DEFAULT;
    }
    dispatchEvt(evt: any): void {
        if (evt.getClassType() == MouseEvent.EventClassType) {
            if (this.m_mouseEvtDispatcher != null) {
                this.m_mouseEvtDispatcher.dispatchEvt(evt);
            }
        }
    }
    getEvtDispatcher(evtClassType: number): IEvtDispatcher {
        return this.m_mouseEvtDispatcher;
    }
    setEvtDispatcher(evtDisptacher: IEvtDispatcher): void {
        this.m_mouseEvtDispatcher = evtDisptacher;
    }
    getGlobalBounds(): AABB {
        return this.m_globalBounds;
    }
    getLocalBounds(): AABB {
        return this.m_mesh.bounds;
    }

    getGlobalBoundsVer(): number {
        if (this.m_globalBounds != null) {
            return this.m_globalBounds.version;
        }
        return -1;
    }
    __$setDrawEnabled(boo: boolean): void {
        if (this.m_drawEnabled != boo) {
            this.m_drawEnabled = boo;
            if (this.m_display != null) {
                this.m_display.visible = this.m_visible && boo;
                if (this.m_display.__$$runit != null) {
                    this.m_display.__$$runit.setVisible(this.m_display.visible);
                }
            }
        }
    }
    isDrawEnabled(): boolean {
        return this.m_drawEnabled;
    }
    protected m_texChanged: boolean = false;
    protected m_meshChanged: boolean = false;
    /**
     * users need to call this function manually
     * 更新有两种形式, 1: 只是更改资源内部的数据, 2: 替换资源本身
     * 更新过程可以通过DisplayEntity对象来控制，也可以通过资源本身来控制
     */
    updateMeshToGpu(rc: RenderProxy = null, deferred: boolean = true): void {
        if (rc != null) this.m_renderProxy = rc;
        if (this.m_renderProxy != null && this.m_display != null && this.m_display.__$ruid > -1) {
            if (this.m_meshChanged) {
                this.m_meshChanged = false;
                this.m_renderProxy.VtxBufUpdater.updateDispVbuf(this.m_display, deferred);
            }
            else {
                this.m_renderProxy.VtxBufUpdater.updateVtxDataToGpuByUid(this.m_display.vbuf.getUid(), deferred);
            }
        }
    }
    /**
     * users need to call this function manually
     * 更新有两种形式, 1: 只是更改资源内部的数据, 2: 替换资源本身
     * 更新过程可以通过DisplayEntity对象来控制，也可以通过资源本身来控制
     */
    updateMaterialToGpu(rc: RenderProxy = null, deferred: boolean = true): void {
        if (rc != null) this.m_renderProxy = rc;
        if (this.m_renderProxy != null && this.m_display != null && this.m_display.__$ruid > -1) {
            if (this.m_texChanged) {
                this.m_texChanged = false;
                this.m_renderProxy.MaterialUpdater.updateDispTRO(this.m_display, deferred);
            }
        }
    }
    /**
     * set new textures list for the material of this instance.
     */
    setTextureList(texList: TextureProxy[]): void {
        if (this.m_display != null && this.m_display.__$ruid > -1) {
            if (this.m_display.getMaterial() != null) {
                this.m_display.getMaterial().setTextureList(texList);
                this.m_texChanged = true;
            }
        }
    }
    /**
     * set new texture by the index in the material textures list for the material of this instance.
     */
    setTextureAt(index: number, tex: TextureProxy): void {
        if (this.m_display != null && this.m_display.__$ruid > -1) {
            if (this.m_display.getMaterial() != null) {
                this.m_display.getMaterial().setTextureAt(index, tex);
                this.m_texChanged = true;
            }
        }
    }
    setSortValue(value: number): void {
        if (this.m_display != null) {
            if (this.m_display.__$$runit != null) {
                this.m_display.__$$runit.value = value;
            }
        }
    }
    setVisible(boo: boolean): void {
        if (this.m_visible != boo) {
            this.m_visible = boo;
            if (this.m_display != null) {
                this.m_display.visible = boo && this.m_drawEnabled;
                if (this.m_display.__$$runit != null) {
                    this.m_display.__$$runit.setVisible(this.m_display.visible);
                }
            }
        }
    }
    getVisible(): boolean {
        return this.m_visible;
    }
    getTransform(): ROTransform {
        return this.m_transfrom;
    }
    copyPositionFrom(entity: DisplayEntity): void {
        if (entity != null) {
            this.m_transfrom.copyPositionFrom(entity.getTransform());
        }
    }
    copyMeshFrom(entity: IDisplayEntity): void {
        if (entity != null) {
            this.setMesh(entity.getMesh());
        }
    }
    copyMaterialFrom(entity: IDisplayEntity): void {
        if (entity != null) {
            this.setMaterial(entity.getMaterial());
        }
    }
    copyTransformFrom(entity: IDisplayEntity): void {
        let pe: DisplayEntity = entity as DisplayEntity;
        if (pe != null) {
            this.m_transfrom.copyFrom(pe.m_transfrom);
        }
    }
    private initDisplay(m: MeshBase): void {
        this.m_display.vbuf = m.__$attachVBuf();
        this.m_display.ivsIndex = 0;
        this.m_display.ivsCount = m.vtCount;        
        this.m_display.drawMode = m.drawMode;
        this.m_display.trisNumber = m.trisNumber;
        this.m_display.visible = this.m_visible && this.m_drawEnabled;
    }
    /**
     * 设置几何相关的数据,必须是构建完备的mesh才能被设置进来
     * 这个设置函数也可以动态运行时更新几何相关的顶点数据
     */
    setMesh(m: MeshBase): void {
        if (this.m_mesh == null) {
            if (m != null) {
                if (!m.isEnabled()) { m.rebuild() }
                if (m.isEnabled()) {
                    this.m_mesh = m;
                    m.__$attachThis();
                    if (this.m_display == null) {
                        this.createDisplay();
                    }
                    if (this.m_display != null) {
                        this.m_display.setTransform(this.m_transfrom.getMatrix());
                        this.initDisplay(m);
                    }
                    //console.log("DisplayEntity::setMesh(), "+this.m_display.toString()+",m.drawMode: "+m.drawMode);
                    if (this.m_globalBounds != null) {
                        this.m_globalBounds.copyFrom(m.bounds);
                    }
                    this.updateMesh();
                }
            }
        }
        else if (this.m_display != null && this.m_display.__$ruid > -1) {
            if (this.m_mesh != m && m != null) {
                this.m_transfrom.updatedStatus |= 2;
                this.m_mesh.__$detachVBuf(this.m_display.vbuf);
                this.m_mesh.__$detachThis();
                m.__$attachThis();
                this.m_mesh = m;
                this.initDisplay(m);
                this.m_meshChanged = true;
                this.updateMesh();
            }
        }
    }
    protected updateMesh(): void {
    }
    getIvsIndex(): number {
        return this.m_display.ivsIndex;
    }
    getIvsCount(): number {
        return this.m_display.ivsCount;
    }
    setIvsParam(ivsIndex: number, ivsCount: number): void {
        if (this.m_display != null) {
            this.m_display.ivsIndex = ivsIndex;
            this.m_display.ivsCount = ivsCount;
            if (this.m_display.__$ruid > -1) {
                this.m_display.__$$runit.trisNumber = Math.floor((ivsCount - ivsIndex) / 3);
                this.m_display.__$$runit.setIvsParam(ivsIndex, ivsCount);
                this.m_display.__$$runit.drawMode = this.m_mesh.drawMode;
            }
        }
    }
    getMesh(): MeshBase {
        return this.m_mesh;
    }

    hasMesh(): boolean {
        return this.m_mesh != null;
    }
    /**
     * @return 返回true是则表示这是基于三角面的多面体, 返回false则是一个数学方程描述的几何体(例如球体),默认返回true
     */
    isPolyhedral(): boolean {
        return this.m_mesh == null || this.m_mesh.isPolyhedral();
    }
    /**
     * @boundsHit       表示是否包围盒体已经和射线相交了
     * @rlpv            表示物体坐标空间的射线起点
     * @rltv            表示物体坐标空间的射线朝向
     * @outV            如果检测相交存放物体坐标空间的交点
     * @return          返回值 -1 表示不会进行检测,1表示相交,0表示不相交
     */
    testRay(rlpv: Vector3D, rltv: Vector3D, outV: Vector3D, boundsHit: boolean): number {
        return this.m_mesh.testRay(rlpv, rltv, outV, boundsHit);
    }
    /**
     * 只允许在加入渲染器之前设置 MaterialBase 实例
     */
    setMaterial(m: MaterialBase): void {
        if (m != null) {
            if (this.m_display == null) {
                this.m_display = RODisplay.Create();
                this.m_display.setTransform(this.m_transfrom.getMatrix());

                this.m_display.visible = this.m_visible && this.m_drawEnabled;
            }
            //if(this.m_display.getMaterial() != m && this.__$wuid == RSEntityFlag.RENDERER_UID_FLAT && this.m_display.__$ruid < 0)
            if (this.m_display.getMaterial() != m && (RSEntityFlag.RENDERER_UID_FLAT & this.__$rseFlag) == RSEntityFlag.RENDERER_UID_FLAT && this.m_display.__$ruid < 0) {
                this.m_display.renderState = this.m_renderState;
                this.m_display.rcolorMask = this.m_rcolorMask;
                this.m_display.setMaterial(m);
            }
        }
    }
    getMaterial(): MaterialBase {
        if (this.m_display != null) {
            return this.m_display.getMaterial();
        }
        return null;
    }
    getDisplay(): IRODisplay {
        return this.m_display;
    }
    getInvMatrix(): Matrix4 {
        return this.m_transfrom.getInvMatrix();
    }
    /**
     * 获取当前 entity 的 local space to world space matrix
     * @param flag 是否将当前matrix更新到最新, 默认值是true
     * @returns local space to world space matrix
     */
    getMatrix(flag: boolean = true): Matrix4 {
        return this.m_transfrom.getMatrix(flag);
    }
    getToParentMatrix(): Matrix4 {
        return this.m_transfrom.getToParentMatrix();
    }
    setRenderColorMask(rt: number): void {
        this.m_rcolorMask = rt;
        if (this.m_display != null) {
            this.m_display.rcolorMask = this.m_rcolorMask;
            if (this.m_display.__$$runit != null) {
                this.m_display.__$$runit.setDrawFlag(this.m_renderState, this.m_rcolorMask);
            }
        }
    }
    setRenderColorMaskByName(rt_name: string): void {
        this.m_rcolorMask = RendererState.GetRenderColorMaskByName(rt_name);
        if (this.m_display != null) {
            this.m_display.rcolorMask = this.m_rcolorMask;
            if (this.m_display.__$$runit != null) {
                this.m_display.__$$runit.setDrawFlag(this.m_renderState, this.m_rcolorMask);
            }
        }
    }

    setRenderState(renderState: number): void {
        this.m_renderState = renderState;
        if (this.m_display != null) {
            this.m_display.renderState = this.m_renderState;
            if (this.m_display.__$$runit != null) {
                this.m_display.__$$runit.setDrawFlag(this.m_renderState, this.m_rcolorMask);
            }
        }
    }
    setRenderStateByName(renderState_name: string): void {
        this.m_renderState = RendererState.GetRenderStateByName(renderState_name);
        if (this.m_display != null) {
            this.m_display.renderState = this.m_renderState;
            if (this.m_display.__$$runit != null) {
                this.m_display.__$$runit.setDrawFlag(this.m_renderState, this.m_rcolorMask);
            }
        }
    }
    protected createDisplay(): void {
        this.m_display = RODisplay.Create();
    }
    activeDisplay(): void {

        if (this.m_display != null) {
            let material: MaterialBase = this.m_display.getMaterial();
            if (material != null) {

                if (material.getShaderData() == null) {
                    if (material.getCodeBuf() != null) {
                        if (material.getShaderData() == null) {
                            let texList: TextureProxy[] = material.getTextureList();
                            let texEnabled: boolean = (texList != null && texList.length > 0);
                            material.initializeByCodeBuf(texEnabled);
                        }
                    }
                }

                if (this.getMesh() == null) {
                    this.__activeMesh(material);
                    //  // for debug
                    this.m_display.name = this.name;
                }
            }
        }
    }
    // for sub class override
    protected __activeMesh(material: MaterialBase): void {
    }
    getUid(): number { return this.m_uid; }
    setXYZ(px: number, py: number, pz: number): void {
        this.m_transfrom.setXYZ(px, py, pz);
    }
    offsetPosition(pv: Vector3D): void {
        this.m_transfrom.offsetPosition(pv);
    }
    setPosition(pv: Vector3D): void {
        this.m_transfrom.setPosition(pv);
    }
    getPosition(pv: Vector3D): void {
        this.m_transfrom.getPosition(pv);
    }
    setRotationXYZ(rx: number, ry: number, rz: number): void {
        this.m_transfrom.setRotationXYZ(rx, ry, rz);
    }
    setScaleXYZ(sx: number, sy: number, sz: number): void {
        this.m_transfrom.setScaleXYZ(sx, sy, sz);
    }

    getRotationXYZ(pv: Vector3D): void {
        this.m_transfrom.getRotationXYZ(pv);
    }
    getScaleXYZ(pv: Vector3D): void {
        this.m_transfrom.getScaleXYZ(pv);
    }
    destroy(): void {
        // 当自身被完全移出RenderWorld之后才能执行自身的destroy
        //console.log("DisplayEntity::destroy(), renderer uid: "+this.getRendererUid()+", this.__$spaceId: "+this.__$spaceId);
        if (this.m_mouseEvtDispatcher != null) {
            this.m_mouseEvtDispatcher.destroy();
            this.m_mouseEvtDispatcher = null;
        }
        if (this.m_transfrom != null && this.isFree()) {
            // 这里要保证其在所有的process中都被移除
            if (this.m_display != null) {
                this.m_mesh.__$detachVBuf(this.m_display.vbuf);
                RODisplay.Restore(this.m_display);
                this.m_display = null;
            }
            ROTransform.Restore(this.m_transfrom);
            this.m_transfrom = null;
            if (this.m_mesh != null) {
                this.m_mesh.__$detachThis();
                this.m_mesh = null;
            }
            this.__$setParent(null);
            this.m_visible = true;
            this.m_drawEnabled = true;
            this.m_renderProxy = null;
            this.__$rseFlag = RSEntityFlag.DEFAULT;
        }
    }
    private static s_boundsInVS: Float32Array = new Float32Array(24);
    private static s_boundsOutVS: Float32Array = new Float32Array(24);
    private static s_pos: Vector3D = new Vector3D();
    private static s_prePos: Vector3D = new Vector3D();
    /**
     * @returns 是否已经加入渲染器中(但是可能还没有进入真正的渲染运行时)
     */
    isInRenderer(): boolean {
        return (this.__$rseFlag & RSEntityFlag.RENDERER_UID_FLAT) != RSEntityFlag.RENDERER_UID_FLAT;
    }
    /**
     * @returns 是否处在渲染运行时中
     */
    isRenderEnabled(): boolean {
        return this.m_display != null && this.m_display.__$ruid > -1;
    }
    updateBounds(): void {
        if (this.m_transfrom != null) {
            this.m_transStatus = ROTransform.UPDATE_TRANSFORM;
            this.update();
        }
    }

    private m_transStatus: number = ROTransform.UPDATE_TRANSFORM;
    protected updateGlobalBounds(): void {

        // 这里的逻辑也有问题,需要再处理，为了支持摄像机等的拾取以及支持遮挡计算等空间管理计算
        //if (this.m_transStatus > ROTransform.UPDATE_POSITION || this.m_transfrom.getRotationFlag()) {
        if (this.m_transStatus > ROTransform.UPDATE_POSITION) {
            this.m_transfrom.update();
            let pminV: Vector3D = this.m_mesh.bounds.min;
            let pmaxV: Vector3D = this.m_mesh.bounds.max;
            let pvs: Float32Array = DisplayEntity.s_boundsInVS;
            pvs[0] = pminV.x; pvs[1] = pminV.y; pvs[2] = pminV.z;
            pvs[3] = pmaxV.x; pvs[4] = pminV.y; pvs[5] = pminV.z;
            pvs[6] = pminV.x; pvs[7] = pminV.y; pvs[8] = pmaxV.z;
            pvs[9] = pmaxV.x; pvs[10] = pminV.y; pvs[11] = pmaxV.z;
            pvs[12] = pminV.x; pvs[13] = pmaxV.y; pvs[14] = pminV.z;
            pvs[15] = pmaxV.x; pvs[16] = pmaxV.y; pvs[17] = pminV.z;
            pvs[18] = pminV.x; pvs[19] = pmaxV.y; pvs[20] = pmaxV.z;
            pvs[21] = pmaxV.x; pvs[22] = pmaxV.y; pvs[23] = pmaxV.z;
            this.m_transfrom.getMatrix().transformVectors(pvs, 24, DisplayEntity.s_boundsOutVS);
            this.m_globalBounds.reset();
            this.m_globalBounds.addXYZFloat32Arr(DisplayEntity.s_boundsOutVS);
            this.m_globalBounds.update();
        }
        else {
            DisplayEntity.s_prePos.setXYZ(0, 0, 0);
            DisplayEntity.s_pos.setXYZ(0, 0, 0);
            let matrix = this.m_transfrom.getMatrix(false);
            matrix.transformVector3Self(DisplayEntity.s_prePos);
            this.m_transfrom.update();
            matrix = this.m_transfrom.getMatrix(false);
            matrix.transformVector3Self(DisplayEntity.s_pos);
            DisplayEntity.s_pos.subtractBy(DisplayEntity.s_prePos);
            let gbounds = this.m_globalBounds;
            gbounds.min.addBy(DisplayEntity.s_pos);
            gbounds.max.addBy(DisplayEntity.s_pos);
            gbounds.center.addBy(DisplayEntity.s_pos);

            // let matrix = this.m_transfrom.getMatrix();
            // let bounds = this.m_mesh.bounds;
            // let gbounds = this.m_globalBounds;
            // matrix.transformOutVector3(bounds.min, gbounds.min);
            // matrix.transformOutVector3(bounds.max, gbounds.max);
            // gbounds.center.addVecsTo(gbounds.min, gbounds.max);
            // gbounds.center.scaleBy(0.5);
            ++this.m_globalBounds.version;
        }
    }
    update(): void {
        if (this.m_transfrom.updatedStatus > this.m_transStatus) this.m_transStatus = this.m_transfrom.updatedStatus;
        if (this.m_transStatus != ROTransform.UPDATE_NONE) {
            if (this.m_mesh != null && this.m_globalBounds != null) {
                this.updateGlobalBounds();
            }
            else {
                this.m_transfrom.update();
            }
            this.m_transStatus = ROTransform.UPDATE_NONE;
            this.m_transfrom.updatedStatus = this.m_transStatus;
        }
        if (this.m_display != null && this.m_display.__$$runit != null) {
            this.m_display.__$$runit.bounds = this.m_globalBounds;
            this.m_transfrom.getPosition(this.m_display.__$$runit.pos);
        }
    }
    toString(): string {
        return "DisplayEntity(name=" + this.name + ",uid = " + this.m_uid + ", rseFlag = " + this.__$rseFlag + ")";
    }
}