/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// 整个渲染器的空间管理类接口规范

import Vector3D from "../../vox/math/Vector3D";
import IRenderStage3D from "../../vox/render/IRenderStage3D";
import {IRenderCamera} from "../../vox/render/IRenderCamera";
import IRenderEntity from "../../vox/render/IRenderEntity";
import Entity3DNode from "../../vox/scene/Entity3DNode";
import ISpaceCullingor from "../../vox/scene/ISpaceCullingor";
import IRaySelector from "../../vox/scene/IRaySelector";


export default interface IRendererSpace
{
    // 可以添加真正被渲染的实体也可以添加只是为了做几何/空间检测的实体(不允许有material)
    getStage3D():IRenderStage3D;
    setCamera(camera:IRenderCamera):void;
    getCamera():IRenderCamera;
    addEntity(entity:IRenderEntity):void;
    removeEntity(entity:IRenderEntity):void;
    updateEntity(entity:IRenderEntity):void;
    setSpaceCullingor(cullingor:ISpaceCullingor):void;
    setRaySelector(raySelector:IRaySelector):void;
    getRaySelector():IRaySelector;
    rayTest(rltv:Vector3D, rlpv:Vector3D):void;
    runBegin():void;
    run():void;
    runEnd():void;
    update():void;
    getCullingNodeHead():Entity3DNode;
}