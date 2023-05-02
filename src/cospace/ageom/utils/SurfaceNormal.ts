/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IVector3D from "../../../vox/math/IVector3D";
import { ICoMath } from "../../math/ICoMath";
declare var CoMath: ICoMath;


let _sfnva: IVector3D = null;
let _sfnvb: IVector3D = null;
let _sfnvc: IVector3D = null;
let _sfnvd: IVector3D = null;
let _sfnve: IVector3D = null;
let _sfnvf: IVector3D = null;
let _sfnvg: IVector3D = null;
function __$$$InitSFN(): void {
	if(_sfnva == null) {
		_sfnva = CoMath.createVec3();
		_sfnvb = CoMath.createVec3();
		_sfnvc = CoMath.createVec3();
		_sfnvd = CoMath.createVec3();
		_sfnve = CoMath.createVec3();
		_sfnvf = CoMath.createVec3();
		_sfnvg = CoMath.createVec3();
	}
}
class SurfaceNormal {
	/**
	* calc a triangle's normal,cw is positive, right hand rule. there is calc result is positive.
	*/
	static ClacTriNormal(va: IVector3D, vb: IVector3D, vc: IVector3D, resultNormal: IVector3D): void {
		__$$$InitSFN();
		const V3 = CoMath.Vector3D;
		V3.Subtract(vb, va, _sfnvb);
		V3.Subtract(vc, vb, _sfnvc);
		V3.Cross(_sfnvb, _sfnvc, resultNormal);
		resultNormal.normalize();
	}
	/**
	* calc a triangle's normal,cw is positive, right hand rule. there is calc result is positive.
	* @param verteies			verteies's length is N multiple 9
	* @param triangleIndex		triangle index of triangles
	* @param resultNormal		result normalize IVector3D normal
	*/
	static ClacTriNormalByVS(verteies: Float32Array, triangleIndex: number, resultNormal: IVector3D): void {
		__$$$InitSFN();
		let i: number = triangleIndex * 9;
		_sfnva.setTo(verteies[i], verteies[i + 1], verteies[i + 2]);
		resultNormal.setTo(verteies[i + 3], verteies[i + 4], verteies[i + 5]);
		_sfnvc.setTo(verteies[i + 6], verteies[i + 7], verteies[i + 8]);
		resultNormal.subtractBy(_sfnva);
		_sfnvc.subtractBy(_sfnva);
		//vox::kernel::geom::IVector3D::cross(vb, vc, resultNormal);
		resultNormal.crossBy(_sfnvc);
		resultNormal.normalize();
	}
	static ClacTriNormalByIVS(verteies: Float32Array, triangleIndex: number, indices: Uint16Array | Uint32Array, resultNormal: IVector3D): void {
		__$$$InitSFN();
		let j: number = triangleIndex * 3;
		let i: number = indices[j] * 3;
		_sfnva.setTo(verteies[i], verteies[i + 1], verteies[i + 2]);
		i = indices[j + 1] * 3;
		resultNormal.setTo(verteies[i], verteies[i + 1], verteies[i + 2]);
		i = indices[j + 2] * 3;
		_sfnvc.setTo(verteies[i], verteies[i + 1], verteies[i + 2]);
		//trace(triangleIndex, ", v3a: ", SurfaceNormal._sfnva, ", v3b: ", resultNormal, ", v3c: ", SurfaceNormal._sfnvc);
		resultNormal.subtractBy(_sfnva);
		_sfnvc.subtractBy(_sfnva);
		resultNormal.crossBy(_sfnvc);
		resultNormal.normalize();
		//trace("						normal: ", resultNormal);
	}
	static ClacTrisNormal(verteies: Float32Array, verteiesLength: number, numTriangles: number, indices: Uint16Array | Uint32Array, normals: Float32Array): void {
		__$$$InitSFN();
		let calc = SurfaceNormal;
		let v3: IVector3D = CoMath.createVec3();
		let j: number = 0, k: number = 0, i: number = 0;
		for (i = 0; i < verteiesLength; ++i) {
			normals[i] = 0.0;
		}
		for (i = 0; i < numTriangles; ++i) {
			calc.ClacTriNormalByIVS(verteies, i, indices, v3);

			j = i * 3;
			k = indices[j] * 3;
			normals[k] += v3.x; normals[k + 1] += v3.y; normals[k + 2] += v3.z;
			k = indices[j + 1] * 3;
			normals[k] += v3.x; normals[k + 1] += v3.y; normals[k + 2] += v3.z;
			k = indices[j + 2] * 3;
			normals[k] += v3.x; normals[k + 1] += v3.y; normals[k + 2] += v3.z;
		}
		for (i = 0; i < verteiesLength; i += 3) {
			_sfnva.setTo(normals[i], normals[i + 1], normals[i + 2]);
			_sfnva.normalize();
			normals[i] = _sfnva.x; normals[i + 1] = _sfnva.y; normals[i + 2] = _sfnva.z;
		}
	}
	static ClacTriTangent(verteies: Float32Array, uvs: Float32Array, nvs: Float32Array, triangleIndex: number, indices: Uint16Array | Uint32Array, tangent: IVector3D, biTangent: IVector3D): void {
		__$$$InitSFN();
		let j: number = triangleIndex * 3;
		// pos
		let i: number = indices[j] * 3;
		_sfnva.setTo(nvs[i], nvs[i + 1], nvs[i + 2]);
		_sfnva.setTo(verteies[i], verteies[i + 1], verteies[i + 2]);
		i = indices[j + 1] * 3;
		_sfnvb.setTo(verteies[i], verteies[i + 1], verteies[i + 2]);
		i = indices[j + 2] * 3;
		_sfnvc.setTo(verteies[i], verteies[i + 1], verteies[i + 2]);
		// uv
		i = indices[j] * 2;
		_sfnvd.setTo(uvs[i], uvs[i + 1], 0.0);
		i = indices[j + 1] * 2;
		_sfnve.setTo(uvs[i], uvs[i + 1], 0.0);
		i = indices[j + 2] * 2;
		_sfnvf.setTo(uvs[i], uvs[i + 1], 0.0);
		// edges of pos
		_sfnvb.subtractBy(_sfnva);
		_sfnvc.subtractBy(_sfnva);
		_sfnve.subtractBy(_sfnvd);
		_sfnvf.subtractBy(_sfnvd);
		let dt: number = 1.0 / (_sfnve.x * _sfnvf.y - _sfnve.y * _sfnvf.x);

		tangent.copyFrom(_sfnvb);
		tangent.scaleBy(_sfnvf.y);
		_sfnva.copyFrom(_sfnvc);
		_sfnva.scaleBy(_sfnve.y);
		tangent.subtractBy(_sfnva);
		tangent.scaleBy(dt);
		tangent.normalize();
		biTangent.copyFrom(_sfnvc);
		biTangent.scaleBy(_sfnve.x);
		_sfnva.copyFrom(_sfnvb);
		_sfnva.scaleBy(_sfnvf.x);
		biTangent.subtractBy(_sfnva);
		biTangent.scaleBy(dt);
		biTangent.normalize();
		//*/
	}
	static ClacTrisTangent(verteies: Float32Array, verteiesLength: number, uvs: Float32Array, nvs: Float32Array, numTriangles: number, indices: Uint16Array | Uint32Array, tangent: Float32Array, biTangent: Float32Array): void {
		__$$$InitSFN();
		let calc = SurfaceNormal;
		let tv3 = CoMath.createVec3(), btv3 = CoMath.createVec3();
		let j: number = 0, k: number = 0, i: number = 0;
		for (i = 0; i < verteiesLength; ++i) {
			tangent[i] = 0.0;
			biTangent[i] = 0.0;
		}
		for (i = 0; i < numTriangles; ++i) {
			calc.ClacTriTangent(verteies, uvs, nvs, i, indices, tv3, btv3);
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
		for (i = 0; i < verteiesLength; i += 3) {
			_sfnvd.setTo(tangent[i], tangent[i + 1], tangent[i + 2]);
			_sfnvd.normalize();
			_sfnvb.setTo(biTangent[i], biTangent[i + 1], biTangent[i + 2]);
			_sfnvb.normalize();
			_sfnvc.setTo(nvs[i], nvs[i + 1], nvs[i + 2]);
			_sfnva.copyFrom(_sfnvc);
			_sfnvc.scaleBy(_sfnvc.dot(_sfnvd));
			_sfnvd.subtractBy(_sfnvc);
			_sfnvd.normalize();
			//b = b - n * dot( b, n )
			_sfnvc.setTo(nvs[i], nvs[i + 1], nvs[i + 2]);
			_sfnvc.scaleBy(_sfnvb.dot(_sfnvc));
			_sfnvb.subtractBy(_sfnvc);
			_sfnvb.normalize();
			_sfnva.crossBy(_sfnvd);
			if (_sfnva.dot(_sfnvb) < 0.0) {
				_sfnvd.scaleBy(-1.0);
			}
			tangent[i] = _sfnvd.x; tangent[i + 1] = _sfnvd.y; tangent[i + 2] = _sfnvd.z;
			_sfnvb.setTo(nvs[i], nvs[i + 1], nvs[i + 2]);
			_sfnvb.crossBy(_sfnvd);
			_sfnvb.normalize();
			biTangent[i] = _sfnvb.x; biTangent[i + 1] = _sfnvb.y; biTangent[i + 2] = _sfnvb.z;
		}
	}
}

export { SurfaceNormal };