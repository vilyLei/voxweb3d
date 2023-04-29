
/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import {Quaternion} from "../../vox/math/Quaternion";
import Matrix4 from "../../vox/math/Matrix4";

class Mat3DUtils
{
	static QuaternionToMatrix4(quarternion:Quaternion, m:Matrix4 = null):void
	{
		let x:number = quarternion.x;
		let y:number = quarternion.y;
		let z:number = quarternion.z;
		let w:number = quarternion.w;
		let xx:number = x * x;
		let xy:number = x * y;
		let xz:number = x * z;
		let xw:number = x * w;
		let yy:number = y * y;
		let yz:number = y * z;
		let yw:number = y * w;
		let zz:number = z * z;
		let zw:number = z * w;
		let sfv:Float32Array = m.getLocalFS32();
		sfv[0] = 1.0 - 2.0 * (yy + zz);
		sfv[1] = 2.0 * (xy + zw);
		sfv[2] = 2.0 * (xz - yw);
		sfv[4] = 2.0 * (xy - zw);
		sfv[5] = 1.0 - 2.0 * (xx + zz);
		sfv[6] = 2.0 * (yz + xw);
		sfv[8] = 2.0 * (xz + yw);
		sfv[9] = 2.0 * (yz - xw);
		sfv[10] = 1.0 - 2.0 * (xx + yy);
		sfv[3] = sfv[7] = sfv[11] = sfv[12] = sfv[13] = sfv[14] = 0.0;
		sfv[15] = 1.0;
	}		
}

export default Mat3DUtils;