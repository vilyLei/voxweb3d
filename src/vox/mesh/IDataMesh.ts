/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import AABB from "../geom/AABB";
import { IVtxBufRenderData } from "../../vox/render/IVtxBufRenderData";

interface IDataMesh {
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
     * the default value is 3
     */
    vsStride: number;
    /**
     * the default value is 2
     */
    uvsStride: number;
    /**
     * the default value is 3
     */
    nvsStride: number;
    /**
     * the default value is 3
     */
    cvsStride: number;

    /**
     * set vertex position data
     * @param vs vertex position buffer Float32Array
     */
    setVS(vs: Float32Array): void;
    /**
     * @returns vertex position buffer Float32Array
     */
    getVS(): Float32Array;
    /**
     * set vertex uv data
     * @param vs vertex uv buffer Float32Array
     */
    setUVS(uvs: Float32Array): void;
    /**
     * @returns vertex uv buffer Float32Array
     */
    getUVS(): Float32Array;
    /**
     * set vertex normal data
     * @param vs vertex normal buffer Float32Array
     */
    setNVS(nvs: Float32Array): void;
    /**
     * @returns vertex normal buffer Float32Array
     */
    getNVS(): Float32Array;
    /**
     * set vertex tangent data
     * @param vs vertex tangent buffer Float32Array
     */
    setTVS(tvs: Float32Array): void;
    /**
     * @returns vertex tangent buffer Float32Array
     */
    getTVS(): Float32Array;

    /**
     * set vertex bitangent data
     * @param vs vertex bitangent buffer Float32Array
     */
    setBTVS(btvs: Float32Array): void
    /**
     * set vertex color(r,g,b) data
     * @param vs vertex color(r,g,b) buffer Float32Array
     */
    setCVS(cvs: Float32Array): void
    /**
     * @returns vertex bitangent buffer Float32Array
     */
    getBTVS(): Float32Array;

    /**
     * @param ivs indices buffer data
     */
    setIVS(ivs: Uint16Array | Uint32Array): void;

    setVtxBufRenderData(vtxData: IVtxBufRenderData): void;
    // initializeFromGeometry(geom: GeometryBase): void;
    /**
     * initialization vertex buffer data
     */
    initialize(): void;

    /**
     * 射线和自身的相交检测(多面体或几何函数(例如球体))
     * @boundsHit       表示是否包围盒体已经和射线相交了
     * @rlpv            表示物体坐标空间的射线起点
     * @rltv            表示物体坐标空间的射线朝向
     * @outV            如果检测相交存放物体坐标空间的交点
     * @return          返回值 -1 表示不会进行检测,1表示相交,0表示不相交
     */
    // testRay(rlpv: Vector3D, rltv: Vector3D, outV: Vector3D, boundsHit: boolean): number;
    isEnabled(): boolean;
    isResFree(): boolean;
}
export { IDataMesh }