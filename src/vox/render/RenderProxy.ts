/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IVector3D from "../../vox/math/IVector3D";
import AABB2D from "../geom/AABB2D";
import IColor4 from "../../vox/material/IColor4";

import RenderFilter from "../../vox/render/RenderFilter";
import RenderMaskBitfield from "../../vox/render/RenderMaskBitfield";
import { IRenderCamera } from "./IRenderCamera";
import IRendererParam from "../../vox/scene/IRendererParam";
import IRenderStage3D from "../../vox/render/IRenderStage3D";

import { RODrawState } from "../../vox/render/rendering/RODrawState";
import { RenderColorMask } from "../../vox/render/rendering/RenderColorMask";
import { RenderStateObject } from "../../vox/render/rendering/RenderStateObject";

import { IRAdapterContext } from "./IRAdapterContext";
import RAdapterContext from "../../vox/render/RAdapterContext";
import { IRenderAdapter } from "../../vox/render/IRenderAdapter";
import RenderAdapter from "../../vox/render/RenderAdapter";
import RenderFBOProxy from "../../vox/render/RenderFBOProxy";
import RCExtension from "../../vox/render/RCExtension";
import IROVtxBuilder from "../../vox/render/IROVtxBuilder";

import IRenderResource from '../../vox/render/IRenderResource';
import IRenderTexResource from '../../vox/render/IRenderTexResource';
import ROVertexResource from '../../vox/render/ROVertexResource';
import ROTextureResource from '../../vox/render/ROTextureResource';
import IROVertexBufUpdater from '../../vox/render/IROVertexBufUpdater';
import IROMaterialUpdater from '../../vox/render/IROMaterialUpdater';
import DivLog from "../../vox/utils/DivLog";
import RSTBuilder from "./RSTBuilder";
import RendererState from "./RendererState";
import IRenderProxy from "./IRenderProxy";
import { IShaderUniformContext } from "../../vox/material/IShaderUniformContext";
import { IStencil } from "../../vox/render/rendering/IStencil";
import { RenderingStencil } from "./rendering/RenderingStencil";
import VROBase from "./VROBase";

import { IRenderingColorMask } from "./rendering/IRenderingColorMask";
import { RenderingColorMask } from "./rendering/RenderingColorMask";
import { IRenderingState } from "./rendering/IRenderingState";
import { RenderingState } from "./rendering/RenderingState";

import { IRPStatus } from "./status/IRPStatus";
import { RPStatus } from "./status/RPStatus";
import IRenderShader from "../../vox/render/IRenderShader";
import IRODataBuilder from "../../vox/render/IRODataBuilder";

class RenderProxyParam {

    materialUpdater: IROMaterialUpdater = null;
    vtxBufUpdater: IROVertexBufUpdater = null;
    vtxBuilder: IROVtxBuilder = null;
    uniformContext: IShaderUniformContext = null;

    constructor() { }
}
/**
 * 真正位于高频运行的渲染管线中的被使用的渲染关键代理对象
 */
class RenderProxy implements IRenderProxy {

    readonly RGBA: number = 0;
    readonly UNSIGNED_BYTE: number = 0;
    readonly TRIANGLE_STRIP: number = 0;
    readonly TRIANGLE_FAN: number = 0;
    readonly TRIANGLES: number = 0;
    readonly LINES: number = 0;
    readonly LINE_STRIP: number = 0;
    readonly UNSIGNED_SHORT: number = 0;
    readonly UNSIGNED_INT: number = 0;
    readonly COLOR: number = 0;
    readonly DEPTH: number = 0;
    readonly STENCIL: number = 0;
    readonly DEPTH_STENCIL: number = 0;

    readonly MAX: number = 0;
    readonly MIN: number = 0;
    /**
     * WebGL GPU Context instance
     */
    readonly RContext: any = null;
    readonly RDrawState: RODrawState = null;

    readonly Vertex: IRenderResource = null;
    readonly Texture: IRenderTexResource = null;
    readonly VtxBufUpdater: IROVertexBufUpdater = null;
    readonly MaterialUpdater: IROMaterialUpdater = null;
    readonly uniformContext: IShaderUniformContext = null;

    readonly adapter: IRenderAdapter = null;
    readonly stencil: IStencil = null;
    readonly renderingState: IRenderingState = null;
    readonly colorMask: IRenderingColorMask = null;
    readonly rshader: IRenderShader = null;
    readonly rdataBuilder: IRODataBuilder = null;
    readonly status = new RPStatus();

    private m_uid: number = 0;
    private m_camUBO: any = null;
    private m_adapter: RenderAdapter = null;
    private m_adapterContext = new RAdapterContext();
    private m_vtxRes: ROVertexResource;
    private m_rc: any = null;
    private m_perspectiveEnabled = true;
    private m_viewPortRect = new AABB2D(0, 0, 800, 600);
    private m_cameraNear = 0.1;
    private m_cameraFar = 5000.0;
    private m_cameraFov = 45.0;
    private m_maxWebGLVersion = 2;
    private m_WEBGL_VER = 2;
    // main camera
    private m_camera: IRenderCamera = null;
    private m_camSwitched = false;
    // 是否舞台尺寸和view自动同步一致
    private m_autoSynViewAndStage = true;

    constructor(rcuid: number) {
        this.m_uid = rcuid;
    }
    /**
     * @returns return system gpu context
     */
    getRC(): any {
        return this.m_rc;
    }
    getUid(): number {
        return this.m_uid;
    }
    /**
     * @returns return renderer context unique id
     */
    getRCUid(): number {
        return this.m_uid;
    }
    isAutoSynViewAndStage(): boolean {
        return this.m_autoSynViewAndStage;
    }
    enableSynViewAndStage(): void {
        this.m_autoSynViewAndStage = true;
    }

    lockViewport(): void {
        this.m_adapter.lockViewport();
    }
    unlockViewport(): void {
        this.m_adapter.unlockViewport();
    }
    getDiv(): HTMLDivElement {
        return this.m_adapter.getDiv();
    }
    getCanvas(): HTMLCanvasElement {
        return this.m_adapter.getCanvas();
    }
    cameraLock(): void {
        this.m_camera.lock();
    }
    cameraUnlock(): void {
        this.m_camera.unlock();
    }
    getCamera(): IRenderCamera {
        return this.m_camera;
    }
    updateCamera(): void {
        return this.m_camera.update();
    }
    createCameraUBO(shd: any): void {
        //  if(this.m_camUBO == null)
        //  {
        //      this.m_camUBO = ShaderUBOBuilder.createUBOWithDataFloatsCount("UBlock_Camera", shd, 32);
        //      this.m_camUBO.setSubDataArrAt(0, m_camera.getViewMatrix().getLocalFS32());
        //      this.m_camUBO.setSubDataArrAt(16, m_camera.getProjectMatrix().getLocalFS32());
        //      this.m_camUBO.run();
        //  }
    }
    updateCameraDataFromCamera(camera: IRenderCamera): void {
        if (camera != null) {
            if (this.m_camSwitched || camera != this.m_camera) {
                this.m_camSwitched = camera != this.m_camera;
                camera.updateCamMatToUProbe(this.m_camera.matUProbe);
                if (this.m_camUBO != null) {
                    this.m_camUBO.setSubDataArrAt(0, camera.matUProbe.getFS32At(0));
                    this.m_camUBO.setSubDataArrAt(16, camera.matUProbe.getFS32At(1));
                    //this.m_camUBO.setSubDataArrAt(0, camera.getViewMatrix().getLocalFS32());
                    //this.m_camUBO.setSubDataArrAt(16, camera.getProjectMatrix().getLocalFS32());
                }
            }
        }
    }
    useCameraData(): void {
        if (this.m_camUBO != null) {
            this.m_camUBO.run();
        }
    }
    getActiveAttachmentTotal(): number {
        return this.m_adapter.getActiveAttachmentTotal();
    }

    drawInstanced(count: number, offset: number, instanceCount: number): void {
        if (this.isWebGL2()) {
            this.m_rc.drawElementsInstanced(this.TRIANGLES, count, this.UNSIGNED_SHORT, offset, instanceCount);
        }
        else {
            RCExtension.ANGLE_instanced_arrays.drawElementsInstancedANGLE(this.TRIANGLES, count, offset, instanceCount);
        }
    }
    createUBOBufferByBytesCount(bytesCount: number): any {
        let buf: any = this.m_rc.createBuffer();
        this.m_rc.bindBuffer(this.m_rc.UNIFORM_BUFFER, buf);
        this.m_rc.bufferData(this.m_rc.UNIFORM_BUFFER, bytesCount, this.m_rc.DYNAMIC_DRAW);
        return buf;
    }
    createUBOBufferByDataArray(dataArray: Float32Array): any {
        let buf: any = this.m_rc.createBuffer();
        this.m_rc.bindBuffer(this.m_rc.UNIFORM_BUFFER, buf);
        this.m_rc.bufferData(this.m_rc.UNIFORM_BUFFER, dataArray, this.m_rc.DYNAMIC_DRAW);
        return buf;
    }
    bindUBOBuffer(buf: any): void {
        this.m_rc.bindBuffer(this.m_rc.UNIFORM_BUFFER, buf);
    }
    deleteUBOBuffer(buf: any): void {
        this.m_rc.deleteBuffer(buf);
    }
    bufferDataUBOBuffer(dataArr: Float32Array): void {
        this.m_rc.bufferData(this.m_rc.UNIFORM_BUFFER, dataArr, this.m_rc.STATIC_DRAW);
    }
    bindBufferBaseUBOBuffer(bindingIndex: number, buf: any): void {
        this.m_rc.bindBufferBase(this.m_rc.UNIFORM_BUFFER, bindingIndex, buf);
    }
    setWebGLMaxVersion(webgl_ver: number): void {
        if (webgl_ver == 1 || webgl_ver == 2) {
            this.m_maxWebGLVersion = webgl_ver;
        }
    }
    getContext(): RAdapterContext {
        return this.m_adapterContext;
    }
    getStage3D(): IRenderStage3D {
        return this.m_adapterContext.getStage();
    }
    getRenderAdapter(): IRenderAdapter {
        return this.m_adapter;
    }

    getRenderContext(): IRAdapterContext {
        return this.m_adapter.getRenderContext();
    }
    setCameraParam(fov: number, near: number, far: number): void {
        this.m_cameraFov = fov;
        this.m_cameraNear = near;
        this.m_cameraFar = far;
    }
    getMouseXYWorldRay(rl_position: IVector3D, rl_tv: IVector3D): void {
        let stage = this.m_adapterContext.getStage();
        this.m_camera.getWorldPickingRayByScreenXY(stage.mouseX, stage.mouseY, rl_position, rl_tv);
    }
    testViewPortChanged(px: number, py: number, pw: number, ph: number): boolean {
        return this.m_viewPortRect.testEqualWithParams(px, py, pw, ph);
    }
    testRCViewPortChanged(px: number, py: number, pw: number, ph: number): boolean {
        return this.m_adapterContext.testViewPortChanged(px, py, pw, ph);
    }
    getViewX(): number { return this.m_viewPortRect.x; }
    getViewY(): number { return this.m_viewPortRect.y; }
    getViewWidth(): number { return this.m_viewPortRect.width; }
    getViewHeight(): number { return this.m_viewPortRect.height; }
    setViewPort(px: number, py: number, pw: number, ph: number): void {

        this.m_autoSynViewAndStage = false;

        this.m_viewPortRect.setTo(px, py, pw, ph);
        let stage = this.m_adapterContext.getStage();
        if (stage) {
            stage.setViewPort(pw, py, pw, ph);
            this.updateCameraView();
        }
        this.m_adapterContext.setViewport(px, py, pw, ph);
    }
    setRCViewPort(px: number, py: number, pw: number, ph: number, autoSynViewAndStage: boolean = false): void {
        this.m_autoSynViewAndStage = autoSynViewAndStage;
        this.m_adapterContext.setViewport(px, py, pw, ph);
    }
    reseizeRCViewPort(): void {
        this.m_adapter.unlockViewport();
        this.m_adapter.reseizeViewPort();
    }
    private updateCameraView(): void {
        if (this.m_camera != null) {
            let rect = this.m_viewPortRect;
            this.m_camera.setViewXY(rect.x, rect.y);
            this.m_camera.setViewSize(rect.width, rect.height);
        }
    }
    private resizeCallback(): void {
        // console.log("XXX resizeCallback(), m_autoSynViewAndStage: "+this.m_autoSynViewAndStage);
        if (this.m_autoSynViewAndStage) {
            let rect = this.m_viewPortRect;
            rect.setSize(this.m_adapterContext.getRCanvasWidth(), this.m_adapterContext.getRCanvasHeight());

            this.createMainCamera();

            console.log("resizeCallback(), viewW,viewH: ", rect.width+","+rect.height);
            this.m_adapterContext.setViewport(rect.x, rect.y, rect.width, rect.height);

            this.updateCameraView();
        }
    }
    private m_initMainCamera: boolean = true;
    private createMainCamera(): void {

        if (this.m_initMainCamera) {

            this.m_initMainCamera = false;
            this.m_camera.uniformEnabled = true;

            let rect = this.m_viewPortRect;

            if (this.m_perspectiveEnabled) {
                this.m_camera.perspectiveRH((Math.PI * this.m_cameraFov) / 180.0, rect.width / rect.height, this.m_cameraNear, this.m_cameraFar);
            }
            else {
                this.m_camera.orthoRH(this.m_cameraNear, this.m_cameraFar, -0.5 * rect.height, 0.5 * rect.height, -0.5 * rect.width, 0.5 * rect.width);
            }
            this.updateCameraView();
        }
    }
    readPixels(px: number, py: number, width: number, height: number, format: number, dataType: number, pixels: Uint8Array): void {
        this.m_adapter.readPixels(px, py, width, height, format, dataType, pixels);
    }
    getGLVersion(): number {
        return this.m_WEBGL_VER;
    }
    isWebGL2(): boolean {
        return this.m_WEBGL_VER == 2;
    }
    isWebGL1(): boolean {
        return this.m_WEBGL_VER == 1;
    }
    private buildCameraParam(): void {

        let camera = this.m_camera;

        if (camera.matUProbe == null) {
            camera.matUProbe = this.uniformContext.createShaderUniformProbe();
            camera.matUProbe.addMat4Data(new Float32Array(16), 1);
            camera.matUProbe.addMat4Data(new Float32Array(16), 1);
        }
        if (camera.ufrustumProbe == null) {
            camera.ufrustumProbe = this.uniformContext.createShaderUniformProbe();
            camera.ufrustumProbe.addVec4Data(
                new Float32Array([
                    camera.getZNear(),
                    camera.getZFar(),
                    camera.getNearPlaneWidth() * 0.5,
                    camera.getNearPlaneHeight() * 0.5
                ]),
                1);
        }
        if (camera.ucameraPosProbe == null) {
            camera.ucameraPosProbe = this.uniformContext.createShaderUniformProbe();
            camera.ucameraPosProbe.addVec4Data(
                new Float32Array([500.0, 500.0, 500.0, 1.0]),
                1);
        }
    }
    initialize(param: IRendererParam, camera: IRenderCamera, stage: IRenderStage3D, proxyParam: RenderProxyParam): void {
        if (this.m_rc != null) {
            return;
        }
        this.m_camera = camera;

        let posV3: IVector3D = param.camPosition;
        let lookAtPosV3: IVector3D = param.camLookAtPos;
        let upV3: IVector3D = param.camUpDirect;

        if (stage != null) stage.uProbe = proxyParam.uniformContext.createUniformVec4Probe(1);

        this.m_perspectiveEnabled = param.cameraPerspectiveEnabled;
        this.m_adapterContext.autoSyncRenderBufferAndWindowSize = param.autoSyncRenderBufferAndWindowSize;
        this.m_adapterContext.setResizeCallback(():void=>{
            this.resizeCallback();
        });
        this.m_adapterContext.setWebGLMaxVersion(this.m_maxWebGLVersion);
        this.m_adapterContext.initialize(this.m_uid, stage, param);
        this.m_WEBGL_VER = this.m_adapterContext.getWebGLVersion();
        this.m_rc = this.m_adapterContext.getRC();

        let selfT: any = this;
        let gl: any = this.m_rc;
        let vtxRes = new ROVertexResource(this.m_uid, gl, proxyParam.vtxBuilder);
        let texRes = new ROTextureResource(this.m_uid, gl);
        this.m_vtxRes = vtxRes;
        selfT.Vertex = vtxRes;
        selfT.Texture = texRes;
        selfT.MaterialUpdater = proxyParam.materialUpdater;
        selfT.VtxBufUpdater = proxyParam.vtxBufUpdater;
        selfT.uniformContext = proxyParam.uniformContext;

        let rstate = new RODrawState();
        rstate.setRenderContext(this.m_adapterContext);
        // RendererState.Initialize(rstate, new VROBase());
        let obj: any = RendererState;
        new RSTBuilder().initialize(obj, rstate, new VROBase());

        selfT.RState = rstate;
        selfT.RContext = this.m_rc;
        selfT.stencil = new RenderingStencil(rstate);
        selfT.renderingState = new RenderingState(RendererState);
        selfT.colorMask = new RenderingColorMask(RendererState);

        this.buildCameraParam();

        let rect = this.m_viewPortRect;
        rect.setSize(this.m_adapterContext.getRCanvasWidth(), this.m_adapterContext.getRCanvasHeight());

        this.m_adapter = new RenderAdapter(this.m_uid, texRes);
        this.m_adapter.initialize(this.m_adapterContext, param, rstate, this.uniformContext.createUniformVec4Probe(1));

        selfT.adapter = this.m_adapter;
        if (this.m_autoSynViewAndStage) {
            let stage = this.m_adapterContext.getStage();
            if (stage != null) {
                rect.setSize(rect.width, rect.height);
            }
        }

        this.createMainCamera();

        this.m_adapterContext.setViewport(rect.x, rect.y, rect.width, rect.height);
        this.m_camera.lookAtRH(posV3, lookAtPosV3, upV3);
        this.m_camera.update();

        selfT.RGBA = gl.RGBA;
        selfT.UNSIGNED_BYTE = gl.UNSIGNED_BYTE;
        selfT.TRIANGLE_STRIP = gl.TRIANGLE_STRIP;
        selfT.TRIANGLE_FAN = gl.TRIANGLE_FAN;
        selfT.TRIANGLES = gl.TRIANGLES;
        selfT.LINES = this.m_rc.LINES;
        selfT.LINE_STRIP = gl.LINE_STRIP;
        selfT.UNSIGNED_SHORT = gl.UNSIGNED_SHORT;
        selfT.UNSIGNED_INT = gl.UNSIGNED_INT;
        selfT.COLOR = gl.COLOR;
        selfT.DEPTH = gl.DEPTH;
        selfT.STENCIL = gl.STENCIL;
        selfT.DEPTH_STENCIL = gl.DEPTH_STENCIL;
        if (this.m_WEBGL_VER > 1) {
            selfT.MIN = gl.MIN;
            selfT.MAX = gl.MAX;
        }
        else {
            selfT.MIN = RCExtension.EXT_blend_minmax.MIN_EXT;
            selfT.MAX = RCExtension.EXT_blend_minmax.MAX_EXT;
        }
        let classRenderFilter: any = RenderFilter;
        classRenderFilter.NEAREST = gl.NEAREST;
        classRenderFilter.LINEAR = gl.LINEAR;
        classRenderFilter.LINEAR_MIPMAP_LINEAR = gl.LINEAR_MIPMAP_LINEAR;
        classRenderFilter.NEAREST_MIPMAP_NEAREST = gl.NEAREST_MIPMAP_NEAREST;
        classRenderFilter.LINEAR_MIPMAP_NEAREST = gl.LINEAR_MIPMAP_NEAREST;
        classRenderFilter.NEAREST_MIPMAP_LINEAR = gl.NEAREST_MIPMAP_LINEAR;
        let classRenderMaskBitfield: any = RenderMaskBitfield;
        classRenderMaskBitfield.COLOR_BUFFER_BIT = gl.COLOR_BUFFER_BIT;
        classRenderMaskBitfield.DEPTH_BUFFER_BIT = gl.DEPTH_BUFFER_BIT;
        classRenderMaskBitfield.STENCIL_BUFFER_BIT = gl.STENCIL_BUFFER_BIT;
        RenderFBOProxy.SetRenderer(this.m_adapterContext);
    }
    flush(): void {
        this.m_rc.flush();
    }
    setClearRGBColor3f(pr: number, pg: number, pb: number): void {
        let cvs = this.m_adapter.bgColor;
        cvs[0] = pr; cvs[1] = pg; cvs[2] = pb;
        this.adapter.syncHtmlBodyColor();
    }
    setClearColor(color: IColor4): void {
        color.toArray4(this.m_adapter.bgColor);
        this.adapter.syncHtmlBodyColor();
    }
    /**
     * @param colorUint24 uint24 number rgb color value, example: 0xff0000, it is red rolor
     * @param alpha the default value is 1.0
     */
    setClearUint24Color(colorUint24: number, alpha: number = 1.0): void {
        let cvs = this.m_adapter.bgColor;
        cvs[0] = ((colorUint24 >> 16) & 0x0000ff) / 255.0;
        cvs[1] = ((colorUint24 >> 8) & 0x0000ff) / 255.0;
        cvs[2] = (colorUint24 & 0x0000ff) / 255.0;
        cvs[3] = alpha;
        this.adapter.syncHtmlBodyColor();
    }
    setClearRGBAColor4f(pr: number, pg: number, pb: number, pa: number): void {
        let cvs = this.m_adapter.bgColor;
        cvs[0] = pr; cvs[1] = pg; cvs[2] = pb; cvs[3] = pa;
        this.adapter.syncHtmlBodyColor();
    }
    getClearRGBAColor4f(color4: IColor4): void {
        color4.fromArray4(this.m_adapter.bgColor);
    }
    getViewportWidth(): number {
        return this.m_adapter.getViewportWidth();
    }
    getViewportHeight(): number {
        return this.m_adapter.getViewportHeight();
    }
    setRenderToBackBuffer(): void {
        this.m_adapter.setRenderToBackBuffer();
    }
    clearBackBuffer(): void {
        this.m_adapter.clear();
    }
    clearDepth(depth: number = 1.0): void {
        this.m_adapter.clearDepth(depth);
    }
    renderBegin(): void {
        this.m_camera.update();
        this.m_adapter.renderBegin();
    }

    renderEnd(): void {
    }
    useRenderStateByName(stateName: string): void {
        RenderStateObject.UseRenderStateByName(stateName);
    }
    setScissorEnabled(boo: boolean): void {
        this.m_adapterContext.setScissorEnabled(boo);
    }
    setScissorRect(px: number, py: number, pw: number, ph: number): void {
        this.m_adapterContext.setScissorRect(px, py, pw, ph);
    }
    useRenderColorMask(state: number): void {
        RenderColorMask.UseRenderState(state);
    }
    unlockRenderColorMask(): void {
        RenderColorMask.Unlock();
    }
    lockRenderColorMask(): void {
        RenderColorMask.Lock();
    }
    useRenderState(state: number): void {
        RenderStateObject.UseRenderState(state);
    }
    unlockRenderState(): void {
        RenderStateObject.Unlock();
    }
    lockRenderState(): void {
        RenderStateObject.Lock();
    }
    /**
     * set the updating times total that update vertex data to gpu in one frame time
     * @param total updating times total, the min value is 4, the default value is 16
     */
    setVtxUpdateTimesTotal(total: number): void {
        this.m_vtxRes.setVtxUpdateTimesTotal(total);
    }

    /**
     * @param faceFlipped the value is true, frontFace is CW. the value is false, frontFace is CCW.
     */
    setFrontFaceFlipped(faceFlipped: boolean): void {
        this.m_adapter.setFrontFaceFlipped(faceFlipped);
    }
    enabledPolygonOffset(): void {
        this.m_adapter.enabledPolygonOffset();
    }
    disabledPolygonOffset(): void {
        this.m_adapter.disabledPolygonOffset();
    }
    /*
     * specifies the scale factors and units to calculate depth values.
     * @param factor the value is a GLfloat which sets the scale factor for the variable depth offset for each polygon. The default value is 0.
     * @param units the value is a which sets the multiplier by which an implementation-specific value is multiplied with to create a constant depth offset. The default value is 0.
     */
    setPolygonOffset(factor: number, units: number = 0.0): void {
        this.m_adapter.setPolygonOffset(factor, units);
    }
    /*
     * reset the scale factors and units value is default value(0.0).
     */
    resetPolygonOffset(): void {
        this.m_adapter.resetPolygonOffset();
    }

    loseContext(): void {
        this.m_adapter.loseContext();
    }
    /**
     * @returns return gpu context lost status
     */
    isContextLost(): boolean {
        return this.m_adapter.isContextLost();
    }
    setViewProbeValue(x: number, y: number, width: number, height: number): void {
        this.m_adapter.setViewProbeValue(x, y, width, height);
    }
    toString(): string {
        return "[Object RenderProxy()]";
    }
}
export { RenderProxyParam, RenderProxy }
export default RenderProxy;
