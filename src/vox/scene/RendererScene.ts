/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// 整个渲染场景的入口类

import IVector3D from "../../vox/math/IVector3D";
import Vector3D from "../../vox/math/Vector3D";
import IRenderStage3D from "../../vox/render/IRenderStage3D";
import Stage3D from "../../vox/display/Stage3D";
import Color4 from "../../vox/material/Color4";
import { IRenderCamera } from "../../vox/render/IRenderCamera";
import CameraBase from "../../vox/view/CameraBase";
import { IRenderAdapter } from "../../vox/render/IRenderAdapter";
import IRenderProxy from "../../vox/render/IRenderProxy";
import IRenderMaterial from "../../vox/render/IRenderMaterial";
import IRenderEntity from "../../vox/render/IRenderEntity";
import IRenderEntityContainer from "../../vox/render/IRenderEntityContainer";
import RendererParam from "../../vox/scene/RendererParam";
import IRenderProcess from "../../vox/render/IRenderProcess";
import RenderProcess from "../../vox/render/RenderProcess";
import Entity3DNode from "../../vox/scene/Entity3DNode";
import EntityNodeQueue from "../../vox/scene/EntityNodeQueue";
import Entity3DNodeLinker from "../../vox/scene/Entity3DNodeLinker";
import IRunnableQueue from "../../vox/base/IRunnableQueue";
import RunnableQueue from "../../vox/base/RunnableQueue";

import IRPONodeBuilder from "../../vox/render/IRPONodeBuilder";
import { IRendererInstanceContext } from "../../vox/scene/IRendererInstanceContext";
import RendererInstance from "../../vox/scene/RendererInstance";
import IRendererInstance from "../../vox/scene/IRendererInstance";
import { ITextureBlock } from "../../vox/texture/ITextureBlock";
import { TextureBlock } from "../../vox/texture/TextureBlock";
import IRenderer from "../../vox/scene/IRenderer";
import IRendererSpace from "../../vox/scene/IRendererSpace";
import IRendererScene from "../../vox/scene/IRendererScene";
import RendererSpace from "../../vox/scene/RendererSpace";
import RaySelectedNode from "../../vox/scene/RaySelectedNode";
import IRaySelector from "../../vox/scene/IRaySelector";
import RaySelector from "../../vox/scene/RaySelector";
import RayGpuSelector from "../../vox/scene/RayGpuSelector";
import MouseEvt3DController from "../../vox/scene/MouseEvt3DController";
import IEvt3DController from "../../vox/scene/IEvt3DController";
import FBOInstance from "../../vox/scene/FBOInstance";
import IRODisplaySorter from "../../vox/render/IRODisplaySorter";
import CameraDsistanceSorter from "../../vox/scene/CameraDsistanceSorter";
import RendererSubScene from "../../vox/scene/RendererSubScene";
import IRenderNode from "../../vox/scene/IRenderNode";
import IRenderShader from "../../vox/render/IRenderShader";
import Matrix4Pool from "../math/Matrix4Pool";
import { IRendererSceneAccessor } from "./IRendererSceneAccessor";
import { ShaderProgramBuilder } from "../../vox/material/ShaderProgramBuilder";

import { IRenderableMaterialBlock } from "./block/IRenderableMaterialBlock";
import { IRenderableEntityBlock } from "./block/IRenderableEntityBlock";
import IMatrix4 from "../math/IMatrix4";
import Matrix4 from "../math/Matrix4";
import RendererSceneBase from "./RendererSceneBase";

export default class RendererScene extends RendererSceneBase implements IRenderer, IRendererScene, IRenderNode {
    
    private m_tickId: any = -1;
    constructor(){super();}
    
    protected createRendererIns(): IRendererInstance {
        return new RendererInstance();
    }
    protected initThis(): void {
        this.tickUpdate();
    }
    private tickUpdate(): void {
        if (this.m_tickId > -1) {
            clearTimeout(this.m_tickId);
        }
        this.m_tickId = setTimeout(this.tickUpdate.bind(this), this.m_rparam.getTickUpdateTime());
        this.textureBlock.run();
    }
    createSubScene(): RendererSubScene {
        if (this.m_renderer != null) {
            let subsc = new RendererSubScene(this, this.m_renderer, this.m_evtFlowEnabled);
            // this.m_subscList.push(subsc);
            this.m_subscListLen++;

            let sc: any = subsc;
            sc.textureBlock = this.textureBlock;
            sc.materialBlock = this.materialBlock;
            sc.entityBlock = this.entityBlock;
            return subsc;
        }
        return null;
    }
}
/*
export default class RendererScene implements IRenderer, IRendererScene, IRenderNode {
    private ___$$$$$$$Author:string = "VilyLei(vily313@126.com)";
    private static s_uid = 0;
    private m_uid = -1;
    private m_adapter: IRenderAdapter = null;
    private m_renderProxy: IRenderProxy = null;
    private m_shader: IRenderShader = null;
    private m_rcontext: IRendererInstanceContext = null;
    private m_renderer: IRendererInstance = null;
    private m_processids = new Uint8Array(128);
    private m_processidsLen = 0;
    private m_rspace: IRendererSpace = null;
    private m_mouse_rltv = new Vector3D();
    private m_mouse_rlpv = new Vector3D();
    private m_accessor: IRendererSceneAccessor = null;
    // event flow control enable
    private m_evtFlowEnabled = false;
    private m_evt3DCtr: IEvt3DController = null;
    private m_mouseEvtEnabled = true;
    private m_viewX = 0.0;
    private m_viewY = 0.0;
    private m_viewW = 800.0
    private m_viewH = 800.0;

    private m_nodeWaitLinker: Entity3DNodeLinker = null;
    private m_nodeWaitQueue: EntityNodeQueue = null;
    private m_camDisSorter: CameraDsistanceSorter = null;
    // recorde renderer sub scenes
    private m_subscList: RendererSubScene[] = [];
    private m_subscListLen = 0;
    private m_runFlag = -1;
    private m_autoRunning = true;
    private m_processUpdate = false;
    private m_tickId: any = -1;
    private m_rparam: RendererParam = null;
    private m_enabled = true;

    readonly runnableQueue: IRunnableQueue = null;
    readonly textureBlock: ITextureBlock = null;
    readonly stage3D: Stage3D = null;

    materialBlock: IRenderableMaterialBlock = null;
    entityBlock: IRenderableEntityBlock = null;

    constructor() {
        this.m_uid = RendererScene.s_uid++;
    }
    private tickUpdate(): void {
        if (this.m_tickId > -1) {
            clearTimeout(this.m_tickId);
        }
        this.m_tickId = setTimeout(this.tickUpdate.bind(this), this.m_rparam.getTickUpdateTime());
        this.textureBlock.run();
    }
    enable(): void {
        this.m_enabled = true;
    }
    disable(): void {
        this.m_enabled = false;
    }
    isEnabled(): boolean {
        return this.m_enabled;
    }
    getUid(): number {
        return this.m_uid;
    }

    getDiv(): HTMLDivElement {
        return this.m_renderProxy.getDiv();
    }
    getCanvas(): HTMLCanvasElement {
        return this.m_renderProxy.getCanvas();
    }

    getRPONodeBuilder(): IRPONodeBuilder {
        return null;
    }
    getRenderProxy(): IRenderProxy {
        return this.m_renderProxy;
    }

    // set new view port rectangle area
    setViewPort(px: number, py: number, pw: number, ph: number): void {
        if (this.m_renderProxy != null) {
            this.m_viewX = px;
            this.m_viewY = py;
            this.m_viewW = pw;
            this.m_viewH = ph;
            this.m_renderProxy.setViewPort(px, py, pw, ph);
        }
    }
    setViewPortFromCamera(camera: IRenderCamera): void {
        if (this.m_renderProxy != null && camera != null) {
            this.m_viewX = camera.getViewX();
            this.m_viewY = camera.getViewY();
            this.m_viewW = camera.getViewWidth();
            this.m_viewH = camera.getViewHeight();
            this.m_renderProxy.setViewPort(this.m_viewX, this.m_viewY, this.m_viewW, this.m_viewH);
        }
    }
    // apply new view port rectangle area
    reseizeViewPort(): void {
        this.m_renderProxy.reseizeRCViewPort();
    }
    lockViewport(): void {
        this.m_adapter.lockViewport();
    }
    unlockViewport(): void {
        this.m_adapter.unlockViewport();
    }
    getRendererAdapter(): IRenderAdapter {
        return this.m_adapter;
    }
    getRenderer(): IRendererInstance {
        return this.m_renderer;
    }
    getRendererContext(): IRendererInstanceContext {
        return this.m_rcontext;
    }
    getStage3D(): IRenderStage3D {
        return this.m_renderProxy.getStage3D();
    }
    getRendererStatus(): number {
        return this.m_renderer.getRendererStatus();
    }
    getViewWidth(): number {
        return this.m_renderProxy.getStage3D().viewWidth;
    }
    getViewHeight(): number {
        return this.m_renderProxy.getStage3D().viewHeight;
    }
    getCamera(): CameraBase {
        return this.m_renderProxy.getCamera() as CameraBase;
    }
    asynFBOSizeWithViewport(): void {
        this.m_rcontext.asynFBOSizeWithViewport();
    }
    synFBOSizeWithViewport(): void {
        this.m_rcontext.synFBOSizeWithViewport();
    }

    cameraLock(): void {
        this.m_renderProxy.cameraLock();
    }
    cameraUnlock(): void {
        this.m_renderProxy.cameraUnlock();
    }
    getMouseXYWorldRay(rl_position: Vector3D, rl_tv: Vector3D): void {
        this.m_renderProxy.getMouseXYWorldRay(rl_position, rl_tv);
    }
    createCamera(): IRenderCamera {
        return new CameraBase();
    }
    createFBOInstance(): FBOInstance {
        return new FBOInstance(this, this.textureBlock.getRTTStrore());
    }

    createMatrix4(): IMatrix4 {
        return new Matrix4();
    }
    createVector3(x: number = 0.0, y: number = 0.0, z: number = 0.0, w: number = 1.0): IVector3D {
        return new Vector3D(x, y, z, w);
    }
    setClearUint24Color(colorUint24: number, alpha: number = 1.0): void {
        this.m_renderProxy.setClearUint24Color(colorUint24, alpha);
    }
    setClearRGBColor3f(pr: number, pg: number, pb: number): void {
        this.m_renderProxy.setClearRGBColor3f(pr, pg, pb);
    }
    setClearRGBAColor4f(pr: number, pg: number, pb: number, pa: number): void {
        this.m_renderProxy.setClearRGBAColor4f(pr, pg, pb, pa);
    }
    setClearColor(color: Color4): void {
        this.m_renderProxy.setClearRGBAColor4f(color.r, color.g, color.b, color.a);
    }
    setRenderToBackBuffer(): void {
        this.m_rcontext.setRenderToBackBuffer();
    }

    drawBackBufferToCanvas(dstCanvasCtx: CanvasRenderingContext2D, px: number, py: number, width: number, height: number): void {
        let srcCanvas = this.getCanvas();
        dstCanvasCtx.drawImage(srcCanvas, px,py, width, height);
    }
    updateRenderBufferSize(): void {
        this.m_adapter.updateRenderBufferSize();
    }
    setEvt3DController(evt3DCtr: IEvt3DController): void {
        if (evt3DCtr != null) {
            evt3DCtr.initialize(this.getStage3D(), this.getStage3D());
            evt3DCtr.setRaySelector(this.m_rspace.getRaySelector());
        }
        this.m_evt3DCtr = evt3DCtr;
    }
    isRayPickSelected(): boolean {
        return this.m_evt3DCtr != null && this.m_evt3DCtr.isSelected();
    }
    enableMouseEvent(gpuTestEnabled: boolean = true): void {
        if (this.m_evt3DCtr == null) {
            if (gpuTestEnabled) {
                this.m_rspace.setRaySelector(new RayGpuSelector());
            }
            else {
                this.m_rspace.setRaySelector(new RaySelector());
            }
            this.setEvt3DController(new MouseEvt3DController());
        }
        this.m_mouseEvtEnabled = true;
    }
    disableMouseEvent(): void {
        this.m_mouseEvtEnabled = false;
    }
    getEvt3DController(): IEvt3DController {
        return this.m_evt3DCtr;
    }
    getSpace(): IRendererSpace {
        return this.m_rspace;
    }
    getDevicePixelRatio(): number {
        return this.m_adapter.getDevicePixelRatio();
    }

    createSubScene(): RendererSubScene {
        if (this.m_renderer != null) {
            let subsc = new RendererSubScene(this, this.m_renderer, this.m_evtFlowEnabled);
            // this.m_subscList.push(subsc);
            this.m_subscListLen++;

            let sc: any = subsc;
            sc.textureBlock = this.textureBlock;
            sc.materialBlock = this.materialBlock;
            sc.entityBlock = this.entityBlock;
            return subsc;
        }
        return null;
    }
    // removeSubScene(subScene: RendererSubScene): void {
    // }
    addEventListener(type: number, target: any, func: (evt: any) => void, captureEnabled: boolean = true, bubbleEnabled: boolean = false): void {
        this.stage3D.addEventListener(type, target, func, captureEnabled, bubbleEnabled);
    }
    removeEventListener(type: number, target: any, func: (evt: any) => void): void {
        this.stage3D.removeEventListener(type, target, func);
    }
    setAccessor(accessor: IRendererSceneAccessor): void {
        this.m_accessor = accessor;
    }
    initialize(rparam: RendererParam = null, renderProcessesTotal: number = 3): void {

        if (this.m_renderer == null) {
            if (rparam == null) rparam = new RendererParam();
            this.m_rparam = rparam;

            let selfT: any = this;
            selfT.stage3D = new Stage3D(this.getUid(), document);
            selfT.runnableQueue = new RunnableQueue();
            selfT.textureBlock = new TextureBlock();

            if (renderProcessesTotal < 1) {
                renderProcessesTotal = 1;
            }
            if (renderProcessesTotal > 128) {
                renderProcessesTotal = 128;
            }
            this.m_evtFlowEnabled = rparam.evtFlowEnabled;
            let rins = new RendererInstance();

            rins.__$setStage3D(this.stage3D);
            Matrix4Pool.Allocate(rparam.getMatrix4AllocateSize());
            let camera: CameraBase = new CameraBase();

            rins.initialize(rparam, camera, new ShaderProgramBuilder(rins.getRCUid()));
            this.m_renderer = rins;

            this.m_processids[0] = 0;
            this.m_processidsLen++;
            let process: RenderProcess = null;
            for (; renderProcessesTotal >= 0;) {
                process = this.m_renderer.appendProcess(rparam.batchEnabled, rparam.processFixedState) as RenderProcess;
                this.m_processids[this.m_processidsLen] = process.getRPIndex();
                this.m_processidsLen++;
                --renderProcessesTotal;
            }
            this.m_rcontext = this.m_renderer.getRendererContext();
            this.m_renderProxy = this.m_rcontext.getRenderProxy();
            this.m_adapter = this.m_renderProxy.getRenderAdapter();
    
            let stage3D = this.m_renderProxy.getStage3D();
            this.m_viewW = stage3D.stageWidth;
            this.m_viewH = stage3D.stageHeight;
            this.m_shader = this.m_renderer.getDataBuilder().getRenderShader();
            this.textureBlock.setRenderer(this.m_renderProxy);
            this.m_camDisSorter = new CameraDsistanceSorter(this.m_renderProxy);
            if (this.m_rspace == null) {
                let space: RendererSpace = new RendererSpace();
                space.initialize(this.m_renderer, this.m_renderProxy.getCamera());
                this.m_rspace = space;
            }
            this.tickUpdate();
        }
    }
    setRendererProcessParam(index: number, batchEnabled: boolean, processFixedState: boolean): void {
        this.m_renderer.setRendererProcessParam(this.m_processids[index], batchEnabled, processFixedState);
    }
    appendARendererProcess(batchEnabled: boolean = true, processFixedState: boolean = false): void {
        let process: RenderProcess = this.m_renderer.appendProcess(batchEnabled, processFixedState) as RenderProcess;
        this.m_processids[this.m_processidsLen] = process.getRPIndex();
        this.m_processidsLen++;
    }

    getRenderProcessAt(processIndex: number): IRenderProcess {
        return this.m_renderer.getProcessAt(this.m_processids[processIndex]);
    }
    private m_containers: IRenderEntityContainer[] = [];
    private m_containersTotal: number = 0;
    addContainer(container: IRenderEntityContainer, processIndex: number = 0): void {
        if (processIndex < 0) {
            processIndex = 0;
        }
        if (container != null && container.__$wuid < 0 && container.__$contId < 1) {
            let i: number = 0;
            for (; i < this.m_containersTotal; ++i) {
                if (this.m_containers[i] == container) {
                    return;
                }
            }
            if (i >= this.m_containersTotal) {
                container.__$wuid = this.m_uid;
                container.wprocuid = processIndex;
                container.__$setRenderer(this);
                this.m_containers.push(container);
                this.m_containersTotal++;
            }
        }
    }
    removeContainer(container: IRenderEntityContainer): void {
        if (container != null && container.__$wuid == this.m_uid && container.getRenderer() == this.m_renderer) {
            let i: number = 0;
            for (; i < this.m_containersTotal; ++i) {
                if (this.m_containers[i] == container) {
                    container.__$wuid = -1;
                    container.wprocuid = -1;
                    container.__$setRenderer(null);
                    this.m_containers.splice(i, 1);
                    --this.m_containersTotal;
                    break;
                }
            }
        }
    }
    setAutoRunningEnabled(autoRunning: boolean): void {
        this.m_autoRunning = autoRunning;
    }
    setAutoRenderingSort(sortEnabled: boolean): void {
        this.m_processUpdate = sortEnabled;
    }
    setProcessSortEnabledAt(processIndex: number, sortEnabled: boolean, sorter: IRODisplaySorter = null): void {
        this.m_renderer.setProcessSortEnabledAt(processIndex, sortEnabled);
        if (sortEnabled) {
            let process: IRenderProcess = this.m_renderer.getProcessAt(processIndex);
            sorter = sorter != null ? sorter : this.m_camDisSorter;
            if (process != null) {
                process.setSorter(sorter);
            }
        }
    }
    setProcessSortEnabled(process: IRenderProcess, sortEnabled: boolean, sorter: IRODisplaySorter = null): void {
        this.m_renderer.setProcessSortEnabled(process, sortEnabled);
        if (sortEnabled && process != null && !process.hasSorter()) {
            sorter = sorter != null ? sorter : this.m_camDisSorter;
            process.setSorter(sorter);
        }
    }

    moveEntityTo(entity: IRenderEntity, processindex: number): void {
        this.m_renderer.moveEntityToProcessAt(entity, this.m_processids[processindex]);
    }

    drawEntity(entity: IRenderEntity, useGlobalUniform: boolean = false, forceUpdateUniform: boolean = true): void {
        this.m_renderer.drawEntity(entity, useGlobalUniform, forceUpdateUniform);
    }

    addEntity(entity: IRenderEntity, processid: number = 0, deferred: boolean = true): void {
        if (entity != null && entity.__$testSpaceEnabled()) {
            if (entity.isPolyhedral()) {
                if (entity.hasMesh()) {
                    this.m_renderer.addEntity(entity, this.m_processids[processid], deferred);
                    if (this.m_rspace != null) {
                        this.m_rspace.addEntity(entity);
                    }
                }
                else {
                    // 这里的等待队列可能会和加入容器的操作冲突
                    // wait queue
                    if (this.m_nodeWaitLinker == null) {
                        this.m_nodeWaitLinker = new Entity3DNodeLinker();
                        this.m_nodeWaitQueue = new EntityNodeQueue();
                    }
                    let node: Entity3DNode = this.m_nodeWaitQueue.addEntity(entity);
                    node.rstatus = processid;
                    this.m_nodeWaitLinker.addNode(node);
                }
            }
            else {
                this.m_renderer.addEntity(entity, this.m_processids[processid], deferred);
                if (this.m_rspace != null) {
                    this.m_rspace.addEntity(entity);
                }
            }
        }
    }

    removeEntity(entity: IRenderEntity): void {
        if (entity != null) {
            let node: Entity3DNode = null;
            if (this.m_nodeWaitLinker != null) {
                let node: Entity3DNode = this.m_nodeWaitQueue.getNodeByEntity(entity);
                if (node != null) {
                    this.m_nodeWaitLinker.removeNode(node);
                    this.m_nodeWaitQueue.removeEntity(entity);
                }
            }
            if (node == null) {
                this.m_renderer.removeEntity(entity);
                if (this.m_rspace != null) {
                    this.m_rspace.removeEntity(entity);
                }
            }
        }
    }

    updateMaterialUniformToCurrentShd(material: IRenderMaterial): void {
        this.m_renderer.updateMaterialUniformToCurrentShd(material);
    }
    showInfoAt(index: number): void {
        this.m_renderer.showInfoAt(index);
    }

    getRenderUnitsTotal(): number {
        return this.m_renderer.getRenderUnitsTotal();
    }
    private m_currCamera: CameraBase = null;
    useCamera(camera: CameraBase, syncCamView: boolean = false): void {

        this.m_currCamera = camera;
        if (syncCamView) {
            this.m_renderProxy.setRCViewPort(camera.getViewX(), camera.getViewY(), camera.getViewWidth(), camera.getViewHeight(), true);
            this.m_renderProxy.reseizeRCViewPort();
        }
        camera.update();

        this.m_rcontext.resetUniform();
        this.m_renderProxy.updateCameraDataFromCamera(camera);
    }
    useMainCamera(): void {
        this.m_currCamera = null;
        let camera: IRenderCamera = this.m_renderProxy.getCamera();
        this.m_renderProxy.setRCViewPort(camera.getViewX(), camera.getViewY(), camera.getViewWidth(), camera.getViewHeight(), true);
        this.m_renderProxy.reseizeRCViewPort();
        this.m_renderProxy.updateCamera();
        this.m_rcontext.resetUniform();
        this.m_renderProxy.updateCameraDataFromCamera(this.m_renderProxy.getCamera());
    }
    updateCameraDataFromCamera(camera: CameraBase): void {

        this.m_renderProxy.updateCameraDataFromCamera(camera);
    }

    resetState(): void {
        this.m_rcontext.resetState();
    }

    resetUniform(): void {
        this.m_rcontext.resetUniform();
    }
    enableSynViewAndStage(): void {
        this.m_renderProxy.enableSynViewAndStage();
    }

    renderBegin(contextBeginEnabled: boolean = true): void {

        if (this.m_currCamera == null) {
            this.m_adapter.unlockViewport();
            if (this.m_renderProxy.isAutoSynViewAndStage()) {
                let boo: boolean = this.m_renderProxy.testViewPortChanged(this.m_viewX, this.m_viewY, this.m_viewW, this.m_viewH);
                this.m_viewX = this.m_renderProxy.getViewX();
                this.m_viewY = this.m_renderProxy.getViewY();
                this.m_viewW = this.m_renderProxy.getViewWidth();
                this.m_viewH = this.m_renderProxy.getViewHeight();
                if (boo) {
                    this.m_renderProxy.setRCViewPort(this.m_viewX, this.m_viewY, this.m_viewW, this.m_viewH, true);
                    this.m_renderProxy.reseizeRCViewPort();
                }
            } else {
                this.m_renderProxy.setViewPort(this.m_viewX, this.m_viewY, this.m_viewW, this.m_viewH);
            }
            this.m_renderProxy.updateCamera();
            this.m_renderProxy.updateCameraDataFromCamera(this.m_renderProxy.getCamera());
        }
        this.m_shader.renderBegin();
        if (contextBeginEnabled) {
            this.m_rcontext.renderBegin(this.m_currCamera == null);
        }
        this.m_currCamera = null;
        if (this.m_accessor != null) {
            this.m_accessor.renderBegin(this);
        }
    }

    runBegin(autoCycle: boolean = true, contextBeginEnabled: boolean = true): void {

        if (autoCycle && this.m_autoRunning) {
            if (this.m_runFlag >= 0) this.runEnd();
            this.m_runFlag = 0;
        }
        let cam = this.m_currCamera;
        let camFlag: boolean = cam == null;
        this.renderBegin(contextBeginEnabled);
        if (this.m_rspace != null) {
            this.m_rspace.setCamera(camFlag ? this.m_renderProxy.getCamera() : cam);
            this.m_rspace.runBegin();
        }
    }
    renderContextBegin(): void {
        this.m_rcontext.renderBegin();
    }
    private m_mouseTestBoo: boolean = true;
    private m_cullingTestBoo: boolean = true;
    private m_rayTestFlag: boolean = true;
    private m_rayTestEnabled: boolean = true;

    setRayTestEnabled(enabled: boolean): void {
        this.m_rayTestEnabled = enabled;
    }
    // @param       evtFlowPhase: 0(none phase),1(capture phase),2(bubble phase)
    // @param       status: 1(default process),1(deselect ray pick target)
    // @return      1 is send evt yes,0 is send evt no,-1 is event nothing
    runMouseTest(evtFlowPhase: number, status: number): number {
        let flag: number = -1;
        if (this.m_evt3DCtr != null && this.m_mouseEvtEnabled) {
            if (this.m_rayTestFlag && this.m_evt3DCtr.getEvtType() > 0) {

                // 是否对已经获得的拾取列表做进一步的gpu拾取
                let selector: IRaySelector = this.m_rspace.getRaySelector();
                if (selector != null) {
                    if (this.m_rayTestEnabled) {
                        this.mouseRayTest();
                    }
                    else {
                        selector.clear();
                    }
                    // 如果有gpu拾取则进入这个管理器, 这个管理器得到最终的拾取结果再和前面的计算结果做比较
                    let total: number = selector.getSelectedNodesTotal();
                    if (total > 1) {
                        let i: number = 0;
                        let list: RaySelectedNode[] = selector.getSelectedNodes();
                        let node: RaySelectedNode = null;
                        for (; i < total; ++i) {
                            node = list[i];
                            if (node.entity.isPolyhedral()) {
                                //this.m_renderer.drawEntityByLockMaterial(node.entity);
                            }
                        }
                    }
                }
                this.m_rayTestFlag = false;
            }
            flag = this.m_evt3DCtr.run(evtFlowPhase, status);
        }
        this.m_mouseTestBoo = false;
        return flag;
    }

    update(autoCycle: boolean = true, mouseEventEnabled: boolean = true): void {
        this.stage3D.enterFrame();
        if (autoCycle && this.m_autoRunning) {
            if (this.m_runFlag != 0) this.runBegin();
            this.m_runFlag = 1;
        }

        // camera visible test, ray cast test, Occlusion Culling test

        this.m_mouseTestBoo = true;
        this.m_cullingTestBoo = true;
        this.m_rayTestFlag = true;

        // wait mesh data ready to finish
        if (this.m_nodeWaitLinker != null) {
            let nextNode: Entity3DNode = this.m_nodeWaitLinker.getBegin();
            if (nextNode != null) {
                let pnode: Entity3DNode;
                let entity: IRenderEntity;
                let status: number;
                while (nextNode != null) {
                    if (nextNode.entity.hasMesh()) {
                        pnode = nextNode;
                        nextNode = nextNode.next;
                        entity = pnode.entity;
                        status = pnode.rstatus;
                        this.m_nodeWaitLinker.removeNode(pnode);
                        this.m_nodeWaitQueue.removeEntity(pnode.entity);
                        //console.log("RenderScene::update(), ready a mesh data that was finished.");
                        this.addEntity(entity, status);
                    }
                    else {
                        nextNode = nextNode.next;
                    }
                }
            }
        }

        let i: number = 0;
        for (; i < this.m_containersTotal; ++i) {
            this.m_containers[i].update();
        }
        this.m_renderer.update();
        // space update
        if (this.m_rspace != null) {
            this.m_rspace.update();
            if (this.m_cullingTestBoo) {
                if (this.m_evt3DCtr != null || this.m_processUpdate || this.m_rspace.getRaySelector() != null) {
                    this.m_rspace.run();
                    this.m_renderProxy.status.povNumber = this.m_rspace.getPOVNumber();
                }
            }
        }
        if (this.m_processUpdate) {
            this.m_renderer.updateAllProcess();
        }
        if (this.m_mouseTestBoo && !this.m_evtFlowEnabled) {
            if (mouseEventEnabled) {
                this.runMouseTest(1, 0);
            }
            else if (this.m_evt3DCtr != null) {
                this.m_evt3DCtr.mouseOutEventTarget();
            }
        }
    }
    // 运行渲染可见性裁剪测试，射线检测等空间管理机制
    cullingTest(): void {
        if (this.m_rspace != null) {
            this.m_rspace.run();
            this.m_renderProxy.status.povNumber = this.m_rspace.getPOVNumber();
        }
        this.m_cullingTestBoo = false;
    }
    // 鼠标位置的射线拾取测试
    mouseRayTest(): void {
        if (this.m_rspace != null) {
            this.m_renderProxy.getMouseXYWorldRay(this.m_mouse_rlpv, this.m_mouse_rltv);
            this.m_rspace.rayTest(this.m_mouse_rlpv, this.m_mouse_rltv);
        }
    }

	private m_prependNodes: IRenderNode[] = null;
	private m_appendNodes: IRenderNode[] = null;

	private runRenderNodes(nodes: IRenderNode[]): void {
		if (nodes != null) {

			// console.log("CoSC runRenderNodes(), nodes.length: ", nodes.length);
			for (let i = 0; i < nodes.length; ++i) {
				nodes[i].render();
			}
		}
	}

	private addRenderNodes(node: IRenderNode, nodes: IRenderNode[]): void {
		for (let i = 0; i < nodes.length; ++i) {
			if (node == nodes[i]) {
				return;
			}
		}
		nodes.push(node);
	}
	prependRenderNode(node: IRenderNode): void {
		if (node != null && node != this) {
			if (this.m_prependNodes == null) this.m_prependNodes = [];
			this.addRenderNodes(node, this.m_prependNodes);
		}
	}
	appendRenderNode(node: IRenderNode): void {
		if (node != null && node != this) {
			if (this.m_appendNodes == null) this.m_appendNodes = [];
			let ls = this.m_appendNodes;
			for (let i = 0; i < ls.length; ++i) {
				if (node == ls[i]) {
					return;
				}
			}
			ls.push(node);
		}
	}
	removeRenderNode(node: IRenderNode): void {
		if (node != null) {
			let ls = this.m_prependNodes;
			if (ls != null) {
				for (let i = 0; i < ls.length; ++i) {
					if (node == ls[i]) {
						ls.splice(i, 1);
						break;
					}
				}
			}
		}
	}

    run(autoCycle: boolean = true): void {

        if (this.m_enabled) {
            if (autoCycle && this.m_autoRunning) {
                if (this.m_runFlag != 1) this.update();
                this.m_runFlag = 2;
            }

            this.runnableQueue.run();
			this.runRenderNodes(this.m_prependNodes);
            if (this.m_subscListLen > 0) {
                for (let i = 0; i < this.m_processidsLen; ++i) {
                    this.m_renderer.runAt(this.m_processids[i]);
                }
            }
            else {
                this.m_renderer.run();
            }
			this.runRenderNodes(this.m_appendNodes);
            if (autoCycle) {
                this.runEnd();
            }

        }
    }

    runAt(index: number): void {
        if (this.m_enabled) {
            this.m_renderer.runAt(this.m_processids[index]);
        }
    }
    runEnd(): void {
        if (this.m_evt3DCtr != null) {
            this.m_evt3DCtr.runEnd();
        }
        this.m_rcontext.runEnd();

        if (this.m_rspace != null) {
            this.m_rspace.runEnd();
        }
        if (this.m_autoRunning) {
            this.m_runFlag = -1;
        }
        if (this.m_accessor != null) {
            this.m_accessor.renderEnd(this);
        }
    }
	render(): void {}
    renderFlush(): void {
        if (this.m_renderProxy != null) {
            this.m_renderProxy.flush();
        }
    }
    updateCamera(): void {
        if (this.m_renderProxy != null) {
            this.m_renderProxy.updateCamera();
        }
    }
    destroy(): void {
        this.runnableQueue.destroy();
    }
}
//*/