/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import FrameBufferType from "../render/FrameBufferType";
import IRenderStage3D from "../../vox/render/IRenderStage3D";
import { IRenderCamera } from "../../vox/render/IRenderCamera";
import RendererState from "../../vox/render/RendererState";
import RAdapterContext from "../../vox/render/RAdapterContext";
import { IRenderAdapter } from "../../vox/render/IRenderAdapter";
import IRenderTexture from "../../vox/render/texture/IRenderTexture";

import { IShaderProgramBuilder } from "../../vox/material/IShaderProgramBuilder";
import { ShaderUniformContext } from "../../vox/material/ShaderUniformContext";
import IRenderMaterial from "../../vox/render/IRenderMaterial";
import RenderMaterialProxy from "../../vox/render/RenderMaterialProxy";

import {RenderProxyParam, RenderProxy} from "../../vox/render/RenderProxy";

import RODataBuilder from "../../vox/render/RODataBuilder";
import RendererParam from "../../vox/scene/RendererParam";
import ROVtxBuilder from "../../vox/render/ROVtxBuilder";
import { IRendererInstanceContext } from "../../vox/scene/IRendererInstanceContext";
import Color4 from "../material/Color4";

class RendererInstanceContextParam {

    camera: IRenderCamera = null;
    stage: IRenderStage3D = null;
    builder: RODataBuilder = null;
    vtxBuilder: ROVtxBuilder = null;
    uniformContext: ShaderUniformContext = null;
    shaderProgramBuilder: IShaderProgramBuilder = null;

    constructor(){}

}
/**
 * 渲染器实例上下文
 */
class RendererInstanceContext implements IRendererInstanceContext {

    private m_adapter: IRenderAdapter = null;
    private m_renderProxy: RenderProxy = null;
    private m_materialProxy: RenderMaterialProxy = null;
    private m_cameraNear: number = 0.1;
    private m_cameraFar: number = 5000.0;
    private m_cameraFov: number = 45.0;
    private m_rcuid: number = 0;

    constructor(rcuid: number) {
        this.m_rcuid = rcuid;
        this.m_renderProxy = new RenderProxy(rcuid);
    }

    /**
     * @returns return renderer context unique id
     */
    getRCUid(): number {
        return this.m_rcuid;
    }
    getDiv(): any {
        return this.m_adapter.getDiv();
    }
    getCanvas(): any {
        return this.m_adapter.getCanvas();
    }
    getRenderAdapter(): IRenderAdapter {
        return this.m_adapter;
    }
    getRenderMaterialProxy(): RenderMaterialProxy {
        return this.m_materialProxy;
    }
    getRenderProxy(): RenderProxy {
        return this.m_renderProxy;
    }
    getTextureResTotal(): number {
        return this.m_renderProxy.Texture.getTextureResTotal();
    }
    getTextureAttachTotal(): number {
        return this.m_renderProxy.Texture.getAttachTotal();
    }

    getDevicePixelRatio(): number {
        return this.m_adapter.getDevicePixelRatio();
    }
    getStage3D(): IRenderStage3D {
        return this.m_renderProxy.getStage3D();
    }
    getCamera(): IRenderCamera {
        if (this.m_renderProxy != null) {
            return this.m_renderProxy.getCamera();
        }
        return null;
    }
    cameraLock(): void {
        this.m_renderProxy.cameraLock();
    }
    cameraUnlock(): void {
        this.m_renderProxy.cameraUnlock();
    }
    updateCamera(): void {
        if (this.m_renderProxy != null) {
            this.m_renderProxy.updateCamera();
        }
    }
    updateCameraDataFromCamera(cam: IRenderCamera): void {
        if (this.m_renderProxy != null) {
            this.m_renderProxy.updateCameraDataFromCamera(cam);
        }
    }

    lockRenderColorMask(): void {
        if (this.m_renderProxy != null) {
            this.m_renderProxy.lockRenderColorMask();
        }
    }
    unlockRendererColorMask(): void {
        if (this.m_renderProxy != null) {
            this.m_renderProxy.unlockRenderState();
        }
    }
    useGlobalRenderColorMask(colorMask: number): void {
        if (this.m_renderProxy != null) {
            this.m_renderProxy.unlockRenderColorMask();
            this.m_renderProxy.useRenderColorMask(colorMask);
            this.m_renderProxy.lockRenderColorMask();
        }
    }
    useGlobalRenderColorMaskByName(colorMaskNS: string): void {
        if (this.m_renderProxy != null) {
            this.m_renderProxy.unlockRenderColorMask();
            this.m_renderProxy.useRenderColorMask(RendererState.GetRenderColorMaskByName(colorMaskNS));
            this.m_renderProxy.lockRenderColorMask();
        }
    }
    getRenderColorMaskByName(scolorMaskNS: string): number {
        return RendererState.GetRenderColorMaskByName(scolorMaskNS);
    }

    lockRenderState(): void {
        if (this.m_renderProxy != null) {
            this.m_renderProxy.lockRenderState();
        }
    }
    unlockRenderState(): void {
        if (this.m_renderProxy != null) {
            this.m_renderProxy.unlockRenderState();
        }
    }
    useGlobalRenderState(state: number): void {
        if (this.m_renderProxy != null) {
            this.m_renderProxy.unlockRenderState();
            this.m_renderProxy.useRenderState(state);
            this.m_renderProxy.lockRenderState();
        }
    }
    useGlobalRenderStateByName(stateNS: string): void {
        if (this.m_renderProxy != null) {
            this.m_renderProxy.unlockRenderState();
            this.m_renderProxy.useRenderState(RendererState.GetRenderStateByName(stateNS));
            this.m_renderProxy.lockRenderState();
        }
    }
    getRenderStateByName(stateNS: string): number {
        return RendererState.GetRenderStateByName(stateNS);
    }
    lockMaterial(): void {
        if (this.m_materialProxy != null) {
            this.m_materialProxy.lockMaterial();
        }
    }
    unlockMaterial(): void {
        if (this.m_materialProxy != null) {
            this.m_materialProxy.unlockMaterial();
        }
    }
    isUnlockMaterial(): boolean {
        return this.m_materialProxy.isUnlockMatrial();
    }
    useGlobalMaterial(material: IRenderMaterial, texUnlock: boolean = false, materialUniformUpdate: boolean = false): void {
        if (this.m_materialProxy != null) {
            this.m_materialProxy.unlockMaterial();
            if (texUnlock) {
                this.m_materialProxy.unlockTexture();
            } else {
                this.m_materialProxy.lockTexture();
            }
            this.m_materialProxy.useGlobalMaterial(material, materialUniformUpdate);
            this.m_materialProxy.lockMaterial();
        }
    }
    
    updateMaterialUniform(material: IRenderMaterial): void {
        this.m_materialProxy.updateMaterialUniform( material );
    }
    clearBackBuffer(): void {
        this.m_renderProxy.clearBackBuffer();
    }
    setScissorRect(px: number, py: number, pw: number, ph: number): void {
        this.m_adapter.setScissorRect(px, py, pw, ph);
    }
    setScissorEnabled(enabled: boolean): void {
        this.m_adapter.setScissorEnabled(enabled);
    }
    setViewPort(px: number, py: number, pw: number, ph: number): void {
        this.m_renderProxy.setViewPort(px, py, pw, ph);
    }
    synFBOSizeWithViewport(): void {
        this.m_adapter.synFBOSizeWithViewport();
    }
    asynFBOSizeWithViewport(): void {
        this.m_adapter.asynFBOSizeWithViewport();
    }
    // if synFBOSizeWithViewport is true, fbo size = factor * view port size;
    setFBOSizeFactorWithViewPort(factor: number): void {
        this.m_adapter.setFBOSizeFactorWithViewPort(factor);
    }
    createFBOAt(index: number, fboType: number, pw: number, ph: number, enableDepth: boolean = false, enableStencil: boolean = false, multisampleLevel: number = 0): void {
        this.m_adapter.createFBOAt(index, fboType, pw, ph, enableDepth, enableStencil, multisampleLevel);
    }
    bindFBOAt(index: number, fboType: number): void {
        this.m_adapter.bindFBOAt(index, fboType);
    }
    /**
     * bind a texture to fbo attachment by attachment index
     * @param texProxy  RTTTextureProxy instance
     * @param enableDepth  enable depth buffer yes or no
     * @param enableStencil  enable stencil buffer yes or no
     * @param attachmentIndex  fbo attachment index
     */
    setRenderToTexture(texProxy: IRenderTexture, enableDepth: boolean = false, enableStencil: boolean = false, attachmentIndex: number = 0): void {
        this.m_adapter.setRenderToTexture(texProxy, enableDepth, enableStencil, attachmentIndex);
    }
    useFBO(clearColorBoo: boolean = false, clearDepthBoo: boolean = false, clearStencilBoo: boolean = false): void {
        this.m_adapter.useFBO(clearColorBoo, clearDepthBoo, clearStencilBoo);
    }

    resetFBOAttachmentMask(boo: boolean): void {
        this.m_adapter.resetFBOAttachmentMask(boo);
    }
    setFBOAttachmentMaskAt(index: number, boo: boolean): void {
        this.m_adapter.setFBOAttachmentMaskAt(index, boo);
    }

    setRenderToBackBuffer(): void {
        if (this.m_adapter != null) {
            this.m_adapter.setRenderToBackBuffer(FrameBufferType.FRAMEBUFFER);
            this.m_materialProxy.renderBegin();
        }
    }
    lockViewport(): void {
        this.m_adapter.lockViewport();
    }
    unlockViewport(): void {
        this.m_adapter.unlockViewport();
    }
    setClearDepth(depth: number): void { this.m_adapter.setClearDepth(depth); }
    getClearDepth(): number { return this.m_adapter.getClearDepth(); }
    getViewportX(): number { return this.m_adapter.getViewportX(); }
    getViewportY(): number { return this.m_adapter.getViewportY(); }
    getViewportWidth(): number { return this.m_adapter.getViewportWidth(); }
    getViewportHeight(): number { return this.m_adapter.getViewportHeight(); }
    /**
     * 设置用于3D绘制的canvas的宽高尺寸,如果调用了此函数，则不会自动匹配窗口尺寸改变，默认是自动匹配窗口尺寸改变的
     * @param       pw 像素宽度
     * @param       ph 像素高度
    */
    setContextViewSize(pw: number, ph: number): void {
        this.m_adapter.setContextViewSize(pw, ph);
    }
    setCameraParam(fov: number, near: number, far: number): void {
        this.m_cameraFov = fov;
        this.m_cameraNear = near;
        this.m_cameraFar = far;
        if (this.m_renderProxy != null) {
            this.m_renderProxy.setCameraParam(fov, near, far);
        }
    }
    
    initialize(param: RendererParam, camera: IRenderCamera, contextParam: RendererInstanceContextParam): void {

        if (this.m_adapter == null) {

            this.m_renderProxy.setCameraParam(this.m_cameraFov, this.m_cameraNear, this.m_cameraFar);
            this.m_renderProxy.setWebGLMaxVersion(param.maxWebGLVersion);
            
            let proxyParam = new RenderProxyParam();
            proxyParam.uniformContext = contextParam.uniformContext;
            proxyParam.vtxBufUpdater = contextParam.builder;
            proxyParam.materialUpdater = contextParam.builder;
            proxyParam.vtxBuilder = contextParam.vtxBuilder;

            this.m_renderProxy.initialize(param, camera, contextParam.stage, proxyParam);

            this.m_rcuid = this.m_renderProxy.getRCUid();

            contextParam.vtxBuilder.initialize(this.m_rcuid, this.m_renderProxy.getRC(), this.m_renderProxy.getGLVersion());

            this.m_adapter = this.m_renderProxy.getRenderAdapter();
            this.m_adapter.bgColor.setRGBA4f(0.0, 0.0, 0.0, 1.0);

            let context: RAdapterContext = this.m_renderProxy.getContext();
            context.setViewport(0, 0, context.getRCanvasWidth(), context.getRCanvasHeight());

        }
    }
    initManager(builder: RODataBuilder): void {
        if (this.m_materialProxy == null) {
            this.m_materialProxy = new RenderMaterialProxy();
            this.m_materialProxy.setDispBuilder(builder);
        }
    }
    setClearRGBColor3f(pr: number, pg: number, pb: number): void {
        this.m_renderProxy.setClearRGBColor3f(pr, pg, pb);
    }
    setClearRGBAColor4f(pr: number, pg: number, pb: number, pa: number): void {
        this.m_renderProxy.setClearRGBAColor4f(pr, pg, pb, pa);
    }
    getClearRGBAColor4f(color4: Color4): void {
        color4.copyFrom(this.m_adapter.bgColor);
    }
    updateRenderBufferSize(): void {
        this.m_adapter.updateRenderBufferSize();
    }
    vertexRenderBegin(): void {
        this.m_renderProxy.Vertex.renderBegin();
    }
    /**
     * the function resets the renderer instance rendering status.
     * you should use it on the frame starting time.
     */
    renderBegin(cameraDataUpdate: boolean = true): void {
        if (this.m_adapter != null) {
            this.m_adapter.unlockViewport();
            //this.m_adapter.resetPolygonOffset();
            this.m_adapter.setClearDepth(1.0);
            this.m_renderProxy.Vertex.renderBegin();
            this.m_materialProxy.renderBegin();
            this.m_adapter.update();
            this.m_adapter.setClearMaskClearAll();
            this.m_adapter.renderBegin();
            RendererState.ResetInfo();
            RendererState.Reset(this.m_renderProxy.getRenderContext());
            if (cameraDataUpdate) {
                this.m_renderProxy.useCameraData();
                this.m_renderProxy.updateCameraDataFromCamera(this.m_renderProxy.getCamera());
            }
        }
    }
    resetState(): void {
        RendererState.ResetState();
        this.m_materialProxy.renderBegin();
    }
    resetmaterial(): void {
        this.m_materialProxy.renderBegin();
    }
    resetUniform(): void {
        this.m_materialProxy.resetUniform();
    }
    runEnd(): void {
    }
}
export {RendererInstanceContextParam, RendererInstanceContext};
export default RendererInstanceContext;