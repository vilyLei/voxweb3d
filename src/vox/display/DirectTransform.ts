/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// 只是用transform 和一个 DirectTransform 一一对应, 只是记录transform的最终形态

import * as MathConstT from "../../vox/utils/MathConst";
import * as Vector3T from "../../vox/geom/Vector3";
import * as Matrix4T from "../../vox/geom/Matrix4";
import * as ROTransformT from "../../vox/display/ROTransform";

import MathConst = MathConstT.vox.utils.MathConst;
import Vector3D = Vector3T.vox.geom.Vector3D;
import Matrix4 = Matrix4T.vox.geom.Matrix4;
import Matrix4Pool = Matrix4T.vox.geom.Matrix4Pool;
import ROTransform = ROTransformT.vox.display.ROTransform;

//DirectTransform
export namespace vox
{
    export namespace display
    {
        export class DirectTransform
        {
            
            constructor()
            {
            }
            private m_trans:ROTransform = null;
            private m_dAng:number = 0.0;
            private m_tv3:Vector3D = new Vector3D();
            private m_direcM:Matrix4 = null;
            private m_direcV:Vector3D = null;
            private m_directV:Vector3D = null;
            private m_bv:Vector3D = new Vector3D(1.0,0.0,0.0);
            bindTransform(trans:ROTransform):void
            {
                this.m_trans = trans;
            }
            /*
	        * 使显示对象朝向某个方向,可能会绕着朝向这个轴旋转
	        * @param				directV		将要变化到的朝向的方向矢量(默认是物体原+x的朝向将被更改), directVb == null, direction was disabled
	        * @param				maxAng		本次向目标朝向变化的最大变化角度,如果当前转向所需的角度大于这个值，则使用maxAng的值
	        * 									此参数用于实现朝向变化的平滑差值
	        * @param				bv			初始朝向(默认是 Vector3D(1.0, 0.0, 0.0))
	        */
            directTo(directV:Vector3D, bv:Vector3D, maxAng:number = 1000.0):void
            {
                if(directV != null)
                {
                    this.m_directV = directV;
                    if(bv != null) this.m_bv.copyFrom(bv);
                    if (this.m_direcV == null) this.m_direcV = new Vector3D();
                    this.m_direcV.setTo(this.m_bv.x, this.m_bv.y, this.m_bv.z);
                    let ang:number = Vector3D.RadianBetween(this.m_direcV, directV);
	        	    this.m_dAng = Math.abs(ang);
                    if (this.m_dAng > 0.01)
                    {
                        if (this.m_direcM != null)
                        {
	        	    		this.m_direcM.identity();
                        }
                        else
                        {
                            this.m_direcM = Matrix4Pool.GetMatrix();
                        }
                        Vector3D.Cross(this.m_direcV, directV, this.m_tv3);
                        this.m_tv3.normalize();
                        if (this.m_dAng > maxAng)
                        {
	        	    		if (ang * maxAng < 0) maxAng *= -1;
	        	    	}else {
	        	    		maxAng = ang;
	        	    	}
	        	    	this.m_direcM.appendRotation(maxAng, this.m_tv3);
                        this.m_direcV.copyFrom(directV);
                        if(this.m_trans != null)
                        {
                            this.m_trans.setParentMatrix(this.m_direcM);
                        }
                    }
                }
                else if(this.m_directV != null)
                {
                    this.m_directV = null;
                    this.m_bv.setTo(1.0,0.0,0.0);
                    if(this.m_trans != null)
                    {
                        this.m_trans.setParentMatrix(null);
                    }
                }
            }            
        }
    }
}