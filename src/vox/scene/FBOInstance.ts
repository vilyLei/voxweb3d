/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import RenderFilter from "../../vox/render/RenderFilter";
import RenderMaskBitfield from "../../vox/render/RenderMaskBitfield";
import TextureConst from "../../vox/texture/TextureConst";
import TextureDataType from "../../vox/texture/TextureDataType";
import TextureFormat from "../../vox/texture/TextureFormat";
import { IRTTTexture } from "../../vox/render/texture/IRTTTexture";
import { IRTTTextureStore } from "../../vox/texture/IRTTTextureStore";
import Color4 from "../../vox/material/Color4";

import IRenderStage3D from "../../vox/render/IRenderStage3D";
import { IRenderCamera } from "../../vox/render/IRenderCamera";
import FrameBufferType from "../../vox/render/FrameBufferType";
import { IRenderAdapter } from "../../vox/render/IRenderAdapter";
import IRenderProxy from "../../vox/render/IRenderProxy";
import IRenderTexture from "../../vox/render/texture/IRenderTexture";
import IRenderMaterial from "../../vox/render/IRenderMaterial";
import IRenderEntity from "../../vox/render/IRenderEntity";
import IRenderer from "../../vox/scene/IRenderer";
import IRenderProcess from "../../vox/render/IRenderProcess";
import { IRendererInstanceContext } from "./IRendererInstanceContext";
import RendererState from "../render/RendererState";
import { IFBOInstance } from "./IFBOInstance";
import DebugFlag from "../debug/DebugFlag";

export default class FBOInstance implements IFBOInstance {
	private m_backBufferColor = new Color4();
	private m_adapter: IRenderAdapter = null;
	private m_rproxy: IRenderProxy = null;

	private m_rcontext: IRendererInstanceContext = null;
	private m_bgColor = new Color4();
	private m_renderer: IRenderer = null;
	private m_runFlag = true;
	private m_fboIndex = -1;
	private m_fboType = -1;
	private m_initW = 128;
	private m_initH = 128;
	private m_enableDepth = true;
	private m_enableStencil = false;
	private m_multisampleLevel = 0;
	private m_gMateiral: IRenderMaterial = null;
	private m_gRState = -1;
	private m_gRColorMask = -1;
	private m_processShared = true;
	private m_rindexs: number[] = [];
	private m_texs: IRenderTexture[] = [null, null, null, null, null, null, null, null];
	private m_texStore: IRTTTextureStore = null;
	private m_texsTot = 0;
	private m_synFBOSizeWithViewport = true;
	private m_fboSizeFactor = 1.0;
	private m_clearDepth = 256.0;
	private m_clearColorBoo = true;
	private m_clearDepthBoo = true;
	private m_clearStencilBoo = false;
	private m_viewportLock = false;
	private m_texUnlock = false;
	private m_tmaterialUniformUpdate = false;
	/**
	 * unique name string
	 */
	uns = "FBOInstance";

	constructor(renderer: IRenderer) {
		this.m_renderer = renderer;
		this.m_texStore = renderer.textureBlock.getRTTStrore();
		this.m_rproxy = renderer.getRenderProxy();
		this.m_adapter = this.m_rproxy.getRenderAdapter();
		this.m_rcontext = renderer.getRendererContext();
	}
	/**
	 * @returns 获取当前FBOInstance所持有的 FBO 对象的 unique id (也就是序号)
	 */
	getFBOUid(): number {
		return this.m_fboIndex;
	}
	/**
	 * 设置当前 FBO控制的渲染过程中所需要的 renderer process 序号(id)列表
	 * @param processIDlist 当前渲染器场景中渲染process的序号列表
	 * @param processShared 是否共享process，默认值为true，则表示fbo和renderer scene都会绘制调用
	 */
	setRProcessIDList(processIDlist: number[], processShared: boolean = true): void {
		this.m_processShared = processShared;
		if (processIDlist != null) {
			if (processIDlist.length < 1) {
				throw Error("processIDlist.length < 1, but it must: processIDlist.length >= 1");
			}
			this.m_rindexs = processIDlist.slice(0);
		}
	}
	/**
	 * 设置当前 FBO控制的渲染过程中所需要的 renderer process 序号(id)列表
	 */
	setRProcessList(list: IRenderProcess[]): void {
		if (list.length < 1) {
			throw Error("list.length < 1, but must: list.length >= 1");
		}
		this.m_rindexs = new Array(list.length);
		for (let i = 0; i < list.length; ++i) {
			this.m_rindexs[i] = list[i].getRPIndex();
		}
	}
	getRProcessIDAt(i: number): number {
		return this.m_rindexs[i];
	}
	getStage3D(): IRenderStage3D {
		return this.m_rproxy.getStage3D();
	}
	getCamera(): IRenderCamera {
		if (this.m_rproxy != null) {
			return this.m_rproxy.getCamera();
		}
		return null;
	}
	lockViewport(): void {
		this.m_viewportLock = true;
	}
	unlockViewport(): void {
		this.m_viewportLock = false;
	}
	updateCamera(): void {
		if (this.m_rproxy != null) {
			this.m_rproxy.updateCamera();
		}
	}
	updateCameraDataFromCamera(cam: IRenderCamera): void {
		if (this.m_rproxy != null) {
			this.m_rproxy.updateCameraDataFromCamera(cam);
		}
	}
	////////////////////////////////////////////////////// render state conctrl
	useGlobalRenderState(state: number): void {
		this.m_rcontext.useGlobalRenderState(state);
	}
	useGlobalRenderStateByName(stateNS: string): void {
		this.m_rcontext.useGlobalRenderStateByName(stateNS);
	}
	setGlobalRenderState(state: number): void {
		this.m_gRState = state;
	}
	setGlobalRenderStateByName(stateNS: string): void {
		this.m_gRState = this.m_rcontext.getRenderStateByName(stateNS);
	}
	lockRenderState(state: number = -1): void {
		if (this.m_gRState >= 0 || state >= 0) {
			this.m_rcontext.useGlobalRenderState(state < 0 ? this.m_gRState : state);
		} else {
			this.m_rproxy.lockRenderState();
		}
	}
	unlockRenderState(): void {
		this.m_rproxy.unlockRenderState();
	}

	////////////////////////////////////////////////////// render color mask conctrl
	useGlobalRenderColorMask(colorMask: number): void {
		this.m_rcontext.useGlobalRenderColorMask(colorMask);
	}
	useGlobalRenderColorMaskByName(colorMaskNS: string): void {
		this.m_rcontext.useGlobalRenderColorMaskByName(colorMaskNS);
	}
	setGlobalRenderColorMask(colorMask: number): void {
		this.m_gRColorMask = colorMask;
	}
	setGlobalRenderColorMaskByName(colorMaskNS: string): void {
		this.m_gRColorMask = this.m_rcontext.getRenderColorMaskByName(colorMaskNS);
	}
	lockColorMask(colorMask: number = -1): void {
		if (this.m_gRColorMask >= 0 || colorMask >= 0) {
			this.m_rcontext.useGlobalRenderColorMask(colorMask < 0 ? this.m_gRColorMask : colorMask);
		} else {
			this.m_rproxy.lockRenderColorMask();
		}
	}
	unlockRenderColorMask(): void {
		this.m_rcontext.useGlobalRenderColorMask(RendererState.COLOR_MASK_ALL_TRUE);
		this.m_rproxy.unlockRenderColorMask();
	}

	////////////////////////////////////////////////////// material conctrl
	useGlobalMaterial(m: IRenderMaterial, texUnlock: boolean = false, materialUniformUpdate: boolean = false): void {
		this.m_texUnlock = texUnlock;
		this.m_tmaterialUniformUpdate = materialUniformUpdate;
		this.m_rcontext.useGlobalMaterial(m, this.m_texUnlock, materialUniformUpdate);
	}
	/**
	 *
	 * @param material MaterialBase 子类的实例
	 * @param texUnlock 是否锁定并使用 material 自身所带的纹理数据
	 */
	setGlobalMaterial(material: IRenderMaterial, texUnlock: boolean = false, materialUniformUpdate: boolean = false): void {
		this.m_texUnlock = texUnlock;
		this.m_tmaterialUniformUpdate = materialUniformUpdate;
		if (this.m_gMateiral != material) {
			if (this.m_gMateiral != null) {
				this.m_gMateiral.__$detachThis();
			}
			if (material != null) {
				material.__$attachThis();
			}
			this.m_gMateiral = material;
		}
	}
	lockMaterial(): void {
		if (this.m_gMateiral != null) {
			this.m_rcontext.useGlobalMaterial(this.m_gMateiral, this.m_texUnlock, this.m_tmaterialUniformUpdate);
		} else {
			this.m_rcontext.lockMaterial();
		}
	}
	unlockMaterial(): void {
		this.m_rcontext.unlockMaterial();
	}

	updateGlobalMaterialUniform(): void {
		this.m_rcontext.updateMaterialUniform(this.m_gMateiral);
	}
	clearDepth(clearDepth: number = 1.0): void {
		this.m_adapter.clearFBODepthAt(this.m_fboIndex, clearDepth);
	}

	synFBOSizeWithViewport(): void {
		this.m_synFBOSizeWithViewport = true;
	}
	asynFBOSizeWithViewport(): void {
		this.m_synFBOSizeWithViewport = false;
	}
	// if synFBOSizeWithViewport is true, fbo size = factor * view port size;
	setFBOSizeFactorWithViewPort(factor: number): void {
		this.m_fboSizeFactor = factor;
	}

	createViewportSizeFBOAt(fboIndex: number, enableDepth: boolean = false, enableStencil: boolean = false, multisampleLevel: number = 0): void {
		if (this.m_fboIndex < 0) {
			this.m_fboIndex = fboIndex;
			this.m_fboType = FrameBufferType.FRAMEBUFFER;
			this.m_initW = this.m_adapter.getViewportWidth();
			this.m_initH = this.m_adapter.getViewportHeight();
			this.m_enableDepth = enableDepth;
			this.m_enableStencil = enableStencil;
			this.m_multisampleLevel = multisampleLevel;
			this.m_adapter.createFBOAt(fboIndex, this.m_fboType, this.m_initW, this.m_initH, enableDepth, enableStencil, multisampleLevel);
		}
	}
	private createFBO(enableDepth: boolean, enableStencil: boolean, multisampleLevel: number = 0): void {
		this.m_enableDepth = enableDepth;
		this.m_enableStencil = enableStencil;
		this.m_multisampleLevel = multisampleLevel;
		this.m_adapter.createFBOAt(this.m_fboIndex, this.m_fboType, this.m_initW, this.m_initH, enableDepth, enableStencil, multisampleLevel);
	}
	/**
	 * 创建一个指定序号的 FBO(FrameBufferObject) 渲染运行时管理对象,
	 * renderer中一个序号只会对应一个唯一的 FBO 对象实例
	 * @param fboIndex FBO 对象的序号
	 * @param enableDepth FBO 对象的depth读写是否开启
	 * @param enableStencil FBO 对象的stencil读写是否开启
	 * @param multisampleLevel FBO 对象的multisample level
	 */
	createAutoSizeFBOAt(fboIndex: number, enableDepth: boolean = false, enableStencil: boolean = false, multisampleLevel: number = 0): void {
		if (fboIndex >= 0 && this.m_fboIndex < 0) {
			this.m_fboType = FrameBufferType.FRAMEBUFFER;
			this.m_initW = 512;
			this.m_initH = 512;
			this.m_fboIndex = fboIndex;
			this.createFBO(enableDepth, enableStencil, multisampleLevel);
		}
	}
	/**
	 * 创建一个指定序号的 FBO(FrameBufferObject) 渲染运行时管理对象,
	 * renderer中一个序号只会对应一个唯一的 FBO 对象实例
	 * @param fboIndex FBO 对象的序号
	 * @param width FBO 对象的viewport width, if width < 1, viewport width is stage width;
	 * @param height FBO 对象的viewport height, if height < 1, viewport width is stage height;
	 * @param enableDepth FBO 对象的depth读写是否开启, the default value is true
	 * @param enableStencil FBO 对象的stencil读写是否开启, the default value is false
	 * @param multisampleLevel FBO 对象的multisample level, the default value is 0
	 */
	createFBOAt(
		fboIndex: number,
		width: number,
		height: number,
		enableDepth: boolean = true,
		enableStencil: boolean = false,
		multisampleLevel: number = 0
	): void {
		if (fboIndex >= 0 && this.m_fboIndex < 0) {
			this.m_fboType = FrameBufferType.FRAMEBUFFER;
			this.m_initW = width;
			this.m_initH = height;
			this.m_fboIndex = fboIndex;
			if (this.m_initW < 1) this.m_initW = this.m_adapter.getRCanvasWidth();
			if (this.m_initH < 1) this.m_initH = this.m_adapter.getRCanvasHeight();
			this.createFBO(enableDepth, enableStencil, multisampleLevel);
		}
	}

	/**
	 * 创建一个指定序号的 read FBO(FrameBufferObject) 渲染运行时管理对象,
	 * renderer中一个序号只会对应一个唯一的 FBO 对象实例
	 * @param fboIndex FBO 对象的序号
	 * @param width FBO 对象的viewport width, if width < 1, viewport width is stage width;
	 * @param height FBO 对象的viewport height, if height < 1, viewport width is stage height;
	 * @param enableDepth FBO 对象的depth读写是否开启, the default value is true
	 * @param enableStencil FBO 对象的stencil读写是否开启, the default value is false
	 * @param multisampleLevel FBO 对象的multisample level, the default value is 0
	 */
	createReadFBOAt(
		fboIndex: number,
		width: number,
		height: number,
		enableDepth: boolean = false,
		enableStencil: boolean = false,
		multisampleLevel: number = 0
	): void {
		if (fboIndex >= 0 && this.m_fboIndex < 0) {
			this.m_fboType = FrameBufferType.READ_FRAMEBUFFER;
			this.m_initW = width;
			this.m_initH = height;
			this.m_fboIndex = fboIndex;
			if (this.m_initW < 1) this.m_initW = this.m_adapter.getRCanvasWidth();
			if (this.m_initH < 1) this.m_initH = this.m_adapter.getRCanvasHeight();
			this.createFBO(enableDepth, enableStencil, multisampleLevel);
		}
	}
	/**
	 * 创建一个指定序号的 draw FBO(FrameBufferObject) 渲染运行时管理对象,
	 * renderer中一个序号只会对应一个唯一的 FBO 对象实例
	 * @param fboIndex FBO 对象的序号
	 * @param width FBO 对象的viewport width, if width < 1, viewport width is stage width;
	 * @param height FBO 对象的viewport height, if height < 1, viewport width is stage height;
	 * @param enableDepth FBO 对象的depth读写是否开启, the default value is true
	 * @param enableStencil FBO 对象的stencil读写是否开启, the default value is false
	 * @param multisampleLevel FBO 对象的multisample level, the default value is 0
	 */
	createDrawFBOAt(
		fboIndex: number,
		width: number,
		height: number,
		enableDepth: boolean = false,
		enableStencil: boolean = false,
		multisampleLevel: number = 0
	): void {
		if (fboIndex >= 0 && this.m_fboIndex < 0) {
			this.m_fboType = FrameBufferType.DRAW_FRAMEBUFFER;
			this.m_initW = width;
			this.m_initH = height;
			this.m_fboIndex = fboIndex;
			if (this.m_initW < 1) this.m_initW = this.m_adapter.getRCanvasWidth();
			if (this.m_initH < 1) this.m_initH = this.m_adapter.getRCanvasHeight();
			this.createFBO(enableDepth, enableStencil, multisampleLevel);
		}
	}

	resizeFBO(fboBufferWidth: number, fboBufferHeight: number): void {
		if (this.m_initW != fboBufferWidth || this.m_initH != fboBufferHeight) {
			this.m_initW = fboBufferWidth;
			this.m_initH = fboBufferHeight;
			this.m_adapter.resizeFBOAt(this.m_fboIndex, fboBufferWidth, fboBufferHeight);
		}
	}
	/**
	 * @returns get framebuffer output attachment texture by attachment index
	 */
	getRTTAt(i: number): IRTTTexture {
		return this.m_texs[i] as IRTTTexture;
	}
	enableMipmapRTTAt(i: number): void {
		this.m_texs[i].enableMipmap();
	}
	generateMipmapTextureAt(i: number): void {
		this.m_texs[i].generateMipmap(this.m_rproxy.Texture);
	}
	/**
	 * 设置渲染到纹理的目标纹理对象(可由用自行创建)和framebuffer output attachment index
	 * @param rttTexProxy 作为渲染到目标的目标纹理对象
	 * @param outputIndex framebuffer output attachment index
	 */
	setRenderToTexture(texture: IRTTTexture, outputIndex: number = 0): IRTTTexture {
		if (outputIndex == 0) {
			this.m_texsTot = 1;
		} else if (this.m_texsTot < outputIndex + 1) {
			this.m_texsTot = outputIndex + 1;
		}
		this.m_texs[outputIndex] = texture;
		return texture;
	}

	/**
	 * 设置渲染到纹理的目标纹理对象(普通 RTT 纹理类型的目标纹理)和framebuffer output attachment index
	 * @param systemRTTTexIndex 作为渲染到目标的目标纹理对象在系统普通rtt 纹理中的序号(0 -> 15)
	 * @param outputIndex framebuffer output attachment index, the default value is 0
	 */
	setRenderToRTTTextureAt(systemRTTTexIndex: number, outputIndex: number = 0): void {
		this.setRenderToTexture(this.m_texStore.getRTTTextureAt(systemRTTTexIndex), outputIndex);
	}
	/**
	 * 设置渲染到纹理的目标纹理对象(cube RTT 纹理类型的目标纹理)和framebuffer output attachment index
	 * @param systemCubeRTTTexIndex 作为渲染到目标的目标纹理对象在系统cube rtt 纹理中的序号(0 -> 15)
	 * @param outputIndex framebuffer output attachment index, the default value is 0
	 */
	setRenderToCubeRTTTextureAt(systemCubeRTTTexIndex: number, outputIndex: number = 0): void {
		this.asynFBOSizeWithViewport();
		const cubeMap = this.m_texStore.getCubeRTTTextureAt(systemCubeRTTTexIndex);
		this.setRenderToTexture(cubeMap, outputIndex);
	}
	/**
	 * 设置渲染到纹理的目标纹理对象(Float RTT 纹理类型的目标纹理)和framebuffer output attachment index
	 * @param systemFloatRTTTexIndex 作为渲染到目标的目标纹理对象在系统float rtt 纹理中的序号(0 -> 15)
	 * @param outputIndex framebuffer output attachment index
	 */
	setRenderToFloatTextureAt(systemFloatRTTTexIndex: number, outputIndex: number = 0): void {
		this.setRenderToTexture(this.m_texStore.getRTTFloatTextureAt(systemFloatRTTTexIndex), outputIndex);
	}
	/**
	 * 设置渲染到纹理的目标纹理对象(half Float RTT 纹理类型的目标纹理)和framebuffer output attachment index
	 * @param systemFloatRTTTexIndex 作为渲染到目标的目标纹理对象在系统float rtt 纹理中的序号(0 -> 15)
	 * @param outputIndex framebuffer output attachment index
	 */
	setRenderToHalfFloatTexture(texture: IRTTTexture, outputIndex: number = 0): IRTTTexture {
		if (texture == null) {
			texture = this.m_texStore.createRTTTex2D(128, 128, false);
			texture.__$setRenderProxy(this.m_rproxy);
			texture.internalFormat = TextureFormat.RGBA16F;
			texture.srcFormat = TextureFormat.RGBA;
			texture.dataType = TextureDataType.FLOAT;
			texture.minFilter = TextureConst.LINEAR;
			texture.magFilter = TextureConst.LINEAR;
			texture.__$setRenderProxy(this.m_rproxy);
		}
		return this.setRenderToTexture(texture, outputIndex);
	}
	/**
	 * 设置渲染到纹理的目标纹理对象(RGBA RTT 纹理类型的目标纹理)和framebuffer output attachment index
	 * @param systemFloatRTTTexIndex 作为渲染到目标的目标纹理对象在系统float rtt 纹理中的序号(0 -> 15)
	 * @param outputIndex framebuffer output attachment index
	 */
	setRenderToRGBATexture(texture: IRTTTexture, outputIndex: number = 0): IRTTTexture {
		if (texture == null) texture = this.createRGBATexture();
		return this.setRenderToTexture(texture, outputIndex);
	}
	/**
	 * 设置渲染到纹理的目标纹理对象(depth RTT 纹理类型的目标纹理)和framebuffer output attachment index
	 * @param systemDepthRTTTexIndex 作为渲染到目标的目标纹理对象在系统depth rtt 纹理中的序号(0 -> 15)
	 * @param outputIndex framebuffer output attachment index
	 */
	setRenderToDepthTextureAt(systemDepthRTTTexIndex: number, outputIndex: number = 0): IRTTTexture {
		return this.setRenderToTexture(this.m_texStore.getDepthTextureAt(systemDepthRTTTexIndex), outputIndex);
	}
	createRGBATexture(): IRTTTexture {
		let texture = this.m_texStore.createRTTTex2D(32, 32, false);
		texture.internalFormat = TextureFormat.RGBA;
		texture.srcFormat = TextureFormat.RGBA;
		texture.dataType = TextureDataType.UNSIGNED_BYTE;
		texture.minFilter = TextureConst.LINEAR;
		texture.magFilter = TextureConst.LINEAR;
		texture.__$setRenderProxy(this.m_rproxy);
		return texture;
	}
	setClearState(clearColorBoo: boolean = true, clearDepthBoo: boolean = true, clearStencilBoo: boolean = false): void {
		this.m_clearColorBoo = clearColorBoo;
		this.m_clearDepthBoo = clearDepthBoo;
		this.m_clearStencilBoo = clearStencilBoo;
	}
	setRenderToBackBuffer(): void {
		this.m_rproxy.setClearColor(this.m_backBufferColor);
		this.m_rcontext.setRenderToBackBuffer();
	}
	setClearDepth(depth: number): void {
		this.m_clearDepth = depth;
	}
	getClearDepth(): number {
		return this.m_adapter.getClearDepth();
	}
	getViewportX(): number {
		return this.m_adapter.getViewportX();
	}
	getViewportY(): number {
		return this.m_adapter.getViewportY();
	}
	getViewportWidth(): number {
		return this.m_adapter.getViewportWidth();
	}
	getViewportHeight(): number {
		return this.m_adapter.getViewportHeight();
	}
	getFBOWidth(): number {
		return this.m_adapter.getFBOWidthAt(this.m_fboIndex);
	}
	getFBOHeight(): number {
		return this.m_adapter.getFBOHeightAt(this.m_fboIndex);
	}

	resetAttachmentMask(boo: boolean): void {
		this.m_adapter.resetFBOAttachmentMask(boo);
	}
	setAttachmentMaskAt(index: number, boo: boolean): void {
		this.m_adapter.setFBOAttachmentMaskAt(index, boo);
	}

	setClearRGBColor3f(pr: number, pg: number, pb: number): void {
		this.m_bgColor.setRGB3f(pr, pg, pb);
	}
	setClearColorEnabled(boo: boolean): void {
		this.m_clearColorBoo = boo;
	}
	setClearDepthEnabled(boo: boolean): void {
		this.m_clearDepthBoo = boo;
	}
	setClearStencilEnabled(boo: boolean): void {
		this.m_clearStencilBoo = boo;
	}

	setClearUint24Color(colorUint24: number, alpha: number = 1.0): void {
		this.m_bgColor.setRGBUint24(colorUint24);
		this.m_bgColor.a = alpha;
	}
	setClearRGBAColor4f(pr: number, pg: number, pb: number, pa: number): void {
		this.m_bgColor.setRGBA4f(pr, pg, pb, pa);
	}
	/**
	 * @param			clearType, it is IRenderProxy.COLOR or IRenderProxy.DEPTH or IRenderProxy.STENCIL or IRenderProxy.DEPTH_STENCIL
	 */
	blitFrom(
		fboIns: FBOInstance,
		mask_bitfiled: number = RenderMaskBitfield.COLOR_BUFFER_BIT,
		filter: number = RenderFilter.NEAREST,
		clearType: number = -1,
		clearIndex: number = 0,
		dataArr: number[] = null
	): void {
		if (this.m_fboIndex >= 0) {
			this.m_adapter.setBlitFboSrcRect(0, 0, fboIns.getFBOWidth(), fboIns.getFBOHeight());
			this.m_adapter.setBlitFboSrcRect(0, 0, this.getFBOWidth(), this.getFBOHeight());
			this.m_adapter.blitFBO(fboIns.getFBOUid(), this.m_fboIndex, mask_bitfiled, filter, clearType, clearIndex, dataArr);
		}
	}
	blitColorFrom(
		fboIns: FBOInstance,
		filter: number = RenderFilter.NEAREST,
		clearType: number = -1,
		clearIndex: number = 0,
		dataArr: number[] = null
	): void {
		if (this.m_fboIndex >= 0) {
			this.m_adapter.setBlitFboSrcRect(0, 0, fboIns.getFBOWidth(), fboIns.getFBOHeight());
			this.m_adapter.setBlitFboSrcRect(0, 0, this.getFBOWidth(), this.getFBOHeight());
			this.m_adapter.blitFBO(fboIns.getFBOUid(), this.m_fboIndex, RenderMaskBitfield.COLOR_BUFFER_BIT, filter, clearType, clearIndex, dataArr);
		}
	}
	blitDepthFrom(
		fboIns: FBOInstance,
		filter: number = RenderFilter.NEAREST,
		clearType: number = -1,
		clearIndex: number = 0,
		dataArr: number[] = null
	): void {
		if (this.m_fboIndex >= 0) {
			this.m_adapter.setBlitFboSrcRect(0, 0, fboIns.getFBOWidth(), fboIns.getFBOHeight());
			this.m_adapter.setBlitFboSrcRect(0, 0, this.getFBOWidth(), this.getFBOHeight());
			this.m_adapter.blitFBO(
				fboIns.getFBOUid(),
				this.m_fboIndex,
				RenderMaskBitfield.COLOR_BUFFER_BIT | RenderMaskBitfield.DEPTH_BUFFER_BIT,
				filter,
				clearType,
				clearIndex,
				dataArr
			);
		}
	}
	blitColorAndDepthFrom(
		fboIns: FBOInstance,
		filter: number = RenderFilter.NEAREST,
		clearType: number = -1,
		clearIndex: number = 0,
		dataArr: number[] = null
	): void {
		if (this.m_fboIndex >= 0) {
			this.m_adapter.setBlitFboSrcRect(0, 0, fboIns.getFBOWidth(), fboIns.getFBOHeight());
			this.m_adapter.setBlitFboSrcRect(0, 0, this.getFBOWidth(), this.getFBOHeight());
			this.m_adapter.blitFBO(
				fboIns.getFBOUid(),
				this.m_fboIndex,
				RenderMaskBitfield.COLOR_BUFFER_BIT | RenderMaskBitfield.DEPTH_BUFFER_BIT,
				filter,
				clearType,
				clearIndex,
				dataArr
			);
		}
	}
	blitStencilFrom(
		fboIns: FBOInstance,
		filter: number = RenderFilter.NEAREST,
		clearType: number = -1,
		clearIndex: number = 0,
		dataArr: number[] = null
	): void {
		if (this.m_fboIndex >= 0) {
			this.m_adapter.setBlitFboSrcRect(0, 0, fboIns.getFBOWidth(), fboIns.getFBOHeight());
			this.m_adapter.setBlitFboSrcRect(0, 0, this.getFBOWidth(), this.getFBOHeight());
			this.m_adapter.blitFBO(
				fboIns.getFBOUid(),
				this.m_fboIndex,
				RenderMaskBitfield.STENCIL_BUFFER_BIT,
				filter,
				clearType,
				clearIndex,
				dataArr
			);
		}
	}
	renderToTextureAt(i: number, attachmentIndex: number = 0): void {
		this.m_adapter.setRenderToTexture(this.m_texs[i], this.m_enableDepth, this.m_enableStencil, attachmentIndex);
		this.m_adapter.useFBO(this.m_clearColorBoo, this.m_clearDepthBoo, this.m_clearStencilBoo);
	}
	private runBeginDo(): void {
		if (this.m_runFlag) {
			this.m_runFlag = false;
			this.m_rproxy.rshader.resetRenderState();
			this.m_rproxy.getClearRGBAColor4f(this.m_backBufferColor);

			if (this.m_viewportLock) {
				this.m_adapter.lockViewport();
			} else {
				this.m_adapter.unlockViewport();
			}

			this.m_adapter.bindFBOAt(this.m_fboIndex, this.m_fboType);
			if (this.m_synFBOSizeWithViewport) {
				this.m_adapter.synFBOSizeWithViewport();
				this.m_adapter.setFBOSizeFactorWithViewPort(this.m_fboSizeFactor);
			} else {
				this.m_adapter.asynFBOSizeWithViewport();
			}
			if (this.m_clearDepth < 128.0) {
				this.m_adapter.setClearDepth(this.m_clearDepth);
			}
			this.m_rproxy.setClearColor(this.m_bgColor);
			let i = 0;
			for (; i < this.m_texsTot; ++i) {
				this.m_adapter.setRenderToTexture(this.m_texs[i], this.m_enableDepth, this.m_enableStencil, i);
			}
			this.m_adapter.useFBO(this.m_clearColorBoo, this.m_clearDepthBoo, this.m_clearStencilBoo);
			if (this.m_gMateiral != null) {
				this.m_rcontext.useGlobalMaterial(this.m_gMateiral, this.m_texUnlock, this.m_tmaterialUniformUpdate);
			} else {
				this.m_rcontext.unlockMaterial();
			}
		}
	}
	run(lockRenderState: boolean = false, lockMaterial: boolean = false, autoEnd: boolean = true, autoRunBegin: boolean = true): void {
		if (lockRenderState) this.lockRenderState();
		if (lockMaterial && !autoRunBegin) this.lockMaterial();

		if (this.m_fboIndex >= 0) {
			if (autoRunBegin) this.runBeginDo();

			if (this.m_rindexs != null) {
				// rendering running
				if (this.m_processShared) {
					for (let i = 0, len = this.m_rindexs.length; i < len; ++i) {
						this.m_renderer.runAt(this.m_rindexs[i]);
					}
				} else {
					for (let i = 0, len = this.m_rindexs.length; i < len; ++i) {
						const proc = this.m_renderer.getRenderProcessAt(this.m_rindexs[i]);
						proc.setEnabled(true);
						this.m_renderer.runAt(this.m_rindexs[i]);
						proc.setEnabled(false);
					}
				}
			}
		}

		if (lockRenderState) this.unlockRenderState();
		if (lockMaterial) {
			this.unlockMaterial();
		}
		if (autoEnd) {
			this.runEnd();
		}
	}
	runAt(index: number, autoRunBegin: boolean = true): void {
		if (this.m_fboIndex >= 0 && this.m_rindexs != null) {
			if (index == 0 && autoRunBegin) {
				this.runBeginDo();
			} else {
				this.m_runFlag = true;
			}
			this.m_renderer.runAt(this.m_rindexs[index]);
		}
	}
	/**
	 * 单独绘制可渲染对象, 可能是使用了 global material也可能没有。这种方式比较耗性能,只能用在特殊的地方。
	 * @param entity 需要指定绘制的 IRenderEntity 实例
	 * @param useGlobalUniform 是否使用当前 global material 所携带的 uniform, default value: false
	 * @param forceUpdateUniform 是否强制更新当前 global material 所对应的 shader program 的 uniform, default value: true
	 */
	drawEntity(entity: IRenderEntity, useGlobalUniform: boolean = false, forceUpdateUniform: boolean = true): void {
		if (!this.m_runFlag) {
			this.m_renderer.drawEntity(entity, useGlobalUniform, forceUpdateUniform);
		}
	}
	runBegin(): void {
		if (this.m_fboIndex >= 0 && this.m_rindexs != null) {
			this.m_runFlag = true;
			this.runBeginDo();
		}
	}
	runEnd(): void {
		this.m_rproxy.setClearColor(this.m_backBufferColor);
		this.m_runFlag = true;
		if (this.m_viewportLock) {
			this.m_adapter.unlockViewport();
		}
	}

	useCamera(camera: IRenderCamera, syncCamView: boolean = false): void {
		this.m_renderer.useCamera(camera, syncCamView);
	}
	useMainCamera(): void {
		this.m_renderer.useMainCamera();
	}
	reset(): void {
		this.setGlobalMaterial(null);
		let i = 0;
		for (; i < this.m_texsTot; ++i) {
			this.m_texs[i] = null;
		}
		this.m_runFlag = false;
		this.m_fboIndex = -1;
		this.m_texsTot = 0;
		this.m_rindexs = [];
	}

	clone(): FBOInstance {
		let ins = new FBOInstance(this.m_renderer);
		ins.m_fboSizeFactor = this.m_fboSizeFactor;
		ins.m_bgColor.copyFrom(this.m_bgColor);
		ins.m_fboIndex = this.m_fboIndex;
		ins.m_fboType = this.m_fboType;
		ins.m_clearDepth = this.m_clearDepth;
		ins.m_texsTot = this.m_texsTot;
		ins.m_enableDepth = this.m_enableDepth;
		ins.m_enableStencil = this.m_enableStencil;
		ins.m_synFBOSizeWithViewport = this.m_synFBOSizeWithViewport;

		ins.m_initW = this.m_initW;
		ins.m_initH = this.m_initH;
		ins.m_multisampleLevel = this.m_multisampleLevel;

		let i: number = 0;
		for (; i < this.m_texsTot; ++i) {
			ins.m_texs[i] = ins.m_texs[i];
		}
		if (this.m_rindexs != null) {
			let len: number = this.m_rindexs.length;
			let list: number[] = new Array(len);
			for (i = 0; i < len; ++i) {
				list[i] = this.m_rindexs[i];
			}
			ins.setRProcessIDList(list);
		}
		return ins;
	}
	private m_lockRenderState = false;
	private m_lockMaterial = false;
	private m_autoEnd = true;
	private m_autoRunBegin = true;
	setRenderingState(lockRenderState: boolean = false, lockMaterial: boolean = false, autoEnd: boolean = true, autoRunBegin: boolean = true): void {
		this.m_lockRenderState = lockRenderState;
		this.m_lockMaterial = lockMaterial;
		this.m_autoEnd = autoEnd;
		this.m_autoRunBegin = autoRunBegin;
	}
	render(): void {
		this.run(this.m_lockRenderState, this.m_lockMaterial, this.m_autoEnd, this.m_autoRunBegin);
	}

	private m_autoRRun = false;
    /**
	 * @param auto enable auto runnning this instance
	 * @param prepend perpend this into the renderer rendering process or append, the default value is true
	 * @returns instance self
	 */
	setAutoRunning(auto: boolean, prepend: boolean = true): FBOInstance {
		if (auto != this.m_autoRRun) {
			this.m_autoRRun = auto;
			if (auto) {
				if (prepend) {
					this.m_renderer.prependRenderNode(this);
				} else {
					this.m_renderer.appendRenderNode(this);
				}
			} else {
				this.m_renderer.removeRenderNode(this);
			}
		}
		return this;
	}
	isAutoRunning(): boolean {
		return false;
	}
}
