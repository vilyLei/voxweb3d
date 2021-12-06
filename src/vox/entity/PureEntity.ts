/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// 对于纯粹的逻辑对象来讲, 只会和逻辑操作相关(同步)，本质和渲染表现和逻辑可以做到分离
// 因此，这里所涉及到的主要是transform和一些逻辑行为
// 和其他渲染相关的沟通，则依赖对应的协议，对协议的解释，则最终决定呈现结果
// 一个此逻辑 PureEntity 对象可以对应一个或者多个 RODisplay, 包含对应的transform
// 可支持多线程模式(主要支持多线程模式的纯粹的被渲染器接受的渲染对象)，也可支持单线程模式, 此实例不允许加入容器

import RSEntityFlag from '../../vox/scene/RSEntityFlag';
import Vector3D from "../../vox/math/Vector3D";
import Matrix4 from "../../vox/math/Matrix4";
import Matrix4Pool from "../../vox/math/Matrix4Pool";
import AABB from "../../vox/geom/AABB";
import { SpaceCullingMask } from "../../vox/space/SpaceCullingMask";
import MouseEvent from "../../vox/event/MouseEvent";
import IEvtDispatcher from "../../vox/event/IEvtDispatcher";
import RendererState from "../../vox/render/RendererState";
import MeshBase from "../../vox/mesh/MeshBase";
import MaterialBase from "../../vox/material/MaterialBase";
import IRODisplay from "../../vox/display/IRODisplay";
import RODisplay from "../../vox/display/RODisplay";
import IRenderEntity from "../../vox/render/IRenderEntity";
import IDisplayEntity from "../../vox/entity/IDisplayEntity";

import RenderProxy from "../../vox/render/RenderProxy";
import TextureProxy from '../../vox/texture/TextureProxy';
import ROTransPool from '../../vox/render/ROTransPool';
import IRenderEntityContainer from "../../vox/render/IRenderEntityContainer";


// for multi threads
export default class PureEntity implements IRenderEntity, IDisplayEntity {
    private static s_uid: number = 0;
    private m_uid: number = 0;
    protected m_mouseEvtDispatcher: IEvtDispatcher = null;
    private m_matChanged: boolean = true;
    // local to world spcae matrix
    private m_omat: Matrix4 = null;
    // word to local matrix
    private m_invOmat: Matrix4 = null;
    constructor() {
        this.m_uid = PureEntity.s_uid++;
    }
    private m_visible: boolean = true;
    private m_drawEnabled: boolean = true;
    private m_rcolorMask: number = RendererState.COLOR_MASK_ALL_TRUE;
    private m_renderState: number = RendererState.BACK_CULLFACE_NORMAL_STATE;
    private m_display: RODisplay = null;
    protected m_mesh: MeshBase = null;
    protected m_renderProxy: RenderProxy = null;
    // 如果一个entity如果包含了多个mesh,则这个bounds就是多个mesh aabb 合并的aabb
    protected m_globalBounds: AABB = null;

    /**
     * renderer scene entity flag, be used by the renderer system
     * 第0位到第19位总共20位存放自身在space中的 index id(最小值为1, 最大值为1048575,默认值是0, 也就是最多只能展示1048575个entitys),
     * 第20位开始到26位为总共7位止存放在renderer中的状态数据(renderer unique id and others)
     * 第27位存放是否在container里面
     * 第28位开始到29位总共二位存放renderer 载入状态 的相关信息
     * 第30位位存放是否渲染运行时排序
     */
    __$rseFlag: number = RSEntityFlag.DEFAULT;

    name: string = "PureEntity";
    // 可见性裁剪是否开启, 如果不开启，则摄像机和遮挡剔除都不会裁剪, 取值于 SpaceCullingMask, 默认只会有摄像机裁剪
    spaceCullMask: SpaceCullingMask = SpaceCullingMask.CAMERA;
    // recorde a draw status
    drawEnabled: boolean = false;
    // mouse interaction enabled
    mouseEnabled: boolean = false;
    //
    vbWholeDataEnabled: boolean = true;

    __$setRenderProxy(rc: RenderProxy): void {
        this.m_renderProxy = rc;
    }
    protected createBounds(): void {
        this.m_globalBounds = new AABB();
    }
    __$testSpaceEnabled(): boolean {
        return RSEntityFlag.TestSpaceEnabled2(this.__$rseFlag);
    }
    __$testContainerEnabled(): boolean {
        return RSEntityFlag.TestContainerEnabled(this.__$rseFlag);
    }
    __$testRendererEnabled(): boolean {
        return RSEntityFlag.TestRendererEnabled(this.__$rseFlag);
    }
    __$getParent(): IRenderEntityContainer {
        return null;
    }
    getRendererUid(): number {
        return RSEntityFlag.GetRendererUid(this.__$rseFlag);
    }
    /**
     * @returns 自身是否未必被任何渲染器相关的系统使用
     */
    isFree(): boolean {
        return this.__$rseFlag == RSEntityFlag.DEFAULT;
    }
    dispatchEvt(evt: any): number {
        if (this.m_mouseEvtDispatcher != null) {
            return this.m_mouseEvtDispatcher.dispatchEvt(evt);
        }
        return 0;
    }
    getEvtDispatcher(evtClassType: number): IEvtDispatcher {
        return this.m_mouseEvtDispatcher;
    }
    setEvtDispatcher(evtDisptacher: IEvtDispatcher): void {
        this.m_mouseEvtDispatcher = evtDisptacher;
    }
    getPosition(resultPos: Vector3D):void {
        if (this.m_globalBounds != null) {
            resultPos.copyFrom( this.m_globalBounds.center );
        }
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
            //  console.log("PureEntity::__$setDrawEnabled: "+boo);
            //  if(!this.m_drawEnabled)
            //  {
            //      console.log("PureEntity::__$setDrawEnabled A: "+boo);
            //  }
            this.m_drawEnabled = boo;
            if (this.m_display != null) {
                this.m_display.visible = this.m_visible && boo;
                if (this.m_display.__$ruid > -1) {
                    this.m_display.__$$runit.setVisible(this.m_display.visible);
                }
            }
        }
    }
    isDrawEnabled(): boolean {
        return this.m_drawEnabled;
    }
    // update material texture list
    protected m_texChanged: boolean = false;

    protected m_meshChanged: boolean = false;
    /**
     * users need to call this function manually
     * 更新有两种形式, 1: 只是更改资源内部的数据, 2: 替换资源本身
     * 更新过程可以通过DisplayEntity对象来控制，也可以通过资源本身来控制
     */
    updateMeshToGpu(rc: RenderProxy, deferred: boolean = true): void {
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
    updateMaterialToGpu(rc: RenderProxy, deferred: boolean = true): void {
        if (rc != null) this.m_renderProxy = rc;
        if (this.m_renderProxy != null && this.m_display != null && this.m_display.__$ruid > -1) {
            if (this.m_texChanged) {
                this.m_texChanged = false;
                this.m_renderProxy.MaterialUpdater.updateDispTRO(this.m_display, deferred);
            }
        }
    }
    updateTextureList(texList: TextureProxy[]): void {
        if (this.m_display != null && this.m_display.__$ruid > -1) {
            if (this.m_display.getMaterial() != null) {
                this.m_display.getMaterial().setTextureList(texList);
                this.m_texChanged = true;
            }
        }
    }
    updateTextureAt(index: number, tex: TextureProxy): void {
        if (this.m_display != null && this.m_display.__$ruid > -1) {
            if (this.m_display.getMaterial() != null) {
                this.m_display.getMaterial().setTextureAt(index, tex);
                this.m_texChanged = true;
            }
        }

    }
    setVisible(boo: boolean): void {
        if (this.m_visible != boo) {
            this.m_visible = boo;
            if (this.m_display != null) {
                this.m_display.visible = boo && this.m_drawEnabled;
                if (this.m_display.__$ruid > -1) {
                    this.m_display.__$$runit.setVisible(this.m_display.visible);
                }
            }
        }
    }
    getVisible(): boolean {
        return this.m_visible;
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
                        if (this.m_omat == null) {
                            this.m_omat = Matrix4Pool.GetMatrix();
                        }
                        this.m_display.setTransform(this.m_omat);

                        this.initDisplay(m);
                    }
                    //console.log("DisplayEntity::setMesh(), "+this.m_display.toString()+",m.drawMode: "+m.drawMode);
                    if (this.m_globalBounds != null) {
                        this.m_globalBounds.copyFrom(m.bounds);
                    }
                }
            }
        }
        else if (this.m_display != null && this.m_display.__$ruid > -1) {
            if (this.m_mesh != m && m != null) {
                //this.m_transfrom.updatedStatus |= 2;
                this.m_mesh.__$detachVBuf(this.m_display.vbuf);
                this.m_mesh.__$detachThis();
                m.__$attachThis();
                this.m_mesh = m;

                this.initDisplay(m);

                this.m_meshChanged = true;
            }
        }
    }
    setIvsParam(ivsIndex: number, ivsCount: number): void {
        if (this.m_display != null) {
            this.m_display.ivsIndex = ivsIndex;
            this.m_display.ivsCount = ivsCount;
            if (this.m_display.__$ruid > -1) {
                this.m_display.__$$runit.setIvsParam(ivsIndex, ivsCount);
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
     * @return 返回true是则表示这是基于三角面的可渲染多面体, 返回false则是一个数学方程描述的几何体(例如球体)
     */
    isPolyhedral(): boolean {
        return this.m_mesh.isPolyhedral();
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
                this.createDisplay();
                if (this.m_omat == null) {
                    this.m_omat = Matrix4Pool.GetMatrix();
                }
                if (this.m_display == null) {
                    this.m_display.setTransform(this.m_omat);
                    this.m_display.visible = this.m_visible && this.m_drawEnabled;
                }
            }
            if (this.m_display != null) {
                if (this.m_display.getMaterial() != m && (RSEntityFlag.RENDERER_UID_FLAG & this.__$rseFlag) == RSEntityFlag.RENDERER_UID_FLAG && this.m_display.__$ruid < 0) {
                    this.m_display.renderState = this.m_renderState;
                    this.m_display.rcolorMask = this.m_rcolorMask;
                    this.m_display.setMaterial(m);
                }
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
        if (this.m_invOmat != null) {
            if (this.m_matChanged) {
                this.m_invOmat.copyFrom(this.m_invOmat);
                this.m_invOmat.invert();
                this.m_matChanged = false;
            }
        }
        this.m_invOmat = Matrix4Pool.GetMatrix();
        this.m_invOmat.copyFrom(this.m_invOmat);
        this.m_invOmat.invert();
        this.m_matChanged = false;
        return this.m_invOmat;
    }
    getMatrix(): Matrix4 {
        return this.m_omat;
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
            if (material != null && material.getShaderData() == null) {
                if (material.getCodeBuf() != null) {
                    if (material.getShaderData() == null) {
                        let texList: TextureProxy[] = material.getTextureList();
                        let texEnabled: boolean = (texList != null && texList.length > 0);
                        material.initializeByCodeBuf(texEnabled);
                    }
                    this.__activeMesh(material);
                }
            }
        }
    }
    // for sub class override
    protected __activeMesh(material: MaterialBase): void {
    }
    getUid(): number { return this.m_uid; }

    destroy(): void {
        // 当自身被完全移出RenderWorld之后才能执行自身的destroy
        if (this.m_mouseEvtDispatcher != null) {
            this.m_mouseEvtDispatcher.destroy();
            this.m_mouseEvtDispatcher = null;
        }
        if (this.m_omat != null && this.isFree()) {
            // 这里要保证其在所有的process中都被移除
            if (this.m_display != null) {
                this.m_mesh.__$detachVBuf(this.m_display.vbuf);
                RODisplay.Restore(this.m_display);
                this.m_display = null;
            }
            if (this.m_mesh != null) {
                this.m_mesh.__$detachThis();
                this.m_mesh = null;
            }
            if (this.m_invOmat != null) Matrix4Pool.RetrieveMatrix(this.m_invOmat);
            if (this.m_omat != null) {
                ROTransPool.RemoveTransUniform(this.m_omat);
                Matrix4Pool.RetrieveMatrix(this.m_omat);
            }
            this.m_visible = true;
            this.m_drawEnabled = true;
            this.m_renderProxy = null;
            this.__$rseFlag = RSEntityFlag.DEFAULT;
        }
    }
    isInRenderer(): boolean {
        return (this.__$rseFlag & RSEntityFlag.RENDERER_UID_FLAG) != RSEntityFlag.RENDERER_UID_FLAG;
    }
    isRenderEnabled(): boolean {
        return this.m_display != null && this.m_display.__$rpuid > -1;
    }
    updateBounds(): void {
    }
    updateMatrix(): void {
        this.m_matChanged = true;
    }
    update(): void {
        //  if(this.m_display != null && this.m_display.__$$runit != null)
        //  {
        //      this.m_display.__$$runit.bounds = this.m_globalBounds;
        //      //this.m_transfrom.getPosition(this.m_display.__$$runit.pos);
        //  }
    }
    toString(): string {
        return "PureEntity(name=" + this.name + ",uid = " + this.m_uid + ", rseFlag = " + this.__$rseFlag + ")";
    }
}