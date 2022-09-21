
/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import { ITextureBlock } from "../../vox/texture/ITextureBlock";
import { IRenderableMaterialBlock } from "../scene/block/IRenderableMaterialBlock";
import { IRenderableEntityBlock } from "../scene/block/IRenderableEntityBlock";
import RendererScene from "../scene/RendererScene";
import RendererSubScene from "../scene/RendererSubScene";
import EventBase from "../event/EventBase";
import RendererParam from "../scene/RendererParam";
import CanvasTextureTool from "../../orthoui/assets/CanvasTextureTool";
import Color4 from "../material/Color4";
import IRenderEntity from "../../vox/render/IRenderEntity";
import IRenderEntityContainer from "../../vox/render/IRenderEntityContainer";
import { IFBOInstance } from "../../vox/scene/IFBOInstance";
import IRendererScene from "../../vox/scene/IRendererScene";
import IRendererSpace from "../../vox/scene/IRendererSpace";
import { IRenderCamera } from "../render/IRenderCamera";
import IRenderProcess from "../render/IRenderProcess";
import IRenderStage3D from "../render/IRenderStage3D";
import Vector3D from "../math/Vector3D";
import IRenderProxy from "../render/IRenderProxy";
import IMatrix4 from "../math/IMatrix4";
import IVector3D from "../math/IVector3D";
import { IRendererSceneAccessor } from "../scene/IRendererSceneAccessor";


class OrthoUIScene implements IRendererScene {

    private m_rscene: RendererScene = null;
    private m_ruisc: RendererSubScene = null;

    readonly textureBlock: ITextureBlock;

    entityBlock: IRenderableEntityBlock = null;
    materialBlock: IRenderableMaterialBlock = null;

    constructor() { }
    
    getSpace(): IRendererSpace {
        return null;
    }
    setAccessor(accessor: IRendererSceneAccessor): void {
        if (this.m_ruisc != null) {
            this.m_ruisc.setAccessor(accessor);
        }
    }
    initialize(rscene: RendererScene): void {
        if (rscene != null) {
            this.m_rscene = rscene;
            this.m_rscene.addEventListener(EventBase.RESIZE, this, this.resize);
            this.initUIScene();
        }
    }
    enable(): void {
        this.m_ruisc.enable();
    }
    disable(): void {
        this.m_ruisc.disable();
    }
    isEnabled(): boolean {
        return this.m_ruisc.isEnabled();
    }
    private initUIScene(): void {

        let rparam: RendererParam = new RendererParam();
        rparam.cameraPerspectiveEnabled = false;
        rparam.setCamProject(45.0, 0.1, 3000.0);
        rparam.setCamPosition(0.0, 0.0, 1500.0);

        let subScene: RendererSubScene = null;
        subScene = this.m_rscene.createSubScene();
        subScene.initialize(rparam);
        subScene.enableMouseEvent(true);
        this.m_ruisc = subScene;
        let stage = this.m_rscene.getStage3D();
        this.m_ruisc.getCamera().translationXYZ(stage.stageHalfWidth, stage.stageHalfHeight, 1500.0);
        this.m_ruisc.getCamera().update();
        CanvasTextureTool.GetInstance().initialize(this.m_rscene);
        CanvasTextureTool.GetInstance().initializeAtlas(1024, 1024, new Color4(1.0, 1.0, 1.0, 0.0), true);

    }
    getRendererScene(): RendererSubScene {
        return this.m_ruisc;
    }

    /**
     * 获取渲染器可渲染对象管理器状态(版本号)
     */
    getRendererStatus(): number {
        return this.m_ruisc.getRendererStatus();
    }
    getUid(): number {
        return this.m_ruisc.getUid();
    }
    /**
     * 是否启用鼠标或者touch交互功能
     * @param gpuTestEnabled the default value is true.
     */
    enableMouseEvent(gpuTestEnabled: boolean = true): void {
        this.m_ruisc.enableMouseEvent(gpuTestEnabled);
    }
    getMouseXYWorldRay(rl_position: Vector3D, rl_tv: Vector3D): void {
        this.m_ruisc.getMouseXYWorldRay(rl_position, rl_tv);
    }
    renderBegin(contextBeginEnabled: boolean = false): void {
        this.m_ruisc.renderBegin();
    }
    runBegin(autoCycle: boolean = true, contextBeginEnabled: boolean = false): void {
        this.m_ruisc.runBegin(autoCycle, contextBeginEnabled);
    }
    setRayTestEanbled(enabled: boolean): void {
        this.m_ruisc.setRayTestEanbled(enabled);
    }
    update(autoCycle: boolean = true, mouseEventEnabled: boolean = true): void {
        this.m_ruisc.update(autoCycle, mouseEventEnabled);
    }
    run(autoCycle: boolean = false): void {
        this.m_ruisc.run(autoCycle);
    }
    runEnd(): void {
        this.m_ruisc.runEnd();
    }
    runAt(index: number): void {
        this.m_ruisc.runAt(index);
    }
    /**
     * add an entity to the renderer process of the renderer instance
     * @param entity IRenderEntity instance(for example: DisplayEntity class instance)
     * @param processid this destination renderer process id
     * @param deferred if the value is true,the entity will not to be immediately add to the renderer process by its id
     */
    addEntity(entity: IRenderEntity, processIndex: number = 0, deferred: boolean = true): void {
        this.m_ruisc.addEntity(entity, processIndex, deferred);
    }
    removeEntity(entity: IRenderEntity): void {
        this.m_ruisc.removeEntity(entity);
    }

    addContainer(child: IRenderEntityContainer, processIndex: number = 0): void {
        this.m_ruisc.addContainer(child, processIndex);
    }
    removeContainer(child: IRenderEntityContainer): void {
        this.m_ruisc.removeContainer(child);
    }
    /**
     * 单独绘制可渲染对象, 可能是使用了 global material也可能没有。这种方式比较耗性能,只能用在特殊的地方。
     * @param entity 需要指定绘制的 IRenderEntity 实例
     * @param useGlobalUniform 是否使用当前 global material 所携带的 uniform, default value: false
     * @param forceUpdateUniform 是否强制更新当前 global material 所对应的 shader program 的 uniform, default value: true
     */
    drawEntity(entity: IRenderEntity, useGlobalUniform: boolean = false, forceUpdateUniform: boolean = true): void {
        this.m_ruisc.drawEntity(entity, useGlobalUniform, forceUpdateUniform);
    }
    isRayPickSelected(): boolean {
        return this.m_ruisc.isRayPickSelected();
    }

    /**
     * @param type event type
     * @param target event listerner
     * @param func event listerner callback function
     * @param captureEnabled true
     * @param bubbleEnabled false
     */
    addEventListener(type: number, target: any, func: (evt: any) => void, captureEnabled: boolean, bubbleEnabled: boolean = false): void {
        this.m_ruisc.addEventListener(type, target, func, captureEnabled, bubbleEnabled);
    }
    /**
     * @param type event type
     * @param target event listerner
     * @param func event listerner callback function
     */
    removeEventListener(type: number, target: any, func: (evt: any) => void): void {
        this.m_ruisc.removeEventListener(type, target, func);
    }
    private resize(evt: any): void {

        if (this.m_ruisc != null) {
            let stage = this.m_ruisc.getStage3D();
            this.m_ruisc.getCamera().translationXYZ(stage.stageHalfWidth, stage.stageHalfHeight, 1500.0);
        }
    }

    setClearUint24Color(colorUint24: number, alpha: number = 1.0): void {
        this.m_rscene.setClearUint24Color(colorUint24, alpha);
    }
    setClearRGBColor3f(pr: number, pg: number, pb: number): void {
        this.m_rscene.setClearRGBColor3f(pr, pg, pb);
    }
    setClearRGBAColor4f(pr: number, pg: number, pb: number, pa: number): void {
        this.m_rscene.setClearRGBAColor4f(pr, pg, pb, pa);
    }
    setClearColor(color: Color4): void {
        this.m_rscene.setClearRGBAColor4f(color.r, color.g, color.b, color.a);
    }
    setRenderToBackBuffer(): void {
        this.m_rscene.setRenderToBackBuffer();
    }
    updateCamera(): void {
        this.m_rscene.updateCamera();
    }

    createCamera(): IRenderCamera {
        return null;
    }
    getCamera(): IRenderCamera {
        return this.m_rscene.getCamera();
    }
    getStage3D(): IRenderStage3D {
        return this.m_ruisc.getStage3D();
    }

    getViewWidth(): number {
        return this.m_ruisc.getViewWidth();
    }
    getViewHeight(): number {
        return this.m_ruisc.getViewHeight();
    }
    getRenderProxy(): IRenderProxy {
        return this.m_ruisc.getRenderProxy();
    }
    /**
     * get the renderer process by process index
     * @param processIndex IRenderProcess instance index in renderer scene instance
     */
    getRenderProcessAt(processIndex: number): IRenderProcess {
        return this.m_ruisc.getRenderProcessAt(processIndex);
    }

    createFBOInstance(): IFBOInstance {
        return null;
    }
    createMatrix4(): IMatrix4 {
        return this.m_rscene.createMatrix4();
    }

    createVector3D(x: number = 0.0, y: number = 0.0, z: number = 0.0, w: number = 1.0): IVector3D {
        return this.m_rscene.createVector3D(x, y, z, w);
    }
}
export { OrthoUIScene };