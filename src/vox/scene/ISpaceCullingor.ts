/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// 整个渲染器的空间管理类接口规范

import CameraBase from "../../vox/view/CameraBase";
import Entity3DNode from "../../vox/scene/Entity3DNode";
import ISpacePOV from "../../vox/scene/occlusion/ISpacePOV";


export default interface ISpaceCullingor
{
    addPOVObject(pov:ISpacePOV):void;
    setCamera(cam:CameraBase):void;
    setCullingNodeHead(headNode:Entity3DNode):void;
    run():void;        
}