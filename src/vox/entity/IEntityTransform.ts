/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Vector3D from "../../vox/math/Vector3D";

interface IEntityTransform
{
    setXYZ(px:number,py:number,pz:number):void;
    setPosition(pv:Vector3D):void;
    getPosition(pv:Vector3D):void;
    setRotationXYZ(rx:number,ry:number,rz:number):void;
    setScaleXYZ(sx:number,sy:number,sz:number):void;
    getRotationXYZ(pv:Vector3D):void;
    getScaleXYZ(pv:Vector3D):void;
    localToGlobal(pv: Vector3D): void;
    globalToLocal(pv: Vector3D): void;
    update():void;
}

export default IEntityTransform;