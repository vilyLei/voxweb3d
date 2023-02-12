/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// 整个渲染器的空间管理类接口规范

import IVector3D from "../../vox/math/IVector3D";
import IRenderStage3D from "../../vox/render/IRenderStage3D";
import { IRenderCamera } from "../../vox/render/IRenderCamera";
import IRenderEntity from "../../vox/render/IRenderEntity";
import ISpaceCullingor from "../../vox/scene/ISpaceCullingor";
import IRaySelector from "../../vox/scene/IRaySelector";
import IRenderingEntitySet from "../../vox/scene/IRenderingEntitySet";
import IEntity3DNode from "./IEntity3DNode";

export default interface IRendererSpace {
    
    /**
     * 正在被渲染的可渲染实体的集合
     */
    readonly renderingEntitySet: IRenderingEntitySet;

    // 可以添加真正被渲染的实体也可以添加只是为了做几何/空间检测的实体(不允许有material)
    getStage3D(): IRenderStage3D;
    setCamera(camera: IRenderCamera): void;
    getCamera(): IRenderCamera;
    addEntity(entity: IRenderEntity): void;
    removeEntity(entity: IRenderEntity): void;
    updateEntity(entity: IRenderEntity): void;
    setSpaceCullingor(cullingor: ISpaceCullingor): void;
    setRaySelector(raySelector: IRaySelector): void;
    getPOVNumber(): number;
    getRaySelector(): IRaySelector;
    rayTest(rltv: IVector3D, rlpv: IVector3D): void;
    runBegin(): void;
    run(): void;
    runEnd(): void;
    update(): void;
    getCullingNodeHead(): IEntity3DNode;
}