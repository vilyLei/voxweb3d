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
import IRenderStage3D from "../../vox/render/IRenderStage3D";
import ContextMouseEvtDispatcher from "../../vox/render/ContextMouseEvtDispatcher";
import { GLBlendMode, GLBlendEquation, CullFaceMode, GLStencilFunc, GLStencilOp } from "./RenderConst";
import AABB2D from "../geom/AABB2D";
import { IRAdapterContext } from "./IRAdapterContext";
import IRendererParam from "../scene/IRendererParam";

class RAdapterContext implements IRAdapterContext {

    private m_sysEvt = new ContextMouseEvtDispatcher();
    private m_div: HTMLDivElement = null;
    private m_canvas: HTMLCanvasElement = null;
    private m_scissorEnabled = false;
    private m_depthTestEnabled = true;

    private m_stencilTestEnabled = true;
    private m_offcanvas: HTMLCanvasElement = null;
    private m_gl: WebGLRenderingContext = null;
    private m_stage: IRenderStage3D = null;

    private m_viewPortRect = new AABB2D(0, 0, 800, 600);
    private m_maxWebGLVersion = 2;
    private m_webGLVersion = 2;
    private m_dpr = 1.0;

    private m_viewEle = new RViewElement();
    // display 3d view buf size auto sync window size
    autoSyncRenderBufferAndWindowSize = true;
    offscreenRenderEnabled = false;
    bodyBgColor = "";
    constructor() { }

    private contextrestoredHandler(evt: any): void {
        console.log("webglcontextrestored...!!!");
        console.log(evt);
    }
    private contextlostHandler(evt: any): void {
        console.warn("webglcontextlost...!!!");
        console.log(evt);
    }
    syncHtmlBodyColor(r: number, g: number, b: number): void {
        this.bodyBgColor = this.m_viewEle.getCSSHEXRGB(r, g, b);
    }
    setWebGLMaxVersion(webgl_ver: number): void {
        if (webgl_ver == 1 || webgl_ver == 2) {
            this.m_maxWebGLVersion = webgl_ver;
        }
    }
    getWebGLVersion(): number {
        return this.m_webGLVersion;
    }
    getDiv(): HTMLDivElement {
        return this.m_div;
    }
    getCanvas(): HTMLCanvasElement {
        return this.m_offcanvas ? this.m_offcanvas : this.m_canvas;
    }
    setDivStyleLeftAndTop(px: number, py: number): void {
        this.m_viewEle.setDivStyleLeftAndTop(px, py);
    }
    setDivStyleSize(pw: number, ph: number): void {
        this.m_viewEle.setDivStyleSize(pw, ph);
    }
    isDepthTestEnabled(): boolean {
        return this.m_depthTestEnabled;
    }
    isStencilTestEnabled(): boolean {
        return this.m_stencilTestEnabled;
    }
    private m_ctxAttri: any = null;
    private m_glVersion = 0;
    private buildGLCtx(canvas: any, attr: any): void {

        this.m_gl = null;
        let offscreen: any = null;
        if (this.offscreenRenderEnabled) {
            if (!(canvas instanceof OffscreenCanvas)) {
                offscreen = canvas.transferControlToOffscreen();
                canvas = offscreen;
            }
        }
        this.m_offcanvas = offscreen = canvas;
        if (this.m_maxWebGLVersion == 2) {
            this.m_gl = offscreen == null ? canvas.getContext('webgl2', attr) : offscreen.getContext('webgl2', attr);
            if (this.m_gl) {
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
        }
        (this.m_gl as any).version = this.m_glVersion;
        canvas.version = this.m_glVersion;
        this.m_glVersion++;
        canvas.addEventListener('webglcontextrestored', this.contextrestoredHandler, false);
        canvas.addEventListener('webglcontextlost', this.contextlostHandler, false);

        RCExtension.Initialize(this.m_webGLVersion, this.m_gl);
    }
    private m_param: IRendererParam = null;
    initialize(rcuid: number, stage: IRenderStage3D, param: IRendererParam): void {
        this.m_stage = stage;
        var pdocument: any = null;
        var pwindow: any = null;
        try {
            if (document) {
                pdocument = document;
                pwindow = window;
            }
        }
        catch (err) {
            console.log("RAdapterContext::initialize(), document is undefined.");
        }
        this.m_param = param;
        if (pdocument != null) {
            this.m_dpr = window.devicePixelRatio;
            let div = param.getDiv();
            RendererDevice.SetDevicePixelRatio(this.m_dpr);
            this.m_viewEle.setDiv(div);
            this.m_viewEle.createViewEle(pdocument, this.autoSyncRenderBufferAndWindowSize, param.divW, param.divH, param.autoAttachingHtmlDoc, this.offscreenRenderEnabled);
            this.m_div = div = this.m_viewEle.getDiv();
            let canvas = this.m_canvas = this.m_viewEle.getCanvas();

            this.m_dpr = window.devicePixelRatio;
            this.m_sysEvt.dpr = this.m_dpr;

            const rattr = param.getRenderContextAttri();
            let attr = rattr;
            if (rattr == null) {
                attr = { depth: this.m_depthTestEnabled, premultipliedAlpha: false, alpha: true, antialias: false, stencil: this.m_stencilTestEnabled, preserveDrawingBuffer: true, powerPreference: "default" };
                // attr = { depth: this.m_depthTestEnabled, premultipliedAlpha: false, alpha: true, antialias: false, stencil: this.m_stencilTestEnabled, preserveDrawingBuffer: true, powerPreference: "high-performance" };
            }
            else {
                this.m_depthTestEnabled = attr.depth;
                this.m_stencilTestEnabled = attr.stencil;
            }
            this.m_ctxAttri = attr;

            console.log("offscreenRenderEnabled: ", this.offscreenRenderEnabled);
            console.log("this.m_dpr: ", this.m_dpr, ",rattr == null: ", (rattr == null));
            console.log("depthTestEnabled: ", attr.depth);
            console.log("stencilTestEnabled: ", attr.stencil);
            console.log("antialiasEnabled: ", attr.antialias);
            console.log("alphaEnabled: ", attr.alpha);

            this.buildGLCtx(canvas, attr);
            /*
            let offscreen: any = null;
            if (this.offscreenRenderEnabled) {
                if(!(canvas instanceof OffscreenCanvas)) {
                    offscreen = canvas.transferControlToOffscreen();
                }
            }
            this.m_offcanvas = offscreen;
            if (this.m_maxWebGLVersion == 2) {
                this.m_gl = offscreen == null ? canvas.getContext('webgl2', attr) : offscreen.getContext('webgl2', attr);
                if (this.m_gl) {
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
            canvas.addEventListener('webglcontextrestored', this.contextrestoredHandler, false);
            canvas.addEventListener('webglcontextlost', this.contextlostHandler, false);
            //*/

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
            RendererDevice.Initialize([this.m_webGLVersion]);

            console.log("RadapterContext stage: ", stage);
            //  console.log("viewPortIMS: ",viewPortIMS);
            console.log("MAX_TEXTURE_SIZE: ", RendererDevice.MAX_TEXTURE_SIZE);
            console.log("IsMobileWeb: ", RendererDevice.IsMobileWeb());
            console.log("IsAndroidOS: ", RendererDevice.IsAndroidOS());
            console.log("IsIOS: ", RendererDevice.IsIOS());
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
            if (debugInfo) {
                let webgl_vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
                let webgl_renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
                device.GPU_VENDOR = webgl_vendor;
                device.GPU_RENDERER = webgl_renderer;
                console.log("webgl_vendor: ", webgl_vendor);
                console.log("webgl_renderer: ", webgl_renderer);
                if (!RendererDevice.IsWinExternalVideoCard()) {
                    console.warn("当前浏览器没有使用独立显卡");
                }
                // DivLog.ShowLog("webgl_vendor: " + webgl_vendor);
                // DivLog.ShowLog("webgl_renderer: " + webgl_renderer);
            }
            this.initEvt();
            // if(param.sysEvtReceived) {
            // 	// if (stage) this.m_sysEvt.initialize(canvas, div, stage);
            // 	// pwindow.onresize = (evt: any): void => {
            // 	// 	if (this.autoSyncRenderBufferAndWindowSize) {
            // 	// 		this.m_resizeFlag = true;
            // 	// 		this.updateRenderBufferSize();
            // 	// 	}
            // 	// }
            // 	let winOnresize = (evt: any): void => {
            // 		if (this.autoSyncRenderBufferAndWindowSize) {
            // 			this.m_resizeFlag = true;
            // 			this.updateRenderBufferSize();
            // 		}
            // 	}
            // }
            this.updateRenderBufferSize();
        }
        else {
            console.log("initialize WebGL failure!");
        }
    }
    private m_resizeFlag = true;
    private m_glLoseCtx: any = null;

    setCanvas(canvas: HTMLCanvasElement): boolean {
        let c0 = this.m_canvas;
        this.m_viewEle.setCanvas(canvas);
        let c1 = this.m_viewEle.getCanvas();
        if (c0 != c1) {
            this.m_offcanvas = null;
            this.m_canvas = c1;
            this.buildGLCtx(c1, this.m_ctxAttri);
            this.m_glLoseCtx = null;
            this.initEvt();

        }
        return c0 != c1;
    }
    private initEvt(): void {
        if (this.m_param.sysEvtReceived) {
            this.m_sysEvt.initialize(this.m_canvas, this.m_div, this.m_stage);
            let winOnresize = (evt: any): void => {
                if (this.autoSyncRenderBufferAndWindowSize) {
                    this.m_resizeFlag = true;
                    this.updateRenderBufferSize();
                }
            }
            this.m_sysEvt.sysEvt.addWindowResizeEvt(this, winOnresize);
        }
    }
    loseContext(): void {

        if (!this.m_glLoseCtx) {
            this.m_glLoseCtx = this.m_gl.getExtension('WEBGL_lose_context');
            this.m_glLoseCtx.loseContext();
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
        //this.m_gl.scissor(Math.floor(px*this.m_dpr),Math.floor(py*this.m_dpr), pw,ph);
        this.m_gl.scissor(px, py, pw, ph);
    }
    private m_displayWidth: number = 0;
    private m_displayHeight: number = 0;
    private m_rcanvasWidth: number = 0;
    private m_rcanvasHeight: number = 0;
    private m_resizeCallback: () => void = null;
    setResizeCallback(resizeCallback: () => void): void {
        this.m_resizeCallback = resizeCallback;
    }
    getDevicePixelRatio(): number {
        return this.m_dpr;
    }
    /**
     * @param pw buffer div width
     * @param ph buffer div height
     * @param sync the default value is true
     */
    resizeBufferSize(pw: number, ph: number, sync: boolean = true): void {
        pw = Math.floor(pw);
        ph = Math.floor(ph);
        let k = sync ? window.devicePixelRatio : 1.0;
        let dprChanged = Math.abs(k - this.m_dpr) > 0.01 || this.m_resizeFlag;
        this.m_dpr = k;
        this.m_sysEvt.dpr = k;
        RendererDevice.SetDevicePixelRatio(this.m_dpr);
        console.log("window.devicePixelRatio: ", this.m_dpr, ", sync: ", sync, ", this.m_dpr: ", this.m_dpr);
        this.m_resizeFlag = false;
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

                console.log("size to stage size: ", this.m_stage.stageWidth, this.m_stage.stageHeight);
                console.log("size to view size: ", this.m_stage.viewWidth, this.m_stage.viewHeight);
                //  DivLog.ShowLogOnce("stageSize: "+this.m_stage.stageWidth+","+this.m_stage.stageHeight);
                //  DivLog.ShowLog("canvasSize: "+this.m_canvas.width+","+this.m_canvas.height);
                //  DivLog.ShowLog("dispSize: "+this.m_displayWidth+","+this.m_displayHeight);
                //  DivLog.ShowLog("pixelRatio:"+this.m_dpr);
                //  console.log("display size: "+this.m_displayWidth+","+this.m_displayHeight);
                //  console.log("RAdapterContext::resize(), canvas.width:"+this.m_canvas.width+", canvas.height:"+this.m_canvas.height);
                //  console.log("RAdapterContext::resize(), stageWidth:"+this.m_stage.stageWidth+", stageHeight:"+this.m_stage.stageHeight);
                //  console.log("RAdapterContext::resize(), m_rcanvasWidth:"+this.m_rcanvasWidth+", m_rcanvasHeight:"+this.m_rcanvasHeight);
                //  console.log("RAdapterContext::resize(), stw:"+this.m_stage.stageWidth+", sth:"+this.m_stage.stageHeight);
                this.m_stage.update();
            }
            if (this.m_resizeCallback != null) {
                this.m_resizeCallback();
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
        this.m_viewPortRect.setTo(px, py, pw, ph);
    }
    setViewportSize(pw: number, ph: number): void {
        this.m_viewPortRect.setSize(pw, ph);
    }
    testViewPortChanged(px: number, py: number, pw: number, ph: number): boolean {
        return this.m_viewPortRect.testEqualWithParams(px, py, pw, ph);
    }
    getViewportX(): number {
        return this.m_viewPortRect.x;
    }
    getViewportY(): number {
        return this.m_viewPortRect.y;
    }
    getViewportWidth(): number {
        return this.m_viewPortRect.width;
    }
    getViewportHeight(): number {
        return this.m_viewPortRect.height;
    }
    getViewPortSize(): AABB2D {
        return this.m_viewPortRect;
    }

    getFBOWidth(): number {
        return this.m_viewPortRect.width < RendererDevice.MAX_RENDERBUFFER_SIZE ? this.m_viewPortRect.width : RendererDevice.MAX_RENDERBUFFER_SIZE;
    }
    getFBOHeight(): number {
        return this.m_viewPortRect.height < RendererDevice.MAX_RENDERBUFFER_SIZE ? this.m_viewPortRect.height : RendererDevice.MAX_RENDERBUFFER_SIZE;
    }
    getRCanvasWidth(): number {
        return this.m_rcanvasWidth;
    }
    getRCanvasHeight(): number {
        return this.m_rcanvasHeight;
    }
    /**
     * @param sync the default value is true
     */
    updateRenderBufferSize(sync: boolean = true): void {
        const div = this.m_div;
        if (div.parentElement) {
            let rect = div.getBoundingClientRect();
            // console.log("updateRenderBufferSize() rect.width, rect.height: ", rect.width, rect.height);
            // this.m_canvas.style.width = Math.floor(rect.width) + 'px';
            // this.m_canvas.style.height = Math.floor(rect.height) + 'px';
            rect = div.getBoundingClientRect();
            this.resizeBufferSize(rect.width, rect.height);
        } else {
            const canvas = this.m_offcanvas ? this.m_offcanvas : this.m_canvas;
            this.resizeBufferSize(canvas.width, canvas.height, false);
        }
    }
}
export default RAdapterContext;
