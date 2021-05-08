
import {RenderBlendMode,CullFaceMode,DepthTestMode} from "../vox/render/RenderConst";
import RendererState from "../vox/render/RendererState";
import RendererParam from "../vox/scene/RendererParam";
import RendererInstanceContext from "../vox/scene/RendererInstanceContext";
import RendererInstance from "../vox/scene/RendererInstance";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";
import MouseEvent from "../vox/event/MouseEvent";
import Stage3D from "../vox/display/Stage3D";

import {QuadBrokenLine3DEntity} from "../vox/entity/QuadLine3DEntity";
import CameraTrack from "../vox/view/CameraTrack";
import * as EntityDispT from "./base/EntityDisp";

import EntityDispQueue = EntityDispT.demo.base.EntityDispQueue;

export namespace demo
{
    export class DemoQuadLine
    {
        constructor()
        {
        }
        private m_renderer:RendererInstance = null;
        private m_rcontext:RendererInstanceContext = null;
        private m_camTrack:CameraTrack = null;
        private m_statusDisp:RenderStatusDisplay = new RenderStatusDisplay();
        private m_equeue:EntityDispQueue = new EntityDispQueue();
        initialize():void
        {
            console.log("DemoQuadLine::initialize()......");
            if(this.m_rcontext == null)
            {
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
                
                RendererState.CreateRenderState("ADD01",CullFaceMode.BACK,RenderBlendMode.ADD,DepthTestMode.RENDER_BLEND);
                RendererState.CreateRenderState("ADD02",CullFaceMode.BACK,RenderBlendMode.ADD,DepthTestMode.RENDER_ALWAYS);
                
                let brokenLine:QuadBrokenLine3DEntity = new QuadBrokenLine3DEntity();
                //brokenLine.initialize([0.0,0.0,0.0, 0.0,0.0,200.0, 100.0,0.0,100.0, 200.0,0.0,200.0],5.0);
                brokenLine.initialize([0.0,0.0,0.0, 0.0,0.0,200.0, 100.0,0.0,200.0, 100.0,0.0,400.0, 100.0,-150.0,500.0],40.0);
                this.m_renderer.addEntity(brokenLine);

            }
        }
        mouseDownListener(evt:any):void
        {
            console.log("mouseUpListener call, this.m_renderer: "+this.m_renderer.toString());
            
        }
        run():void
        {
            this.m_equeue.run();
            this.m_statusDisp.update();

            //console.log("##-- begin");
            this.m_rcontext.setClearRGBColor3f(0.0, 0.5, 0.0);
            //this.m_rcontext.setClearRGBAColor4f(0.0, 0.5, 0.0,0.0);
            this.m_rcontext.renderBegin();

            this.m_renderer.update();
            this.m_renderer.run();

            this.m_rcontext.runEnd();            
            this.m_camTrack.rotationOffsetAngleWorldY(-0.2);;
            this.m_rcontext.updateCamera();
            
            //  //console.log("#---  end");
        }
    }
}