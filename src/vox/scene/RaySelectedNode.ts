/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// 整个渲染器的空间管理类接口规范

import * as MathConstT from "../../vox/utils/MathConst";
import * as Vector3DT from "../../vox/geom/Vector3";
import * as AABBT from "../../vox/geom/AABB";
import * as CameraBaseT from "../../vox/view/CameraBase";
import * as DisplayEntityT from "../../vox/entity/DisplayEntity";
import * as Entity3DNodeT from "../../vox/scene/Entity3DNode";
import * as IRaySelectorT from '../../vox/scene/IRaySelector';

import MathConst = MathConstT.vox.utils.MathConst;
import Vector3D = Vector3DT.vox.geom.Vector3D;
import AABB = AABBT.vox.geom.AABB;
import CameraBase = CameraBaseT.vox.view.CameraBase;
import DisplayEntity = DisplayEntityT.vox.entity.DisplayEntity;
import Entity3DNode = Entity3DNodeT.vox.scene.Entity3DNode;
import IRaySelector = IRaySelectorT.vox.scene.IRaySelector;

export namespace vox
{
    export namespace scene
    {
        export class RaySelectedNode
        {
            constructor(){}
            entity:DisplayEntity = null;
            // object space hit position
            lpv:Vector3D = new Vector3D();
            // world space hit position
            wpv:Vector3D = new Vector3D();
            dis:number = 0.0;
        }
    }
}