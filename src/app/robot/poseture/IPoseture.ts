/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Vector3D from "../../../vox/math/Vector3D";
import DisplayEntityContainer from "../../../vox/entity/DisplayEntityContainer";

export default interface IPoseture
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