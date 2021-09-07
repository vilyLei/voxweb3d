/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Vector3D from "../../vox/math/Vector3D";
import VtxBufConst from "../../vox/mesh/VtxBufConst";
import MeshBase from "../../vox/mesh/MeshBase";
import ROVertexBuffer from "../../vox/mesh/ROVertexBuffer";

export default class DataMesh extends MeshBase
{
    constructor(bufDataUsage:number = VtxBufConst.VTX_STATIC_DRAW)
    {
        super(bufDataUsage);
    }

    vsStride: number = 3;

    vs:Float32Array = null
    uvs:Float32Array = null;
    nvs:Float32Array = null;
    cvs:Float32Array = null;
    tvs:Float32Array = null;
    btvs:Float32Array = null;

    ivs:Uint16Array | Uint32Array = null
    
    initialize(): void {
        
        if(this.vs != null) {
            ROVertexBuffer.Reset();
            ROVertexBuffer.AddFloat32Data(this.vs,this.vsStride);
            if (this.isVBufEnabledAt(VtxBufConst.VBUF_UVS_INDEX)) {
    
                ROVertexBuffer.AddFloat32Data(this.uvs,2);
            }
            if (this.isVBufEnabledAt(VtxBufConst.VBUF_NVS_INDEX)) {
                ROVertexBuffer.AddFloat32Data(this.nvs,3);
            }
            if (this.isVBufEnabledAt(VtxBufConst.VBUF_CVS_INDEX)) {
                ROVertexBuffer.AddFloat32Data(this.cvs,3);
            }
            if (this.isVBufEnabledAt(VtxBufConst.VBUF_TVS_INDEX)) {
                ROVertexBuffer.AddFloat32Data(this.tvs,3);
                ROVertexBuffer.AddFloat32Data(this.btvs,3);
            }
            ROVertexBuffer.vbWholeDataEnabled = this.vbWholeDataEnabled;
    
            this.vtCount = this.ivs.length;
            if(this.m_vbuf != null) {
                ROVertexBuffer.UpdateBufData(this.m_vbuf);
            }
            else {
                this.m_vbuf = ROVertexBuffer.CreateBySaveData(this.getBufDataUsage(),this.getBufSortFormat());
            }
            this.m_vbuf.setUintIVSData(this.ivs);
            this.buildEnd();
        }
    }
    
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
    toString():string
    {
        return "[DataMesh()]";
    }
    __$destroy():void
    {
        if(this.isResFree())
        {
            this.bounds = null;

            this.vs = null;
            this.uvs = null;
            this.nvs = null;
            this.cvs = null;
            this.tvs = null;
            this.btvs = null;

            super.__$destroy();
        }
    }
}