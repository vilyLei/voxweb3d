/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as Vector3DT from "../../vox/math/Vector3D";

import Vector3D = Vector3DT.vox.math.Vector3D;

export namespace particle
{
    export namespace effect
    {
        export interface IParticleEffect
        {
            setTime(time:number):void;
            updateTime(offsetTime:number):void;
            setXYZ(px:number, py:number, pz:number):void;
            setRotationXYZ(rx:number, ry:number, rz:number):void;
            setPositionScale(scale:number):void;
            setSizeScale(scale:number):void;
            setPosition(position:Vector3D):void;
            setVisible(visible:boolean):void;
            update():void;
            isAwake():boolean;
        }
    }
}