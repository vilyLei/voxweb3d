/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// 射线拾取器接口规范

import Vector3D from "../../vox/math/Vector3D";
import { IRenderCamera } from "../../vox/render/IRenderCamera";
import Entity3DNode from "../../vox/scene/Entity3DNode";
import RaySelectedNode from "../../vox/scene/RaySelectedNode";
import IRenderer from "../../vox/scene/IRenderer";
import IRenderingEntitySet from "./IRenderingEntitySet";


export default interface IRaySelector {
    etset: IRenderingEntitySet;
    // 是不是使用GPU做拾取检测, 但是即使使用gpu也要注意有些逻辑的或者非多面体的是不能通过gpu来拾取的,所以要结合使用
    setRenderer(renderer: IRenderer): void;
    // 不同的模式对应不同的射线(GPU)检测流程
    setRayTestMode(testMode: number): void;
    setRay(rlpv: Vector3D, rltv: Vector3D): void;
    getRay(out_rlpv: Vector3D, out_rltv: Vector3D): void;
    setCamera(cam: IRenderCamera): void;
    getSelectedNode(): RaySelectedNode;
    getSelectedNodes(): RaySelectedNode[];
    getSelectedNodesTotal(): number;
    run(): void;
    clear(): void;
}