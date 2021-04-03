/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as Vector3DT from "../../../vox/math/Vector3D";
import * as Matrix4T from "../../../vox/math/Matrix4";
import * as AABBT from "../../../vox/geom/AABB";
import * as MeshBaseT from "../../../vox/mesh/GeometryBase"

import Vector3D = Vector3DT.vox.math.Vector3D;
import Matrix4 = Matrix4T.vox.math.Matrix4;
import AABB = AABBT.vox.geom.AABB;
import GeometryBase = MeshBaseT.vox.mesh.GeometryBase;

export namespace voxmesh
{
    export namespace geometry
    {
        export namespace primitive
        {
            export class PipeGeometry extends GeometryBase
            {
                private m_longitudeNum:number = 0;
                private m_latitudeNum:number = 0;
                uScale:number = 1.0;
                vScale:number = 1.0;
            
                constructor()
                {
                    super();
                }
                getCircleCenterAt(i:number, outV:Vector3D):void
                {
                    if(i >= 0 && i <= this.m_latitudeNum)
                    {
                        if(this.m_vs != null)
                        {
                            outV.setXYZ(0.0,0.0,0.0);
                            let pvs:Float32Array = this.m_vs;
                            let end:number = (i+1) * (this.m_longitudeNum+1) * 3;
                            i = (i * (this.m_longitudeNum+1)) * 3;
                            end -= 3;
                            //console.log("i: "+i,end);
                            for(; i < end; i += 3)
                            {
                                outV.x += pvs[i];
                                outV.y += pvs[i+1];
                                outV.z += pvs[i+2];
                            }
                            outV.scaleBy(1.0/this.m_longitudeNum);                        
                        }
                    }
                }
                transformCircleAt(i:number, mat4:Matrix4):void
                {
                    if(i >= 0 && i <= this.m_latitudeNum)
                    {
                        let pvs:Float32Array = this.m_vs;
                        let end:number = (i+1) * (this.m_longitudeNum+1) * 3;
                        i = (i * (this.m_longitudeNum+1)) * 3;
                        mat4.transformVectorsRangeSelf(pvs,i,end);
                    }
                }
                getVS():Float32Array{return this.m_vs;}
                getUVS():Float32Array{return this.m_uvs;}
                getIVS():Uint16Array|Uint32Array{return this.m_ivs;}
                initialize(radius:number, height:number, longitudeNumSegments:number, latitudeNumSegments:number,uvType:number = 1, alignYRatio:number = -0.5):void
                {
                    let i:number = 0;
                    let j:number = 0;
                    if (radius < 0.01) radius = 0.01;
                    if (longitudeNumSegments < 2) longitudeNumSegments = 2;
                    if (latitudeNumSegments < 1) latitudeNumSegments = 1;
                    this.m_longitudeNum = longitudeNumSegments;
                    this.m_latitudeNum = latitudeNumSegments;
                
                    let m_radius:number = Math.abs(radius);
                    let ph:number = Math.abs(height);
                    
                    let yRad:number = 0;
                    let px:number = 0;
                    let py:number = 0;
                    let minY:number = alignYRatio * ph;
                
                    this.bounds = new AABB();
                    this.bounds.min.setXYZ(-radius,minY,-radius);
                    this.bounds.max.setXYZ(radius,minY + ph,radius);
                    this.bounds.updateFast();
                    
                    let vtx:Vector3D = new Vector3D();
                    let srcRow:Vector3D[] = [];
                    let pv:Vector3D;
                    let pi2:number = Math.PI * 2;
                    for (i = 0; i < 1; ++i)
                    {
                        for (j = 0; j < longitudeNumSegments; ++j) {
                            yRad = (pi2 * j) / longitudeNumSegments;
                            px = Math.sin(yRad);
                            py = Math.cos(yRad);                            
                            vtx.x = px * m_radius;
                            vtx.z = py * m_radius;
                            pv = new Vector3D(vtx.x,vtx.y,vtx.z,1.0);
                            srcRow.push(pv);
                        }
                        srcRow.push(srcRow[0]);
                    }                
                    this.vtxTotal = (longitudeNumSegments + 1) * (latitudeNumSegments + 1);
                    this.m_vs = new Float32Array(this.vtxTotal * 3);
                    this.m_uvs = new Float32Array(this.vtxTotal * 3);
                    // calc cylinder wall vertexes
                    let tot:number = latitudeNumSegments;
                    let k:number = 0;
                    let l:number = 0;
                    console.log("latitudeNumSegments: ",latitudeNumSegments," vtx tot: ",this.vtxTotal);
                    for (i = 0; i <= tot; ++i)
                    {
                        px = i/tot;
                        py = minY + ph * px;
                        for (j = 0; j <= longitudeNumSegments; ++j)
                        {
                            if (uvType < 1)
                            {
                                this.m_uvs[l++] = this.uScale * (j / longitudeNumSegments);
                                this.m_uvs[l++] = this.uScale * px;
                            }
                            else
                            {
                                this.m_uvs[l++] = this.uScale * px;
                                this.m_uvs[l++] = this.uScale * (j / longitudeNumSegments);
                            }
                            this.m_vs[k++] = srcRow[j].x; this.m_vs[k++] = py; this.m_vs[k++] = srcRow[j].z;
                        }
                    }                
                    let cn:number = longitudeNumSegments + 1;
                    let a:number = 0;
                    let b:number = 0;
                    this.m_ivs = new Uint16Array(tot * longitudeNumSegments * 6);
                    k = 0;
                    for (i = 0; i < tot; ++i)
                    {
                        a = i * cn;
                        b = (i + 1) * cn;
                        for (j = 1; j <= longitudeNumSegments; ++j)
                        {
                            this.m_ivs[k++] = a+j;this.m_ivs[k++] = b+j - 1;this.m_ivs[k++] = a+j - 1;
                            this.m_ivs[k++] = a+j;this.m_ivs[k++] = b+j;this.m_ivs[k++] = b+j - 1;
                        }
                    }
                    this.vtCount = this.m_ivs.length;
                    this.trisNumber = this.vtCount/3;
                }            
                toString():string
                {
                    return "PipeGeometry()";
                }
            }
        }
    }
}
