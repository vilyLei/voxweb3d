/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import MathConst from "../../vox/math/MathConst";
import Vector3D from "../../vox/math/Vector3D";
import Matrix4 from "../../vox/math/Matrix4";
import Matrix4Pool from "../../vox/math/Matrix4Pool";
import {IRenderCamera} from "../../vox/render/IRenderCamera";

export default class CameraTrack
{
    constructor()
    {
    }
    
    private m_matrix:Matrix4 = Matrix4Pool.GetMatrix();
    private m_position:Vector3D = new Vector3D();
    private m_direction:Vector3D = new Vector3D();
    //
    private m_angle:number = 0.0;
    private m_updateEnabled:boolean = false;
    private m_camera:IRenderCamera = null;

    destroy():void
    {
        this.m_camera = null;
    }
    bindCamera(cam:IRenderCamera):void
    {
        this.m_camera = cam;
        if (cam!= null)
        {
            this.m_direction.copyFrom(this.m_camera.getPosition());
            this.m_direction.subtractBy(this.m_camera.getLookAtPosition());
        }
    }
    update():void
    {
        if (this.m_camera != null && this.m_updateEnabled)
        {
            this.m_updateEnabled = false;
        }
    }
    rotationOffsetAngleWorldY(float_degrees:number):void
    {
        this.m_angle = float_degrees;
        this.m_updateEnabled = true;
        this.m_direction.copyFrom(this.m_camera.getPosition());
        this.m_direction.subtractBy(this.m_camera.getLookAtPosition());
        this.m_matrix.identity();
        this.m_matrix.appendRotationY(this.m_angle * MathConst.MATH_PI_OVER_180);
        this.m_position.copyFrom(this.m_direction);
        this.m_matrix.transformVectorSelf(this.m_position);
        this.m_position.addBy(this.m_camera.getLookAtPosition());
        this.m_camera.setPosition(this.m_position);
    }
    rotationOffsetAngleWordX(float_degrees:number):void
    {
        this.m_angle = float_degrees;
        this.m_updateEnabled = true;
        this.m_direction.copyFrom(this.m_camera.getPosition());
        this.m_direction.subtractBy(this.m_camera.getLookAtPosition());
        this.m_matrix.identity();
        this.m_matrix.appendRotationX(this.m_angle * MathConst.MATH_PI_OVER_180);
        this.m_position.copyFrom(this.m_direction);
        this.m_matrix.transformVectorSelf(this.m_position);
        this.m_position.addBy(this.m_camera.getLookAtPosition());
        this.m_camera.setPosition(this.m_position);
    }
    rotationOffsetAngleWordZ(float_degrees:number):void
    {
        this.m_angle = float_degrees;
        this.m_updateEnabled = true;
        this.m_direction.copyFrom(this.m_camera.getPosition());
        this.m_direction.subtractBy(this.m_camera.getLookAtPosition());
        this.m_matrix.identity();
        this.m_matrix.appendRotationZ(this.m_angle * MathConst.MATH_PI_OVER_180);
        this.m_position.copyFrom(this.m_direction);
        this.m_matrix.transformVectorSelf(this.m_position);
        this.m_position.addBy(this.m_camera.getLookAtPosition());
        this.m_camera.setPosition(this.m_position);
    }
}