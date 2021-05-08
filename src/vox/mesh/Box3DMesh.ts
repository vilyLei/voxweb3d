/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import MathConst from "../../vox/math/MathConst";
import Vector3D from "../../vox/math/Vector3D";
import Matrix4 from "../../vox/math/Matrix4";
import SurfaceNormalCalc from "../../vox/geom/SurfaceNormalCalc";
import VtxBufConst from "../../vox/mesh/VtxBufConst";
import ROVertexBuffer from "../../vox/mesh/ROVertexBuffer";
import {VtxNormalType} from "../../vox/mesh/VtxBufConst";
import AABB from "../../vox/geom/AABB";
import MeshBase from "../../vox/mesh/MeshBase";

export default class Box3DMesh extends MeshBase
{
    private m_posList:number[][] = [null,null,null,null,null,null,null,null];
    private m_pos:Vector3D = new Vector3D();
    constructor(bufDataUsage:number = VtxBufConst.VTX_STATIC_DRAW)
    {
        super(bufDataUsage);
    }
    normalType:number = VtxNormalType.FLAT;

    private m_vs:Float32Array = null;
    private m_uvs:Float32Array = null;
    private m_nvs:Float32Array = null;
    private m_cvs:Float32Array = null;

    flipVerticalUV:boolean = false;
    getVS(){return this.m_vs;}
    getUVS(){return this.m_uvs;}
    getNVS(){return this.m_nvs;}
    getCVS(){return this.m_cvs;}
    
    setPositionAt(i:number, position:Vector3D):void
    {
        if(i >= 0 && i < 8)
        {
            if(this.m_vs != null)
            {
                let arr:number[] = this.m_posList[i];
                arr[0] = position.x;
                arr[1] = position.y;
                arr[2] = position.z;
            }
        }
    }
    getPositionAt(i:number, position:Vector3D):void
    {
        if(i >= 0 && i < 8)
        {
            if(this.m_vs != null)
            {
                let arr:number[] = this.m_posList[i];
                position.x = arr[0];
                position.y = arr[1];
                position.z = arr[2];
            }
        }
    }
    setEdgeAt(i:number, lsPA:Vector3D,lsPB:Vector3D):void
    {
        if(i >= 0 && i < 8)
        {
            if(this.m_vs != null)
            {
                let arr0:number[] = this.m_posList[i];
                i++;
                if(i == 3)i = 0;
                else if(i == 7)i = 4;

                let arr1:number[] = this.m_posList[i];
                arr0[0] = lsPA.x;
                arr0[1] = lsPA.y;
                arr0[2] = lsPA.z;
                arr1[0] = lsPB.x;
                arr1[1] = lsPB.y;
                arr1[2] = lsPB.z;
            }
        }
    }
    getEdgeAt(i:number, lsPA:Vector3D,lsPB:Vector3D):void
    {
        if(i >= 0 && i < 8)
        {
            if(this.m_vs != null)
            {
                let arr0:number[] = this.m_posList[i];
                i++;
                if(i == 3)i = 0;
                else if(i == 7)i = 4;

                let arr1:number[] = this.m_posList[i];
                lsPA.x = arr0[0];
                lsPA.y = arr0[1];
                lsPA.z = arr0[2];
                lsPB.x = arr1[0];
                lsPB.y = arr1[1];
                lsPB.z = arr1[2];
            }
        }
    }
    // face order: -y,+y,+x,-z,-x,+z
    private static s_facePosIds:number[] = [0,1,2,3, 4,5,6,7, 4,5,1,0, 5,6,2,1, 7,6,2,3, 4,7,3,0];
    setFaceAt(i:number, lsPA:Vector3D,lsPB:Vector3D,lsPC:Vector3D,lsPD:Vector3D):void
    {
        if(i >= 0 && i < 8)
        {
            if(this.m_vs != null)
            {
                i *= 4;
                let posList:Vector3D[] = [lsPA,lsPB,lsPC,lsPD];
                let idList:number[] = Box3DMesh.s_facePosIds;
                let list:number[][] = this.m_posList;
                let arr:number[];
                let pos:Vector3D;
                for(let iMax:number = i+4,j:number = 0; i < iMax; ++i)
                {
                    arr = list[idList[i]];
                    pos = posList[j++];
                    arr[0] = pos.x;
                    arr[1] = pos.y;
                    arr[2] = pos.z;
                }
            }
        }
    }
    getFaceAt(i:number, lsPA:Vector3D,lsPB:Vector3D,lsPC:Vector3D,lsPD:Vector3D):void
    {
        if(i >= 0 && i < 8)
        {
            if(this.m_vs != null)
            {
                i *= 4;
                let posList:Vector3D[] = [lsPA,lsPB,lsPC,lsPD];
                let idList:number[] = Box3DMesh.s_facePosIds;
                let list:number[][] = this.m_posList;
                let arr:number[];
                let pos:Vector3D;
                for(let iMax:number = i+4,j:number = 0; i < iMax; ++i)
                {
                    arr = list[idList[i]];
                    pos = posList[j++];
                    pos.x = arr[0];
                    pos.y = arr[1];
                    pos.z = arr[2];
                }
            }
        }
    }
    
    getFaceCenterAt(i:number, outV:Vector3D):void
    {
        if(i >= 0 && i < 8)
        {
            if(this.m_vs != null)
            {
                i *= 4;
                let idList:number[] = Box3DMesh.s_facePosIds;
                let list:number[][] = this.m_posList;
                let arr:number[];
                outV.setXYZ(0.0,0.0,0.0);
                for(let iMax:number = i+4; i < iMax; ++i)
                {
                    arr = list[idList[i]];
                    outV.x += arr[0];
                    outV.y += arr[1];
                    outV.z += arr[2];
                }
                outV.scaleBy(0.33333);
            }
        }
    }
    transformFaceAt(i:number, mat4:Matrix4):void
    {
        if(i >= 0 && i < 8)
        {
            if(this.m_vs != null)
            {
                i *= 4;
                let idList:number[] = Box3DMesh.s_facePosIds;
                let list:number[][] = this.m_posList;
                for(let iMax:number = i+4; i < iMax; ++i)
                {
                    mat4.transformVectorsSelf(list[idList[i]],3);
                }
            }
        }
    }
    initializeWithYFace(bottomFaceMinV:Vector3D,bottomFaceMaxV:Vector3D, topFaceMinV:Vector3D,topFaceMaxV:Vector3D):void
    {
        let minV:Vector3D = bottomFaceMinV;
        let maxV:Vector3D = bottomFaceMaxV;
        let minY:number = (minV.y + maxV.y) * 0.5;
        this.m_posList[0] = [ maxV.x,minY,maxV.z ];
        this.m_posList[1] = [ maxV.x,minY,minV.z ];
        this.m_posList[2] = [ minV.x,minY,minV.z ];
        this.m_posList[3] = [ minV.x,minY,maxV.z ];

        minV = topFaceMinV;
        maxV = topFaceMaxV;
        let maxY:number = (minV.y + maxV.y) * 0.5;
        this.m_posList[4] = [ maxV.x,maxY,maxV.z ];
        this.m_posList[5] = [ maxV.x,maxY,minV.z ];
        this.m_posList[6] = [ minV.x,maxY,minV.z ];
        this.m_posList[7] = [ minV.x,maxY,maxV.z ];

        this.initData(this.m_posList);
    }
    initialize(minV:Vector3D,maxV:Vector3D):void
    {
        this.m_posList[0] = [ maxV.x,minV.y,maxV.z ];
        this.m_posList[1] = [ maxV.x,minV.y,minV.z ];
        this.m_posList[2] = [ minV.x,minV.y,minV.z ];
        this.m_posList[3] = [ minV.x,minV.y,maxV.z ];

        this.m_posList[4] = [ maxV.x,maxV.y,maxV.z ];
        this.m_posList[5] = [ maxV.x,maxV.y,minV.z ];
        this.m_posList[6] = [ minV.x,maxV.y,minV.z ];
        this.m_posList[7] = [ minV.x,maxV.y,maxV.z ];
        
        this.initData(this.m_posList);
    }
    
    scaleUVFaceAt(faceI:number, u:number,v:number,du:number,dv:number)
    {
        if(this.m_uvs != null && faceI >= 0 && faceI < 6)
        {
            let i:number = faceI * 8;
            let t:number = i + 8;
            let uvs:Float32Array = this.m_uvs;
            for(; i < t; i+= 2)
            {
                uvs[i] = u + uvs[i] * du;
                uvs[i+1] = v + uvs[i+1] * dv;
            }
        }
    }
    reinitialize():void
    {
        this.initData(this.m_posList);
    }
    private initData(posList:number[][]):void
    {
        this.vtxTotal = 24;
        let i:number = 0;
        let k:number = 0;
        let baseI:number = 0;
        
        let newBuild:boolean = (this.m_ivs == null);
        if(newBuild)
        {
            this.m_vs = new Float32Array(72);
            this.m_ivs = new Uint16Array(36);
            let flags:number[] = [3,2,3,3,2,2];
            for(i = 0; i < 6; ++i)
            {
                if(flags[i] == 3)
                {
                    this.m_ivs[baseI] = k + 3; this.m_ivs[baseI + 1] = k + 2; this.m_ivs[baseI + 2] = k + 1;
                    this.m_ivs[baseI + 3] = k + 3; this.m_ivs[baseI + 4] = k + 1; this.m_ivs[baseI + 5] = k;
                }
                else
                {
                    this.m_ivs[baseI] = k + 2; this.m_ivs[baseI + 1] = k + 3; this.m_ivs[baseI + 2] = k;
                    this.m_ivs[baseI + 3] = k + 2; this.m_ivs[baseI + 4] = k; this.m_ivs[baseI + 5] = k + 1;
                }
                baseI += 6;
                k += 4;
            }
        }
        let idList:number[] = Box3DMesh.s_facePosIds;
        let list:number[][] = this.m_posList;
        let arr:number[];
        let pvs:Float32Array = this.m_vs;
        k = 0;
        for(i = 0; i < this.vtxTotal; ++i)
        {
            arr = list[idList[i]];
            pvs.set(arr,k);
            k += 3;
        }
        
        this.bounds = new AABB();
        if(this.m_transMatrix != null)
        {
            this.m_transMatrix.transformVectorsSelf(this.m_vs, this.m_vs.length);
            this.bounds.addXYZFloat32Arr( this.m_vs );
        }
        else
        {                    
            this.bounds.addXYZFloat32Arr( this.m_vs );
        }
        this.bounds.updateFast();
        ROVertexBuffer.Reset();
        ROVertexBuffer.AddFloat32Data(this.m_vs,3);

        let faceTotal:number = 6;
        
        if (this.isVBufEnabledAt(VtxBufConst.VBUF_UVS_INDEX))
        {
            if(this.m_uvs == null)
            {
                // uv
                i = 0;
                baseI = this.vtxTotal * 2;
                this.m_uvs = new Float32Array(48);
                if(this.flipVerticalUV)
                {
                    while(i < baseI)
                    {
                        this.m_uvs[i] = 1.0; this.m_uvs[i + 1] = 1.0;
                        this.m_uvs[i + 2] = 0.0; this.m_uvs[i + 3] = 1.0;
                        this.m_uvs[i + 4] = 0.0; this.m_uvs[i + 5] = 0.0;
                        this.m_uvs[i + 6] = 1.0; this.m_uvs[i + 7] = 0.0;            
                        i+=8;
                    }
                }
                else
                {
                    while(i < baseI)
                    {
                        this.m_uvs[i] = 0.0; this.m_uvs[i + 1] = 0.0;
                        this.m_uvs[i + 2] = 1.0; this.m_uvs[i + 3] = 0.0;
                        this.m_uvs[i + 4] = 1.0; this.m_uvs[i + 5] = 1.0;
                        this.m_uvs[i + 6] = 0.0; this.m_uvs[i + 7] = 1.0;
                        i+=8;
                    }
                }
                if (this.isVBufEnabledAt(VtxBufConst.VBUF_TVS_INDEX))
                {
                    baseI = 0;
                    while (baseI < 6)
                    {
                        switch (baseI)
                        {
                        case 0:
                            // -z
                            i = 0;
                            this.m_uvs[i] = 0.0; this.m_uvs[i + 1] = 1.0;
                            this.m_uvs[i + 2] = 1.0; this.m_uvs[i + 3] = 1.0;
                            this.m_uvs[i + 4] = 1.0; this.m_uvs[i + 5] = 0.0;
                            this.m_uvs[i + 6] = 0.0; this.m_uvs[i + 7] = 0.0;
                            break;
                        case 3:
                            // +x
                            i = 24;
                            this.m_uvs[i] = 0.0; this.m_uvs[i + 1] = 1.0;
                            this.m_uvs[i + 2] = 1.0; this.m_uvs[i + 3] = 1.0;
                            this.m_uvs[i + 4] = 1.0; this.m_uvs[i + 5] = 0.0;
                            this.m_uvs[i + 6] = 0.0; this.m_uvs[i + 7] = 0.0;
                            break;
                        case 5:
                            // -y;
                            i = 32;
                            this.m_uvs[i] = 0.0; this.m_uvs[i + 1] = 1.0;
                            this.m_uvs[i + 2] = 1.0; this.m_uvs[i + 3] = 1.0;
                            this.m_uvs[i + 4] = 1.0; this.m_uvs[i + 5] = 0.0;
                            this.m_uvs[i + 6] = 0.0; this.m_uvs[i + 7] = 0.0;
                            break;
                        default:
                            break;
                        }
                        ++baseI;
                    }
                }
            }
            ROVertexBuffer.AddFloat32Data(this.m_uvs, 2);
        }
        
        if (this.isVBufEnabledAt(VtxBufConst.VBUF_NVS_INDEX))
        {
            this.m_nvs = new Float32Array(72);
            baseI = 0;
            let nx = 0.0;
            let ny = 0.0;
            let nz = 0.0;
            if(this.normalType == VtxNormalType.FLAT)
            {
                while (baseI < faceTotal)
                {
                    nx = 0.0; ny = 0.0; nz = 0.0;
                    switch (baseI)
                    {
                    case 0:
                        ny = -1.0;
                        break;
                    case 1:
                        ny = 1.0;
                        break;
                    case 2:
                        nx = 1.0;
                        break;
                    case 3:
                        nz = -1.0;
                        break;
                    case 4:
                        nx = -1.0;
                        break;
                    case 5:
                        nz = 1.0;
                        break;
                    default:
                        break;
                    }
                    
                    i = baseI * 12;
                    nx *= this.normalScale;
                    ny *= this.normalScale;
                    nz *= this.normalScale;
                    this.m_nvs[i] = nx; this.m_nvs[i + 1] = ny; this.m_nvs[i + 2] = nz;
                    this.m_nvs[i+3] = nx; this.m_nvs[i + 4] = ny; this.m_nvs[i + 5] = nz;
                    this.m_nvs[i+6] = nx; this.m_nvs[i + 7] = ny; this.m_nvs[i + 8] = nz;
                    this.m_nvs[i+9] = nx; this.m_nvs[i + 10] = ny; this.m_nvs[i + 11] = nz;

                    ++baseI;
                }
            }
            else
            {
                let centV:Vector3D = this.bounds.center;
                let d:number = 0.0;
                while(baseI < this.vtxTotal)
                {
                    i = baseI * 3;
                    nx = this.m_vs[i] - centV.x;
                    ny = this.m_vs[i+1] - centV.y;
                    nz = this.m_vs[i+2] - centV.z;
                    d = Math.sqrt(nx*nx + ny*ny + nz*nz);
                    
                    if (d > MathConst.MATH_MIN_POSITIVE)
                    {
                        this.m_nvs[i] = nx / d;
                        this.m_nvs[i+1] = ny / d;
                        this.m_nvs[i+2] = nz / d;
                    }
                    ++baseI;
                }
            }
            ROVertexBuffer.AddFloat32Data(this.m_nvs,3);
        }
        if (this.isVBufEnabledAt(VtxBufConst.VBUF_CVS_INDEX))
        {
            this.m_cvs = new Float32Array(72);
            baseI = 0;
            let pr = 1.0;
            let pg = 1.0;
            let pb = 1.0;
            while (baseI < faceTotal)
            {
                i = baseI * 12;
                this.m_cvs[i] = pr; this.m_cvs[i + 1] = pg; this.m_cvs[i + 2] = pb;
                this.m_cvs[i+3] = pr; this.m_cvs[i + 4] = pg; this.m_cvs[i + 5] = pb;
                this.m_cvs[i+6] = pr; this.m_cvs[i + 7] = pg; this.m_cvs[i + 8] = pb;
                this.m_cvs[i+9] = pr; this.m_cvs[i + 10] = pg; this.m_cvs[i + 11] = pb;
                
                ++baseI;
            }
            ROVertexBuffer.AddFloat32Data(this.m_cvs,3);
        }
        if (this.isVBufEnabledAt(VtxBufConst.VBUF_TVS_INDEX))
        {
            let numTriangles = 12;
            let tvs:Float32Array = new Float32Array(this.m_nvs.length);
            let btvs:Float32Array = new Float32Array(this.m_nvs.length);
            SurfaceNormalCalc.ClacTrisTangent(this.m_vs, this.m_vs.length, this.m_uvs, this.m_nvs, numTriangles, this.m_ivs, tvs, btvs);

            ROVertexBuffer.AddFloat32Data(tvs,3);
            ROVertexBuffer.AddFloat32Data(btvs,3);
        }
        ROVertexBuffer.vbWholeDataEnabled = this.vbWholeDataEnabled;
        if(newBuild)
        {
            this.m_vbuf = ROVertexBuffer.CreateBySaveData(this.getBufDataUsage());
            this.m_vbuf.setUint16IVSData(this.m_ivs);
            this.vtCount = this.m_ivs.length;
            this.trisNumber = 12;
            this.buildEnd();
        }
        else
        {
            ROVertexBuffer.UpdateBufData(this.m_vbuf);
        }
    }
    setFaceUVSAt(i:number,uvslen8:Float32Array):void
    {
        if(this.m_uvs != null)
        {
            this.m_uvs.set(uvslen8, i * 8);
        }
    }
    toString():string
    {
        return "Box3DMesh()";
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