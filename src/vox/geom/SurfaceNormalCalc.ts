/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as Vector3DT from "../..//vox/math/Vector3D";
import Vector3D = Vector3DT.vox.math.Vector3D;

export namespace vox
{
    export namespace geom
    {
		export class SurfaceNormalCalc
		{
			static s_temp_va:Vector3D = new Vector3D();
			static s_temp_vb:Vector3D = new Vector3D();
			static s_temp_vc:Vector3D = new Vector3D();
			static s_temp_vd:Vector3D = new Vector3D();
			static s_temp_ve:Vector3D = new Vector3D();
			static s_temp_vf:Vector3D = new Vector3D();
			static s_temp_vg:Vector3D = new Vector3D();
			/**
			* calc a triangle's normal,cw is positive, right hand rule. there is calc result is positive.
			*/
			static ClacTriNormal(va:Vector3D, vb:Vector3D, vc:Vector3D, resultNormal:Vector3D):void
			{
				Vector3D.Subtract(vb,va, SurfaceNormalCalc.s_temp_vb);
				Vector3D.Subtract(vc, vb, SurfaceNormalCalc.s_temp_vc);
				Vector3D.Cross(SurfaceNormalCalc.s_temp_vb, SurfaceNormalCalc.s_temp_vc, resultNormal);
				resultNormal.normalize();
			}
			/**
			* calc a triangle's normal,cw is positive, right hand rule. there is calc result is positive.
			* @param verteies			verteies's length is N multiple 9
			* @param triangleIndex		triangle index of triangles
			* @param resultNormal		result normalize Vector3D normal
			*/
			static ClacTrisNormal(verteies:Float32Array, triangleIndex:number, resultNormal:Vector3D):void
			{
				let i:number = triangleIndex * 9;
				SurfaceNormalCalc.s_temp_va.setTo(verteies[i], verteies[i+1], verteies[i + 2]);
				resultNormal.setTo(verteies[i + 3], verteies[i + 4], verteies[i + 5]);
				SurfaceNormalCalc.s_temp_vc.setTo(verteies[i + 6], verteies[i + 7], verteies[i + 8]);
				resultNormal.subtractBy(SurfaceNormalCalc.s_temp_va);
				SurfaceNormalCalc.s_temp_vc.subtractBy(SurfaceNormalCalc.s_temp_va);
				//vox::kernel::geom::Vector3D::cross(vb, vc, resultNormal);
				resultNormal.crossBy(SurfaceNormalCalc.s_temp_vc);
				resultNormal.normalize();
			}
		    ClacTriNormal(verteies:Float32Array, triangleIndex:number, indices:Uint16Array, resultNormal:Vector3D):void
		    {
		        let j:number = triangleIndex * 3;
		        let i:number = indices[j] * 3;
		        SurfaceNormalCalc.s_temp_va.setTo(verteies[i], verteies[i + 1], verteies[i + 2]);
		        i = indices[j+1] * 3;
		        resultNormal.setTo(verteies[i], verteies[i + 1], verteies[i + 2]);
		        i = indices[j + 2] * 3;
		        SurfaceNormalCalc.s_temp_vc.setTo(verteies[i], verteies[i + 1], verteies[i + 2]);
				//trace(triangleIndex, ", v3a: ", SurfaceNormalCalc.s_temp_va, ", v3b: ", resultNormal, ", v3c: ", SurfaceNormalCalc.s_temp_vc);
		        resultNormal.subtractBy(SurfaceNormalCalc.s_temp_va);
		        SurfaceNormalCalc.s_temp_vc.subtractBy(SurfaceNormalCalc.s_temp_va);
		        resultNormal.crossBy(SurfaceNormalCalc.s_temp_vc);
		        resultNormal.normalize();
				//trace("						normal: ", resultNormal);
		    }
		    ClacTrisNormal(verteies:Float32Array, verteiesLength:number, numTriangles:number, indices:Uint16Array, normals:Float32Array):void
		    {
		        let v3:Vector3D = new Vector3D();
		        let j:number = 0, k:number = 0,i:number = 0;
		        for (i = 0; i < verteiesLength; ++i)
		        {
		            normals[i] = 0.0;
		        }
		        for (i = 0; i < numTriangles; ++i)
		        {
		            this.ClacTriNormal(verteies, i, indices, v3);
				
		            j = i * 3;
		            k = indices[j] * 3;
		            normals[k] += v3.x; normals[k + 1] += v3.y; normals[k + 2] += v3.z;
		            k = indices[j + 1] * 3;
		            normals[k] += v3.x; normals[k + 1] += v3.y; normals[k + 2] += v3.z;
		            k = indices[j + 2] * 3;
		            normals[k] += v3.x; normals[k + 1] += v3.y; normals[k + 2] += v3.z;
		        }
		        for (i = 0; i < verteiesLength; i+=3)
		        {
		            SurfaceNormalCalc.s_temp_va.setTo(normals[i], normals[i + 1], normals[i + 2]);
		            SurfaceNormalCalc.s_temp_va.normalize();
		            normals[i] = SurfaceNormalCalc.s_temp_va.x; normals[i + 1] = SurfaceNormalCalc.s_temp_va.y; normals[i + 2] = SurfaceNormalCalc.s_temp_va.z;
		        }                
		    }
			static ClacTriTangent(verteies:Float32Array, uvs:Float32Array, nvs:Float32Array, triangleIndex:number, indices:Uint16Array|Uint32Array, tangent:Vector3D, biTangent:Vector3D):void
			{
				let j:number = triangleIndex * 3;
				// pos
				let i:number = indices[j] * 3;
				SurfaceNormalCalc.s_temp_va.setTo(nvs[i], nvs[i + 1], nvs[i + 2]);
				SurfaceNormalCalc.s_temp_va.setTo(verteies[i], verteies[i + 1], verteies[i + 2]);
				i = indices[j + 1] * 3;
				SurfaceNormalCalc.s_temp_vb.setTo(verteies[i], verteies[i + 1], verteies[i + 2]);
				i = indices[j + 2] * 3;
				SurfaceNormalCalc.s_temp_vc.setTo(verteies[i], verteies[i + 1], verteies[i + 2]);
				// uv
				i = indices[j] * 2;
				SurfaceNormalCalc.s_temp_vd.setTo(uvs[i], uvs[i + 1], 0.0);
				i = indices[j + 1] * 2;
				SurfaceNormalCalc.s_temp_ve.setTo(uvs[i], uvs[i + 1], 0.0);
				i = indices[j + 2] * 2;
				SurfaceNormalCalc.s_temp_vf.setTo(uvs[i], uvs[i + 1], 0.0);
				// edges of pos
				SurfaceNormalCalc.s_temp_vb.subtractBy(SurfaceNormalCalc.s_temp_va);
				SurfaceNormalCalc.s_temp_vc.subtractBy(SurfaceNormalCalc.s_temp_va);
				SurfaceNormalCalc.s_temp_ve.subtractBy(SurfaceNormalCalc.s_temp_vd);
				SurfaceNormalCalc.s_temp_vf.subtractBy(SurfaceNormalCalc.s_temp_vd);
				let dt:number = 1.0 / (SurfaceNormalCalc.s_temp_ve.x * SurfaceNormalCalc.s_temp_vf.y - SurfaceNormalCalc.s_temp_ve.y * SurfaceNormalCalc.s_temp_vf.x);
			
				tangent.copyFrom(SurfaceNormalCalc.s_temp_vb);
				tangent.scaleBy(SurfaceNormalCalc.s_temp_vf.y);
				SurfaceNormalCalc.s_temp_va.copyFrom(SurfaceNormalCalc.s_temp_vc);
				SurfaceNormalCalc.s_temp_va.scaleBy(SurfaceNormalCalc.s_temp_ve.y);
				tangent.subtractBy(SurfaceNormalCalc.s_temp_va);
				tangent.scaleBy(dt);
				tangent.normalize();
				biTangent.copyFrom(SurfaceNormalCalc.s_temp_vc);
				biTangent.scaleBy(SurfaceNormalCalc.s_temp_ve.x);
				SurfaceNormalCalc.s_temp_va.copyFrom(SurfaceNormalCalc.s_temp_vb);
				SurfaceNormalCalc.s_temp_va.scaleBy(SurfaceNormalCalc.s_temp_vf.x);
				biTangent.subtractBy(SurfaceNormalCalc.s_temp_va);
				biTangent.scaleBy(dt);
				biTangent.normalize();
				//*/
			}
			static ClacTrisTangent(verteies:Float32Array, verteiesLength:number, uvs:Float32Array, nvs:Float32Array, numTriangles:number, indices:Uint16Array | Uint32Array, tangent:Float32Array, biTangent:Float32Array):void
			{
				let tv3:Vector3D = new Vector3D(), btv3:Vector3D = new Vector3D();
				let j:number = 0, k:number = 0, i:number = 0;
				for (i = 0; i < verteiesLength; ++i)
				{
					tangent[i] = 0.0;
					biTangent[i] = 0.0;
				}
				for (i = 0; i < numTriangles; ++i)
				{
					SurfaceNormalCalc.ClacTriTangent(verteies, uvs, nvs, i, indices, tv3, btv3);
					j = i * 3;
					k = indices[j] * 3;
					tangent[k] = tv3.x; tangent[k + 1] = tv3.y; tangent[k + 2] = tv3.z;
					biTangent[k] = btv3.x; biTangent[k + 1] = btv3.y; biTangent[k + 2] = btv3.z;
					k = indices[j + 1] * 3;
					tangent[k] = tv3.x; tangent[k + 1] = tv3.y; tangent[k + 2] = tv3.z;
					biTangent[k] = btv3.x; biTangent[k + 1] = btv3.y; biTangent[k + 2] = btv3.z;
					k = indices[j + 2] * 3;
					tangent[k] = tv3.x; tangent[k + 1] = tv3.y; tangent[k + 2] = tv3.z;
					biTangent[k] = btv3.x; biTangent[k + 1] = btv3.y; biTangent[k + 2] = btv3.z;
				}
				for (i = 0; i < verteiesLength; i += 3)
				{
					SurfaceNormalCalc.s_temp_vd.setTo(tangent[i], tangent[i + 1], tangent[i + 2]);
					SurfaceNormalCalc.s_temp_vd.normalize();
					SurfaceNormalCalc.s_temp_vb.setTo(biTangent[i], biTangent[i + 1], biTangent[i + 2]);
					SurfaceNormalCalc.s_temp_vb.normalize();
					SurfaceNormalCalc.s_temp_vc.setTo(nvs[i], nvs[i + 1], nvs[i + 2]);
					SurfaceNormalCalc.s_temp_va.copyFrom(SurfaceNormalCalc.s_temp_vc);
					SurfaceNormalCalc.s_temp_vc.scaleBy(SurfaceNormalCalc.s_temp_vc.dot(SurfaceNormalCalc.s_temp_vd));
					SurfaceNormalCalc.s_temp_vd.subtractBy(SurfaceNormalCalc.s_temp_vc);
					SurfaceNormalCalc.s_temp_vd.normalize();
					//b = b - n * dot( b, n )
					SurfaceNormalCalc.s_temp_vc.setTo(nvs[i], nvs[i + 1], nvs[i + 2]);
					SurfaceNormalCalc.s_temp_vc.scaleBy(SurfaceNormalCalc.s_temp_vb.dot(SurfaceNormalCalc.s_temp_vc));
					SurfaceNormalCalc.s_temp_vb.subtractBy(SurfaceNormalCalc.s_temp_vc);
					SurfaceNormalCalc.s_temp_vb.normalize();
					SurfaceNormalCalc.s_temp_va.crossBy(SurfaceNormalCalc.s_temp_vd);
					if (SurfaceNormalCalc.s_temp_va.dot(SurfaceNormalCalc.s_temp_vb) < 0.0)
					{
						SurfaceNormalCalc.s_temp_vd.scaleBy(-1.0);
					}
					tangent[i] = SurfaceNormalCalc.s_temp_vd.x; tangent[i + 1] = SurfaceNormalCalc.s_temp_vd.y; tangent[i + 2] = SurfaceNormalCalc.s_temp_vd.z;
					SurfaceNormalCalc.s_temp_vb.setTo(nvs[i], nvs[i + 1], nvs[i + 2]);
					SurfaceNormalCalc.s_temp_vb.crossBy(SurfaceNormalCalc.s_temp_vd);
					SurfaceNormalCalc.s_temp_vb.normalize();
					biTangent[i] = SurfaceNormalCalc.s_temp_vb.x; biTangent[i + 1] = SurfaceNormalCalc.s_temp_vb.y; biTangent[i + 2] = SurfaceNormalCalc.s_temp_vb.z;
				}
			}				
		}
	}
}