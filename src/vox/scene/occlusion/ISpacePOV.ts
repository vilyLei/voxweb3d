/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// Project Occlusion Volume

import * as Vector3DT from "../../../vox/geom/Vector3";
import * as AABBT from "../../../vox/geom/AABB";
import * as CameraBaseT from "../../../vox/view/CameraBase";

import Vector3D = Vector3DT.vox.geom.Vector3D;
import AABB = AABBT.vox.geom.AABB;
import CameraBase = CameraBaseT.vox.view.CameraBase;

export namespace vox
{
    export namespace scene
    {
        export namespace occlusion
        {
            export interface ISpacePOV
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
        }
    }
}