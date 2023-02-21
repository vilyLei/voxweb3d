/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IGeometry from "../../../vox/mesh/IGeometry";
import IVector3D from "../../../vox/math/IVector3D";
import IMatrix4 from "../../../vox/math/IMatrix4";
import IAABB from "../../../vox/geom/IAABB";

export default class CoGeometry implements IGeometry {
    
    protected m_vs: Float32Array = null;
    protected m_uvs: Float32Array = null;
    protected m_nvs: Float32Array = null;
    protected m_ivs: Uint16Array | Uint32Array = null;

    vtxTotal: number = 0;
    trisNumber: number = 0;
    vtCount: number = 0;
    bounds: IAABB = null;
    /**
     * axisType = 0 is XOY plane,
     * axisType = 1 is XOZ plane,
     * axisType = 2 is YOZ plane
     */
    axisType = 0;

    constructor() { }

    clone(): CoGeometry {
        let geometry = new CoGeometry();        
        geometry.copyFrom( this );
        return geometry;
    }
    
    getCenterAt(i: number, outV: IVector3D): void {
    }
    
    transformAt(i: number, mat4: IMatrix4): void {
    }
    copyFrom(src: CoGeometry): void {
        
        let geometry = new CoGeometry();
        
        if(src.m_vs != null) {
            if(this.m_vs != null)
                this.m_vs.set(src.m_vs);
            else
                this.m_vs = src.m_vs.slice(0);
        }
        if(src.m_uvs != null) {
            if(this.m_uvs != null)
                this.m_uvs.set(src.m_uvs);
            else
                this.m_uvs = src.m_uvs.slice(0);
        }
        if(src.m_nvs != null) {
            if(this.m_nvs != null)
                this.m_nvs.set(src.m_nvs);
            else
                this.m_nvs = src.m_nvs.slice(0);
        }
        // if(src.m_tvs != null) {
        //     if(this.m_tvs != null)
        //         this.m_tvs.set(src.m_tvs);
        //     else
        //         this.m_tvs = src.m_tvs.slice(0);
        // }
        // if(src.m_btvs != null) {
        //     if(this.m_btvs != null)
        //         this.m_btvs.set(src.m_btvs);
        //     else
        //         this.m_btvs = src.m_btvs.slice(0);
        // }
        // if(src.m_cvs != null) {
        //     if(this.m_cvs != null)
        //         this.m_cvs.set(src.m_cvs);
        //     else
        //         this.m_cvs = src.m_cvs.slice(0);
        // }
        if(src.m_ivs != null) {
            if(this.m_ivs != null)
                this.m_ivs.set(src.m_ivs);
            else
                this.m_ivs = src.m_ivs.slice(0);
        }
        
        geometry.vtxTotal = this.vtxTotal;
        geometry.trisNumber = this.trisNumber;
        geometry.vtCount = this.vtCount;
        if(geometry.bounds != null) geometry.bounds.copyFrom( this. bounds );
    }
    /**
     * @returns vertex position buffer Float32Array
     */
    getVS(): Float32Array { return this.m_vs; }

    /**
     * @returns vertex uv buffer Float32Array
     */
    getUVS(): Float32Array { return this.m_uvs; }

    /**
     * @returns vertex normal buffer Float32Array
     */
    getNVS(): Float32Array { return this.m_nvs; }
    /**
     * @returns vertex tangent buffer Float32Array
     */
    getTVS(): Float32Array { return null; }
    /**
     * @returns vertex bitangent buffer Float32Array
     */
    getBTVS(): Float32Array { return null; }
    /**
     * @returns vertex color(r,g,b) buffer Float32Array
     */
    getCVS(): Float32Array { return null; }
    /**
     * @returns vertex indices buffer Uint16Array or Uint32Array
     */
    getIVS(): Uint16Array | Uint32Array { return this.m_ivs; }

    reset(): void {

        this.m_vs = null;
        this.m_uvs = null;
        this.m_nvs = null;
        // this.m_tvs = null;
        // this.m_btvs = null;
        this.m_ivs = null;

        this.vtxTotal = 0;
        this.trisNumber = 0;
        this.vtCount = 0;
    }
}