/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// Project Occlusion Volume

import Vector3D from "../../../vox/math/Vector3D";
import AABB from "../../../vox/geom/AABB";
import CameraBase from "../../../vox/view/CameraBase";

export default interface ISpacePOV
{
    status:number;
    enabled:boolean;
    updateOccData():void;
    getOccRadius():number;
    getOccCenter():Vector3D;
    addSubPov(pov:ISpacePOV):void
    cameraTest(camera:CameraBase):void;
    begin():void;
    test(bounds:AABB,cullMask:number):void;
}