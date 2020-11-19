/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2020 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// 用于对 RPOBlock 进行必要的组织, 例如 合批或者按照 shader不同来分类, 以及依据其他机制分类等等
// 目前一个block内的所有node 所使用的shader program 是相同的

import * as TextureConstT from "../../../vox/texture/TextureConst";
import * as TextureProxyT from "../../../vox/texture/TextureProxy";
import * as TextureStoreT from "../../../vox/texture/TextureStore";
import * as Plane3DEntityT from "../../../vox/entity/Plane3DEntity";
import * as MaterialBaseT from "../../../vox/material//mcase/PingpongBlurMaterial";
import * as RODrawStateT from "../../../vox/render/RODrawState";
import * as RenderAdapterT from "../../../vox/render/RenderAdapter";
import * as RenderProxyT from "../../../vox/render/RenderProxy";
import * as RendererInstanceT from "../../../vox/scene/RendererInstance";

import TextureConst = TextureConstT.vox.texture.TextureConst;
import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
import TextureStore = TextureStoreT.vox.texture.TextureStore;
import Plane3DEntity = Plane3DEntityT.vox.entity.Plane3DEntity;
import PingpongBlurMaterial = MaterialBaseT.vox.material.mcase.PingpongBlurMaterial;
import RenderStateObject = RODrawStateT.vox.render.RenderStateObject;
import RenderAdapter = RenderAdapterT.vox.render.RenderAdapter;
import RenderProxy = RenderProxyT.vox.render.RenderProxy;
import RendererInstance = RendererInstanceT.vox.scene.RendererInstance;

export namespace vox
{
    export namespace scene
    {
        export namespace mcase
        {
            export class ScreenPingpongBlur
            {
                public static HORIZONTAL:number = 0;
                public static VERTICAL:number = 1;
                public static HORIZONTAL_AND_VERTICAL:number = 2;
                private m_renderIns:RendererInstance = null;
                private m_screenPlane_0:Plane3DEntity = null;
                private m_screenPlane_1:Plane3DEntity = null;
                private m_blurCount:number = 15;
                private m_blurDensity:number = 2.0;
                private m_hMaterial:PingpongBlurMaterial = null;
                private m_vMaterial:PingpongBlurMaterial = null;
                private m_backbufferVisible = true;
                private m_texs:TextureProxy[] = [null,null];
                private m_blurMode:number = 2;
                //private m_synSizeWithViewport:boolean = false;
                constructor(renderIns:RendererInstance)
                {
                    this.m_renderIns = renderIns;
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
                    let rc:RenderProxy = this.m_renderIns.getRenderProxy();
                    rc.getRenderAdapter().synFBOSizeWithViewport();
			    }
			    asynViewportSize():void
			    {
                    let rc:RenderProxy = this.m_renderIns.getRenderProxy();
                    rc.getRenderAdapter().asynFBOSizeWithViewport();
			    }
                public getDstTexture():TextureProxy
                {
                    return this.getTextureAt(this.m_blurCount%2);       
                }
                public setSrcTexture(tex:TextureProxy):void
            	{
                    this.m_texs[0] = tex;
                }
                public getTextureAt(index:number):TextureProxy
            	{
                    if(this.m_texs[index] != null)
                    {
                        return this.m_texs[index];
                    }
                    this.m_texs[index] = TextureStore.CreateTex2D(this.m_renderIns.getViewWidth(),this.m_renderIns.getViewHeight());
                    this.m_texs[index].minFilter = TextureConst.NEAREST;
                    this.m_texs[index].magFilter = TextureConst.NEAREST;
                    return this.m_texs[index];
                }
                private m_flagBoo:boolean = true;
                runBegin(srcProcessIndex:number,dstProcessIndex:number):void
                {let rc:RenderProxy = this.m_renderIns.getRenderProxy();
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
                            case ScreenPingpongBlur.HORIZONTAL:
                                mv = 0;
                            break;
                            case ScreenPingpongBlur.VERTICAL:
                                mh = 1;
                            break;
                            default:
                            break
                        }
                        this.m_vMaterial = new PingpongBlurMaterial(mv);
                        this.m_vMaterial.setBlurDensity(this.m_blurDensity);
                        let plane3D = new Plane3DEntity();
                        plane3D.setMaterial( this.m_vMaterial );
                        plane3D.initialize(-1.0,-1.0, 2.0,2.0, [tex0]);
                        this.m_renderIns.addEntity(plane3D,dstProcessIndex);
                        plane3D.getDisplay().renderState = RenderStateObject.BACK_NORMAL_ALWAYS_STATE;
                        this.m_screenPlane_0 = plane3D;
                        this.m_screenPlane_0.setVisible(false);
                        //
                        this.m_hMaterial = new PingpongBlurMaterial(mh);
                        this.m_hMaterial.setBlurDensity(this.m_blurDensity);
                        plane3D = new Plane3DEntity();
                        plane3D.setMaterial( this.m_hMaterial );
                        plane3D.initialize(-1.0,-1.0, 2.0,2.0, [tex1]);
                        this.m_renderIns.addEntity(plane3D,dstProcessIndex);
                        plane3D.getDisplay().renderState = RenderStateObject.BACK_NORMAL_ALWAYS_STATE;
                        this.m_screenPlane_1 = plane3D;
                        this.m_screenPlane_1.setVisible(false);
                    }
                    this.m_vMaterial.setTexSize(viewW, viewH);
                    this.m_hMaterial.setTexSize(viewW, viewH);
                    this.m_flagBoo = false;
                }
                run(srcProcessIndex:number,dstProcessIndex:number):void
                {
                    let rc:RenderProxy = this.m_renderIns.getRenderProxy();
                    let adapter:RenderAdapter = rc.getRenderAdapter();
                    let viewW:number = adapter.getViewportWidth();
                    let viewH:number = adapter.getViewportHeight();
                    let tex0:TextureProxy = this.getTextureAt(0);
                    let tex1:TextureProxy = this.getTextureAt(1);
                    if(this.m_flagBoo)
                    {
                        if(this.m_screenPlane_0 == null)
                        {
                            let mh:number = 0;
                            let mv:number = 1;
                            switch(this.m_blurMode)
                            {
                                case ScreenPingpongBlur.HORIZONTAL:
                                    mv = 0;
                                break;
                                case ScreenPingpongBlur.VERTICAL:
                                    mh = 1;
                                break;
                                default:
                                break
                            }
                            this.m_vMaterial = new PingpongBlurMaterial(mv);
                            this.m_vMaterial.setBlurDensity(this.m_blurDensity);
                            let plane3D = new Plane3DEntity();
                            plane3D.setMaterial( this.m_vMaterial );
                            plane3D.initialize(-1.0,-1.0, 2.0,2.0, [tex0]);
                            this.m_renderIns.addEntity(plane3D,dstProcessIndex);
                            plane3D.getDisplay().renderState = RenderStateObject.BACK_NORMAL_ALWAYS_STATE;
                            this.m_screenPlane_0 = plane3D;
                            this.m_screenPlane_0.setVisible(false);
                            //
                            this.m_hMaterial = new PingpongBlurMaterial(mh);
                            this.m_hMaterial.setBlurDensity(this.m_blurDensity);
                            plane3D = new Plane3DEntity();
                            plane3D.setMaterial( this.m_hMaterial );
                            plane3D.initialize(-1.0,-1.0, 2.0,2.0, [tex1]);
                            this.m_renderIns.addEntity(plane3D,dstProcessIndex);
                            plane3D.getDisplay().renderState = RenderStateObject.BACK_NORMAL_ALWAYS_STATE;
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
                    this.m_renderIns.runAt(srcProcessIndex);
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
                            this.m_renderIns.runAt(dstProcessIndex);
                        }
                        else
                        {
                            //  往 0 里面绘制, 数据源是 1
                            this.m_screenPlane_0.setVisible(false);
                            this.m_screenPlane_1.setVisible(true);
                            adapter.setRenderToTexture(tex0, true, false, 0);
                            adapter.useFBO(true, true, false);
                            this.m_renderIns.runAt(dstProcessIndex);
                        }
                    }
                    this.m_screenPlane_0.setVisible(!this.m_screenPlane_0.getVisible());
                    this.m_screenPlane_1.setVisible(!this.m_screenPlane_1.getVisible());
                    if(this.m_backbufferVisible)
                    {
                        adapter.setRenderToBackBuffer();
                        rc.unlockRenderState();
                        this.m_renderIns.runAt(dstProcessIndex);
                    }
                }
                
                runBlur(dstProcessIndex:number):void
                {
                    let rc:RenderProxy = this.m_renderIns.getRenderProxy();
                    let adapter:RenderAdapter = rc.getRenderAdapter();
                    let viewW:number = adapter.getViewportWidth();
                    let viewH:number = adapter.getViewportHeight();
                    let tex0:TextureProxy = this.getTextureAt(0);
                    let tex1:TextureProxy = this.getTextureAt(1);
                    if(this.m_flagBoo)
                    {
                        if(this.m_screenPlane_0 == null)
                        {
                            let mh:number = 0;
                            let mv:number = 1;
                            switch(this.m_blurMode)
                            {
                                case ScreenPingpongBlur.HORIZONTAL:
                                    mv = 0;
                                break;
                                case ScreenPingpongBlur.VERTICAL:
                                    mh = 1;
                                break;
                                default:
                                break
                            }
                            this.m_vMaterial = new PingpongBlurMaterial(mv);
                            this.m_vMaterial.setBlurDensity(this.m_blurDensity);
                            let plane3D = new Plane3DEntity();
                            plane3D.setMaterial( this.m_vMaterial );
                            plane3D.initialize(-1.0,-1.0, 2.0,2.0, [tex0]);
                            this.m_renderIns.addEntity(plane3D,dstProcessIndex);
                            plane3D.getDisplay().renderState = RenderStateObject.BACK_NORMAL_ALWAYS_STATE;
                            this.m_screenPlane_0 = plane3D;
                            this.m_screenPlane_0.setVisible(false);
                            //
                            this.m_hMaterial = new PingpongBlurMaterial(mh);
                            this.m_hMaterial.setBlurDensity(this.m_blurDensity);
                            plane3D = new Plane3DEntity();
                            plane3D.setMaterial( this.m_hMaterial );
                            plane3D.initialize(-1.0,-1.0, 2.0,2.0, [tex1]);
                            this.m_renderIns.addEntity(plane3D,dstProcessIndex);
                            plane3D.getDisplay().renderState = RenderStateObject.BACK_NORMAL_ALWAYS_STATE;
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
                            this.m_renderIns.runAt(dstProcessIndex);
                        }
                        else
                        {
                            //  往 0 里面绘制, 数据源是 1
                            this.m_screenPlane_0.setVisible(false);
                            this.m_screenPlane_1.setVisible(true);
                            adapter.setRenderToTexture(tex0, true, false, 0);
                            adapter.useFBO(true, true, false);
                            this.m_renderIns.runAt(dstProcessIndex);
                        }
                    }
                    this.m_screenPlane_0.setVisible(false);
                    this.m_screenPlane_1.setVisible(false);
                    
                }
                destroy():void
                {
                    this.m_renderIns = null;
                }
            }
        }
    }
}