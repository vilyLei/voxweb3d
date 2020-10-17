
import * as Vector3DT from "../vox/geom/Vector3";
import * as RendererDevieceT from "../vox/render/RendererDeviece";
import * as RendererParamT from "../vox/scene/RendererParam";
import * as RendererInstanceContextT from "../vox/scene/RendererInstanceContext";
import * as RendererInstanceT from "../vox/scene/RendererInstance";
import * as RenderStatusDisplayT from "../vox/scene/RenderStatusDisplay";
import * as ScreenPingpongBlurT from "../vox/scene/mcase/ScreenPingpongBlur";

import * as Plane3DEntityT from "../vox/entity/Plane3DEntity";
import * as Axis3DEntityT from "../vox/entity/Axis3DEntity";
import * as Box3DEntityT from "../vox/entity/Box3DEntity";
import * as TextureProxyT from "../vox/texture/TextureProxy";
import * as TextureConstT from "../vox/texture/TextureConst";
import * as TexResLoaderT from "../vox/texture/TexResLoader";
import * as CameraTrackT from "../vox/view/CameraTrack";

import Vector3D = Vector3DT.vox.geom.Vector3D;
import RendererDeviece = RendererDevieceT.vox.render.RendererDeviece;
import RendererParam = RendererParamT.vox.scene.RendererParam;
import RendererInstanceContext = RendererInstanceContextT.vox.scene.RendererInstanceContext;
import RendererInstance = RendererInstanceT.vox.scene.RendererInstance;
import RenderStatusDisplay = RenderStatusDisplayT.vox.scene.RenderStatusDisplay;
import ScreenPingpongBlur = ScreenPingpongBlurT.vox.scene.mcase.ScreenPingpongBlur;

import Plane3DEntity = Plane3DEntityT.vox.entity.Plane3DEntity;
import Axis3DEntity = Axis3DEntityT.vox.entity.Axis3DEntity;
import Box3DEntity = Box3DEntityT.vox.entity.Box3DEntity;
import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
import TextureConst = TextureConstT.vox.texture.TextureConst;
import TexResLoader = TexResLoaderT.vox.texture.TexResLoader;
import CameraTrack = CameraTrackT.vox.view.CameraTrack;

export namespace demo
{
    export class DemoScreenPingpongBlur
    {
        constructor()
        {
        }
        private m_renderer:RendererInstance = null;
        private m_rcontext:RendererInstanceContext = null;
        private m_texLoader:TexResLoader = new TexResLoader();
        private m_camTrack:CameraTrack = null;
        private m_statusDisp:RenderStatusDisplay = new RenderStatusDisplay();
        private m_blurIns:ScreenPingpongBlur = null;
        initialize():void
        {
            console.log("DemoScreenPingpongBlur::initialize()......");
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

                let rparam:RendererParam = new RendererParam("glcanvas","app");
                rparam.maxWebGLVersion = 2;
                rparam.setCamProject(45.0,0.1,3000.0);
                rparam.setCamPosition(1500.0,1500.0,1500.0);
                this.m_renderer = new RendererInstance();
                this.m_renderer.initialize(rparam);
                this.m_renderer.appendProcess();
                this.m_renderer.appendProcess();
                this.m_blurIns = new ScreenPingpongBlur(this.m_renderer);
                //this.m_blurIns.setBlurMode(ScreenPingpongBlur.VERTICAL);
                this.m_rcontext = this.m_renderer.getRendererContext();
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

                let box:Box3DEntity = new Box3DEntity();
                box.name = "box";
                box.initialize(new Vector3D(-100.0,-100.0,-100.0),new Vector3D(100.0,100.0,100.0),[tex1]);
                this.m_renderer.addEntity(box);
            }
        }
        run():void
        {
            let pcontext:RendererInstanceContext = this.m_rcontext;
            let renderer:RendererInstance = this.m_renderer;
            this.m_statusDisp.update();

            this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
            pcontext.updateCamera();
            pcontext.setClearRGBColor3f(0.0, 0.0, 0.0);
            pcontext.runBegin();
            
            renderer.update();
            this.m_blurIns.synViewportSize();
            this.m_blurIns.run(0,1);

            pcontext.runEnd();
        }
    }
}