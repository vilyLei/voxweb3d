
import * as Vector3DT from "../vox/geom/Vector3";
import * as RendererDevieceT from "../vox/render/RendererDeviece";
import * as RendererParamT from "../vox/scene/RendererParam";
import * as RenderConstT from "../vox/render/RenderConst";
import * as RendererStateT from "../vox/render/RendererState";
import * as RendererInstanceContextT from "../vox/scene/RendererInstanceContext";
import * as RendererInstanceT from "../vox/scene/RendererInstance";
import * as RenderStatusDisplayT from "../vox/scene/RenderStatusDisplay";

import * as Plane3DEntityT from "../vox/entity/Plane3DEntity";
import * as Axis3DEntityT from "../vox/entity/Axis3DEntity";
import * as Box3DEntityT from "../vox/entity/Box3DEntity";
import * as TextureProxyT from "../vox/texture/TextureProxy";
import * as TextureStoreT from "../vox/texture/TextureStore";
import * as TextureConstT from "../vox/texture/TextureConst";
import * as TexResLoaderT from "../vox/texture/TexResLoader";
import * as CameraTrackT from "../vox/view/CameraTrack";
import * as ScreenFixedPlaneMaterialT from "../vox/material/mcase/ScreenFixedPlaneMaterial";
import * as PSDepthMaterialT from "../demo/material/PSDepthMaterial";

import Vector3D = Vector3DT.vox.geom.Vector3D;
import RendererDeviece = RendererDevieceT.vox.render.RendererDeviece;
import RendererParam = RendererParamT.vox.scene.RendererParam;
import CullFaceMode = RenderConstT.vox.render.CullFaceMode;
import RenderBlendMode = RenderConstT.vox.render.RenderBlendMode;
import DepthTestMode = RenderConstT.vox.render.DepthTestMode;
import RendererState = RendererStateT.vox.render.RendererState;
import RendererInstanceContext = RendererInstanceContextT.vox.scene.RendererInstanceContext;
import RendererInstance = RendererInstanceT.vox.scene.RendererInstance;
import RenderStatusDisplay = RenderStatusDisplayT.vox.scene.RenderStatusDisplay;

import Plane3DEntity = Plane3DEntityT.vox.entity.Plane3DEntity;
import Axis3DEntity = Axis3DEntityT.vox.entity.Axis3DEntity;
import Box3DEntity = Box3DEntityT.vox.entity.Box3DEntity;
import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
import TextureStore = TextureStoreT.vox.texture.TextureStore;
import TextureConst = TextureConstT.vox.texture.TextureConst;
import TexResLoader = TexResLoaderT.vox.texture.TexResLoader;
import CameraTrack = CameraTrackT.vox.view.CameraTrack;
import ScreenFixedPlaneMaterial = ScreenFixedPlaneMaterialT.vox.material.mcase.ScreenFixedPlaneMaterial;
import PSDepthMaterial = PSDepthMaterialT.demo.material.PSDepthMaterial;

export namespace demo
{
    export class DemoPreDepth
    {
        constructor()
        {
        }
        private m_renderer:RendererInstance = null;
        private m_rcontext:RendererInstanceContext = null;
        private m_texLoader:TexResLoader = new TexResLoader();
        private m_camTrack:CameraTrack = null;
        private m_statusDisp:RenderStatusDisplay = new RenderStatusDisplay();
        private m_depMaterial:PSDepthMaterial = new PSDepthMaterial();
        initialize():void
        {
            console.log("DemoPreDepth::initialize()......");
            if(this.m_rcontext == null)
            {
                RendererDeviece.SHADERCODE_TRACE_ENABLED = true;
                let tex0:TextureProxy = this.m_texLoader.getTexAndLoadImg("default.jpg");
                let tex1:TextureProxy = this.m_texLoader.getTexAndLoadImg("broken_iron.jpg");
                tex0.mipmapEnabled = true;
                tex0.setWrap(TextureConst.WRAP_REPEAT);
                tex1.setWrap(TextureConst.WRAP_REPEAT);
                tex1.mipmapEnabled = true;

                //RendererState.CreateRenderState("depthSt",CullFaceMode.BACK,RenderBlendMode.NORMAL,DepthTestMode.RENDER_TRUE_GEQUAL);
                RendererState.CreateRenderState("depthSt",CullFaceMode.BACK,RenderBlendMode.NORMAL,DepthTestMode.RENDER_TRUE_EQUAL);

                this.m_statusDisp.initialize("rstatus");

                let rparam:RendererParam = new RendererParam("glcanvas");
                rparam.setCamProject(45.0,100.0,5000.0);
                this.m_renderer = new RendererInstance();
                this.m_renderer.initialize(rparam);
                this.m_renderer.appendProcess();
                this.m_rcontext = this.m_renderer.getRendererContext();
                //this.m_rMaterialProxy = this.m_rcontext.getRenderMaterialProxy();
                //this.m_renderProxy = this.m_renderer.getRenderProxy();

                this.m_camTrack = new CameraTrack();
                this.m_camTrack.bindCamera(this.m_rcontext.getCamera());
                // add common 3d display entity
                var plane:Plane3DEntity = new Plane3DEntity();
                plane.name = "plane";
                plane.initializeXOZ(-200.0,-150.0,400.0,300.0,[tex0]);
                this.m_renderer.addEntity(plane);

                let axis:Axis3DEntity = new Axis3DEntity();
                axis.name = "axis";
                axis.initialize(300.0);
                this.m_renderer.addEntity(axis);

                let scale:number = 0.5;
                let box:Box3DEntity;
                let box_minV:Vector3D = new Vector3D(-100.0,-100.0,-100.0);
                let box_maxV:Vector3D = new Vector3D(100.0,100.0,100.0);
                for(let i:number = 0;i < 100;++i)
                {
                    box = new Box3DEntity();
                    box.initialize(box_minV, box_maxV, [tex1]);
                    box.setScaleXYZ(scale,scale,scale);
                    box.setXYZ(Math.random() * 1000.0 - 500.0,Math.random() * 1000.0 - 500.0,Math.random() * 1000.0 - 500.0);
                    this.m_renderer.addEntity(box);
                }
                // add rtt texture display entity
                let scrM:ScreenFixedPlaneMaterial = new ScreenFixedPlaneMaterial();
                let scrPlane:Plane3DEntity = new Plane3DEntity();
                scrPlane.setMaterial(scrM);
                scrPlane.initialize(-1.0,-1.0,2.0,2.0,[this.getTextureAt(1)]);
                this.m_renderer.addEntity(scrPlane, 1);
            }
        }
        private m_rttTexs:TextureProxy[] = [null,null,null];
        getTextureAt(i:number):TextureProxy
	    {
	    	if (this.m_rttTexs[i] != null)
	    	{
	    		return this.m_rttTexs[i];
            }
	    	this.m_rttTexs[i] = TextureStore.CreateTex2D(64, 64);
	    	return this.m_rttTexs[i];
	    }
        run():void
        {
            this.m_statusDisp.update();

            let rinstance:RendererInstance = this.m_renderer;
            let pcontext:RendererInstanceContext = this.m_rcontext;

            pcontext.setClearRGBColor3f(0.0, 0.0, 0.0);
            pcontext.runBegin();
            rinstance.update();

            // --------------------------------------------- rtt begin
            pcontext.setClearRGBColor3f(0.0, 0.3, 0.0);
            pcontext.synFBOSizeWithViewport();
            pcontext.useGlobalMaterial(this.m_depMaterial);
            pcontext.setRenderToTexture(this.getTextureAt(0), true, false, 0);
            pcontext.useFBO(true, true, false);
            rinstance.runAt(0);
            
            pcontext.unlockMaterial();
            pcontext.useGlobalRenderStateByName("depthSt");
            pcontext.setRenderToTexture(this.getTextureAt(1), true, false, 0);
            pcontext.useFBO(true, false, false);
            rinstance.runAt(0);
            // --------------------------------------------- rtt end
            pcontext.unlockRenderState();
            pcontext.setClearRGBColor3f(0.0, 3.0, 2.0);
            pcontext.setRenderToBackBuffer();
            rinstance.runAt(1);

            pcontext.runEnd();            
            this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
            pcontext.updateCamera();
        }
    }
}