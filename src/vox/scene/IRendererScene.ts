/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Color4 from "../../vox/material/Color4";
import IRenderProcess from "../../vox/render/IRenderProcess";
import IRenderEntity from "../../vox/render/IRenderEntity";
import IRenderEntityContainer from "../../vox/render/IRenderEntityContainer";
import { IRenderCamera } from "../render/IRenderCamera";
import IRenderStage3D from "../render/IRenderStage3D";
import { IRenderProxy } from "../../vox/render/IRenderProxy";

import { ITextureBlock } from "../../vox/texture/ITextureBlock";
// import IRendererParam from "../../vox/scene/IRendererParam";
import IVector3D from "../math/IVector3D";

import { IRenderableMaterialBlock } from "./block/IRenderableMaterialBlock";
import { IRenderableEntityBlock } from "./block/IRenderableEntityBlock";
import { IFBOInstance } from "./IFBOInstance";
import { IMatrix4 } from "../math/IMatrix4";

interface IRendererScene {

    textureBlock: ITextureBlock;
    materialBlock: IRenderableMaterialBlock;
    entityBlock: IRenderableEntityBlock;
    enable(): void;
    disable(): void;
    isEnabled(): boolean;
    getUid(): number;
    createFBOInstance(): IFBOInstance;
    createMatrix4(): IMatrix4;
    /**
     * 是否启用鼠标或者touch交互功能
     * @param gpuTestEnabled the default value is true.
     */
    enableMouseEvent(gpuTestEnabled?: boolean): void;
    getMouseXYWorldRay(rl_position: IVector3D, rl_tv: IVector3D): void;
    isRayPickSelected(): boolean;
    /**
     * @param contextBeginEnabled the default value is default
     */
    renderBegin(contextBeginEnabled?: boolean): void
    /**
     * @param autoCycle the default value is true
     * @param contextBeginEnabled the default value is true
     */
    runBegin(autoCycle?: boolean, contextBeginEnabled?: boolean): void;
    setRayTestEanbled(enabled: boolean): void;
    /**
     * @param autoCycle the default value is true
     * @param mouseEventEnabled the default value is true
     */
    update(autoCycle?: boolean, mouseEventEnabled?: boolean): void;
    run(autoCycle: boolean): void;
    runEnd(): void;
    runAt(index: number): void;
    isRayPickSelected(): boolean;
    /**
     * get the renderer process by process index
     * @param processIndex IRenderProcess instance index in renderer scene instance
     */
    getRenderProcessAt(processIndex: number): IRenderProcess;
    /**
     * add an entity to the renderer process of the renderer instance
     * @param entity IRenderEntity instance(for example: DisplayEntity class instance)
     * @param processid this destination renderer process id, the default value is 0
     * @param deferred if the value is true,the entity will not to be immediately add to the renderer process by its id.the default value is true
     */
    addEntity(entity: IRenderEntity, processid?: number, deferred?: boolean): void;
    /**
     * remove an entity from the renderer instance
     * @param entity IRenderEntity instance(for example: DisplayEntity class instance)
     */
    removeEntity(entity: IRenderEntity): void;
    /**
     * add an entity container from the renderer process of the renderer instance
     * @param container a IRenderEntityContainer instance
     * @param processid this destination renderer process id, the default value is 0
     */
    addContainer(container: IRenderEntityContainer, processid?: number): void;
    /**
     * remove an entity container from the renderer instance
     * @param entity IRenderEntity instance(for example: DisplayEntity class instance)
     */
    removeContainer(child: IRenderEntityContainer): void;

    /**
     * @param type event type
     * @param target event listerner
     * @param func event listerner callback function
     * @param captureEnabled the default value is true
     * @param bubbleEnabled the default value is false
     */
    addEventListener(type: number, target: any, func: (evt: any) => void, captureEnabled?: boolean, bubbleEnabled?: boolean): void;
    /**
     * @param type event type
     * @param target event listerner
     * @param func event listerner callback function
     */
    removeEventListener(type: number, target: any, func: (evt: any) => void): void;
    /**
     * 单独绘制可渲染对象, 可能是使用了 global material也可能没有。这种方式比较耗性能,只能用在特殊的地方。
     * @param entity 需要指定绘制的 IRenderEntity 实例
     * @param useGlobalUniform 是否使用当前 global material 所携带的 uniform, the default value is false
     * @param forceUpdateUniform 是否强制更新当前 global material 所对应的 shader program 的 uniform, the default value is true
     */
    drawEntity(entity: IRenderEntity, useGlobalUniform: boolean, forceUpdateUniform?: boolean): void;
    /**
     * @param colorUint24 uint24 number rgb color value, example: 0xff0000, it is red rolor
     * @param alpha the default value is 1.0
     */
    setClearUint24Color(colorUint24: number, alpha?: number): void;
    setClearRGBColor3f(pr: number, pg: number, pb: number): void;
    setClearRGBAColor4f(pr: number, pg: number, pb: number, pa: number): void;
    setClearColor(color: Color4): void;
    setRenderToBackBuffer(): void;
    updateCamera(): void;
    createCamera(): IRenderCamera;
    getCamera(): IRenderCamera;
    getStage3D(): IRenderStage3D;
    getRenderProxy(): IRenderProxy;

    getViewWidth(): number;
    getViewHeight(): number;
    /**
     * 获取渲染器可渲染对象管理器状态(版本号)
     */
    getRendererStatus(): number;
	/**
     * run all renderer processes in the renderer instance
     */
	 run(autoCycle?: boolean): void;
}
export default IRendererScene;
