/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as MathConstT from "../../../vox/math/MathConst";
import * as Vector3T from "../../../vox/math/Vector3D";
import * as DisplayEntityContainerT from "../../../vox/entity/DisplayEntityContainer";

import MathConst = MathConstT.vox.math.MathConst;
import Vector3D = Vector3T.vox.math.Vector3D;
import DisplayEntityContainer = DisplayEntityContainerT.vox.entity.DisplayEntityContainer;

export namespace app
{
    export namespace robot
    {
        export namespace poseture
        {
            export interface IPoseture
            {
                getContainer():DisplayEntityContainer;
                setXYZ(px:number,py:number,pz:number):void;
                setPosition(position:Vector3D):void;
                getPosition(position:Vector3D):void;
                resetPose():void;
                resetNextOriginPose():void;
                run(moveEnabled:boolean):void;
                isResetFinish():boolean;
                runToReset():void;
            }
        }
    }
}