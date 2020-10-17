/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// 整个渲染器的空间管理类接口规范

import * as Vector3DT from "../../vox/geom/Vector3";
import * as Stage3DT from "../../vox/display/Stage3D";
import * as CameraBaseT from "../../vox/view/CameraBase";
import * as DisplayEntityT from "../../vox/entity/DisplayEntity";
import * as Entity3DNodeT from "../../vox/scene/Entity3DNode";
import * as ISpaceCullingorT from '../../vox/scene/ISpaceCullingor';
import * as IRaySelectorT from '../../vox/scene/IRaySelector';

import Vector3D = Vector3DT.vox.geom.Vector3D;
import Stage3D = Stage3DT.vox.display.Stage3D;
import CameraBase = CameraBaseT.vox.view.CameraBase;
import DisplayEntity = DisplayEntityT.vox.entity.DisplayEntity;
import Entity3DNode = Entity3DNodeT.vox.scene.Entity3DNode;
import ISpaceCullingor = ISpaceCullingorT.vox.scene.ISpaceCullingor;
import IRaySelector = IRaySelectorT.vox.scene.IRaySelector;

export namespace vox
{
    export namespace scene
    {
        export interface IRendererSpace
        {
            // 可以添加真正被渲染的实体也可以添加只是为了做检测的实体(不允许有material)
            getStage3D():Stage3D;
            getCamera():CameraBase;
            addEntity(entity:DisplayEntity):void;
            removeEntity(entity:DisplayEntity):void;
            setSpaceCullingor(cullingor:ISpaceCullingor):void;
            setRaySelector(raySelector:IRaySelector):void;
            getRaySelector():IRaySelector;
            runBegin():void;
            rayTest(rltv:Vector3D, rlpv:Vector3D):void;
            runEnd():void;
            getCullingNodeBegin():Entity3DNode;
        }
    }
}