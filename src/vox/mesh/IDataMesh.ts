/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import AABB from "../geom/AABB";
import { IVtxBufRenderData } from "../../vox/render/IVtxBufRenderData";
import { IMeshBase } from "../../vox/mesh/IMeshBase";

interface IDataMesh extends IMeshBase {
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
     * set vertex uv data
     * @param vs vertex uv buffer Float32Array
     */
    setUVS(uvs: Float32Array): void;
    /**
     * set vertex normal data
     * @param vs vertex normal buffer Float32Array
     */
    setNVS(nvs: Float32Array): void;
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
        
    /**
     * initialization vertex buffer data
     */
    initialize(): void;

}
export { IDataMesh }