/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Vector3D from "../../../vox/math/Vector3D";
import DisplayEntityContainer from "../../../vox/entity/DisplayEntityContainer";
import IPoseture from "../../../app/robot/poseture/IPoseture";

//import Vector3D = Vector3T.vox.math.Vector3D;
//import DisplayEntityContainer = DisplayEntityContainerT.vox.entity.DisplayEntityContainer;
//import IPoseture = IPosetureT.app.robot.poseture.IPoseture;

export namespace app
{
    export namespace robot
    {
        // leg
        export class RbtModule implements IPoseture
        {
            protected m_container:DisplayEntityContainer = new DisplayEntityContainer();
            constructor()
            {

            }
            getContainer():DisplayEntityContainer
            {
                return this.m_container;
            }
            setVisible(boo:boolean):void
            {

            }
            getVisible():boolean
            {
                return this.m_container.getVisible();
            }
            setRotationY(rotation:number):void
            {
                this.m_container.setRotationY(rotation);
            }
            getRotationY():number
            {
                return this.m_container.getRotationY();
            }
            runByPos(pos:Vector3D,finished:boolean):void
            {
            }
            runByDegree(degree:number,finished:boolean):void
            {
            }
            isPoseRunning():boolean
            {
                //return this.postureCtrl.isRunning();
                return true;
            }
            setXYZ(px:number,py:number,pz:number):void
            {
                this.m_container.setXYZ(px,py,pz);
            }
            setPosition(position:Vector3D):void
            {
                this.m_container.setPosition(position);
            }
            getPosition(position:Vector3D):void
            {
                this.m_container.getPosition(position);
            }
            resetPose():void
            {
            }
            resetNextOriginPose():void
            {
            }
            run():void
            {
            }
            isResetFinish():boolean
            {
                return true;
            }
            runToReset():void
            {
                
            }
        }
    }
}