/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// 整个渲染场景的入口类

import IVector3D from "../../../vox/math/IVector3D";
import Vector3D from "../../../vox/math/Vector3D";
import Matrix4 from "../../../vox/math/Matrix4";
import Matrix4Pool from "../../../vox/math/Matrix4Pool";

import IRenderStage3D from "../../../vox/render/IRenderStage3D";
import IRenderProxy from "../../../vox/render/IRenderProxy";
import IRenderMaterial from "../../../vox/render/IRenderMaterial";
import { IRenderAdapter } from "../../../vox/render/IRenderAdapter";
import { IRenderCamera } from "../../../vox/render/IRenderCamera";
import IRenderEntity from "../../../vox/render/IRenderEntity";
import IRenderEntityContainer from "../../../vox/render/IRenderEntityContainer";
import IRenderProcess from "../../../vox/render/IRenderProcess";
import { IRendererInstanceContext } from "../../../vox/scene/IRendererInstanceContext";
import IRendererInstance from "../../../vox/scene/IRendererInstance";
import IRODisplaySorter from "../../../vox/render/IRODisplaySorter";
import IMatrix4 from "../../../vox/math/IMatrix4";
import IRPONodeBuilder from "../../../vox/render/IRPONodeBuilder";
import IRenderShader from "../../../vox/render/IRenderShader";
import RendererState from "../../../vox/render/RendererState";

import SimpleStage3D from "./SimpleStage3D";
import Color4 from "../../../vox/material/Color4";
import CameraBase from "../../../vox/view/CameraBase";
import RendererParam from "../../../vox/scene/RendererParam";

import Entity3DNode from "../../../vox/scene/Entity3DNode";
import EntityNodeQueue from "../../../vox/scene/EntityNodeQueue";
import Entity3DNodeLinker from "../../../vox/scene/Entity3DNodeLinker";
import RunnableQueue from "../../../vox/base/RunnableQueue";

import { ITextureBlock } from "../../../vox/texture/ITextureBlock";
import { TextureBlock } from "../../../vox/texture/TextureBlock";
import IRenderer from "../../../vox/scene/IRenderer";
import IRendererSpace from "../../../vox/scene/IRendererSpace";
import IEvt3DController from "../../../vox/scene/IEvt3DController";
import FBOInstance from "../../../vox/scene/FBOInstance";
import CameraDsistanceSorter from "../../../vox/scene/CameraDsistanceSorter";

import { IRendererSceneAccessor } from "../../../vox/scene/IRendererSceneAccessor";
import { ShaderProgramBuilder } from "../../../vox/material/ShaderProgramBuilder";

import { IRenderableMaterialBlock } from "../../../vox/scene/block/IRenderableMaterialBlock";
import { IRenderableEntityBlock } from "../../../vox/scene/block/IRenderableEntityBlock";

import { ICoRenderer } from "../ICoRenderer";
import IRendererScene from "../../../vox/scene/IRendererScene";
import IRenderNode from "../../../vox/scene/IRenderNode";
import IRendererParam from "../../../vox/scene/IRendererParam";
import IRenderEntityBase from "../../../vox/render/IRenderEntityBase";

declare var CoRenderer: ICoRenderer;

export default class CoSimpleRendererScene implements IRenderer, IRendererScene, IRenderNode {
	private static s_uid = 0;
	private m_uid = -1;
	private m_adapter: IRenderAdapter = null;
	private m_renderProxy: IRenderProxy = null;
	private m_shader: IRenderShader = null;
	private m_rcontext: IRendererInstanceContext = null;
	private m_renderer: IRendererInstance = null;
	private m_processids = new Uint8Array(128);
	private m_processidsLen = 0;
	private m_accessor: IRendererSceneAccessor = null;

	private m_viewX = 0.0;
	private m_viewY = 0.0;
	private m_viewW = 800.0;
	private m_viewH = 800.0;

	private m_nodeWaitLinker: Entity3DNodeLinker = null;
	private m_nodeWaitQueue: EntityNodeQueue = null;
	private m_camDisSorter: CameraDsistanceSorter = null;

	private m_subscListLen = 0;
	private m_runFlag = -1;
	private m_autoRunning = true;
	private m_processUpdate = false;
	private m_tickId: any = -1;
	private m_rparam: RendererParam = null;
	private m_enabled: boolean = true;

	readonly runnableQueue = new RunnableQueue();
	readonly textureBlock = new TextureBlock();
	readonly stage3D: SimpleStage3D = null;

	readonly materialBlock: IRenderableMaterialBlock = null;
	readonly entityBlock: IRenderableEntityBlock = null;

	constructor() {
		this.m_uid = CoSimpleRendererScene.s_uid++;
	}
	private tickUpdate(): void {
		if (this.m_tickId > -1) {
			clearTimeout(this.m_tickId);
		}
		this.m_tickId = setTimeout(this.tickUpdate.bind(this), this.m_rparam.getTickUpdateTime());
		this.textureBlock.run();
	}
	createRendererParam(): IRendererParam {
        return new RendererParam();
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
	setViewPortFromCamera(camera: CameraBase): void {
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
	/**
	 * 获取渲染器可渲染对象管理器状态(版本号)
	 */
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
		return new FBOInstance(this);
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

	drawBackBufferToCanvas(dstCanvas: HTMLCanvasElement): void {
		let srcCanvas = this.getCanvas();
		var ctx = dstCanvas.getContext("2d");
		ctx.drawImage(srcCanvas, 0, 0, dstCanvas.width, dstCanvas.height);
	}
	updateRenderBufferSize(): void {
		this.m_adapter.updateRenderBufferSize();
	}
	setEvt3DController(evt3DCtr: IEvt3DController): void {
		throw Error("iellegal operations !!!");
	}
	isRayPickSelected(): boolean {
		return false;
	}
	enableMouseEvent(gpuTestEnabled: boolean = true): void {
	}
	disableMouseEvent(): void {
	}
	getEvt3DController(): IEvt3DController {
		return null;
	}
	getSpace(): IRendererSpace {
		return null;
	}
	getDevicePixelRatio(): number {
		return this.m_adapter.getDevicePixelRatio();
	}
	/**
	 * very important renderer scene system function
	 */
	createSubScene(rparam: RendererParam = null, renderProcessesTotal: number = 3, createNewCamera: boolean = true): IRendererScene {
		throw Error("illegal operations !!!");
		return null;
	}
	addEventListener(type: number, target: any, func: (evt: any) => void, captureEnabled: boolean = true, bubbleEnabled: boolean = false): void {
		// this.stage3D.addEventListener(type, target, func, captureEnabled, bubbleEnabled);
	}
	removeEventListener(type: number, target: any, func: (evt: any) => void): void {
		// this.stage3D.removeEventListener(type, target, func);
	}
	setAccessor(accessor: IRendererSceneAccessor): void {
		this.m_accessor = accessor;
	}
	initialize(rparam: RendererParam = null, renderProcessesTotal: number = 3): IRendererScene {
		if (this.m_renderer == null) {
			if (rparam == null) rparam = new RendererParam();
			this.m_rparam = rparam;
			let selfT: any = this;
			selfT.stage3D = new SimpleStage3D(this.getUid(), document);
			if (renderProcessesTotal < 1) {
				renderProcessesTotal = 1;
			}
			if (renderProcessesTotal > 8) {
				renderProcessesTotal = 8;
			}
			this.m_renderer = CoRenderer.createRendererInstance();

			(this.m_renderer as any).__$setStage3D(this.stage3D);
			Matrix4Pool.Allocate(rparam.getMatrix4AllocateSize());
			let camera: CameraBase = new CameraBase();

			this.m_renderer.initialize(rparam, camera, new ShaderProgramBuilder(this.m_renderer.getRCUid()));

			let srcSt: any = CoRenderer.RendererState;
			srcSt.rstb.buildToRST(RendererState);
			// RendererState.Initialize(srcSt.Rstate, srcSt.VRO);

			this.m_processids[0] = 0;
			this.m_processidsLen++;
			let process: IRenderProcess = null;
			for (; renderProcessesTotal >= 0; ) {
				process = this.m_renderer.appendProcess(rparam.batchEnabled, rparam.processFixedState);
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
			this.m_shader = (this.m_renderer as any).getDataBuilder().getRenderShader();
			this.textureBlock.setRenderer(this.m_renderProxy);
			this.m_camDisSorter = new CameraDsistanceSorter(this.m_renderProxy);

			this.tickUpdate();
		}
		return this;
	}
	setRendererProcessParam(index: number, batchEnabled: boolean, processFixedState: boolean): void {
		this.m_renderer.setRendererProcessParam(this.m_processids[index], batchEnabled, processFixedState);
	}
	appendARendererProcess(batchEnabled: boolean = true, processFixedState: boolean = false): void {
		let process = this.m_renderer.appendProcess(batchEnabled, processFixedState);
		this.m_processids[this.m_processidsLen] = process.getRPIndex();
		this.m_processidsLen++;
	}

	/**
	 * get the renderer process by process index
	 * @param processIndex IRenderProcess instance index in renderer scene instance
	 */
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
				container.__$wprocuid = processIndex;
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
					container.__$wprocuid = -1;
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
	/**
	 * 将已经在渲染运行时中的entity移动到指定 process uid 的 render process 中去
	 * move rendering runtime displayEntity to different renderer process
	 */
	moveEntityTo(entity: IRenderEntity, processindex: number): void {
		this.m_renderer.moveEntityToProcessAt(entity, this.m_processids[processindex]);
	}
	/**
	 * 单独绘制可渲染对象, 可能是使用了 global material也可能没有。这种方式比较耗性能,只能用在特殊的地方。
	 * @param entity 需要指定绘制的 IRenderEntity 实例
	 * @param useGlobalUniform 是否使用当前 global material 所携带的 uniform, default value: false
	 * @param forceUpdateUniform 是否强制更新当前 global material 所对应的 shader program 的 uniform, default value: true
	 */
	drawEntity(entity: IRenderEntity, useGlobalUniform: boolean = false, forceUpdateUniform: boolean = true): void {
		this.m_renderer.drawEntity(entity, useGlobalUniform, forceUpdateUniform);
	}
	/**
	 * add an entity to the renderer process of the renderer instance
	 * @param entity IRenderEntity instance(for example: DisplayEntity class instance)
	 * @param processid this destination renderer process id
	 * @param deferred if the value is true,the entity will not to be immediately add to the renderer process by its id
	 */
	addEntity(entity: IRenderEntity, processid: number = 0, deferred: boolean = true): void {
		if (entity != null && entity.__$testSpaceEnabled()) {
			if (entity.isPolyhedral()) {
				if (entity.hasMesh()) {
					this.m_renderer.addEntity(entity, this.m_processids[processid], deferred);
				} else {
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
			} else {
				this.m_renderer.addEntity(entity, this.m_processids[processid], deferred);
			}
		}
	}
	/**
	 * remove an entity from the rendererinstance
	 * @param entity IRenderEntity instance(for example: DisplayEntity class instance)
	 */
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
		let camera = this.m_renderProxy.getCamera();
		this.m_renderProxy.setRCViewPort(camera.getViewX(), camera.getViewY(), camera.getViewWidth(), camera.getViewHeight(), true);
		this.m_renderProxy.reseizeRCViewPort();
		this.m_renderProxy.updateCamera();
		this.m_rcontext.resetUniform();
		this.m_renderProxy.updateCameraDataFromCamera(this.m_renderProxy.getCamera());
	}
	updateCameraDataFromCamera(camera: CameraBase): void {
		this.m_renderProxy.updateCameraDataFromCamera(camera);
	}
	/**
	 * reset renderer rendering state
	 */
	resetState(): void {
		this.m_rcontext.resetState();
	}
	/**
	 * reset render shader uniform location
	 */
	resetUniform(): void {
		this.m_rcontext.resetUniform();
	}
	enableSynViewAndStage(): void {
		this.m_renderProxy.enableSynViewAndStage();
	}
	/**
	 * the function only resets the renderer instance rendering status.
	 * you should use it before the run or runAt function is called.
	 */
	renderBegin(contextBeginEnabled: boolean = true): void {
		if (this.m_currCamera == null) {
			this.m_adapter.unlockViewport();
			if (this.m_renderProxy.isAutoSynViewAndStage()) {
				let boo = this.m_renderProxy.testViewPortChanged(this.m_viewX, this.m_viewY, this.m_viewW, this.m_viewH);
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
	/**
	 * the function resets the renderer scene status.
	 * you should use it on the frame starting time.
	 */
	runBegin(autoCycle: boolean = true, contextBeginEnabled: boolean = true): void {
		if (autoCycle && this.m_autoRunning) {
			if (this.m_runFlag >= 0) this.runEnd();
			this.m_runFlag = 0;
		}
		this.renderBegin(contextBeginEnabled);
	}
	renderContextBegin(): void {
		this.m_rcontext.renderBegin();
	}

	setRayTestEnabled(enabled: boolean): void {
	}
	// @param       evtFlowPhase: 0(none phase),1(capture phase),2(bubble phase)
	// @param       status: 1(default process),1(deselect ray pick target)
	// @return      1 is send evt yes,0 is send evt no,-1 is event nothing
	runMouseTest(evtFlowPhase: number, status: number): number {
		return -1;
	}

	/**
	 * update all data or status of the renderer runtime
	 * should call this function per frame
	 */
	update(autoCycle: boolean = true, mouseEventEnabled: boolean = true): void {
		this.stage3D.enterFrame();
		if (autoCycle && this.m_autoRunning) {
			if (this.m_runFlag != 0) this.runBegin();
			this.m_runFlag = 1;
		}

		// wait mesh data ready to finish
		if (this.m_nodeWaitLinker != null) {
			let nextNode = this.m_nodeWaitLinker.getBegin();
			if (nextNode != null) {
				let pnode: Entity3DNode;
				let entity: IRenderEntityBase;
				let status: number;
				while (nextNode != null) {
					pnode = nextNode;
					entity = pnode.entity;
					if (entity.getREType() < 12 && (entity as IRenderEntity).hasMesh()) {
						nextNode = nextNode.next;
						status = pnode.rstatus;
						this.m_nodeWaitLinker.removeNode(pnode);
						this.m_nodeWaitQueue.removeEntity(entity);
						//console.log("RenderScene::update(), ready a mesh data that was finished.");
						this.addEntity(entity as IRenderEntity, status);
					}
					nextNode = nextNode.next;
				}
			}
		}

		let i = 0;
		for (; i < this.m_containersTotal; ++i) {
			this.m_containers[i].update();
		}
		this.m_renderer.update();

		if (this.m_processUpdate) {
			this.m_renderer.updateAllProcess();
		}
	}
	// 运行渲染可见性裁剪测试，射线检测等空间管理机制
	cullingTest(): void {
	}
	// 鼠标位置的射线拾取测试
	mouseRayTest(): void {
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

	/**
	 * run all renderer processes in the renderer instance
	 * @param autoCycle the default is true
	 */
	run(autoCycle: boolean = true): void {
		if (this.m_enabled) {
			if (autoCycle && this.m_autoRunning) {
				if (this.m_runFlag != 1) this.update();
				this.m_runFlag = 2;
			}

			this.runnableQueue.run();
			this.runRenderNodes(this.m_prependNodes);
			if (this.m_subscListLen > 0) {
				for (let i: number = 0; i < this.m_processidsLen; ++i) {
					this.m_renderer.runAt(this.m_processids[i]);
				}
			} else {
				this.m_renderer.run();
			}
			this.runRenderNodes(this.m_appendNodes);
			if (autoCycle) {
				this.runEnd();
			}
		}
	}

	/**
	 * run the specific renderer process by its index in the renderer instance
	 * @param index the renderer process index in the renderer instance
	 */
	runAt(index: number): void {
		if (this.m_enabled) {
			this.m_renderer.runAt(this.m_processids[index]);
		}
	}
	runEnd(): void {

		this.m_rcontext.runEnd();

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

    setProcessEnabledAt(i: number, enabled: boolean): void {
	}
	destroy(): void {
	}

    private m_autoRRun = false;
    fakeRun(autoCycle: boolean = true): void {
        console.log("fakeRun ...");
    }
    setAutoRunning(auto: boolean): CoSimpleRendererScene {

        if (this.m_autoRRun != auto) {
            if (this.m_autoRRun) {

                let runFunc = this.run;
                this.run = this.fakeRun;
                this.fakeRun = runFunc;

                this.m_autoRRun = false;
            } else {
                this.m_autoRRun = true;
                let runFunc = this.fakeRun;
                this.fakeRun = this.run;
                this.run = runFunc;
                const func = (): void => {
                    if (this.m_autoRRun) {
                        this.fakeRun();
                        window.requestAnimationFrame(func);
                    }
                }
                window.requestAnimationFrame(func);
            }
        }
		return this;
    }

    isAutoRunning(): boolean {
        return this.m_autoRRun;
    }
}
