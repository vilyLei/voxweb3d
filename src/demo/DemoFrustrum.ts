
import * as Vector3DT from "../vox/geom/Vector3";
import * as MathConstT from "../vox/utils/MathConst";
import * as RendererDevieceT from "../vox/render/RendererDeviece";
import * as RenderConstT from "../vox/render/RenderConst";
import * as RendererStateT from "../vox/render/RendererState";
import * as RendererParamT from "../vox/scene/RendererParam";
import * as RendererInstanceContextT from "../vox/scene/RendererInstanceContext";
import * as RendererInstanceT from "../vox/scene/RendererInstance";
import * as RenderStatusDisplayT from "../vox/scene/RenderStatusDisplay";
import * as MouseEventT from "../vox/event/MouseEvent";
import * as Stage3DT from "../vox/display/Stage3D";
import * as CameraBaseT from "../vox/view/CameraBase";

import * as Axis3DEntityT from "../vox/entity/Axis3DEntity";
import * as Sphere3DEntityT from "../vox/entity/Sphere3DEntity";
import * as DashedLine3DEntityT from "../vox/entity/DashedLine3DEntity";
import * as TextureProxyT from "../vox/texture/TextureProxy";
import * as TextureConstT from "../vox/texture/TextureConst";
import * as TexResLoaderT from "../vox/texture/TexResLoader";
import * as CameraTrackT from "../vox/view/CameraTrack";

import Vector3D = Vector3DT.vox.geom.Vector3D;
import MathConst = MathConstT.vox.utils.MathConst;
import RendererDeviece = RendererDevieceT.vox.render.RendererDeviece;
import CullFaceMode = RenderConstT.vox.render.CullFaceMode;
import RenderBlendMode = RenderConstT.vox.render.RenderBlendMode;
import DepthTestMode = RenderConstT.vox.render.DepthTestMode;
import RendererState = RendererStateT.vox.render.RendererState;
import RendererParam = RendererParamT.vox.scene.RendererParam;
import RendererInstanceContext = RendererInstanceContextT.vox.scene.RendererInstanceContext;
import RendererInstance = RendererInstanceT.vox.scene.RendererInstance;
import RenderStatusDisplay = RenderStatusDisplayT.vox.scene.RenderStatusDisplay;
import MouseEvent = MouseEventT.vox.event.MouseEvent;
import Stage3D = Stage3DT.vox.display.Stage3D;
import CameraBase = CameraBaseT.vox.view.CameraBase;

import Axis3DEntity = Axis3DEntityT.vox.entity.Axis3DEntity;
import Sphere3DEntity = Sphere3DEntityT.vox.entity.Sphere3DEntity;
import DashedLine3DEntity = DashedLine3DEntityT.vox.entity.DashedLine3DEntity;
import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
import TextureConst = TextureConstT.vox.texture.TextureConst;
import TexResLoader = TexResLoaderT.vox.texture.TexResLoader;
import CameraTrack = CameraTrackT.vox.view.CameraTrack;

export namespace demo
{
    export class DemoFrustrum
    {
        constructor()
        {
        }
        private m_renderer:RendererInstance = null;
        private m_rcontext:RendererInstanceContext = null;
        private m_texLoader:TexResLoader = new TexResLoader();
        private m_camTrack:CameraTrack = null;
        private m_statusDisp:RenderStatusDisplay = new RenderStatusDisplay();
        private m_tarDisp:Sphere3DEntity = null;
        initialize():void
        {
            console.log("DemoFrustrum::initialize()......");
            if(this.m_rcontext == null)
            {
                RendererDeviece.SHADERCODE_TRACE_ENABLED = true;
                let tex0:TextureProxy = this.m_texLoader.getTexAndLoadImg("static/assets/default.jpg");
                let tex1:TextureProxy = this.m_texLoader.getTexAndLoadImg("static/assets/broken_iron.jpg");
                let tex2:TextureProxy = this.m_texLoader.getTexAndLoadImg("static/assets/assets/guangyun_H_0007.png");
                let tex3:TextureProxy = this.m_texLoader.getTexAndLoadImg("static/assets/assets/flare_core_02.jpg");
                tex0.mipmapEnabled = true;
                tex0.setWrap(TextureConst.WRAP_REPEAT);
                tex1.mipmapEnabled = true;
                tex1.setWrap(TextureConst.WRAP_REPEAT);
                tex2.mipmapEnabled = true;
                tex2.setWrap(TextureConst.WRAP_REPEAT);
                tex3.mipmapEnabled = true;
                
                this.m_statusDisp.initialize("rstatus");
                let rparam:RendererParam = new RendererParam("glcanvas");
                rparam.setCamProject(45.0,10.0,3000.0);
                rparam.setCamPosition(1500.0,1500.0,1500.0);
                this.m_renderer = new RendererInstance();
                this.m_renderer.initialize(rparam);
                this.m_rcontext = this.m_renderer.getRendererContext();
                let stage3D:Stage3D = this.m_rcontext.getStage3D();
                stage3D.addEventListener(MouseEvent.MOUSE_DOWN,this,this.mouseDownListener);
                this.m_camTrack = new CameraTrack();
                this.m_camTrack.bindCamera(this.m_rcontext.getCamera());
                
                RendererState.CreateRenderState("ADD01",CullFaceMode.BACK,RenderBlendMode.ADD,DepthTestMode.RENDER_BLEND);
                RendererState.CreateRenderState("ADD02",CullFaceMode.BACK,RenderBlendMode.ADD,DepthTestMode.RENDER_ALWAYS);
                
                let axis:Axis3DEntity = new Axis3DEntity();
                axis.name = "axis";
                axis.initialize(300.0);
                axis.setXYZ(100.0,0.0,100.0);
                this.m_renderer.addEntity(axis);

                let camera0:CameraBase = new CameraBase(0);
                camera0.lookAtRH(new Vector3D(-500.0,500.0,500.0), new Vector3D(0.0,0.0,0.0), new Vector3D(0.0,1.0,0.0));
                camera0.perspectiveRH(MathConst.DegreeToRadian(45.0),600.0/500.0,150.1,600.0);
                camera0.update();

                let pvs:Vector3D[] = camera0.getWordFrustumVtxArr();

                let fruLine:DashedLine3DEntity = new DashedLine3DEntity();
                fruLine.initializeDashedLine([pvs[0],pvs[1],pvs[1],pvs[2],pvs[2],pvs[3],pvs[3],pvs[0]]);
                fruLine.setRGB3f(1.0,0.0,1.0);
                this.m_renderer.addEntity(fruLine);

                fruLine = new DashedLine3DEntity();
                fruLine.initializeDashedLine([pvs[4],pvs[5],pvs[5],pvs[6],pvs[6],pvs[7],pvs[7],pvs[4]]);
                fruLine.setRGB3f(0.0,0.5,1.0);
                this.m_renderer.addEntity(fruLine);
                
                fruLine = new DashedLine3DEntity();
                fruLine.initializeDashedLine([pvs[0],pvs[4],pvs[1],pvs[5],pvs[2],pvs[6],pvs[3],pvs[7]]);
                fruLine.setRGB3f(0.0,0.9,0.0);
                this.m_renderer.addEntity(fruLine);

                this.m_tarDisp = new Sphere3DEntity();
                this.m_tarDisp.initialize(50.0,30,30,[tex1]);
                this.m_tarDisp.setXYZ(0.0,0.0,0.0);
                this.m_renderer.addEntity(this.m_tarDisp);
            }
        }
        mouseDownListener(evt:any):void
        {
            console.log("mouseUpListener call, this.m_renderer: "+this.m_renderer.toString());
        }
        run():void
        {
            this.m_statusDisp.update();

            this.m_rcontext.setClearRGBColor3f(0.0, 0.0, 0.0);
            this.m_rcontext.runBegin();

            this.m_renderer.update();
            this.m_renderer.run();

            this.m_rcontext.runEnd();            
            this.m_camTrack.rotationOffsetAngleWorldY(0.2);
            this.m_rcontext.updateCamera();
            
        }
    }
}