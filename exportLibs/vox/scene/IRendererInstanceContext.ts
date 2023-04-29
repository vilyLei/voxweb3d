/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// 真正位于高频运行的渲染管线中的被使用的渲染关键代理对象上下文

import IRenderStage3D from "../../vox/render/IRenderStage3D";
import { IRenderCamera } from "../../vox/render/IRenderCamera";
import { IRenderAdapter } from "../../vox/render/IRenderAdapter";
import IRenderTexture from "../../vox/render/texture/IRenderTexture";
import IRenderProxy from "../../vox/render/IRenderProxy";
import IRenderMaterial from "../../vox/render/IRenderMaterial";
import IColor4 from "../material/IColor4";

interface IRendererInstanceContext {

    /**
     * @returns return renderer context unique id
     */
    getRCUid(): number;
    getDiv(): any;
    getCanvas(): any;
    getRenderAdapter(): IRenderAdapter;
    //getRenderMaterialProxy(): RenderMaterialProxy;
    getRenderProxy(): IRenderProxy;
    getTextureResTotal(): number;
    getTextureAttachTotal(): number;

    getDevicePixelRatio(): number;
    getStage3D(): IRenderStage3D;
    getCamera(): IRenderCamera;
    cameraLock(): void;
    cameraUnlock(): void;
    updateCamera(): void;
    updateCameraDataFromCamera(cam: IRenderCamera): void;

    lockRenderColorMask(): void;
    unlockRendererColorMask(): void;
    useGlobalRenderColorMask(colorMask: number): void;
    useGlobalRenderColorMaskByName(stateNS: string): void;
    getRenderColorMaskByName(colorMaskNS: string): number;

    lockRenderState(): void;
    unlockRenderState(): void;
    useGlobalRenderState(state: number): void;
    useGlobalRenderStateByName(stateNS: string): void;
    getRenderStateByName(stateNS: string): number;
    lockMaterial(): void;
    unlockMaterial(): void;
    isUnlockMaterial(): boolean;
    /**
     * use global material
     * @param material current material
     * @param texUnlock the default value is false
     */
    useGlobalMaterial(material: IRenderMaterial, texUnlock: boolean, materialUniformUpdate: boolean): void;
    updateMaterialUniform(material: IRenderMaterial): void;
    clearBackBuffer(): void;
    setScissorRect(px: number, py: number, pw: number, ph: number): void;
    setScissorEnabled(enabled: boolean): void;
    setViewPort(px: number, py: number, pw: number, ph: number): void;
    synFBOSizeWithViewport(): void;
    asynFBOSizeWithViewport(): void;
    // if synFBOSizeWithViewport is true, fbo size = factor * view port size;
    setFBOSizeFactorWithViewPort(factor: number): void;
    createFBOAt(index: number, fboType: number, pw: number, ph: number, enableDepth: boolean, enableStencil: boolean, multisampleLevel: number): void;
    bindFBOAt(index: number, fboType: number): void;
    /**
     * bind a texture to fbo attachment by attachment index
     * @param texProxy  IRenderTexture instance
     * @param enableDepth  enable depth buffer yes or no
     * @param enableStencil  enable stencil buffer yes or no
     * @param attachmentIndex  fbo attachment index
     */
    setRenderToTexture(texProxy: IRenderTexture, enableDepth: boolean, enableStencil: boolean, attachmentIndex: number): void;
    useFBO(clearColorBoo: boolean, clearDepthBoo: boolean, clearStencilBoo: boolean): void;

    resetFBOAttachmentMask(boo: boolean): void;
    setFBOAttachmentMaskAt(index: number, boo: boolean): void;

    setRenderToBackBuffer(): void;
    lockViewport(): void;
    unlockViewport(): void;
    setClearDepth(depth: number): void;
    getClearDepth(): number;
    getViewportX(): number;
    getViewportY(): number;
    getViewportWidth(): number;
    getViewportHeight(): number;

    useGlobalMaterial(material: IRenderMaterial, texUnlock?: boolean, materialUniformUpdate?: boolean): void;
    updateMaterialUniform(material: IRenderMaterial): void;

    /**
     * 设置用于3D绘制的canvas的宽高尺寸,如果调用了此函数，则不会自动匹配窗口尺寸改变，默认是自动匹配窗口尺寸改变的
     * @param       pw 像素宽度
     * @param       ph 像素高度
    */
    setContextViewSize(pw: number, ph: number): void;
    setCameraParam(fov: number, near: number, far: number): void;
    setClearRGBColor3f(pr: number, pg: number, pb: number): void;
    setClearRGBAColor4f(pr: number, pg: number, pb: number, pa: number): void;
    getClearRGBAColor4f(color4: IColor4): void;
    updateRenderBufferSize(): void;
    vertexRenderBegin(): void;
    /**
     * the function resets the renderer instance rendering status.
     * you should use it on the frame starting time.
     */
    renderBegin(cameraDataUpdate?: boolean): void;
    resetState(): void;
    resetmaterial(): void;
    resetUniform(): void;
    runEnd(): void;
}
export { IRendererInstanceContext };
