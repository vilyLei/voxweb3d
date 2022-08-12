/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IAABB from "../../vox/geom/IAABB";

export default interface IGeometry {
    
    bounds: IAABB;
    vtxTotal: number;
    trisNumber: number;
    vtCount: number;


    clone(): IGeometry;
    
    copyFrom(src: IGeometry): void;
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