/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// 整个渲染器的空间管理类接口规范

import * as CameraBaseT from "../../vox/view/CameraBase";
import * as Entity3DNodeT from "../../vox/scene/Entity3DNode";
import * as ISpacePOCT from "../../vox/scene/occlusion/ISpacePOV";

import CameraBase = CameraBaseT.vox.view.CameraBase;
import Entity3DNode = Entity3DNodeT.vox.scene.Entity3DNode;
import ISpacePOV = ISpacePOCT.vox.scene.occlusion.ISpacePOV;

export namespace vox
{
    export namespace scene
    {
        export interface ISpaceCullingor
        {
            addPOVObject(poc:ISpacePOV):void;
            setCamera(cam:CameraBase):void;
            setCullingNodeHead(headNode:Entity3DNode):void;
            run():void;        
        }
    }
}