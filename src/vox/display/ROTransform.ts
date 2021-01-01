/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// 只是用transform 和一个 ROTransform 一一对应, 只是记录transform的最终形态

import * as MathConstT from "../../vox/utils/MathConst";
import * as Vector3T from "../../vox/geom/Vector3";
import * as Matrix4T from "../../vox/geom/Matrix4";

import MathConst = MathConstT.vox.utils.MathConst;
import Vector3D = Vector3T.vox.geom.Vector3D;
import Matrix4 = Matrix4T.vox.geom.Matrix4;
import Matrix4Pool = Matrix4T.vox.geom.Matrix4Pool;

//ROTransform
export namespace vox
{
    export namespace display
    {
        export class ROTransform
        {
            private static __s_uid:number = 0;
            private static s_initData:Float32Array = new Float32Array([
				1.0,0.0,0.0,0.0,
				0.0,1.0,0.0,0.0,
				0.0,0.0,1.0,0.0,
				0.0,0.0,0.0,1.0
			]);
            static UPDATE_NONE:number = 0;
            static UPDATE_POSITION:number = 1;
            static UPDATE_ROTATION:number = 2;
            static UPDATE_SCALE:number = 4;

            private m_uid:number = 0;
            private m_fs32:Float32Array = new Float32Array(16);
            constructor()
            {
                this.m_uid = ROTransform.__s_uid++;
            }
            //private m_rotateBoo:boolean = false;
            // It is a flag that need inverted mat yes or no
            private m_invMatEnabled:boolean = false;
            //public version:number = -1;
            updatedStatus:number = 1;
            updateStatus:number = 7;

            getUid():number{return this.m_uid;}
            getX():number{return this.m_fs32[12];}
            getY():number{return this.m_fs32[13];}
            getZ():number{return this.m_fs32[14];}
            setX(p:number):void{this.updateStatus |= 1;this.updatedStatus |= 1;this.m_fs32[12] = p;}
            setY(p:number):void{this.updateStatus |= 1;this.updatedStatus |= 1;this.m_fs32[13] = p;}
            setZ(p:number):void{this.updateStatus |= 1;this.updatedStatus |= 1;this.m_fs32[14] = p;}
            setXYZ(px:number,py:number,pz:number):void
            {
                this.m_fs32[12] = px;
                this.m_fs32[13] = py;
                this.m_fs32[14] = pz;
                this.updateStatus |= 1;
                this.updatedStatus |= 1;
            }
            setPosition(pv:Vector3D):void
            {
                this.m_fs32[12] = pv.x;
                this.m_fs32[13] = pv.y;
                this.m_fs32[14] = pv.z;
                this.updateStatus |= 1;
                this.updatedStatus |= 1;
            }
            getPosition(pv:Vector3D):void
            {          
                pv.x = this.m_fs32[12];
                pv.y = this.m_fs32[13];
                pv.z = this.m_fs32[14];
            }

            copyPositionFrom(t:ROTransform):void
            {
                if(t != null)
                {
                    this.m_fs32[12] = t.m_fs32[12];
                    this.m_fs32[13] = t.m_fs32[13];
                    this.m_fs32[14] = t.m_fs32[14];
                    this.updateStatus |= 1;
                    this.updatedStatus |= 1;
                }
            }
            getRotationX():number{return this.m_fs32[1];}
            getRotationY():number{return this.m_fs32[6];}
            getRotationZ():number{return this.m_fs32[9];}
            setRotationX(degrees:number):void{this.m_fs32[1] = degrees;this.updateStatus |= 2;this.updatedStatus |= 2;}
            setRotationY(degrees:number):void{this.m_fs32[6] = degrees;this.updateStatus |= 2;this.updatedStatus |= 2;}
            setRotationZ(degrees:number):void{this.m_fs32[9] = degrees;this.updateStatus |= 2;this.updatedStatus |= 2;}
            setRotationXYZ(rx:number,ry:number,rz:number):void
            {
                this.m_fs32[1] = rx;
                this.m_fs32[6] = ry;
                this.m_fs32[9] = rz;
                this.updateStatus |= 2;
                this.updatedStatus |= 2;
            }
            getScaleX():number{return this.m_fs32[0];}
            getScaleY():number{return this.m_fs32[5];}
            getScaleZ():number{return this.m_fs32[10];}
            setScaleX(p:number):void{this.m_fs32[0] = p;this.updateStatus |= 4;this.updatedStatus |= 4;}
            setScaleY(p:number):void{this.m_fs32[5] = p;this.updateStatus |= 4;this.updatedStatus |= 4;}
            setScaleZ(p:number):void{this.m_fs32[10] = p;this.updateStatus |= 4;this.updatedStatus |= 4;}
            setScaleXYZ(sx:number,sy:number,sz:number):void
            {
                this.m_fs32[0] = sx;
                this.m_fs32[5] = sy;
                this.m_fs32[10] = sz;
                
                this.updateStatus |= 4;
                this.updatedStatus |= 4;
            }
            setScale(s:number):void
            {
                this.m_fs32[0] = s;
                this.m_fs32[5] = s;
                this.m_fs32[10] = s;
                this.updateStatus |= 4;
                this.updatedStatus |= 4;
            }
            // local to world spcae matrix
            private m_omat:Matrix4 = null;
            private m_localMat:Matrix4 = null;
            private m_parentMat:Matrix4 = null;
            // word to local matrix
            private m_invOmat:Matrix4 = null;
            
            localToGlobal(pv:Vector3D):void
            {
                this.getMatrix().transformVectorSelf(pv);
            }
            globalToLocal(pv:Vector3D):void
            {
                this.getInvMatrix().transformVectorSelf(pv);
            }
            // maybe need call update function
            getInvMatrix():Matrix4
            {
                if(this.m_invOmat != null)
                {
                    if(this.m_invMatEnabled)
                    {
                        this.m_invOmat.copyFrom(this.m_omat);
                        this.m_invOmat.invert();
                    }
                }
                else
                {
                    this.m_invOmat = Matrix4Pool.GetMatrix();
                    this.m_invOmat.copyFrom(this.m_omat);
                    this.m_invOmat.invert();
                }
                this.m_invMatEnabled = false;
                return this.m_invOmat;
            }
            getLocalMatrix():Matrix4
            {
                if (this.updateStatus > 0)
	        	{
                    this.update();
                }
                return this.m_localMat;
            }
            // get local to world matrix, maybe need call update function
            getMatrix():Matrix4
            {
                if (this.updateStatus)
	        	{
                    this.update();
                }
                return this.m_omat;
            }
            // local to world matrix, 使用的时候注意数据安全->防止多个显示对象拥有而出现多次修改的问题,因此此函数尽量不要用
            setParentMatrix(matrix:Matrix4):void
            {
                //console.log("sTOTransform::etParentMatrix(), this.m_parentMat != matrix: "+(this.m_parentMat != matrix));
                //if(matrix != null)console.log("sTOTransform::etParentMatrix(), this.m_parentMat: "+matrix.toString());
                this.m_parentMat = matrix;
                this.m_invMatEnabled = true;
                if(this.m_parentMat != null)
                {
                    if(this.m_localMat == this.m_omat)
                    {
                        this.updateStatus = 7;
                        this.m_localMat = Matrix4Pool.GetMatrix();
                    }
                    else
                    {
                        this.updateStatus = 8;
                    }
                }
            }
            updateMatrixData(matrix:Matrix4):void
            {
                if(matrix != null)
                {
                    this.updateStatus = 0;
                    this.m_invMatEnabled = true;
                    this.m_omat.copyFrom(matrix);
                }
            }
            __$setMatrix(matrix:Matrix4):void
            {
                if(matrix != null)
                {
                    this.updateStatus = 0;
                    this.m_invMatEnabled = true;
                    if(this.m_localMat == this.m_omat)
                    {
                        this.m_localMat = matrix;
                    }
                    if(this.m_omat != null) Matrix4Pool.RetrieveMatrix(this.m_omat);
                    this.m_omat = matrix;
                }
            }
            private destroy():void
            {
                // 当自身被完全移出RenderWorld之后才能执行自身的destroy
                if(this.m_invOmat != null) Matrix4Pool.RetrieveMatrix(this.m_invOmat);
                if(this.m_localMat != null) Matrix4Pool.RetrieveMatrix(this.m_localMat);
                if(this.m_omat != null && this.m_omat != this.m_localMat) Matrix4Pool.RetrieveMatrix(this.m_omat);
                this.m_invOmat = null;
                this.m_localMat = null;
                this.m_omat = null;
                this.m_parentMat = null;
                this.updateStatus = 7;
            }
            update():void
            {
                //trace("ROTransform::update(), updateStatus: "+updateStatus);
                if (this.updateStatus > 0)
	        	{
                    //trace("ROTransform::update(), m_uid: "+m_uid);
                    
                    //console.log("ROTransform::update(), this.m_localMat: "+this.m_localMat.toString());
                    if(this.m_parentMat != null)
                    {
                        if(this.updateStatus != 8)
                        {
                            this.m_localMat.getLocalFS32().set(this.m_fs32,0);
                            if((this.updatedStatus&ROTransform.UPDATE_ROTATION)==ROTransform.UPDATE_ROTATION)
                            {
                                this.m_localMat.setRotationEulerAngle(this.m_fs32[1] * MathConst.MATH_PI_OVER_180, this.m_fs32[6] * MathConst.MATH_PI_OVER_180, this.m_fs32[9] * MathConst.MATH_PI_OVER_180); 
                            }
                        }
                        this.m_omat.copyFrom(this.m_localMat);
                        //console.log("ROTransform::update(), this.m_parentMat: "+this.m_parentMat.toString());
                        this.m_omat.append( this.m_parentMat );
                    }
                    else
                    {
                        this.m_localMat.getLocalFS32().set(this.m_fs32,0);
                        if((this.updatedStatus&ROTransform.UPDATE_ROTATION)==ROTransform.UPDATE_ROTATION)
                        {
                            this.m_localMat.setRotationEulerAngle(this.m_fs32[1] * MathConst.MATH_PI_OVER_180, this.m_fs32[6] * MathConst.MATH_PI_OVER_180, this.m_fs32[9] * MathConst.MATH_PI_OVER_180); 
                        }
                    }
                    //console.log("ROTransform::update(), this.m_omat: "+this.m_omat.toString());
                    this.updateStatus = 0;
                    this.m_invMatEnabled = true;
	        	}
            }
            getMatrixFS32():Float32Array
            {
                return this.getMatrix().getLocalFS32();
            }
            toString():string
            {
                return "[ROTransform(uid = "+this.m_uid+")]";
            }
            
            private static __S_FLAG_BUSY:number = 1;
            private static __S_FLAG_FREE:number = 0;
            private static m_unitFlagList:number[] = [];
            private static m_unitIndexPptFlagList:number[] = [];
            private static m_unitListLen:number = 0;
            private static m_unitList:ROTransform[] = [];
            private static m_freeIdList:number[] = [];
            private static GetFreeId():number
            {
                if(ROTransform.m_freeIdList.length > 0)
                {
                    return ROTransform.m_freeIdList.pop();
                }
                return -1;
            }
            static Create(matrix:Matrix4 = null):ROTransform
            {
                let unit:ROTransform = null;
                let index:number = ROTransform.GetFreeId();
                if(index >= 0)
                {
                    unit = ROTransform.m_unitList[index];
                    ROTransform.m_unitFlagList[index] = ROTransform.__S_FLAG_BUSY;
                }
                else
                {
                    unit = new ROTransform();
                    ROTransform.m_unitList.push( unit );
                    ROTransform.m_unitIndexPptFlagList.push(ROTransform.__S_FLAG_FREE);
                    ROTransform.m_unitFlagList.push(ROTransform.__S_FLAG_BUSY);
                    ROTransform.m_unitListLen++;
                }
                if(matrix == null)
                {
                    unit.m_omat = Matrix4Pool.GetMatrix();
                }
                else
                {
                    unit.m_omat = matrix;
                }
                unit.m_localMat = unit.m_omat;
                unit.m_fs32.set(ROTransform.s_initData,0);
                return unit;
            }
            
            static Restore(pt:ROTransform):void
            {
                if(pt != null && ROTransform.m_unitFlagList[pt.getUid()] == ROTransform.__S_FLAG_BUSY)
                {
                    let uid:number = pt.getUid();
                    ROTransform.m_freeIdList.push(uid);
                    ROTransform.m_unitFlagList[uid] = ROTransform.__S_FLAG_FREE;
                    pt.destroy();
                }
            }
        }
    }
}