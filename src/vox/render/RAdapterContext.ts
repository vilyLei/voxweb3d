/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import DivLog from "../../vox/utils/DivLog";
import RCExtension from "../../vox/render/RCExtension";
import RendererDevice from "../../vox/render/RendererDevice";
import RViewElement from "../../vox/render/RViewElement";
import Color4 from "../../vox/material/Color4";
import IRenderStage3D from "../../vox/render/IRenderStage3D";
import ContextMouseEvtDispatcher from "../../vox/render/ContextMouseEvtDispatcher";
import { GLBlendMode, GLBlendEquation, CullFaceMode, GLStencilFunc, GLStencilOp } from "./RenderConst";

class RAdapterContext {
    constructor() { }
	private static s_uid:number = 0;
	private m_uid:number = RAdapterContext.s_uid++;
    private m_mouseEvtDisplather: ContextMouseEvtDispatcher = new ContextMouseEvtDispatcher();
    private m_div: HTMLElement = null;
    private m_canvas: HTMLCanvasElement = null;
    private m_document: HTMLElement = null;
    private m_scissorEnabled: boolean = false;
    private m_depthTestEnabled: boolean = true;
    //STENCIL_TEST
    private m_stencilTestEnabled: boolean = true;
    private m_offcanvas: HTMLCanvasElement = null;
    private m_gl: WebGLRenderingContext = null;
    private m_stage: IRenderStage3D = null;

    private m_viewX: number = 0;
    private m_viewY: number = 0;
    private m_viewWidth: number = 800;
    private m_viewHeight: number = 600;
    private m_maxWebGLVersion: number = 2;
    private m_webGLVersion: number = 2;
    private m_devicePixelRatio: number = 1.0;

    private m_viewEle: RViewElement = new RViewElement();    
    // display 3d view buf size auto sync window size
    autoSyncRenderBufferAndWindowSize: boolean = true;
    //
    offscreenRenderEnabled: boolean = false;
    private contextrestoredHandler(evt: any): void {
        console.log("webglcontextrestored...!!!");
        console.log(evt);
    }
    private contextlostHandler(evt: any): void {
        console.log("webglcontextlost...!!!");
        console.log(evt);
    }
    setWebGLMaxVersion(webgl_ver: number): void {
        if (webgl_ver == 1 || webgl_ver == 2) {
            this.m_maxWebGLVersion = webgl_ver;
        }
    }
    getWebGLVersion(): number {
        return this.m_webGLVersion;
    }
    getDiv(): any {
        return this.m_div;
    }
    setDivStyleLeftAndTop(px: number, py: number): void {
        this.m_viewEle.setDivStyleLeftAndTop(px, py);
    }
    setDivStyleSize(pw: number, ph: number): void {
        this.m_viewEle.setDivStyleSize(pw, ph);
    }
    getCanvas(): any {
        return this.m_canvas;
    }
    isDepthTestEnabled(): boolean {
        return this.m_depthTestEnabled;
    }
    isStencilTestEnabled(): boolean {
        return this.m_stencilTestEnabled;
    }
    initialize(rcuid: number, stage: IRenderStage3D, div: HTMLElement, rattr: any = null): void {
        this.m_stage = stage;
        var pdocument: any = null;
        var pwindow: any = null;
        try {
            if (document != undefined) {
                pdocument = document;
                pwindow = window;
            }
        }
        catch (err) {
            console.log("RAdapterContext::initialize(), document is undefined.");
        }
        if (pdocument != null) {
            
            this.m_viewEle.setDiv(div);
            this.m_viewEle.createViewEle(pdocument, this.autoSyncRenderBufferAndWindowSize);
            this.m_div = div = this.m_viewEle.getDiv();
            let canvas: any = this.m_canvas = this.m_viewEle.getCanvas();
            
            this.m_devicePixelRatio = window.devicePixelRatio;
            this.m_mouseEvtDisplather.dpr = this.m_devicePixelRatio;

            let attr: any = rattr;
            if (rattr == null) {
                attr = { depth: this.m_depthTestEnabled, premultipliedAlpha: false, alpha: true, antialias: false, stencil: this.m_stencilTestEnabled, preserveDrawingBuffer: true, powerPreference: "default" };
            }
            else {
                this.m_depthTestEnabled = attr.depth;
                this.m_stencilTestEnabled = attr.stencil;
            }
            console.log("this.m_devicePixelRatio: " + this.m_devicePixelRatio + ",rattr == null: " + (rattr == null));
            console.log("depthTestEnabled: " + attr.depth);
            console.log("stencilTestEnabled: " + attr.stencil);
            console.log("antialiasEnabled: " + attr.antialias);
            console.log("alphaEnabled: " + attr.alpha);
            let offscreen: any = null;
            if (this.offscreenRenderEnabled) {
                offscreen = canvas.transferControlToOffscreen();
            }
            this.m_offcanvas = offscreen;
            if (this.m_maxWebGLVersion == 2) {
                this.m_gl = offscreen == null ? canvas.getContext('webgl2', attr) : offscreen.getContext('webgl2', attr);
                if (this.m_gl != null) {
                    console.log("Use WebGL2 success!");
                    this.m_webGLVersion = 2;
                }
                else {
                    console.log("WebGL2 can not support!");
                }
            }
            if (this.m_gl == null) {
                if (offscreen == null) {
                    this.m_gl = canvas.getContext('webgl', attr) || canvas.getContext("experimental-webgl", attr);
                }
                else {
                    this.m_gl = offscreen.getContext('webgl', attr) || offscreen.getContext("experimental-webgl", attr);
                }
                if (this.m_gl != null) {
                    console.log("Use WebGL1 success!");
                    this.m_webGLVersion = 1;
                }
                else {
                    console.log("WebGL1 can not support!");
                }
            }
            if (!this.m_gl) {
                this.m_webGLVersion = -1;
                alert('Unable to initialize WebGL. Your browser or machine may not support it.');
                throw Error("WebGL initialization failure.");
                return;
            }
            let gl: any = this.m_gl;
            gl.rcuid = rcuid;
            
            let glStencilFunc: any = GLStencilFunc;
            glStencilFunc.NEVER = gl.NEVER;
            glStencilFunc.LESS = gl.LESS;
            glStencilFunc.EQUAL = gl.EQUAL;
            glStencilFunc.GREATER = gl.GREATER;
            glStencilFunc.NOTEQUAL = gl.NOTEQUAL;
            glStencilFunc.GEQUAL = gl.GEQUAL;
            glStencilFunc.ALWAYS = gl.ALWAYS;

            let stendilOp: any = GLStencilOp;
            stendilOp.KEEP = gl.KEEP;
            stendilOp.ZERO = gl.ZERO;
            stendilOp.REPLACE = gl.REPLACE;
            stendilOp.INCR = gl.INCR;
            stendilOp.INCR_WRAP = gl.INCR_WRAP;
            stendilOp.DECR = gl.DECR;
            stendilOp.DECR_WRAP = gl.DECR_WRAP;
            stendilOp.INVERT = gl.INVERT;

            let glBlendMode: any = GLBlendMode;            
            glBlendMode.ZERO = gl.ZERO;
            glBlendMode.ONE = gl.ONE;
            glBlendMode.SRC_COLOR = gl.SRC_COLOR;
            glBlendMode.DST_COLOR = gl.DST_COLOR;
            glBlendMode.SRC_ALPHA = gl.SRC_ALPHA;
            glBlendMode.DST_ALPHA = gl.DST_ALPHA;
            glBlendMode.ONE_MINUS_SRC_ALPHA = gl.ONE_MINUS_SRC_ALPHA;

            
            let glBlendEq: any = GLBlendEquation;
            glBlendEq.FUNC_ADD = gl.FUNC_ADD;
            glBlendEq.FUNC_SUBTRACT = gl.FUNC_SUBTRACT;
            glBlendEq.FUNC_REVERSE_SUBTRACT = gl.FUNC_REVERSE_SUBTRACT;
            glBlendEq.MIN_EXT = gl.MIN_EXT;
            glBlendEq.MAX_EXT = gl.MAX_EXT;
            glBlendEq.MIN = gl.MIN;
            glBlendEq.MAX = gl.MAX;

            let glFaceCull: any = CullFaceMode;
            glFaceCull.BACK = gl.BACK;
            glFaceCull.FRONT = gl.FRONT;
            glFaceCull.FRONT_AND_BACK = gl.FRONT_AND_BACK;
            
            let device: any = RendererDevice;
            //MAX_RENDERBUFFER_SIZE
            device.MAX_TEXTURE_SIZE = this.m_gl.getParameter(this.m_gl.MAX_TEXTURE_SIZE);
            device.MAX_RENDERBUFFER_SIZE = this.m_gl.getParameter(this.m_gl.MAX_RENDERBUFFER_SIZE);
            let viewPortIMS: any = this.m_gl.getParameter(this.m_gl.MAX_VIEWPORT_DIMS);
            device.MAX_VIEWPORT_WIDTH = viewPortIMS[0];
            device.MAX_VIEWPORT_HEIGHT = viewPortIMS[1];
            RCExtension.Initialize(this.m_webGLVersion, this.m_gl);
            RendererDevice.Initialize([this.m_webGLVersion]);
            
            console.log("RadapterContext stage: ",stage);
            if (stage != null) this.m_mouseEvtDisplather.initialize(canvas, div, stage);
            //  console.log("viewPortIMS: ",viewPortIMS);
            console.log("MAX_TEXTURE_SIZE: ",RendererDevice.MAX_TEXTURE_SIZE);
            console.log("IsMobileWeb: ",RendererDevice.IsMobileWeb());
            console.log("IsAndroidOS: ",RendererDevice.IsAndroidOS());
            console.log("IsIOS: ",RendererDevice.IsIOS());
            //  console.log("MAX_RENDERBUFFER_SIZE: ",RendererDevice.MAX_RENDERBUFFER_SIZE);
            //  console.log("MAX_VIEWPORT_WIDTH: ",RendererDevice.MAX_VIEWPORT_WIDTH);
            //  console.log("MAX_VIEWPORT_HEIGHT: ",RendererDevice.MAX_VIEWPORT_HEIGHT);
            //  DivLog.ShowLogOnce("MAX_TEXTURE_SIZE: "+RendererDevice.MAX_TEXTURE_SIZE);
            //  DivLog.ShowLog("MAX_RENDERBUFFER_SIZE: "+RendererDevice.MAX_RENDERBUFFER_SIZE);
            //  DivLog.ShowLog("MAX_VIEWPORT_WIDTH: "+RendererDevice.MAX_VIEWPORT_WIDTH);
            //  DivLog.ShowLog("MAX_VIEWPORT_HEIGHT: "+RendererDevice.MAX_VIEWPORT_HEIGHT);

            //  let rc_vendor:any = this.m_gl.getParameter(this.m_gl.VENDOR);
            //  let rc_renderer:any = this.m_gl.getParameter(this.m_gl.RENDERER);
            //  console.log("rc_vendor: ",rc_vendor);
            //  console.log("rc_renderer: ",rc_renderer);
            let debugInfo: any = RCExtension.WEBGL_debug_renderer_info;
            if (debugInfo != null) {
                let webgl_vendor: any = this.m_gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
                let webgl_renderer: any = this.m_gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
                device.GPU_VENDOR = webgl_vendor;
                device.GPU_RENDERER = webgl_renderer;
                console.log("webgl_vendor: ", webgl_vendor);
                console.log("webgl_renderer: ", webgl_renderer);
                if(!RendererDevice.IsWinExternalVideoCard()) {
                    console.warn("当前浏览器没有使用独立显卡");
                }
                // DivLog.ShowLog("webgl_vendor: " + webgl_vendor);
                // DivLog.ShowLog("webgl_renderer: " + webgl_renderer);
            }
            var selfT: RAdapterContext = this;
            pwindow.onresize = function (evt: any): void {
                if (selfT.autoSyncRenderBufferAndWindowSize) {
                    selfT.updateRenderBufferSize();
                }
            }

            canvas.addEventListener('webglcontextrestored', this.contextrestoredHandler, false);
            canvas.addEventListener('webglcontextlost', this.contextlostHandler, false);
            //if(this.autoSyncRenderBufferAndWindowSize)
            //{
            this.updateRenderBufferSize();
            //}
        }
        else {
            console.log("initialize WebGL failure!");
        }
    }
    private m_WEBGL_lose_context:any = null;
    
    loseContext(): void {

        if(this.m_WEBGL_lose_context == null) {
            this.m_WEBGL_lose_context = this.m_gl.getExtension('WEBGL_lose_context');
        }        
        if(this.m_WEBGL_lose_context == null) {
            this.m_WEBGL_lose_context.loseContext();
        }
    }
    /**
     * @returns return gpu context lost status
     */
    isContextLost(): boolean {
        return this.m_gl.isContextLost();
    }
    /**
     * @returns return system gpu context
     */
    getRC(): any { return this.m_gl; }
    //getRenderState(): RODrawState { return this.m_rState; }
    setScissorEnabled(boo: boolean): void {
        if (boo) {
            if (!this.m_scissorEnabled) {
                this.m_scissorEnabled = true;
                this.m_gl.enable(this.m_gl.SCISSOR_TEST);
            }
        }
        else {
            if (this.m_scissorEnabled) {
                this.m_scissorEnabled = false;
                this.m_gl.disable(this.m_gl.SCISSOR_TEST);
            }
        }
    }
    setScissorRect(px: number, py: number, pw: number, ph: number): void {
        //this.m_gl.scissor(Math.floor(px*this.m_devicePixelRatio),Math.floor(py*this.m_devicePixelRatio), pw,ph);
        this.m_gl.scissor(px, py, pw, ph);
    }
    private m_displayWidth: number = 0;
    private m_displayHeight: number = 0;
    private m_rcanvasWidth: number = 0;
    private m_rcanvasHeight: number = 0;
    private m_resizeCallback: () => void = null;
    private m_resizeCallbackTarget: any = null;
    setResizeCallback(resizeCallbackTarget: any, resizeCallback: () => void): void {
        this.m_resizeCallbackTarget = resizeCallbackTarget;
        this.m_resizeCallback = resizeCallback;
    }
    getDevicePixelRatio(): number {
        return this.m_devicePixelRatio;
    }
    resizeBufferSize(pw: number, ph: number): void {
        pw = Math.floor(pw);
        ph = Math.floor(ph);
        let k: number = window.devicePixelRatio;
        let dprChanged: boolean = Math.abs(k - this.m_devicePixelRatio) > 0.02;
        this.m_devicePixelRatio = k;
        this.m_mouseEvtDisplather.dpr = k;
        RendererDevice.SetDevicePixelRatio(this.m_devicePixelRatio);
        // console.log("this.m_devicePixelRatio: "+this.m_devicePixelRatio);

        if (this.m_displayWidth != pw || this.m_displayHeight != ph || dprChanged) {
            this.m_displayWidth = pw;
            this.m_displayHeight = ph;
            this.m_rcanvasWidth = Math.floor(pw * k)
            this.m_rcanvasHeight = Math.floor(ph * k);
            if (this.m_offcanvas == null) {
                this.m_canvas.width = this.m_rcanvasWidth;
                this.m_canvas.height = this.m_rcanvasHeight;
            }
            else {
                this.m_offcanvas.width = this.m_rcanvasWidth;
                this.m_offcanvas.height = this.m_rcanvasHeight;
            }
            this.m_canvas.style.width = this.m_displayWidth + 'px';
            this.m_canvas.style.height = this.m_displayHeight + 'px';
            if (this.m_stage != null) {
                this.m_stage.stageWidth = this.m_rcanvasWidth;
                this.m_stage.stageHeight = this.m_rcanvasHeight;
                this.m_stage.viewWidth = this.m_displayWidth;
                this.m_stage.viewHeight = this.m_displayHeight;
                this.m_stage.pixelRatio = k;

                //  DivLog.ShowLogOnce("stageSize: "+this.m_stage.stageWidth+","+this.m_stage.stageHeight);
                //  DivLog.ShowLog("canvasSize: "+this.m_canvas.width+","+this.m_canvas.height);
                //  DivLog.ShowLog("dispSize: "+this.m_displayWidth+","+this.m_displayHeight);
                //  DivLog.ShowLog("pixelRatio:"+this.m_devicePixelRatio);
                //  console.log("display size: "+this.m_displayWidth+","+this.m_displayHeight);
                //  console.log("RAdapterContext::resize(), canvas.width:"+this.m_canvas.width+", canvas.height:"+this.m_canvas.height);
                //  console.log("RAdapterContext::resize(), stageWidth:"+this.m_stage.stageWidth+", stageHeight:"+this.m_stage.stageHeight);
                //  console.log("RAdapterContext::resize(), m_rcanvasWidth:"+this.m_rcanvasWidth+", m_rcanvasHeight:"+this.m_rcanvasHeight);
                //  console.log("RAdapterContext::resize(), stw:"+this.m_stage.stageWidth+", sth:"+this.m_stage.stageHeight);
                this.m_stage.update();
            }
            if (this.m_resizeCallback != null) {
                this.m_resizeCallback.call(this.m_resizeCallbackTarget);
            }
        }
    }
    getStage(): IRenderStage3D {
        return this.m_stage;
    }
    getStageWidth(): number {
        return this.m_stage.stageWidth;
    }
    getStageHeight(): number {
        return this.m_stage.stageHeight;
    }
    getDisplayWidth(): number {
        return this.m_displayWidth;
    }
    getDisplayHeight(): number {
        return this.m_displayHeight;
    }
    setViewport(px: number, py: number, pw: number, ph: number): void {
        let boo: boolean = this.m_viewX != px || this.m_viewY != py;
        if (this.m_viewWidth != pw || this.m_viewHeight != ph || boo) {
            this.m_viewX = px;
            this.m_viewY = py;
            this.m_viewWidth = pw;
            this.m_viewHeight = ph;
        }
    }
    setViewportSize(pw: number, ph: number): void {
        if (this.m_viewWidth != pw || this.m_viewHeight != ph) {
            this.m_viewWidth = pw;
            this.m_viewHeight = ph;
        }
    }
    testViewPortChanged(px: number, py: number, pw: number, ph: number): boolean {
        
        return this.m_viewX != px || this.m_viewY != py || this.m_viewWidth != pw || this.m_viewHeight != ph;
    }
    getViewportX(): number {
        return this.m_viewX;
    }
    getViewportY(): number {
        return this.m_viewY;
    }
    getViewportWidth(): number {
        return this.m_viewWidth;
    }
    getViewportHeight(): number {
        return this.m_viewHeight;
    }

    getFBOWidth(): number {
        return this.m_viewWidth < RendererDevice.MAX_RENDERBUFFER_SIZE ? this.m_viewWidth : RendererDevice.MAX_RENDERBUFFER_SIZE;
    }
    getFBOHeight(): number {
        return this.m_viewHeight < RendererDevice.MAX_RENDERBUFFER_SIZE ? this.m_viewHeight : RendererDevice.MAX_RENDERBUFFER_SIZE;
    }
    getRCanvasWidth(): number {
        return this.m_rcanvasWidth;
    }
    getRCanvasHeight(): number {
        return this.m_rcanvasHeight;
    }
    updateRenderBufferSize(): void {
        let rect: any = this.m_div.getBoundingClientRect();
        this.resizeBufferSize(rect.width, rect.height);
    }
}
export default RAdapterContext;
