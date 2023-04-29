/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// 整个渲染器的空间管理类接口规范

import { IRenderCamera } from "../../vox/render/IRenderCamera";
import IEntity3DNode from "../../vox/scene/IEntity3DNode";
import ISpacePOV from "../../vox/scene/occlusion/ISpacePOV";


export default interface ISpaceCullingor {
    /**
     * 可以被渲染的entity数量
     */
    total: number;
    addPOVObject(pov: ISpacePOV): void;
    setCamera(cam: IRenderCamera): void;
    setCullingNodeHead(headNode: IEntity3DNode): void;
    getPOVNumber(): number;
    run(): void;
}