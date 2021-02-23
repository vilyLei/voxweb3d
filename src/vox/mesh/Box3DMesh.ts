/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as MathConstT from "../../vox/utils/MathConst";
import * as Vector3DT from "../../vox/geom/Vector3";
import * as SurfaceNormalCalcT from "../../vox/geom/SurfaceNormalCalc";
import * as VtxBufConstT from "../../vox/mesh/VtxBufConst";
import * as ROVertexBufferT from "../../vox/mesh/ROVertexBuffer";
import * as AABBT from "../../vox/geom/AABB";
import * as MeshBaseT from "../../vox/mesh/MeshBase";

import MathConst = MathConstT.vox.utils.MathConst;
import Vector3D = Vector3DT.vox.geom.Vector3D;
import SurfaceNormalCalc = SurfaceNormalCalcT.vox.geom.SurfaceNormalCalc;
import VtxBufConst = VtxBufConstT.vox.mesh.VtxBufConst;
import VtxNormalType = VtxBufConstT.vox.mesh.VtxNormalType;
import ROVertexBuffer = ROVertexBufferT.vox.mesh.ROVertexBuffer;
import AABB = AABBT.vox.geom.AABB;
import MeshBase = MeshBaseT.vox.mesh.MeshBase;

export namespace vox
{
    export namespace mesh
    {
        export class Box3DMesh extends MeshBase
        {
            constructor(bufDataUsage:number = VtxBufConst.VTX_STATIC_DRAW)
            {
                super(bufDataUsage);
            }
            m_normalType:number = VtxNormalType.FLAT;
        
            private m_vs:Float32Array = null;
            private m_uvs:Float32Array = null;
            private m_nvs:Float32Array = null;
            private m_cvs:Float32Array = null;

            flipVerticalUV:boolean = false;
            getVS(){return this.m_vs;}
            getUVS(){return this.m_uvs;}
            getNVS(){return this.m_nvs;}
            getCVS(){return this.m_cvs;}
            initialize(minV:Vector3D,maxV:Vector3D):void
            {
                this.bounds = new AABB();
                this.bounds.min.copyFrom(minV);
                this.bounds.max.copyFrom(maxV);
                this.bounds.updateFast();
                let point0:number[] = [ maxV.x,minV.y,maxV.z ];
        		let point1:number[] = [ maxV.x,minV.y,minV.z ];
        		let point2:number[] = [ minV.x,minV.y,minV.z ];
        		let point3:number[] = [ minV.x,minV.y,maxV.z ];
        		let point4:number[] = [ maxV.x,maxV.y,maxV.z ];
        		let point5:number[] = [ maxV.x,maxV.y,minV.z ];
        		let point6:number[] = [ minV.x,maxV.y,minV.z ];
        		let point7:number[] = [ minV.x,maxV.y,maxV.z ];
                //
                this.vtxTotal = 24;
                //
                let i:number = 0;
                let baseI:number = 0;
                let k:number = 0;
                //
        		this.m_vs = new Float32Array(72);
                this.m_ivs = new Uint16Array(36);
        		//--------------------------------------------face0------------------------------------------
        		// -z 5621->->(126,165)->(321,310)
        		this.m_vs[i + 0] = point5[0]; this.m_vs[i + 1] = point5[1]; this.m_vs[i + 2] = point5[2];
                this.m_vs[i + 3] = point6[0]; this.m_vs[i + 4] = point6[1]; this.m_vs[i + 5] = point6[2];
                this.m_vs[i + 6] = point2[0]; this.m_vs[i + 7] = point2[1]; this.m_vs[i + 8] = point2[2];
                this.m_vs[i + 9] = point1[0]; this.m_vs[i + 10] = point1[1]; this.m_vs[i + 11] = point1[2];
                //
                this.m_ivs[baseI] = 3; this.m_ivs[baseI+1] = 2; this.m_ivs[baseI+2] = 1;
                this.m_ivs[baseI + 3] = 3; this.m_ivs[baseI + 4] = 1; this.m_ivs[baseI + 5] = 0;
        		//--------------------------------------------face1------------------------------------------
        		// +z 4730->(304,347)->(674,645)
        		i += 12;
                this.m_vs[i + 0] = point4[0]; this.m_vs[i + 1] = point4[1]; this.m_vs[i + 2] = point4[2];
                this.m_vs[i + 3] = point7[0]; this.m_vs[i + 4] = point7[1]; this.m_vs[i + 5] = point7[2];
                this.m_vs[i + 6] = point3[0]; this.m_vs[i + 7] = point3[1]; this.m_vs[i + 8] = point3[2];
                this.m_vs[i + 9] = point0[0]; this.m_vs[i + 10] = point0[1]; this.m_vs[i + 11] = point0[2];
                //
                baseI += 6;
                k += 4;
                this.m_ivs[baseI] = k+2; this.m_ivs[baseI + 1] = k+3; this.m_ivs[baseI + 2] = k;
                this.m_ivs[baseI + 3] = k+2; this.m_ivs[baseI + 4] = k; this.m_ivs[baseI + 5] = k+1;
        		//--------------------------------------------face2------------------------------------------
        		// -x 7623->(237,276)->(10 11 8,10 8 9)
                i += 12;
                this.m_vs[i + 0] = point7[0]; this.m_vs[i + 1] = point7[1]; this.m_vs[i + 2] = point7[2];
                this.m_vs[i + 3] = point6[0]; this.m_vs[i + 4] = point6[1]; this.m_vs[i + 5] = point6[2];
                this.m_vs[i + 6] = point2[0]; this.m_vs[i + 7] = point2[1]; this.m_vs[i + 8] = point2[2];
                this.m_vs[i + 9] = point3[0]; this.m_vs[i + 10] = point3[1]; this.m_vs[i + 11] = point3[2];
                //
                baseI += 6;
                k += 4;
                this.m_ivs[baseI] = k + 2; this.m_ivs[baseI + 1] = k + 3; this.m_ivs[baseI + 2] = k;
                this.m_ivs[baseI + 3] = k + 2; this.m_ivs[baseI + 4] = k; this.m_ivs[baseI + 5] = k + 1;                    
        		//--------------------------------------------face3------------------------------------------
        		// +x 4510->(015,054)->(15 14 13,15 13 12 )
                i += 12;
                this.m_vs[i + 0] = point4[0]; this.m_vs[i + 1] = point4[1]; this.m_vs[i + 2] = point4[2];
                this.m_vs[i + 3] = point5[0]; this.m_vs[i + 4] = point5[1]; this.m_vs[i + 5] = point5[2];
                this.m_vs[i + 6] = point1[0]; this.m_vs[i + 7] = point1[1]; this.m_vs[i + 8] = point1[2];
                this.m_vs[i + 9] = point0[0]; this.m_vs[i + 10] = point0[1]; this.m_vs[i + 11] = point0[2];
                //
                baseI += 6;
                k += 4;
                this.m_ivs[baseI] = k + 3; this.m_ivs[baseI + 1] = k + 2; this.m_ivs[baseI + 2] = k + 1;
                this.m_ivs[baseI + 3] = k + 3; this.m_ivs[baseI + 4] = k + 1; this.m_ivs[baseI + 5] = k;
        		//--------------------------------------------face4------------------------------------------//
                // -y 0321->(210,203)->()
                i += 12;
                this.m_vs[i + 0] = point0[0]; this.m_vs[i + 1] = point0[1]; this.m_vs[i + 2] = point0[2];
                this.m_vs[i + 3] = point1[0]; this.m_vs[i + 4] = point1[1]; this.m_vs[i + 5] = point1[2];
                this.m_vs[i + 6] = point2[0]; this.m_vs[i + 7] = point2[1]; this.m_vs[i + 8] = point2[2];
                this.m_vs[i + 9] = point3[0]; this.m_vs[i + 10] = point3[1]; this.m_vs[i + 11] = point3[2];
                //
                baseI += 6;
                k += 4;
                this.m_ivs[baseI] = k + 3; this.m_ivs[baseI + 1] = k + 2; this.m_ivs[baseI + 2] = k + 1;
                this.m_ivs[baseI + 3] = k + 3; this.m_ivs[baseI + 4] = k + 1; this.m_ivs[baseI + 5] = k;
        		//--------------------------------------------face5------------------------------------------					
                // +y 4567->(567,574)
                i += 12;
                this.m_vs[i + 0] = point4[0]; this.m_vs[i + 1] = point4[1]; this.m_vs[i + 2] = point4[2];
                this.m_vs[i + 3] = point5[0]; this.m_vs[i + 4] = point5[1]; this.m_vs[i + 5] = point5[2];
                this.m_vs[i + 6] = point6[0]; this.m_vs[i + 7] = point6[1]; this.m_vs[i + 8] = point6[2];
                this.m_vs[i + 9] = point7[0]; this.m_vs[i + 10] = point7[1]; this.m_vs[i + 11] = point7[2];

                if(this.m_transMatrix != null)
                {
                    this.m_transMatrix.transformVectorsSelf(this.m_vs, this.m_vs.length);
                    this.bounds.addXYZFloat32Arr( this.m_vs );
                    this.bounds.updateFast();
                }
                ROVertexBuffer.Reset();
                ROVertexBuffer.AddFloat32Data(this.m_vs,3);

                baseI += 6;
                k += 4;
                this.m_ivs[baseI] = k + 2; this.m_ivs[baseI + 1] = k + 3; this.m_ivs[baseI + 2] = k;
                this.m_ivs[baseI + 3] = k + 2; this.m_ivs[baseI + 4] = k; this.m_ivs[baseI + 5] = k + 1;
            
                let faceTotal:number = 6;
                
        		if (this.isVBufEnabledAt(VtxBufConst.VBUF_UVS_INDEX))
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
                    ROVertexBuffer.AddFloat32Data(this.m_uvs, 2);
                }
                
        		if (this.isVBufEnabledAt(VtxBufConst.VBUF_NVS_INDEX))
        		{
                    this.m_nvs = new Float32Array(72);
                    baseI = 0;
                    let nx = 0.0;
                    let ny = 0.0;
                    let nz = 0.0;
                    if(this.m_normalType == VtxNormalType.FLAT)
                    {
        			    while (baseI < faceTotal)
        			    {
                            nx = 0.0; ny = 0.0; nz = 0.0;
                            switch (baseI)
                            {
                            case 0:
                                nz = -1.0;
                                break;
                            case 1:
                                nz = 1.0;
                                break;
                            case 2:
                                nx = -1.0;
                                break;
                            case 3:
                                nx = 1.0;
                                break;
                            case 4:
                                ny = -1.0;
                                break;
                            case 5:
                                ny = 1.0;
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
                        let centV:Vector3D = new Vector3D((minV.x + maxV.x) * 0.5,(minV.y + maxV.y) * 0.5,(minV.z + maxV.z) * 0.5);
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
                this.m_vbuf = ROVertexBuffer.CreateBySaveData(this.getBufDataUsage());
                this.m_vbuf.setUint16IVSData(this.m_ivs);
                this.vtCount = this.m_ivs.length;
                this.trisNumber = 12;
                
                this.buildEnd();
            }
            setFaceUVSAt(uvslen8:Float32Array,i:number):void
            {
                if(this.m_uvs != null)
                {
                    this.m_uvs.set(uvslen8,i * 8);
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

    }
}