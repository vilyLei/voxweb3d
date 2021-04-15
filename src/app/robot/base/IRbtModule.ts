/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as Vector3T from "../../../vox/math/Vector3D";
import * as DisplayEntityT from "../../../vox/entity/DisplayEntity";
import * as DisplayEntityContainerT from "../../../vox/entity/DisplayEntityContainer";
import * as RendererSceneT from "../../../vox/scene/RendererScene";
import * as CoreFrameAxisT from "../../../app/robot/CoreFrameAxis";
import * as IPartStoreT from "../../../app/robot/IPartStore";
import * as IPosetureT from "../../../app/robot/poseture/IPoseture";
import * as TwoLegPostureCtrlT from "../../../app/robot/poseture/TwoLegPostureCtrl";

import Vector3D = Vector3T.vox.math.Vector3D;
import DisplayEntity = DisplayEntityT.vox.entity.DisplayEntity;
import DisplayEntityContainer = DisplayEntityContainerT.vox.entity.DisplayEntityContainer;
import RendererScene = RendererSceneT.vox.scene.RendererScene;
import CoreFrameAxis = CoreFrameAxisT.app.robot.CoreFrameAxis;
import IPartStore = IPartStoreT.app.robot.IPartStore;
import IPoseture = IPosetureT.app.robot.poseture.IPoseture;
import TwoLegPostureCtrl = TwoLegPostureCtrlT.app.robot.poseture.TwoLegPostureCtrl;

export namespace app
{
    export namespace robot
    {
        export namespace base
        {
            // 一个 robot 由多个 RbtModule 组合而成
            export interface IRbtModule
            {
                getContainer():DisplayEntityContainer;
                setVisible(boo:boolean):void;
                getVisible():boolean;
                setRotationY(rotation:number):void;
                getRotationY():number;
                runByPos(pos:Vector3D,finished:boolean):void;
                runByDegree(degree:number,finished:boolean):void;
                isPoseRunning():boolean;
                setXYZ(px:number,py:number,pz:number):void;
                setPosition(position:Vector3D):void;
                getPosition(position:Vector3D):void;
                resetPose():void;
                resetNextOriginPose():void;
                run():void;
                isResetFinish():boolean;
                runToReset():void;
            }
        }
    }
}