
import * as Vector3DT from "../vox/geom/Vector3";
import * as RendererDevieceT from "../vox/render/RendererDeviece";
import * as RendererParamT from "../vox/scene/RendererParam";
import * as RendererInstanceContextT from "../vox/scene/RendererInstanceContext";
import * as RendererInstanceT from "../vox/scene/RendererInstance";
import * as RenderStatusDisplayT from "../vox/scene/RenderStatusDisplay";
import * as MouseEventT from "../vox/event/MouseEvent";
import * as Stage3DT from "../vox/display/Stage3D";

import * as TextureRenderObjT from "../vox/texture/TextureRenderObj";
import * as CameraTrackT from "../vox/view/CameraTrack";
import * as TexManaT from "./base/TexMana";
import * as DemoSceneT from "./texMana/DemoScene";

import Vector3D = Vector3DT.vox.geom.Vector3D;
import RendererDeviece = RendererDevieceT.vox.render.RendererDeviece;
import RendererParam = RendererParamT.vox.scene.RendererParam;
import RendererInstanceContext = RendererInstanceContextT.vox.scene.RendererInstanceContext;
import RendererInstance = RendererInstanceT.vox.scene.RendererInstance;
import RenderStatusDisplay = RenderStatusDisplayT.vox.scene.RenderStatusDisplay;
import MouseEvent = MouseEventT.vox.event.MouseEvent;
import Stage3D = Stage3DT.vox.display.Stage3D;

import TextureRenderObj = TextureRenderObjT.vox.texture.TextureRenderObj;
import CameraTrack = CameraTrackT.vox.view.CameraTrack;
import TexMana = TexManaT.demo.base.TexMana;
import DemoScene = DemoSceneT.demo.texMama.DemoScene;

export namespace demo
{
    export class DemoGpuTexMana
    {
        constructor()
        {
        }
        private m_renderer:RendererInstance = null;
        private m_rcontext:RendererInstanceContext = null;
        private m_camTrack:CameraTrack = null;
        private m_statusDisp:RenderStatusDisplay = new RenderStatusDisplay();
        private m_texMana:TexMana = new TexMana();
        private m_scene:DemoScene = new DemoScene();
        initialize():void
        {
            console.log("DemoGpuTexMana::initialize()......");
            if(this.m_rcontext == null)
            {
                RendererDeviece.SHADERCODE_TRACE_ENABLED = true;
                //let tex0:TextureProxy = this.m_texMana.getTexByUrl("assets/fruit_01.jpg");
                
                this.m_statusDisp.initialize("rstatus");
                let rparam:RendererParam = new RendererParam("glcanvas");
                rparam.setMatrix4AllocateSize(4096);
                rparam.setCamProject(45.0,0.1,3000.0);
                rparam.setCamPosition(1500.0,1500.0,1500.0);
                this.m_renderer = new RendererInstance();
                this.m_renderer.initialize(rparam);
                this.m_rcontext = this.m_renderer.getRendererContext();
                let stage3D:Stage3D = this.m_rcontext.getStage3D();
                stage3D.addEventListener(MouseEvent.MOUSE_DOWN,this,this.mouseDownListener);
                this.m_camTrack = new CameraTrack();
                this.m_camTrack.bindCamera(this.m_rcontext.getCamera());
                
                this.m_scene.initialize(this.m_renderer);
                
            }
        }
        mouseDownListener(evt:any):void
        {
            console.log("mouseDownListener call, this.m_renderer: "+this.m_renderer.toString());
            this.m_scene.mouseDown();
            
        }
        run():void
        {
            //--this.m_runFlag;
            this.m_scene.run();
            this.m_statusDisp.statusInfo = "/"+TextureRenderObj.GetTexAttachAllCount();
            this.m_statusDisp.update();

            //console.log("##-- begin");
            this.m_rcontext.setClearRGBColor3f(0.1, 0.1, 0.2);
            this.m_rcontext.runBegin();

            this.m_renderer.update();
            this.m_renderer.run();

            this.m_rcontext.runEnd();            
            this.m_camTrack.rotationOffsetAngleWorldY(-0.2);;
            this.m_rcontext.updateCamera();
            
            //  //console.log("#---  end");
        }
    }
}