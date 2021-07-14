/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// 射线拾取器接口规范

import Vector3D from "../../vox/math/Vector3D";
import CameraBase from "../../vox/view/CameraBase";
import Entity3DNode from "../../vox/scene/Entity3DNode";
import RaySelectedNode from "../../vox/scene/RaySelectedNode";
import IRenderer from "../../vox/scene/IRenderer";


export default interface IRaySelector
{
    // 是不是使用GPU做拾取检测, 但是即使使用gpu也要注意有些逻辑的或者非多面体的是不能通过gpu来拾取的,所以要结合使用
    //setGPUTestEnabled(enabled:boolean):void;
    setRenderer(renderer:IRenderer):void;
    // 不同的模式对应不同的射线(GPU)检测流程
    setRayTestMode(testMode:number):void;
    setRay(rlpv:Vector3D, rltv:Vector3D):void;
    getRay(out_rlpv:Vector3D, out_rltv:Vector3D):void;
    setCamera(cam:CameraBase):void;
    setCullingNodeHead(headNode:Entity3DNode):void;
    //setSelectedNode(node:RaySelectedNode):void;
    getSelectedNode():RaySelectedNode;
    //setSelectedNodes(nodes:RaySelectedNode[], total:number):void;
    getSelectedNodes():RaySelectedNode[];
    getSelectedNodesTotal():number;
    run():void;
    clear(): void;
}