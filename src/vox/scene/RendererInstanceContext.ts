/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// 真正位于高频运行的渲染管线中的被使用的渲染关键代理对象上下文

import * as Vector3T from "../../vox/geom/Vector3";
import * as Matrix4T from "../../vox/geom/Matrix4";
import * as RenderDataSlotT from "../../vox/material/RenderDataSlot";
import * as Stage3DT from "../../vox/display/Stage3D";
import * as CameraBaseT from "../../vox/view/CameraBase";
import * as RendererStateT from "../../vox/render/RendererState";
import * as RAdapterContextT from "../../vox/render/RAdapterContext";
import * as RenderAdapterT from "../../vox/render/RenderAdapter";
import * as TextureProxyT from "../../vox/texture/TextureProxy";
import * as RenderProxyT from "../../vox/render/RenderProxy";
import * as MaterialBaseT from "../../vox/material/MaterialBase";
import * as ShdUniformToolT from "../../vox/material/ShdUniformTool";
import * as RODispBuilderT from "../../vox/render/RODispBuilder";
import * as RendererParamT from "../../vox/scene/RendererParam";
import * as RenderMeshProxyT from "../../vox/render/RenderMeshProxy";
import * as RenderMaterialProxyT from "../../vox/render/RenderMaterialProxy";

import Vector3D = Vector3T.vox.geom.Vector3D;
import Matrix4Pool = Matrix4T.vox.geom.Matrix4Pool;
import RenderDataSlot = RenderDataSlotT.vox.material.RenderDataSlot;
import Stage3D = Stage3DT.vox.display.Stage3D;
import CameraBase = CameraBaseT.vox.view.CameraBase;
import RAdapterContext = RAdapterContextT.vox.render.RAdapterContext;
import RendererState = RendererStateT.vox.render.RendererState;
import RenderAdapter = RenderAdapterT.vox.render.RenderAdapter;
import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
import RenderProxy = RenderProxyT.vox.render.RenderProxy;
import MaterialBase = MaterialBaseT.vox.material.MaterialBase;
import ShdUniformTool = ShdUniformToolT.vox.material.ShdUniformTool;
import RODispBuilder = RODispBuilderT.vox.render.RODispBuilder;
import RendererParam = RendererParamT.vox.scene.RendererParam;
import RenderMeshProxy = RenderMeshProxyT.vox.render.RenderMeshProxy;
import RenderMaterialProxy = RenderMaterialProxyT.vox.render.RenderMaterialProxy;

export namespace vox
{
    export namespace scene
    {
        export class RendererInstanceContext
        {
            private m_adapter:RenderAdapter = null;
            private m_renderProxy:RenderProxy = null;
            private m_materialProxy:RenderMaterialProxy = null;
            private m_meshProxy:RenderMeshProxy = null;
            private m_Matrix4AllocateSize:number = 0;
            private m_dispBuilder:RODispBuilder = null;
            private m_cameraNear:number = 0.1;
            private m_cameraFar:number = 5000.0;
            private m_cameraFov:number = 45.0;
            constructor()
            {
            }
            setDispBuilder(builder:RODispBuilder):void
            {
                if(this.m_dispBuilder == null)
                {
                    this.m_dispBuilder = builder;
                    this.m_materialProxy.setDispBuilder(builder);
                }
            }
            
            getDiv():any
            {
                return this.m_adapter.getDiv();
            }
            getCanvas():any
            {
                return this.m_adapter.getCanvas();
            }
            getRenderAdapter():RenderAdapter
            {
                return this.m_adapter;
            }
            getRenderMaterialProxy():RenderMaterialProxy
            {
                return this.m_materialProxy;
            }
            getRenderProxy():RenderProxy
            {
                return this.m_renderProxy;
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
            cameraLock():void
            {
                this.m_renderProxy.cameraLock();
            }
            cameraUnlock():void
            {
                this.m_renderProxy.cameraUnlock();
            }
            createCamera():CameraBase
            {
                if(this.m_renderProxy == null)
                {
                    return this.m_renderProxy.createCamera();
                }
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
            lockRenderState():void
            {
                if(this.m_renderProxy != null)
                {
                    this.m_renderProxy.lockRenderState();
                }
            }
            unlockRenderState():void
            {
                if(this.m_renderProxy != null)
                {
                    this.m_renderProxy.unlockRenderState();
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
            useGlobalRenderStateByName(stateNS:string):void
            {
                if(this.m_renderProxy != null)
                {
                    this.m_renderProxy.unlockRenderState();
                    this.m_renderProxy.useRenderState( RendererState.GetRenderStateByName(stateNS));
                    this.m_renderProxy.lockRenderState();
                }
            }
            lockMaterial():void
            {
                if(this.m_materialProxy != null)
                {
                    this.m_materialProxy.lockMaterial();
                }
            }
            unlockMaterial():void
            {
                if(this.m_materialProxy != null)
                {
                    this.m_materialProxy.unlockMaterial();
                }
            }
            useGlobalMaterial(m:MaterialBase):void
            {
                if(this.m_materialProxy != null)
                {
                    this.m_materialProxy.unlockMaterial();
                    this.m_materialProxy.useGlobalMaterial(m);
                    this.m_materialProxy.lockMaterial();
                }
            }
            setScissorRect(px:number, py:number, pw:number, ph:number):void
			{
				this.m_adapter.setScissorRect(px, py, pw, ph);
			}
            setScissorEnabled(enabled:boolean):void
            {
                this.m_adapter.setScissorEnabled(enabled);
            }
            setViewPort(px:number,py:number,pw:number,ph:number):void
            {
                this.m_renderProxy.setViewPort(px,py,pw,ph);
            }
            synFBOSizeWithViewport():void
			{
				this.m_adapter.synFBOSizeWithViewport();
            }
            asynFBOSizeWithViewport():void
			{
				this.m_adapter.asynFBOSizeWithViewport();
            }
            // if synFBOSizeWithViewport is true, fbo size = factor * view port size;
			setFBOSizeFactorWithViewPort(factor:number):void
			{
                this.m_adapter.setFBOSizeFactorWithViewPort(factor);
            }
			createFBOAt(index:number, fboType:number, pw:number,ph:number, enableDepth:boolean = false, enableStencil:boolean = false,multisampleLevel:number = 0):void
			{
                this.m_adapter.createFBOAt(index,fboType,pw,ph,enableDepth,enableStencil,multisampleLevel);
            }
            bindFBOAt(index:number, fboType:number):void
            {
                this.m_adapter.bindFBOAt(index,fboType);
            }
            setRenderToTexture(texProxy:TextureProxy, enableDepth:boolean = false, enableStencil:boolean = false, outputIndex:number = 0):void
            {
                this.m_adapter.setRenderToTexture(texProxy,enableDepth,enableStencil,outputIndex);
            }
            useFBO(clearColorBoo:boolean = false, clearDepthBoo:boolean = false, clearStencilBoo:boolean = false):void
            {
                this.m_adapter.useFBO(clearColorBoo,clearDepthBoo,clearStencilBoo);
            }
            setRenderToBackBuffer():void
            {
                if(this.m_adapter != null)
                {
                    this.m_adapter.setRenderToBackBuffer();
                }
            }
            lockViewport():void
			{
				this.m_adapter.lockViewport();
			}
			unlockViewport():void
			{
				this.m_adapter.unlockViewport();
			}
			setClearDepth(depth:number):void { this.m_adapter.setClearDepth(depth); }
			getClearDepth():number { return this.m_adapter.getClearDepth(); }
			getViewportX():number { return this.m_adapter.getViewportX(); }
			getViewportY():number { return this.m_adapter.getViewportY(); }
			getViewportWidth():number { return this.m_adapter.getViewportWidth(); }
            getViewportHeight():number { return this.m_adapter.getViewportHeight(); }
            /**
             * 设置用于3D绘制的canvas的宽高尺寸,如果调用了此函数，则不会自动匹配窗口尺寸改变，默认是自动匹配窗口尺寸改变的
             * @param       pw 像素宽度
             * @param       ph 像素高度
            */
			setContextViewSize(pw:number,ph:number):void
			{
                this.m_adapter.setContextViewSize(pw,ph);
            }
            // 引擎初始化的时候调用,构建单例的唯一实例
            setMatrix4AllocateSize(total:number):void
            {
                if(this.m_Matrix4AllocateSize < 1)
                {
                    if(total < 1024)
                    {
                        total = 1024;
                    }
                    //console.log("RendererInstanceContext::setMatrix4AllocateSize(), total: "+total);
                    this.m_Matrix4AllocateSize = total;
                    Matrix4Pool.Allocate(total);
                }
            }
            setCameraParam(fov:number, near:number, far:number):void
            {
                this.m_cameraFov = fov;
                this.m_cameraNear = near;
                this.m_cameraFar = far;
                if(this.m_renderProxy != null)
                {
                    this.m_renderProxy.setCameraParam(fov, near, far);
                }
            }
            initialize(param:RendererParam):void
            {
                if(this.m_Matrix4AllocateSize < 1024)
                {
                    this.setMatrix4AllocateSize(1024);
                }
                if(this.m_renderProxy == null)
                {
                    RenderDataSlot.Initialize();

                    this.m_renderProxy = new RenderProxy();
                    this.m_renderProxy.setCameraParam(this.m_cameraFov,this.m_cameraNear,this.m_cameraFar);
                    this.m_renderProxy.setWebGLMaxVersion(param.maxWebGLVersion);
                    this.m_adapter = this.m_renderProxy.getRenderAdapter();
                    this.m_adapter.bgColor.setRGBA4f(0.0,0.0,0.0,1.0);
                    this.m_renderProxy.initialize(param);

                    let context:RAdapterContext = this.m_renderProxy.getContext();
                    context.setViewport(0,0, context.getStage().stageWidth, context.getStage().stageHeight);
                    this.m_meshProxy = new RenderMeshProxy();
                    this.m_meshProxy.setRenderProxy(this.m_renderProxy);
                    this.m_materialProxy = new RenderMaterialProxy();
                    this.m_materialProxy.setRenderProxy(this.m_renderProxy);

                    ShdUniformTool.Initialize();
                }
            }
            
            setClearRGBColor3f(pr:number,pg:number,pb:number)
            {
                if(this.m_renderProxy != null)
                {
                    this.m_renderProxy.setClearRGBColor3f(pr,pg,pb);
                }
            }
            setClearRGBAColor4f(pr:number,pg:number,pb:number,pa:number):void
            {
                if(this.m_renderProxy != null)
                {
                    this.m_renderProxy.setClearRGBAColor4f(pr,pg,pb,pa);
                }
            }
            
            updateRenderBufferSize():void
            {
                this.m_adapter.updateRenderBufferSize();
            }

            runBegin():void
            {
                if(this.m_renderProxy != null)
                {
                    this.m_adapter.unlockViewport();
                    this.m_adapter = this.m_renderProxy.getRenderAdapter();
                    this.m_adapter.setClearDepth(1.0);
                    RendererState.ResetInfo();
                    RendererState.Reset();
                    this.m_meshProxy.reset();
                    this.m_materialProxy.reset();
                    this.m_adapter.update();
                    this.m_adapter.setClearMaskClearAll();
                    this.m_adapter.renderBegin();
                    this.m_renderProxy.useCameraData();
                    this.m_renderProxy.updateCameraDataFromCamera( this.m_renderProxy.getCamera() );
                }
            }
            
            renderBegin():void
            {
                if(this.m_renderProxy != null)
                {
                    this.m_adapter.unlockViewport();
                    this.m_adapter = this.m_renderProxy.getRenderAdapter();
                    this.m_adapter.setClearDepth(1.0);
                    RendererState.ResetInfo();
                    RendererState.Reset();
                    this.m_meshProxy.reset();
                    this.m_materialProxy.renderBegin();
                    this.m_adapter.update();
                    this.m_adapter.setClearMaskClearAll();
                    this.m_adapter.renderBegin();
                    this.m_renderProxy.useCameraData();
                    this.m_renderProxy.updateCameraDataFromCamera( this.m_renderProxy.getCamera() );
                }
            }
            runEnd():void
            {
            }
        }
    }
}
