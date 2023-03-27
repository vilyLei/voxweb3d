/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IVector3D from "../../vox/math/IVector3D";
// import { SpaceCullingMask } from "../../vox/space/SpaceCullingMask";
import IRenderMaterial from "../../vox/render/IRenderMaterial";
import IRenderProxy from "../../vox/render/IRenderProxy";
import IEvtDispatcher from "../../vox/event/IEvtDispatcher";
import IRODisplay from "../../vox/display/IRODisplay";
import IRenderEntityContainer from "../../vox/render/IRenderEntityContainer";
import IMeshBase from "../mesh/IMeshBase";
import IRenderEntityBase from "./IRenderEntityBase";

/**
 * to be used in the renderer runtime
 */
export default interface IRenderEntity extends IRenderEntityBase {

    __$setRenderProxy(rc: IRenderProxy): void;
    __$getParent(): IRenderEntityContainer;
    __$testSpaceEnabled(): boolean;
    __$testContainerEnabled(): boolean;
    __$testRendererEnabled(): boolean;

    getRendererUid(): number;
    /**
     * @returns 自身是否未被任何渲染器相关的系统使用
     */
    isFree(): boolean;
    dispatchEvt(evt: any): number;
    getEvtDispatcher(evtClassType: number): IEvtDispatcher;

    getRenderState(): number;
    setRenderState(renderState: number): IRenderEntity;

    /**
     * @boundsHit       表示是否包围盒体已经和射线相交了
     * @rlpv            表示物体坐标空间的射线起点
     * @rltv            表示物体坐标空间的射线朝向
     * @outV            如果检测相交存放物体坐标空间的交点
     * @return          返回值 -1 表示不会进行检测,1表示相交,0表示不相交
     */
    testRay(rlpv: IVector3D, rltv: IVector3D, outV: IVector3D, boundsHit: boolean): number;
    /**
     * @return 返回true表示包含有mesh对象,反之则没有
     */
    hasMesh(): boolean;
    /**
     * @return 返回true是则表示这是基于三角面的可渲染多面体, 返回false则是一个数学方程描述的几何体(例如球体)
     */
    isPolyhedral(): boolean;
    /**
     * @param rc the default value is null
     * @param deferred the default value is true
     */
    updateMeshToGpu(rc?: IRenderProxy, deferred?: boolean): void;
    /**
     * @param rc the default value is null
     * @param deferred the default value is true
     */
    updateMaterialToGpu(rc?: IRenderProxy, deferred?: boolean): void;

    setXYZ(px: number, py: number, pz: number): IRenderEntity;
    /**
     * @param resultPos the default value is null
     */
    getPosition(resultPos?: IVector3D): IVector3D;
    setPosition(pos: IVector3D): IRenderEntity;
    /**
     * @param pv the default value is null
     */
    getPosition(pv?: IVector3D): IVector3D;
    setRotationXYZ(rx: number, ry: number, rz: number): IRenderEntity;
    setRotation3(rv: IVector3D): IRenderEntity;
    setScaleXYZ(sx: number, sy: number, sz: number): IRenderEntity;
    setScale3(sv: IVector3D): IRenderEntity;

    /**
     * @param sv the default value is null
     */
    getScaleXYZ(sv?: IVector3D): IVector3D;
    /**
     * @param rv the default value is null
     */
    getRotationXYZ(rv?: IVector3D): IVector3D;

    copyPositionFrom(entity: IRenderEntity): IRenderEntity;
    copyMeshFrom(entity: IRenderEntity): IRenderEntity;
    copyMaterialFrom(entity: IRenderEntity): IRenderEntity;
    copyTransformFrom(entity: IRenderEntity): IRenderEntity;

    setMesh(material: IMeshBase): IRenderEntity;
    getMesh(): IMeshBase;
    setMaterial(material: IRenderMaterial): IRenderEntity;
    getMaterial(): IRenderMaterial;
    getDisplay(): IRODisplay;
    activeDisplay(): void;

    /**
     * @returns 是否已经加入渲染器中(但是可能还没有进入真正的渲染运行时)
     */
    isInRenderer(): boolean;
    /**
     * @returns 是否在渲染器渲染过程中
     */
    isInRendererProcess(): boolean;
    /**
     * @returns 是否能被渲染
     */
    isRenderEnabled(): boolean;

    updateBounds(): void;

}
