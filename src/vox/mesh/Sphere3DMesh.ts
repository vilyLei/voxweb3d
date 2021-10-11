/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
import Vector3D from "../../vox/math/Vector3D";
import RadialLine from "../../vox/geom/RadialLine";
import AABB from "../../vox/geom/AABB";
import SurfaceNormalCalc from "../../vox/geom/SurfaceNormalCalc";
import VtxBufConst from "../../vox/mesh/VtxBufConst";
import ROVertexBuffer from "../../vox/mesh/ROVertexBuffer";
import MeshVertex from "../../vox/mesh/MeshVertex"
import MeshBase from "../../vox/mesh/MeshBase"
export default class Sphere3DMesh extends MeshBase
{
    constructor(bufDataUsage:number = VtxBufConst.VTX_STATIC_DRAW)
    {
        super(bufDataUsage);
    }
    private m_longitudeNumSegments:number = 10;
    private m_latitudeNumSegments:number = 10;	
    private m_radius:number = 50;
    private m_vs:Float32Array = null;
    private m_uvs:Float32Array = null;
    private m_nvs:Float32Array = null;
    private m_cvs:Float32Array = null;
    inverseUV:boolean = false;
        
    getVS():Float32Array{return this.m_vs;}
    getUVS():Float32Array{return this.m_uvs;}
    getNVS():Float32Array{return this.m_nvs;}
    getCVS():Float32Array{return this.m_cvs;}
    getIVS():Uint16Array | Uint32Array{return this.m_ivs;}
    
    //
    initialize(radius:number, longitudeNumSegments:number, latitudeNumSegments:number,doubleTriFaceEnabled:boolean):void 
    {
        if (this.vtxTotal < 1)
        {
            if (radius < 0.01)return;
            
            this.bounds = new AABB();
            this.bounds.min.setXYZ(-radius,-radius,-radius);
            this.bounds.max.setXYZ(radius,radius,radius);
            this.bounds.updateFast();
            if (longitudeNumSegments < 2) longitudeNumSegments = 2;
            if (latitudeNumSegments < 2) latitudeNumSegments = 2;
            this.m_radius = Math.abs(radius);
            this.m_longitudeNumSegments = longitudeNumSegments;
            this.m_latitudeNumSegments = latitudeNumSegments;
        
            if ((this.m_latitudeNumSegments+1) % 2 == 0)
            {
                this.m_latitudeNumSegments += 1;
            }						
            if(this.m_longitudeNumSegments = this.m_latitudeNumSegments)
            {
                this.m_longitudeNumSegments += 1;
            }

            let i:number = 1,j = 0,trisTot = 0;
            let yRad:number = 0.0, px = 0.0, py = 0.0;
            let vtx:MeshVertex = new MeshVertex(0, -this.m_radius, 0, trisTot);
        
            // 计算绕 y轴 的纬度线上的点
            let vtxVec = [];
            let vtxRows:MeshVertex[][] = [];
            vtxRows.push( [] );
            let vtxRow:MeshVertex[] = vtxRows[0];
            vtx.u = 0.5; vtx.v = 0.5;
            vtx.nx = 0.0; vtx.ny = -1.0; vtx.nz = 0.0;
            vtxRow.push(vtx.cloneVertex());
            vtxVec.push(vtxRow[0]);
            //
            let pr:number = 0.0
            let pr2:number = this.m_radius * 2.01;
            let py2:number = 0.0;
            let f:number = 1.0 / this.m_radius;
            //float pz;
            for (; i < this.m_latitudeNumSegments; ++i)
            {
                yRad = (Math.PI * i) / this.m_latitudeNumSegments;
                px = Math.sin(yRad);
                py = Math.cos(yRad);
                vtx.y = -this.m_radius * py;
                pr = this.m_radius * px;
                //
                py2 = vtx.y;
                if (py2 < 0) py2 = -py2;
                // uv inverse yes or no
                if(!this.inverseUV) py2 = this.m_radius - py2;
                py2 /= pr2;
                //
                vtxRows.push([]);
                let row = vtxRows[i];
                for (j = 0; j < this.m_longitudeNumSegments; ++j) {
                    yRad = (Math.PI * 2 * j) / this.m_longitudeNumSegments;
                    ++trisTot;
                    px = Math.sin(yRad);
                    py = Math.cos(yRad);
                    vtx.x = px * pr;
                    vtx.z = py * pr;
                    vtx.index = trisTot;
                    // calc uv
                    px *= py2;
                    py *= py2;
                    vtx.u = 0.5 + px;
                    vtx.v = 0.5 + py;
                    //
                    vtx.nx = vtx.x * f; vtx.ny = vtx.y * f; vtx.nz = vtx.z * f;
                    //
                    row.push(vtx.cloneVertex());
                    vtxVec.push(row[j]);
                }
                row.push(row[0]);
            }
            ++trisTot;
            vtx.index = trisTot;
            vtx.x = 0; vtx.y = this.m_radius; vtx.z = 0;
            vtx.u = 0.5; vtx.v = 0.5;
            vtx.nx = 0.0; vtx.ny = 1.0; vtx.nz = 0.0;
            vtxRows.push([]);
            let lastRow = vtxRows[this.m_latitudeNumSegments];
            lastRow.push(vtx.cloneVertex());
            vtxVec.push(lastRow[0]);

            let pvtx:MeshVertex = null;
            ///////////////////////////   ///////////////////////////    ////////////////
            let pivs:number[] = [];

            let rowa = null;
            let rowb = null;
            i = 1;
            for (; i <= this.m_latitudeNumSegments; ++i)
            {
                rowa = vtxRows[i-1];
                rowb = vtxRows[i];
                for (j = 1; j <= this.m_longitudeNumSegments; ++j)
                {
                    if (i == 1)
                    {
                        pivs.push(rowa[0].index); pivs.push(rowb[j].index); pivs.push(rowb[j - 1].index);
                    }
                    else if(i == this.m_latitudeNumSegments)
                    {
                        pivs.push(rowa[j].index); pivs.push(rowb[0].index); pivs.push(rowa[j - 1].index);
                    }
                    else
                    {
                        pivs.push(rowa[j].index); pivs.push(rowb[j - 1].index); pivs.push(rowa[j - 1].index);
                        pivs.push(rowa[j].index); pivs.push(rowb[j].index); pivs.push(rowb[j - 1].index);
                    }
                }
            }
            this.vtxTotal = vtxVec.length;
            if(doubleTriFaceEnabled)
            {
                this.m_ivs = new Uint16Array(pivs.length * 2);
                this.m_ivs.set(pivs,0);
                pivs.reverse();
                this.m_ivs.set(pivs,pivs.length);
            }
            else
            {
                this.m_ivs = new Uint16Array(pivs);
            }
            this.m_vs = new Float32Array(this.vtxTotal * 3);
            i = 0;
            for (j = 0; j < this.vtxTotal; ++j)
            {
                pvtx = vtxVec[j];
                this.m_vs[i] = pvtx.x; this.m_vs[i + 1] = pvtx.y; this.m_vs[i + 2] = pvtx.z;
                i += 3;
            }
            ROVertexBuffer.Reset();
            ROVertexBuffer.AddFloat32Data(this.m_vs,3);
            //
            if (this.isVBufEnabledAt(VtxBufConst.VBUF_UVS_INDEX))
            {
                // uv
                this.m_uvs = new Float32Array(this.vtxTotal * 2);
                //
                i = 0;
                for (j = 0; j < this.vtxTotal; ++j)
                {
                    pvtx = vtxVec[j];
                    //trace(tri.index0, ",", tri.index1, ",", tri.index2);
                    this.m_uvs[i] = pvtx.u; this.m_uvs[i + 1] = pvtx.v;
                    i += 2;
                }
                ROVertexBuffer.AddFloat32Data(this.m_uvs,2);
            }
            if (this.isVBufEnabledAt(VtxBufConst.VBUF_NVS_INDEX))
            {
                this.m_nvs = new Float32Array(this.vtxTotal * 3);
                //
                i = 0;
                for (j = 0; j < this.vtxTotal; ++j)
                {
                    pvtx = vtxVec[j];
                    this.m_nvs[i] = pvtx.nx; this.m_nvs[i + 1] = pvtx.ny; this.m_nvs[i + 2] = pvtx.nz;							
                    i += 3;
                }
                ROVertexBuffer.AddFloat32Data(this.m_nvs,3);
            }
            if (this.isVBufEnabledAt(VtxBufConst.VBUF_CVS_INDEX))
            {
                this.m_cvs = new Float32Array(this.vtxTotal * 3);
                //
                i = 0;
                for (j = 0; j < this.vtxTotal; ++j)
                {
                    this.m_cvs[i] = 1.0; this.m_cvs[i + 1] = 1.0; this.m_cvs[i + 2] = 1.0;
                    i += 3;
                }
                ROVertexBuffer.AddFloat32Data(this.m_cvs,3);
            }            
            if (this.isVBufEnabledAt(VtxBufConst.VBUF_TVS_INDEX))
            {
                let numTriangles = this.m_ivs.length / 3;
                let tvs = new Float32Array(this.m_vs.length);
                let btvs = new Float32Array(this.m_vs.length);
                SurfaceNormalCalc.ClacTrisTangent(this.m_vs, this.m_vs.length, this.m_uvs, this.m_nvs, numTriangles, this.m_ivs, tvs, btvs);
                ROVertexBuffer.AddFloat32Data(tvs,3);
                ROVertexBuffer.AddFloat32Data(btvs,3);
            }
            
            if(this.wireframe) {
                this.updateWireframeIvs();
            }
            ROVertexBuffer.vbWholeDataEnabled = this.vbWholeDataEnabled;
            this.m_vbuf = ROVertexBuffer.CreateBySaveData(this.getBufDataUsage());
            this.m_vbuf.setUint16IVSData(this.m_ivs);
            this.vtCount = this.m_ivs.length;
            this.trisNumber = this.vtCount/3;
        }
    }
    __$destroy():void
    {
        if(this.isResFree())
        {
            this.bounds = null;

            this.m_vs = null;
            this.m_uvs = null;
            this.m_nvs = null;
            this.m_cvs = null;
            super.__$destroy();
        }
    }
    // @boundsHit       表示是否包围盒体已经和射线相交了
    // @rlpv            表示物体坐标空间的射线起点
    // @rltv            表示物体坐标空间的射线朝向
    // @outV            如果检测相交存放物体坐标空间的交点
    // @return          返回值 -1 表示不会进行检测,1表示相交,0表示不相交
    //
    testRay(rlpv:Vector3D,rltv:Vector3D,outV:Vector3D,boundsHit:boolean):number
    {
        return RadialLine.IntersectioNearSphere2(rlpv,rltv,Vector3D.ZERO,this.m_radius,outV);
    }
    toString():string
    {
        return "Sphere3DMesh()";
    }
}