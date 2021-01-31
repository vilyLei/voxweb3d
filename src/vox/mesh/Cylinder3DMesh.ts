/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as SurfaceNormalCalcT from "../../vox/geom/SurfaceNormalCalc";
import * as VtxBufConstT from "../../vox/mesh/VtxBufConst";
import * as ROVertexBufferT from "../../vox/mesh/ROVertexBuffer";
import * as AABBT from "../../vox/geom/AABB";
import * as MeshBaseT from "../../vox/mesh/MeshBase"

import SurfaceNormalCalc = SurfaceNormalCalcT.vox.geom.SurfaceNormalCalc;
import VtxBufConst = VtxBufConstT.vox.mesh.VtxBufConst;
import ROVertexBuffer = ROVertexBufferT.vox.mesh.ROVertexBuffer;
import MeshVertex = MeshBaseT.vox.mesh.MeshVertex;
import AABB = AABBT.vox.geom.AABB;
import MeshBase = MeshBaseT.vox.mesh.MeshBase;

export namespace vox
{
    export namespace mesh
    {
        export class Cylinder3DMesh extends MeshBase
        {
            constructor(bufDataUsage:number = VtxBufConst.VTX_STATIC_DRAW)
            {
                super(bufDataUsage);
            }

            private m_vs:Float32Array = null;
            private m_uvs:Float32Array = null;
            private m_nvs:Float32Array = null;
            private m_cvs:Float32Array = null;
            
            inverseUV:boolean = false;
            uScale:number = 1.0;
            vScale:number = 1.0;

            getVS():Float32Array{return this.m_vs;}
            getUVS():Float32Array{return this.m_uvs;}
            getNVS():Float32Array{return this.m_nvs;}
            getCVS():Float32Array{return this.m_cvs;}
            getIVS():Uint16Array|Uint32Array{return this.m_ivs;}

            initialize(radius:number, height:number, longitudeNumSegments:number, latitudeNumSegments:number,uvType:number = 1, alignYRatio:number = -0.5)
            {
                if (this.vtxTotal < 1)
                {
                    if (radius < 0.01)return;
                    
                    if (longitudeNumSegments < 2) longitudeNumSegments = 2;
                    latitudeNumSegments = 3;
                    //
                    let m_radius:number = Math.abs(radius);
                    let m_height:number = Math.abs(height);
                    //
                    let plongitudeNumSegments:number = longitudeNumSegments;
                    let platitudeNumSegments:number = latitudeNumSegments;
                    //
                    let i:number = 1
                    let j:number = 0;
                    let trisTot:number = 0;
                    let yRad:number = 0;
                    let px:number = 0;
                    let py:number = 0;
                    let minY:number = alignYRatio * m_height;
                    this.bounds = new AABB();
                    this.bounds.min.setXYZ(-radius,minY,-radius);
                    this.bounds.max.setXYZ(radius,minY + m_height,radius);
                    this.bounds.updateFast();

                    //
                    let vtx:MeshVertex = new MeshVertex();
                    vtx.y = minY;
                
                    // two independent circles and a cylinder wall
                    let vtxVec:MeshVertex[] = [];
                    let vtxRows:MeshVertex[][] = [];
                    vtxRows.push([]);
                    let vtxRow:MeshVertex[] = vtxRows[0];
                    vtx.u = 0.5; vtx.v = 0.5;
                    vtx.nx = 0.0; vtx.ny = -1.0; vtx.nz = 0.0;
                    vtxRow.push(vtx.cloneVertex());
                    vtxVec.push(vtxRow[0]);
                    //
                    for (; i < platitudeNumSegments; ++i)
                    {
                        //
                        vtx.y = minY + m_height * (i-1);
                        vtxRows.push([]);
                        let row = vtxRows[i];
                        for (j = 0; j < plongitudeNumSegments; ++j) {
                            yRad = (Math.PI * 2 * j) / plongitudeNumSegments;
                            ++trisTot;
                            //Math::sinCos(&px, &py, yRad);
                            px = Math.sin(yRad);
                            py = Math.cos(yRad);
                            //
                            vtx.x = px * m_radius;
                            vtx.z = py * m_radius;
                            vtx.index = trisTot;
                            // calc uv
                            px *= 0.495;
                            py *= 0.495;
                            vtx.u = 0.5 + px;
                            vtx.v = 0.5 + py;
                            //
                            if (i < 2) 
                            {
                                vtx.nx = 0.0; vtx.ny = -1.0; vtx.nz = 0.0;
                            }
                            else
                            {
                                vtx.nx = 0.0; vtx.ny = 1.0; vtx.nz = 0.0;
                            }
                            //
                            row.push(vtx.cloneVertex());
                            vtxVec.push(row[j]);
                        }
                        row.push(row[0]);
                    }
                    ++trisTot;
                    vtx.index = trisTot;
                    vtx.x = 0; vtx.y = minY + m_height; vtx.z = 0.0;
                    vtx.u = 0.5; vtx.v = 0.5;
                    vtx.nx = 0.0; vtx.ny = 1.0; vtx.nz = 0.0;
                    vtxRows.push([]);
                    let lastRow:MeshVertex[] = vtxRows[3];
                    lastRow.push(vtx.cloneVertex());
                    vtxVec.push(lastRow[0]);
                    // two circles's vertexes calc end;
                    // calc cylinder wall vertexes
                    let f = 1.0 / m_radius;
                    for (i = 0; i < 2; ++i)
                    {
                        let preRow = vtxRows[i+1];
                        vtxRows.push([]);
                        let row = vtxRows[vtxRows.length - 1];
                        for (j = 0; j <= plongitudeNumSegments; ++j)
                        {
                            ++trisTot;
                            vtx.copyFrom(preRow[j]);
                            vtx.index = trisTot;
                            if (uvType < 1) {
                                if (i < 1)
                                {
                                    vtx.v = 0.0;
                                }
                                else
                                {
                                    vtx.v = this.vScale;//1.0
                                }
                                vtx.u = this.uScale * (j / plongitudeNumSegments);
                            }
                            else
                            {
                                if (i < 1)
                                {
                                    vtx.u = 0.0;
                                }
                                else
                                {
                                    vtx.u = this.uScale;//1.0;
                                }
                                vtx.v = this.vScale * (j / plongitudeNumSegments);
                            }

                            //
                            vtx.ny = 0.0;
                            vtx.nx = vtx.x * f;
                            vtx.nz = vtx.z * f;
                            //
                            row.push(vtx.cloneVertex());
                            vtxVec.push(row[j]);
                        }
                    }
                    let pvtx:MeshVertex = null;
                    let pivs:number[] = [];
                    i = 1;
                    let rowa:MeshVertex[] = null;
                    let rowb:MeshVertex[] = null;
                    for (; i <= platitudeNumSegments; ++i)
                    {
                        rowa = vtxRows[i-1];
                        rowb = vtxRows[i];
                        for (j = 1; j <= plongitudeNumSegments; ++j)
                        {
                            if (i == 1)
                            {
                                pivs.push(rowa[0].index); pivs.push(rowb[j].index); pivs.push(rowb[j-1].index);
                                //pivs.push(rowa[0].index); pivs.push(rowb[j-1].index); pivs.push(rowb[j].index);
                                //vtxIndexTriVec.push(vox::kernel::mesh::VertexIndexTriangle(rowa[0].index, rowb[j].index, rowb[j - 1].index));
                            }
                            else if(i == platitudeNumSegments)
                            {
                                pivs.push(rowa[j].index); pivs.push(rowb[0].index); pivs.push(rowa[j - 1].index);                        
                                //pivs.push(rowa[j].index); pivs.push(rowa[j - 1].index); pivs.push(rowb[0].index);
                                //vtxIndexTriVec.push(vox::kernel::mesh::VertexIndexTriangle(rowa[j].index, rowb[0].index, rowa[j - 1].index));
                            }
                        }
                    }
                    // create cylinder wall triangles
                    rowa = vtxRows[vtxRows.length - 2];
                    rowb = vtxRows[vtxRows.length - 1];
                    for (j = 1; j <= plongitudeNumSegments; ++j)
                    {
                        //vtxIndexTriVec.push(vox::kernel::mesh::VertexIndexTriangle(rowa[j].index, rowb[j - 1].index, rowa[j - 1].index));
                        //vtxIndexTriVec.push(vox::kernel::mesh::VertexIndexTriangle(rowa[j].index, rowb[j].index, rowb[j - 1].index));
                        pivs.push(rowa[j].index); pivs.push(rowb[j - 1].index); pivs.push(rowa[j - 1].index);
                        pivs.push(rowa[j].index); pivs.push(rowb[j].index); pivs.push(rowb[j - 1].index);
                    }
                    //
                    this.vtxTotal = vtxVec.length;
                    //
                    this.m_vs = new Float32Array(this.vtxTotal * 3);
                    i = 0;
                    for (j = 0; j < this.vtxTotal; ++j)
                    {
                        pvtx = vtxVec[j];
                        this.m_vs[i] = pvtx.x; this.m_vs[i + 1] = pvtx.y; this.m_vs[i + 2] = pvtx.z;
                        //trace(pvtx.x+","+pvtx.y+","+pvtx.z);
                        i += 3;
                    }                    
                    if(this.m_transMatrix != null)
                    {
                        this.m_transMatrix.transformVectorsSelf(this.m_vs, this.m_vs.length);
                        this.bounds.addXYZFloat32Arr( this.m_vs );
                        this.bounds.updateFast();
                    }
                    ROVertexBuffer.Reset();
                    ROVertexBuffer.AddFloat32Data(this.m_vs,3);
                    this.m_ivs = new Uint16Array(pivs);
                    if (this.isVBufEnabledAt(VtxBufConst.VBUF_UVS_INDEX))
                    {
                        // uv
                        this.m_uvs = new Float32Array(this.vtxTotal * 2);
                        //
                        i = 0;
                        for (j = 0; j < this.vtxTotal; ++j)
                        {
                            pvtx = vtxVec[j];
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
                    //
                    if (this.isVBufEnabledAt(VtxBufConst.VBUF_TVS_INDEX))
                    {
                        let numTriangles = this.m_ivs.length / 3;
                        let tvs:Float32Array = new Float32Array(this.m_vs.length);
                        let btvs:Float32Array = new Float32Array(this.m_vs.length);
                        SurfaceNormalCalc.ClacTrisTangent(this.m_vs, this.m_vs.length, this.m_uvs, this.m_nvs, numTriangles, this.m_ivs, tvs, btvs);
                        ROVertexBuffer.AddFloat32Data(tvs,3);
                        ROVertexBuffer.AddFloat32Data(btvs,3);
                    }

                    ROVertexBuffer.vbWholeDataEnabled = this.vbWholeDataEnabled;
                    this.m_vbuf = ROVertexBuffer.CreateBySaveData(this.getBufDataUsage());
                    this.m_vbuf.setVaoEnabled(this.vaoEnabled);
                    this.m_vbuf.setUint16IVSData(this.m_ivs);
                    this.vtCount = this.m_ivs.length;
                    this.trisNumber = this.vtCount/3;
                    this.buildEnd();
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
            toString():string
            {
                return "Cylinder3DMesh()";
            }
        }
    }
}
