/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import SurfaceNormalCalc from "../../../vox/geom/SurfaceNormalCalc";
import VtxBufConst from "../../../vox/mesh/VtxBufConst";
import ROVertexBuffer from "../../../vox/mesh/ROVertexBuffer";
import AABB from "../../../vox/geom/AABB";
import MeshBase from "../../../vox/mesh/MeshBase";
import ObjDataParser from "../../../vox/mesh/obj/ObjDataParser";

export default class ObjData3DMesh extends MeshBase
{
    constructor(bufDataUsage:number = VtxBufConst.VTX_STATIC_DRAW)
    {
        super(bufDataUsage);
    }
    moduleScale:number = 1.0;
    private m_vs:Float32Array = null;
    private m_uvs:Float32Array = null;
    private m_nvs:Float32Array = null;
    //
    getVS():Float32Array{return this.m_vs;}
    getUVS():Float32Array{return this.m_uvs;}
    getNVS():Float32Array{return this.m_nvs;}

    private m_parser:ObjDataParser = new ObjDataParser();
    initialize(objDataStr:string,dataIsZxy:boolean = false):void
    {
        this.m_parser.parseStrData(objDataStr, this.moduleScale, dataIsZxy);

        this.m_vs = new Float32Array( this.m_parser.getVS() );
        this.m_uvs = new Float32Array( this.m_parser.getUVS() );
        this.m_ivs = new Uint16Array( this.m_parser.getIVS() );
        
        this.bounds = new AABB();
        this.bounds.addXYZFloat32Arr(this.m_vs);
        this.bounds.update();
        this.vtxTotal = this.m_vs.length / 3;
        
        ROVertexBuffer.Reset();
        ROVertexBuffer.AddFloat32Data(this.m_vs,3);
        if (this.isVBufEnabledAt(VtxBufConst.VBUF_UVS_INDEX))
        {
            ROVertexBuffer.AddFloat32Data(this.m_uvs,2);
        }
        if (this.isVBufEnabledAt(VtxBufConst.VBUF_NVS_INDEX))
        {
            this.m_nvs = new Float32Array(this.m_parser.getNVS());
            ROVertexBuffer.AddFloat32Data(this.m_nvs,3);
        }
        if (this.isVBufEnabledAt(VtxBufConst.VBUF_TVS_INDEX))
        {
            //trace("m_vs: "+m_vs);
            //trace("m_uvs: "+m_uvs);
            //trace("m_nvs: "+m_nvs);
            let numTriangles:number = this.m_ivs.length / 3;
            let tvs:Float32Array = new Float32Array(this.m_vs.length);
            let btvs:Float32Array = new Float32Array(this.m_vs.length);
            SurfaceNormalCalc.ClacTrisTangent(this.m_vs, this.m_vs.length, this.m_uvs, this.m_nvs, numTriangles, this.m_ivs, tvs, btvs);
            //trace("tvs: "+tvs);
            //trace("btvs: "+btvs);
            ROVertexBuffer.AddFloat32Data(tvs,3);
            ROVertexBuffer.AddFloat32Data(btvs,3);
        }
        ROVertexBuffer.vbWholeDataEnabled = this.vbWholeDataEnabled;
        this.m_vbuf = ROVertexBuffer.CreateBySaveData();
        this.m_vbuf.setUint16IVSData(this.m_ivs);
        this.vtCount = this.m_ivs.length;

        this.buildEnd();
    }
    toString():string
    {
        return "ObjData3DMesh()";
    }
    __$destroy():void
    {
        if(this.isResFree())
        {
            this.bounds = null;
        
            this.m_vs = null;
            this.m_uvs = null;
            this.m_nvs = null;
            super.__$destroy();
        }
    }
}