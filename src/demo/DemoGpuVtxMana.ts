
import Vector3D from "../vox/math/Vector3D";
import RendererDeviece from "../vox/render/RendererDeviece";
import RendererParam from "../vox/scene/RendererParam";
import RendererInstanceContext from "../vox/scene/RendererInstanceContext";
import RendererInstance from "../vox/scene/RendererInstance";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";
import MouseEvent from "../vox/event/MouseEvent";
import Stage3D from "../vox/display/Stage3D";
import MeshResource from "../vox/mesh/MeshResource";
import CameraTrack from "../vox/view/CameraTrack";
import * as DemoSceneT from "./vtxMana/DemoScene";

import DemoScene = DemoSceneT.demo.vtxMana.DemoScene;

export namespace demo
{
    export class DemoGpuVtxMana
    {
        constructor()
        {
        }
        private m_renderer:RendererInstance = null;
        private m_rcontext:RendererInstanceContext = null;
        private m_camTrack:CameraTrack = null;
        private m_statusDisp:RenderStatusDisplay = new RenderStatusDisplay();
        private m_scene:DemoScene = new DemoScene();
        initialize():void
        {
            console.log("DemoGpuVtxMana::initialize()......");
            if(this.m_rcontext == null)
            {
                RendererDeviece.SHADERCODE_TRACE_ENABLED = true;
                //let tex0:TextureProxy = this.m_texMana.getImageTexByUrl("assets/fruit_01.jpg");
                
                this.m_statusDisp.initialize("rstatus");
                let rparam:RendererParam = new RendererParam();
                rparam.setCamProject(45.0,0.1,3000.0);
                rparam.setCamPosition(1500.0,1500.0,1500.0);
                this.m_renderer = new RendererInstance();
                this.m_renderer.initialize(rparam);
                this.m_rcontext = this.m_renderer.getRendererContext();
                let stage3D:Stage3D = this.m_rcontext.getStage3D() as Stage3D;
                stage3D.addEventListener(MouseEvent.MOUSE_DOWN,this,this.mouseDownListener);
                this.m_camTrack = new CameraTrack();
                this.m_camTrack.bindCamera(this.m_rcontext.getCamera());
                
                this.m_scene.initialize(this.m_renderer);
                
            }
        }
        mouseDownListener(evt:any):void
        {
            console.log("########## mouseDownListener call, this.m_renderer: "+this.m_renderer.toString());
            this.m_scene.mouseDown();
            
        }
        run():void
        {
            this.m_scene.run();
            this.m_statusDisp.statusInfo = "/"+this.m_rcontext.getTextureAttachTotal();
            //this.m_equeue.run();
            this.m_statusDisp.update();

            //console.log("##-- begin");
            this.m_rcontext.setClearRGBColor3f(0.1, 0.1, 0.2);
            //this.m_rcontext.setClearRGBAColor4f(0.0, 0.5, 0.0,0.0);
            this.m_rcontext.renderBegin();

            this.m_renderer.update();
            this.m_renderer.run();

            this.m_rcontext.runEnd();            
            this.m_camTrack.rotationOffsetAngleWorldY(-0.2);;
            this.m_rcontext.updateCamera();
            
            //  //console.log("#---  end");
            MeshResource.ClearTest();
        }
    }
}