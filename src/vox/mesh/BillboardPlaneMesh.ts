/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as RenderConstT from "../../vox/render/RenderConst";
import * as ROVertexBufferT from "../../vox/mesh/ROVertexBuffer";
import * as VtxBufConstT from "../../vox/mesh/VtxBufConst";
import * as AABBT from "../../vox/geom/AABB";
import * as MeshBaseT from "../../vox/mesh/MeshBase";

import RenderDrawMode = RenderConstT.vox.render.RenderDrawMode;
import ROVertexBuffer = ROVertexBufferT.vox.mesh.ROVertexBuffer;
import VtxBufConst = VtxBufConstT.vox.mesh.VtxBufConst;
import AABB = AABBT.vox.geom.AABB;
import MeshBase = MeshBaseT.vox.mesh.MeshBase;

export namespace vox
{
    export namespace mesh
    {
        export class BillboardPlaneMesh extends MeshBase
        {
            constructor(bufDataUsage:number = VtxBufConst.VTX_STATIC_DRAW)
            {
                super(bufDataUsage);
            }
            private m_vs:Float32Array = null;
            private m_uvs:Float32Array = null;
            flipVerticalUV:boolean = false;
            vtxUVEnabled:boolean = true;
            
            setUVSFloatArr(uvsFloatArr8:Float32Array):void
            {
                if(this.m_uvs == null)
                {
                    this.m_uvs = new Float32Array(8);
                }
                this.m_uvs.set(uvsFloatArr8,0);
            }
            setUVSArr(uvsArr8:number[]):void
            {
                if(this.m_uvs == null)
                {
                    this.m_uvs = new Float32Array(8);
                }
                this.m_uvs.set(uvsArr8,0);
            }
            initialize(pwidth:number,pheight:number):void
            {
                if(this.m_vs != null)
                {
                    return;
                }
                //console.log("RectPlaneMesh::initialize()...");
                let maxX:number = 0.5 * pwidth;
                let maxY:number = 0.5 * pheight;
                let minX:number = -maxX;
                let minY:number = -maxY;
                this.bounds = new AABB();
                this.bounds.min.setXYZ(minX,minY,minX);
                this.bounds.max.setXYZ(maxX,maxY,maxX);
                this.bounds.updateFast();
                // ccw is positive, left-bottom pos(minX,minY) -> right-bottom pos(maxX,minY) -> right-top pos(maxX,maxY)  -> right-top pos(minX,maxY)
                //this.m_ivs = new Uint16Array([0,3,1,2]);
                this.m_ivs = new Uint16Array([1,2,0,3]);
                this.m_vs = new Float32Array([
                    minX,minY,
                    maxX,minY,
                    maxX,maxY,
                    minX,maxY
                ]);
                ROVertexBuffer.Reset();
                ROVertexBuffer.AddFloat32Data(this.m_vs,2);
                if(this.vtxUVEnabled)
                {
                    if(this.m_uvs == null)
                    {
                        if(this.flipVerticalUV)
                        {
                            this.m_uvs = new Float32Array([
                                0.0,0.0,
                                1.0,0.0,
                                1.0,1.0,
                                0.0,1.0
                            ]);
                        
                        }
                        else
                        {
                            this.m_uvs = new Float32Array([
                                0.0,1.0,
                                1.0,1.0,
                                1.0,0.0,
                                0.0,0.0
                            ]);
                        }
                    }
                    ROVertexBuffer.AddFloat32Data(this.m_uvs,2);
                }

                ROVertexBuffer.vbWholeDataEnabled = this.vbWholeDataEnabled;
                this.m_vbuf = ROVertexBuffer.CreateBySaveData(this.getBufDataUsage());
                this.m_vbuf.setUint16IVSData(this.m_ivs);
                this.vtCount = this.m_ivs.length;
                this.vtxTotal = 4;
                this.trisNumber = 2;
                this.drawMode = RenderDrawMode.ELEMENTS_TRIANGLE_STRIP;
                this.buildEnd();
            }
            
            setUV(pu:number,pv:number,du:number,dv:number):void
            {
                if(this.m_vbuf != null)
                {
                    this.m_vbuf.setData2fAt(0,1,pu,pv+dv);
                    this.m_vbuf.setData2fAt(1,1,pu+du,pv+dv);
                    this.m_vbuf.setData2fAt(2,1,pu+du,pv);
                    this.m_vbuf.setData2fAt(3,1,pu,pv);
                }
            }
        }
    }
}
