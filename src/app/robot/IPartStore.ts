/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as Vector3T from "../../vox/math/Vector3D";
import * as DisplayEntityT from "../../vox/entity/DisplayEntity";

import Vector3D = Vector3T.vox.math.Vector3D;
import DisplayEntity = DisplayEntityT.vox.entity.DisplayEntity;

export namespace app
{
    export namespace robot
    {
        export interface IPartStore
        {
            getCoreWidth():number;
            getBGLong():number;
            getSGLong():number;
            getCoreCenter():Vector3D;
            getEngityCore():DisplayEntity;
            getEngityBGL():DisplayEntity;
            getEngityBGR():DisplayEntity;
            getEngitySGL():DisplayEntity;
            getEngitySGR():DisplayEntity;
        }
    }
}