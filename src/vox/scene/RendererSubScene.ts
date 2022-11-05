/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// 独立的渲染场景子集,也就是子渲染场景类,字渲染场景拥有子集独立的Camera3D对象和view port 区域
// 不同的子场景，甚至可以拥有独立的matrix3D这样的数据池子

import MathConst from "../../vox/math/MathConst";
import IVector3D from "../../vox/math/IVector3D";
import Vector3D from "../../vox/math/Vector3D";
import IRenderStage3D from "../../vox/render/IRenderStage3D";
import SubStage3D from "../../vox/display/SubStage3D";
import { IRenderCamera } from "../../vox/render/IRenderCamera";
import CameraBase from "../../vox/view/CameraBase";
import { IRenderAdapter } from "../../vox/render/IRenderAdapter";
import IRenderProxy from "../../vox/render/IRenderProxy";
import IRenderMaterial from "../../vox/render/IRenderMaterial";
import IRenderEntity from "../../vox/render/IRenderEntity";
import IRenderEntityContainer from "../../vox/render/IRenderEntityContainer";
import RendererParam from "../../vox/scene/RendererParam";
import RenderProcess from "../../vox/render/RenderProcess";
import IRenderShader from "../../vox/render/IRenderShader";
import Entity3DNode from "../../vox/scene/Entity3DNode";
import EntityNodeQueue from "../../vox/scene/EntityNodeQueue";
import Entity3DNodeLinker from "../../vox/scene/Entity3DNodeLinker";

import RPONodeBuilder from "../../vox/render/RPONodeBuilder";
import { IRendererInstanceContext } from "../../vox/scene/IRendererInstanceContext";
import RendererInstance from "../../vox/scene/RendererInstance";
import IRendererInstance from "../../vox/scene/IRendererInstance";
import IRenderer from "../../vox/scene/IRenderer";
import IRenderProcess from "../../vox/render/IRenderProcess";
import IRendererScene from "../../vox/scene/IRendererScene";
import RaySelectedNode from "../../vox/scene/RaySelectedNode";
import IRendererSpace from "../../vox/scene/IRendererSpace";
import RendererSpace from "../../vox/scene/RendererSpace";
import IRaySelector from "../../vox/scene/IRaySelector";
import RaySelector from "../../vox/scene/RaySelector";
import RayGpuSelector from "../../vox/scene/RayGpuSelector";
import MouseEvt3DController from "../../vox/scene/MouseEvt3DController";
import IEvt3DController from "../../vox/scene/IEvt3DController";
import FBOInstance from "./FBOInstance";
import IRenderNode from "../../vox/scene/IRenderNode";
import Color4 from "../material/Color4";
import { IRendererSceneAccessor } from "./IRendererSceneAccessor";
import IRunnableQueue from "../../vox/base/IRunnableQueue";
import RunnableQueue from "../../vox/base/RunnableQueue";

import { ITextureBlock } from "../../vox/texture/ITextureBlock";
import { IRenderableMaterialBlock } from "../scene/block/IRenderableMaterialBlock";
import { IRenderableEntityBlock } from "../scene/block/IRenderableEntityBlock";
import Matrix4 from "../math/Matrix4";
import IMatrix4 from "../math/IMatrix4";
import RendererSceneBase from "./RendererSceneBase";
import IRendererParam from "./IRendererParam";
export default class RendererSubScene extends RendererSceneBase implements IRenderer, IRendererScene, IRenderNode {
    private m_camera: IRenderCamera = null;
    private m_perspectiveEnabled = true;
    private m_parent: IRendererScene = null;
    constructor(parent: IRendererScene, renderer: IRendererInstance, evtFlowEnabled: boolean) {
        super(1024);
        this.m_evtFlowEnabled = evtFlowEnabled;
        this.m_parent = parent;
        this.m_renderer = renderer;
        this.m_shader = renderer.getDataBuilder().getRenderShader();
        this.m_localRunning = true;
    }
    createSubScene(rparam: IRendererParam = null, renderProcessesTotal: number = 3, createNewCamera: boolean = true): IRendererScene{
        return this.m_parent.createSubScene(rparam, renderProcessesTotal, createNewCamera);
    }
    getCurrentStage3D(): IRenderStage3D {
        return this.m_currStage3D;
    }
    getCamera(): CameraBase {
        return this.m_camera as CameraBase;
    }
    getMouseXYWorldRay(rl_position: Vector3D, rl_tv: Vector3D): void {
        this.m_camera.getWorldPickingRayByScreenXY(this.m_stage3D.mouseX, this.m_stage3D.mouseY, rl_position, rl_tv);
    }
    setEvt3DController(evt3DCtr: IEvt3DController): void {
        if (evt3DCtr != null) {
            if (this.m_currStage3D == null) {
                this.m_currStage3D = new SubStage3D(this.m_renderProxy.getRCUid(), null);
                this.m_currStage3D.uProbe = this.m_renderProxy.uniformContext.createUniformVec4Probe(1);
            }
            evt3DCtr.initialize(this.getStage3D(), this.m_currStage3D);
            evt3DCtr.setRaySelector(this.m_rspace.getRaySelector());
        }
        this.m_evt3DCtr = evt3DCtr;
    }
    initialize(rparam: RendererParam, renderProcessesTotal: number = 3, createNewCamera: boolean = true): void {
        if (this.m_renderProxy == null) {
            if (renderProcessesTotal < 1) {
                renderProcessesTotal = 1;
            } else if (renderProcessesTotal > 32) {
                renderProcessesTotal = 32;
            }
            let selfT: any = this;
            selfT.runnableQueue = new RunnableQueue();

            this.m_rparam = rparam;
            this.m_perspectiveEnabled = rparam.cameraPerspectiveEnabled;
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
            this.m_stage3D = this.m_renderProxy.getStage3D();
            this.m_viewX = this.m_stage3D.getViewX();
            this.m_viewY = this.m_stage3D.getViewY();
            this.m_viewW = this.m_stage3D.getViewWidth();
            this.m_viewH = this.m_stage3D.getViewHeight();
            this.m_camera = createNewCamera ? this.createMainCamera() : this.m_renderProxy.getCamera();
            if (this.m_rspace == null) {
                let sp = new RendererSpace();
                sp.initialize(this.m_renderer, this.m_camera);
                this.m_rspace = sp;
            }
        }
    }

    private createMainCamera(): IRenderCamera {
        this.m_camera = new CameraBase();
        this.m_camera.setViewXY(this.m_viewX, this.m_viewY);
        this.m_camera.setViewSize(this.m_viewW, this.m_viewH);
        let vec3 = this.m_rparam.camProjParam;
        if (this.m_perspectiveEnabled) {
            this.m_camera.perspectiveRH(MathConst.DegreeToRadian(vec3.x), this.m_viewW / this.m_viewH, vec3.y, vec3.z);
        }
        else {
            this.m_camera.orthoRH(vec3.y, vec3.z, -0.5 * this.m_viewH, 0.5 * this.m_viewH, -0.5 * this.m_viewW, 0.5 * this.m_viewW);
        }
        this.m_camera.lookAtRH(this.m_rparam.camPosition, this.m_rparam.camLookAtPos, this.m_rparam.camUpDirect);
        this.m_camera.update();
        return this.m_camera;
    }
    cameraLock(): void {
        this.m_camera.lock();
    }
    cameraUnlock(): void {
        this.m_camera.unlock();
    }
    /**
     * the function only resets the renderer instance rendering status.
     * you should use it before the run or runAt function is called.
     */
    renderBegin(contextBeginEnabled: boolean = false): void {

        if (contextBeginEnabled) {
            this.m_rcontext.renderBegin();
        }
        if (this.m_renderProxy.getCamera() != this.m_camera) {
            //let boo: boolean = this.m_renderProxy.testViewPortChanged(this.m_viewX, this.m_viewY, this.m_viewW, this.m_viewH);
            if (this.m_renderProxy.isAutoSynViewAndStage()) {
                this.m_viewX = this.m_renderProxy.getViewX();
                this.m_viewY = this.m_renderProxy.getViewY();
                this.m_viewW = this.m_renderProxy.getViewWidth();
                this.m_viewH = this.m_renderProxy.getViewHeight();
            }
            this.m_camera.setViewXY(this.m_viewX, this.m_viewY);
            this.m_camera.setViewSize(this.m_viewW, this.m_viewH);
            this.m_renderProxy.setRCViewPort(this.m_viewX, this.m_viewY, this.m_viewW, this.m_viewH, this.m_renderProxy.isAutoSynViewAndStage());
            this.m_renderProxy.reseizeRCViewPort();
        }
        this.m_camera.update();
        this.m_rcontext.updateCameraDataFromCamera(this.m_camera);
        this.m_shader.renderBegin();
        if (this.m_accessor != null) {
            this.m_accessor.renderBegin(this);
        }
    }
    /**
     * the function resets the renderer scene status.
     * you should use it on the frame starting time.
     */
    runBegin(autoCycle: boolean = true, contextBeginEnabled: boolean = false): void {

        if (autoCycle && this.m_autoRunning) {
            if (this.m_runFlag >= 0) this.runEnd();
            this.m_runFlag = 0;
        }
        this.renderBegin(contextBeginEnabled);
        if (this.m_rspace != null) {
            this.m_rspace.setCamera(this.m_camera);
            this.m_rspace.runBegin();
        }
    }
    mouseRayTest(): void {
        if (this.m_rspace != null) {
            this.getMouseXYWorldRay(this.m_mouse_rlpv, this.m_mouse_rltv);
            this.m_rspace.rayTest(this.m_mouse_rlpv, this.m_mouse_rltv);
        }
    }
    render(): void {
        if (this.m_renderProxy != null) {
            this.run(true);
        }
    }
    useCamera(camera: IRenderCamera, syncCamView: boolean = false): void {
        this.m_parent.useCamera(camera, syncCamView);
    }
    useMainCamera(): void {
        this.m_parent.useMainCamera();
    }
    updateCamera(): void {
        if (this.m_camera != null) {
            this.m_camera.update();
        }
    }
}

/*
export default class RendererSubScene implements IRenderer, IRendererScene, IRenderNode {
    private static s_uid: number = 0;
    private m_uid: number = -1;
    private m_adapter: IRenderAdapter = null;
    private m_renderProxy: IRenderProxy = null;
    private m_rcontext: IRendererInstanceContext = null;
    private m_renderer: IRendererInstance = null;
    private m_parent: IRenderer = null;
    private m_processids: Uint8Array = new Uint8Array(128);
    private m_processidsLen: number = 0;
    private m_rspace: RendererSpace = null;
    private m_mouse_rltv: Vector3D = new Vector3D();
    private m_mouse_rlpv: Vector3D = new Vector3D();
    private m_accessor: IRendererSceneAccessor = null;
    // event flow control enable
    private m_evtFlowEnabled: boolean = false;
    private m_evt3DCtr: IEvt3DController = null;
    private m_mouseEvtEnabled: boolean = true;
    private m_camera: IRenderCamera = null;
    private m_viewX: number = 0.0;
    private m_viewY: number = 0.0;
    private m_viewW: number = 800.0
    private m_viewH: number = 800.0;

    private m_nodeWaitLinker: Entity3DNodeLinker = null;
    private m_nodeWaitQueue: EntityNodeQueue = null;
    private m_perspectiveEnabled = true;
    private m_rparam: RendererParam = null;
    private m_stage3D: IRenderStage3D = null;
    private m_shader: IRenderShader = null;
    private m_runFlag: number = -1;
    private m_autoRunning: boolean = true;
    private m_currStage3D: IRenderStage3D = null;
    private m_enabled: boolean = true;

    readonly runnableQueue: IRunnableQueue = new RunnableQueue();
    readonly textureBlock: ITextureBlock = null;
    readonly materialBlock: IRenderableMaterialBlock = null;
    readonly entityBlock: IRenderableEntityBlock = null;

    constructor(parent: IRenderer, renderer: IRendererInstance, evtFlowEnabled: boolean) {
        this.m_evtFlowEnabled = evtFlowEnabled;
        this.m_parent = parent;
        this.m_renderer = renderer;
        this.m_shader = renderer.getDataBuilder().getRenderShader();
        this.m_uid = 1024 + RendererSubScene.s_uid++;
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

    getRPONodeBuilder(): RPONodeBuilder {
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
        }
    }
    // apply new view port rectangle area
    reseizeViewPort(): void {
        this.m_renderProxy.reseizeRCViewPort();
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
    getCurrentStage3D(): IRenderStage3D {
        return this.m_currStage3D;
    }

    getViewWidth(): number {
        return this.m_renderProxy.getStage3D().viewWidth;
    }
    getViewHeight(): number {
        return this.m_renderProxy.getStage3D().viewHeight;
    }
    getCamera(): CameraBase {
        return this.m_camera as CameraBase;
    }

    // /**
    //  * 获取渲染器可渲染对象管理器状态(版本号)
    getRendererStatus(): number {
        return this.m_renderer.getRendererStatus();
    }
    getMouseXYWorldRay(rl_position: Vector3D, rl_tv: Vector3D): void {
        this.m_camera.getWorldPickingRayByScreenXY(this.m_stage3D.mouseX, this.m_stage3D.mouseY, rl_position, rl_tv);
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

    setEvt3DController(evt3DCtr: IEvt3DController): void {
        if (evt3DCtr != null) {
            if (this.m_currStage3D == null) {
                this.m_currStage3D = new SubStage3D(this.m_renderProxy.getRCUid(), null);
                this.m_currStage3D.uProbe = this.m_renderProxy.uniformContext.createUniformVec4Probe(1);
            }
            evt3DCtr.initialize(this.getStage3D(), this.m_currStage3D);
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
    addEventListener(type: number, target: any, func: (evt: any) => void, captureEnabled: boolean = true, bubbleEnabled: boolean = false): void {
        this.m_currStage3D.addEventListener(type, target, func, captureEnabled, bubbleEnabled);
    }
    removeEventListener(type: number, target: any, func: (evt: any) => void): void {
        this.m_currStage3D.removeEventListener(type, target, func);
    }

    setAccessor(accessor: IRendererSceneAccessor): void {
        this.m_accessor = accessor;
    }
    initialize(rparam: RendererParam, renderProcessesTotal: number = 3, createNewCamera: boolean = true): void {
        if (this.m_renderProxy == null) {
            if (renderProcessesTotal < 1) {
                renderProcessesTotal = 1;
            }
            if (renderProcessesTotal > 8) {
                renderProcessesTotal = 8;
            }
            this.m_rparam = rparam;
            this.m_perspectiveEnabled = rparam.cameraPerspectiveEnabled;
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
            this.m_stage3D = this.m_renderProxy.getStage3D();
            this.m_viewX = this.m_stage3D.getViewX();
            this.m_viewY = this.m_stage3D.getViewY();
            this.m_viewW = this.m_stage3D.getViewWidth();
            this.m_viewH = this.m_stage3D.getViewHeight();
            // if (createNewCamera) {
            //     this.createMainCamera();
            // }
            // else {
            //     this.m_camera = this.m_renderProxy.getCamera();
            // }
            this.m_camera = createNewCamera ? this.createMainCamera() : this.m_renderProxy.getCamera();
            if (this.m_rspace == null) {
                this.m_rspace = new RendererSpace();
                this.m_rspace.initialize(this.m_renderer, this.m_camera);
            }
        }
    }

    private createMainCamera(): IRenderCamera {
        this.m_camera = new CameraBase();
        this.m_camera.setViewXY(this.m_viewX, this.m_viewY);
        this.m_camera.setViewSize(this.m_viewW, this.m_viewH);
        let vec3 = this.m_rparam.camProjParam;
        if (this.m_perspectiveEnabled) {
            this.m_camera.perspectiveRH(MathConst.DegreeToRadian(vec3.x), this.m_viewW / this.m_viewH, vec3.y, vec3.z);
        }
        else {
            this.m_camera.orthoRH(vec3.y, vec3.z, -0.5 * this.m_viewH, 0.5 * this.m_viewH, -0.5 * this.m_viewW, 0.5 * this.m_viewW);
        }
        this.m_camera.lookAtRH(this.m_rparam.camPosition, this.m_rparam.camLookAtPos, this.m_rparam.camUpDirect);
        this.m_camera.update();
        return this.m_camera;
    }
    cameraLock(): void {
        this.m_camera.lock();
    }
    cameraUnlock(): void {
        this.m_camera.unlock();
    }
    updateRenderBufferSize(): void {
        this.m_adapter.updateRenderBufferSize();
    }
    setRendererProcessParam(index: number, batchEnabled: boolean, processFixedState: boolean): void {
        this.m_renderer.setRendererProcessParam(this.m_processids[index], batchEnabled, processFixedState);
    }
    appendARendererProcess(batchEnabled: boolean = true, processFixedState: boolean = false): void {
        let process: RenderProcess = this.m_renderer.appendProcess(batchEnabled, processFixedState) as RenderProcess;
        this.m_processids[this.m_processidsLen] = process.getRPIndex();
        this.m_processidsLen++;
    }
    // /**
    //  * get the renderer process by process index
    //  * @param processIndex IRenderProcess instance index in renderer scene instance
    
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
    // /**
    //  * 将已经在渲染运行时中的entity移动到指定 process uid 的 render process 中去
    //  * move rendering runtime displayEntity to different renderer process

    moveEntityTo(entity: IRenderEntity, processIndex: number): void {
        this.m_renderer.moveEntityToProcessAt(entity, this.m_processids[processIndex]);
    }
    // /**
    //  * 单独绘制可渲染对象, 可能是使用了 global material也可能没有。这种方式比较耗性能,只能用在特殊的地方。
    //  * @param entity 需要指定绘制的 IRenderEntity 实例
    //  * @param useGlobalUniform 是否使用当前 global material 所携带的 uniform, default value: false
    //  * @param forceUpdateUniform 是否强制更新当前 global material 所对应的 shader program 的 uniform, default value: true

    drawEntity(entity: IRenderEntity, useGlobalUniform: boolean = false, forceUpdateUniform: boolean = true): void {
        this.m_renderer.drawEntity(entity, useGlobalUniform, forceUpdateUniform);
    }
    // /**
    //  * add an entity to the renderer process of the renderer instance
    //  * @param entity IRenderEntity instance(for example: DisplayEntity class instance)
    //  * @param processid this destination renderer process id
    //  * @param deferred if the value is true,the entity will not to be immediately add to the renderer process by its id

    addEntity(entity: IRenderEntity, processIndex: number = 0, deferred: boolean = true): void {
        if (entity != null && entity.__$testSpaceEnabled()) {
            if (entity.isPolyhedral()) {
                if (entity.hasMesh()) {
                    this.m_renderer.addEntity(entity, this.m_processids[processIndex], deferred);
                    if (this.m_rspace != null) {
                        this.m_rspace.addEntity(entity);
                    }
                }
                else {
                    // wait queue
                    if (this.m_nodeWaitLinker == null) {
                        this.m_nodeWaitLinker = new Entity3DNodeLinker();
                        this.m_nodeWaitQueue = new EntityNodeQueue();
                    }
                    let node: Entity3DNode = this.m_nodeWaitQueue.addEntity(entity);
                    node.rstatus = processIndex;
                    this.m_nodeWaitLinker.addNode(node);
                }
            }
            else {
                this.m_renderer.addEntity(entity, this.m_processids[processIndex], deferred);
                if (this.m_rspace != null) {
                    this.m_rspace.addEntity(entity);
                }
            }
        }
    }
    // 这是真正的完全将entity从world中清除
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
    // 首先要锁定Material才能用这种绘制方式,再者这个entity已经完全加入渲染器了渲染资源已经准备完毕,这种方式比较耗性能，只能用在特殊的地方
    // drawEntityByLockMaterial(entity: IRenderEntity): void {
    //     this.m_renderer.drawEntityByLockMaterial(entity);
    // }
    showInfoAt(index: number): void {
        this.m_renderer.showInfoAt(index);
    }

    updateCameraData(camera: IRenderCamera): void {

        this.m_rcontext.updateCameraDataFromCamera(this.m_renderProxy.getCamera());
    }
    // /**
    //  * the function only resets the renderer instance rendering status.
    //  * you should use it before the run or runAt function is called.

    renderBegin(contextBeginEnabled: boolean = false): void {

        if (contextBeginEnabled) {
            this.m_rcontext.renderBegin();
        }
        if (this.m_renderProxy.getCamera() != this.m_camera) {
            //let boo: boolean = this.m_renderProxy.testViewPortChanged(this.m_viewX, this.m_viewY, this.m_viewW, this.m_viewH);
            if (this.m_renderProxy.isAutoSynViewAndStage()) {
                this.m_viewX = this.m_renderProxy.getViewX();
                this.m_viewY = this.m_renderProxy.getViewY();
                this.m_viewW = this.m_renderProxy.getViewWidth();
                this.m_viewH = this.m_renderProxy.getViewHeight();
            }
            this.m_camera.setViewXY(this.m_viewX, this.m_viewY);
            this.m_camera.setViewSize(this.m_viewW, this.m_viewH);
            this.m_renderProxy.setRCViewPort(this.m_viewX, this.m_viewY, this.m_viewW, this.m_viewH, this.m_renderProxy.isAutoSynViewAndStage());
            this.m_renderProxy.reseizeRCViewPort();
        }
        this.m_camera.update();
        this.m_rcontext.updateCameraDataFromCamera(this.m_camera);
        this.m_shader.renderBegin();
        if (this.m_accessor != null) {
            this.m_accessor.renderBegin(this);
        }
    }
    // /**
    //  * the function resets the renderer scene status.
    //  * you should use it on the frame starting time.

    runBegin(autoCycle: boolean = true, contextBeginEnabled: boolean = false): void {

        if (autoCycle && this.m_autoRunning) {
            if (this.m_runFlag >= 0) this.runEnd();
            this.m_runFlag = 0;
        }
        this.renderBegin(contextBeginEnabled);
        if (this.m_rspace != null) {
            this.m_rspace.setCamera(this.m_camera);
            this.m_rspace.runBegin();
        }
    }

    private m_mouseTestBoo: boolean = true;
    private m_cullingTestBoo: boolean = true;
    private m_rayTestFlag: boolean = true;
    private m_rayTestEnabled: boolean = true;

    setRayTestEnabled(enabled: boolean): void {
        this.m_rayTestEnabled = enabled;
    }
    // /**
    //  * @param evtFlowPhase  0(none phase),1(capture phase),2(bubble phase)
    //  * @param status: 1(default process),1(deselect ray pick target)
    //  * @requires 1 is send evt yes,0 is send evt no,-1 is event nothing

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

    // /**
    //  * update all data or status of the renderer runtime
    //  * should call this function per frame

    update(autoCycle: boolean = true, mouseEventEnabled: boolean = true): void {

        if (this.m_currStage3D != null) this.m_currStage3D.enterFrame();

        if (autoCycle && this.m_autoRunning) {
            if (this.m_runFlag != 0) this.runBegin();
            this.m_runFlag = 1;
        }

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
        //  this.m_renderer.update();

        let i: number = 0;
        for (; i < this.m_containersTotal; ++i) {
            this.m_containers[i].update();
        }
        // space update
        if (this.m_rspace != null) {
            this.m_rspace.update();
        }

        if (this.m_rspace != null && this.m_cullingTestBoo) {
            if (this.m_evt3DCtr != null || this.m_rspace.getRaySelector() != null) {
                this.m_rspace.run();
            }
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
    // 渲染可见性裁剪测试
    cullingTest(): void {
        if (this.m_rspace != null) {
            this.m_rspace.run();
        }
        this.m_cullingTestBoo = false;
    }
    // 鼠标位置的射线拾取测试
    mouseRayTest(): void {
        if (this.m_rspace != null) {
            this.getMouseXYWorldRay(this.m_mouse_rlpv, this.m_mouse_rltv);
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
            // console.log("CoSC appendRenderNode(), node: ", node);
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
    // rendering running
    run(autoCycle: boolean = false): void {

        if (this.m_enabled) {

            //console.log("rendererSubScene::run...");
            if (autoCycle && this.m_autoRunning) {
                if (this.m_runFlag != 1) this.update();
                this.m_runFlag = 2;
            }
            this.runnableQueue.run();
            this.runRenderNodes(this.m_prependNodes);

            for (let i: number = 0; i < this.m_processidsLen; ++i) {
                this.m_renderer.runAt(this.m_processids[i]);
            }

            this.runRenderNodes(this.m_appendNodes);

            if (autoCycle) {
                this.runEnd();
            }
        }
    }
    runAt(index: number): void {
        this.m_renderer.runAt(this.m_processids[index]);
    }
    runEnd(): void {
        if (this.m_evt3DCtr != null) {
            this.m_evt3DCtr.runEnd();
        }
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
    render(): void {
        if (this.m_renderProxy != null) {
            this.run(true);
        }
    }
    useCamera(camera: IRenderCamera, syncCamView: boolean = false): void {
        this.m_parent.useCamera(camera, syncCamView);
    }
    useMainCamera(): void {
        this.m_parent.useMainCamera();
    }
    updateCamera(): void {
        if (this.m_camera != null) {
            this.m_camera.update();
        }
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
        this.m_renderProxy.setRenderToBackBuffer();
    }
    destroy(): void {
        this.runnableQueue.destroy();
    }

}
    //*/
