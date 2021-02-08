
import * as Vector3DT from "../vox/geom/Vector3";
import * as RendererDevieceT from "../vox/render/RendererDeviece";
import * as RenderAdapterT from "../vox/render/RenderAdapter";
import * as RendererParamT from "../vox/scene/RendererParam";
import * as RendererInstanceContextT from "../vox/scene/RendererInstanceContext";
import * as RendererInstanceT from "../vox/scene/RendererInstance";
import * as RenderStatusDisplayT from "../vox/scene/RenderStatusDisplay";

import * as Plane3DEntityT from "../vox/entity/Plane3DEntity";
import * as Box3DEntityT from "../vox/entity/Box3DEntity";
import * as TextureProxyT from "../vox/texture/TextureProxy";
import * as TextureStoreT from "../vox/texture/TextureStore";
import * as TextureConstT from "../vox/texture/TextureConst";
import * as TexResLoaderT from "../vox/texture/TexResLoader";
import * as CameraTrackT from "../vox/view/CameraTrack";
import * as DefaultMRTMaterialT from "../vox/material/mcase/DefaultMRTMaterial";

import Vector3D = Vector3DT.vox.geom.Vector3D;
import RendererDeviece = RendererDevieceT.vox.render.RendererDeviece;
import RenderAdapter = RenderAdapterT.vox.render.RenderAdapter;
import RendererParam = RendererParamT.vox.scene.RendererParam;
import RendererInstanceContext = RendererInstanceContextT.vox.scene.RendererInstanceContext;
import RendererInstance = RendererInstanceT.vox.scene.RendererInstance;
import RenderStatusDisplay = RenderStatusDisplayT.vox.scene.RenderStatusDisplay;

import Plane3DEntity = Plane3DEntityT.vox.entity.Plane3DEntity;
import Box3DEntity = Box3DEntityT.vox.entity.Box3DEntity;
import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
import TextureStore = TextureStoreT.vox.texture.TextureStore;
import TextureConst = TextureConstT.vox.texture.TextureConst;
import TexResLoader = TexResLoaderT.vox.texture.TexResLoader;
import CameraTrack = CameraTrackT.vox.view.CameraTrack;
import DefaultMRTMaterial = DefaultMRTMaterialT.vox.material.mcase.DefaultMRTMaterial;

export namespace demo
{
    export class DemoMRT
    {
        constructor()
        {
        }
        private m_renderer:RendererInstance = null;
        private m_rcontext:RendererInstanceContext = null;
        private m_texLoader:TexResLoader = new TexResLoader();
        private m_camTrack:CameraTrack = null;
        private m_statusDisp:RenderStatusDisplay = new RenderStatusDisplay();
        
        initialize():void
        {
            console.log("DemoMRT::initialize()......");
            if(this.m_rcontext == null)
            {
                RendererDeviece.SHADERCODE_TRACE_ENABLED = true;
                let tex0:TextureProxy = this.m_texLoader.getTexAndLoadImg("static/assets/assets/fruit_01.jpg");
                let tex1:TextureProxy = this.m_texLoader.getTexAndLoadImg("static/assets/broken_iron.jpg");
                tex0.mipmapEnabled = true;
                tex0.setWrap(TextureConst.WRAP_REPEAT);
                tex1.setWrap(TextureConst.WRAP_REPEAT);
                tex1.mipmapEnabled = true;

                this.m_statusDisp.initialize("rstatus");

                let rparam:RendererParam = new RendererParam();
                rparam.maxWebGLVersion = 1;
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
                plane.setMaterial(new DefaultMRTMaterial());
                plane.initializeXOZ(-200.0,-150.0,400.0,300.0,[tex0]);
                this.m_renderer.addEntity(plane);
                this.m_renderer.addEntity(plane);

                let boxSize:number = 100.0;
                let box:Box3DEntity = new Box3DEntity();
                box.name = "box";
                box.setMaterial(new DefaultMRTMaterial());
                box.initialize(new Vector3D(-boxSize,-boxSize,-boxSize),new Vector3D(boxSize,boxSize,boxSize),[tex1]);
                this.m_renderer.addEntity(box);

                boxSize = 100.0;
                // add mrt texture 3d display entity
                let boxMrt0:Box3DEntity = new Box3DEntity();
                boxMrt0.name = "boxMrt0";
                boxMrt0.initialize(new Vector3D(-boxSize,-boxSize,-boxSize),new Vector3D(boxSize,boxSize,boxSize),[TextureStore.GetRTTTextureAt(0)]);
                boxMrt0.setXYZ(-150,0,-150);
                this.m_renderer.addEntity(boxMrt0, 1);
                let boxMrt1:Box3DEntity = new Box3DEntity();
                boxMrt1.name = "boxMrt1";
                boxMrt1.initialize(new Vector3D(-boxSize,-boxSize,-boxSize),new Vector3D(boxSize,boxSize,boxSize),[TextureStore.GetRTTTextureAt(1)]);
                boxMrt1.setXYZ(150,0,150);
                this.m_renderer.addEntity(boxMrt1, 1);
            }
        }
        run():void
        {
            let pcontext:RendererInstanceContext = this.m_rcontext;
            let rinstance:RendererInstance = this.m_renderer;
            let radapter:RenderAdapter = pcontext.getRenderAdapter();

            this.m_statusDisp.update();

            pcontext.setClearRGBColor3f(0.0, 0.0, 0.0);
            pcontext.runBegin();
            rinstance.update();

            // --------------------------------------------- mrt begin
            pcontext.setClearRGBColor3f(0.1, 0.0, 0.1);
            radapter.synFBOSizeWithViewport();
            radapter.setRenderToTexture(TextureStore.GetRTTTextureAt(0), true, false, 0);
            radapter.setRenderToTexture(TextureStore.GetRTTTextureAt(1), true, false, 1);
            radapter.useFBO(true, true, false);
            rinstance.runAt(0);
            // --------------------------------------------- mrt end

            pcontext.setClearRGBColor3f(0.0, 3.0, 2.0);
            radapter.setRenderToBackBuffer();
            rinstance.runAt(1);

            pcontext.runEnd();            
            this.m_camTrack.rotationOffsetAngleWorldY(-0.2);;
            pcontext.updateCamera();
        }
    }
}