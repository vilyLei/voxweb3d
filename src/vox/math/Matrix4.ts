/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as MathConstT from "../../vox/math/MathConst";
import * as Vector3DT from "../../vox/math/Vector3D";
import * as Float32DataT from "../../vox/base/Float32Data";

import MathConst = MathConstT.vox.math.MathConst;
import Vector3D = Vector3DT.vox.math.Vector3D;
import Float32Data = Float32DataT.vox.base.Float32Data;

export namespace vox
{
    export namespace math
    {
		export class OrientationType
		{
			static AXIS_ANGLE:number = 0;
			static QUATERNION:number = 1;
			static EULER_ANGLES:number = 2;
		}
		/////////////////////////////////////////////////////////////////////////////////////////////////
		export class Matrix4 implements Float32Data
		{
			private static s_InitData:Float32Array = new Float32Array([
				1.0,0.0,0.0,0.0,
				0.0,1.0,0.0,0.0,
				0.0,0.0,1.0,0.0,
				0.0,0.0,0.0,1.0
			]);
			private static s_uid:number = 0;
			private static s_isolatedUid:number = 0x4ffff;
			private m_uid:number = -1;
			private static s_tMat4:Matrix4 = new Matrix4();
			private m_index:number = 0;
			private m_fs32:Float32Array = null;
			private m_localFS32:Float32Array = null;

			constructor(pfs32:Float32Array = null,index:number = 0)
			{
				this.m_index = index;
				if(pfs32 != null)
				{
					this.m_uid = Matrix4.s_uid++;
					this.m_fs32 = pfs32;
					this.m_localFS32 = this.m_fs32.subarray(index,index + 16);
				}
				else
				{
					this.m_uid = Matrix4.s_isolatedUid++;					
					this.m_fs32 = new Float32Array(16);
					this.m_fs32.set(Matrix4.s_InitData,0);
					this.m_localFS32 = this.m_fs32;
				}
			}
			getCapacity():number
			{
				return 16;
			}
			GetMaxUid():number
			{
				return Matrix4.s_uid;
			}
			getUid():number
			{
				return this.m_uid;
			}
			getLocalFS32():Float32Array
			{
				return this.m_localFS32;
			}
			getFS32():Float32Array
			{
				return this.m_fs32;
			}
			getFSIndex():number
			{
				return this.m_index;
			}
    		identity():void
    		{
				this.m_localFS32.set(Matrix4.s_InitData,0);
    		}
    		determinant():number
			{
				return (this.m_localFS32[0] * this.m_localFS32[5] - this.m_localFS32[4] * this.m_localFS32[1])
				* 
				(this.m_localFS32[10] * this.m_localFS32[15] - this.m_localFS32[14] * this.m_localFS32[11])
				- 
				(this.m_localFS32[0] * this.m_localFS32[9] - this.m_localFS32[8] * this.m_localFS32[1])
				* 
				(this.m_localFS32[6] * this.m_localFS32[15] - this.m_localFS32[14] * this.m_localFS32[7])
				+
				(this.m_localFS32[0] * this.m_localFS32[13] - this.m_localFS32[12] * this.m_localFS32[1])
				*
				(this.m_localFS32[6] * this.m_localFS32[11] - this.m_localFS32[10] * this.m_localFS32[7])
				+
				(this.m_localFS32[4] * this.m_localFS32[9] - this.m_localFS32[8] * this.m_localFS32[5])
				*
				(this.m_localFS32[2] * this.m_localFS32[15] - this.m_localFS32[14] * this.m_localFS32[3])
				-
				(this.m_localFS32[4] * this.m_localFS32[13] - this.m_localFS32[12] * this.m_localFS32[5])
				*
				(this.m_localFS32[2] * this.m_localFS32[11] - this.m_localFS32[10] * this.m_localFS32[3])
				+
				(this.m_localFS32[8] * this.m_localFS32[13] - this.m_localFS32[12] * this.m_localFS32[9])
				*
				(this.m_localFS32[2] * this.m_localFS32[7] - this.m_localFS32[6] * this.m_localFS32[3]);
    		}
    		append(lhs:Matrix4):void
			{
				let lfs32:Float32Array = lhs.getLocalFS32();
				let sfs32:Float32Array = this.m_localFS32;
			
				let m111:number = sfs32[0];
				let m121:number = sfs32[4];
				let m131:number = sfs32[8];
				let m141:number = sfs32[12];
				let m112:number = sfs32[1];
				let m122:number = sfs32[5];
				let m132:number = sfs32[9];
				let m142:number = sfs32[13];
				let m113:number = sfs32[2];
				let m123:number = sfs32[6];
				let m133:number = sfs32[10];
				let m143:number = sfs32[14];
				let m114:number = sfs32[3];
				let m124:number = sfs32[7];
				let m134:number = sfs32[11];
				let m144:number = sfs32[15];
				let m211:number = lfs32[0];
				let m221:number = lfs32[4];
				let m231:number = lfs32[8];
				let m241:number = lfs32[12];
				let m212:number = lfs32[1];
				let m222:number = lfs32[5];
				let m232:number = lfs32[9];
				let m242:number = lfs32[13];
				let m213:number = lfs32[2];
				let m223:number = lfs32[6];
				let m233:number = lfs32[10];
				let m243:number = lfs32[14];
				let m214:number = lfs32[3];
				let m224:number = lfs32[7];
				let m234:number = lfs32[11];
				let m244:number = lfs32[15];
				sfs32[0] = m111 * m211 + m112 * m221 + m113 * m231 + m114 * m241;
				sfs32[1] = m111 * m212 + m112 * m222 + m113 * m232 + m114 * m242;
				sfs32[2] = m111 * m213 + m112 * m223 + m113 * m233 + m114 * m243;
				sfs32[3] = m111 * m214 + m112 * m224 + m113 * m234 + m114 * m244;
				sfs32[4] = m121 * m211 + m122 * m221 + m123 * m231 + m124 * m241;
				sfs32[5] = m121 * m212 + m122 * m222 + m123 * m232 + m124 * m242;
				sfs32[6] = m121 * m213 + m122 * m223 + m123 * m233 + m124 * m243;
				sfs32[7] = m121 * m214 + m122 * m224 + m123 * m234 + m124 * m244;
				sfs32[8] = m131 * m211 + m132 * m221 + m133 * m231 + m134 * m241;
				sfs32[9] = m131 * m212 + m132 * m222 + m133 * m232 + m134 * m242;
				sfs32[10] = m131 * m213 + m132 * m223 + m133 * m233 + m134 * m243;
				sfs32[11] = m131 * m214 + m132 * m224 + m133 * m234 + m134 * m244;
				sfs32[12] = m141 * m211 + m142 * m221 + m143 * m231 + m144 * m241;
				sfs32[13] = m141 * m212 + m142 * m222 + m143 * m232 + m144 * m242;
				sfs32[14] = m141 * m213 + m142 * m223 + m143 * m233 + m144 * m243;
				sfs32[15] = m141 * m214 + m142 * m224 + m143 * m234 + m144 * m244;
    		}
    		append3x3(lhs:Matrix4):void
			{
				let lfs32:Float32Array = lhs.getLocalFS32();				
				let sfs32:Float32Array = this.m_localFS32;
			
				let m111:number = sfs32[0];
				let m121:number = sfs32[4];
				let m131:number = sfs32[8];
				let m112:number = sfs32[1];
				let m122:number = sfs32[5];
				let m132:number = sfs32[9];
				let m113:number = sfs32[2];
				let m123:number = sfs32[6];
				let m133:number = sfs32[10];
				let m211:number = lfs32[0];
				let m221:number = lfs32[4];
				let m231:number = lfs32[8];
				let m212:number = lfs32[1];
				let m222:number = lfs32[5];
				let m232:number = lfs32[9];
				let m213:number = lfs32[2];
				let m223:number = lfs32[6];
				let m233:number = lfs32[10];

				sfs32[0] = m111 * m211 + m112 * m221 + m113 * m231;
				sfs32[1] = m111 * m212 + m112 * m222 + m113 * m232;
				sfs32[2] = m111 * m213 + m112 * m223 + m113 * m233;		
				sfs32[4] = m121 * m211 + m122 * m221 + m123 * m231;
				sfs32[5] = m121 * m212 + m122 * m222 + m123 * m232;
				sfs32[6] = m121 * m213 + m122 * m223 + m123 * m233;		
				sfs32[8] = m131 * m211 + m132 * m221 + m133 * m231;
				sfs32[9] = m131 * m212 + m132 * m222 + m133 * m232;
				sfs32[10] = m131 * m213 + m132 * m223 + m133 * m233;				
    		}
    		appendRotationPivot(radian:number, axis:Vector3D, pivotPoint:Vector3D = null):void
			{
    		    if(pivotPoint == null)
    		    {
    		        pivotPoint = Vector3D.Z_AXIS;
    		    }
				Matrix4.s_tMat4.identity();
				Matrix4.s_tMat4.getAxisRotation(axis.x, axis.y, axis.z, radian);
				Matrix4.s_tMat4.appendTranslationXYZ(pivotPoint.x, pivotPoint.y, pivotPoint.z);				
				this.append(Matrix4.s_tMat4);
			}
			appendRotation(radian:number, axis:Vector3D):void
			{
				Matrix4.s_tMat4.identity();
				Matrix4.s_tMat4.getAxisRotation(axis.x, axis.y, axis.z, radian);
				this.append(Matrix4.s_tMat4);
    		}
    		appendRotationX(radian:number):void
			{
				Matrix4.s_tMat4.rotationX(radian);
				this.append3x3(Matrix4.s_tMat4);
    		}
			appendRotationY(radian:number):void
			{
				Matrix4.s_tMat4.rotationY(radian);
				this.append3x3(Matrix4.s_tMat4);
			}
			appendRotationZ(radian:number):void
			{
				Matrix4.s_tMat4.rotationZ(radian);
				this.append3x3(Matrix4.s_tMat4);
			}
    		// 用欧拉角形式旋转(heading->pitch->bank) => (y->x->z)
			appendRotationEulerAngle(radianX:number, radianY:number, radianZ:number):void
			{
				Matrix4.s_tMat4.rotationY(radianY);
				this.append3x3(Matrix4.s_tMat4);
				Matrix4.s_tMat4.rotationX(radianX);
				this.append3x3(Matrix4.s_tMat4);
				Matrix4.s_tMat4.rotationZ(radianZ);
				this.append3x3(Matrix4.s_tMat4);
			}
			
    		setScaleXYZ(xScale:number, yScale:number, zScale:number):void
			{
				let sfs32:Float32Array = this.m_localFS32;
				sfs32[0] = xScale;sfs32[5] = yScale; sfs32[10] = zScale;
			}
			setRotationEulerAngle(radianX:number, radianY:number, radianZ:number):void
			{
				let sfs32:Float32Array = this.m_localFS32;
				//let sx:number = sfs32[0];
				//let sy:number = sfs32[5];
				//let sz:number = sfs32[10];
				
				let cosX: number = Math.cos(radianX);
        		let sinX:number = Math.sin(radianX);
        		let cosY:number = Math.cos(radianY);
        		let sinY:number = Math.sin(radianY);
        		let cosZ:number = Math.cos(radianZ);
        		let sinZ:number = Math.sin(radianZ);
        		let cosZsinY:number = cosZ * sinY;
        		let sinZsinY:number = sinZ * sinY;
        		let cosYscaleX:number = cosY * sfs32[0];
        		let sinXscaleY:number = sinX * sfs32[5];
        		let cosXscaleY:number = cosX * sfs32[5];
        		let cosXscaleZ:number = cosX * sfs32[10];
        		let sinXscaleZ:number = sinX * sfs32[10];
				
        		sfs32[1] = sinZ * cosYscaleX;
        		sfs32[2] = -sinY * sfs32[0];
        		sfs32[0] = cosZ * cosYscaleX;
        		sfs32[4] = cosZsinY * sinXscaleY - sinZ * cosXscaleY;
        		sfs32[8] = cosZsinY * cosXscaleZ + sinZ * sinXscaleZ;
        		sfs32[5] = sinZsinY * sinXscaleY + cosZ * cosXscaleY;
        		sfs32[9] = sinZsinY * cosXscaleZ - cosZ * sinXscaleZ;
        		sfs32[6] = cosY * sinXscaleY;
        		sfs32[10] = cosY * cosXscaleZ;
			}
			
			setRotationEulerAngle2(cosX:number,sinX:number,cosY:number,sinY:number,cosZ:number,sinZ:number):void
			{
				let sfs32:Float32Array = this.m_localFS32;
				//let sx:number = sfs32[0];
				//let sy:number = sfs32[5];
				//let sz:number = sfs32[10];
				
				//	let cosX: number = Math.cos(radianX);
        		//	let sinX:number = Math.sin(radianX);
        		//	let cosY:number = Math.cos(radianY);
        		//	let sinY:number = Math.sin(radianY);
        		//	let cosZ:number = Math.cos(radianZ);
        		//	let sinZ:number = Math.sin(radianZ);
        		let cosZsinY:number = cosZ * sinY;
        		let sinZsinY:number = sinZ * sinY;
        		let cosYscaleX:number = cosY * sfs32[0];
        		let sinXscaleY:number = sinX * sfs32[5];
        		let cosXscaleY:number = cosX * sfs32[5];
        		let cosXscaleZ:number = cosX * sfs32[10];
        		let sinXscaleZ:number = sinX * sfs32[10];
				
        		sfs32[1] = sinZ * cosYscaleX;
        		sfs32[2] = -sinY * sfs32[0];
        		sfs32[0] = cosZ * cosYscaleX;
        		sfs32[4] = cosZsinY * sinXscaleY - sinZ * cosXscaleY;
        		sfs32[8] = cosZsinY * cosXscaleZ + sinZ * sinXscaleZ;
        		sfs32[5] = sinZsinY * sinXscaleY + cosZ * cosXscaleY;
        		sfs32[9] = sinZsinY * cosXscaleZ - cosZ * sinXscaleZ;
        		sfs32[6] = cosY * sinXscaleY;
        		sfs32[10] = cosY * cosXscaleZ;
			}
			setTranslationXYZ(px:number,py:number,pz:number):void
			{
				this.m_localFS32[12] = px;
				this.m_localFS32[13] = py;
				this.m_localFS32[14] = pz;
    		}
			setTranslation(v3:Vector3D):void
			{
				this.m_localFS32[12] = v3.x;
				this.m_localFS32[13] = v3.y;
				this.m_localFS32[14] = v3.z;
    		}
    		appendScaleXYZ(xScale:number, yScale:number, zScale:number):void
			{
				let sfs32:Float32Array = this.m_localFS32;
				sfs32[0] *= xScale; sfs32[1] *= xScale; sfs32[2] *= xScale; sfs32[3] *= xScale;
				sfs32[4] *= yScale; sfs32[5] *= yScale; sfs32[6] *= yScale; sfs32[7] *= yScale;
				sfs32[8] *= zScale; sfs32[9] *= zScale; sfs32[10] *= zScale; sfs32[11] *= zScale;
			}
			
    		appendScaleXY(xScale:number, yScale:number):void
    		{
    		    this.m_localFS32[0] *= xScale; this.m_localFS32[1] *= xScale; this.m_localFS32[2] *= xScale; this.m_localFS32[3] *= xScale;
    		    this.m_localFS32[4] *= yScale; this.m_localFS32[5] *= yScale; this.m_localFS32[6] *= yScale; this.m_localFS32[7] *= yScale;
    		}
			appendTranslationXYZ(px:number, py:number, pz:number):void
			{
				this.m_localFS32[12] += px;
				this.m_localFS32[13] += py;
				this.m_localFS32[14] += pz;
			}
			appendTranslation(v3:Vector3D):void
			{
				this.m_localFS32[12] += v3.x;
				this.m_localFS32[13] += v3.y;
				this.m_localFS32[14] += v3.z;
    		}
    		copyColumnFrom(column_index:number, v3:Vector3D):void
			{
				switch (column_index) {
				case 0:
				{
					this.m_localFS32[0] = v3.x;
					this.m_localFS32[1] = v3.y;
					this.m_localFS32[2] = v3.z;
					this.m_localFS32[3] = v3.w;
				}
				break;
				case 1:
				{
					this.m_localFS32[4] = v3.x;
					this.m_localFS32[5] = v3.y;
					this.m_localFS32[6] = v3.z;
					this.m_localFS32[7] = v3.w;
				}
				break;
				case 2:
				{
					this.m_localFS32[8] = v3.x;
					this.m_localFS32[9] = v3.y;
					this.m_localFS32[10] = v3.z;
					this.m_localFS32[11] = v3.w;
				}
				break;
				case 3:
				{
					this.m_localFS32[12] = v3.x;
					this.m_localFS32[13] = v3.y;
					this.m_localFS32[14] = v3.z;
					this.m_localFS32[15] = v3.w;
				}
				break;
				default:
					break;
				}
			}
			copyColumnTo(column_index:number, v3:Vector3D):void
			{
				column_index <<= 2;
				v3.x = this.m_localFS32[column_index];
				v3.y = this.m_localFS32[1 + column_index];
				v3.z = this.m_localFS32[2 + column_index];
				v3.w = this.m_localFS32[3 + column_index];
			}
			setF32ArrAndIndex(fs32Arr:Float32Array,index:number = 0):void
			{
				if(fs32Arr != null && index >= 0)
				{
					this.m_fs32 = fs32Arr;
					this.m_index = index;
					this.m_localFS32 = this.m_fs32.subarray(index,index + 16);
				}
			}
			setF32ArrIndex(index:number = 0):void
			{
				if(index >= 0)
				{
					this.m_index = index;
					this.m_localFS32 = this.m_fs32.subarray(index,index + 16);
				}
			}
			setF32Arr(fs32Arr:Float32Array):void
			{
				if(fs32Arr != null)
				{
					this.m_fs32 = fs32Arr;
				}
			}
    		copyFromF32Arr(fs32Arr:Float32Array,index:number = 0):void
			{
				//let subArr:Float32Array = fs32Arr.subarray(index, index + 16);
				//this.m_localFS32.set(fs32Arr.subarray(index, index + 16), 0);

				let i:number = 0;
				for(let end:number = index + 16;index < end;index++)
				{
					this.m_localFS32[i] = fs32Arr[index];
					++i;
				}
			}
    		copyToF32Arr(fs32Arr:Float32Array,index:number = 0):void
			{
				fs32Arr.set(this.m_localFS32, index);
			}
    		copyFrom(smat:Matrix4):void
			{
				this.m_localFS32.set(smat.m_localFS32,0);
    		}
    		copyTo(dmat:Matrix4):void
			{
				//dmat.copyFrom(this);
				dmat.m_localFS32.set(this.m_localFS32,0);
    		}
    		copyRawDataFrom(float_rawDataArr:Float32Array,rawDataLength:number = 16, index:number = 0, bool_tp:Boolean = false):void
			{
				if (bool_tp) this.transpose();
				rawDataLength = rawDataLength - index;
				let c:number = 0;
    		    while (c < rawDataLength) 
    		    {
					this.m_fs32[this.m_index + c] = float_rawDataArr[c + index];
					++c;
				}
				if (bool_tp) this.transpose();
			}
			copyRawDataTo(float_rawDataArr:Float32Array,rawDataLength:number = 16, index:number = 0, bool_tp:boolean = false):void
			{
				if (bool_tp) this.transpose();
				let c:number = 0;
    		    while (c < rawDataLength) 
    		    {
					float_rawDataArr[c + index] = this.m_fs32[this.m_index + c];
					++c;
				}
				if (bool_tp) this.transpose();
			}
			copyRowFrom(row_index:number, v3:Vector3D):void
			{
				switch (row_index) {
				case 0:
				{
					this.m_localFS32[0] = v3.x;
					this.m_localFS32[4] = v3.y;
					this.m_localFS32[8] = v3.z;
					this.m_localFS32[12] = v3.w;
				}
				break;
				case 1:
				{
					this.m_localFS32[1] = v3.x;
					this.m_localFS32[5] = v3.y;
					this.m_localFS32[9] = v3.z;
					this.m_localFS32[13] = v3.w;
				}
				break;
				case 2:
				{
					this.m_localFS32[2] = v3.x;
					this.m_localFS32[6] = v3.y;
					this.m_localFS32[10] = v3.z;
					this.m_localFS32[14] = v3.w;
				}
				break;
				case 3:
				{
					this.m_localFS32[3] = v3.x;
					this.m_localFS32[7] = v3.y;
					this.m_localFS32[11] = v3.z;
					this.m_localFS32[15] = v3.w;
				}
				break;
				default:
					break;
				}
			}
			copyRowTo(row_index:number, v3:Vector3D):void
			{
				v3.x = this.m_localFS32[row_index];
				v3.y = this.m_localFS32[4 + row_index];
				v3.z = this.m_localFS32[8 + row_index];
				v3.w = this.m_localFS32[12 + row_index];
			}
    		decompose(orientationStyle:number):Vector3D[]
			{
				// TODO: optimize after 4 lines
				let vec = [];
				let mr = Matrix4.s_tMat4;
				let mrfs32 = mr.getFS32();
				//let mrfsI = mr.getFSIndex();
    		    //std::memcpy(&mr, m_rawData, m_rawDataSize);
    		    mr.copyFrom(this);
				///*
				let pos = new Vector3D(mrfs32[12], mrfs32[13], mrfs32[14]);
				let scale = new Vector3D();
				scale.x = Math.sqrt(mrfs32[0] * mrfs32[0] + mrfs32[1] * mrfs32[1] + mrfs32[2] * mrfs32[2]);
				scale.y = Math.sqrt(mrfs32[4] * mrfs32[4] + mrfs32[5] * mrfs32[5] + mrfs32[6] * mrfs32[6]);
				scale.z = Math.sqrt(mrfs32[8] * mrfs32[8] + mrfs32[9] * mrfs32[9] + mrfs32[10] * mrfs32[10]);
				if (mrfs32[0] * (mrfs32[5] * mrfs32[10] - mrfs32[6] * mrfs32[9]) - mrfs32[1] * (mrfs32[4] * mrfs32[10] - mrfs32[6] * mrfs32[8]) + mrfs32[2] * (mrfs32[4] * mrfs32[9] - mrfs32[5] * mrfs32[8]) < 0) scale.z = -scale.z;
				mrfs32[0] /= scale.x;
				mrfs32[1] /= scale.x;
				mrfs32[2] /= scale.x;
				mrfs32[4] /= scale.y;
				mrfs32[5] /= scale.y;
				mrfs32[6] /= scale.y;
				mrfs32[8] /= scale.z;
				mrfs32[9] /= scale.z;
				mrfs32[10] /= scale.z;
				let rot = new Vector3D();
				switch (orientationStyle) {
				case OrientationType.AXIS_ANGLE:
				{
					rot.w = MathConst.SafeACos((mrfs32[0] + mrfs32[5] + mrfs32[10] - 1) / 2);
					let len = Math.sqrt((mrfs32[6] - mrfs32[9]) * (mrfs32[6] - mrfs32[9]) + (mrfs32[8] - mrfs32[2]) * (mrfs32[8] - mrfs32[2]) + (mrfs32[1] - mrfs32[4]) * (mrfs32[1] - mrfs32[4]));
					if (len > MathConst.MATH_MIN_POSITIVE) {
						rot.x = (mrfs32[6] - mrfs32[9]) / len;
						rot.y = (mrfs32[8] - mrfs32[2]) / len;
						rot.z = (mrfs32[1] - mrfs32[4]) / len;
					}
					else rot.x = rot.y = rot.z = 0;
				}
				break;
				case OrientationType.QUATERNION:
				{
					let tr = (mrfs32[0] + mrfs32[5] + mrfs32[10]);
					if (tr > 0) {
						rot.w = Math.sqrt(1 + tr) / 2;
						rot.x = (mrfs32[6] - mrfs32[9]) / (4 * rot.w);
						rot.y = (mrfs32[8] - mrfs32[2]) / (4 * rot.w);
						rot.z = (mrfs32[1] - mrfs32[4]) / (4 * rot.w);
					}
					else if (mrfs32[0] > mrfs32[5] && mrfs32[0] > mrfs32[10]) {
						rot.x = Math.sqrt(1 + mrfs32[0] - mrfs32[5] - mrfs32[10]) / 2;
						rot.w = (mrfs32[6] - mrfs32[9]) / (4 * rot.x);
						rot.y = (mrfs32[1] + mrfs32[4]) / (4 * rot.x);
						rot.z = (mrfs32[8] + mrfs32[2]) / (4 * rot.x);
					}
					else if (mrfs32[5] > mrfs32[10]) {
						rot.y = Math.sqrt(1 + mrfs32[5] - mrfs32[0] - mrfs32[10]) / 2;
						rot.x = (mrfs32[1] + mrfs32[4]) / (4 * rot.y);
						rot.w = (mrfs32[8] - mrfs32[2]) / (4 * rot.y);
						rot.z = (mrfs32[6] + mrfs32[9]) / (4 * rot.y);
					}
    		        else
    		        {
						rot.z = Math.sqrt(1 + mrfs32[10] - mrfs32[0] - mrfs32[5]) / 2;
						rot.x = (mrfs32[8] + mrfs32[2]) / (4 * rot.z);
						rot.y = (mrfs32[6] + mrfs32[9]) / (4 * rot.z);
						rot.w = (mrfs32[1] - mrfs32[4]) / (4 * rot.z);
					}
				}
				break;
				case OrientationType.EULER_ANGLES:
				{
					rot.y = Math.asin(-mrfs32[2]);
					if (mrfs32[2] != 1 && mrfs32[2] != -1) {
						rot.x = Math.atan2(mrfs32[6], mrfs32[10]);
						rot.z = Math.atan2(mrfs32[1], mrfs32[0]);
					}
					else {
						rot.z = 0;
						rot.x = Math.atan2(mrfs32[4], mrfs32[5]);
					}
				}
				break;
				default:			
				break;
				};
				vec.push(pos);
				vec.push(rot);
				vec.push(scale);
				mr = null;
				return vec;
			}
    		invert():boolean
			{
				let d:number = this.determinant();
				let invertable = Math.abs(d) > MathConst.MATH_MIN_POSITIVE;
				if (invertable)
				{
					let sfs32:Float32Array = this.m_localFS32;
					d = 1.0 / d;
					let m11:number = sfs32[0];
					let m21:number = sfs32[4];
					let m31:number = sfs32[8];
					let m41:number = sfs32[12];
					let m12:number = sfs32[1];
					let m22:number = sfs32[5];
					let m32:number = sfs32[9];
					let m42:number = sfs32[13];
					let m13:number = sfs32[2];
					let m23:number = sfs32[6];
					let m33:number = sfs32[10];
					let m43:number = sfs32[14];
					let m14:number = sfs32[3];
					let m24:number = sfs32[7];
					let m34:number = sfs32[11];
					let m44:number = sfs32[15];
					sfs32[0] = d * (m22 * (m33 * m44 - m43 * m34) - m32 * (m23 * m44 - m43 * m24) + m42 * (m23 * m34 - m33 * m24));
					sfs32[1] = -d * (m12 * (m33 * m44 - m43 * m34) - m32 * (m13 * m44 - m43 * m14) + m42 * (m13 * m34 - m33 * m14));
					sfs32[2] = d * (m12 * (m23 * m44 - m43 * m24) - m22 * (m13 * m44 - m43 * m14) + m42 * (m13 * m24 - m23 * m14));
					sfs32[3] = -d * (m12 * (m23 * m34 - m33 * m24) - m22 * (m13 * m34 - m33 * m14) + m32 * (m13 * m24 - m23 * m14));
					sfs32[4] = -d * (m21 * (m33 * m44 - m43 * m34) - m31 * (m23 * m44 - m43 * m24) + m41 * (m23 * m34 - m33 * m24));
					sfs32[5] = d * (m11 * (m33 * m44 - m43 * m34) - m31 * (m13 * m44 - m43 * m14) + m41 * (m13 * m34 - m33 * m14));
					sfs32[6] = -d * (m11 * (m23 * m44 - m43 * m24) - m21 * (m13 * m44 - m43 * m14) + m41 * (m13 * m24 - m23 * m14));
					sfs32[7] = d * (m11 * (m23 * m34 - m33 * m24) - m21 * (m13 * m34 - m33 * m14) + m31 * (m13 * m24 - m23 * m14));
					sfs32[8] = d * (m21 * (m32 * m44 - m42 * m34) - m31 * (m22 * m44 - m42 * m24) + m41 * (m22 * m34 - m32 * m24));
					sfs32[9] = -d * (m11 * (m32 * m44 - m42 * m34) - m31 * (m12 * m44 - m42 * m14) + m41 * (m12 * m34 - m32 * m14));
					sfs32[10] = d * (m11 * (m22 * m44 - m42 * m24) - m21 * (m12 * m44 - m42 * m14) + m41 * (m12 * m24 - m22 * m14));
					sfs32[11] = -d * (m11 * (m22 * m34 - m32 * m24) - m21 * (m12 * m34 - m32 * m14) + m31 * (m12 * m24 - m22 * m14));
					sfs32[12] = -d * (m21 * (m32 * m43 - m42 * m33) - m31 * (m22 * m43 - m42 * m23) + m41 * (m22 * m33 - m32 * m23));
					sfs32[13] = d * (m11 * (m32 * m43 - m42 * m33) - m31 * (m12 * m43 - m42 * m13) + m41 * (m12 * m33 - m32 * m13));
					sfs32[14] = -d * (m11 * (m22 * m43 - m42 * m23) - m21 * (m12 * m43 - m42 * m13) + m41 * (m12 * m23 - m22 * m13));
					sfs32[15] = d * (m11 * (m22 * m33 - m32 * m23) - m21 * (m12 * m33 - m32 * m13) + m31 * (m12 * m23 - m22 * m13));
				};
				return invertable;
    		}
    		pointAt(pos:Vector3D, at:Vector3D, up:Vector3D):void
			{
				//TODO: need optimize
				if (at == null || at == undefined) at = new Vector3D(0.0, 0.0, -1.0);
				if (up == null || up == undefined) up = new Vector3D(0.0, -1.0, 0.0);
				let dir = at.subtract(pos);
				let vup = new Vector3D(up.x,up.y,up.z);//up->clone();
				//Vector3D right;
				dir.normalize();
				vup.normalize();
				let dir2 = new Vector3D(dir.x,dir.y,dir.z);
				dir2.scaleBy(vup.dot(dir));
				//
				vup.subtractBy(dir2);
				if (vup.getLength() > MathConst.MATH_MIN_POSITIVE) vup.normalize();
				else if (dir.x != 0)vup.setTo(-dir.y, dir.x, 0);// vup = Vector3D(-dir.y, dir.x, 0);
				else vup.setTo(1, 0, 0);// vup = Vector3D(1, 0, 0);
				let right = vup.crossProduct(dir);
				right.normalize();
				let sfs32:Float32Array = this.m_localFS32;
				sfs32[0] = right.x;
				sfs32[4] = right.y;
				sfs32[8] = right.z;
				sfs32[12] = 0.0;
				sfs32[1] = vup.x;
				sfs32[5] = vup.y;
				sfs32[9] = vup.z;
				sfs32[13] = 0.0;
				sfs32[2] = dir.x;
				sfs32[6] = dir.y;
				sfs32[10] = dir.z;
				sfs32[14] = 0.0;
				sfs32[3] = pos.x;
				sfs32[7] = pos.y;
				sfs32[11] = pos.z;
				sfs32[15] = 1.0;
    		}
    		prepend(rhs:Matrix4):void
			{
				let rfs32:Float32Array = rhs.getLocalFS32();
				let sfs32:Float32Array = this.m_localFS32;

				let m111 = rfs32[0];
				let m121 = rfs32[4];
				let m131 = rfs32[8];
				let m141 = rfs32[12];
				let m112 = rfs32[1];
				let m122 = rfs32[5];
				let m132 = rfs32[9];
				let m142 = rfs32[13];
				let m113 = rfs32[2];
				let m123 = rfs32[6];
				let m133 = rfs32[10];
				let m143 = rfs32[14];
				let m114 = rfs32[3];
				let m124 = rfs32[7];
				let m134 = rfs32[11];
				let m144 = rfs32[15];
				let m211 = sfs32[0];
				let m221 = sfs32[4];
				let m231 = sfs32[8];
				let m241 = sfs32[12];
				let m212 = sfs32[1];
				let m222 = sfs32[5];
				let m232 = sfs32[9];
				let m242 = sfs32[13];
				let m213 = sfs32[2];
				let m223 = sfs32[6];
				let m233 = sfs32[10];
				let m243 = sfs32[14];
				let m214 = sfs32[3];
				let m224 = sfs32[7];
				let m234 = sfs32[11];
				let m244 = sfs32[15];
				sfs32[0] = m111 * m211 + m112 * m221 + m113 * m231 + m114 * m241;
				sfs32[1] = m111 * m212 + m112 * m222 + m113 * m232 + m114 * m242;
				sfs32[2] = m111 * m213 + m112 * m223 + m113 * m233 + m114 * m243;
				sfs32[3] = m111 * m214 + m112 * m224 + m113 * m234 + m114 * m244;
				sfs32[4] = m121 * m211 + m122 * m221 + m123 * m231 + m124 * m241;
				sfs32[5] = m121 * m212 + m122 * m222 + m123 * m232 + m124 * m242;
				sfs32[6] = m121 * m213 + m122 * m223 + m123 * m233 + m124 * m243;
				sfs32[7] = m121 * m214 + m122 * m224 + m123 * m234 + m124 * m244;
				sfs32[8] = m131 * m211 + m132 * m221 + m133 * m231 + m134 * m241;
				sfs32[9] = m131 * m212 + m132 * m222 + m133 * m232 + m134 * m242;
				sfs32[10] = m131 * m213 + m132 * m223 + m133 * m233 + m134 * m243;
				sfs32[11] = m131 * m214 + m132 * m224 + m133 * m234 + m134 * m244;
				sfs32[12] = m141 * m211 + m142 * m221 + m143 * m231 + m144 * m241;
				sfs32[13] = m141 * m212 + m142 * m222 + m143 * m232 + m144 * m242;
				sfs32[14] = m141 * m213 + m142 * m223 + m143 * m233 + m144 * m243;
				sfs32[15] = m141 * m214 + m142 * m224 + m143 * m234 + m144 * m244;
			}
	
			prepend3x3(rhs:Matrix4):void
			{
				let rfs32:Float32Array = rhs.getLocalFS32();
				let sfs32:Float32Array = this.m_localFS32;

				let m111 = rfs32[0];
				let m121 = rfs32[4];
				let m131 = rfs32[8];
				let m112 = rfs32[1];
				let m122 = rfs32[5];
				let m132 = rfs32[9];
				let m113 = rfs32[2];
				let m123 = rfs32[6];
				let m133 = rfs32[10];
				let m211 = sfs32[0];
				let m221 = sfs32[4];
				let m231 = sfs32[8];
				let m212 = sfs32[1];
				let m222 = sfs32[5];
				let m232 = sfs32[9];
				let m213 = sfs32[2];
				let m223 = sfs32[6];
				let m233 = sfs32[10];

				sfs32[0] = m111 * m211 + m112 * m221 + m113 * m231;
				sfs32[1] = m111 * m212 + m112 * m222 + m113 * m232;
				sfs32[2] = m111 * m213 + m112 * m223 + m113 * m233;
				sfs32[4] = m121 * m211 + m122 * m221 + m123 * m231;
				sfs32[5] = m121 * m212 + m122 * m222 + m123 * m232;
				sfs32[6] = m121 * m213 + m122 * m223 + m123 * m233;
				sfs32[8] = m131 * m211 + m132 * m221 + m133 * m231;
				sfs32[9] = m131 * m212 + m132 * m222 + m133 * m232;
				sfs32[10] = m131 * m213 + m132 * m223 + m133 * m233;
    		}
    		prependRotationPivot(radian:number, axis:Vector3D, pivotPoint:Vector3D):void
			{
				Matrix4.s_tMat4.identity();
				Matrix4.s_tMat4.getAxisRotation(axis.x, axis.y, axis.z, radian);
				Matrix4.s_tMat4.appendTranslationXYZ(pivotPoint.x, pivotPoint.y, pivotPoint.z);
				this.prepend(Matrix4.s_tMat4);
			}
			prependRotation(radian:number, axis:Vector3D):void
			{
				Matrix4.s_tMat4.identity();
				Matrix4.s_tMat4.getAxisRotation(axis.x, axis.y, axis.z, radian);
				this.prepend(Matrix4.s_tMat4);
			}
			prependRotationX(radian:number):void
			{
				//s_tempMat.identity();
				Matrix4.s_tMat4.rotationX(radian);
				this.prepend3x3(Matrix4.s_tMat4);
    		}
			prependRotationY(radian:number):void
			{
				//s_tempMat.identity();
				Matrix4.s_tMat4.rotationY(radian);
				this.prepend3x3(Matrix4.s_tMat4);
			}
			prependRotationZ(radian:number):void
			{
				//s_tempMat.identity();
				Matrix4.s_tMat4.rotationZ(radian);
				this.prepend3x3(Matrix4.s_tMat4);
			}
			// 用欧拉角形式旋转(heading->pitch->bank) => (y->x->z)
			prependRotationEulerAngle(radianX:number, radianY:number, radianZ:number):void
			{
				//s_tempMat.identity();
				Matrix4.s_tMat4.rotationY(radianY);
				this.prepend3x3(Matrix4.s_tMat4);
				//s_tempMat.identity();
				Matrix4.s_tMat4.rotationX(radianX);
				this.prepend3x3(Matrix4.s_tMat4);
				//s_tempMat.identity();
				Matrix4.s_tMat4.rotationZ(radianZ);
				this.prepend3x3(Matrix4.s_tMat4);
    		}
    		prependScale(xScale:number, yScale:number, zScale:number):void
			{
				let sfs32:Float32Array = this.m_localFS32;
				sfs32[0] *= xScale; sfs32[1] *= yScale; sfs32[2] *= zScale;
				sfs32[4] *= xScale; sfs32[5] *= yScale; sfs32[6] *= zScale;
				sfs32[8] *= xScale; sfs32[9] *= yScale; sfs32[10] *= zScale;
				sfs32[12] *= xScale; sfs32[13] *= yScale; sfs32[14] *= zScale;
			}
    		prependScaleXY(xScale:number, yScale:number):void
    		{
    		    this.m_localFS32[0] *= xScale; this.m_localFS32[1] *= yScale;
    		    this.m_localFS32[4] *= xScale; this.m_localFS32[5] *= yScale;
    		    this.m_localFS32[8] *= xScale; this.m_localFS32[9] *= yScale;
    		    this.m_localFS32[12] *= xScale; this.m_localFS32[13] *= yScale;
    		}
			prependTranslationXYZ(px:number, py:number, pz:number):void
			{
				Matrix4.s_tMat4.identity();
				//Matrix4.s_tMat4.setPositionXYZ(px, py, pz);
				this.prepend(Matrix4.s_tMat4);
			}
			prependTranslation(v3:Vector3D):void
			{
				Matrix4.s_tMat4.identity();
				//Matrix4.s_tMat4.setPositionXYZ(v3.x, v3.y, v3.z);
				this.prepend(Matrix4.s_tMat4);
			}
    		recompose(components:Vector3D[], orientationStyle:number):boolean
			{
				if (components.length < 3 || components[2].x == 0 || components[2].y == 0 || components[2].z == 0) return false;
				this.identity();
				let scale = Matrix4.s_tMat4.getFS32();
				scale[0] = scale[1] = scale[2] = components[2].x;
				scale[4] = scale[5] = scale[6] = components[2].y;
				scale[8] = scale[9] = scale[10] = components[2].z;
				let sfs32:Float32Array = this.m_localFS32;
				switch (orientationStyle) {
				case OrientationType.EULER_ANGLES:
				{
					let cx:number = Math.cos(components[1].x);
					let cy:number = Math.cos(components[1].y);
					let cz:number = Math.cos(components[1].z);
					let sx:number = Math.sin(components[1].x);
					let sy:number = Math.sin(components[1].y);
					let sz:number = Math.sin(components[1].z);
					sfs32[0]= cy * cz * scale[0];
					sfs32[1] = cy * sz * scale[1];
					sfs32[2] = -sy * scale[2];
					sfs32[3] = 0;
					sfs32[4] = (sx * sy * cz - cx * sz) * scale[4];
					sfs32[5] = (sx * sy * sz + cx * cz) * scale[5];
					sfs32[6] = sx * cy * scale[6];
					sfs32[7] = 0;
					sfs32[8] = (cx * sy * cz + sx * sz) * scale[8];
					sfs32[9] = (cx * sy * sz - sx * cz) * scale[9];
					sfs32[10] = cx * cy * scale[10];
					sfs32[11] = 0;
					sfs32[12] = components[0].x;
					sfs32[13] = components[0].y;
					sfs32[14] = components[0].z;
					sfs32[15] = 1;
				}
				break;
				default:
				{
					let x:number = components[1].x;
					let y:number = components[1].y;
					let z:number = components[1].z;
					let w:number = components[1].w;
					if (orientationStyle == OrientationType.AXIS_ANGLE) {
						let halfW = 0.5 * w;
						x *= Math.sin(halfW);
						y *= Math.sin(halfW);
						z *= Math.sin(halfW);
						w = Math.cos(halfW);
					};
					sfs32[0] = (1 - 2 * y * y - 2 * z * z) * scale[0];
					sfs32[1] = (2 * x * y + 2 * w * z) * scale[1];
					sfs32[2] = (2 * x * z - 2 * w * y) * scale[2];
					sfs32[3] = 0;
					sfs32[4] = (2 * x * y - 2 * w * z) * scale[4];
					sfs32[5] = (1 - 2 * x * x - 2 * z * z) * scale[5];
					sfs32[6] = (2 * y * z + 2 * w * x) * scale[6];
					sfs32[7] = 0;
					sfs32[8] = (2 * x * z + 2 * w * y) * scale[8];
					sfs32[9] = (2 * y * z - 2 * w * x) * scale[9];
					sfs32[10] = (1 - 2 * x * x - 2 * y * y) * scale[10];
					sfs32[11] = 0;
					sfs32[12] = components[0].x;
					sfs32[13] = components[0].y;
					sfs32[14] = components[0].z;
					sfs32[15] = 1;
				}
				break;
				};
				//TODO: need thinking
				if (components[2].x == 0) this.m_localFS32[0] = 0;// 1e-15;
				if (components[2].y == 0) this.m_localFS32[5] = 0;// 1e-15;
				if (components[2].z == 0) this.m_localFS32[10] = 0;// 1e-15;
				scale = null;
				return true;
    		}

			deltaTransformVector(v3:Vector3D):Vector3D
			{
				let x:number = v3.x;
				let y:number = v3.y;
				let z:number = v3.z;
				return new Vector3D(
					x * this.m_localFS32[0] + y * this.m_localFS32[4] + z * this.m_localFS32[8]
					, x * this.m_localFS32[1] + y * this.m_localFS32[5] + z * this.m_localFS32[9]
					, x * this.m_localFS32[2] + y * this.m_localFS32[6] + z * this.m_localFS32[10]
					, 0.0);
			}
			
			deltaTransformVectorSelf(v3:Vector3D):void
			{
				let sfs32:Float32Array = this.m_localFS32;
				let x:number = v3.x;
				let y:number = v3.y;
				let z:number = v3.z;
				v3.x = x * sfs32[0] + y * sfs32[4] + z * sfs32[8];
				v3.y = x * sfs32[1] + y * sfs32[5] + z * sfs32[9];
				v3.z = x * sfs32[2] + y * sfs32[6] + z * sfs32[10];
    		}
			deltaTransformOutVector(v3:Vector3D,out_v3:Vector3D):void
			{
				let sfs32:Float32Array = this.m_localFS32;
				out_v3.x = v3.x * sfs32[0] + v3.y * sfs32[4] + v3.z * sfs32[8];
				out_v3.y = v3.x * sfs32[1] + v3.y * sfs32[5] + v3.z * sfs32[9];
				out_v3.z = v3.x * sfs32[2] + v3.y * sfs32[6] + v3.z * sfs32[10];
    		}
    		transformVector(v3:Vector3D):Vector3D
			{
				let sfs32:Float32Array = this.m_localFS32;
				let x:number = v3.x;
				let y:number = v3.y;
				let z:number = v3.z;
				return new Vector3D(
					  x * sfs32[0] + y * sfs32[4] + z * sfs32[8] + sfs32[12]
					, x * sfs32[1] + y * sfs32[5] + z * sfs32[9] + sfs32[13]
					, x * sfs32[2] + y * sfs32[6] + z * sfs32[10] + sfs32[14]
					, x * sfs32[3] + y * sfs32[7] + z * sfs32[11] + sfs32[15]
					);
			}
			transformOutVector(v3:Vector3D, out_v3:Vector3D):void
			{
				let x:number = v3.x;
				let y:number = v3.y;
				let z:number = v3.z;
				let sfs32:Float32Array = this.m_localFS32;
				out_v3.setTo(
					  x * sfs32[0] + y * sfs32[4] + z * sfs32[8] + sfs32[12]
					, x * sfs32[1] + y * sfs32[5] + z * sfs32[9] + sfs32[13]
					, x * sfs32[2] + y * sfs32[6] + z * sfs32[10] + sfs32[14]
					, x * sfs32[3] + y * sfs32[7] + z * sfs32[11] + sfs32[15]
					);
			}
			transformOutVector3(v3:Vector3D, out_v3:Vector3D):void
			{
				let sfs32:Float32Array = this.m_localFS32;
				out_v3.x = v3.x * sfs32[0] + v3.y * sfs32[4] + v3.z * sfs32[8] + sfs32[12];
				out_v3.y = v3.x * sfs32[1] + v3.y * sfs32[5] + v3.z * sfs32[9] + sfs32[13];
				out_v3.z = v3.x * sfs32[2] + v3.y * sfs32[6] + v3.z * sfs32[10] + sfs32[14];
			}
			transformVector3Self(v3:Vector3D):void
			{
				let x:number = v3.x;
				let y:number = v3.y;
				let z:number = v3.z;
				let sfs32:Float32Array = this.m_localFS32;
				v3.x = x * sfs32[0] + y * sfs32[4] + z * sfs32[8] + sfs32[12];
				v3.y = x * sfs32[1] + y * sfs32[5] + z * sfs32[9] + sfs32[13];
				v3.z = x * sfs32[2] + y * sfs32[6] + z * sfs32[10] + sfs32[14];
			}
			transformVectorSelf(v3:Vector3D):void
			{
				let x:number = v3.x;
				let y:number = v3.y;
				let z:number = v3.z;
				let sfs32:Float32Array = this.m_localFS32;
				v3.setTo(
					x * sfs32[0] + y * sfs32[4] + z * sfs32[8] + sfs32[12],
					x * sfs32[1] + y * sfs32[5] + z * sfs32[9] + sfs32[13],
					x * sfs32[2] + y * sfs32[6] + z * sfs32[10] + sfs32[14],
					x * sfs32[3] + y * sfs32[7] + z * sfs32[11] + sfs32[15]
				);
			}
    		transformVectors(float_vinArr:Float32Array | number[], vinLength:number, float_voutArr:Float32Array):void
			{
				let i:number = 0;
				let x:number, y:number, z:number;
				let pfs:Float32Array = this.m_localFS32;
				vinLength -= 3;
				while (i <= vinLength) {
					x = float_vinArr[i];
					y = float_vinArr[i + 1];
					z = float_vinArr[i + 2];
					float_voutArr[i] = x * pfs[0] + y * pfs[4] + z * pfs[8] + pfs[12];
					float_voutArr[i + 1] = x * pfs[1] + y * pfs[5] + z * pfs[9] + pfs[13];
					float_voutArr[i + 2] = x * pfs[2] + y * pfs[6] + z * pfs[10] + pfs[14];
					i += 3;
				}
			}
    		transformVectorsSelf(float_vinArr:Float32Array | number[], vinLength:number):void
			{
				let i:number = 0;
				let x:number, y:number, z:number;
				let pfs:Float32Array = this.m_localFS32;
				vinLength -= 3;
				while (i <= vinLength) {
					x = float_vinArr[i];
					y = float_vinArr[i + 1];
					z = float_vinArr[i + 2];
					float_vinArr[i] = x * pfs[0] + y * pfs[4] + z * pfs[8] + pfs[12];
					float_vinArr[i + 1] = x * pfs[1] + y * pfs[5] + z * pfs[9] + pfs[13];
					float_vinArr[i + 2] = x * pfs[2] + y * pfs[6] + z * pfs[10] + pfs[14];
					i += 3;
				}
			}
    		transformVectorsRangeSelf(float_vinArr:Float32Array | number[], begin:number, end:number):void
			{
				let i:number = begin;
				let x:number, y:number, z:number;
				let pfs:Float32Array = this.m_localFS32;
				end -= 3;
				while (i <= end) {
					x = float_vinArr[i];
					y = float_vinArr[i + 1];
					z = float_vinArr[i + 2];
					float_vinArr[i] = x * pfs[0] + y * pfs[4] + z * pfs[8] + pfs[12];
					float_vinArr[i + 1] = x * pfs[1] + y * pfs[5] + z * pfs[9] + pfs[13];
					float_vinArr[i + 2] = x * pfs[2] + y * pfs[6] + z * pfs[10] + pfs[14];
					i += 3;
				}
			}
		    transpose():void
			{
				Matrix4.s_tMat4.copyFrom(this);
				let fs32 = Matrix4.s_tMat4.getFS32();
				let sfs32:Float32Array = this.m_localFS32;
				sfs32[1] = fs32[4];
				sfs32[2] = fs32[8];
				sfs32[3] = fs32[12];
				sfs32[4] = fs32[1];
				sfs32[6] = fs32[9];
				sfs32[7] = fs32[13];
				sfs32[8] = fs32[2];
				sfs32[9] = fs32[6];
				sfs32[11] = fs32[14];
				sfs32[12] = fs32[3];
				sfs32[13] = fs32[7];
				sfs32[14] = fs32[11];
		    }
		    interpolateTo(toMat:Matrix4, float_percent:number):void
			{
				let fs32:Float32Array = toMat.getFS32();		
				let fsI:number = toMat.getFSIndex();
				let _g:number = 0;
				let i:number = this.m_index;
				while (_g < 16)
				{
					this.m_fs32[i] += (fs32[fsI + _g] - this.m_fs32[i]) * float_percent;
					++i;
					++_g;
				}
			}
		    private getAxisRotation(x:number, y:number, z:number, radian:number):void
			{
				radian = -radian;
				let sfs32:Float32Array = this.m_localFS32;
				let s:number = Math.sin(radian), c = Math.cos(radian);
				let t:number = 1.0 - c;
				sfs32[0] = c + x * x * t;
				sfs32[5] = c + y * y * t;
				sfs32[10] = c + z * z * t;
				let tmp1:number = x * y * t;
				let tmp2:number = z * s;
				sfs32[4] = tmp1 + tmp2;
				sfs32[1] = tmp1 - tmp2;
				tmp1 = x * z * t;
				tmp2 = y * s;
				sfs32[8] = tmp1 - tmp2;
				sfs32[2] = tmp1 + tmp2;
				tmp1 = y * z * t;
				tmp2 = x * s;
				sfs32[9] = tmp1 + tmp2;
				sfs32[6] = tmp1 - tmp2;
		    }
		    rotationX(radian:number):void
			{
				let s:number = Math.sin(radian), c:number = Math.cos(radian);
				this.m_localFS32[0] = 1.0; this.m_localFS32[1] = 0.0; this.m_localFS32[2] = 0.0;
				this.m_localFS32[4] = 0.0; this.m_localFS32[5] = c; this.m_localFS32[6] = s;
				this.m_localFS32[8] = 0.0; this.m_localFS32[9] = -s; this.m_localFS32[10] = c;
			}
			rotationY(radian:number):void
			{
				let s:number = Math.sin(radian), c:number = Math.cos(radian);
				this.m_localFS32[0] = c; this.m_localFS32[1] = 0.0; this.m_localFS32[2] = -s;
				this.m_localFS32[4] = 0.0; this.m_localFS32[5] = 1.0; this.m_localFS32[6] = 0.0;
				this.m_localFS32[8] = s; this.m_localFS32[9] = 0.0; this.m_localFS32[10] = c;
			}
			rotationZ(radian:number):void
			{
				let s:number = Math.sin(radian), c = Math.cos(radian);
				this.m_localFS32[0] = c; this.m_localFS32[1] = s; this.m_localFS32[2] = 0.0;
				this.m_localFS32[4] = -s; this.m_localFS32[5] = c; this.m_localFS32[6] = 0.0;
				this.m_localFS32[8] = 0.0; this.m_localFS32[9] = 0.0; this.m_localFS32[10] = 1.0;
			}
		    /////////////////////////////////////////////////////////////
		    toString():string
		    {
		        let str:string = "\n"+this.m_localFS32[0]+","+this.m_localFS32[1]+","+this.m_localFS32[2]+","+this.m_localFS32[3]+"\n";
		        str += this.m_localFS32[4]+","+this.m_localFS32[5]+","+this.m_localFS32[6]+","+this.m_localFS32[7]+"\n";
		        str += this.m_localFS32[8]+","+this.m_localFS32[9]+","+this.m_localFS32[10]+","+this.m_localFS32[11]+"\n";
		        str += this.m_localFS32[12]+","+this.m_localFS32[13]+","+this.m_localFS32[14]+","+this.m_localFS32[15]+"\n";
		        return str;
			}
			
			transformPerspV4Self(v4:Vector3D):void
			{
				v4.w = v4.z;
				v4.x *= this.m_localFS32[0];
				v4.y *= this.m_localFS32[5];
				v4.z *= this.m_localFS32[10];
				v4.z += this.m_localFS32[14];
				v4.w *= this.m_localFS32[11];
				v4.w += this.m_localFS32[15];
			}
		    ///////
		    // view etc..
		    ///////////////////////////////////////////
		    perspectiveRH(fovy:number, aspect:number, zNear:number, zFar:number):void
			{
		        //assert(abs(aspect - std::numeric_limits<float>::epsilon()) > minFloatValue)
				let tanHalfFovy = Math.tan(fovy * 0.5);
				this.identity();
				this.m_localFS32[0] = 1.0/(aspect * tanHalfFovy);
				this.m_localFS32[5] = 1.0 / tanHalfFovy;
				this.m_localFS32[10] = -(zFar + zNear) / (zFar - zNear);
				this.m_localFS32[11] = -1.0;
				this.m_localFS32[14] = -(2.0 * zFar * zNear) / (zFar - zNear);
			}
			perspectiveRH2(fovy:number, pw:number,ph:number, zNear:number, zFar:number):void
			{
		        let focalLength:number = pw / Math.tan(fovy * 0.5);
				let m0:number = focalLength / pw;
		        let m5:number = focalLength / ph;
		        let m10:number = -zFar / (zFar - zNear);
		        let m14:number = -zNear * m10;
				this.identity();
				this.m_localFS32[0] = m0;
				this.m_localFS32[5] = m5;
				this.m_localFS32[10] = m10;
				this.m_localFS32[11] = -1.0;
				this.m_localFS32[14] = m14;
			}
			orthoRH(b:number, t:number, l:number, r:number, zNear:number, zFar:number):void
			{
				this.identity();
				this.m_localFS32[0] = 2.0/(r-l);
				this.m_localFS32[5] = 2.0/(t-b);
				this.m_localFS32[10] = -2.0 / (zFar - zNear);
				this.m_localFS32[12] = -(r + l) / (r - l);
				this.m_localFS32[13] = -(t + b) / (t - b);
				this.m_localFS32[14] = -(zFar + zNear) / (zFar - zNear);
				this.m_localFS32[15] = 1.0;
			}

			perspectiveLH(fovy:number, aspect:number, zNear:number, zFar:number):void
			{
		        //assert(abs(aspect - std::numeric_limits<float>::epsilon()) > minFloatValue)
			
				let tanHalfFovy:number = Math.tan(fovy * 0.5);
				this.identity();
				this.m_localFS32[0] = 1.0 / (aspect * tanHalfFovy);
				this.m_localFS32[5] = 1.0 / tanHalfFovy;
				this.m_localFS32[10] = (zFar + zNear) / (zFar - zNear);
				this.m_localFS32[11] = 1.0;
				this.m_localFS32[14] = (2.0 * zFar * zNear) / (zFar - zNear);
			}
			orthoLH(b:number, t:number, l:number, r:number, zNear:number, zFar:number):void
			{
				this.identity();
				this.m_localFS32[0] = 2.0 / (r - l);// / (aspect * tanHalfFovy);
				this.m_localFS32[5] = 2.0 / (t - b);// / tanHalfFovy;
				this.m_localFS32[10] = 2.0 / (zFar - zNear);
				this.m_localFS32[12] = -(r + l) / (r - l);
				this.m_localFS32[13] = -(t + b) / (t - b);
				this.m_localFS32[14] = -(zFar + zNear) / (zFar - zNear);
				this.m_localFS32[15] = 1.0;
			}
			lookAtRH(eye:Vector3D, center:Vector3D, up:Vector3D):void
			{
				this.identity();
				let f:Vector3D = center.subtract(eye);
				f.normalize();
				let s:Vector3D = f.crossProduct(up);
				s.normalize();
				let u:Vector3D = s.crossProduct(f);
				s.w = -s.dot(eye);
				u.w = -u.dot(eye);
				f.w = f.dot(eye);
				f.negate();
				this.copyRowFrom(0, s);
				this.copyRowFrom(1, u);
				this.copyRowFrom(2, f);
			}
			lookAtLH(eye:Vector3D, center:Vector3D, up:Vector3D):void
			{
				this.identity();
				let f:Vector3D = center.subtract(eye);
				f.normalize();
				let s:Vector3D = f.crossProduct(up);
				s.normalize();
				let u:Vector3D = s.crossProduct(f);

				s.w = -s.dot(eye);
				u.w = -u.dot(eye);
				f.w = -f.dot(eye);
				this.copyRowFrom(0, s);
				this.copyRowFrom(1, u);
				this.copyRowFrom(2, f);
			}
			destroy():void
			{
				this.m_localFS32 = null;
				this.m_fs32 = null;
				this.m_index = -1;
			}
		}
		
        export class Matrix4Pool
        {
            private static S_FLAG_BUSY:number = 1;
            private static S_FLAG_FREE:number = 0;
            private static s_matList:Matrix4[] = [];
            private static s_matFlagList:number[] = [];
            private static m_freeIdList:number[] = [];        
			private static s_mfs32Arr:Float32Array = null;
			private static s_baseUid:number = 0;
			private static s_maxUid:number = 0;
			private static s_mtotal:number = 0;

			static GetMatTotal():number
			{
				return Matrix4Pool.s_mtotal;
			}
			static GetFS32Arr():Float32Array
			{
				return Matrix4Pool.s_mfs32Arr;
			}
			static SetFS32Arr(fs32:Float32Array):void
			{
				Matrix4Pool.s_mfs32Arr = fs32;
				let total = Matrix4Pool.s_mtotal;
				let list:Matrix4[] = Matrix4Pool.s_matList;
				for(let i:number = 0; i < total; ++i)
				{
					list[i].setF32Arr(fs32);
				}
			}
            static GetFreeId()
            {
                if(Matrix4Pool.m_freeIdList.length > 0)
                {
                    return Matrix4Pool.m_freeIdList.pop();
                }
                return -1; 
            }

			static Allocate(total:number):void
			{
				if(total < 512)
				{
					total = 512;
				}
				if(Matrix4Pool.s_mtotal < 1)
				{
					//console.log("Matrix4Pool::Allocate(), Matrix total: "+total);
					Matrix4Pool.s_mtotal = total;
					Matrix4Pool.s_mfs32Arr = new Float32Array(total * 16);
					let i:number = 0;
					let mat:Matrix4 = new Matrix4(Matrix4Pool.s_mfs32Arr,i * 16);
					let uid:number = mat.getUid();
					Matrix4Pool.s_baseUid = uid;
					Matrix4Pool.s_maxUid = uid + total;
					for(; i < uid; ++i)
					{
						Matrix4Pool.s_matList.push( null );
                    	Matrix4Pool.s_matFlagList.push(Matrix4Pool.S_FLAG_FREE);
					}
					Matrix4Pool.s_matList.push( mat );
					Matrix4Pool.s_matFlagList.push(Matrix4Pool.S_FLAG_FREE);
					Matrix4Pool.m_freeIdList.push(mat.getUid());

					for(i = 1; i < total; ++i)
					{
						mat = new Matrix4(Matrix4Pool.s_mfs32Arr,i * 16);
						Matrix4Pool.s_matList.push( mat );
                    	Matrix4Pool.s_matFlagList.push(Matrix4Pool.S_FLAG_FREE);
						Matrix4Pool.m_freeIdList.push(mat.getUid());
					}
				}
			}
            static GetMatrix():Matrix4
            {
				let mat:Matrix4 = null;
                let index:number = Matrix4Pool.GetFreeId() - Matrix4Pool.s_baseUid;
                if(index >= 0)
                {
					mat = Matrix4Pool.s_matList[index];
					mat.identity();
					Matrix4Pool.s_matFlagList[index] = Matrix4Pool.S_FLAG_BUSY;
					//console.log("Get a free Matrix !!!");
				}
				else
				{
					//console.error("Matrix4Pool::GetMatrix(), Error Matrix4Pool is empty !!!");
					mat =  new Matrix4();
				}
                return mat;
            }
            static RetrieveMatrix(mat:Matrix4):void
            {
				if(mat != null)
				{
					let uid:number = mat.getUid();
					if(uid >= Matrix4Pool.s_baseUid && uid < Matrix4Pool.s_maxUid)
					{
						if(Matrix4Pool.s_matFlagList[uid - Matrix4Pool.s_baseUid] == Matrix4Pool.S_FLAG_BUSY)
						{
							Matrix4Pool.m_freeIdList.push(uid);
							Matrix4Pool.s_matFlagList[uid - Matrix4Pool.s_baseUid] = Matrix4Pool.S_FLAG_FREE;
						}
					}

				}
            }
		}
	}
}
