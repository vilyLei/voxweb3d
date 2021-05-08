/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Vector3D from "../../vox/math/Vector3D";
import DisplayEntity from "../../vox/entity/DisplayEntity";

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
}