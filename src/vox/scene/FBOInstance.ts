/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// FBO Manager

import * as Stage3DT from "../../vox/display/Stage3D";
import * as CameraBaseT from "../../vox/view/CameraBase";
import * as RendererStateT from "../../vox/render/RendererState";
import * as RAdapterContextT from "../../vox/render/RAdapterContext";
import * as RenderAdapterT from "../../vox/render/RenderAdapter";
import * as TextureProxyT from "../../vox/texture/TextureProxy";
import * as RenderProxyT from "../../vox/render/RenderProxy";
import * as Color4T from "../../vox/material/Color4";
import * as MaterialBaseT from "../../vox/material/MaterialBase";
import * as RenderMaterialProxyT from "../../vox/render/RenderMaterialProxy";
import * as FrameBufferTypeT from "../../vox/render/FrameBufferType";
import * as IRendererT from "../../vox/scene/IRenderer";

import Stage3D = Stage3DT.vox.display.Stage3D;
import CameraBase = CameraBaseT.vox.view.CameraBase;
import RAdapterContext = RAdapterContextT.vox.render.RAdapterContext;
import RendererState = RendererStateT.vox.render.RendererState;
import RenderAdapter = RenderAdapterT.vox.render.RenderAdapter;
import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
import RenderProxy = RenderProxyT.vox.render.RenderProxy;
import MaterialBase = MaterialBaseT.vox.material.MaterialBase;
import Color4 = Color4T.vox.material.Color4;
import RenderMaterialProxy = RenderMaterialProxyT.vox.render.RenderMaterialProxy;
import FrameBufferType = FrameBufferTypeT.vox.render.FrameBufferType;
import IRenderer = IRendererT.vox.scene.IRenderer;

export namespace vox
{
    export namespace scene
    {
        export class FBOInstance
        {
            private m_rAdapter:RenderAdapter = null;
            private m_renderProxy:RenderProxy = null;
            private m_materialProxy:RenderMaterialProxy = null;
            private m_bgColor:Color4 = new Color4();
            private m_render:IRenderer = null;

            private m_fboIndex:number = -1;
            private m_fboType:number = -1;
            private m_initW:number = 128;
            private m_initH:number = 128;
            private m_enableDepth:boolean = true;
            private m_enableStencil:boolean = false;
            private m_multisampleLevel:number = 0;
            private m_gMateiral:MaterialBase = null;
            private m_rindexs:number[] = null;
            private m_texs:TextureProxy[] = [null,null,null,null,null,null,null,null];
            private m_texsTot:number = 0;
            private m_synFBOSizeWithViewport:boolean = true;
            private m_fboSizeFactor:number = 1.0;
            private m_clearDepth:number = 256.0;
            private m_clearColorBoo:boolean = true;
            private m_clearDepthBoo:boolean = true;
            private m_clearStencilBoo:boolean = false;
            constructor(render:IRenderer)
            {
                this.m_render = render;
                this.m_renderProxy = render.getRenderProxy();
                this.m_rAdapter = this.m_renderProxy.getRenderAdapter();
                this.m_materialProxy = this.m_render.getRendererContext().getRenderMaterialProxy();
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
            
			createViewSizeFBOAt(fboIndex:number, enableDepth:boolean = false, enableStencil:boolean = false,multisampleLevel:number = 0):void
			{
                if(this.m_fboIndex < 0)
                {
                    this.m_fboIndex = fboIndex;
                    this.m_fboType = FrameBufferType.FRAMEBUFFER;
                    this.m_initW = this.m_rAdapter.getViewportWidth();
                    this.m_initH = this.m_rAdapter.getViewportHeight();
                    this.m_enableDepth = enableDepth;
                    this.m_enableStencil = enableStencil;
                    this.m_multisampleLevel = multisampleLevel;
                    this.m_rAdapter.createFBOAt(fboIndex,this.m_fboType,this.m_initW,this.m_initH,enableDepth,enableStencil,multisampleLevel);
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
                    this.m_rAdapter.createFBOAt(fboIndex,this.m_fboType,pw,ph,enableDepth,enableStencil,multisampleLevel);
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
                    this.m_rAdapter.createFBOAt(fboIndex,this.m_fboType,pw,ph,enableDepth,enableStencil,multisampleLevel);
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
                    this.m_rAdapter.createFBOAt(fboIndex,this.m_fboType,pw,ph,enableDepth,enableStencil,multisampleLevel);
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
                this.m_rAdapter.setRenderToBackBuffer();
            }
			setClearDepth(depth:number):void { this.m_clearDepth = depth; }
			getClearDepth():number { return this.m_rAdapter.getClearDepth(); }
			getViewX():number { return this.m_rAdapter.getViewportX(); }
			getViewY():number { return this.m_rAdapter.getViewportY(); }
			getViewWidth():number { return this.m_rAdapter.getViewportWidth(); }
            getViewHeight():number { return this.m_rAdapter.getViewportHeight(); }
            
            setClearRGBColor3f(pr:number,pg:number,pb:number)
            {
                this.m_bgColor.setRGB3f(pr,pb,pg);
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

            setClearRGBAColor4f(pr:number,pg:number,pb:number,pa:number):void
            {
                this.m_bgColor.setRGBA4f(pr,pb,pg,pa);
            }
            run():void
            {
                if(this.m_fboIndex >= 0 && this.m_rindexs != null)
                {
                    this.m_rAdapter.bindFBOAt(this.m_fboIndex,this.m_fboType);
                    if(this.m_synFBOSizeWithViewport)
                    {
                        this.m_rAdapter.synFBOSizeWithViewport();
                        this.m_rAdapter.setFBOSizeFactorWithViewPort(this.m_fboSizeFactor);
                    }
                    else
                    {
                        this.m_rAdapter.asynFBOSizeWithViewport();
                    }
                    if(this.m_clearDepth < 128.0)
                    {
                        this.m_rAdapter.setClearDepth(this.m_clearDepth);
                    }
                    this.m_renderProxy.setClearColor(this.m_bgColor);
                    let i:number = 0;
                    for(; i < this.m_texsTot; ++i)
                    {
                        this.m_rAdapter.setRenderToTexture(this.m_texs[i],this.m_enableDepth,this.m_enableStencil,i);
                    }
                    this.m_rAdapter.useFBO(this.m_clearColorBoo,this.m_clearDepthBoo,this.m_clearStencilBoo);
                    if(this.m_gMateiral != null)
                    {
                        this.m_materialProxy.unlockMaterial();
                        this.m_materialProxy.useGlobalMaterial(this.m_gMateiral);
                        this.m_materialProxy.lockMaterial();
                    }
                    let len:number = this.m_rindexs.length;
                    for(i = 0; i < len; ++i)
                    {
                        this.m_render.runAt(this.m_rindexs[i]);
                    }

                }
            }
            runAt(index:number):void
            {
                if(this.m_fboIndex >= 0 && this.m_rindexs != null)
                {
                    if(index == 0)
                    {
                        this.m_rAdapter.bindFBOAt(this.m_fboIndex,this.m_fboType);
                        if(this.m_synFBOSizeWithViewport)
                        {
                            this.m_rAdapter.synFBOSizeWithViewport();
                            this.m_rAdapter.setFBOSizeFactorWithViewPort(this.m_fboSizeFactor);
                        }
                        else
                        {
                            this.m_rAdapter.asynFBOSizeWithViewport();
                        }
                        if(this.m_clearDepth < 128.0)
                        {
                            this.m_rAdapter.setClearDepth(this.m_clearDepth);
                        }
                        this.m_renderProxy.setClearColor(this.m_bgColor);
                        let i:number = 0;
                        for(; i < this.m_texsTot; ++i)
                        {
                            this.m_rAdapter.setRenderToTexture(this.m_texs[i],this.m_enableDepth,this.m_enableStencil,i);
                        }
                        this.m_rAdapter.useFBO(this.m_clearColorBoo,this.m_clearDepthBoo,this.m_clearStencilBoo);
                        if(this.m_gMateiral != null)
                        {
                            this.m_materialProxy.unlockMaterial();
                            this.m_materialProxy.useGlobalMaterial(this.m_gMateiral);
                            this.m_materialProxy.lockMaterial();
                        }
                    }
                    this.m_render.runAt(this.m_rindexs[index]);
                }
            }
            
            runBegin():void
            {
                if(this.m_fboIndex >= 0 && this.m_rindexs != null)
                {
                    this.m_rAdapter.bindFBOAt(this.m_fboIndex,this.m_fboType);
                    if(this.m_synFBOSizeWithViewport)
                    {
                        this.m_rAdapter.synFBOSizeWithViewport();
                        this.m_rAdapter.setFBOSizeFactorWithViewPort(this.m_fboSizeFactor);
                    }
                    else
                    {
                        this.m_rAdapter.asynFBOSizeWithViewport();
                    }
                    if(this.m_clearDepth < 128.0)
                    {
                        this.m_rAdapter.setClearDepth(this.m_clearDepth);
                    }
                    this.m_renderProxy.setClearColor(this.m_bgColor);
                    let i:number = 0;
                    for(; i < this.m_texsTot; ++i)
                    {
                        this.m_rAdapter.setRenderToTexture(this.m_texs[i],this.m_enableDepth,this.m_enableStencil,i);
                    }
                    this.m_rAdapter.useFBO(this.m_clearColorBoo,this.m_clearDepthBoo,this.m_clearStencilBoo);
                    if(this.m_gMateiral != null)
                    {
                        this.m_materialProxy.unlockMaterial();
                        this.m_materialProxy.useGlobalMaterial(this.m_gMateiral);
                        this.m_materialProxy.lockMaterial();
                    }
                }
            }
            
            runOnlyAll():void
            {
                if(this.m_fboIndex >= 0 && this.m_rindexs != null)
                {                    
                    let len:number = this.m_rindexs.length;
                    for(let i:number = 0; i < len; ++i)
                    {
                        this.m_render.runAt(this.m_rindexs[i]);
                    }

                }
            }
            runOnlyAt(index:number):void
            {
                this.m_render.runAt(this.m_rindexs[index]);
            }
            reset():void
            {
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
                    let list:number[] = [];
                    for(i = 0; i < len; ++i)
                    {
                        list.push(this.m_rindexs[i]);
                    }
                    ins.setRProcessIDList(list);
                }
                return ins;
            }
        }
    }
}
