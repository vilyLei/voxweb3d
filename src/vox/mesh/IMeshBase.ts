/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import AABB from "../geom/AABB";
import { IVtxBufRenderData } from "../../vox/render/IVtxBufRenderData";
import Vector3D from "../math/Vector3D";
import { IROVertexBuffer } from "../../vox/mesh/IROVertexBuffer";

interface IMeshBase {
  /**
    * 强制更新 vertex indices buffer 数据, 默认值为false
    */
  forceUpdateIVS: boolean;
  /**
   * 是否启用线框模式数据, 默认值为false
   */
  wireframe: boolean;
  /**
   * vtx positons bounds AABB in the local space, the default value is null
   */
  bounds: AABB;
  /**
   * @param layoutBit vertex shader vertex attributes layout bit status.
   *                  the value of layoutBit comes from the material shdder program.
   */
  setBufSortFormat(layoutBit: number): void;
  getBufSortFormat(): number
  getAttachCount(): number;
  __$attachThis(): void;
  __$detachThis(): void;
  __$attachVBuf(): IROVertexBuffer;
  __$detachVBuf(vbuf: IROVertexBuffer): void;
  /**
   * @returns vertex position buffer Float32Array
   */
  getVS(): Float32Array;

  /**
   * @returns vertex uv buffer Float32Array
   */
  getUVS(): Float32Array;

  /**
   * @returns vertex normal buffer Float32Array
   */
  getNVS(): Float32Array;
  /**
   * @returns vertex vtx color(r,g,b) buffer Float32Array
   */
  getCVS(): Float32Array;

  /**
   * @returns vertex indices buffer Uint16Array or Uint32Array
   */
  getIVS(): Uint16Array | Uint32Array;

  setVtxBufRenderData(vtxData: IVtxBufRenderData): void;
  // initializeFromGeometry(geom: GeometryBase): void;

  /**
   * 射线和自身的相交检测(多面体或几何函数(例如球体))
   * @boundsHit       表示是否包围盒体已经和射线相交了
   * @rlpv            表示物体坐标空间的射线起点
   * @rltv            表示物体坐标空间的射线朝向
   * @outV            如果检测相交存放物体坐标空间的交点
   * @return          返回值 -1 表示不会进行检测,1表示相交,0表示不相交
   */
  testRay(rlpv: Vector3D, rltv: Vector3D, outV: Vector3D, boundsHit: boolean): number;
  isEnabled(): boolean;
  isResFree(): boolean;
  isPolyhedral(): boolean;
}
export { IMeshBase }