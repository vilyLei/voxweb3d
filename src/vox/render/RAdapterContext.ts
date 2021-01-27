/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as DivLogT from "../../vox/utils/DivLog";
import * as RCExtensionT from "../../vox/render/RCExtension";
import * as RendererDevieceT from "../../vox/render/RendererDeviece";
import * as Color4T from "../../vox/material/Color4";
import * as KeyboardT from "../../vox/ui/Keyboard";
import * as Stage3DT from "../../vox/display/Stage3D";
import * as RODrawStateT from "../../vox/render/RODrawState";
import * as RendererStateT from "../../vox/render/RendererState";
import * as ContextMouseEvtDispatcherT from "../../vox/render/ContextMouseEvtDispatcher";

import DivLog = DivLogT.vox.utils.DivLog;
import RCExtension = RCExtensionT.vox.render.RCExtension;
import RendererDeviece = RendererDevieceT.vox.render.RendererDeviece;
import Color4 = Color4T.vox.material.Color4;
import Keyboard = KeyboardT.vox.ui.Keyboard;
import Stage3D = Stage3DT.vox.display.Stage3D;
import RODrawState = RODrawStateT.vox.render.RODrawState;
import RendererState = RendererStateT.vox.render.RendererState;
import ContextMouseEvtDispatcher = ContextMouseEvtDispatcherT.vox.render.ContextMouseEvtDispatcher;

export namespace vox
{
    export namespace render
    {
        export class RAdapterContext
        {
            constructor()
            {
            }
            private m_rState:RODrawState = null;
            private m_mouseEvtDisplather:ContextMouseEvtDispatcher = new ContextMouseEvtDispatcher();
            private m_canvas:any = null;
            private m_div:any = null;
            private m_document:any = null;
            bgColor:Color4 = new Color4();
    
            private m_depthTestEnabled:boolean = true;
            //STENCIL_TEST
            private m_stencilTestEnabled:boolean = true;
            // display 3d view buf size auto syn window size
            autoSynContextSizeAndWindowSize:boolean = true;
            //
            offscreenRenderEnabled:boolean = false;
            private m_offcanvas:any = null;
            private m_gl:any = null;
            private m_stage:Stage3D = null;
            private m_windowWidth:number = 800;
            private m_windowHeight:number = 600;
            private m_viewX:number = 0;
            private m_viewY:number = 0;
            private m_viewWidth:number = 800;
            private m_viewHeight:number = 600;
            private m_maxWebGLVersion:number = 2;
            private m_webGLVersion:number = 2;
            private m_changedBoo:boolean = true;
            private m_devicePixelRatio:number = 1.0;

            private contextrestoredHandler(evt:any):void
            {
                console.log("webglcontextrestored...!!!");
                console.log(evt);
            }
            private contextlostHandler(evt:any):void
            {
                console.log("webglcontextlost...!!!");
                console.log(evt);
            }
            setWebGLMaxVersion(webgl_ver:number):void
            {
                if(webgl_ver == 1 || webgl_ver == 2)
                {
                    this.m_maxWebGLVersion = webgl_ver;
                }
            }
            getWebGLVersion():number
            {
                return this.m_webGLVersion;
            }
            private createWebEle(pdocument:any,canvasns:string,divns:string):void
            {

                this.m_document = pdocument;
                this.m_div = pdocument.getElementById(divns);
                if(this.m_div == null)
                {
                    this.m_div = pdocument.getElementById("app");
                }
                
                this.m_div.style.display = 'bolck';
                this.m_div.style.width = '100%';
                this.m_div.style.height = '100%';
                this.m_div.style.left = '0px';
                this.m_div.style.top = '0px';
                this.m_div.style.position = 'absolute';
                this.m_canvas = pdocument.getElementById(canvasns);
                if(this.m_canvas == null)
                {
                    this.m_canvas = document.createElement('canvas');
                    this.m_div.appendChild(this.m_canvas);
                    this.m_canvas.width = 400;
                    this.m_canvas.height = 600;
                    this.m_canvas.style.display = 'bolck';
                    this.m_canvas.style.left = '0px';
                    this.m_canvas.style.top = '0px';
                    this.m_canvas.style.position = 'absolute';
                }
            }
            getDiv():any
            {
                return this.m_div;
            }
            getCanvas():any
            {
                return this.m_canvas;
            }
            getDepthTestEnabled():boolean
            {
                return this.m_depthTestEnabled;
            }
            getStencilTestEnabled():boolean
            {
                return this.m_stencilTestEnabled;
            }
            initialize(glCanvasNS:string,glDivNS:string,rattr:any = null):void
            {
                var pdocument:any = null;
                var pwindow:any = null;
                try
                {
                    if(document != undefined)
                    {
                        pdocument = document;
                        pwindow = window;
                    }
                }
                catch(err)
                {
                    console.log("RAdapterContext::initialize(), document is undefined.");
                }
                if(pdocument != null)
                {
                    RendererState.Initialize();
                    this.m_rState = RendererState.Rstate;

                    this.createWebEle(pdocument,glCanvasNS,glDivNS);

                    let canvas:any = this.m_canvas;
                    let div:any = this.m_div;
                    
                    if(this.m_stage == null)
                    {
                        this.m_stage = new Stage3D();
                    }

                    let stage:Stage3D = this.m_stage;

                    pdocument.onkeydown = function(evt:any):void
                    {
                        Keyboard.KeyDown(evt);
                    }
                    pdocument.onkeyup = function(evt:any):void
                    {
                        Keyboard.KeyUp(evt);
                    }
                    this.m_mouseEvtDisplather.initialize(canvas,div,stage);
                    this.m_devicePixelRatio = window.devicePixelRatio;
                    this.m_mouseEvtDisplather.dpr = this.m_devicePixelRatio;
                    let attr:any = rattr;
                    if(rattr == null)
                    {
                        attr = {depth:this.m_depthTestEnabled,premultipliedAlpha: false, alpha: true, antialias:false,stencil:this.m_stencilTestEnabled,preserveDrawingBuffer:true,powerPreference:"default" };
                    }
                    else
                    {
                        this.m_depthTestEnabled = attr.depth;
                        this.m_stencilTestEnabled = attr.stencil;
                    }
                    console.log("this.m_devicePixelRatio: "+this.m_devicePixelRatio+",rattr == null: "+(rattr == null));
                    console.log("depthTestEnabled: "+attr.depth);
                    console.log("stencilTestEnabled: "+attr.stencil);
                    console.log("antialiasEnabled: "+attr.antialias);
                    console.log("alphaEnabled: "+attr.alpha);
                    let offscreen:any = null;
                    if(this.offscreenRenderEnabled)
                    {
                        offscreen = canvas.transferControlToOffscreen();
                    }
                    this.m_offcanvas = offscreen;
                    if(this.m_maxWebGLVersion == 2)
                    {
                        this.m_gl = offscreen == null?canvas.getContext('webgl2',attr):offscreen.getContext('webgl2',attr);
                        if(this.m_gl != null)
                        {
                            console.log("Use WebGL2 success!");
                            this.m_webGLVersion = 2;
                        }
                        else
                        {
                            console.log("WebGL2 can not support!");
                        }
                    }
                    if(this.m_gl == null)
                    {
                        if(offscreen == null)
                        {
                            this.m_gl = canvas.getContext('webgl',attr) || canvas.getContext("experimental-webgl",attr);
                        }
                        else
                        {
                            this.m_gl = offscreen.getContext('webgl',attr) || offscreen.getContext("experimental-webgl",attr);
                        }
                        if(this.m_gl != null)
                        {
                            console.log("Use WebGL1 success!");
                            this.m_webGLVersion = 1;
                        }
                        else
                        {
                            console.log("WebGL1 can not support!");
                        }
                    }
                    if (!this.m_gl) {
                        this.m_webGLVersion = -1;
                        alert('Unable to initialize WebGL. Your browser or machine may not support it.');
                        return;
                    }
                    let device:any = RendererDeviece;
                    device.MAX_TEXTURE_SIZE = this.m_gl.getParameter(this.m_gl.MAX_TEXTURE_SIZE);
                    RCExtension.Initialize(this.m_webGLVersion,this.m_gl);
                    RendererDeviece.Initialize([this.m_webGLVersion]);

                    
                    let debugInfo:any = RCExtension.WEBGL_debug_renderer_info;
                    if(debugInfo != null)
                    {
                        let webgl_vendor:any = this.m_gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
                        let webgl_renderer:any = this.m_gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
                        device.GPU_VENDOR = webgl_vendor;
                        device.GPU_RENDERER = webgl_vendor;
                        console.log("webgl_vendor: ",webgl_vendor);
                        console.log("webgl_renderer: ",webgl_renderer);
                    }

                    var selfT:RAdapterContext = this;
                    pwindow.onresize = function(evt:any):void
                    {
                        //console.log("onresize: "+evt);
                        if(selfT.autoSynContextSizeAndWindowSize)
                        {
                            let rect = div.getBoundingClientRect();
                            selfT.resize(rect.width, rect.height);
                        }
                    }
                    //
                    this.m_rState.setRenderer(this.m_gl);
                    //
                    canvas.addEventListener('webglcontextrestored', this.contextrestoredHandler, false);
                    canvas.addEventListener('webglcontextlost',this.contextlostHandler,false);
                    if(this.autoSynContextSizeAndWindowSize)
                    {
                        let rect = div.getBoundingClientRect();
                        this.resize(rect.width, rect.height);
                    }
                }
                else
                {
                    console.log("initialize WebGL failure!");
                }
            }
            isContextLost():boolean
            {
                if(this.m_gl != null)
                {
                    return this.m_gl.isContextLost();
                }
                return false;
            }
            getRC():any{return this.m_gl;}
            getRenderState():RODrawState{return this.m_rState;}
    
            private m_scissorEnabled:boolean = false;
            setScissorEnabled(boo:boolean):void
            {
                if(boo)
                {
                    if(!this.m_scissorEnabled)
                    {
                        this.m_scissorEnabled = true;
                        this.m_gl.enable(this.m_gl.SCISSOR_TEST);
                    }
                }
                else
                {
                    if(this.m_scissorEnabled)
                    {
                        this.m_scissorEnabled = false;
                        this.m_gl.disable(this.m_gl.SCISSOR_TEST);
                    }
                }
            }
            setScissorRect(px:number,py:number,pw:number,ph:number):void
            {
                //this.m_gl.scissor(Math.floor(px*this.m_devicePixelRatio),Math.floor(py*this.m_devicePixelRatio), pw,ph);
                this.m_gl.scissor(px,py, pw,ph);
            }
            private m_displayWidth:number = 0;
            private m_displayHeight:number = 0;
            private m_rcanvasWidth:number = 0;
            private m_rcanvasHeight:number = 0;
            private m_resizeCallback:()=>void = null;
            private m_resizeCallbackTarget:any = null;
            setResizeCallback(resizeCallbackTarget:any, resizeCallback:()=>void):void
            {
                this.m_resizeCallbackTarget = resizeCallbackTarget;
                this.m_resizeCallback = resizeCallback;
            }
            getDevicePixelRatio():number
            {
                return this.m_devicePixelRatio;
            }
            resize(pw:number,ph:number):void
            {
                pw = Math.floor(pw);
                ph = Math.floor(ph);
                this.m_devicePixelRatio = window.devicePixelRatio;
                this.m_mouseEvtDisplather.dpr = window.devicePixelRatio;
                RendererDeviece.SetDevicePixelRatio(this.m_devicePixelRatio);
                //console.log("this.m_devicePixelRatio: "+this.m_devicePixelRatio);
                //console.log("RAdapterContext::resize(), pw:"+pw+", ph:"+ph);
                //this.m_devicePixelRatio = 1.0;
                let k:number = this.m_devicePixelRatio;
                if(this.m_displayWidth != pw || this.m_displayHeight != ph)
                {
                    this.m_displayWidth  = pw;
                    this.m_displayHeight = ph;
                    this.m_rcanvasWidth = Math.floor(pw * k)
                    this.m_rcanvasHeight = Math.floor(ph * k);
                    if(this.m_offcanvas == null)
                    {
                        this.m_canvas.width  = this.m_rcanvasWidth;
                        this.m_canvas.height = this.m_rcanvasHeight;
                    }
                    else
                    {
                        this.m_offcanvas.width  = this.m_rcanvasWidth;
                        this.m_offcanvas.height = this.m_rcanvasHeight;
                    }

                    this.m_canvas.style.width = this.m_displayWidth + 'px';
                    this.m_canvas.style.height = this.m_displayHeight + 'px';
                    this.m_stage.stageWidth = this.m_rcanvasWidth;
                    this.m_stage.stageHeight = this.m_rcanvasHeight;
                    this.m_stage.viewWidth = this.m_displayWidth;
                    this.m_stage.viewHeight = this.m_displayHeight;
                    this.m_stage.pixelRatio = k;
                    
                    DivLog.ShowLogOnce("stageSize: "+this.m_stage.stageWidth+","+this.m_stage.stageHeight);
                    DivLog.ShowLog("canvasSize: "+this.m_canvas.width+","+this.m_canvas.height);
                    DivLog.ShowLog("dispSize: "+this.m_displayWidth+","+this.m_displayHeight);
                    DivLog.ShowLog("pixelRatio:"+this.m_devicePixelRatio);
                    console.log("RAdapterContext::resize(), canvas.width:"+this.m_canvas.width+", canvas.height:"+this.m_canvas.height);
                    console.log("RAdapterContext::resize(), stageWidth:"+this.m_stage.stageWidth+", stageHeight:"+this.m_stage.stageHeight);
                    console.log("RAdapterContext::resize(), m_rcanvasWidth:"+this.m_rcanvasWidth+", m_rcanvasHeight:"+this.m_rcanvasHeight);
                    console.log("RAdapterContext::resize(), stw:"+this.m_stage.stageWidth+", sth:"+this.m_stage.stageHeight);

                    this.m_stage.update();
                    if(this.m_resizeCallback != null)
                    {
                        this.m_resizeCallback.call(this.m_resizeCallbackTarget);
                    }
                }
            }
            getStage():Stage3D
            {
                return this.m_stage;
            }
            getStageWidth():number
            {
                return this.m_stage.stageWidth;
            }
            getStageHeight():number
            {
                return this.m_stage.stageHeight;
            }
            getDisplayWidth():number
            {
                return this.m_displayWidth;
            }
            getDisplayHeight():number
            {
                return this.m_displayHeight;
            }
        	getWindowWidth():number
        	{
        		return this.m_windowWidth;
        	}
        	getWindowHeight():number
        	{
        		return this.m_windowHeight;
        	}
        	setViewport(px:number, py:number, pw:number, ph:number):void
        	{
                let boo:boolean = this.m_viewX != px || this.m_viewY != py;
        		if (this.m_viewWidth != pw || this.m_viewHeight != ph || boo)
        		{
                    //console.log("RAdapterContext::setViewport(), pw: "+pw+",ph: "+ph);
                    
                    DivLog.ShowLog("setViewport:"+px+","+py+","+pw+","+ph);
        			this.m_viewX = px;
        			this.m_viewY = py;
        			this.m_viewWidth = pw;
        			this.m_viewHeight = ph;
        			this.m_changedBoo = true;
        		}
        	}
        	setViewportSize(pw:number, ph:number):void
        	{
        		if (this.m_viewWidth != pw || this.m_viewHeight != ph)
        		{
                    DivLog.ShowLog("setViewportSize:"+pw+","+ph);
                    //console.log("RAdapterContext::setViewportSize(), pw: "+pw+",ph: "+ph);
        			this.m_viewWidth = pw;
        			this.m_viewHeight = ph;
        			this.m_changedBoo = true;
        		}
        	}
        	getViewportX():number
        	{
        		return this.m_viewX;
        	}
        	getViewportY():number
        	{
        		return this.m_viewY;
        	}
        	getViewportWidth():number
        	{
        		return this.m_viewWidth;
        	}
        	getViewportHeight():number
        	{
        		return this.m_viewHeight;
        	}
        	getRCanvasWidth():number
        	{
        		return this.m_rcanvasWidth;
        	}
        	getRCanvasHeight():number
        	{
        		return this.m_rcanvasHeight;
        	}
        	update():void
        	{
        		if (this.m_changedBoo)
        		{
        			this.m_changedBoo = false;
        		}
        	}
        }
    }
}
