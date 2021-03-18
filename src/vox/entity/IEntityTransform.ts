/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as Vector3T from "../../vox/math/Vector3D";

import Vector3D = Vector3T.vox.math.Vector3D;

export namespace vox
{
    export namespace entity
    {
        export interface IEntityTransform
        {
            setXYZ(px:number,py:number,pz:number):void;
            setPosition(pv:Vector3D):void;
            getPosition(pv:Vector3D):void;
            setRotationXYZ(rx:number,ry:number,rz:number):void;
            setScaleXYZ(sx:number,sy:number,sz:number):void;
            update():void;
        }
    }
}