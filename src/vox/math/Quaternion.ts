
/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as MathConstT from "../../vox/math/MathConst";
import * as Vector3DT from "../../vox/math/Vector3D";

import MathConst = MathConstT.vox.math.MathConst;
import Vector3D = Vector3DT.vox.math.Vector3D;

export namespace vox
{
    export namespace math
    {
		/**
		 * vox.math.Quaternion
		 * 
		 * 用于表示基本的四元数对象
		 * 
		 * @author Vily
		 */
		export class Quaternion
		{
			w:number = 0.0;
			x:number = 0.0;
			y:number = 0.0;
			z:number = 0.0;
			private m_sin:number = 0.0;
			private m_cos:number = 0.0;
			private m_rad:number = 0.0;
			constructor(w:number = 0.0, x:number = 0.0, y:number = 0.0, z:number = 0.0)
			{
				this.w = w;
				this.x = x;
				this.y = y;
				this.z = z;
			}
			initState(w:number = 0, x:number = 0, y:number = 0, z:number = 0):void
			{
				this.w = w;
				this.x = x;
				this.y = y;
				this.z = z;
			}
			setAngRadAndNV(pang:number, nv:Vector3D):void
			{
				this.m_rad =  pang * MathConst.MATH_PI_OVER_180;
				this.m_cos = Math.cos(0.5 * this.m_rad);
				this.m_sin = Math.sin(0.5 * this.m_rad);			
				this.w = this.m_cos;
				this.x = nv.x * this.m_sin;
				this.y = nv.y * this.m_sin;
				this.z = nv.z * this.m_sin;
			}
			setRotRadAndNV(prad:number, nv:Vector3D):void
			{
				this.m_rad = prad;
				this.m_cos = Math.cos(0.5 * this.m_rad);
				this.m_sin = Math.sin(0.5 * this.m_rad);

				this.w = this.m_cos;
				this.x = nv.x * this.m_sin;
				this.y = nv.y * this.m_sin;
				this.z = nv.z * this.m_sin;
			}		
			setRad(r:number):void
			{
				this.m_rad = r;
				this.m_cos = Math.cos(0.5 * this.m_rad);
				this.m_sin = Math.sin(0.5 * this.m_rad);
			}
			getRad():number
			{
				return this.m_rad;
			}
			updateRot():void
			{
				this.w = this.m_cos;
				this.x *= this.m_sin;
				this.y *= this.m_sin;
				this.z *= this.m_sin;
			}
			setXYZ(px:number, py:number, pz:number):void
			{
				this.x = px;
				this.y = py;
				this.z = pz;
			}
			add(q:Quaternion):void
			{
				this.w += q.w;
				this.x += q.x;
				this.y += q.y;
				this.z += q.z;
			}
			sub(q:Quaternion):void
			{
				this.w -= q.w;
				this.x -= q.x;
				this.y -= q.y;
				this.z -= q.z;
			}
			scale(s:number):void
			{
				this.w *= s;
				this.x *= s;
				this.y *= s;
				this.z *= s;
			}		
			mulToThis(q1:Quaternion, q2:Quaternion):void
			{
				let pw:number = q1.w * q2.w - q1.x * q2.x - q1.y * q2.y - q1.z * q2.z;
				let px:number = q1.w * q2.x + q1.x * q2.w + q1.y * q2.z - q1.z * q2.y;
				let py:number = q1.w * q2.y - q1.x * q2.z + q1.y * q2.w + q1.z * q2.x;
				let pz:number = q1.w * q2.z + q1.x * q2.y - q1.y * q2.x + q1.z * q2.w;
				this.w = pw;
				this.x = px;
				this.y = py;
				this.z = pz;
			}		
			mul(q:Quaternion):void
			{
				let pw:number = this.w * q.w - this.x * q.x - this.y * q.y - this.z * q.z;
				let px:number = this.w * q.x + this.x * q.w + this.y * q.z - this.z * q.y;
				let py:number = this.w * q.y - this.x * q.z + this.y * q.w + this.z * q.x;
				let pz:number = this.w * q.z + this.x * q.y - this.y * q.x + this.z * q.w;
				this.w = pw;
				this.x = px;
				this.y = py;
				this.z = pz;
			}
			mulNew(q2:Quaternion):Quaternion
			{
				let q:Quaternion = new Quaternion();
				q.w = this.w * q2.w - this.x * q2.x - this.y * q2.y - this.z * q2.z;
				q.x = this.w * q2.x + this.x * q2.w + this.y * q2.z - this.z * q2.y;
				q.y = this.w * q2.y - this.x * q2.z + this.y * q2.w + this.z * q2.x;
				q.z = this.w * q2.z + this.x * q2.y - this.y * q2.x + this.z * q2.w;
				return q;
			}
			/**
			 * 四元数乘以3D矢量 Vector3D,实现四元数对一个顶点的旋转
			 * @param				q		一个四元数对象
			 * @param				v		一个 3D矢量 Vector3D
			 * @param				outV	计算结果存放于一个 Vector3D 中
			 * */
			static quatMulV3(q:Quaternion, v:Vector3D, outV:Vector3D ):void
			{
				let xx:number = q.x * q.x;
				let yy:number = q.y * q.y;
				let zz:number = q.z * q.z;
				let xy:number = q.x * q.y;
				let yz:number = q.y * q.z;
				let xz:number = q.x * q.z;
				let sx:number = q.w * q.x;
				let sy:number = q.w * q.y;
				let sz:number = q.w * q.z;
				let tx:number = v.x * (0.5 - yy - zz) + v.y * (xy - sz) + v.z * (xz + sy);
				let ty:number = v.x * (xy + sz) + v.y * (0.5 - xx - zz) + v.z * (yz - sx);
				let tz:number = v.x * (xz - sy) + v.y * (yz + sx) + v.z * (0.5 - xx - yy);
				outV.x = tx * 2.0;
				outV.y = ty * 2.0;
				outV.z = tz * 2.0;
			}
			rotate(q:Quaternion, v:Vector3D):void
			{
				let pw:number = -q.x * v.x - q.y * v.y - q.z * v.z;
				let px:number = q.w * v.x + q.y * v.z - q.z * v.y;
				let py:number = q.w * v.y - q.x * v.z + q.z * v.x;
				let pz:number = q.w * v.z + q.x * v.y - q.y * v.x;
				this.w = q.w + pw * 0.5;
				this.x = q.x + px * 0.5;
				this.y = q.y + py * 0.5;
				this.z = q.z + pz * 0.5;
			}
			normalizeFrom(q:Quaternion):void
			{
				let len:number = Math.sqrt(q.w * q.w + q.x * q.x + q.y * q.y + q.z * q.z);
				if (len > MathConst.MATH_MIN_POSITIVE) len = 1.0 / len;
				this.w = q.w * len;
				this.x = q.x * len;
				this.y = q.y * len;
				this.z = q.z * len;
			}
			normalize():void
			{
				let len:number = Math.sqrt(this.w * this.w + this.x * this.x + this.y * this.y + this.z * this.z);
				if (len > MathConst.MATH_MIN_POSITIVE) len = 1 / len;
				this.w *= len;
				this.x *= len;
				this.y *= len;
				this.z *= len;
			}
			/*
			// 取反
			negate():void
			{
				w *= -1;
				x *= -1;
				y *= -1;
				z *= -1;
			}
			*/
			/**
			 * 得到当前 四元数的 逆
			 * */
			invert():void
			{
				this.adjoint();
				this.normalize();
			}
			/**
			 * 共轭
			 * */
			adjoint():void
			{
				this.x *= -1.0;
				this.y *= -1.0;
				this.z *= -1.0;
			}
			/**
			 * 共轭
			 * */
			adjointNew():Quaternion
			{			
				return new Quaternion(this.w,-1 * this.x, -1 * this.y,-1 * this.z);
			}
			getLength():number
			{
				return Math.sqrt(this.w * this.w + this.x * this.x + this.y * this.y + this.z * this.z);
			}
			copyFrom(q:Quaternion):void
			{
				this.w = q.w;
				this.x = q.x;
				this.y = q.y;
				this.z = q.z;
			}
			clone():Quaternion
			{
				return new Quaternion(this.w, this.x, this.y, this.z);
			}
			toString():String
			{
				return "Quaternion(" + this.w + ", " + this.x + ", " + this.y+ ", " + this.z + ")";
			}
		}
	}
}