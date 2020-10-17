
import * as Vector3DT from "../vox/geom/Vector3";
import * as RendererDevieceT from "../vox/render/RendererDeviece";
import * as CameraBaseT from "../vox/view/CameraBase"
import * as RendererParamT from "../vox/scene/RendererParam";
import * as RendererInstanceContextT from "../vox/scene/RendererInstanceContext";
import * as RendererInstanceT from "../vox/scene/RendererInstance";
import * as RenderStatusDisplayT from "../vox/scene/RenderStatusDisplay";
import * as FrameBufferTypeT from "../vox/render/FrameBufferType";
import * as RendererStateT from "../vox/render/RendererState";

import * as Plane3DEntityT from "../vox/entity/Plane3DEntity";
import * as Axis3DEntityT from "../vox/entity/Axis3DEntity";
import * as Box3DEntityT from "../vox/entity/Box3DEntity";
import * as TextureProxyT from "../vox/texture/TextureProxy";
import * as TextureStoreT from "../vox/texture/TextureStore";
import * as TextureConstT from "../vox/texture/TextureConst";
import * as TexResLoaderT from "../vox/texture/TexResLoader";
import * as ScreenFixedPlaneMaterialT from "../vox/material/mcase/ScreenFixedPlaneMaterial";
import * as CameraTrackT from "../vox/view/CameraTrack";

import Vector3D = Vector3DT.vox.geom.Vector3D;
import RendererDeviece = RendererDevieceT.vox.render.RendererDeviece;
import RendererParam = RendererParamT.vox.scene.RendererParam;
import CameraBase = CameraBaseT.vox.view.CameraBase;
import RendererInstanceContext = RendererInstanceContextT.vox.scene.RendererInstanceContext;
import RendererInstance = RendererInstanceT.vox.scene.RendererInstance;
import RenderStatusDisplay = RenderStatusDisplayT.vox.scene.RenderStatusDisplay;
import FrameBufferType = FrameBufferTypeT.vox.render.FrameBufferType;
import RendererState = RendererStateT.vox.render.RendererState;

import Plane3DEntity = Plane3DEntityT.vox.entity.Plane3DEntity;
import Axis3DEntity = Axis3DEntityT.vox.entity.Axis3DEntity;
import Box3DEntity = Box3DEntityT.vox.entity.Box3DEntity;
import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
import TextureStore = TextureStoreT.vox.texture.TextureStore;
import TextureConst = TextureConstT.vox.texture.TextureConst;
import TexResLoader = TexResLoaderT.vox.texture.TexResLoader;
import ScreenFixedPlaneMaterial = ScreenFixedPlaneMaterialT.vox.material.mcase.ScreenFixedPlaneMaterial;
import CameraTrack = CameraTrackT.vox.view.CameraTrack;

export namespace demo
{
    export class DemoRTTHalfSize
    {
        constructor()
        {
        }
        private m_renderer:RendererInstance = null;
        private m_rcontext:RendererInstanceContext = null;
        private m_texLoader:TexResLoader = new TexResLoader();
        private m_camTrack:CameraTrack = null;
        private m_statusDisp:RenderStatusDisplay = new RenderStatusDisplay();
        private m_camera:CameraBase = null;
        private m_viewSize:Vector3D = new Vector3D();
        initialize():void
        {
            console.log("DemoRTTHalfSize::initialize()......");
            if(this.m_rcontext == null)
            {
                RendererDeviece.SHADERCODE_TRACE_ENABLED = true;
                let tex0:TextureProxy = this.m_texLoader.getTexAndLoadImg("default.jpg");
                let tex1:TextureProxy = this.m_texLoader.getTexAndLoadImg("broken_iron.jpg");
                tex0.mipmapEnabled = true;
                tex0.setWrap(TextureConst.WRAP_REPEAT);
                tex1.setWrap(TextureConst.WRAP_REPEAT);
                tex1.mipmapEnabled = true;

                this.m_statusDisp.initialize("rstatus");

                let rparam:RendererParam = new RendererParam("glcanvas");
                this.m_renderer = new RendererInstance();
                this.m_renderer.initialize(rparam);
                this.m_renderer.appendProcess();
                this.m_renderer.appendProcess();
                this.m_renderer.appendProcess();
                this.m_rcontext = this.m_renderer.getRendererContext();
                this.m_camera = this.m_rcontext.getCamera();

                this.m_viewSize.x = this.m_rcontext.getStage3D().stageWidth;
                this.m_viewSize.y = this.m_rcontext.getStage3D().stageHeight;
                this.m_viewSize.z = Math.floor(this.m_rcontext.getStage3D().stageHalfWidth * 0.5);
                this.m_viewSize.w = Math.floor(this.m_rcontext.getStage3D().stageHalfHeight * 0.5);
                this.m_camTrack = new CameraTrack();
                this.m_camTrack.bindCamera(this.m_rcontext.getCamera());
                // add common 3d display entity
                var plane:Plane3DEntity = new Plane3DEntity();
                //plane.initializeXOZ(-200.0,-150.0,400.0,300.0,[tex0]);
                plane.initializeXOZ(-200.0,-150.0,400.0,300.0);
                this.m_renderer.addEntity(plane);

                let axis:Axis3DEntity = new Axis3DEntity();
                axis.initialize(300.0);
                this.m_renderer.addEntity(axis);

                let box:Box3DEntity = new Box3DEntity();
                box.initialize(new Vector3D(-100.0,-100.0,-100.0),new Vector3D(100.0,100.0,100.0),[tex1]);
                this.m_renderer.addEntity(box);
                
                let material:ScreenFixedPlaneMaterial = new ScreenFixedPlaneMaterial();
                let rttPlane:Plane3DEntity = new Plane3DEntity();
                rttPlane.setMaterial(material);
                rttPlane.initialize(-1.0,-1.0,2.0,2.0,[this.getTextureAt(0)]);
                this.m_renderer.addEntity(rttPlane, 1);

                material = new ScreenFixedPlaneMaterial();
                rttPlane = new Plane3DEntity();
                rttPlane.setRenderState(RendererState.BACK_ADD_ALWAYS_STATE);
                rttPlane.setMaterial(material);
                rttPlane.initialize(-1.0,-1.0,2.0,2.0,[this.getTextureAt(1)]);
                this.m_renderer.addEntity(rttPlane, 2);

                this.m_rcontext.createFBOAt(0,FrameBufferType.FRAMEBUFFER,this.m_viewSize.x,this.m_viewSize.y,true,false);
                this.m_rcontext.createFBOAt(1,FrameBufferType.FRAMEBUFFER,this.m_viewSize.z,this.m_viewSize.w,true,false);
            }
        }
        private m_rttTexs:TextureProxy[] = [null,null,null];
        getTextureAt(i:number):TextureProxy
	    {
	    	if (this.m_rttTexs[i] != null)
	    	{
	    		return this.m_rttTexs[i];
            }
            if(i == 1)
            {
                this.m_rttTexs[i] = TextureStore.CreateTex2D(this.m_viewSize.z,this.m_viewSize.w);
            }
            else
            {                
	    	    this.m_rttTexs[i] = TextureStore.CreateTex2D(64, 64);
            }
	    	return this.m_rttTexs[i];
	    }
        run():void
        {
            this.m_statusDisp.update();

            let rinstance:RendererInstance = this.m_renderer;
            let pcontext:RendererInstanceContext = this.m_rcontext;
            //this.m_camera.perspectiveRH(this.m_camera.getFov(),this.m_camera.getAspect(),0.1,5000.0);
            pcontext.setViewPort(0,0,this.m_viewSize.x,this.m_viewSize.y);
            pcontext.setClearRGBColor3f(0.0, 0.0, 0.0);
            pcontext.runBegin();
            rinstance.update();
            
            // --------------------------------------------- rtt begin
            pcontext.setClearRGBColor3f(0.1, 0.0, 0.1);
            pcontext.synFBOSizeWithViewport();
            pcontext.bindFBOAt(0,FrameBufferType.FRAMEBUFFER);
            pcontext.setRenderToTexture(this.getTextureAt(0), true, false, 0);
            pcontext.useFBO(true, true, false);
            rinstance.runAt(0);
            
            //pcontext.asynFBOSizeWithViewport();
            pcontext.setFBOSizeFactorWithViewPort(0.5);
            pcontext.bindFBOAt(1,FrameBufferType.FRAMEBUFFER);
            pcontext.setRenderToTexture(this.getTextureAt(1), true, false, 0);
            pcontext.useFBO(true, true, false);
            rinstance.runAt(0);
            // --------------------------------------------- rtt end
            pcontext.setClearRGBColor3f(0.0, 3.0, 2.0);
            pcontext.setRenderToBackBuffer();
            rinstance.runAt(1);
            rinstance.runAt(2);

            pcontext.runEnd();            
            //this.m_camTrack.rotationOffsetAngleWorldY(-0.2);;
            pcontext.updateCamera();
        }
    }
}