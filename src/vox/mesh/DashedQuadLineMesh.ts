/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2020 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Vector3D from "../../vox/math/Vector3D";
import RadialLine from "../../vox/geom/RadialLine";
import AABB from "../../vox/geom/AABB";
import VtxBufConst from "../../vox/mesh/VtxBufConst";
import MeshBase from "../../vox/mesh/MeshBase";
import ROVertexBuffer from "../../vox/mesh/ROVertexBuffer";
import {RenderDrawMode} from "../../vox/render/RenderConst";

export default class DashedQuadLineMesh extends MeshBase
{
    private static s_pv0:Vector3D = new Vector3D();
    private static s_pv1:Vector3D = new Vector3D();
    constructor(bufDataUsage:number = VtxBufConst.VTX_STATIC_DRAW)
    {
        super(bufDataUsage);
    }
    private m_vs:Float32Array = null;
    private m_vs2:Float32Array = null;
    private m_cvs:Float32Array = null;
    private m_lsTotal:number = 0;
    // 用于射线检测
    public rayTestRadius:number = 2.0;
    getVS():Float32Array
    {
        return this.m_vs;
    }
    getCVS():Float32Array
    {
        return this.m_vs;
    }
    initialize(posarr:number[],pcolors:number[],thickness:number):void
    {
        if(posarr.length >= 6)
        {
            this.vtxTotal = Math.floor(posarr.length/3.0);
            this.m_lsTotal = Math.floor(this.vtxTotal/2.0);
            thickness *= 0.5;
            this.m_vs = new Float32Array(this.vtxTotal * 8);
            this.m_vs2 = new Float32Array(this.m_vs.length);
            this.m_cvs = new Float32Array(this.m_vs.length);
            //  this.m_cvs.set(pcolors,0);
            //  this.m_cvs.set(pcolors,pcolors.length);

            this.bounds = new AABB();
            let i:number = posarr.length;
            let j:number = 0;
            let k:number = 0;
            let p:number = 0;
            let tot:number = this.vtxTotal;
            i = 0;
            for(; i < this.m_lsTotal; ++i)
            {
                this.m_vs[k  ] = posarr[j];
                this.m_vs[k+1] = posarr[j+1];
                this.m_vs[k+2] = posarr[j+2];
                this.m_vs[k+3] = -thickness;
                this.bounds.addXYZ(posarr[j],posarr[j+1],posarr[j+2]);
                this.m_vs2[k  ] = posarr[j+3];
                this.m_vs2[k+1] = posarr[j+4];
                this.m_vs2[k+2] = posarr[j+5];
                this.m_vs2[k+3] = -thickness;

                this.m_cvs[k  ] = pcolors[p];
                this.m_cvs[k+1] = pcolors[p+1];
                this.m_cvs[k+2] = pcolors[p+2];
                this.m_cvs[k+3] = pcolors[p+3];

                j += 3;
                k += 4;
                this.m_vs[k  ] = posarr[j];
                this.m_vs[k+1] = posarr[j+1];
                this.m_vs[k+2] = posarr[j+2];
                this.m_vs[k+3] = -thickness;
                this.bounds.addXYZ(posarr[j],posarr[j+1],posarr[j+2]);
                this.m_vs2[k  ] = 2.0 * posarr[j  ] - posarr[j - 3];
                this.m_vs2[k+1] = 2.0 * posarr[j+1] - posarr[j - 2];
                this.m_vs2[k+2] = 2.0 * posarr[j+2] - posarr[j - 1];
                this.m_vs2[k+3] = -thickness;

                
                this.m_cvs[k  ] = pcolors[p];
                this.m_cvs[k+1] = pcolors[p+1];
                this.m_cvs[k+2] = pcolors[p+2];
                this.m_cvs[k+3] = pcolors[p+3];

                j += 3;
                k += 4;
                p += 4;
            }
            this.bounds.updateFast();

            i = j = 0;
            for(; i < this.vtxTotal; ++i)
            {
                this.m_vs[k  ] = this.m_vs[j];
                this.m_vs[k+1] = this.m_vs[j+1];
                this.m_vs[k+2] = this.m_vs[j+2];
                this.m_vs[k+3] = thickness;
                this.m_vs2[k  ] = this.m_vs2[j];
                this.m_vs2[k+1] = this.m_vs2[j+1];
                this.m_vs2[k+2] = this.m_vs2[j+2];
                this.m_vs2[k+3] = thickness;                        
                this.m_cvs[k  ] = this.m_cvs[j];
                this.m_cvs[k+1] = this.m_cvs[j+1];
                this.m_cvs[k+2] = this.m_cvs[j+2];
                this.m_cvs[k+3] = this.m_cvs[j+3];
                k += 4;
                j += 4;
            }
            //this.m_ivs = new Uint16Array([0,1,3,0,3,2]);
            this.m_ivs = new Uint16Array(this.m_lsTotal * 6);
            i = j = 0;
            k = 0;
            for(; i < this.m_lsTotal; ++i)
            {
                this.m_ivs[j    ] = k;
                this.m_ivs[j + 1] = k + 1;
                this.m_ivs[j + 2] = k + this.vtxTotal + 1;
                this.m_ivs[j + 3] = k;
                this.m_ivs[j + 4] = k + this.vtxTotal + 1;
                this.m_ivs[j + 5] = k + this.vtxTotal;
                j += 6;
                k += 2;
            }
            ROVertexBuffer.Reset();
            ROVertexBuffer.AddFloat32Data(this.m_vs,4);
            ROVertexBuffer.AddFloat32Data(this.m_cvs,4);
            ROVertexBuffer.AddFloat32Data(this.m_vs2,4);
            this.drawMode = RenderDrawMode.ELEMENTS_TRIANGLES;
            if(this.wireframe) {
                this.updateWireframeIvs();
            }
            ROVertexBuffer.vbWholeDataEnabled = this.vbWholeDataEnabled;
            this.m_vbuf = ROVertexBuffer.CreateBySaveData(this.getBufDataUsage());
            this.m_vbuf.setUint16IVSData(this.m_ivs);
            this.vtCount = this.m_ivs.length;
            this.vtxTotal *= 2;
            this.trisNumber = this.m_lsTotal * 2;
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
        return "DashedQuadLineMesh()";
    }
    isPolyhedral():boolean{return false;}
    // @boundsHit       表示是否包围盒体已经和射线相交了
    // @rlpv            表示物体坐标空间的射线起点
    // @rltv            表示物体坐标空间的射线朝向
    // @outV            如果检测相交存放物体坐标空间的交点
    // @return          返回值 -1 表示不会进行检测,1表示相交,0表示不相交
    //
    testRay(rlpv:Vector3D,rltv:Vector3D,outV:Vector3D,boundsHit:boolean):number
    {
        let j:number = 0;
        let vs:Float32Array = this.m_vs;
        let flag:number = 0;
        let radius:number = this.rayTestRadius;
        for(let i:number = 0; i < this.m_lsTotal; ++i)
        {
            DashedQuadLineMesh.s_pv0.setXYZ(vs[j],vs[j+1],vs[j+2]);
            DashedQuadLineMesh.s_pv1.setXYZ(vs[j+4],vs[j+5],vs[j+6]);
            flag = RadialLine.IntersectionLS(rlpv,rltv,DashedQuadLineMesh.s_pv0,DashedQuadLineMesh.s_pv1,outV,radius);
            if(flag > 0)
            {
                return 1;
            }
            j += 8;
        }
        return 0;
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