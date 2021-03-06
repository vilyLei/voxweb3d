/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2020 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import RTTTextureProxy from "../../vox/texture/RTTTextureProxy";
import Plane3DEntity from "../../vox/entity/Plane3DEntity";
import PingpongBlurMaterial from "../../renderingtoy/mcase/material/PingpongBlurMaterial";
import RendererState from "../../vox/render/RendererState";
import RenderAdapter from "../../vox/render/RenderAdapter";
import RenderProxy from "../../vox/render/RenderProxy";
import IRenderProcess from "../../vox/render/IRenderProcess";
import RendererInstance from "../../vox/scene/RendererInstance";

export default class PingpongBlur
{
    /**
     * 只有水平方向上模糊
     */
    public static HORIZONTAL:number = 0;
    /**
     * 只有竖直方向模糊
     */
    public static VERTICAL:number = 1;
    /**
     * 水平和竖直方向上模糊
     */
    public static DEFALUT:number = 2;

    private m_blurMode:number = 2;
    private m_renderer:RendererInstance = null;

    private m_plane0:Plane3DEntity = null;
    private m_plane1:Plane3DEntity = null;
    private m_hMaterial:PingpongBlurMaterial = null;
    private m_vMaterial:PingpongBlurMaterial = null;
    private m_texs:RTTTextureProxy[] = [null,null];

    private m_backbufferVisible:boolean = true;
    private m_blurCount:number = 15;
    private m_blurDensity:number = 2.0;
    private m_srcProcessId:number = 0;
    private m_syncViewSizeEnabled:boolean = true;
    /**
     * @param renderer RendererInstance class instance
     * @param blurMode the value is PingpongBlur.DEFALUT or PingpongBlur.HORIZONTAL or PingpongBlur.VERTICAL
     */
    constructor(renderer:RendererInstance,blurMode:number = 2)
    {
        this.m_renderer = renderer;
        if(blurMode >= 0 && blurMode < 3)
        {
            this.m_blurMode = blurMode;
        }
    }
    bindSrcProcessId(srcProcessId:number)
    {
        this.m_srcProcessId = srcProcessId;
    }
    bindSrcProcess(srcProcess:IRenderProcess)
    {
        this.m_srcProcessId = srcProcess.getRPIndex();
    }
    setBackbufferVisible(boo:boolean):void
    {
        this.m_backbufferVisible = boo;
    }
    setSyncViewSizeEnabled(boo:boolean):void
    {
        this.m_syncViewSizeEnabled = boo;
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
        return this.m_texs[index];
    }
    private updateState(adapter:RenderAdapter):void
    {
        if(this.m_plane0 == null)
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
            let plane3D:Plane3DEntity = new Plane3DEntity();
            plane3D.setMaterial( this.m_vMaterial );
            plane3D.initializeXOY(-1.0,-1.0, 2.0,2.0, [this.getTextureAt(0)]);
            plane3D.setRenderState( RendererState.BACK_NORMAL_ALWAYS_STATE );
            this.m_plane0 = plane3D;
            
            this.m_hMaterial = new PingpongBlurMaterial(mh);
            this.m_hMaterial.setBlurDensity(this.m_blurDensity);
            plane3D = new Plane3DEntity();
            plane3D.setMaterial( this.m_hMaterial );
            plane3D.copyMeshFrom(this.m_plane0);
            plane3D.initializeXOY(-1.0,-1.0, 2.0,2.0, [this.getTextureAt(1)]);
            plane3D.setRenderState( RendererState.BACK_NORMAL_ALWAYS_STATE );
            this.m_plane1 = plane3D;
        }
        let blurWidth:number = adapter.getFBOFitWidth();
        let viewHeight:number = adapter.getFBOFitHeight();
        this.m_vMaterial.setTexSize(blurWidth, viewHeight);
        this.m_hMaterial.setTexSize(blurWidth, viewHeight);
    }
    run(srcProcessId:number = -1):void
    {
        let rc:RenderProxy = this.m_renderer.getRenderProxy();
        let adapter:RenderAdapter = rc.getRenderAdapter();
        if(this.m_syncViewSizeEnabled)
        {
            adapter.synFBOSizeWithViewport();
        }
        else
        {
            adapter.asynFBOSizeWithViewport();
        }
        if(srcProcessId < 0)
            srcProcessId = this.m_srcProcessId;
        /////////////////////////////////////////////
        // pingpong blur executing
        this.updateState(adapter);
        // 将srcProcessId 里面的显示内容绘制到 fbo, 以便获取初始数据源
        adapter.setRenderToTexture(this.getTextureAt(0), true, false, 0);
        adapter.useFBO(true, true, false);
        this.m_renderer.runAt(srcProcessId);
        // bluring
        let i:number = 0;
        for(; i < this.m_blurCount; ++i)
        {
            adapter.setRenderToTexture(this.getTextureAt((1 - (i%2))), true, false, 0);
            adapter.useFBO(true, true, false);
            if((i%2) == 0)
            {
                this.m_renderer.drawEntity(this.m_plane0);
            }
            else
            {
                this.m_renderer.drawEntity(this.m_plane1);
            }
        }
        if(this.m_backbufferVisible)
        {
            adapter.setRenderToBackBuffer();
            rc.unlockRenderState();
            if((i%2) == 0)
            {
                this.m_renderer.drawEntity(this.m_plane0);
            }
            else
            {
                this.m_renderer.drawEntity(this.m_plane1);
            }
        }
    }
    destroy():void
    {
        if(this.m_renderer != null)
        {
            this.m_renderer.removeEntity(this.m_plane0);
            this.m_renderer.removeEntity(this.m_plane1);
            this.m_plane0.destroy();
            this.m_plane1.destroy();
            
            this.m_plane0 = null;
            this.m_plane1 = null;
            this.m_hMaterial = null;
            this.m_vMaterial = null;
            this.m_texs[0] = null;
            this.m_texs[1] = null;
            this.m_renderer = null;
        }
    }
}