
/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// 摄像机拉近拉远的控制(主要是移动端的多点触摸)

import Vector3D from "../../vox/math/Vector3D";
import Stage3D from "../../vox/display/Stage3D";
import CameraBase from "../../vox/view/CameraBase";
import DivLog from "../../vox/utils/DivLog";
import MouseEvent from "../../vox/event/MouseEvent";
export default class CameraZoomController
{
    private m_camera:CameraBase = null;
    
    private m_touchZoomBoo:boolean = false;
    private m_preDis:number = 0;
    private m_touchZoomSpd:number = 1.0;
    private m_mouseWheelZoomSpd:number = 0.5;
    private m_va:Vector3D = new Vector3D();
    private m_vb:Vector3D = new Vector3D();
    private m_fowardDis:number = 0;
    private m_initBoo:boolean = true;
    constructor()
    {
    }
    setMobileZoomSpd(spd:number)
    {
        this.m_touchZoomSpd = spd;
    }
    setMouseWheelZoomSpd(spd:number)
    {
        this.m_mouseWheelZoomSpd = spd;
    }
    bindCamera(camera:CameraBase)
    {
        this.m_camera = camera;
    }
    initialize(stage3D:Stage3D):void
    {
        if(this.m_initBoo)
        {
            this.m_initBoo = false;
            stage3D.addEventListener(MouseEvent.MOUSE_WHEEL,this,this.mouseWheelListener);
            stage3D.addEventListener(MouseEvent.MOUSE_MULTI_MOVE,this,this.mouseMultiMoveListener);
            stage3D.addEventListener(MouseEvent.MOUSE_MULTI_UP,this,this.mouseMultiUpListener);
        }
    }
    
    private mouseWheelListener(evt:any):void
    {
        this.m_fowardDis = (evt.wheelDeltaY * this.m_mouseWheelZoomSpd);
    }
    private mouseMultiMoveListener(evt:any):void
    {
        this.setTouchPosArray(evt.posArray);
    }
    private mouseMultiUpListener(evt:any):void
    {
        this.setTouchPosArray(evt.posArray);
    }
    private setTouchPosArray(posArray:any[]):void
    {
        if(posArray != null && posArray.length > 1)
        {
            let dis:number = 0;
            this.m_va.setXYZ(posArray[0].x, posArray[0].y,0);
            this.m_vb.setXYZ(posArray[1].x, posArray[1].y,0);
            if(this.m_touchZoomBoo)
            {
                dis = Vector3D.Distance(this.m_va,this.m_vb);
                if(Math.abs(this.m_preDis - dis) > 0.1)
                {
                    this.m_fowardDis = (dis - this.m_preDis) * this.m_touchZoomSpd;
                    this.m_preDis = dis;
                }
            }
            else
            {
                this.m_touchZoomBoo = true;
                this.m_preDis = Vector3D.Distance(this.m_va,this.m_vb);
            }
        }
        else
        {
            this.m_touchZoomBoo = false;
        }
    }
    run(lookAtPos:Vector3D,minDis:number):void
    {
        if(this.m_camera != null)
        {
            if(this.m_fowardDis > 0)
            {
                if(Vector3D.Distance(this.m_camera.getPosition(), this.m_camera.getLookAtPosition()) > minDis)
                {
                    this.m_camera.forward(this.m_fowardDis);
                    if(lookAtPos != null)
                    {
                        this.m_camera.setLookPosXYZFixUp(lookAtPos.x,lookAtPos.y,lookAtPos.z);
                    }
                }
                this.m_fowardDis = 0;
            }
            else if(this.m_fowardDis < -0.001)
            {
                this.m_camera.forward(this.m_fowardDis);
                if(lookAtPos != null)
                {
                    this.m_camera.setLookPosXYZFixUp(lookAtPos.x,lookAtPos.y,lookAtPos.z);
                }
                this.m_fowardDis = 0;
            }
        }
    }
}