/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as Vector3DT from "../../vox/geom/Vector3";
import * as RenderConstT from "../../vox/render/RenderConst";
import * as AABBT from "../../vox/geom/AABB";
import * as VtxBufConstT from "../../vox/mesh/VtxBufConst";
import * as ROVertexBufferT from "../../vox/mesh/ROVertexBuffer";
import * as ROVtxBufUidStoreT from "../../vox/mesh/ROVtxBufUidStore";

import Vector3D = Vector3DT.vox.geom.Vector3D;
import RenderDrawMode = RenderConstT.vox.render.RenderDrawMode;
import AABB = AABBT.vox.geom.AABB;
import VtxNormalType = VtxBufConstT.vox.mesh.VtxNormalType;
import VtxBufConst = VtxBufConstT.vox.mesh.VtxBufConst;
import ROVertexBuffer = ROVertexBufferT.vox.mesh.ROVertexBuffer;
import ROVtxBufUidStore = ROVtxBufUidStoreT.vox.mesh.ROVtxBufUidStore;

export namespace vox
{
    export namespace mesh
    {
        export class MeshVertex
        {
            // pos
            x:number = 0.0;
            y:number = 0.0;
            z:number = 0.0;
            // uv
            u:number = 0.0;
            v:number = 1.0;
            // normal
            nx:number = 0.0;
            ny:number = 0.0;
            nz:number = 0.0;
            index:number = 0;
            //
            constructor(px:number = 0,py:number = 0,pz:number = 0,pindex:number = 0)
            {
                // pos
                this.x = px;
                this.y = py;
                this.z = pz;
                this.index = pindex;
            }
            cloneVertex():MeshVertex
            {
                let vtx:MeshVertex = new MeshVertex(this.x,this.y,this.z,this.index);
                vtx.nx = this.nx; vtx.ny = this.ny; vtx.nz = this.nz;
                vtx.u = this.u; vtx.v = this.v;
                return vtx;
            }
            copyFrom(pv:MeshVertex):void
            {
                this.x = pv.x; this.y = pv.y; this.z = pv.z;
                this.u = pv.u; this.v = pv.v;
                this.nx = pv.nx; this.ny = pv.ny; this.nz = pv.nz;
                this.index = pv.index;
            }
        }
        //
        export class MeshBase
        {
            private m_bufDataUsage:number = 0;
            private m_isDyn:boolean = false;
            // very important!!!
            protected m_vbuf:ROVertexBuffer = null;
            protected m_ivs:any = null;//Uint16Array or Uint32Array

            private m_bufDataList:Float32Array[] = null;
            private m_bufDataStepList:number[] = null;
            private m_bufStatusList:number[] = null;
            //
            constructor(bufDataUsage:number = VtxBufConst.VTX_STATIC_DRAW)
            {
                this.m_bufDataUsage = bufDataUsage;
                this.m_isDyn = bufDataUsage == VtxBufConst.VTX_DYNAMIC_DRAW;
            }
            bounds:AABB = null;
            normalType:number = VtxNormalType.GOURAND;
            
            //
            normalScale:number = 1.0;
            //
            vtxTotal:number = 0;
            trisNumber:number = 0;

            //RenderDrawMode
            drawMode:number = RenderDrawMode.ELEMENTS_TRIANGLES;
            //  // vtx postion in data stream used count
            vtCount:number = 0;
            //  // vtx postion in data stream used begin
            //  vtBegin:number = 0;

            vbWholeDataEnabled:boolean = false;
            drawInsBeginIndex:number = 0;
            drawInsStride:number = 0;
            drawInsTotal:number = 0;
            vaoEnabled:boolean = false;
            protected buildEnd():void
            {
                this.m_bufDataList = ROVertexBuffer.BufDataList;
                this.m_bufDataStepList = ROVertexBuffer.BufDataStepList;
                this.m_bufStatusList = ROVertexBuffer.BufStatusList;
            }
            // 是否是多面体实体,如果是，则可以进行三角面的相关计算等操作, 如果不是则需要进行相关的几何算法计算
            isPolyhedral():boolean{return true;}
            // 设置自身是否是多面体实体，根据实际需要改变相关的状态值
            setPolyhedral(boo:boolean):void{}
            // @boundsHit       表示是否包围盒体已经和射线相交了
            // @rlpv            表示物体坐标空间的射线起点
            // @rltv            表示物体坐标空间的射线朝向
            // @outV            如果检测相交存放物体坐标空间的交点
            // @return          返回值 -1 表示不会进行检测,1表示相交,0表示不相交
            //
            testRay(rlpv:Vector3D,rltv:Vector3D,outV:Vector3D,boundsHit:boolean):number
            {
                return -1;
            }
            public rebuild():void
            {
                if(this.m_vbuf == null)
                {
                    if(this.m_bufDataList != null)
                    {
                        console.log("MeshBase::rebuild()...");
                        ROVertexBuffer.Reset();
                        let i:number = 0;
                        let len:number = this.m_bufDataList.length;
                        for(; i < len; ++i)
                        {
                            ROVertexBuffer.AddFloat32Data(this.m_bufDataList[i],this.m_bufDataStepList[i],this.m_bufStatusList[i]);
                        }
                        this.m_vbuf = ROVertexBuffer.CreateBySaveData(this.getBufDataUsage());
                        this.m_vbuf.setVaoEnabled(this.vaoEnabled);
                        if(this.m_ivs != null)
                        {
                            this.m_vbuf.setUint16IVSData(this.m_ivs);
                            this.vtCount = this.m_ivs.length;
                        }
                    }
                }
            }
            __$attachVBuf():ROVertexBuffer
            {
                if(this.m_vbuf == null)
                {
                    // create vbuf;
                    this.rebuild();
                }
                ROVtxBufUidStore.GetInstance().__$attachAt(this.m_vbuf.getUid());
                return this.m_vbuf;
            }
            __$detachVBuf(vbuf:ROVertexBuffer):void
            {
                if(this.m_vbuf != vbuf)
                {
                    throw Error("Fatal Error!");
                }                
                ROVtxBufUidStore.GetInstance().__$detachAt(this.m_vbuf.getUid());
            }
            isGeomDynamic():number
            {
                return this.m_bufDataUsage;
            }
            getBufDataUsage():number
            {
                return this.m_bufDataUsage;
            }
            // vertex
            getVS():Float32Array{return null;}
            // base uv
            getUVS():Float32Array{return null;}
            // base nv
            getNVS():Float32Array{return null;}
            // base vtx color
            getCVS():Float32Array{return null;}
            // vertex2
            getVS2():Float32Array{return null;}
            // base uv2
            getUVS2():Float32Array{return null;}
            // base nv2
            getNVS2():Float32Array{return null;}
            // base vtx color2
            getCVS2():Float32Array{return null;}
            // index bufer
            getIVS():any{return this.m_ivs;}
            //
            private m_layoutBit:number = 0x0;
            //
            setBufSortFormat(layoutBit:number):void
            {
                this.m_layoutBit = layoutBit;
            }
            isVBufEnabledAt(i:number):boolean
            {
                return (i&this.m_layoutBit) > 0;
            }
            private m_attachCount:number = 0;
            __$attachThis():void
            {
                ++this.m_attachCount;
                //console.log("MeshBase::__$attachThis() this.m_attachCount: "+this.m_attachCount);
            }
            __$detachThis():void
            {
                if(this.m_attachCount > 0 && this.m_attachCount < 2)
                {
                    --this.m_attachCount;
                    console.log("MeshBase::__$detachThis() this.m_attachCount: "+this.m_attachCount);
                    this.__$dispose();
                }
                else
                {
                    --this.m_attachCount;
                    console.log("MeshBase::__$detachThis() this.m_attachCount: "+this.m_attachCount);
                }
                if(this.m_attachCount < 1)
                {
                    this.m_attachCount = 0;
                }
            }
            getAttachCount():number
            {
                return this.m_attachCount;
            }
            // 释放被外部对象持有的资源
            private __$dispose():void
            {
                if(this.getAttachCount() < 1 && this.m_vbuf != null)
                {
                    console.log("MeshBase::__$dispose()... this.m_attachCount: "+this.m_attachCount);
                    ROVertexBuffer.Restore(this.m_vbuf);
                    this.m_vbuf = null;
                }
            }
            isEnabled():boolean
            {
                return this.m_vbuf != null;
            }
            isResFree():boolean
            {
                return this.getAttachCount() < 1 && this.m_vbuf == null;
            }
            // really destroy this
            __$destroy():void
            {
                if(this.isResFree())
                {
                    console.log("MeshBase::__$destroy()... this.m_attachCount: "+this.m_attachCount);
                    this.m_ivs = null;
                    this.m_bufDataList = null;
                    this.m_bufDataStepList = null;
                    this.m_bufStatusList = null;
                    this.trisNumber = 0;

                }
            }
            toString():string
            {
                return "[MeshBase()]";
            }
        }
    }
}