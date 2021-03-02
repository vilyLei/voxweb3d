/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2020 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as TextureConstT from "../../vox/texture/TextureConst";
import * as TextureProxyT from "../../vox/texture/TextureProxy";
import * as RTTTextureProxyT from "../../vox/texture/RTTTextureProxy";
import * as Plane3DEntityT from "../../vox/entity/Plane3DEntity";
import * as BlurMaterialT from "../../renderingtoy/mcase/material/PingpongBlurMaterial";
import * as RendererStateT from "../../vox/render/RendererState";
import * as RenderAdapterT from "../../vox/render/RenderAdapter";
import * as RenderProxyT from "../../vox/render/RenderProxy";
import * as RendererInstanceT from "../../vox/scene/RendererInstance";

import TextureConst = TextureConstT.vox.texture.TextureConst;
import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
import RTTTextureProxy = RTTTextureProxyT.vox.texture.RTTTextureProxy;
import Plane3DEntity = Plane3DEntityT.vox.entity.Plane3DEntity;
import PingpongBlurMaterial = BlurMaterialT.renderingtoy.mcase.material.PingpongBlurMaterial;
import RendererState = RendererStateT.vox.render.RendererState;
import RenderAdapter = RenderAdapterT.vox.render.RenderAdapter;
import RenderProxy = RenderProxyT.vox.render.RenderProxy;
import RendererInstance = RendererInstanceT.vox.scene.RendererInstance;

export namespace renderingtoy
{
    export namespace mcase
    {
        export class PingpongBlur
        {
            public static HORIZONTAL:number = 0;
            public static VERTICAL:number = 1;
            public static HORIZONTAL_AND_VERTICAL:number = 2;
            private m_renderer:RendererInstance = null;
            private m_screenPlane_0:Plane3DEntity = null;
            private m_screenPlane_1:Plane3DEntity = null;
            private m_blurCount:number = 15;
            private m_blurDensity:number = 2.0;
            private m_hMaterial:PingpongBlurMaterial = null;
            private m_vMaterial:PingpongBlurMaterial = null;
            private m_backbufferVisible = true;
            private m_texs:RTTTextureProxy[] = [null,null];
            private m_blurMode:number = 2;
            constructor(renderer:RendererInstance)
            {
                this.m_renderer = renderer;
            }
            setBlurMode(blurMode:number):void
            {
                this.m_blurMode = blurMode;
            }
            setBlurCount(total:number):void
            {
                if(total < 1)
                {
                    total = 1;
                }
                this.m_blurCount = total;
            }
            setBlurDensity(density:number):void
            {
                this.m_blurDensity = density;
            }
            setBackbufferVisible(boo:boolean):void
            {
                this.m_backbufferVisible = boo;
            }
            synViewportSize():void
		    {
                let rc:RenderProxy = this.m_renderer.getRenderProxy();
                rc.getRenderAdapter().synFBOSizeWithViewport();
		    }
		    asynViewportSize():void
		    {
                let rc:RenderProxy = this.m_renderer.getRenderProxy();
                rc.getRenderAdapter().asynFBOSizeWithViewport();
		    }
            public getDstTexture():RTTTextureProxy
            {
                return this.getTextureAt(this.m_blurCount%2);       
            }
            public setSrcTexture(tex:RTTTextureProxy):void
        	{
                this.m_texs[0] = tex;
            }
            public getTextureAt(index:number):RTTTextureProxy
        	{
                if(this.m_texs[index] != null)
                {
                    return this.m_texs[index];
                }
                let tex:RTTTextureProxy = new RTTTextureProxy(this.m_renderer.getViewWidth(),this.m_renderer.getViewHeight());
                this.m_texs[index] = tex;
                this.m_texs[index].minFilter = TextureConst.NEAREST;
                this.m_texs[index].magFilter = TextureConst.NEAREST;
                return this.m_texs[index];
            }
            private m_flagBoo:boolean = true;
            runBegin(srcProcessIndex:number,dstProcessIndex:number):void
            {let rc:RenderProxy = this.m_renderer.getRenderProxy();
                let adapter:RenderAdapter = rc.getRenderAdapter();
                let viewW:number = adapter.getViewportWidth();
                let viewH:number = adapter.getViewportHeight();
                let tex0:TextureProxy = this.getTextureAt(0);
                let tex1:TextureProxy = this.getTextureAt(1);
                if(this.m_screenPlane_0 == null)
                {
                    let mh:number = 0;
                    let mv:number = 1;
                    switch(this.m_blurMode)
                    {
                        case PingpongBlur.HORIZONTAL:
                            mv = 0;
                        break;
                        case PingpongBlur.VERTICAL:
                            mh = 1;
                        break;
                        default:
                        break
                    }
                    this.m_vMaterial = new PingpongBlurMaterial(mv);
                    this.m_vMaterial.setBlurDensity(this.m_blurDensity);
                    let plane3D = new Plane3DEntity();
                    plane3D.setMaterial( this.m_vMaterial );
                    plane3D.initializeXOY(-1.0,-1.0, 2.0,2.0, [tex0]);
                    this.m_renderer.addEntity(plane3D,dstProcessIndex);
                    plane3D.getDisplay().renderState = RendererState.BACK_NORMAL_ALWAYS_STATE;
                    this.m_screenPlane_0 = plane3D;
                    this.m_screenPlane_0.setVisible(false);
                    //
                    this.m_hMaterial = new PingpongBlurMaterial(mh);
                    this.m_hMaterial.setBlurDensity(this.m_blurDensity);
                    plane3D = new Plane3DEntity();
                    plane3D.setMaterial( this.m_hMaterial );
                    plane3D.initializeXOY(-1.0,-1.0, 2.0,2.0, [tex1]);
                    this.m_renderer.addEntity(plane3D,dstProcessIndex);
                    plane3D.getDisplay().renderState = RendererState.BACK_NORMAL_ALWAYS_STATE;
                    this.m_screenPlane_1 = plane3D;
                    this.m_screenPlane_1.setVisible(false);
                }
                this.m_vMaterial.setTexSize(viewW, viewH);
                this.m_hMaterial.setTexSize(viewW, viewH);
                this.m_flagBoo = false;
            }
            run(srcProcessIndex:number,dstProcessIndex:number):void
            {
                let rc:RenderProxy = this.m_renderer.getRenderProxy();
                let adapter:RenderAdapter = rc.getRenderAdapter();
                let viewW:number = adapter.getViewportWidth();
                let viewH:number = adapter.getViewportHeight();
                let tex0:RTTTextureProxy = this.getTextureAt(0);
                let tex1:RTTTextureProxy = this.getTextureAt(1);
                if(this.m_flagBoo)
                {
                    if(this.m_screenPlane_0 == null)
                    {
                        let mh:number = 0;
                        let mv:number = 1;
                        switch(this.m_blurMode)
                        {
                            case PingpongBlur.HORIZONTAL:
                                mv = 0;
                            break;
                            case PingpongBlur.VERTICAL:
                                mh = 1;
                            break;
                            default:
                            break
                        }
                        this.m_vMaterial = new PingpongBlurMaterial(mv);
                        this.m_vMaterial.setBlurDensity(this.m_blurDensity);
                        let plane3D = new Plane3DEntity();
                        plane3D.setMaterial( this.m_vMaterial );
                        plane3D.initializeXOY(-1.0,-1.0, 2.0,2.0, [tex0]);
                        this.m_renderer.addEntity(plane3D,dstProcessIndex);
                        plane3D.getDisplay().renderState = RendererState.BACK_NORMAL_ALWAYS_STATE;
                        this.m_screenPlane_0 = plane3D;
                        this.m_screenPlane_0.setVisible(false);
                        //
                        this.m_hMaterial = new PingpongBlurMaterial(mh);
                        this.m_hMaterial.setBlurDensity(this.m_blurDensity);
                        plane3D = new Plane3DEntity();
                        plane3D.setMaterial( this.m_hMaterial );
                        plane3D.initializeXOY(-1.0,-1.0, 2.0,2.0, [tex1]);
                        this.m_renderer.addEntity(plane3D,dstProcessIndex);
                        plane3D.getDisplay().renderState = RendererState.BACK_NORMAL_ALWAYS_STATE;
                        this.m_screenPlane_1 = plane3D;
                        this.m_screenPlane_1.setVisible(false);
                    }
                    this.m_vMaterial.setTexSize(viewW, viewH);
                    this.m_hMaterial.setTexSize(viewW, viewH);
                }
                this.m_flagBoo = true;
                // 将srcProcessIndex 里面的显示内容绘制到 fbo, 以便获取初始数据源
                adapter.setRenderToTexture(tex0, true, false, 0);
                adapter.useFBO(true, true, false);
                this.m_renderer.runAt(srcProcessIndex);
                // 设置模糊的背景色数据
                for(let i:number = 0; i < this.m_blurCount; ++i)
                {
                    // 这里面是不需要处理深度的
                    if((i%2) == 0)
                    {
                        //  往 1 里面绘制, 数据源是 0
                        this.m_screenPlane_0.setVisible(true);
                        this.m_screenPlane_1.setVisible(false);
                        adapter.setRenderToTexture(tex1, true, false, 0);
                        adapter.useFBO(true, true, false);
                        this.m_renderer.runAt(dstProcessIndex);
                    }
                    else
                    {
                        //  往 0 里面绘制, 数据源是 1
                        this.m_screenPlane_0.setVisible(false);
                        this.m_screenPlane_1.setVisible(true);
                        adapter.setRenderToTexture(tex0, true, false, 0);
                        adapter.useFBO(true, true, false);
                        this.m_renderer.runAt(dstProcessIndex);
                    }
                }
                this.m_screenPlane_0.setVisible(!this.m_screenPlane_0.getVisible());
                this.m_screenPlane_1.setVisible(!this.m_screenPlane_1.getVisible());
                if(this.m_backbufferVisible)
                {
                    adapter.setRenderToBackBuffer();
                    rc.unlockRenderState();
                    this.m_renderer.runAt(dstProcessIndex);
                }
            }
            
            runBlur(dstProcessIndex:number):void
            {
                let rc:RenderProxy = this.m_renderer.getRenderProxy();
                let adapter:RenderAdapter = rc.getRenderAdapter();
                let viewW:number = adapter.getViewportWidth();
                let viewH:number = adapter.getViewportHeight();
                let tex0:RTTTextureProxy = this.getTextureAt(0);
                let tex1:RTTTextureProxy = this.getTextureAt(1);
                if(this.m_flagBoo)
                {
                    if(this.m_screenPlane_0 == null)
                    {
                        let mh:number = 0;
                        let mv:number = 1;
                        switch(this.m_blurMode)
                        {
                            case PingpongBlur.HORIZONTAL:
                                mv = 0;
                            break;
                            case PingpongBlur.VERTICAL:
                                mh = 1;
                            break;
                            default:
                            break
                        }
                        this.m_vMaterial = new PingpongBlurMaterial(mv);
                        this.m_vMaterial.setBlurDensity(this.m_blurDensity);
                        let plane3D = new Plane3DEntity();
                        plane3D.setMaterial( this.m_vMaterial );
                        plane3D.initializeXOY(-1.0,-1.0, 2.0,2.0, [tex0]);
                        this.m_renderer.addEntity(plane3D,dstProcessIndex);
                        plane3D.getDisplay().renderState = RendererState.BACK_NORMAL_ALWAYS_STATE;
                        this.m_screenPlane_0 = plane3D;
                        this.m_screenPlane_0.setVisible(false);
                        //
                        this.m_hMaterial = new PingpongBlurMaterial(mh);
                        this.m_hMaterial.setBlurDensity(this.m_blurDensity);
                        plane3D = new Plane3DEntity();
                        plane3D.setMaterial( this.m_hMaterial );
                        plane3D.initializeXOY(-1.0,-1.0, 2.0,2.0, [tex1]);
                        this.m_renderer.addEntity(plane3D,dstProcessIndex);
                        plane3D.getDisplay().renderState = RendererState.BACK_NORMAL_ALWAYS_STATE;
                        this.m_screenPlane_1 = plane3D;
                        this.m_screenPlane_1.setVisible(false);
                    }
                    this.m_vMaterial.setTexSize(viewW, viewH);
                    this.m_hMaterial.setTexSize(viewW, viewH);
                }
                this.m_flagBoo = true;
                // 将srcProcessIndex 里面的显示内容绘制到 fbo, 以便获取初始数据源
                // 设置模糊的背景色数据
                for(let i:number = 0; i < this.m_blurCount; ++i)
                {
                    // 这里面是不需要处理深度的
                    if((i%2) == 0)
                    {
                        //  往 1 里面绘制, 数据源是 0
                        this.m_screenPlane_0.setVisible(true);
                        this.m_screenPlane_1.setVisible(false);
                        adapter.setRenderToTexture(tex1, true, false, 0);
                        adapter.useFBO(true, true, false);
                        this.m_renderer.runAt(dstProcessIndex);
                    }
                    else
                    {
                        //  往 0 里面绘制, 数据源是 1
                        this.m_screenPlane_0.setVisible(false);
                        this.m_screenPlane_1.setVisible(true);
                        adapter.setRenderToTexture(tex0, true, false, 0);
                        adapter.useFBO(true, true, false);
                        this.m_renderer.runAt(dstProcessIndex);
                    }
                }
                this.m_screenPlane_0.setVisible(false);
                this.m_screenPlane_1.setVisible(false);
                
            }
            destroy():void
            {
                this.m_renderer = null;
            }
        }
    }
}