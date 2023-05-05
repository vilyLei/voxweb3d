/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Vector3D from "../../vox/math/Vector3D";
import DisplayEntity from "../../vox/entity/DisplayEntity";
import Color4 from "../../vox/material/Color4";

export default interface IPartStore
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
    setBrightness(brn: number, color: Color4): void;
}