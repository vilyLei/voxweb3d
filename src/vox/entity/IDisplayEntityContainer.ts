/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as Vector3T from "../../vox/math/Vector3D";
import * as AABBT from "../../vox/geom/AABB";

import Vector3D = Vector3T.vox.math.Vector3D;
import AABB = AABBT.vox.geom.AABB;

export namespace vox
{
    export namespace entity
    {
        export interface IDisplayEntityContainer
        {
            //getParent():DisplayEntityContainer
            
            getGlobalBounds():AABB;         
            getChildrenTotal():number;
            getEntitysTotal():number;
            getVisible():boolean;

            getUid():number;
            setXYZ(px:number,py:number,pz:number):void;
            setPosition(pv:Vector3D):void;
            getPosition(pv:Vector3D):void;
            setRotationXYZ(rx:number,ry:number,rz:number):void;
            setScaleXYZ(sx:number,sy:number,sz:number):void;
            
            localToGlobal(pv:Vector3D):void;
            globalToLocal(pv:Vector3D):void;
            sphereIntersect(centerV:Vector3D,radius:number):boolean;
        }
    }
}