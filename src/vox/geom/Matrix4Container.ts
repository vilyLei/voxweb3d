/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
/**
 * matrix container for concurrent compute strategy...
 * 1.父级的matrix变换会影响子类
 * 2.子级的matrix变换不会影响父级
*/

import * as Vector3DT from "../../vox/geom/Vector3";
import * as Matrix4T from "../../vox/geom/Matrix4";
import * as MathConstT from "../../vox/utils/MathConst";

import Vector3D = Vector3DT.vox.geom.Vector3D;
import Matrix4 = Matrix4T.vox.geom.Matrix4;
import Matrix4Pool = Matrix4T.vox.geom.Matrix4Pool;
import MathConst = MathConstT.vox.utils.MathConst;
export namespace vox
{
    export namespace geom
    {
        export class Matrix4Container
        {
            private static __s_uid:number = 0;
            private static s_initData:Float32Array = new Float32Array([
				1.0,0.0,0.0,0.0,
				0.0,1.0,0.0,0.0,
				0.0,0.0,1.0,0.0,
				0.0,0.0,0.0,1.0
			]);
            static readonly UPDATE_NONE:number = 0;
            static readonly UPDATE_POSITION:number = 1;
            static readonly UPDATE_ROTATION:number = 2;
            static readonly UPDATE_SCALE:number = 4;
            static readonly UPDATE_PARENT_MAT:number = 8;

            private m_uid:number = 0;
            private m_fs32:Float32Array = new Float32Array(16);
            //private m_rotateBoo:boolean = false;
            // It is a flag that need inverted mat yes or no
            private m_invMatEnabled:boolean = false;
            private m_updatedStatus:number = 1;
            private m_updateStatus:number = 7;

            private m_parent:Matrix4Container = null;
            private m_childList:Matrix4Container[] = [];
            private m_childListLen:number = 0;

            version:number = 0;

            constructor(mat:Matrix4 = null)
            {
                if(mat == null)
                {
                    mat = Matrix4Pool.GetMatrix();
                }
                this.m_uid = Matrix4Container.__s_uid++;
                this.m_fs32.set(Matrix4Container.s_initData,0);
                this.m_localMat = this.m_omat = mat;
            }
            addChild(child:Matrix4Container):void
            {
                if(child != null && child.m_parent == null && child != this)
                {
                    child.m_parent = this;
                    child.setParentMatrix(this.getMatrix());
                    this.m_childList.push(child);
                    this.m_childListLen++;
                }
            }
            getUid():number{return this.m_uid;}
            getX():number{return this.m_fs32[12];}
            getY():number{return this.m_fs32[13];}
            getZ():number{return this.m_fs32[14];}
            setX(p:number):void{this.m_updateStatus |= 1;this.m_updatedStatus |= 1;this.m_fs32[12] = p;}
            setY(p:number):void{this.m_updateStatus |= 1;this.m_updatedStatus |= 1;this.m_fs32[13] = p;}
            setZ(p:number):void{this.m_updateStatus |= 1;this.m_updatedStatus |= 1;this.m_fs32[14] = p;}
            setXYZ(px:number,py:number,pz:number):void
            {
                this.m_fs32[12] = px;
                this.m_fs32[13] = py;
                this.m_fs32[14] = pz;
                this.m_updateStatus |= 1;
                this.m_updatedStatus |= 1;
            }
            setPosition(pv:Vector3D):void
            {
                this.m_fs32[12] = pv.x;
                this.m_fs32[13] = pv.y;
                this.m_fs32[14] = pv.z;
                this.m_updateStatus |= 1;
                this.m_updatedStatus |= 1;
            }
            getPosition(pv:Vector3D):void
            {          
                pv.x = this.m_fs32[12];
                pv.y = this.m_fs32[13];
                pv.z = this.m_fs32[14];
            }
            copyPositionFrom(t:Matrix4Container):void
            {
                if(t != null)
                {
                    this.m_fs32[12] = t.m_fs32[12];
                    this.m_fs32[13] = t.m_fs32[13];
                    this.m_fs32[14] = t.m_fs32[14];
                    this.m_updateStatus |= 1;
                    this.m_updatedStatus |= 1;
                }
            }
            getRotationX():number{return this.m_fs32[1];}
            getRotationY():number{return this.m_fs32[6];}
            getRotationZ():number{return this.m_fs32[9];}
            setRotationX(degrees:number):void{this.m_fs32[1] = degrees;this.m_updateStatus |= 2;this.m_updatedStatus |= 2;}
            setRotationY(degrees:number):void{this.m_fs32[6] = degrees;this.m_updateStatus |= 2;this.m_updatedStatus |= 2;}
            setRotationZ(degrees:number):void{this.m_fs32[9] = degrees;this.m_updateStatus |= 2;this.m_updatedStatus |= 2;}
            setRotationXYZ(rx:number,ry:number,rz:number):void
            {
                this.m_fs32[1] = rx;
                this.m_fs32[6] = ry;
                this.m_fs32[9] = rz;
                this.m_updateStatus |= 2;
                this.m_updatedStatus |= 2;
            }
            getScaleX():number{return this.m_fs32[0];}
            getScaleY():number{return this.m_fs32[5];}
            getScaleZ():number{return this.m_fs32[10];}
            setScaleX(p:number):void{this.m_fs32[0] = p;this.m_updateStatus |= 4;this.m_updatedStatus |= 4;}
            setScaleY(p:number):void{this.m_fs32[5] = p;this.m_updateStatus |= 4;this.m_updatedStatus |= 4;}
            setScaleZ(p:number):void{this.m_fs32[10] = p;this.m_updateStatus |= 4;this.m_updatedStatus |= 4;}
            setScaleXYZ(sx:number,sy:number,sz:number):void
            {
                this.m_fs32[0] = sx;
                this.m_fs32[5] = sy;
                this.m_fs32[10] = sz;
                
                this.m_updateStatus |= 4;
                this.m_updatedStatus |= 4;
            }
            setScale(s:number):void
            {
                this.m_fs32[0] = s;
                this.m_fs32[5] = s;
                this.m_fs32[10] = s;
                this.m_updateStatus |= 4;
                this.m_updatedStatus |= 4;
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
                if (this.m_updateStatus > 0)
	        	{
                    this.update();
                }
                return this.m_localMat;
            }
            // get local to world matrix, maybe need call update function
            getMatrix():Matrix4
            {
                if (this.m_updateStatus)
	        	{
                    this.update();
                }
                return this.m_omat;
            }
            copyMatrixTo(mat:Matrix4):void
            {
                if (this.m_updateStatus)
	        	{
                    this.update();
                }
                mat.copyFrom(this.m_omat);
            }
            // local to world matrix, 使用的时候注意数据安全->防止多个显示对象拥有而出现多次修改的问题,因此此函数尽量不要用
            setParentMatrix(matrix:Matrix4):void
            {
                this.m_parentMat = matrix;
                this.m_invMatEnabled = true;
                if(this.m_parentMat != null)
                {
                    if(this.m_localMat == this.m_omat)
                    {
                        this.m_updateStatus = 7;
                        this.m_localMat = Matrix4Pool.GetMatrix();
                    }
                    else
                    {
                        this.m_updateStatus |= Matrix4Container.UPDATE_PARENT_MAT;
                    }
                }
            }
            updateMatrixData(matrix:Matrix4):void
            {
                if(matrix != null)
                {
                    this.m_updateStatus = 0;
                    this.m_invMatEnabled = true;
                    this.m_omat.copyFrom(matrix);
                }
            }
            __$setMatrix(matrix:Matrix4):void
            {
                if(matrix != null)
                {
                    this.m_updateStatus = 0;
                    this.m_invMatEnabled = true;
                    if(this.m_localMat == this.m_omat)
                    {
                        this.m_localMat = matrix;
                    }
                    if(this.m_omat != null) Matrix4Pool.RetrieveMatrix(this.m_omat);
                    this.m_omat = matrix;
                }
            }
            public destroy():void
            {
                if(this.m_fs32 != null)
                {
                    if(this.m_childListLen > 0)
                    {
                        for(let i:number = 0; i < this.m_childListLen; i++)
                        {
                            this.m_childList[i].destroy();
                            this.m_childList[i] = null;
                        }
                        this.m_childList = [];
                        this.m_childListLen = 0;
                    }
                    // 当自身被完全移出RenderWorld之后才能执行自身的destroy
                    if(this.m_invOmat != null) Matrix4Pool.RetrieveMatrix(this.m_invOmat);
                    if(this.m_localMat != null) Matrix4Pool.RetrieveMatrix(this.m_localMat);
                    if(this.m_omat != null && this.m_omat != this.m_localMat) Matrix4Pool.RetrieveMatrix(this.m_omat);
                    this.m_invOmat = null;
                    this.m_localMat = null;
                    this.m_omat = null;
                    this.m_parentMat = null;
                    this.m_updateStatus = 7;

                    this.m_fs32 = null;
                }
            }
            update():void
            {
                //trace("Matrix4Container::update(), m_updateStatus: "+m_updateStatus);
                if (this.m_updateStatus > 0)
	        	{
                    if(this.m_parentMat != null)
                    {
                        if(this.m_updateStatus != Matrix4Container.UPDATE_PARENT_MAT)
                        {
                            this.m_localMat.getLocalFS32().set(this.m_fs32,0);
                            if((this.m_updatedStatus&Matrix4Container.UPDATE_ROTATION)==Matrix4Container.UPDATE_ROTATION)
                            {
                                this.m_localMat.setRotationEulerAngle(this.m_fs32[1] * MathConst.MATH_PI_OVER_180, this.m_fs32[6] * MathConst.MATH_PI_OVER_180, this.m_fs32[9] * MathConst.MATH_PI_OVER_180); 
                            }
                        }
                        this.m_omat.copyFrom(this.m_localMat);
                        //console.log("Matrix4Container::update(), this.m_parentMat: "+this.m_parentMat.toString());
                        this.m_omat.append( this.m_parentMat );
                        //console.log("append parent mat");
                    }
                    else
                    {
                        this.m_localMat.getLocalFS32().set(this.m_fs32,0);
                        if((this.m_updatedStatus&Matrix4Container.UPDATE_ROTATION)==Matrix4Container.UPDATE_ROTATION)
                        {
                            this.m_localMat.setRotationEulerAngle(this.m_fs32[1] * MathConst.MATH_PI_OVER_180, this.m_fs32[6] * MathConst.MATH_PI_OVER_180, this.m_fs32[9] * MathConst.MATH_PI_OVER_180); 
                        }
                    }
                    this.version++;
                    //console.log("Matrix4Container::update(), this.m_omat: "+this.m_omat.toString());
                    this.m_updateStatus = 0;
                    this.m_invMatEnabled = true;
                    
                    // 子集需要做相应变换
                    if(this.m_childListLen > 0)
                    {
                        for(let i:number = 0; i < this.m_childListLen; i++)
                        {
                            this.m_childList[i].setParentMatrix(this.m_omat);
                            this.m_childList[i].update();
                        }
                    }
                }
                else
                {
                    // 子集需要做相应变换
                    //console.log("B this.m_childListLen: "+this.m_childListLen);
                    if(this.m_childListLen > 0)
                    {
                        for(let i:number = 0; i < this.m_childListLen; i++)
                        {
                            this.m_childList[i].update();
                        }
                    }
                }
                
            }
            getMatrixFS32():Float32Array
            {
                return this.getMatrix().getLocalFS32();
            }
        }
    }
}