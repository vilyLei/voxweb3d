/***************************************************************************/
/*                                                                         */
/*  Copyright 2019-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// 真正被高频运行的渲染管线中的被操作对象的行为规范

import * as Vector3DT from "../../vox/math/Vector3D";
import * as AABBT from "../../vox/geom/AABB";

import Vector3D = Vector3DT.vox.math.Vector3D;
import AABB = AABBT.vox.geom.AABB;

export namespace vox
{
    export namespace render
    {
        export interface IRPODisplay
        {
            value:number;
            pos:Vector3D;
            bounds:AABB;
            setDrawFlag(renderState:number,rcolorMask:number):void;
            setIvsParam(ivsIndex:number, ivsCount:number):void;
            setVisible(boo:boolean):void;
            /**
             * get RPONode instance unique id
             */
            getRPOUid():number;
            /**
             * get RenderProcess instance unique id
             */
            getRPROUid():number;
            /**
             * get Renderer shader instance unique id
             */
            getShaderUid():number;
        }
    }
}