/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import DivLog from "../../vox/utils/DivLog";
import Vector3D from "../../vox/math/Vector3D";
import Color4 from "../../vox/material/Color4";
import FrameBufferType from "../../vox/render/FrameBufferType";
import RenderFilter from "../../vox/render/RenderFilter";
import RenderMaskBitfield from "../../vox/render/RenderMaskBitfield";
import ROTextureResource from '../../vox/render/ROTextureResource';
import FrameBufferObject from "../../vox/render/FrameBufferObject";
import { CullFaceMode, DepthTestMode } from "../../vox/render/RenderConst";
import { TextureFormat, TextureDataType } from "../../vox/texture/TextureConst";
import RTTTextureProxy from "../../vox/texture/RTTTextureProxy";
import RAdapterContext from "../../vox/render/RAdapterContext";
import { RODrawState, RenderStateObject, RenderColorMask } from "../../vox/render/RODrawState";
import RendererState from "../../vox/render/RendererState";
import UniformVec4Probe from "../../vox/material/UniformVec4Probe";
import RendererParam from "../../vox/scene/RendererParam";

class RenderAdapter {
	private static s_uid: number = 0;
	private m_uid: number = RenderAdapter.s_uid++;
	// renderer context uid
	private m_rcuid: number = 0;
	private m_texResource: ROTextureResource = null;
	private m_gl: any = null;
	private m_fontFaceFlipped: boolean = false;// default ccw
	private m_colorMask: any = { mr: true, mg: true, mb: true, ma: true };
	private m_rcontext: RAdapterContext = null;
	private m_clearMask: number = 0x0;
	private m_fboBuf: FrameBufferObject = null;
	private m_fboIndex: number = 0;
	private m_fboType: number = FrameBufferType.FRAMEBUFFER;
	private m_fboBufList: FrameBufferObject[] = [null, null, null, null, null, null, null, null];
	private m_fboClearBoo: boolean = true;
	private m_fboViewRectBoo: boolean = false;
	private m_viewX: number = 0;
	private m_viewY: number = 0;
	private m_viewWidth: number = 800;
	private m_viewHeight: number = 600;
	private m_clearDepth: number = 1.0;
	private m_preDepth: number = 0.0;
	private m_fboViewSize: Vector3D = new Vector3D(0, 0, 800, 600);
	private m_fboSizeFactor: number = 1.0;
	private m_clearStencil: number = 0x0;
	private m_fboBiltRect: Uint16Array = new Uint16Array(8);
	private m_fboViewRect: Uint16Array = new Uint16Array(4);
	private m_activeAttachmentTotal: number = 1;
	private m_scissorEnabled: boolean = false;
	private m_rState: RODrawState = null;
	private m_webglVer: number = 2;
	readonly bgColor: Color4 = new Color4();
	readonly uViewProbe: UniformVec4Probe = null;

	constructor(rcuid: number, texResource: ROTextureResource) {
		this.m_texResource = texResource;
		this.m_rcuid = rcuid;
	}

	initialize(context: RAdapterContext, param: RendererParam, rState: RODrawState): void {
		if (this.m_rcontext == null) {
			this.m_webglVer = context.getWebGLVersion();
			this.m_rState = rState;
			this.m_rcontext = context;
			this.m_gl = context.getRC();

			this.m_gl.disable(this.m_gl.SCISSOR_TEST);
			if (context.isDepthTestEnabled()) this.m_gl.enable(this.m_gl.DEPTH_TEST);
			else this.m_gl.disable(this.m_gl.DEPTH_TEST);

			if (context.isStencilTestEnabled()) {
				this.m_gl.enable(this.m_gl.STENCIL_TEST);
			}
			else {
				console.warn("STENCIL_TEST disable !!!");
				this.m_gl.disable(this.m_gl.STENCIL_TEST);
			}

			this.m_gl.enable(this.m_gl.CULL_FACE);
			this.m_gl.cullFace(this.m_gl.BACK);
			this.m_gl.enable(this.m_gl.BLEND);

			if (param.getDitherEanbled()) this.m_gl.enable(this.m_gl.DITHER);
			else this.m_gl.disable(this.m_gl.DITHER);
			this.m_gl.frontFace(this.m_gl.CCW);
			if (param.getPolygonOffsetEanbled()) {
				this.m_gl.enable(this.m_gl.POLYGON_OFFSET_FILL);
			}
			else {
				this.m_gl.disable(this.m_gl.POLYGON_OFFSET_FILL);
			}

			//m_gl.hint(m_gl.PERSPECTIVE_CORRECTION_HINT, m_gl.NICEST);	// Really Nice Perspective Calculations
			this.m_clearMask = this.m_gl.COLOR_BUFFER_BIT | this.m_gl.DEPTH_BUFFER_BIT | this.m_gl.STENCIL_BUFFER_BIT;
			//
			//this.m_rState = context.getRenderState();
			//console.log("RenderAdapter::initialize() finish...");
			if (this.uViewProbe == null) {
				let self: any = this;
				self.uViewProbe = new UniformVec4Probe(1);
				this.uViewProbe.bindSlotAt(this.m_rcuid);
				this.uViewProbe.setVec4DataWithArr4([this.m_viewX, this.m_viewY, this.m_viewWidth, this.m_viewHeight]);
			}
		}
	}
	/**
	 * @param faceFlipped the value is true, frontFace is CW. the value is false, frontFace is CCW. 
	 */
	setFrontFaceFlipped(faceFlipped: boolean): void {
		if (this.m_fontFaceFlipped != faceFlipped) {
			if (faceFlipped) {
				this.m_gl.frontFace(this.m_gl.CW);
			}
			else {
				this.m_gl.frontFace(this.m_gl.CCW);
			}
			this.m_fontFaceFlipped = faceFlipped;
		}
	}
	private m_polygonOffset: boolean = false;
	/*
	 * specifies the scale factors and units to calculate depth values.
	 * @param factor the value is a GLfloat which sets the scale factor for the variable depth offset for each polygon. The default value is 0.
	 * @param units the value is a which sets the multiplier by which an implementation-specific value is multiplied with to create a constant depth offset. The default value is 0.
	 */
	setPolygonOffset(factor: number, units: number = 0.0): void {
		this.m_gl.polygonOffset(factor, units);
		this.m_polygonOffset = true;
	}
	/*
	 * reset the scale factors and units value is default value(0.0).
	 */
	resetPolygonOffset(): void {
		if (this.m_polygonOffset) {
			this.m_gl.polygonOffset(0.0, 0.0);
			this.m_polygonOffset = false;
		}
	}
	getDiv(): any {
		return this.m_rcontext.getDiv();
	}
	getCanvas(): any {
		return this.m_rcontext.getCanvas();
	}
	setClearDepth(depth: number): void {
		this.m_clearDepth = depth;
	}
	getClearDepth(): number {
		return this.m_clearDepth;
	}
	setContextViewSize(pw: number, ph: number): void {
		this.m_rcontext.autoSyncRenderBufferAndWindowSize = false;
		this.m_rcontext.resizeBufferSize(pw, ph);
	}
	getViewportX(): number { return this.m_rcontext.getViewportX(); }
	getViewportY(): number { return this.m_rcontext.getViewportY(); }
	getViewportWidth(): number { return this.m_rcontext.getViewportWidth(); }
	getViewportHeight(): number { return this.m_rcontext.getViewportHeight(); }
	getFBOFitWidth(): number { return this.m_rcontext.getFBOWidth(); }
	getFBOFitHeight(): number { return this.m_rcontext.getFBOHeight(); }
	getRCanvasWidth(): number { return this.m_rcontext.getRCanvasWidth(); }
	getRCanvasHeight(): number { return this.m_rcontext.getRCanvasHeight(); }

	setColorMask(mr: boolean, mg: boolean, mb: boolean, ma: boolean): void {
		this.m_colorMask.mr = mr;
		this.m_colorMask.mg = mg;
		this.m_colorMask.mb = mb;
		this.m_colorMask.ma = ma;
	}
	setClearMaskClearAll(): void {
		this.m_clearMask = this.m_gl.COLOR_BUFFER_BIT | this.m_gl.DEPTH_BUFFER_BIT | this.m_gl.STENCIL_BUFFER_BIT;
	}
	setClearMaskClearOnlyColor(): void {
		this.m_clearMask = this.m_gl.COLOR_BUFFER_BIT;
	}
	setClearMaskClearOnlyDepthAndStencil(): void {
		this.m_clearMask = this.m_gl.DEPTH_BUFFER_BIT | this.m_gl.STENCIL_BUFFER_BIT;
	}
	setScissorRect(px: number, py: number, pw: number, ph: number): void {
		if (this.m_scissorEnabled) {
			this.m_gl.scissor(px, py, pw, ph);
		}
	}
	setScissorEnabled(enabled: boolean): void {
		if (enabled) {
			if (!this.m_scissorEnabled) {
				this.m_scissorEnabled = true;
				this.m_gl.enable(this.m_gl.SCISSOR_TEST);
			}
		}
		else if (this.m_scissorEnabled) {
			this.m_scissorEnabled = false;
			this.m_gl.disable(this.m_gl.SCISSOR_TEST);
		}
	}
	clear(): void {

		if (this.m_preDepth !== this.m_clearDepth) {
			this.m_preDepth = this.m_clearDepth;
			this.m_gl.clearDepth(this.m_clearDepth);
		}
		if (this.m_rcontext.isStencilTestEnabled()) {
			this.m_gl.clearStencil(this.m_clearStencil);
		}
		this.m_gl.clearColor(this.bgColor.r, this.bgColor.g, this.bgColor.b, this.bgColor.a);
		this.m_gl.clear(this.m_clearMask);
		//	if (this.m_rcontext.isStencilTestEnabled()) {
		//		this.m_gl.stencilMask(0x0);
		//	}

	}
	reset(): void {
		this.m_rState.setCullFaceMode(CullFaceMode.BACK);
		this.m_rState.setDepthTestMode(DepthTestMode.OPAQUE);
		RendererState.Reset(this.m_gl);
	}
	getRenderContext(): RAdapterContext {
		return this.m_rcontext;
	}
	renderBegin(): void {
		if (this.m_rcontext != null) {
			this.m_fboSizeFactor = 1.0;
			this.reseizeViewPort();
			RenderStateObject.Unlock();
			
			RenderStateObject.UseRenderState(RendererState.NORMAL_STATE);
			RenderColorMask.Unlock();
			RenderColorMask.UseRenderState(RenderColorMask.ALL_TRUE_COLOR_MASK);
			// for back buffer
			//this.m_gl.clearDepth(1.0);
			this.clear();
		}
	}
	private m_devPRatio: number = 1.0;
	private m_viewportUnlock: boolean = true;
	reseizeViewPort(): void {
		if (this.m_viewportUnlock) {
			let k: number = this.m_rcontext.getDevicePixelRatio();
			let boo: boolean = this.m_viewX != this.m_rcontext.getViewportX() || this.m_viewY != this.m_rcontext.getViewportY();
			boo = boo || this.m_viewWidth != this.m_rcontext.getViewportWidth();
			boo = boo || this.m_viewHeight != this.m_rcontext.getViewportHeight();
			boo = boo || Math.abs(this.m_devPRatio - k) > 0.01;
			if (boo) {
				this.m_devPRatio = k;
				this.m_viewX = this.m_rcontext.getViewportX();
				this.m_viewY = this.m_rcontext.getViewportY();
				this.m_viewWidth = this.m_rcontext.getViewportWidth();
				this.m_viewHeight = this.m_rcontext.getViewportHeight();

				this.uViewProbe.setVec4Data(
					this.m_viewX,
					this.m_viewY,
					this.m_viewWidth,
					this.m_viewHeight
				);
				this.uViewProbe.update();
				//DivLog.ShowLog("reseizeViewPort: " + this.m_viewX + "," + this.m_viewY + "," + this.m_viewWidth + "," + this.m_viewHeight);
				//console.log("reseizeViewPort: "+this.m_viewX+","+this.m_viewY+","+this.m_viewWidth+","+this.m_viewHeight);
				this.m_gl.viewport(
					this.m_viewX,
					this.m_viewY,
					this.m_viewWidth,
					this.m_viewHeight
				);
			}
		}
	}
	private reseizeFBOViewPort(): void {
		if (this.m_viewportUnlock) {
			let k: number = this.m_rcontext.getDevicePixelRatio();
			let boo: boolean = this.m_viewX != this.m_fboViewSize.x || this.m_viewY != this.m_fboViewSize.y;
			boo = boo || this.m_viewWidth != this.m_fboViewSize.z;
			boo = boo || this.m_viewHeight != this.m_fboViewSize.w;
			boo = boo || Math.abs(this.m_devPRatio - k) > 0.01;
			if (boo) {
				this.m_devPRatio = k;
				this.m_viewX = this.m_fboViewSize.x;
				this.m_viewY = this.m_fboViewSize.y;
				this.m_viewWidth = this.m_fboViewSize.z;
				this.m_viewHeight = this.m_fboViewSize.w;
				this.uViewProbe.setVec4Data(
					this.m_viewX,
					this.m_viewY,
					this.m_viewWidth,
					this.m_viewHeight
				);
				this.uViewProbe.update();
				//DivLog.ShowLog("reseizeFBOViewPort: " + this.m_viewX + "," + this.m_viewY + "," + this.m_viewWidth + "," + this.m_viewHeight);
				//console.log("reseizeFBOViewPort: "+this.m_viewX+","+this.m_viewY+","+this.m_viewWidth+","+this.m_viewHeight);
				this.m_gl.viewport(
					this.m_viewX,
					this.m_viewY,
					this.m_viewWidth,
					this.m_viewHeight
				);
			}
		}
	}
	setViewProbeValue(x: number, y: number, width: number, height: number): void {
		this.uViewProbe.setVec4Data(
			x,
			y,
			width,
			height
		);
		this.uViewProbe.update();
	}
	lockViewport(): void {
		this.m_viewportUnlock = false;
	}
	unlockViewport(): void {
		this.m_viewportUnlock = true;
	}
	renderEnd(): void {
	}
	update(): void {
	}
	updateRenderBufferSize(): void {
		this.m_rcontext.updateRenderBufferSize();
	}
	destroy(): void {
		this.m_rcontext = null;
		this.m_rState = null;
	}
	getDevicePixelRatio(): number {
		return this.m_rcontext.getDevicePixelRatio();
	}

	loseContext(): void {
		this.m_rcontext.loseContext();
	}
	/**
	 * @returns return gpu context lost status
	 */
	isContextLost(): boolean {
		return this.m_rcontext.isContextLost();
	}
	// read data format include float or unsigned byte ,etc.
	readPixels(px: number, py: number, width: number, height: number, format: number, dataType: number, pixels: Uint8Array): void {
		this.m_gl.readPixels(px, py, width, height, TextureFormat.ToGL(this.m_gl, format), TextureDataType.ToGL(this.m_gl, dataType), pixels);
	}
	setFBOViewRect(px: number, py: number, pw: number, ph: number): void {
		this.m_fboViewRect[0] = px;
		this.m_fboViewRect[1] = py;
		this.m_fboViewRect[2] = pw;
		this.m_fboViewRect[3] = ph;
		this.m_fboViewRectBoo = true;
	}
	createFBOAt(index: number, fboType: number, pw: number, ph: number, enableDepth: boolean = false, enableStencil: boolean = false, multisampleLevel: number = 0): void {
		if (this.m_fboBufList[index] == null) {
			if (index > 7) {
				index = 7;
			}
			this.m_fboType = fboType;
			this.m_fboBuf = new FrameBufferObject(this.m_rcuid, this.m_texResource, this.m_fboType);
			this.m_fboBuf.multisampleEnabled = multisampleLevel > 0;
			this.m_fboBuf.multisampleLevel = multisampleLevel;
			this.m_fboBuf.writeDepthEnabled = enableDepth;
			this.m_fboBuf.writeStencilEnabled = enableStencil;
			this.m_fboBuf.initialize(this.m_gl, pw, ph);
			this.m_fboBufList[index] = this.m_fboBuf;
			this.m_fboBuf.sizeFixed = true;
		}
	}

	resizeFBOAt(index: number, pw: number, ph: number): void {
		if (index > 7) {
			index = 7;
		}
		else if (index < 0) {
			index = 0;
		}
		if (this.m_fboBufList[this.m_fboIndex] != null) {
			this.m_fboBufList[this.m_fboIndex].resize(pw, ph);
		}
	}
	getFBOWidthAt(index: number): number {
		if (this.m_fboBufList[index] != null) {
			return this.m_fboBufList[index].getWidth();
		}
		return 0;
	}
	getFBOHeightAt(index: number): number {
		if (this.m_fboBufList[index] != null) {
			return this.m_fboBufList[index].getHeight();
		}
		return 0;
	}
	private m_synFBOSizeWithViewport: boolean = false;
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
	bindFBOAt(index: number, fboType: number): void {
		if (index > 7) {
			index = 7;
		}
		else if (index < 0) {
			index = 0;
		}
		this.m_fboBuf = this.m_fboBufList[index];
		if (this.m_fboBuf != null) {
			this.m_fboIndex = index;
			this.m_fboType = fboType;
			this.m_fboBuf.bind(fboType);
			this.m_fboClearBoo = true;
		}
		else {
			throw Error("Fatal Error!!! this.m_fboBuf == null.");
		}
	}
	resetFBOAttachmentMask(boo: boolean): void {
		if (this.m_fboBuf != null) {
			this.m_fboBuf.resetAttachmentMask(boo);
		}
	}
	setFBOAttachmentMaskAt(index: number, boo: boolean): void {
		if (this.m_fboBuf != null) {
			this.m_fboBuf.setAttachmentMaskAt(index, boo);
		}
	}
	getFBOAttachmentTotal(): number {
		if (this.m_fboBuf != null) {
			return this.m_fboBuf.getAttachmentTotal();
		}
		return 0;
	}
	/**
	 * bind a texture to fbo attachment by attachment index
	 * @param texProxy  RTTTextureProxy instance
	 * @param enableDepth  enable depth buffer yes or no
	 * @param enableStencil  enable stencil buffer yes or no
	 * @param attachmentIndex  fbo attachment index
	 */
	setRenderToTexture(texProxy: RTTTextureProxy, enableDepth: boolean = false, enableStencil: boolean = false, attachmentIndex: number = 0): void {
		if (attachmentIndex < 0 || attachmentIndex >= 8) {
			attachmentIndex = 0;
		}
		if (texProxy == null && attachmentIndex == 0) {
			this.setRenderToBackBuffer(FrameBufferType.FRAMEBUFFER);
		}
		else {
			if (attachmentIndex == 0) {
				if (this.m_fboBuf != null) {
					if (this.m_synFBOSizeWithViewport) {
						this.m_fboBuf.initialize(this.m_gl, Math.floor(this.m_rcontext.getFBOWidth() * this.m_fboSizeFactor), Math.floor(this.m_rcontext.getFBOHeight() * this.m_fboSizeFactor));
					}
					else {
						//this.m_fboBuf.initialize(this.m_gl, texProxy.getWidth(), texProxy.getHeight());
						if (this.m_fboViewRectBoo) {
							this.m_fboBuf.initialize(this.m_gl, this.m_fboViewRect[2], this.m_fboViewRect[3]);
						}
						else if (!this.m_fboBuf.sizeFixed) {
							this.m_fboBuf.initialize(this.m_gl, texProxy.getWidth(), texProxy.getHeight());
						}
					}
				}
				if (this.m_fboIndex >= 0) {
					if (this.m_fboBuf == null) {
						this.m_fboBuf = new FrameBufferObject(this.m_rcuid, this.m_texResource, this.m_fboType);
						this.m_fboBufList[this.m_fboIndex] = this.m_fboBuf;
						this.m_fboBuf.writeDepthEnabled = enableDepth;
						this.m_fboBuf.writeStencilEnabled = enableStencil;
						if (this.m_synFBOSizeWithViewport) {
							this.m_fboBuf.initialize(this.m_gl, Math.floor(this.m_rcontext.getFBOWidth() * this.m_fboSizeFactor), Math.floor(this.m_rcontext.getFBOHeight() * this.m_fboSizeFactor));
						}
						else {
							if (this.m_fboViewRectBoo) {
								this.m_fboBuf.initialize(this.m_gl, this.m_fboViewRect[2], this.m_fboViewRect[3]);
							}
							else {
								this.m_fboBuf.initialize(this.m_gl, texProxy.getWidth(), texProxy.getHeight());
							}
						}
					}
				}
			}
			if (this.m_fboBuf != null) {
				this.m_fboBuf.renderToTexAt(this.m_gl, texProxy, attachmentIndex);
				//console.log("RenderProxy::setRenderToTexture(), fbo: ",this.m_fboBuf.getFBO());
			}
			this.m_fboClearBoo = true;
		}
	}
	getActiveAttachmentTotal(): number {
		return this.m_activeAttachmentTotal;
	}
	getAttachmentTotal(): number {
		return this.m_activeAttachmentTotal;
	}
	useFBO(clearColorBoo: boolean = false, clearDepthBoo: boolean = false, clearStencilBoo: boolean = false): void {
		if (this.m_fboBuf != null) {
			if (this.m_fboClearBoo) {
				this.m_fboClearBoo = false;
				this.m_fboBuf.use(this.m_gl);
				this.m_activeAttachmentTotal = this.m_fboBuf.getActiveAttachmentTotal();
				if (clearColorBoo) {
					this.m_fboBuf.clearOnlyColor(this.bgColor);
				}
				if (this.m_fboBuf.writeDepthEnabled) {
					if (this.m_fboBuf.writeStencilEnabled) {
						if (clearDepthBoo && clearStencilBoo) {
							this.m_fboBuf.clearOnlyDepthAndStencil(this.m_clearDepth, 0xffffffff);
						}
						else if (clearDepthBoo) {
							this.m_fboBuf.clearOnlyDepth(this.m_clearDepth);
						}
						else if (clearStencilBoo) {
							this.m_fboBuf.clearOnlyStencil(0xff);
						}
					}
					else if (clearDepthBoo) {
						this.m_fboBuf.clearOnlyDepth(this.m_clearDepth);
					}
				}
				else if (clearStencilBoo && this.m_fboBuf.writeStencilEnabled) {
					this.m_fboBuf.clearOnlyStencil(0xff);
				}
				if (this.m_webglVer == 1) {
					//m_gl.colorMask(m_colorMask.mr,m_colorMask.mg,m_colorMask.mb,m_colorMask.ma);
					this.m_gl.clear(this.m_clearMask);
				}

				this.m_fboBiltRect[4] = this.m_fboBiltRect[0] = this.m_viewX;
				this.m_fboBiltRect[5] = this.m_fboBiltRect[1] = this.m_viewY;
				this.m_fboBiltRect[6] = this.m_fboBiltRect[2] = this.m_viewX + this.m_viewWidth;
				this.m_fboBiltRect[7] = this.m_fboBiltRect[3] = this.m_viewY + this.m_viewHeight;
				if (this.m_fboViewRectBoo) {
					this.m_fboViewRectBoo = false;
					this.m_fboViewSize.setTo(this.m_fboViewRect[0], this.m_fboViewRect[1], this.m_fboViewRect[2], this.m_fboViewRect[3]);
					this.reseizeFBOViewPort();
				}
				else {
					if (this.m_synFBOSizeWithViewport) {
						//console.log("this.m_fboSizeFactor: "+this.m_fboSizeFactor);
						this.m_fboViewSize.setTo(0, 0, Math.floor(this.m_rcontext.getFBOWidth() * this.m_fboSizeFactor), Math.floor(this.m_rcontext.getFBOHeight() * this.m_fboSizeFactor));
					}
					else {
						this.m_fboViewSize.setTo(0, 0, this.m_fboBuf.getWidth(), this.m_fboBuf.getHeight());
					}
					this.reseizeFBOViewPort();
				}
			}
		}
	}
	setRenderToBackBuffer(frameBufferType: number = FrameBufferType.FRAMEBUFFER): void {
		this.m_activeAttachmentTotal = 1;
		FrameBufferObject.BindToBackbuffer(this.m_gl, frameBufferType);
		this.reseizeViewPort();
	}

	bindFBOToDraw(): void {
		if (this.m_fboBuf != null) {
			this.m_fboBuf.bind(FrameBufferType.DRAW_FRAMEBUFFER);
		}
	}
	bindFBOToWrite(): void {
		if (this.m_fboBuf != null) {
			this.m_fboBuf.bind(FrameBufferType.READ_FRAMEBUFFER);
		}
	}
	setBlitFboSrcRect(px: number, py: number, pw: number, ph: number): void {
		this.m_fboBiltRect[0] = px;
		this.m_fboBiltRect[1] = py;
		this.m_fboBiltRect[2] = px + pw;
		this.m_fboBiltRect[3] = py + ph;
	}
	setBlitFboDstRect(px: number, py: number, pw: number, ph: number): void {
		this.m_fboBiltRect[4] = px;
		this.m_fboBiltRect[5] = py;
		this.m_fboBiltRect[6] = px + pw;
		this.m_fboBiltRect[7] = py + ph;
	}
	/**
	 * @oaram			clearType, it is RenderProxy.COLOR or RenderProxy.DEPTH or RenderProxy.STENCIL or RenderProxy.DEPTH_STENCIL
	*/
	blitFBO(readFBOIndex: number = 0, writeFBOIndex: number = 0, mask_bitfiled: number = RenderMaskBitfield.COLOR_BUFFER_BIT, filter: number = RenderFilter.NEAREST, clearType: number = 0, clearIndex: number = 0, dataArr: number[] = null): void {
		if (readFBOIndex > 7) {
			readFBOIndex = 7;
		}
		if (writeFBOIndex > 7) {
			writeFBOIndex = 7;
		}
		if (readFBOIndex >= 0 && this.m_fboBufList[readFBOIndex] != null) {
			this.m_fboBufList[readFBOIndex].bind(FrameBufferType.READ_FRAMEBUFFER);
		}
		else {
			FrameBufferObject.BindToBackbuffer(this.m_gl, FrameBufferType.READ_FRAMEBUFFER);
		}
		if (writeFBOIndex >= 0 && this.m_fboBufList[writeFBOIndex] != null) {
			this.m_fboBufList[writeFBOIndex].bind(FrameBufferType.DRAW_FRAMEBUFFER);
		}
		else {
			FrameBufferObject.BindToBackbuffer(this.m_gl, FrameBufferType.DRAW_FRAMEBUFFER);
		}
		if (clearType > 0) {
			if (clearIndex < 0) {
				clearIndex = 0;
			}
			// clearType 默认是 gl.COLOR
			// clearIndex 默认是0
			// dataArr 默认值是 [0.0, 0.0, 0.0, 1.0]
			if (dataArr == null) {
				dataArr = [0.0, 0.0, 0.0, 1.0];
			}
			this.m_gl.clearBufferfv(clearType, clearIndex, dataArr);
		}
		let fs: Uint16Array = this.m_fboBiltRect;
		//copyTexSubImage2D 可以在gles2中代替下面的函数
		this.m_gl.blitFramebuffer(fs[0], fs[1], fs[2], fs[3], fs[4], fs[5], fs[6], fs[7], mask_bitfiled, filter);
	}
}
export default RenderAdapter;