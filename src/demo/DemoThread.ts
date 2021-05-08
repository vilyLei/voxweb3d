
import Vector3D from "../vox/math/Vector3D";
import RendererDeviece from "../vox/render/RendererDeviece";
import RendererParam from "../vox/scene/RendererParam";
import RendererState from "../vox/render/RendererState";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";

import IThreadSendData from "../thread/base/IThreadSendData";
import ScreenFixedAlignPlaneEntity from "../vox/entity/ScreenFixedAlignPlaneEntity";
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
import TestNumberAddTask from "../thread/control/TestNumberAddTask";
import TestNumberMultTask from "../thread/control/TestNumberMultTask";
import TestNumberMathTask from "../thread/control/TestNumberMathTask";

//import Vector3D = Vector3DT.vox.math.Vector3D;
//import RendererDeviece = RendererDevieceT.vox.render.RendererDeviece;
//import RendererParam = RendererParamT.vox.scene.RendererParam;
//import RendererState = RendererStateT.vox.render.RendererState;
//import RenderStatusDisplay = RenderStatusDisplayT.vox.scene.RenderStatusDisplay;


//import IThreadSendData = IThreadSendDataT.thread.base.IThreadSendData;
//import ScreenFixedAlignPlaneEntity = ScreenFixedAlignPlaneEntityT.vox.entity.ScreenFixedAlignPlaneEntity;
//import Plane3DEntity = Plane3DEntityT.vox.entity.Plane3DEntity;
//import Axis3DEntity = Axis3DEntityT.vox.entity.Axis3DEntity;
//import Box3DEntity = Box3DEntityT.vox.entity.Box3DEntity;
//import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
//import TextureStore = TextureStoreT.vox.texture.TextureStore;
//import CameraTrack = CameraTrackT.vox.view.CameraTrack;
//import MouseEvent = MouseEventT.vox.event.MouseEvent;
////import DemoInstance = DemoInstanceT.demo.DemoInstance;
//import ProfileInstance = ProfileInstanceT.voxprofile.entity.ProfileInstance;
//import TestNumberAddTask = TestNumberAddTaskT.thread.control.TestNumberAddTask;
//import TestNumberMultTask = TestNumberMultTaskT.thread.control.TestNumberMultTask;
//import TestNumberMathTask = TestNumberMathTaskT.thread.control.TestNumberMathTask;


export namespace demo
{
    export class DemoThread extends DemoInstance
    {
        constructor()
        {
            super();
        }
        private m_camTrack:CameraTrack = null;
        private m_statusDisp:RenderStatusDisplay = new RenderStatusDisplay();
        private m_profileInstance:ProfileInstance = new ProfileInstance();
        protected initializeSceneParam(param:RendererParam):void
        {
            this.m_processTotal = 4;
            param.maxWebGLVersion = 1;
            param.setCamPosition(500.0,500.0,500.0);
        }
        // thread code example(demonstrate: 通过后续添加的代码字符串来扩充worker中的功能示例)
        private m_codeStr:string = 
`
function ThreadAddNum()
{
    console.log("ThreadAddNum instance init run ... from code str");
    
    let m_dataIndex = 0;
    let m_srcuid = 0;
    this.threadIndex = 0;
    let selfT = this;
    this.receiveData = function(data)
    {
        m_srcuid = data.srcuid;
        m_dataIndex = data.dataIndex;
        console.log("ThreadAddNum::receiveData(),data: ",data);
        let fs32 = data.numberData;
        let vdata = 0;
        for(let i = 0; i < fs32.length; ++i)
        {
            vdata += fs32[i];
        }
        let sendData = 
        {
            cmd:data.cmd,
            taskCmd: data.taskCmd,
            threadIndex:selfT.threadIndex,
            taskclass:selfT.getTaskClass(),
            srcuid:m_srcuid,
            dataIndex:m_dataIndex,
            data:vdata
        };
        postMessage(sendData);
    }
    this.getTaskClass = function()
    {
        return 0;
    }

    self.TaskSlot[this.getTaskClass()] = this;
    let INIT_TASK = 3701;
    postMessage({cmd:INIT_TASK,taskclass:this.getTaskClass()});
}
let workerIns_ThreadAddNum = new ThreadAddNum();
`;
        protected initializeSceneObj():void
        {
            console.log("DemoThread::initialize()......");
            this.m_camTrack = new CameraTrack();
            this.m_camTrack.bindCamera(this.m_rcontext.getCamera());

            RendererDeviece.SHADERCODE_TRACE_ENABLED = false;
            RendererDeviece.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
            //RendererDeviece.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;
            this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this,this.mouseDown);
            this.m_profileInstance.initialize(this.m_rscene.getRenderer());
            this.m_statusDisp.initialize("rstatus",this.m_rscene.getStage3D().viewWidth - 180);

            let tex0:TextureProxy = this.getImageTexByUrl("static/assets/default.jpg");
            let tex1:TextureProxy = this.getImageTexByUrl("static/assets/broken_iron.jpg");
            
            // add common 3d display entity
            var plane:Plane3DEntity = new Plane3DEntity();
            plane.initializeXOZ(-200.0,-150.0,400.0,300.0,[tex0]);
            this.m_rscene.addEntity(plane,2);

            let axis:Axis3DEntity = new Axis3DEntity();
            axis.initialize(300.0);
            this.m_rscene.addEntity(axis);

            let box:Box3DEntity = new Box3DEntity();
            box.initialize(new Vector3D(-100.0,-100.0,-100.0),new Vector3D(100.0,100.0,100.0),[tex1]);
            this.m_rscene.addEntity(box);
            console.log("------------------------------------------------------------------");
            console.log("------------------------------------------------------------------");
            this.thr_test();
        }
        private thr_test():void
        {
            // 注意: m_codeStr 代码中描述的 getTaskClass() 返回值 要和 TestNumberAddTask 中的 getTaskClass() 返回值 要相等

            //  ThreadSystem.InitTaskByURL("static/thread/ThreadAddNum",0);
            //  ThreadSystem.InitTaskByURL("static/thread/ThreadMultNum",1);
            //  ThreadSystem.InitTaskByURL("static/thread/ThreadMathNum",2);
            ThreadSystem.InitTaskByCodeStr(this.m_codeStr,0);
            ThreadSystem.InitTaskByURL("static/thread/ThreadMultNum",1);
            ThreadSystem.InitTaskByURL("static/thread/ThreadMathNum",2);
            ThreadSystem.Initsialize(1);
            //this.useMathTask();
        }
        private m_numberAddTask:TestNumberAddTask = new TestNumberAddTask();
        private m_numberMultTask:TestNumberMultTask = new TestNumberMultTask();
        private m_numberMathTask:TestNumberMathTask = new TestNumberMathTask();
        private m_flag:number = 0;
        private useMathTask():void
        {
            let total:number = 5;
            this.m_numberMathTask.reset();
            this.m_numberMathTask.setParseTotal(total);
            let sd:IThreadSendData = null;
            for(let i:number = 0;i < total;++i)
            {
                let f:number = Math.round(Math.random() * 1000) % 4;
                switch(f)
                {
                    case 0:
                        ThreadSystem.AddData(this.m_numberMathTask.addNumberList(new Float32Array([10,12,21,22])));
                    break;
                    case 1:
                        ThreadSystem.AddData(this.m_numberMathTask.subNumberList(new Float32Array([10,12,21,22])));
                    break;
                    case 2:
                        ThreadSystem.AddData(this.m_numberMathTask.divNumberList(new Float32Array([10,12,21,22])));
                    break;
                    case 3:
                        ThreadSystem.AddData(this.m_numberMathTask.mulNumberList(new Float32Array([10,12,21,22])));
                    break;
                    default:
                    break;
                }
                this.testTask();
            }           
        }
        private testTask():void
        {
            let t:number = this.m_flag%3;
            ThreadSystem.AddData(this.m_numberAddTask.clacNumberList(new Float32Array([10,12,21,22])));
            ThreadSystem.AddData(this.m_numberAddTask.clacNumberList(new Float32Array([-10,-12,-21,-22])));
            t = -1;
            switch(t)
            {
                case 0:
                    ThreadSystem.AddData(this.m_numberAddTask.clacNumberList(new Float32Array([10,12,21,22])));
                break;
                case 1:
                    ThreadSystem.AddData(this.m_numberMultTask.clacNumberList(new Float32Array([10,12,21,22])));
                break;
                case 2:
                //this.useMathTask();
                break;
                default:
                break;
                
            }
            this.m_flag++;
        }
        private mouseDown(evt:any):void
        {
            console.log("mouse down evt: ",evt);
            this.testTask();
            //  if(Math.random() > 0.6)
            //  {
            //      this.useMathTask();
            //  }
        }
        runBegin():void
        {
            this.m_statusDisp.update();
            this.m_rscene.setClearRGBColor3f(0.0, 0.3, 0.0);
            //this.m_rscene.setClearUint24Color(0x003300,1.0);
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