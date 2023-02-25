/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Vector3D from "../../vox/math/Vector3D";
import VtxBufConst from "../../vox/mesh/VtxBufConst";
import AABB from "../../vox/geom/AABB";
import MeshBase from "../../vox/mesh/MeshBase";
import ROVertexBuffer from "../../vox/mesh/ROVertexBuffer";
import {RenderDrawMode} from "../../vox/render/RenderConst";

export default class LightLine3DMesh extends MeshBase
{
    constructor(bufDataUsage:number = VtxBufConst.VTX_STATIC_DRAW)
    {
        super(bufDataUsage);
    }
    offsetU:number = 0.0;
    offsetV:number = 0.0;
    uScale:number = 1.0;
    vScale:number = 1.0;
    flipVerticalUV:boolean = false;
    flip90UV:boolean = false;
    
    private m_vs:Float32Array = null
    private m_uvs:Float32Array = null;
    private m_nvs:Float32Array = null;
    private m_cvs:Float32Array = null;
    // vertex
    getVS():Float32Array{return this.m_vs;}
    // base uv
    getUVS():Float32Array{return this.m_uvs;}
    // base nv
    getNVS():Float32Array{return this.m_nvs;}
    // base vtx color
    getCVS():Float32Array{return this.m_cvs;}
    initialize(beginPos:Vector3D,endPos:Vector3D,lineW:number):void
    {
        if(this.m_vs != null)
        {
            return;
        }
        lineW = Math.abs(0.5 * lineW);
        // ccw is positive, left-bottom pos(minX,minY) -> right-bottom pos(maxX,minY) -> right-top pos(maxX,maxY)  -> right-top pos(minX,maxY)
        this.m_ivs = new Uint16Array([0,1,2,0,2,3]);
        this.m_vs = new Float32Array([
            beginPos.x, beginPos.y, beginPos.z, lineW,
            endPos.x,   endPos.y,   endPos.z,   lineW,
            endPos.x,   endPos.y,   endPos.z,   -lineW,
            beginPos.x, beginPos.y, beginPos.z, -lineW
        ]);
        
        let dpos:any = {x:0,y:0,z:0};
        dpos.x = 2.0 * endPos.x - beginPos.x;
        dpos.y = 2.0 * endPos.y - beginPos.y;
        dpos.z = 2.0 * endPos.z - beginPos.z;
        
        this.m_nvs = new Float32Array([
            endPos.x, endPos.y, endPos.z,
            dpos.x,   dpos.y,   dpos.z,
            dpos.x,   dpos.y,   dpos.z,
            endPos.x, endPos.y, endPos.z
        ]);
        
        if(this.bounds == null) this.bounds = new AABB();
        this.bounds.addFloat32Arr(this.m_vs);
        this.bounds.updateFast();

        ROVertexBuffer.Reset();
        ROVertexBuffer.AddFloat32Data(this.m_vs,4);
        if (this.isVBufEnabledAt(VtxBufConst.VBUF_UVS_INDEX))
        {
            let puvs:number[];
            if(this.flipVerticalUV)
            {
                puvs = [
                    0.0,0.0,
                    1.0,0.0,
                    1.0,1.0,
                    0.0,1.0,
                ];
            }
            else
            {
                if(this.flip90UV)
                {
                puvs = [
                1.0,1.0,
                1.0,0.0,
                0.0,0.0,
                0.0,1.0
                ];
                }
                else
                {
                puvs = [
                    0.0,1.0,
                    1.0,1.0,
                    1.0,0.0,
                    0.0,0.0,
                ];
                }
            }
            this.m_uvs = new Float32Array(puvs);
            ROVertexBuffer.AddFloat32Data(this.m_uvs,2);
        }
        ROVertexBuffer.AddFloat32Data(this.m_nvs,3);
        
        
        ROVertexBuffer.vbWholeDataEnabled = this.vbWholeDataEnabled;
        //
        // 如果用 VtxBufData 使用样例, 要注释掉下面四句代码
        this.vtCount = this.m_ivs.length;
        this.m_vbuf = ROVertexBuffer.CreateBySaveData(this.getBufDataUsage());
        this.m_vbuf.setIVSDataAt( this.crateROIvsData().setData(this.m_ivs) );
        this.vtxTotal = 4;
        this.trisNumber = 2;
        this.drawMode = RenderDrawMode.ELEMENTS_TRIANGLES;


        this.buildEnd();
    }
    initializeBill():void
    {
        if(this.m_vs != null)
        {
            return;
        }
        // ccw is positive, left-bottom pos(minX,minY) -> right-bottom pos(maxX,minY) -> right-top pos(maxX,maxY)  -> right-top pos(minX,maxY)
        this.m_ivs = new Uint16Array([0,1,2,0,2,3]);
        this.m_vs = new Float32Array([
            3,  1,
            4,  1,
            4, -1,
            3, -1
        ]);
        
        //  let dpos:any = {x:0,y:0,z:0};
        //  dpos.x = 2.0 * endPos.x - beginPos.x;
        //  dpos.y = 2.0 * endPos.y - beginPos.y;
        //  dpos.z = 2.0 * endPos.z - beginPos.z;
        //  
        //  this.m_nvs = new Float32Array([
        //    endPos.x, endPos.y, endPos.z,
        //    dpos.x,   dpos.y,   dpos.z,
        //    dpos.x,   dpos.y,   dpos.z,
        //    endPos.x, endPos.y, endPos.z
        //  ]);
        
        if(this.bounds == null) this.bounds = new AABB();
        this.bounds.addFloat32Arr(this.m_vs);
        this.bounds.updateFast();

        ROVertexBuffer.Reset();
        ROVertexBuffer.AddFloat32Data(this.m_vs,2);
        if (this.isVBufEnabledAt(VtxBufConst.VBUF_UVS_INDEX))
        {
            let puvs:number[];
            if(this.flipVerticalUV)
            {
                puvs = [
                    0.0,0.0,
                    1.0,0.0,
                    1.0,1.0,
                    0.0,1.0,
                ];
            }
            else
            {
                if(this.flip90UV)
                {
                puvs = [
                1.0,1.0,
                1.0,0.0,
                0.0,0.0,
                0.0,1.0
                ];
                }
                else
                {
                puvs = [
                    0.0,1.0,
                    1.0,1.0,
                    1.0,0.0,
                    0.0,0.0,
                ];
                }
            }
            this.m_uvs = new Float32Array(puvs);
            ROVertexBuffer.AddFloat32Data(this.m_uvs,2);
        }                
        
        ROVertexBuffer.vbWholeDataEnabled = this.vbWholeDataEnabled;
        //
        // 如果用 VtxBufData 使用样例, 要注释掉下面四句代码
        this.vtCount = this.m_ivs.length;
        this.m_vbuf = ROVertexBuffer.CreateBySaveData(this.getBufDataUsage());
        this.m_vbuf.setIVSDataAt( this.crateROIvsData().setData(this.m_ivs) );
        this.vtxTotal = 4;
        this.trisNumber = 2;
        this.drawMode = RenderDrawMode.ELEMENTS_TRIANGLES;


        this.buildEnd();
    }
    
    
    toString():string
    {
        return "[LightLine3DMesh()]";
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
}