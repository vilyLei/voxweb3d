/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// FBO Manager

import * as Stage3DT from "../../vox/display/Stage3D";
import * as CameraBaseT from "../../vox/view/CameraBase";
import * as FrameBufferTypeT from "../../vox/render/FrameBufferType";
import * as RenderFilterT from "../../vox/render/RenderFilter";
import * as RenderMaskBitfieldT from "../../vox/render/RenderMaskBitfield";
import * as RendererStateT from "../../vox/render/RendererState";
import * as RAdapterContextT from "../../vox/render/RAdapterContext";
import * as RenderAdapterT from "../../vox/render/RenderAdapter";
import * as TextureProxyT from "../../vox/texture/TextureProxy";
import * as RenderProxyT from "../../vox/render/RenderProxy";
import * as Color4T from "../../vox/material/Color4";
import * as MaterialBaseT from "../../vox/material/MaterialBase";
import * as RenderMaterialProxyT from "../../vox/render/RenderMaterialProxy";
import * as IRendererT from "../../vox/scene/IRenderer";

import Stage3D = Stage3DT.vox.display.Stage3D;
import CameraBase = CameraBaseT.vox.view.CameraBase;
import FrameBufferType = FrameBufferTypeT.vox.render.FrameBufferType;
import RenderFilter = RenderFilterT.vox.render.RenderFilter;
import RenderMaskBitfield = RenderMaskBitfieldT.vox.render.RenderMaskBitfield;
import RendererState = RendererStateT.vox.render.RendererState;
import RAdapterContext = RAdapterContextT.vox.render.RAdapterContext;
import RenderAdapter = RenderAdapterT.vox.render.RenderAdapter;
import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
import RenderProxy = RenderProxyT.vox.render.RenderProxy;
import MaterialBase = MaterialBaseT.vox.material.MaterialBase;
import Color4 = Color4T.vox.material.Color4;
import RenderMaterialProxy = RenderMaterialProxyT.vox.render.RenderMaterialProxy;
import IRenderer = IRendererT.vox.scene.IRenderer;

export namespace vox
{
    export namespace scene
    {
        export class FBOInstance
        {
            private m_adapter:RenderAdapter = null;
            private m_renderProxy:RenderProxy = null;
            private m_materialProxy:RenderMaterialProxy = null;
            private m_bgColor:Color4 = new Color4();
            private m_render:IRenderer = null;
            private m_runBegin:boolean = true;
            private m_fboIndex:number = -1;
            private m_fboType:number = -1;
            private m_initW:number = 128;
            private m_initH:number = 128;
            private m_enableDepth:boolean = true;
            private m_enableStencil:boolean = false;
            private m_multisampleLevel:number = 0;
            private m_gMateiral:MaterialBase = null;
            private m_rindexs:number[] = [];
            private m_texs:TextureProxy[] = [null,null,null,null,null,null,null,null];
            private m_texsTot:number = 0;
            private m_synFBOSizeWithViewport:boolean = true;
            private m_fboSizeFactor:number = 1.0;
            private m_clearDepth:number = 256.0;
            private m_clearColorBoo:boolean = true;
            private m_clearDepthBoo:boolean = true;
            private m_clearStencilBoo:boolean = false;
            private m_viewportLock:boolean = false;
            
            constructor(render:IRenderer)
            {
                this.m_render = render;
                this.m_renderProxy = render.getRenderProxy();
                this.m_adapter = this.m_renderProxy.getRenderAdapter();
                this.m_materialProxy = this.m_render.getRendererContext().getRenderMaterialProxy();
            }
            getFBOUid():number
            {
                return this.m_fboIndex;
            }
            setRProcessIDList(list:number[]):void
            {
                this.m_rindexs = list;
            }
            getRProcessIDAt(i:number):number
            {
                return this.m_rindexs[i];
            }
            getStage3D():Stage3D
            {
                return this.m_renderProxy.getStage3D();
            }
            getCamera():CameraBase
            {
                if(this.m_renderProxy != null)
                {
                    return this.m_renderProxy.getCamera();
                }
                return null;
            }
            lockViewport():void
            {
                this.m_viewportLock = true;
            }
            unlockViewport():void
            {
                this.m_viewportLock = false;
            }
            updateCamera():void
            {
                if(this.m_renderProxy != null)
                {
                    this.m_renderProxy.updateCamera();
                }
            }
            updateCameraDataFromCamera(cam:CameraBase):void
            {
                if(this.m_renderProxy != null)
                {
                    this.m_renderProxy.updateCameraDataFromCamera(cam);
                }
            }
            useGlobalRenderState(state:number):void
            {
                if(this.m_renderProxy != null)
                {
                    this.m_renderProxy.unlockRenderState();
                    this.m_renderProxy.useRenderState(state);
                    this.m_renderProxy.lockRenderState();
                }
            }
            lockRenderState():void
            {
                this.m_renderProxy.lockRenderState();
            }
            unlockRenderState():void
            {
                this.m_renderProxy.unlockRenderState();
            }
            useGlobalRenderStateByName(stateNS:string):void
            {
                if(this.m_renderProxy != null)
                {
                    this.m_renderProxy.unlockRenderState();
                    this.m_renderProxy.useRenderState( RendererState.GetRenderStateByName(stateNS));
                    this.m_renderProxy.lockRenderState();
                }
            }
            useGlobalMaterial(m:MaterialBase):void
            {
                this.m_gMateiral = m;
            }
            
            lockMaterial():void
            {
                this.m_materialProxy.lockMaterial();
            }
            unlockMaterial():void
            {
                this.m_gMateiral = null;
                this.m_materialProxy.unlockMaterial();
            }
            
            synFBOSizeWithViewport():void
			{
                this.m_synFBOSizeWithViewport = true;
            }
            asynFBOSizeWithViewport():void
			{
                this.m_synFBOSizeWithViewport = false;
            }
            // if synFBOSizeWithViewport is true, fbo size = factor * view port size;
			setFBOSizeFactorWithViewPort(factor:number):void
			{
                this.m_fboSizeFactor = factor;
            }
            
			createViewportSizeFBOAt(fboIndex:number, enableDepth:boolean = false, enableStencil:boolean = false,multisampleLevel:number = 0):void
			{
                if(this.m_fboIndex < 0)
                {
                    this.m_fboIndex = fboIndex;
                    this.m_fboType = FrameBufferType.FRAMEBUFFER;
                    this.m_initW = this.m_adapter.getViewportWidth();
                    this.m_initH = this.m_adapter.getViewportHeight();
                    this.m_enableDepth = enableDepth;
                    this.m_enableStencil = enableStencil;
                    this.m_multisampleLevel = multisampleLevel;
                    this.m_adapter.createFBOAt(fboIndex,this.m_fboType,this.m_initW,this.m_initH,enableDepth,enableStencil,multisampleLevel);
                }
            }
			createFBOAt(fboIndex:number, pw:number,ph:number, enableDepth:boolean = false, enableStencil:boolean = false,multisampleLevel:number = 0):void
			{
                if(this.m_fboIndex < 0)
                {
                    this.m_fboIndex = fboIndex;
                    this.m_fboType = FrameBufferType.FRAMEBUFFER;
                    this.m_initW = pw;
                    this.m_initH = ph;
                    this.m_enableDepth = enableDepth;
                    this.m_enableStencil = enableStencil;
                    this.m_multisampleLevel = multisampleLevel;
                    this.m_adapter.createFBOAt(fboIndex,this.m_fboType,pw,ph,enableDepth,enableStencil,multisampleLevel);
                }
            }
			createReadFBOAt(fboIndex:number, pw:number,ph:number, enableDepth:boolean = false, enableStencil:boolean = false,multisampleLevel:number = 0):void
			{
                if(this.m_fboIndex < 0)
                {
                    this.m_fboIndex = fboIndex;
                    this.m_fboType = FrameBufferType.READ_FRAMEBUFFER;
                    this.m_initW = pw;
                    this.m_initH = ph;
                    this.m_enableDepth = enableDepth;
                    this.m_enableStencil = enableStencil;
                    this.m_multisampleLevel = multisampleLevel;
                    this.m_adapter.createFBOAt(fboIndex,this.m_fboType,pw,ph,enableDepth,enableStencil,multisampleLevel);
                }
            }
            
			createDrawFBOAt(fboIndex:number, pw:number,ph:number, enableDepth:boolean = false, enableStencil:boolean = false,multisampleLevel:number = 0):void
			{
                if(this.m_fboIndex < 0)
                {
                    this.m_fboIndex = fboIndex;
                    this.m_fboType = FrameBufferType.DRAW_FRAMEBUFFER;
                    this.m_initW = pw;
                    this.m_initH = ph;
                    this.m_enableDepth = enableDepth;
                    this.m_enableStencil = enableStencil;
                    this.m_multisampleLevel = multisampleLevel;
                    this.m_adapter.createFBOAt(fboIndex,this.m_fboType,pw,ph,enableDepth,enableStencil,multisampleLevel);
                }
            }
            getTextureAt(i:number):TextureProxy
            {
                return this.m_texs[i];
            }
            setRenderToTexture(texProxy:TextureProxy, outputIndex:number = 0):void
            {
                if(outputIndex == 0)
                {
                    this.m_texsTot = 1;
                }
                else if(this.m_texsTot < (outputIndex + 1))
                {
                    this.m_texsTot = outputIndex + 1;
                }
                this.m_texs[outputIndex] = texProxy;
            }
            setClearState(clearColorBoo:boolean, clearDepthBoo:boolean, clearStencilBoo:boolean = false):void
            {
                this.m_clearColorBoo = clearColorBoo;
                this.m_clearDepthBoo = clearDepthBoo;
                this.m_clearStencilBoo = clearStencilBoo;
            }
            setRenderToBackBuffer():void
            {
                this.m_adapter.setRenderToBackBuffer();
            }
			setClearDepth(depth:number):void { this.m_clearDepth = depth; }
			getClearDepth():number { return this.m_adapter.getClearDepth(); }
			getViewX():number { return this.m_adapter.getViewportX(); }
			getViewY():number { return this.m_adapter.getViewportY(); }
			getViewWidth():number { return this.m_adapter.getViewportWidth(); }
            getViewHeight():number { return this.m_adapter.getViewportHeight(); }
			getFBOWidth():number { return this.m_adapter.getFBOWidthAt(this.m_fboIndex); }
            getFBOHeight():number { return this.m_adapter.getFBOHeightAt(this.m_fboIndex); }
            
            setClearRGBColor3f(pr:number,pg:number,pb:number)
            {
                this.m_bgColor.setRGB3f(pr,pg,pb);
            }
            setClearColorEnabled(boo:boolean):void
            {
                this.m_clearColorBoo = boo;
            }
            setClearDepthEnabled(boo:boolean):void
            {
                this.m_clearDepthBoo = boo;
            }
            setClearStencilEnabled(boo:boolean):void
            {
                this.m_clearStencilBoo = boo;
            }

            setClearUint24Color(colorUint24:number,alpha:number = 1.0):void
            {
                this.m_bgColor.setRGBUint24(colorUint24);
                this.m_bgColor.a = alpha;
            }
            setClearRGBAColor4f(pr:number,pg:number,pb:number,pa:number):void
            {
                this.m_bgColor.setRGBA4f(pr,pb,pg,pa);
            }
			/**
			 * @oaram			clearType, it is RenderProxy.COLOR or RenderProxy.DEPTH or RenderProxy.STENCIL or RenderProxy.DEPTH_STENCIL
			*/
            blitFrom(fboIns:FBOInstance,mask_bitfiled:number = RenderMaskBitfield.COLOR_BUFFER_BIT, filter:number = RenderFilter.NEAREST, clearType:number = -1,clearIndex:number = 0,dataArr:number[] = null):void
            {
                if(this.m_fboIndex >= 0)
                {
                    this.m_adapter.setBlitFboSrcRect(0,0,fboIns.getFBOWidth(),fboIns.getFBOHeight());
                    this.m_adapter.setBlitFboSrcRect(0,0,this.getFBOWidth(),this.getFBOHeight());
                    this.m_adapter.blitFBO(fboIns.getFBOUid(),this.m_fboIndex,mask_bitfiled,filter,clearType,clearIndex,dataArr);
                }
            }
            blitColorFrom(fboIns:FBOInstance,filter:number = RenderFilter.NEAREST, clearType:number = -1,clearIndex:number = 0,dataArr:number[] = null):void
            {
                if(this.m_fboIndex >= 0)
                {
                    this.m_adapter.setBlitFboSrcRect(0,0,fboIns.getFBOWidth(),fboIns.getFBOHeight());
                    this.m_adapter.setBlitFboSrcRect(0,0,this.getFBOWidth(),this.getFBOHeight());
                    this.m_adapter.blitFBO(fboIns.getFBOUid(),this.m_fboIndex,RenderMaskBitfield.COLOR_BUFFER_BIT,filter,clearType,clearIndex,dataArr);
                }
            }
            blitDepthFrom(fboIns:FBOInstance,filter:number = RenderFilter.NEAREST, clearType:number = -1,clearIndex:number = 0,dataArr:number[] = null):void
            {
                if(this.m_fboIndex >= 0)
                {
                    this.m_adapter.setBlitFboSrcRect(0,0,fboIns.getFBOWidth(),fboIns.getFBOHeight());
                    this.m_adapter.setBlitFboSrcRect(0,0,this.getFBOWidth(),this.getFBOHeight());
                    this.m_adapter.blitFBO(fboIns.getFBOUid(),this.m_fboIndex,RenderMaskBitfield.COLOR_BUFFER_BIT | RenderMaskBitfield.DEPTH_BUFFER_BIT,filter,clearType,clearIndex,dataArr);
                }
            }
            blitColorAndDepthFrom(fboIns:FBOInstance,filter:number = RenderFilter.NEAREST, clearType:number = -1,clearIndex:number = 0,dataArr:number[] = null):void
            {
                if(this.m_fboIndex >= 0)
                {
                    this.m_adapter.setBlitFboSrcRect(0,0,fboIns.getFBOWidth(),fboIns.getFBOHeight());
                    this.m_adapter.setBlitFboSrcRect(0,0,this.getFBOWidth(),this.getFBOHeight());
                    this.m_adapter.blitFBO(fboIns.getFBOUid(),this.m_fboIndex,RenderMaskBitfield.COLOR_BUFFER_BIT | RenderMaskBitfield.DEPTH_BUFFER_BIT,filter,clearType,clearIndex,dataArr);
                }
            }
            blitStencilFrom(fboIns:FBOInstance,filter:number = RenderFilter.NEAREST, clearType:number = -1,clearIndex:number = 0,dataArr:number[] = null):void
            {
                if(this.m_fboIndex >= 0)
                {
                    this.m_adapter.setBlitFboSrcRect(0,0,fboIns.getFBOWidth(),fboIns.getFBOHeight());
                    this.m_adapter.setBlitFboSrcRect(0,0,this.getFBOWidth(),this.getFBOHeight());
                    this.m_adapter.blitFBO(fboIns.getFBOUid(),this.m_fboIndex,RenderMaskBitfield.STENCIL_BUFFER_BIT,filter,clearType,clearIndex,dataArr);
                }
            }
            private runBeginDo():void
            {
                if(this.m_runBegin)
                {
                    this.m_runBegin = false;

                    if(this.m_viewportLock)
                    {
                        this.m_adapter.lockViewport();
                    }
                    else
                    {
                        this.m_adapter.unlockViewport();
                    }
                    this.m_adapter.bindFBOAt(this.m_fboIndex,this.m_fboType);
                    if(this.m_synFBOSizeWithViewport)
                    {
                        this.m_adapter.synFBOSizeWithViewport();
                        this.m_adapter.setFBOSizeFactorWithViewPort(this.m_fboSizeFactor);
                    }
                    else
                    {
                        this.m_adapter.asynFBOSizeWithViewport();
                    }
                    if(this.m_clearDepth < 128.0)
                    {
                        this.m_adapter.setClearDepth(this.m_clearDepth);
                    }
                    this.m_renderProxy.setClearColor(this.m_bgColor);
                    let i:number = 0;
                    for(; i < this.m_texsTot; ++i)
                    {
                        this.m_adapter.setRenderToTexture(this.m_texs[i],this.m_enableDepth,this.m_enableStencil,i);
                    }
                    this.m_adapter.useFBO(this.m_clearColorBoo,this.m_clearDepthBoo,this.m_clearStencilBoo);
                    if(this.m_gMateiral != null)
                    {
                        this.m_materialProxy.unlockMaterial();
                        this.m_materialProxy.useGlobalMaterial(this.m_gMateiral);
                        this.m_materialProxy.lockMaterial();
                    }
                }
            }
            run():void
            {
                if(this.m_fboIndex >= 0 && this.m_rindexs != null)
                {
                    this.runBeginDo();
                    for(let i:number = 0,len:number = this.m_rindexs.length; i < len; ++i)
                    {
                        this.m_render.runAt(this.m_rindexs[i]);
                    }
                    this.m_runBegin = true;
                }
            }
            runAt(index:number):void
            {
                if(this.m_fboIndex >= 0 && this.m_rindexs != null)
                {
                    if(index == 0)
                    {
                        this.runBeginDo();
                    }
                    else
                    {
                        this.m_runBegin = true;
                    }
                    this.m_render.runAt(this.m_rindexs[index]);
                }
            }
            
            runBegin():void
            {
                if(this.m_fboIndex >= 0 && this.m_rindexs != null)
                {
                    this.m_runBegin = true;
                    this.runBeginDo();
                }
            }
            runEnd():void
            {
                this.m_runBegin = true;
                this.m_adapter.unlockViewport();
            }
            reset():void
            {
                this.m_runBegin = true;
                this.m_fboIndex = -1;
                this.m_texsTot = 0;
            }
            
            clone():FBOInstance
            {

                let ins:FBOInstance = new FBOInstance(this.m_render);
                ins.m_fboSizeFactor = this.m_fboSizeFactor;
                ins.m_bgColor.copyFrom(this.m_bgColor);
                ins.m_fboIndex = this.m_fboIndex;
                ins.m_fboType = this.m_fboType;
                ins.m_clearDepth = this.m_clearDepth;
                ins.m_texsTot = this.m_texsTot;
                ins.m_enableDepth = this.m_enableDepth;
                ins.m_enableStencil = this.m_enableStencil;
                
                ins.m_initW = this.m_initW;
                ins.m_initH = this.m_initH;
                ins.m_multisampleLevel = this.m_multisampleLevel;

                let i:number = 0;
                for(; i < this.m_texsTot; ++i)
                {
                    ins.m_texs[i] = ins.m_texs[i];
                }
                if(this.m_rindexs != null)
                {
                    let len:number = this.m_rindexs.length;
                    let list:number[] = new Array(len);
                    for(i = 0; i < len; ++i)
                    {
                        list[i] = this.m_rindexs[i];
                    }
                    ins.setRProcessIDList(list);
                }
                return ins;
            }
        }
    }
}
