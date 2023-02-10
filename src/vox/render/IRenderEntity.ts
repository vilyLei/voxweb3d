/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IVector3D from "../../vox/math/IVector3D";
import IMatrix4 from "../../vox/math/IMatrix4";
import IAABB from "../../vox/geom/IAABB";
// import { SpaceCullingMask } from "../../vox/space/SpaceCullingMask";
import IRenderMaterial from "../../vox/render/IRenderMaterial";
import IRenderProxy from "../../vox/render/IRenderProxy";
import IEvtDispatcher from "../../vox/event/IEvtDispatcher";
import IRODisplay from "../../vox/display/IRODisplay";
import IRenderEntityContainer from "../../vox/render/IRenderEntityContainer";
import IMeshBase from "../mesh/IMeshBase";

/**
 * to be used in the renderer runtime
 */
export default interface IRenderEntity {
  __$setRenderProxy(rc: IRenderProxy): void;
  /**
   * renderer scene entity flag, be used by the renderer system
   * 第0位到第19位总共20位存放自身在space中的 index id(最小值为1, 最大值为1048575,默认值是0, 也就是最多只能展示1048575个entitys),
   * 第20位开始到26位为总共7位止存放在renderer中的状态数据(renderer unique id and others)
   * 第27位存放是否在container里面
   * 第28位开始到29位总共二位存放renderer 载入状态 的相关信息
   * 第30位位存放是否渲染运行时排序
   */
  __$rseFlag: number;
  /**
   * 可见性裁剪是否开启, 如果不开启，则摄像机和遮挡剔除都不会裁剪, 取值于 SpaceCullingMask, 默认只会有摄像机裁剪
   * the default value is SpaceCullingMask.CAMERA
   */
  spaceCullMask: number;

  /**
   * recorde a draw status, the default value is false
   */
  drawEnabled: boolean;
  /**
   * mouse interaction enabled, the default value is false
   */
  mouseEnabled: boolean;
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
  getPosition(resultPos: IVector3D): IVector3D;
  getGlobalBounds(): IAABB;
  getLocalBounds(): IAABB;

  /**
   * @return 返回true表示当前DisplayEntity能被绘制
   */
  isDrawEnabled(): boolean;
  setVisible(boo: boolean): void;
  getVisible(): boolean;
  getRenderState(): number;
  setRenderState(renderState: number): void;

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

  setXYZ(px: number, py: number, pz: number): void;
  setPosition(pos: IVector3D): void;
  getPosition(resultPos: IVector3D): void;
  setRotationXYZ(rx: number, ry: number, rz: number): void;
  setRotation3(rv: IVector3D): void;
  setScaleXYZ(sx: number, sy: number, sz: number): void;
  setScale3(sv: IVector3D): void;
  getScaleXYZ(pv: IVector3D): void;
  getRotationXYZ(pv: IVector3D): void;

  copyPositionFrom(entity: IRenderEntity): void;
  copyMeshFrom(entity: IRenderEntity): void;
  copyMaterialFrom(entity: IRenderEntity): void;
  copyTransformFrom(entity: IRenderEntity): void;

  setMesh(material: IMeshBase): void;
  getMesh(): IMeshBase;
  setMaterial(material: IRenderMaterial): void;
  getMaterial(): IRenderMaterial;
  getDisplay(): IRODisplay;
  getInvMatrix(): IMatrix4;
  getMatrix(): IMatrix4;
  activeDisplay(): void;

  getUid(): number;
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
  update(): void;
  destroy(): void;
}
