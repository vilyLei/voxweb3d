
import RendererDevice from "../vox/render/RendererDevice";
import {RenderBlendMode,CullFaceMode,DepthTestMode} from "../vox/render/RenderConst";
import RendererState from "../vox/render/RendererState";
import RendererParam from "../vox/scene/RendererParam";
import RendererInstanceContext from "../vox/scene/RendererInstanceContext";
import RendererInstance from "../vox/scene/RendererInstance";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";
import MouseEvent from "../vox/event/MouseEvent";
import Stage3D from "../vox/display/Stage3D";
import CameraTrack from "../vox/view/CameraTrack";
import * as MotionSceneT from "./fixProjMotion/MotionScene";

//import RendererDevice = RendererDeviceT.vox.render.RendererDevice;
//import CullFaceMode = RenderConstT.vox.render.CullFaceMode;
//import RenderBlendMode = RenderConstT.vox.render.RenderBlendMode;
//import DepthTestMode = RenderConstT.vox.render.DepthTestMode;
//import RendererState = RendererStateT.vox.render.RendererState;
//import RendererParam = RendererParamT.vox.scene.RendererParam;
//import RendererInstanceContext = RendererInstanceContextT.vox.scene.RendererInstanceContext;
//import RendererInstance = RendererInstanceT.vox.scene.RendererInstance;
//import RenderStatusDisplay = RenderStatusDisplayT.vox.scene.RenderStatusDisplay;
//import MouseEvent = MouseEventT.vox.event.MouseEvent;
//import Stage3D = Stage3DT.vox.display.Stage3D;

//import CameraTrack = CameraTrackT.vox.view.CameraTrack;
import MotionScene = MotionSceneT.motionDemo.fixProjMotion.MotionScene;
import CameraBase from "../vox/view/CameraBase";

export namespace motionDemo
{
    export class FixProjMotion
    {
        constructor()
        {
        }
        private m_renderer:RendererInstance = null;
        private m_rcontext:RendererInstanceContext = null;
        private m_camTrack:CameraTrack = null;
        private m_statusDisp:RenderStatusDisplay = new RenderStatusDisplay();
        private m_motionScene:MotionScene = new MotionScene();
        initialize():void
        {
            console.log("FixProjMotion::initialize()......");
            if(this.m_rcontext == null)
            {
                RendererDevice.SHADERCODE_TRACE_ENABLED = true;
                
                this.m_statusDisp.initialize("rstatus");
                let rparam:RendererParam = new RendererParam();
                rparam.setCamProject(45.0,0.1,3000.0);
                rparam.setCamPosition(1500.0,1500.0,1500.0);
                this.m_renderer = new RendererInstance();
                this.m_renderer.initialize(rparam, new CameraBase());
                this.m_renderer.appendProcess();
                this.m_renderer.appendProcess();
                this.m_renderer.appendProcess();
                this.m_rcontext = this.m_renderer.getRendererContext();
                let stage3D:Stage3D = this.m_rcontext.getStage3D() as Stage3D;
                stage3D.addEventListener(MouseEvent.MOUSE_DOWN,this,this.mouseUpListener);
                this.m_camTrack = new CameraTrack();
                this.m_camTrack.bindCamera(this.m_rcontext.getCamera());                

                this.m_motionScene.initialize(this.m_renderer);
                
            }
        }
        mouseUpListener(evt:any):void
        {
            console.log("mouseUpListener call, this.m_renderer: "+this.m_renderer.toString());
        }
        run():void
        {
            //--this.m_runFlag;
            //  this.m_followEntity.setXYZ(this.m_motionCtr.x,this.m_motionCtr.y,this.m_motionCtr.z);
            //  this.m_followEntity.update();
            //  this.m_motionCtr.setXYZ(motion_axis.getTransform().getX(),motion_axis.getTransform().getY(),motion_axis.getTransform().getZ());
            //  this.m_motionCtr.run();
            this.m_motionScene.run();

            this.m_statusDisp.update();

            //console.log("##-- begin");
            this.m_rcontext.setClearRGBColor3f(0.0, 0.5, 0.0);
            //this.m_rcontext.setClearRGBAColor4f(0.0, 0.5, 0.0,0.0);
            this.m_rcontext.renderBegin();

            this.m_renderer.update();
            this.m_renderer.runAt(0);
            this.m_renderer.runAt(1);
            this.m_renderer.runAt(2);
            //this.m_renderer.runAt(3);

            this.m_rcontext.runEnd();            
            //this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
            this.m_rcontext.updateCamera();
            
            //  //console.log("#---  end");
        }
    }
}