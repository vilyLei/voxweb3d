/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2020 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as RenderConstT from "../../vox/render/RenderConst";
import * as VtxBufConstT from "../../vox/mesh/VtxBufConst";
import * as AABBT from "../../vox/geom/AABB";
import * as MeshBaseT from "../../vox/mesh/MeshBase";
import * as ROVertexBufferT from "../../vox/mesh/ROVertexBuffer";

import RenderDrawMode = RenderConstT.vox.render.RenderDrawMode;
import VtxBufConst = VtxBufConstT.vox.mesh.VtxBufConst;
import AABB = AABBT.vox.geom.AABB;
import MeshBase = MeshBaseT.vox.mesh.MeshBase;
import ROVertexBuffer = ROVertexBufferT.vox.mesh.ROVertexBuffer;

export namespace vox
{
    export namespace mesh
    {
        export class StripLineMesh extends MeshBase
        {
            constructor(bufDataUsage:number = VtxBufConst.VTX_STATIC_DRAW)
            {
                super(bufDataUsage);
            }
            private m_vs:Float32Array = null;
            private m_cvs:Float32Array = null;
            getVS():Float32Array
            {
                return this.m_vs;
            }
            getCVS():Float32Array
            {
                return this.m_vs;
            }
            isPolyhedral():boolean{return false;}
            initialize(posarr:number[],colors:number[]):void
            {
                if(posarr.length >= 6)
                {
                    //console.log("StripLineMesh posarr: "+posarr);
                    this.vtCount = Math.floor(posarr.length/3);
                    this.m_vs = new Float32Array(posarr);
                    this.bounds = new AABB();
                    //  this.bounds.addXYZFloat32Arr(this.m_vs);
                    //  this.bounds.updateFast();

                    ROVertexBuffer.Reset();
                    ROVertexBuffer.AddFloat32Data(this.m_vs,3);

                    if (this.isVBufEnabledAt(VtxBufConst.VBUF_CVS_INDEX))
                    {
                        this.m_cvs = new Float32Array(colors);
                        ROVertexBuffer.AddFloat32Data(this.m_cvs,3);
                    }
                    ROVertexBuffer.vbWholeDataEnabled = this.vbWholeDataEnabled;
                    this.m_vbuf = ROVertexBuffer.CreateBySaveData(this.getBufDataUsage());
                    this.drawMode = RenderDrawMode.ARRAYS_LINE_STRIP;
                    this.buildEnd();
                }
            }
            setVSXYZAt(i:number,px:number,py:number,pz:number):void
            {
                if(this.m_vbuf != null)
                {
                    this.m_vbuf.setData3fAt(i,0,px,py,pz);
                }
            }
            toString():string
            {
                return "StripLineMesh()";
            }
            __$destroy():void
            {
                if(this.isResFree())
                {
                    this.bounds = null;

                    this.m_vs = null;
                    this.m_cvs = null;
                    super.__$destroy();
                }
            }
        }
    }
}