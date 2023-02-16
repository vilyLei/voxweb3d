/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import RSEntityFlag from '../../vox/scene/RSEntityFlag';
import Vector3D from "../../vox/math/Vector3D";
import IMatrix4 from "../../vox/math/IMatrix4";
import IAABB from "../../vox/geom/IAABB";
import AABB from "../../vox/geom/AABB";
import IEvtDispatcher from "../../vox/event/IEvtDispatcher";
import IDisplayEntityContainer from "../../vox/entity/IDisplayEntityContainer";
import RendererState from "../../vox/render/RendererState";
import IMeshBase from "../../vox/mesh/IMeshBase";
import IRenderMaterial from "../../vox/render/IRenderMaterial";

import IROTransform from "../../vox/display/IROTransform";
import ROTransform from "../../vox/display/ROTransform";
import { SpaceCullingMask } from "../../vox/space/SpaceCullingMask";
import IRODisplay from "../../vox/display/IRODisplay";
import RODisplay from "../../vox/display/RODisplay";
import IEntityTransform from "../../vox/entity/IEntityTransform";
import IDisplayEntity from "../../vox/entity/IDisplayEntity";
import ITransformEntity from "../../vox/entity/ITransformEntity";

import IRenderProxy from "../../vox/render/IRenderProxy";
import IRenderTexture from "../../vox/render/texture/IRenderTexture";
import DebugFlag from '../debug/DebugFlag';

import { MaterialPipeType } from "../../vox/material/pipeline/MaterialPipeType";
import { IMaterialPipeline } from "../../vox/material/pipeline/IMaterialPipeline";

export default class DisplayEntity implements IDisplayEntity, IEntityTransform, ITransformEntity {
    private static s_uid = 0;
    private m_uid = 0;
    protected m_trs: IROTransform = null;
    protected m_eventDispatcher: IEvtDispatcher = null;
    constructor(transform: IROTransform = null, sharedData: boolean = false) {
        this.m_uid = DisplayEntity.s_uid++;
        if (transform == null) {
            this.m_trs = ROTransform.Create();
        }
        else {
            if(sharedData) {
                this.m_trs = ROTransform.Create(null,transform.getFS32Data());
            }else {
                this.m_trs = transform;
            }
        }
        this.createBounds();
    }
    private m_visible = true;
    private m_drawEnabled = true;
    private m_rcolorMask = 0;
    private m_renderState = 0;
    private m_display: RODisplay = null;
    protected m_mesh: IMeshBase = null;
    // 如果一个entity如果包含了多个mesh,则这个bounds就是多个mesh aabb 合并的aabb
    protected m_localBounds: IAABB = null;
    protected m_globalBounds: IAABB = null;
    protected m_localBuondsVer: number = -1;
    protected m_parent: IDisplayEntityContainer = null;
    protected m_renderProxy: IRenderProxy = null;
    protected m_pipeLine: IMaterialPipeline = null;

    /**
     * renderer scene entity flag, be used by the renderer system
     * 第0位到第19位总共20位存放自身在space中的 index id(最小值为1, 最大值为1048575,默认值是0, 也就是最多只能展示1048575个entitys),
     * 第20位开始到26位为总共7位止存放在renderer中的状态数据(renderer unique id and others)
     * 第27位存放是否在container里面
     * 第28位开始到29位总共二位存放renderer 载入状态 的相关信息
     * 第30位位存放是否渲染运行时排序
     */
    __$rseFlag = RSEntityFlag.DEFAULT;
    name = "DisplayEntity";
    /**
     * 可见性裁剪是否开启, 如果不开启，则摄像机和遮挡剔除都不会裁剪, 取值于 SpaceCullingMask, 默认只会有摄像机裁剪
     */
    spaceCullMask: SpaceCullingMask = SpaceCullingMask.CAMERA;
    /**
     * recorde a draw status
     */
    drawEnabled = false;
    /**
     * mouse interaction enabled
     */
    mouseEnabled = false;
    /**
     * whether merge vertex geometry data for shader vertex buffer attribute data
     */
    vbWholeDataEnabled = true;
    /**
     * pipes type list for material pipeline
     */
    pipeTypes: MaterialPipeType[] = null;

    protected createBounds(): void {
        this.m_globalBounds = new AABB();
    }
    __$setRenderProxy(rc: IRenderProxy): void {
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

    setMaterialPipeline(pipeline: IMaterialPipeline): void {
        this.m_pipeLine = pipeline;
    }
    getMaterialPipeline(): IMaterialPipeline {
        return this.m_pipeLine;
    }

    /**
     * @returns 自身是否未必任何渲染器相关的系统使用
     */
    isFree(): boolean {
        return this.__$rseFlag == RSEntityFlag.DEFAULT;
    }
    dispatchEvt(evt: any): number {

        // if (evt.getClassType() == MouseEvent.EventClassType) {
        if (this.m_eventDispatcher != null) {
            return this.m_eventDispatcher.dispatchEvt(evt);
        }
        // }
        return 0;
    }
    getEvtDispatcher(evtClassType: number): IEvtDispatcher {
        return this.m_eventDispatcher;
    }
    setEvtDispatcher(evtDisptacher: IEvtDispatcher): void {
        this.m_eventDispatcher = evtDisptacher;
    }
    getGlobalBounds(): IAABB {
        return this.m_globalBounds;
    }
    getLocalBounds(): IAABB {
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
            const  d = this.m_display;
            if (d != null) {
                d.visible = this.m_visible && boo;
                if (d.__$$runit != null) {
                    d.__$$runit.setVisible(d.visible);
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
    updateMeshToGpu(rc: IRenderProxy = null, deferred: boolean = true): void {

        if (rc != null) this.m_renderProxy = rc;
        if (this.m_renderProxy != null && this.m_display != null && this.m_display.__$ruid > -1) {
            if (this.m_meshChanged) {
                this.m_meshChanged = false;
                this.m_renderProxy.VtxBufUpdater.updateDispVbuf(this.m_display, deferred);
            }
            else {
                // this.m_renderProxy.VtxBufUpdater.updateVtxDataToGpuByUid(this.m_display.vbuf.getUid(), deferred);
                this.m_renderProxy.VtxBufUpdater.updateVtxDataToGpuByUid(this.m_display.getVtxResUid(), deferred);
            }
        }
    }
    /**
     * users need to call this function manually
     * 更新有两种形式, 1: 只是更改资源内部的数据, 2: 替换资源本身
     * 更新过程可以通过DisplayEntity对象来控制，也可以通过资源本身来控制
     */
    updateMaterialToGpu(rc: IRenderProxy = null, deferred: boolean = true): void {
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
    setTextureList(texList: IRenderTexture[]): void {
        if (this.m_display != null && this.m_display.__$ruid > -1) {
            let material = this.m_display.getMaterial() as IRenderMaterial;
            if (material != null) {
                material.setTextureList(texList);
                this.m_texChanged = true;
            }
        }
    }
    /**
     * set new texture by the index in the material textures list for the material of this instance.
     */
    setTextureAt(index: number, tex: IRenderTexture): void {
        if (this.m_display != null && this.m_display.__$ruid > -1) {
            let material = this.m_display.getMaterial() as IRenderMaterial;
            if (material != null) {
                material.setTextureAt(index, tex);
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
    isVisible(): boolean {
        return this.m_visible;
    }
    getTransform(): IROTransform {
        return this.m_trs;
    }
    copyPositionFrom(entity: DisplayEntity): void {
        if (entity != null) {
            this.m_trs.copyPositionFrom(entity.getTransform());
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
            this.m_trs.copyFrom(pe.m_trs);
        }
    }
    private initDisplay(m: IMeshBase): void {
        let vbuf = m.__$attachVBuf();
        vbuf.setBufSortFormat(m.getBufSortFormat());
        const d = this.m_display;
        d.vbuf = vbuf as any;
        d.ivbuf = m.__$attachIVBuf() as any;        
        d.ivsIndex = 0;
        d.ivsCount = m.vtCount;
        d.drawMode = m.drawMode;
        d.trisNumber = m.trisNumber;
        d.visible = this.m_visible && this.m_drawEnabled;
    }
    /**
     * 设置几何相关的数据,必须是构建完备的mesh才能被设置进来
     * 这个设置函数也可以动态运行时更新几何相关的顶点数据
     */
    setMesh(m: IMeshBase): void {
        
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
                        this.m_display.setTransform(this.m_trs.getMatrix());
                        this.initDisplay(m);
                    }
                    //console.log("DisplayEntity::setMesh(), "+this.m_display.toString()+",m.drawMode: "+m.drawMode);
                    if (this.m_localBounds == null) {
                        this.m_localBounds = m.bounds;
                    }
                    else {
                        this.m_localBounds.copyFrom(m.bounds);
                    }
                    this.updateMesh();
                }
            }
        }
        else if (this.m_display != null && this.m_display.__$ruid > -1) {
            if (this.m_mesh != m && m != null) {
                this.m_trs.updatedStatus |= 2;
                this.m_mesh.__$detachVBuf(this.m_display.vbuf);
                this.m_mesh.__$detachIVBuf(this.m_display.ivbuf);
                this.m_mesh.__$detachThis();
                m.__$attachThis();
                this.m_mesh = m;
                this.initDisplay(m);
                this.updateMesh();
                this.m_meshChanged = true;
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
    setIvsParam(ivsIndex: number, ivsCount: number, updateBounds: boolean = false): void {

        if (this.m_display != null) {

            this.m_display.ivsIndex = ivsIndex;
            this.m_display.ivsCount = ivsCount;
            if (this.m_display.__$ruid > -1) {
                let ut = this.m_display.__$$runit;
                ut.trisNumber = Math.floor((ivsCount - ivsIndex) / 3);
                ut.setIvsParam(ivsIndex, ivsCount);
                ut.drawMode = this.m_mesh.drawMode;

                if (updateBounds && this.isPolyhedral()) {

                    if (this.m_localBounds == this.m_mesh.bounds) {
                        this.m_localBounds = new AABB();
                        this.m_localBounds.copyFrom(this.m_mesh.bounds);
                    }
                    this.m_transStatus = ROTransform.UPDATE_TRANSFORM;
                    this.m_localBounds.reset();
                    let ivs = this.m_mesh.getIVS();
                    this.m_localBounds.addFloat32AndIndicesArr(this.m_mesh.getVS(), ivs.subarray(ivsIndex, ivsIndex + ivsCount));
                    this.m_localBounds.update();
                }
            }
        }
    }
    getMesh(): IMeshBase {
        return this.m_mesh;
    }

    hasMesh(): boolean {
        return this.m_mesh != null;
    }
    /**
     * @return 返回true是则表示这是基于三角面的多面体, 返回false则是一个数学方程描述的几何体(例如球体),默认返回true
     */
    isPolyhedral(): boolean {
        return this.m_mesh === null || this.m_mesh.isPolyhedral();
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
     * 只允许在加入渲染器之前设置 IRenderMaterial 实例
     */
    setMaterial(m: IRenderMaterial): void {
        if (m != null) {
            if (this.m_display == null) {
                this.m_display = RODisplay.Create();
                this.m_display.setTransform(this.m_trs.getMatrix());

                this.m_display.visible = this.m_visible && this.m_drawEnabled;
            }
            const flag = RSEntityFlag.RENDERER_UID_FLAG;
            const disp = this.m_display;
            if (disp.getMaterial() != m && (flag & this.__$rseFlag) == flag && disp.__$ruid < 0) {
                disp.renderState = this.m_renderState;
                disp.rcolorMask = this.m_rcolorMask;
                disp.setMaterial(m);
            }
        }
    }
    getMaterial(): IRenderMaterial {
        if (this.m_display != null) {
            return this.m_display.getMaterial();
        }
        return null;
    }
    getDisplay(): IRODisplay {
        return this.m_display;
    }
    getInvMatrix(): IMatrix4 {
        return this.m_trs.getInvMatrix();
    }
    /**
     * 获取当前 entity 的 local space to world space matrix
     * @param flag 是否将当前matrix更新到最新, 默认值是true
     * @returns local space to world space matrix
     */
    getMatrix(flag: boolean = true): IMatrix4 {
        return this.m_trs.getMatrix(flag);
    }
    getToParentMatrix(): IMatrix4 {
        return this.m_trs.getToParentMatrix();
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
    getRenderState(): number {
        return this.m_renderState;
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
            let material: IRenderMaterial = this.m_display.getMaterial();
            if (material != null) {

                if (material.getShaderData() == null) {
                    if (material.getCodeBuf() != null) {
                        if (material.getShaderData() == null) {
                            let texList = material.getTextureList();
                            let texEnabled = (texList != null && texList.length > 0);
                            if (material.getMaterialPipeline() == null && this.getMaterialPipeline() != null) {
                                material.setMaterialPipeline(this.getMaterialPipeline());
                            }
                            if (material.pipeTypes == null) {
                                material.pipeTypes = this.pipeTypes;
                            }
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
    protected __activeMesh(material: IRenderMaterial): void {
    }
    getUid(): number { return this.m_uid; }
    setXYZ(px: number, py: number, pz: number): void {
        this.m_trs.setXYZ(px, py, pz);
    }
    offsetPosition(pv: Vector3D): void {
        this.m_trs.offsetPosition(pv);
    }
    setPosition(pv: Vector3D): void {
        this.m_trs.setPosition(pv);
    }
    getPosition(pv: Vector3D): Vector3D {
        this.m_trs.getPosition(pv);
        return pv;
    }
    setRotation3(rotV: Vector3D): void {
        this.m_trs.setRotationXYZ(rotV.x, rotV.y, rotV.z);
    }
    setRotationXYZ(rx: number, ry: number, rz: number): void {
        this.m_trs.setRotationXYZ(rx, ry, rz);
    }
    setScale3(sv: Vector3D): void {
        this.m_trs.setScaleXYZ(sv.x, sv.y, sv.z);
    }
    setScaleXYZ(sx: number, sy: number, sz: number): void {
        this.m_trs.setScaleXYZ(sx, sy, sz);
    }

    getRotationXYZ(pv: Vector3D): void {
        this.m_trs.getRotationXYZ(pv);
    }
    getScaleXYZ(pv: Vector3D): void {
        this.m_trs.getScaleXYZ(pv);
    }
    localToGlobal(pv: Vector3D): void {
        if (this.m_trs != null) {
            this.m_trs.localToGlobal(pv);
        }
    }
    globalToLocal(pv: Vector3D): void {
        if (this.m_trs != null) {
            this.m_trs.globalToLocal(pv);
        }
    }
    //private static s_boundsInVS: Float32Array = new Float32Array(24);
    private static s_boundsOutVS: Float32Array = new Float32Array(24);
    private static s_pos: Vector3D = new Vector3D();
    private static s_prePos: Vector3D = new Vector3D();
    
    /**
     * 表示没有加入任何渲染场景或者渲染器
     */
    isRFree(): boolean {
        return this.__$rseFlag == RSEntityFlag.DEFAULT;
    }
    /**
     * @returns 是否已经加入渲染器中(但是可能还没有进入真正的渲染运行时)
     */
    isInRenderer(): boolean {
        return (this.__$rseFlag & RSEntityFlag.RENDERER_UID_FLAG) != RSEntityFlag.RENDERER_UID_FLAG;
    }
    /**
     * @returns 是否在渲染器渲染过程中
     */
    isInRendererProcess(): boolean {
        return this.m_display != null && this.m_display.__$ruid > -1;
    }
    /**
     * @returns 是否能被渲染
     */
    isRenderEnabled(): boolean {
        return this.drawEnabled && this.m_visible && this.m_display != null && this.m_display.__$ruid > -1;
    }
    updateBounds(): void {
        if (this.m_trs != null) {
            this.m_transStatus = ROTransform.UPDATE_TRANSFORM;

            if (this.m_mesh != null && this.m_localBounds != this.m_mesh.bounds) {

                this.m_localBounds.reset();
                let ivs: Uint16Array | Uint32Array = this.m_mesh.getIVS();
                this.m_localBounds.addFloat32AndIndicesArr(this.m_mesh.getVS(), ivs.subarray(this.m_display.ivsIndex, this.m_display.ivsIndex + this.m_display.ivsCount));
                this.m_localBounds.update();
            }
            this.update();
        }
    }
    private m_lBoundsVS: Float32Array = null;
    private m_transStatus: number = ROTransform.UPDATE_TRANSFORM;
    private updateLocalBoundsVS(bounds: IAABB): void {
        let min = bounds.min;
        let max = bounds.max;
        if (this.m_lBoundsVS == null) {
            this.m_lBoundsVS = new Float32Array(24);
        }
        let pvs: Float32Array = this.m_lBoundsVS;
        pvs[0] = min.x; pvs[1] = min.y; pvs[2] = min.z;
        pvs[3] = max.x; pvs[4] = min.y; pvs[5] = min.z;
        pvs[6] = min.x; pvs[7] = min.y; pvs[8] = max.z;
        pvs[9] = max.x; pvs[10] = min.y; pvs[11] = max.z;
        pvs[12] = min.x; pvs[13] = max.y; pvs[14] = min.z;
        pvs[15] = max.x; pvs[16] = max.y; pvs[17] = min.z;
        pvs[18] = min.x; pvs[19] = max.y; pvs[20] = max.z;
        pvs[21] = max.x; pvs[22] = max.y; pvs[23] = max.z;
    }
    protected updateGlobalBounds(): void {

        // 这里的逻辑也有问题,需要再处理，为了支持摄像机等的拾取以及支持遮挡计算等空间管理计算

        let DE = DisplayEntity;
        let bounds = this.m_localBounds;
        if (this.m_transStatus > ROTransform.UPDATE_POSITION || this.m_localBuondsVer != bounds.version) {

            let st: number = this.m_trs.updateStatus;
            this.m_trs.update();

            if (this.m_localBuondsVer != bounds.version || st != this.m_trs.updateStatus) {

                this.m_localBuondsVer = bounds.version;
                this.updateLocalBoundsVS(bounds);

                let in_vs = this.m_lBoundsVS;
                let out_vs = DE.s_boundsOutVS;
                this.m_trs.getMatrix().transformVectors(in_vs, 24, out_vs);
                this.m_globalBounds.reset();
                this.m_globalBounds.addFloat32Arr(out_vs);
                this.m_globalBounds.update();
            }
        }
        else {
            DE.s_prePos.setXYZ(0, 0, 0);
            DE.s_pos.setXYZ(0, 0, 0);
            let matrix = this.m_trs.getMatrix(false);
            matrix.transformVector3Self(DE.s_prePos);
            this.m_trs.update();
            matrix = this.m_trs.getMatrix(false);
            matrix.transformVector3Self(DE.s_pos);
            DE.s_pos.subtractBy(DE.s_prePos);
            let gbounds = this.m_globalBounds;
            gbounds.min.addBy(DE.s_pos);
            gbounds.max.addBy(DE.s_pos);
            gbounds.center.addBy(DE.s_pos);
            ++this.m_globalBounds.version;
        }
    }
    update(): void {

        if (this.m_trs.updatedStatus > this.m_transStatus) this.m_transStatus = this.m_trs.updatedStatus;
        if (this.m_transStatus != ROTransform.UPDATE_NONE) {
            if (this.m_mesh != null && this.m_globalBounds != null) {
                this.updateGlobalBounds();
            }
            else {
                this.m_trs.update();
            }
            this.m_transStatus = ROTransform.UPDATE_NONE;
            this.m_trs.updatedStatus = this.m_transStatus;
        }
    }
    destroy(): void {
        // 当自身被完全移出RenderWorld之后才能执行自身的destroy
        //console.log("DisplayEntity::destroy(), renderer uid: "+this.getRendererUid()+", this.__$spaceId: "+this.__$spaceId);
        if (this.m_eventDispatcher != null) {
            this.m_eventDispatcher.destroy();
            this.m_eventDispatcher = null;
        }
        if (this.m_trs != null && this.isFree()) {
            // 这里要保证其在所有的process中都被移除
            if (this.m_display != null) {
                this.m_mesh.__$detachVBuf(this.m_display.vbuf);
                RODisplay.Restore(this.m_display);
                this.m_display = null;
            }
            ROTransform.Restore(this.m_trs as ROTransform);
            this.m_trs = null;
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
        this.m_globalBounds = null;
        this.m_localBounds = null;
        this.m_pipeLine = null;
    }
    toString(): string {
        return "DisplayEntity(name=" + this.name + ",uid = " + this.m_uid + ", rseFlag = " + this.__$rseFlag + ")";
    }
}
