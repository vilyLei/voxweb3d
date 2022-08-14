/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IVector3D from "../../vox/math/IVector3D";
import IColor4 from "../../vox/material/IColor4";
import { IRenderCamera } from "./IRenderCamera";
import IRenderStage3D from "../../vox/render/IRenderStage3D";
import { IRAdapterContext } from "../../vox/render/IRAdapterContext";
import { IRenderAdapter } from "../../vox/render/IRenderAdapter";

import IRenderResource from '../../vox/render/IRenderResource';
import IRenderTexResource from '../../vox/render/IRenderTexResource';
import IROVertexBufUpdater from '../../vox/render/IROVertexBufUpdater';
import IROMaterialUpdater from '../../vox/render/IROMaterialUpdater';
import { IShaderUniformContext } from "../../vox/material/IShaderUniformContext";

import { IStencil } from "../../vox/render/rendering/IStencil";
import { IRenderingColorMask } from "./rendering/IRenderingColorMask";
import { IRenderingState } from "./rendering/IRenderingState";

import { IRPStatus } from "./status/IRPStatus";

export default interface IRenderProxy {

    RGBA: number;
    UNSIGNED_BYTE: number;
    TRIANGLE_STRIP: number;
    TRIANGLE_FAN: number;
    TRIANGLES: number;
    LINES: number;
    LINE_STRIP: number;
    UNSIGNED_SHORT: number;
    UNSIGNED_INT: number;
    COLOR: number;
    DEPTH: number;
    STENCIL: number;
    DEPTH_STENCIL: number;

    MAX: number;
    MIN: number;
    RContext: any;
    //RState: RODrawState = null;

    Vertex: IRenderResource;
    Texture: IRenderTexResource;
    VtxBufUpdater: IROVertexBufUpdater;
    MaterialUpdater: IROMaterialUpdater;
    uniformContext: IShaderUniformContext;

    readonly stencil: IStencil;
    readonly renderingState: IRenderingState;
    readonly colorMask: IRenderingColorMask;
    readonly status: IRPStatus;
    /**
     * @returns return system gpu context
     */
    getRC(): any;
    getUid(): number;
    /**
     * @returns return renderer context unique id
     */
    getRCUid(): number;
    isAutoSynViewAndStage(): boolean;
    enableSynViewAndStage(): void;

    lockViewport(): void;
    unlockViewport(): void;
    getDiv(): any;
    getCanvas(): any;
    cameraLock(): void;
    cameraUnlock(): void;
    getCamera(): IRenderCamera;
    updateCamera(): void;
    createCameraUBO(shd: any): void;
    updateCameraDataFromCamera(camera: IRenderCamera): void;
    useCameraData(): void;
    getActiveAttachmentTotal(): number;
    drawInstanced(count: number, offset: number, instanceCount: number): void;
    createUBOBufferByBytesCount(bytesCount: number): any;
    createUBOBufferByDataArray(dataArray: Float32Array): any;
    bindUBOBuffer(buf: any): void;
    deleteUBOBuffer(buf: any): void;
    bufferDataUBOBuffer(dataArr: Float32Array): void;
    bindBufferBaseUBOBuffer(bindingIndex: number, buf: any): void;
    setWebGLMaxVersion(webgl_ver: number): void;
    //getContext(): RAdapterContext;
    getStage3D(): IRenderStage3D;
    getRenderAdapter(): IRenderAdapter;

    getRenderContext(): IRAdapterContext;
    setCameraParam(fov: number, near: number, far: number): void;
    getMouseXYWorldRay(rl_position: IVector3D, rl_tv: IVector3D): void;
    testViewPortChanged(px: number, py: number, pw: number, ph: number): boolean;
    testRCViewPortChanged(px: number, py: number, pw: number, ph: number): boolean;
    getViewX(): number;
    getViewY(): number;
    getViewWidth(): number;
    getViewHeight(): number;
    setViewPort(px: number, py: number, pw: number, ph: number): void;
    setRCViewPort(px: number, py: number, pw: number, ph: number, autoSynViewAndStage: boolean): void;
    reseizeRCViewPort(): void;

    readPixels(px: number, py: number, width: number, height: number, format: number, dataType: number, pixels: Uint8Array): void;
    getGLVersion(): number;
    flush(): void;
    //createCamera(): IRenderCamera {
    //    return new IRenderCamera(this.m_uid);
    //}
    setClearRGBColor3f(pr: number, pg: number, pb: number): void;
    setClearColor(color: IColor4): void;
    /**
     * @param colorUint24 uint24 number rgb color value, example: 0xff0000, it is red rolor
     * @param alpha the default value is 1.0
     */
    setClearUint24Color(colorUint24: number, alpha?: number): void;
    setClearRGBAColor4f(pr: number, pg: number, pb: number, pa: number): void;
    getClearRGBAColor4f(color4: IColor4): void;
    getViewportWidth(): number;
    getViewportHeight(): number;
    setRenderToBackBuffer(): void;
    clearBackBuffer(): void;
    /**
     *
     * @param depth the derault value is 1.0
     */
    clearDepth(depth?: number): void;
    renderBegin(): void;

    renderEnd(): void;
    useRenderStateByName(stateName: string): void;
    setScissorEnabled(boo: boolean): void;
    setScissorRect(px: number, py: number, pw: number, ph: number): void;
    useRenderColorMask(state: number): void;
    unlockRenderColorMask(): void;
    lockRenderColorMask(): void;
    useRenderState(state: number): void;
    unlockRenderState(): void;
    lockRenderState(): void;
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

    loseContext(): void;
    /**
     * @returns return gpu context lost status
     */
    isContextLost(): boolean;
    setViewProbeValue(x: number, y: number, width: number, height: number): void;
	setVtxUpdateTimesTotal(timesTotal: number): void;
}
