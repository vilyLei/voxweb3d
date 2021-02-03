
import * as Vector3DT from "../vox/geom/Vector3";
import * as RendererDevieceT from "../vox/render/RendererDeviece";
import * as RenderAdapterT from "../vox/render/RenderAdapter";
import * as RendererParamT from "../vox/scene/RendererParam";
import * as RendererInstanceContextT from "../vox/scene/RendererInstanceContext";
import * as RendererInstanceT from "../vox/scene/RendererInstance";
import * as RenderStatusDisplayT from "../vox/scene/RenderStatusDisplay";
import * as CubeMapMaterialT from "../vox/material/mcase/CubeMapMaterial";
import * as CubeMapMRTMaterialT from "../vox/material/mcase/CubeMapMRTMaterial";

import * as Plane3DEntityT from "../vox/entity/Plane3DEntity";
import * as Box3DEntityT from "../vox/entity/Box3DEntity";
import * as TextureProxyT from "../vox/texture/TextureProxy";
import * as TextureStoreT from "../vox/texture/TextureStore";
import * as ImageCubeTextureProxyT from "../vox/texture/ImageCubeTextureProxy";
import * as TextureConstT from "../vox/texture/TextureConst";
import * as TexResLoaderT from "../vox/texture/TexResLoader";
import * as CameraTrackT from "../vox/view/CameraTrack";
import * as EntityDispT from "./base/EntityDisp";

import Vector3D = Vector3DT.vox.geom.Vector3D;
import RendererDeviece = RendererDevieceT.vox.render.RendererDeviece;
import RenderAdapter = RenderAdapterT.vox.render.RenderAdapter;
import RendererParam = RendererParamT.vox.scene.RendererParam;
import RendererInstanceContext = RendererInstanceContextT.vox.scene.RendererInstanceContext;
import RendererInstance = RendererInstanceT.vox.scene.RendererInstance;
import RenderStatusDisplay = RenderStatusDisplayT.vox.scene.RenderStatusDisplay;
import CubeMapMaterial = CubeMapMaterialT.vox.material.mcase.CubeMapMaterial;
import CubeMapMRTMaterial = CubeMapMRTMaterialT.vox.material.mcase.CubeMapMRTMaterial;

import Plane3DEntity = Plane3DEntityT.vox.entity.Plane3DEntity;
import Box3DEntity = Box3DEntityT.vox.entity.Box3DEntity;
import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
import TextureStore = TextureStoreT.vox.texture.TextureStore;
import ImageCubeTextureProxy = ImageCubeTextureProxyT.vox.texture.ImageCubeTextureProxy;
import TextureConst = TextureConstT.vox.texture.TextureConst;
import TexResLoader = TexResLoaderT.vox.texture.TexResLoader;
import CameraTrack = CameraTrackT.vox.view.CameraTrack;
import EntityDisp = EntityDispT.demo.base.EntityDisp;
import EntityDispQueue = EntityDispT.demo.base.EntityDispQueue;

export namespace demo
{
    export class DemoCubeMapMRT
    {
        constructor()
        {
        }
        private m_renderer:RendererInstance = null;
        private m_rcontext:RendererInstanceContext = null;
        private m_texLoader:TexResLoader = new TexResLoader();
        private m_camTrack:CameraTrack = null;
        private m_statusDisp:RenderStatusDisplay = new RenderStatusDisplay();
        private m_equeue:EntityDispQueue = new EntityDispQueue();
        initialize():void
        {
            console.log("DemoCubeMapMRT::initialize()......");
            if(this.m_rcontext == null)
            {
                RendererDeviece.SHADERCODE_TRACE_ENABLED = true;
                let tex0:TextureProxy = this.m_texLoader.getTexAndLoadImg("static/assets/default.jpg");
                let tex1:TextureProxy = this.m_texLoader.getTexAndLoadImg("static/assets/broken_iron.jpg");
                tex0.mipmapEnabled = true;
                tex0.setWrap(TextureConst.WRAP_REPEAT);
                tex1.setWrap(TextureConst.WRAP_REPEAT);
                tex1.mipmapEnabled = true;

                this.m_statusDisp.initialize("rstatus");

                let rparam:RendererParam = new RendererParam();
                rparam.setCamPosition(800.0,800.0,800.0);
                this.m_renderer = new RendererInstance();
                this.m_renderer.initialize(rparam);
                this.m_renderer.appendProcess();
                this.m_rcontext = this.m_renderer.getRendererContext();
                
                this.m_camTrack = new CameraTrack();
                this.m_camTrack.bindCamera(this.m_rcontext.getCamera());
                // add common 3d display entity
                var plane:Plane3DEntity = new Plane3DEntity();
                plane.name = "plane";
                plane.setMaterial(new CubeMapMRTMaterial());
                plane.initializeXOZ(-200.0,-150.0,400.0,300.0,[tex0]);
                this.m_renderer.addEntity(plane,0);

                let box:Box3DEntity = new Box3DEntity();
                box.name = "box";
                box.setMaterial(new CubeMapMRTMaterial());
                box.initialize(new Vector3D(-100.0,-100.0,-100.0),new Vector3D(100.0,100.0,100.0),[tex1]);
                this.m_renderer.addEntity(box,0);

                // add rtt texture 3d display entity
                let boxCubeMapMRT:Box3DEntity = new Box3DEntity();
                boxCubeMapMRT.useGourandNormal();
                boxCubeMapMRT.name = "boxCubeMapMRT";
                boxCubeMapMRT.setMaterial(new CubeMapMaterial());
                boxCubeMapMRT.initialize(new Vector3D(-80.0,-80.0,-80.0),new Vector3D(80.0,80.0,80.0),[this.getTexture()]);
                this.m_renderer.addEntity(boxCubeMapMRT, 1);

                let disp:EntityDisp = this.m_equeue.addEntity( boxCubeMapMRT );
                disp.moveEnabled = false;

            }
        }
        private m_tex:ImageCubeTextureProxy = null;
        getTexture():ImageCubeTextureProxy
	    {
	    	if (this.m_tex != null)
	    	{
	    		return this.m_tex;
            }
	    	this.m_tex = TextureStore.CreateImageCubeTex(1024, 1024);
	    	return this.m_tex;
	    }
        run():void
        {
            this.m_statusDisp.update();
            this.m_equeue.run();
            let pcontext:RendererInstanceContext = this.m_rcontext;
            let renderer:RendererInstance = this.m_renderer;
            let radapter:RenderAdapter = pcontext.getRenderAdapter();

            pcontext.setClearRGBColor3f(0.0, 0.0, 0.0);

            pcontext.unlockRenderState();
            pcontext.unlockMaterial();
            pcontext.runBegin();
            renderer.update();

            // --------------------------------------------- cubemap mrt begin
            pcontext.setClearRGBColor3f(0.1, 0.0, 0.1);
            radapter.setRenderToTexture(this.getTexture(), true, false, 0);
            radapter.useFBO(true, true, false);
            renderer.runAt(0);
            // --------------------------------------------- cubemap mrt end

            pcontext.setClearRGBColor3f(0.0, 3.0, 2.0);
            radapter.setRenderToBackBuffer();
            pcontext.runBegin();
            pcontext.unlockRenderState();
            renderer.runAt(1);

            pcontext.runEnd();
            this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
            pcontext.updateCamera();
            
        }
    }
}