
import Vector3D from "../vox/math/Vector3D";
import RendererDevice from "../vox/render/RendererDevice";
import RendererParam from "../vox/scene/RendererParam";
import RendererState from "../vox/render/RendererState";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";

import PureEntity from "../vox/entity/PureEntity";
import Plane3DEntity from "../vox/entity/Plane3DEntity";
import Axis3DEntity from "../vox/entity/Axis3DEntity";
import Box3DEntity from "../vox/entity/Box3DEntity";
import TextureProxy from "../vox/texture/TextureProxy";
////import * as TextureStoreT from "../vox/texture/TextureStore";
import CameraTrack from "../vox/view/CameraTrack";
import MouseEvent from "../vox/event/MouseEvent";
import DemoInstance from "./DemoInstance";
import ProfileInstance from "../voxprofile/entity/ProfileInstance";
import ThreadSystem from "../thread/ThreadSystem";
import * as MatTransTaskT from "../demo/thread/MatTransTask";
import * as MatCarTaskT from "../demo/thread/MatCarTask";

//import Vector3D = Vector3DT.vox.math.Vector3D;
//import RendererDevice = RendererDeviceT.vox.render.RendererDevice;
//import RendererParam = RendererParamT.vox.scene.RendererParam;
//import RendererState = RendererStateT.vox.render.RendererState;
//import RenderStatusDisplay = RenderStatusDisplayT.vox.scene.RenderStatusDisplay;

//import PureEntity = PureEntityT.vox.entity.PureEntity;
//import Plane3DEntity = Plane3DEntityT.vox.entity.Plane3DEntity;
//import Axis3DEntity = Axis3DEntityT.vox.entity.Axis3DEntity;
//import Box3DEntity = Box3DEntityT.vox.entity.Box3DEntity;
//import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
//import TextureStore = TextureStoreT.vox.texture.TextureStore;
//import CameraTrack = CameraTrackT.vox.view.CameraTrack;
//import MouseEvent = MouseEventT.vox.event.MouseEvent;
////import DemoInstance = DemoInstanceT.demo.DemoInstance;
//import ProfileInstance = ProfileInstanceT.voxprofile.entity.ProfileInstance;
import MatTransTask = MatTransTaskT.demo.thread.MatTransTask;
import MatCarTask = MatCarTaskT.demo.thread.MatCarTask;


export namespace demo
{
    export class DemoMatTransThread extends DemoInstance
    {
        constructor()
        {
            super();
        }
        private m_camTrack:CameraTrack = null;
        private m_statusDisp:RenderStatusDisplay = null;
        private m_profileInstance:ProfileInstance = new ProfileInstance();
        protected initializeSceneParam(param:RendererParam):void
        {
            this.m_processTotal = 4;
            param.maxWebGLVersion = 1;
            param.setMatrix4AllocateSize(4096 * 4);
            param.setCamPosition(500.0,500.0,500.0);
        }
        
        protected initializeSceneObj():void
        {
            console.log("DemoMatTransThread::initialize()......");
            this.m_camTrack = new CameraTrack();
            this.m_camTrack.bindCamera(this.m_rcontext.getCamera());

            RendererDevice.SHADERCODE_TRACE_ENABLED = false;
            RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
            //RendererDevice.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;
            this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this,this.mouseDown);
            if(this.m_profileInstance != null)this.m_profileInstance.initialize(this.m_rscene.getRenderer());
            if(this.m_statusDisp != null)this.m_statusDisp.initialize("rstatus",this.m_rscene.getStage3D().viewWidth - 180);

            let tex0:TextureProxy = this.getImageTexByUrl("static/assets/default.jpg");
            
            // add common 3d display entity
            //  var plane:Plane3DEntity = new Plane3DEntity();
            //  plane.initializeXOZ(-200.0,-150.0,400.0,300.0,[tex0]);
            //  this.m_rscene.addEntity(plane,2);
            let axis:Axis3DEntity = new Axis3DEntity();
            axis.initialize(300.0);
            this.m_rscene.addEntity(axis);

            console.log("------------------------------------------------------------------");
            console.log("------------------------------------------------------------------");
            this.thr_test();
        }
        private m_dispTotal:number = 0;
        private m_matTasks:MatCarTask[] = [];
        private m_unitAmount:number = 1;
        private buildTask():void
        {
            // /*
            let total:number = this.m_unitAmount;
            let matTask:MatCarTask = new MatCarTask();
            matTask.getImageTexByUrlFunc = this.getImageTexByUrl;
            matTask.getImageTexByUrlHost = this;
            matTask.buildTask(total,this.m_rscene);
            this.m_dispTotal += total;
            this.m_matTasks.push(matTask);
            //*/
            
        }
        private updateTask():void
        {
            if(this.m_dispTotal > 0)
            {
                let list:any[] = this.m_matTasks;
                let len:number = list.length;
                for(let i:number = 0; i < len; ++i)
                {
                    list[i].updateAndSendParam();
                }
            }
        }
        private m_flag:number = 0;
        private m_downFlag:number = 0;
        private testTask():void
        {
            this.m_flag ++;
            this.updateTask();
        }
        private thr_test():void
        {
            this.buildTask();

            // 注意: m_codeStr 代码中描述的 getTaskClass() 返回值 要和 TestNumberAddTask 中的 getTaskClass() 返回值 要相等
            ThreadSystem.InitTaskByURL("static/thread/ThreadMatTrans",0);
            ThreadSystem.Initsialize(1);
            this.testTask();
        }
        
        private mouseDown(evt:any):void
        {
            //  //if(this.m_downFlag < 20 && this.m_matTasks.length < 3)
            //  if(this.m_downFlag < 20)
            //  {
            //      if(this.m_dispTotal < 22000)
            //      {
            //          this.buildTask();
            //      }
            //  }
            this.m_downFlag++;
            //  //console.log("mouse down evt: ",evt);
            //  this.testTask();
            //this.updateTask();
        }
        runBegin():void
        {
            if(this.m_statusDisp != null)this.m_statusDisp.update();
            this.m_rscene.setClearRGBColor3f(0.0, 0.3, 0.0);
            //this.m_rscene.setClearUint24Color(0x003300,1.0);
            if(this.m_flag > 0)
            {
                this.testTask();
            }
            super.runBegin();
        }
        run():void
        {
            this.m_rscene.run();
            if(this.m_profileInstance != null)
            {
                this.m_profileInstance.run();
            }
            ThreadSystem.Run();
        }
        runEnd():void
        {
            super.runEnd();
            //this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
        }
    }
}