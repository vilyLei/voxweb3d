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
import IRenderNode from "../../vox/scene/IRenderNode";
import IRenderShader from "../../vox/render/IRenderShader";
import Matrix4Pool from "../math/Matrix4Pool";
import { IRendererSceneAccessor } from "./IRendererSceneAccessor";
import { ShaderProgramBuilder } from "../../vox/material/ShaderProgramBuilder";

import { IRenderableMaterialBlock } from "./block/IRenderableMaterialBlock";
import { IRenderableEntityBlock } from "./block/IRenderableEntityBlock";
import IMatrix4 from "../math/IMatrix4";
import Matrix4 from "../math/Matrix4";
import IRendererParam from "./IRendererParam";
import IRenderEntityBase from "../render/IRenderEntityBase";
import EntityTransUpdater from "./EntityTransUpdater";
import EntityFency from "./mana/EntityFence";

export default class RendererSceneBase {
	private ___$$$$$$$Author = "VilyLei(vily313@126.com)";
	private static s_uid = 0;
	private m_uid = -1;
	protected m_adapter: IRenderAdapter = null;
	protected m_rproxy: IRenderProxy = null;
	protected m_shader: IRenderShader = null;
	protected m_rcontext: IRendererInstanceContext = null;
	protected m_renderer: IRendererInstance = null;
	protected m_processids = new Uint8Array(128);
	protected m_penableds = new Array(128);
	protected m_processidsLen = 0;
	protected m_rspace: IRendererSpace = null;
	protected m_mouse_rltv = new Vector3D();
	protected m_mouse_rlpv = new Vector3D();
	protected m_accessor: IRendererSceneAccessor = null;
	// event flow control enable
	protected m_evtFlowEnabled = false;
	protected m_evt3DCtr: IEvt3DController = null;
	protected m_mouseEvtEnabled = true;
	protected m_viewX = 0.0;
	protected m_viewY = 0.0;
	protected m_viewW = 800.0;
	protected m_viewH = 800.0;
	protected m_camera: IRenderCamera = null;
	protected m_currCamera: IRenderCamera = null;

	// private m_nodeWaitLinker: Entity3DNodeLinker = null;
	// private m_nodeWaitQueue: EntityNodeQueue = null;

	private m_entityFence: EntityFency;

	private m_camDisSorter: CameraDsistanceSorter = null;

	protected m_subscListLen = 0;
	protected m_localRunning = false;
	private m_containers: IRenderEntityContainer[] = [];
	private m_containersTotal = 0;

	protected m_runFlag = -1;
	protected m_autoRunEnabled = true;
	protected m_processUpdate = false;
	protected m_enabled = true;
	protected m_rparam: IRendererParam = null;
	protected m_currStage3D: IRenderStage3D = null;
	protected m_stage3D: IRenderStage3D = null;
	protected m_transUpdater: EntityTransUpdater;

	// protected m_clearColor = new Color4();
	// protected m_clearColorFlag = false;

	readonly runnableQueue: IRunnableQueue = null;
	readonly textureBlock: ITextureBlock = null;
	readonly stage3D: Stage3D = null;

	readonly materialBlock: IRenderableMaterialBlock = null;
	readonly entityBlock: IRenderableEntityBlock = null;

	constructor(uidBase: number = 0) {
		this.m_uid = uidBase + RendererSceneBase.s_uid++;
		this.m_penableds.fill(true);
		this.m_entityFence = new EntityFency(this);
	}
	createRendererParam(): IRendererParam {
		return new RendererParam();
	}
	createSubScene(rparam: IRendererParam = null, renderProcessesTotal: number = 3, createNewCamera: boolean = true): IRendererScene {
		return null;
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
		return this.m_rproxy.getDiv();
	}
	getCanvas(): HTMLCanvasElement {
		return this.m_rproxy.getCanvas();
	}

	getRPONodeBuilder(): IRPONodeBuilder {
		return null;
	}
	getRenderProxy(): IRenderProxy {
		return this.m_rproxy;
	}

	// set new view port rectangle area
	setViewPort(px: number, py: number, pw: number, ph: number): void {
		if (this.m_rproxy != null) {
			this.m_viewX = px;
			this.m_viewY = py;
			this.m_viewW = pw;
			this.m_viewH = ph;
			this.m_rproxy.setViewPort(px, py, pw, ph);
		}
	}
	setViewPortFromCamera(camera: IRenderCamera): void {
		if (this.m_rproxy != null && camera != null) {
			this.m_viewX = camera.getViewX();
			this.m_viewY = camera.getViewY();
			this.m_viewW = camera.getViewWidth();
			this.m_viewH = camera.getViewHeight();
			this.m_rproxy.setViewPort(this.m_viewX, this.m_viewY, this.m_viewW, this.m_viewH);
		}
	}
	// apply new view port rectangle area
	reseizeViewPort(): void {
		this.m_rproxy.reseizeRCViewPort();
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
		return this.m_rproxy.getStage3D();
	}
	/**
	 * 获取渲染器可渲染对象管理器状态(版本号)
	 */
	getRendererStatus(): number {
		return this.m_renderer.getRendererStatus();
	}
	getViewWidth(): number {
		return this.m_rproxy.getStage3D().viewWidth;
	}
	getViewHeight(): number {
		return this.m_rproxy.getStage3D().viewHeight;
	}
	getCamera(): CameraBase {
		return this.m_rproxy.getCamera() as CameraBase;
	}
	asynFBOSizeWithViewport(): void {
		this.m_rcontext.asynFBOSizeWithViewport();
	}
	synFBOSizeWithViewport(): void {
		this.m_rcontext.synFBOSizeWithViewport();
	}

	cameraLock(): void {
		this.m_rproxy.cameraLock();
	}
	cameraUnlock(): void {
		this.m_rproxy.cameraUnlock();
	}
	getMouseXYWorldRay(rl_position: Vector3D, rl_tv: Vector3D): void {
		// this.m_rproxy.getMouseXYWorldRay(rl_position, rl_tv);
		this.m_camera.getWorldPickingRayByScreenXY(this.m_stage3D.mouseX, this.m_stage3D.mouseY, rl_position, rl_tv);
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
		this.m_rproxy.setClearUint24Color(colorUint24, alpha);
		// this.m_clearColorFlag = true;
		// this.m_clearColor.setRGBUint24(colorUint24);
		// this.m_clearColor.a = alpha;
	}
	setClearRGBColor3f(pr: number, pg: number, pb: number): void {
		this.m_rproxy.setClearRGBColor3f(pr, pg, pb);
		// this.m_clearColorFlag = true;
		// this.m_clearColor.setRGB3f(pr, pg, pb);
	}
	setClearRGBAColor4f(pr: number, pg: number, pb: number, pa: number): void {
		this.m_rproxy.setClearRGBAColor4f(pr, pg, pb, pa);
		// this.m_clearColorFlag = true;
		// this.m_clearColor.setRGBA4f(pr, pg, pb, pa);
	}
	setClearColor(color: Color4): void {
		this.m_rproxy.setClearRGBAColor4f(color.r, color.g, color.b, color.a);
		// this.m_clearColorFlag = true;
		// if (color) this.m_clearColor.copyFrom(color);
	}

	setRenderToBackBuffer(): void {
		this.m_rcontext.setRenderToBackBuffer();
	}

	drawBackBufferToCanvas(dstCanvasCtx: CanvasRenderingContext2D, px: number, py: number, width: number, height: number): void {
		let srcCanvas = this.getCanvas();
		dstCanvasCtx.drawImage(srcCanvas, px, py, width, height);
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
			} else {
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
	// for overriding by sub class
	protected createRendererIns(): IRendererInstance {
		// return new RendererInstance();
		return null;
	}
	protected rendererInsInited(): void {}
	// for overriding by sub class
	protected initThis(): void {
		// this.tickUpdate();
	}
	initialize(rparam: IRendererParam = null, renderProcessesTotal: number = 3, createNewCamera: boolean = true): IRendererScene {
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
			let rins = this.createRendererIns();

			rins.__$setStage3D(this.stage3D);
			Matrix4Pool.Allocate(rparam.getMatrix4AllocateSize());
			let camera = new CameraBase();

			rins.initialize(rparam, camera, new ShaderProgramBuilder(rins.getRCUid()));
			this.m_renderer = rins;

			this.m_transUpdater = new EntityTransUpdater();

			this.m_processids[0] = 0;
			this.m_processidsLen++;
			for (; renderProcessesTotal >= 0; ) {
				const process = this.m_renderer.appendProcess(rparam.batchEnabled, rparam.processFixedState);
				this.m_processids[this.m_processidsLen] = process.getRPIndex();
				this.m_processidsLen++;
				--renderProcessesTotal;
			}
			this.m_rcontext = this.m_renderer.getRendererContext();
			this.m_rproxy = this.m_rcontext.getRenderProxy();
			this.m_adapter = this.m_rproxy.getRenderAdapter();

			let stage3D = this.m_rproxy.getStage3D();
			this.m_viewW = stage3D.stageWidth;
			this.m_viewH = stage3D.stageHeight;
			this.m_shader = this.m_renderer.getDataBuilder().getRenderShader();
			this.textureBlock.setRenderer(this.m_rproxy);
			this.rendererInsInited();

			this.m_camDisSorter = new CameraDsistanceSorter(this.m_rproxy);
			if (this.m_rspace == null) {
				let space = new RendererSpace();
				space.initialize(this.m_renderer, this.m_rproxy.getCamera());
				this.m_rspace = space;
			}

			this.initThis();
		}
		return this;
	}
	/**
	 * @param index renderer process index in the renderer scene
	 * @param batchEnabled the value is true or false
	 * @param processFixedState the value is true or false
	 */
	setRendererProcessParam(index: number, batchEnabled: boolean, processFixedState: boolean): void {
		this.m_renderer.setRendererProcessParam(this.m_processids[index], batchEnabled, processFixedState);
	}
	/**
	 * @param batchEnabled the default value true
	 * @param processFixedState the default value false
	 */
	appendARendererProcess(batchEnabled: boolean = true, processFixedState: boolean = false): void {
		let process = this.m_renderer.appendProcess(batchEnabled, processFixedState) as RenderProcess;
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
	addContainer(container: IRenderEntityContainer, processIndex: number = 0): void {
		if (processIndex < 0) {
			processIndex = 0;
		}
		if (container != null && container.__$wuid < 0 && container.__$contId < 1) {
			let i = 0;
			for (; i < this.m_containersTotal; ++i) {
				if (this.m_containers[i] == container) {
					break;
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
		// if (container != null && container.__$wuid == this.m_uid && container.getRenderer() == this.m_renderer) {
		if (container != null && container.__$wuid == this.m_uid && container.getRenderer() == this) {
			let i = 0;

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
		this.m_autoRunEnabled = autoRunning;
	}
	setAutoRenderingSort(sortEnabled: boolean): void {
		this.m_processUpdate = sortEnabled;
	}
	setProcessSortEnabledAt(processIndex: number, sortEnabled: boolean, sorter: IRODisplaySorter = null): void {
		this.m_renderer.setProcessSortEnabledAt(processIndex, sortEnabled);
		if (sortEnabled) {
			let process = this.m_renderer.getProcessAt(processIndex);
			sorter = sorter != null ? sorter : this.m_camDisSorter;
			if (process != null) {
				process.setSorter(sorter);
			}
		}
	}
	setProcessSortEnabled(process: IRenderProcess, sortEnabled: boolean, sorter: IRODisplaySorter = null): void {
		this.m_renderer.setProcessSortEnabled(process, sortEnabled);
		if (sortEnabled && process != null && !process.hasSorter()) {
			sorter = sorter ? sorter : this.m_camDisSorter;
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
	 * @param entity IRenderEntityBase instance(for example: DisplayEntity class instance)
	 * @param processid this destination renderer process id
	 * @param deferred if the value is true,the entity will not to be immediately add to the renderer process by its id
	 */
	addEntity(entity: IRenderEntityBase, processid: number = 0, deferred: boolean = true): void {
		if (entity) {
			// console.log("add entity into the renderer scene A0.");
			if (entity.getREType() < 12) {
				let re = entity as IRenderEntity;
				if (re != null && re.__$testSpaceEnabled()) {
					// console.log("add entity into the renderer scene A1.");
					if (re.isPolyhedral()) {
						// console.log("add entity into the renderer scene A2.");
						if (re.hasMesh()) {
							// console.log("add entity into the renderer scene.");
							re.getTransform().setUpdater(this.m_transUpdater);
							this.m_renderer.addEntity(re, this.m_processids[processid], deferred);
							if (this.m_rspace != null) {
								this.m_rspace.addEntity(re);
							}
						} else {
							// 这里的等待队列可能会和加入容器的操作冲突
							// wait queue
							// if (this.m_nodeWaitLinker == null) {
							// 	this.m_nodeWaitLinker = new Entity3DNodeLinker();
							// 	this.m_nodeWaitQueue = new EntityNodeQueue();
							// }
							// let node = this.m_nodeWaitQueue.addEntity(re);
							// node.rstatus = processid;
							// this.m_nodeWaitLinker.addNode(node);

							this.m_entityFence.addEntity(re, processid);
						}
					} else {
						// console.log("add entity into the renderer scene A3.");
						re.getTransform().setUpdater(this.m_transUpdater);
						this.m_renderer.addEntity(re, this.m_processids[processid], deferred);
						if (this.m_rspace != null) {
							this.m_rspace.addEntity(re);
						}
					}
				}
			} else {
				let re = entity as IRenderEntityContainer;
				this.addContainer(re, processid);
			}
		}
	}
	/**
	 * remove an entity from the rendererinstance
	 * @param entity IRenderEntityBase instance(for example: DisplayEntity class instance)
	 */
	removeEntity(entity: IRenderEntityBase): void {
		if (entity) {
			if (entity.getREType() < 12) {
				// let node: Entity3DNode = null;
				// if (this.m_nodeWaitLinker != null) {
				// 	node = this.m_nodeWaitQueue.getNodeByEntity(re);
				// 	if (node != null) {
				// 		re.getTransform().setUpdater(null);
				// 		this.m_nodeWaitLinker.removeNode(node);
				// 		this.m_nodeWaitQueue.removeEntity(re);
				// 	}
				// }
				// if (node == null) {

				let re = entity as IRenderEntity;
				const flag = this.m_entityFence.removeEntity(re);
				if (!flag) {
					this.m_renderer.removeEntity(re);
					re.getTransform().setUpdater(null);
					if (this.m_rspace != null) {
						this.m_rspace.removeEntity(re);
					}
				}
			} else {
				let re = entity as IRenderEntityContainer;
				this.removeContainer(re);
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
	useCamera(camera: CameraBase, syncCamView: boolean = false): void {
		this.m_currCamera = camera;
		if (syncCamView) {
			this.m_rproxy.setRCViewPort(camera.getViewX(), camera.getViewY(), camera.getViewWidth(), camera.getViewHeight(), true);
			this.m_rproxy.reseizeRCViewPort();
		}
		camera.update();

		this.m_rcontext.resetUniform();
		this.m_rproxy.updateCameraDataFromCamera(camera);
	}
	useMainCamera(): void {
		this.m_currCamera = null;
		let camera: IRenderCamera = this.m_rproxy.getCamera();
		this.m_rproxy.setRCViewPort(camera.getViewX(), camera.getViewY(), camera.getViewWidth(), camera.getViewHeight(), true);
		this.m_rproxy.reseizeRCViewPort();
		this.m_rproxy.updateCamera();
		this.m_rcontext.resetUniform();
		this.m_rproxy.updateCameraDataFromCamera(this.m_rproxy.getCamera());
	}
	updateCameraDataFromCamera(camera: CameraBase): void {
		this.m_rproxy.updateCameraDataFromCamera(camera);
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
		this.m_rproxy.enableSynViewAndStage();
	}
	/**
	 * the function only resets the renderer instance rendering status.
	 * you should use it before the run or runAt function is called.
	 */
	renderBegin(contextBeginEnabled: boolean = true): void {
		const ry = this.m_rproxy;
		if (this.m_currCamera == null) {
			this.m_adapter.unlockViewport();

			if (ry.isAutoSynViewAndStage()) {
				let boo = ry.testViewPortChanged(this.m_viewX, this.m_viewY, this.m_viewW, this.m_viewH);
				this.m_viewX = ry.getViewX();
				this.m_viewY = ry.getViewY();
				this.m_viewW = ry.getViewWidth();
				this.m_viewH = ry.getViewHeight();

				if (boo) {
					ry.setRCViewPort(this.m_viewX, this.m_viewY, this.m_viewW, this.m_viewH, true);
					ry.reseizeRCViewPort();
				}
			} else {
				ry.setViewPort(this.m_viewX, this.m_viewY, this.m_viewW, this.m_viewH);
			}
			ry.updateCamera();
			ry.updateCameraDataFromCamera(ry.getCamera());
		}

		this.m_shader.renderBegin();
		if (contextBeginEnabled) {
			// if(this.m_clearColorFlag) {
			//     ry.setClearColor(this.m_clearColor);
			// }
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
	 * @param autoCycle the default value is true
	 * @param contextBeginEnabled the default value is true
	 */
	runBegin(autoCycle: boolean = true, contextBeginEnabled: boolean = true): void {
		if (autoCycle && this.m_autoRunEnabled) {
			if (this.m_runFlag >= 0) this.runEnd();
			this.m_runFlag = 0;
		}

		let cam = this.m_currCamera;
		let camFlag = cam == null;
		this.renderBegin(contextBeginEnabled);

		if (this.m_rspace) {
			this.m_rspace.setCamera(camFlag ? this.m_rproxy.getCamera() : cam);
			this.m_rspace.runBegin();
		}
	}
	renderContextBegin(): void {
		this.m_rcontext.renderBegin();
	}

	private m_mouseTestBoo = true;
	private m_cullingTestBoo = true;
	private m_rayTestFlag = true;
	private m_rayTestEnabled = true;

	setRayTestEnabled(enabled: boolean): void {
		this.m_rayTestEnabled = enabled;
	}
	/**
	 *
	 * @param evtFlowPhase its value is 0(none phase),1(capture phase),2(bubble phase)
	 * @param status its vaule is 1(default process),1(deselect ray pick target)
	 * @returns 1 is send evt yes,0 is send evt no,-1 is event nothing
	 */
	runMouseTest(evtFlowPhase: number, status: number): number {
		let flag: number = -1;
		if (this.m_evt3DCtr != null && this.m_mouseEvtEnabled) {
			if (this.m_rayTestFlag && this.m_evt3DCtr.getEvtType() > 0) {
				// 是否对已经获得的拾取列表做进一步的gpu拾取
				// if (this.m_uid > 1000) {
				//     console.log("sub sc runMouseTest...", this.m_rayTestFlag, this.m_evt3DCtr.getEvtType());
				// }

				let selector = this.m_rspace.getRaySelector();
				if (selector) {
					if (this.m_rayTestEnabled) {
						this.mouseRayTest();
					} else {
						selector.clear();
					}
					// 如果有gpu拾取则进入这个管理器, 这个管理器得到最终的拾取结果再和前面的计算结果做比较
					let total = selector.getSelectedNodesTotal();
					if (total > 1) {
						let i = 0;
						let list = selector.getSelectedNodes();
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

	/**
	 * update all data or status of the renderer runtime
	 * should call this function per frame
	 */
	update(autoCycle: boolean = true, mouseEventEnabled: boolean = true): void {
		// if (this.m_runner) {
		//     this.m_runner();
		// }
		// this.stage3D.enterFrame();
		const st = this.m_currStage3D;
		if (st != null) {
			st.enterFrame();
			this.updateCamera();
		}
		if (autoCycle && this.m_autoRunEnabled) {
			if (this.m_runFlag != 0) this.runBegin();
			this.m_runFlag = 1;
		}

		// camera visible test, ray cast test, Occlusion Culling test

		this.m_mouseTestBoo = true;
		this.m_cullingTestBoo = true;
		this.m_rayTestFlag = true;

		// wait mesh data ready to finish
		// if (this.m_nodeWaitLinker != null) {
		// 	let nextNode: Entity3DNode = this.m_nodeWaitLinker.getBegin();
		// 	if (nextNode != null) {
		// 		let pnode: Entity3DNode;
		// 		let status: number;
		// 		while (nextNode) {
		// 			if (nextNode.entity.hasMesh()) {
		// 				pnode = nextNode;
		// 				nextNode = nextNode.next;
		// 				const entity = pnode.entity;
		// 				status = pnode.rstatus;
		// 				this.m_nodeWaitLinker.removeNode(pnode);
		// 				this.m_nodeWaitQueue.removeEntity(pnode.entity);
		// 				//console.log("RenderScene::update(), ready a mesh data that was finished.");
		// 				this.addEntity(entity, status);
		// 			} else {
		// 				nextNode = nextNode.next;
		// 			}
		// 		}
		// 	}
		// }

		this.m_transUpdater.update();

		let i = 0;
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
					this.m_rproxy.status.povNumber = this.m_rspace.getPOVNumber();
				}
			}
		}
		if (this.m_processUpdate) {
			// this.m_renderer.updateAllProcess();
			if (this.m_localRunning) {
				for (let i = 0; i < this.m_processidsLen; ++i) {
					this.m_renderer.updateProcessAt(this.m_processids[i]);
				}
			} else {
				this.m_renderer.updateAllProcess();
			}
		}
		if (this.m_mouseTestBoo && !this.m_evtFlowEnabled) {
			if (mouseEventEnabled) {
				this.runMouseTest(1, 0);
			} else if (this.m_evt3DCtr != null) {
				this.m_evt3DCtr.mouseOutEventTarget();
			}
		}
		this.runnableQueue.run();
	}
	// 运行渲染可见性裁剪测试，射线检测等空间管理机制
	cullingTest(): void {
		if (this.m_rspace != null) {
			this.m_rspace.run();
			this.m_rproxy.status.povNumber = this.m_rspace.getPOVNumber();
		}
		this.m_cullingTestBoo = false;
	}
	// 鼠标位置的射线拾取测试
	mouseRayTest(): void {
		if (this.m_rspace != null) {
			// this.m_rproxy.getMouseXYWorldRay(this.m_mouse_rlpv, this.m_mouse_rltv);
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
			if (this.m_appendNodes == null) this.m_appendNodes = [];
			const ls = this.m_appendNodes;
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
			const ls = this.m_prependNodes;
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
	setProcessEnabledAt(i: number, enabled: boolean): void {
		if (i >= 0 && i < this.m_processids.length) {
			this.m_renderer.setProcessEnabledAt(this.m_processids[i], enabled);
			this.m_penableds[i] = enabled;
		}
	}
	/**
	 * run all renderer processes in the renderer instance
	 * @param autoCycle the default value is true
	 */
	run(autoCycle: boolean = true): void {
		if (this.m_enabled) {
			let runFlag = autoCycle;
			if (autoCycle && this.m_autoRunEnabled) {
				if (this.m_runFlag != 1) {
					this.update();
					runFlag = false;
				}
				this.m_runFlag = 2;
			}
			if (runFlag) {
				this.runnableQueue.run();
			}
			this.runRenderNodes(this.m_prependNodes);

			if (this.m_adapter.isFBORunning()) {
				this.setRenderToBackBuffer();
			}
			for (let i = 0; i < this.m_processidsLen; ++i) {
				if (this.m_penableds[i]) {
					this.m_renderer.runAt(this.m_processids[i]);
				}
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
	protected contextRunEnd(): void {
		//this.m_rcontext.runEnd();
	}
	runEnd(): void {
		if (this.m_evt3DCtr != null) {
			this.m_evt3DCtr.runEnd();
		}
		// if(this.m_localRunning) {
		// this.m_rcontext.runEnd();
		// }
		this.contextRunEnd();

		if (this.m_rspace != null) {
			this.m_rspace.runEnd();
		}
		if (this.m_autoRunEnabled) {
			this.m_runFlag = -1;
		}
		if (this.m_accessor != null) {
			this.m_accessor.renderEnd(this);
		}
	}
	render(): void {}
	renderFlush(): void {
		if (this.m_rproxy != null) {
			this.m_rproxy.flush();
		}
	}
	updateCamera(): void {
		if (this.m_rproxy != null) {
			this.m_rproxy.updateCamera();
		}
	}
	destroy(): void {
		this.runnableQueue.destroy();
		this.m_transUpdater.destroy();
	}
	setAutoRunning(auto: boolean): RendererSceneBase {
		return this;
	}
	isAutoRunning(): boolean {
		return false;
	}
}
