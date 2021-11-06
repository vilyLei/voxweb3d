/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Color4 from "../../vox/material/Color4";
import IRenderEntity from "../../vox/render/IRenderEntity";
import DisplayEntityContainer from "../../vox/entity/DisplayEntityContainer";
import {IRenderCamera} from "../render/IRenderCamera";
import IRenderStage3D from "../render/IRenderStage3D";
import Vector3D from "../math/Vector3D";
interface IRendererScene {
    
    enable(): void;
    disable(): void;
    isEnabled(): boolean;
    getUid(): number;
    /**
     * 是否启用鼠标或者touch交互功能
     * @param gpuTestEnabled the default value is true.
     */
    enableMouseEvent(gpuTestEnabled: boolean): void;
    getMouseXYWorldRay(rl_position: Vector3D, rl_tv: Vector3D): void;
    isRayPickSelected(): boolean;
    /**
     * @param contextBeginEnabled the default value is default
     */
    renderBegin(contextBeginEnabled: boolean): void
    /**
     * @param autoCycle the default value is true
     * @param contextBeginEnabled the default value is true
     */
    runBegin(autoCycle: boolean, contextBeginEnabled: boolean): void;
    setRayTestEanbled(enabled: boolean): void;
    update(autoCycle: boolean, mouseEventEnabled: boolean): void;
    run(autoCycle: boolean): void;
    runEnd(): void;
    runAt(index: number): void;
    isRayPickSelected(): boolean;
    /**
     * add an entity to the renderer process of the renderer instance
     * @param entity IRenderEntity instance(for example: DisplayEntity class instance)
     * @param processid this destination renderer process id
     * @param deferred if the value is true,the entity will not to be immediately add to the renderer process by its id
     */
    addEntity(entity: IRenderEntity, processid: number, deferred: boolean): void;
    /**
     * remove an entity from the renderer instance
     * @param entity IRenderEntity instance(for example: DisplayEntity class instance)
     */
    removeEntity(entity: IRenderEntity): void;
    /**
     * add an entity container from the renderer process of the renderer instance
     * @param container a DisplayEntityContainer instance
     * @param processid this destination renderer process id
     */
    addContainer(container: DisplayEntityContainer, processid: number): void;
    /**
     * remove an entity container from the renderer instance
     * @param entity IRenderEntity instance(for example: DisplayEntity class instance)
     */
    removeContainer(child: DisplayEntityContainer): void;

    /**
     * @param type event type
     * @param target event listerner
     * @param func event listerner callback function
     * @param captureEnabled the default value is true
     * @param bubbleEnabled the default value is false
     */
    addEventListener(type: number, target: any, func: (evt: any) => void, captureEnabled: boolean, bubbleEnabled: boolean): void;
    /**
     * @param type event type
     * @param target event listerner
     * @param func event listerner callback function
     */
    removeEventListener(type: number, target: any, func: (evt: any) => void): void;
    /**
     * 单独绘制可渲染对象, 可能是使用了 global material也可能没有。这种方式比较耗性能,只能用在特殊的地方。
     * @param entity 需要指定绘制的 IRenderEntity 实例
     * @param useGlobalUniform 是否使用当前 global material 所携带的 uniform, default value: false
     * @param forceUpdateUniform 是否强制更新当前 global material 所对应的 shader program 的 uniform, default value: true
     */
    drawEntity(entity: IRenderEntity, useGlobalUniform: boolean,  forceUpdateUniform: boolean): void;
    
    setClearUint24Color(colorUint24: number, alpha: number): void;
    setClearRGBColor3f(pr: number, pg: number, pb: number): void;
    setClearRGBAColor4f(pr: number, pg: number, pb: number, pa: number): void;
    setClearColor(color: Color4): void;
    setRenderToBackBuffer(): void;
    updateCamera(): void;
    getCamera(): IRenderCamera;
    getStage3D(): IRenderStage3D;
    /**
     * 获取渲染器可渲染对象管理器状态(版本号)
     */
    getRendererStatus(): number;
}
export default IRendererScene;
