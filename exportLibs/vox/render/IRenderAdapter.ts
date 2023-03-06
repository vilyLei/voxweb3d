/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IRenderTexture from "../../vox/render/texture/IRenderTexture";
import IColor4 from "../material/IColor4";

interface IRenderAdapter {
	bgColor: Float32Array;
	//initialize(context: RAdapterContext, param: RendererParam, rState: RODrawState): void;
	/**
	 * @param faceFlipped the value is true, frontFace is CW. the value is false, frontFace is CCW.
	 */
	setFrontFaceFlipped(faceFlipped: boolean): void;
	/*
	 * specifies the scale factors and units to calculate depth values.
	 * @param factor the value is a GLfloat which sets the scale factor for the variable depth offset for each polygon. The default value is 0.
	 * @param units the value is a which sets the multiplier by which an implementation-specific value is multiplied with to create a constant depth offset. The default value is 0.
	 */
	setPolygonOffset(factor: number, units: number): void;
	/*
	 * reset the scale factors and units value is default value(0.0).
	 */
	resetPolygonOffset(): void;
	getDiv(): HTMLDivElement;
	getCanvas(): HTMLCanvasElement;
	setClearDepth(depth: number): void;
	getClearDepth(): number;
	setContextViewSize(pw: number, ph: number): void;
	getViewportX(): number;
	getViewportY(): number;
	getViewportWidth(): number;
	getViewportHeight(): number;
	getFBOFitWidth(): number;
	getFBOFitHeight(): number;
	getRCanvasWidth(): number;
	getRCanvasHeight(): number;

	setColorMask(mr: boolean, mg: boolean, mb: boolean, ma: boolean): void;
	setClearMaskClearAll(): void;
	setClearMaskClearOnlyColor(): void;
	setClearMaskClearOnlyDepthAndStencil(): void;
	setScissorRect(px: number, py: number, pw: number, ph: number): void;
	setScissorEnabled(enabled: boolean): void;
	/**
	 * only clear up depth value
	 * @param depth depth buffer depth value
	 */
	clearDepth(depth: number): void;
	clearColor(color: IColor4): void;
	clear(): void;
	reset(): void;
	renderBegin(): void;
	reseizeViewPort(): void;
	setViewProbeValue(x: number, y: number, width: number, height: number): void;
	lockViewport(): void;
	unlockViewport(): void;
	renderEnd(): void;
	update(): void;
	updateRenderBufferSize(): void;
	destroy(): void;
	getDevicePixelRatio(): number;

	loseContext(): void;
	/**
	 * @returns return gpu context lost status
	 */
	isContextLost(): boolean;
	// read data format include float or unsigned byte ,etc.
	readPixels(px: number, py: number, width: number, height: number, format: number, dataType: number, pixels: Uint8Array): void;
	createFBOAt(index: number, fboType: number, pw: number, ph: number, enableDepth: boolean, enableStencil: boolean, multisampleLevel: number): void;
	clearFBODepthAt(index: number, clearDepth: number): void;
	resizeFBOAt(index: number, pw: number, ph: number): void;
	getFBOWidthAt(index: number): number;
	getFBOHeightAt(index: number): number;

	synFBOSizeWithViewport(): void;
	asynFBOSizeWithViewport(): void;
	
	/**
	 * if synFBOSizeWithViewport is true, fbo size = factor * view port size;
	 * @param factor exmple: the value of factor is 0.5
	 */
	setFBOSizeFactorWithViewPort(factor: number): void;
	bindFBOAt(index: number, fboType: number): void;
	resetFBOAttachmentMask(boo: boolean): void;
	setFBOAttachmentMaskAt(index: number, boo: boolean): void;
	/**
	 * sync the clear bg color and the html body bg color
	 */
	syncHtmlBodyColor(): void;

	getFBOAttachmentTotal(): number;
	/**
	 * bind a texture to fbo attachment by attachment index
	 * @param texProxy  IRenderTexture instance
	 * @param enableDepth  enable depth buffer yes or no
	 * @param enableStencil  enable stencil buffer yes or no
	 * @param attachmentIndex  fbo attachment index
	 */
	setRenderToTexture(texProxy: IRenderTexture, enableDepth: boolean, enableStencil: boolean, attachmentIndex: number): void;
	getActiveAttachmentTotal(): number;
	getAttachmentTotal(): number;
	useFBO(clearColorBoo: boolean, clearDepthBoo: boolean, clearStencilBoo: boolean ): void;
	setRenderToBackBuffer(frameBufferType: number): void;

	bindFBOToDraw(): void;
	bindFBOToWrite(): void;
	setBlitFboSrcRect(px: number, py: number, pw: number, ph: number): void;
	setBlitFboDstRect(px: number, py: number, pw: number, ph: number): void;
	/**
	 * @oaram			clearType, it is RenderProxy.COLOR or RenderProxy.DEPTH or RenderProxy.STENCIL or RenderProxy.DEPTH_STENCIL
	*/
	blitFBO(readFBOIndex: number, writeFBOIndex: number, mask_bitfiled: number, filter: number, clearType: number, clearIndex: number, dataArr: number[]): void;
}
export {IRenderAdapter};
