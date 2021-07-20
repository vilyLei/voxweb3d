/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Vector3D from "../../vox/math/Vector3D";
import Matrix4 from "../../vox/math/Matrix4";
import AABB from "../../vox/geom/AABB";
import VtxBufConst from "../../vox/mesh/VtxBufConst";
import {VtxNormalType} from "../../vox/mesh/VtxBufConst";
import ROVertexBuffer from "../../vox/mesh/ROVertexBuffer";

import {RenderDrawMode} from "../../vox/render/RenderConst";

//import ROVertexBuffer = ROVertexBufferT.vox.mesh.ROVertexBuffer;

/**
 * mesh(Polygon face convex mesh or Parametric geometry Objecct:):
 *      1.基于面(例如三角面)描述的多面体实体(Polygon face geometry mesh,for example: triangle mesh)
 *      2.基于空间几何方程描述的空间几何体(Parametric geometry Objecct,for example: Sphere(px,py,pz,radius))
*/
export default class MeshBase
{
    private m_bufDataUsage:number = 0;
    //private m_isDyn:boolean = false;
    private m_layoutBit:number = 0x0;
    // very important!!!
    protected m_transMatrix:Matrix4 = null;
    protected m_vbuf:ROVertexBuffer = null;
    protected m_ivs:Uint16Array | Uint32Array = null;
    private m_bufDataList:Float32Array[] = null;
    private m_bufDataStepList:number[] = null;
    private m_bufStatusList:number[] = null;
    constructor(bufDataUsage:number = VtxBufConst.VTX_STATIC_DRAW)
    {
        this.m_bufDataUsage = bufDataUsage;
        //this.m_isDyn = bufDataUsage == VtxBufConst.VTX_DYNAMIC_DRAW;
    }
    bounds:AABB = null;
    normalType:number = VtxNormalType.GOURAND;
    normalScale:number = 1.0;
    vtxTotal:number = 0;
    trisNumber:number = 0;
    //RenderDrawMode
    drawMode:number = RenderDrawMode.ELEMENTS_TRIANGLES;
    //  // vtx postion in data stream used count
    vtCount:number = 0;
    
    vbWholeDataEnabled:boolean = false;
    drawInsBeginIndex:number = 0;
    drawInsStride:number = 0;
    drawInsTotal:number = 0;
    protected buildEnd():void
    {
        this.m_bufDataList = ROVertexBuffer.BufDataList;
        this.m_bufDataStepList = ROVertexBuffer.BufDataStepList;
        this.m_bufStatusList = ROVertexBuffer.BufStatusList;
    }
    setTransformMatrix(matrix:Matrix4):void
    {
        this.m_transMatrix = matrix;
    }
    getTransformMatrix():Matrix4
    {
        return this.m_transMatrix;
    }
    /**
     * @return 返回true是则表示这是基于三角面的可渲染多面体, 返回false则是一个数学方程描述的几何体(例如球体).
     *         如果是多面体实体,则可以进行三角面的相关计算等操作, 如果不是则需要进行相关的几何算法计算.
     */
    isPolyhedral():boolean{return true;}
    // 设置自身是否是多面体实体，根据实际需要改变相关的状态值
    setPolyhedral(boo:boolean):void{}
    /**
     * 射线和自身的相交检测(多面体或几何函数(例如球体))
     * @boundsHit       表示是否包围盒体已经和射线相交了
     * @rlpv            表示物体坐标空间的射线起点
     * @rltv            表示物体坐标空间的射线朝向
     * @outV            如果检测相交存放物体坐标空间的交点
     * @return          返回值 -1 表示不会进行检测,1表示相交,0表示不相交
     */
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
            // rebuild vbuf;
            this.rebuild();
        }
        ROVertexBuffer.__$$AttachAt(this.m_vbuf.getUid());
        return this.m_vbuf;
    }
    __$detachVBuf(vbuf:ROVertexBuffer):void
    {
        if(this.m_vbuf != vbuf)
        {
            throw Error("Fatal Error!");
        }
        ROVertexBuffer.__$$DetachAt(this.m_vbuf.getUid());
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
    // index bufer
    getIVS():Uint16Array | Uint32Array{return this.m_ivs;}
    /**
     * @param layoutBit vertex shader vertex attributes layout bit status.
     *                  the value of layoutBit comes from the material shdder program.
     */
    setBufSortFormat(layoutBit:number):void
    {
        this.m_layoutBit = layoutBit;
    }
    getBufSortFormat():number
    {
        return this.m_layoutBit;
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
        if(this.m_attachCount == 1)
        {
            --this.m_attachCount;
            //console.log("MeshBase::__$detachThis() this.m_attachCount: "+this.m_attachCount);
            this.__$dispose();
        }
        else
        {
            --this.m_attachCount;
            //console.log("MeshBase::__$detachThis() this.m_attachCount: "+this.m_attachCount);
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
            //console.log("MeshBase::__$dispose()... this.m_attachCount: "+this.m_attachCount);
            ROVertexBuffer.__$$DetachAt(this.m_vbuf.getUid());
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
    /**
     * really destroy this instance all data
     */
    __$destroy():void
    {
        if(this.isResFree())
        {
            //console.log("MeshBase::__$destroy()... this.m_attachCount: "+this.m_attachCount);
            this.m_ivs = null;
            this.m_bufDataList = null;
            this.m_bufDataStepList = null;
            this.m_bufStatusList = null;
            this.trisNumber = 0;
            this.m_transMatrix = null;
        }
    }
    toString():string
    {
        return "[MeshBase()]";
    }
}