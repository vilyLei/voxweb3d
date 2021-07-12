/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// 真正位于高频运行的渲染管线中的被使用的渲染关键代理对象

import RenderFilter from "../../vox/render/RenderFilter";
import RenderMaskBitfield from "../../vox/render/RenderMaskBitfield";
import MathConst from "../../vox/math/MathConst";
import Vector3D from "../../vox/math/Vector3D";
import Color4 from "../../vox/material/Color4";
import CameraBase from "../../vox/view/CameraBase";
import RendererParam from "../../vox/scene/RendererParam";
import IRenderStage3D from "../../vox/render/IRenderStage3D";
import { RODrawState, RenderStateObject, RenderColorMask } from "../../vox/render/RODrawState";
import RAdapterContext from "../../vox/render/RAdapterContext";
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
import RendererState from "./RendererState";

class RenderProxy {
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
    readonly RContext: any = null;
    readonly RState: RODrawState = null;

    readonly Vertex: IRenderResource = null;
    readonly Texture: IRenderTexResource = null;
    readonly VtxBufUpdater: IROVertexBufUpdater = null;
    readonly MaterialUpdater: IROMaterialUpdater = null;
    private m_uid: number = 0;
    private m_camUBO: any = null;
    private m_adapter: RenderAdapter = null;
    private m_adapterContext: RAdapterContext = new RAdapterContext();
    private m_rc: any = null;
    private m_perspectiveEnabled = true;
    private m_viewX: number = 0;
    private m_viewY: number = 0;
    private m_viewW: number = 800;
    private m_viewH: number = 600;
    private m_cameraNear: number = 0.1;
    private m_cameraFar: number = 5000.0;
    private m_cameraFov: number = 45.0;
    private m_maxWebGLVersion: number = 2;
    private m_WEBGL_VER: number = 2;
    // main camera
    private m_camera: CameraBase = null;
    private m_camSwitched: boolean = false;
    // 是否舞台尺寸和view自动同步一致
    private m_autoSynViewAndStage: boolean = true;
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
    getDiv(): any {
        return this.m_adapter.getDiv();
    }
    getCanvas(): any {
        return this.m_adapter.getCanvas();
    }
    cameraLock(): void {
        this.m_camera.lock();
    }
    cameraUnlock(): void {
        this.m_camera.unlock();
    }
    getCamera(): CameraBase {
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
    updateCameraDataFromCamera(camera: CameraBase): void {
        if (camera != null) {
            if (this.m_camSwitched || camera != this.m_camera) {
                this.m_camSwitched = camera != this.m_camera;
                camera.updateCamMatToUProbe(this.m_camera.matUProbe);
                if (this.m_camUBO != null) {
                    this.m_camUBO.setSubDataArrAt(0, camera.getViewMatrix().getLocalFS32());
                    this.m_camUBO.setSubDataArrAt(16, camera.getProjectMatrix().getLocalFS32());
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
        if (this.m_WEBGL_VER == 2) {
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
    getRenderAdapter(): RenderAdapter {
        return this.m_adapter;
    }
    setCameraParam(fov: number, near: number, far: number): void {
        this.m_cameraFov = fov;
        this.m_cameraNear = near;
        this.m_cameraFar = far;
    }
    getMouseXYWorldRay(rl_position: Vector3D, rl_tv: Vector3D): void {
        let stage: IRenderStage3D = this.m_adapterContext.getStage();
        this.m_camera.getWorldPickingRayByScreenXY(stage.mouseX, stage.mouseY, rl_position, rl_tv);
    }
    testViewPortChanged(px: number, py: number, pw: number, ph: number): boolean {
        
        return this.m_viewX != px || this.m_viewY != py || this.m_viewW != pw || this.m_viewH != ph;
    }
    setViewPort(px: number, py: number, pw: number, ph: number): void {
        this.m_autoSynViewAndStage = false;
        this.m_viewX = px;
        this.m_viewY = py;
        this.m_viewW = pw;
        this.m_viewH = ph;
        let stage: IRenderStage3D = this.m_adapterContext.getStage();
        if (stage != null) {
            stage.setViewPort(pw, py, pw, ph);
            if (this.m_camera != null) {
                this.m_camera.setViewXY(this.m_viewX, this.m_viewY);
                this.m_camera.setViewSize(this.m_viewW, this.m_viewH);
            }
        }
        this.setRCViewPort(this.m_viewX, this.m_viewY, this.m_viewW, this.m_viewH);
    }
    setRCViewPort(px: number, py: number, pw: number, ph: number,autoSynViewAndStage: boolean = false): void {
        this.m_autoSynViewAndStage = autoSynViewAndStage;
        this.m_adapterContext.setViewport(px, py, pw, ph);
    }
    reseizeRCViewPort(): void {
        this.m_adapter.unlockViewport();
        this.m_adapter.reseizeViewPort();
    }
    private resizeCallback(): void {
        //console.log("resizeCallback(), m_autoSynViewAndStage: "+this.m_autoSynViewAndStage);
        if (this.m_autoSynViewAndStage) {
            this.m_viewX = 0;
            this.m_viewY = 0;
            this.m_viewW = this.m_adapterContext.getRCanvasWidth();
            this.m_viewH = this.m_adapterContext.getRCanvasHeight();

            if (this.m_camera == null) {
                this.createMainCamera();
            }

            console.log("resizeCallback(), viewW,viewH: ", this.m_viewW+","+this.m_viewH);
            this.m_adapterContext.setViewport(this.m_viewX, this.m_viewY, this.m_viewW, this.m_viewH);
            this.m_camera.setViewXY(this.m_viewX, this.m_viewY);
            this.m_camera.setViewSize(this.m_viewW, this.m_viewH);
        }
    }
    private createMainCamera(): void {
        this.m_camera = new CameraBase(this.m_uid);
        this.m_camera.uniformEnabled = true;

        if (this.m_perspectiveEnabled) {
            this.m_camera.perspectiveRH(MathConst.DegreeToRadian(this.m_cameraFov), this.m_viewW / this.m_viewH, this.m_cameraNear, this.m_cameraFar);
        }
        else {
            this.m_camera.orthoRH(this.m_cameraNear, this.m_cameraFar, -0.5 * this.m_viewH, 0.5 * this.m_viewH, -0.5 * this.m_viewW, 0.5 * this.m_viewW);
        }
        this.m_camera.setViewXY(this.m_viewX, this.m_viewY);
        this.m_camera.setViewSize(this.m_viewW, this.m_viewH);
    }
    readPixels(px: number, py: number, width: number, height: number, format: number, dataType: number, pixels: Uint8Array): void {
        this.m_adapter.readPixels(px, py, width, height, format, dataType, pixels);
    }
    getGLVersion(): number {
        return this.m_WEBGL_VER;
    }
    initialize(param: RendererParam, stage: IRenderStage3D, materialUpdater: IROMaterialUpdater, vtxBufUpdater: IROVertexBufUpdater, vtxBuilder: IROVtxBuilder): void {
        if (this.m_rc != null) {
            return;
        }
        let posV3: Vector3D = param.camPosition;
        let lookAtPosV3: Vector3D = param.camLookAtPos;
        let upV3: Vector3D = param.camUpDirect;
        if (posV3 == null) posV3 = new Vector3D(500.0, 500.0, 500.0);
        if (lookAtPosV3 == null) lookAtPosV3 = new Vector3D(0.0, 0.0, 0.0);
        if (upV3 == null) upV3 = new Vector3D(0.0, 1.0, 0.0);
        this.m_perspectiveEnabled = param.cameraPerspectiveEnabled;
        this.m_adapterContext.autoSyncRenderBufferAndWindowSize = param.autoSyncRenderBufferAndWindowSize;
        this.m_adapterContext.setResizeCallback(this, this.resizeCallback);
        this.m_adapterContext.setWebGLMaxVersion(this.m_maxWebGLVersion);
        this.m_adapterContext.initialize(this.m_uid, stage, param.getDiv(), param.getRenderContextAttri());
        this.m_WEBGL_VER = this.m_adapterContext.getWebGLVersion();

        this.m_rc = this.m_adapterContext.getRC();
        RendererState.Initialize();
        RendererState.Rstate.setRenderContext( this.m_adapterContext );

        let selfT: any = this;
        let gl: any = this.m_rc;
        let vtxRes: ROVertexResource = new ROVertexResource(this.m_uid, gl, vtxBuilder);
        let texRes: ROTextureResource = new ROTextureResource(this.m_uid, gl);
        selfT.Vertex = vtxRes;
        selfT.Texture = texRes;
        selfT.MaterialUpdater = materialUpdater;
        selfT.VtxBufUpdater = vtxBufUpdater;
        this.m_viewW = this.m_adapterContext.getViewportWidth();
        this.m_viewH = this.m_adapterContext.getViewportHeight();

        this.m_adapter = new RenderAdapter(this.m_uid, texRes);
        this.m_adapter.initialize(this.m_adapterContext, param, RendererState.Rstate);

        if (this.m_autoSynViewAndStage) {
            let stage: IRenderStage3D = this.m_adapterContext.getStage();
            if (stage != null) {
                this.m_viewW = stage.stageWidth;
                this.m_viewH = stage.stageHeight;
            }
        }
        if (this.m_camera == null) {
            this.createMainCamera();
        }
        this.m_adapterContext.setViewport(this.m_viewX, this.m_viewY, this.m_viewW, this.m_viewH);
        this.m_camera.lookAtRH(posV3, lookAtPosV3, upV3);
        this.m_camera.update();
        this.m_adapter.bgColor.setRGB3f(0.0, 0.0, 0.0);
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
        selfT.RState = RendererState.Rstate;//this.m_adapterContext.getRenderState();
        selfT.RContext = this.m_rc;
    }
    flush(): void {
        this.m_rc.flush();
    }
    createCamera(): CameraBase {
        return new CameraBase(this.m_uid);
    }
    setClearRGBColor3f(pr: number, pg: number, pb: number) {
        this.m_adapter.bgColor.setRGB3f(pr, pg, pb);
    }
    setClearColor(color: Color4): void {
        this.m_adapter.bgColor.copyFrom(color);
    }
    setClearUint24Color(colorUint24: number, alpha: number): void {
        this.m_adapter.bgColor.setRGBUint24(colorUint24);
        this.m_adapter.bgColor.a = alpha;
    }
    setClearRGBAColor4f(pr: number, pg: number, pb: number, pa: number): void {
        this.m_adapter.bgColor.setRGBA4f(pr, pg, pb, pa);
    }
    getClearRGBAColor4f(color4: Color4): void {
        color4.copyFrom(this.m_adapter.bgColor);
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
    renderBegin() {
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
     * @param faceFlipped the value is true, frontFace is CW. the value is false, frontFace is CCW. 
     */
    setFrontFaceFlipped(faceFlipped: boolean): void {
        this.m_adapter.setFrontFaceFlipped(faceFlipped);
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
export default RenderProxy;