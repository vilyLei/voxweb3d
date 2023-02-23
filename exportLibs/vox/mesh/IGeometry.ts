/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IVector3D from "../../vox/math/IVector3D";
import IMatrix4 from "../../vox/math/IMatrix4";
import IAABB from "../../vox/geom/IAABB";

export default interface IGeometry {
    
    bounds: IAABB;
    vtxTotal: number;
    trisNumber: number;
    vtCount: number;
    /**
     * 0: vertical to x-axis, 1: vertical to y-axis, 2: vertical to z-axis, the default value is 0
     */
    axisType: number;

    clone(): IGeometry;
    
    copyFrom(src: IGeometry): void;
    
    getCenterAt(i: number, outV: IVector3D): void;
    
    transformAt(i: number, mat4: IMatrix4): void;
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
     * @returns vertex tangent buffer Float32Array
     */
    getTVS(): Float32Array;
    /**
     * @returns vertex bitangent buffer Float32Array
     */
    getBTVS(): Float32Array;
    /**
     * @returns vertex color(r,g,b) buffer Float32Array
     */
    getCVS(): Float32Array;
    /**
     * @returns vertex indices buffer Uint16Array or Uint32Array
     */
    getIVS(): Uint16Array | Uint32Array;

    reset(): void;
}