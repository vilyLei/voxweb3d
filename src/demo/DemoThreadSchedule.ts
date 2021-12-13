
import Vector3D from "../vox/math/Vector3D";
import RendererDevice from "../vox/render/RendererDevice";
import RendererParam from "../vox/scene/RendererParam";
import RendererState from "../vox/render/RendererState";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";

import { IThreadSendData } from "../thread/base/IThreadSendData";
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
import ThreadSchedule from "../thread/ThreadSchedule";
import TestNumberAddTask from "../thread/control/TestNumberAddTask";
import TestNumberMultTask from "../thread/control/TestNumberMultTask";
import TestNumberMathTask from "../thread/control/TestNumberMathTask";

export class DemoThreadSchedule extends DemoInstance {
    constructor() {
        super();
    }
    private m_camTrack: CameraTrack = null;
    private m_statusDisp: RenderStatusDisplay = new RenderStatusDisplay();
    private m_profileInstance: ProfileInstance = new ProfileInstance();
    private m_thrSchedule: ThreadSchedule = new ThreadSchedule();
    protected initializeSceneParam(param: RendererParam): void {
        this.m_processTotal = 4;
        param.maxWebGLVersion = 1;
        param.setCamPosition(500.0, 500.0, 500.0);
    }
    //ENV=pre,ENV=dev,ENV=beta,ENV=pro,ENV=p2,,ENV=off
    // thread code example(demonstrate: 通过后续添加的代码字符串来扩充worker中的功能示例)
    private m_codeStr: string =
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
}
let workerIns_ThreadAddNum = new ThreadAddNum();
`;
    protected initializeSceneObj(): void {
        console.log("DemoThreadSchedule::initialize()......");
        this.m_camTrack = new CameraTrack();
        this.m_camTrack.bindCamera(this.m_rcontext.getCamera());

        RendererDevice.SHADERCODE_TRACE_ENABLED = false;
        RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
        //RendererDevice.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;
        this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);
        this.m_profileInstance.initialize(this.m_rscene.getRenderer());
        this.m_statusDisp.initialize();

        let tex0: TextureProxy = this.getImageTexByUrl("static/assets/default.jpg");
        let tex1: TextureProxy = this.getImageTexByUrl("static/assets/broken_iron.jpg");

        // add common 3d display entity
        var plane: Plane3DEntity = new Plane3DEntity();
        plane.initializeXOZ(-200.0, -150.0, 400.0, 300.0, [tex0]);
        this.m_rscene.addEntity(plane, 2);

        let axis: Axis3DEntity = new Axis3DEntity();
        axis.initialize(300.0);
        this.m_rscene.addEntity(axis);

        let box: Box3DEntity = new Box3DEntity();
        box.initialize(new Vector3D(-100.0, -100.0, -100.0), new Vector3D(100.0, 100.0, 100.0), [tex1]);
        this.m_rscene.addEntity(box);
        console.log("------------------------------------------------------------------");
        console.log("------------------------------------------------------------------");
        this.initThread();
    }
    private m_numberAddTask: TestNumberAddTask = new TestNumberAddTask();
    private m_numberMultTask: TestNumberMultTask = new TestNumberMultTask();
    private m_numberMathTask: TestNumberMathTask = new TestNumberMathTask();
    private initThread(): void {
        // 注意: m_codeStr 代码中描述的 getTaskClass() 返回值 要和 TestNumberAddTask 中的 getTaskClass() 返回值 要相等

        //  ThreadSystem.InitTaskByURL("static/thread/ThreadAddNum",0);
        //  ThreadSystem.InitTaskByURL("static/thread/ThreadMultNum",1);
        //  ThreadSystem.InitTaskByURL("static/thread/ThreadMathNum",2);
        this.m_thrSchedule.initTaskByCodeStr(this.m_codeStr, 0, "ThreadAddNum");
        this.m_thrSchedule.initTaskByURL("static/thread/ThreadMultNum", 1);
        this.m_thrSchedule.initTaskByURL("static/thread/ThreadMathNum", 2);
        this.m_thrSchedule.initsialize(1);
        this.m_numberAddTask.setThrDataPool(this.m_thrSchedule.getThrDataPool());
        this.m_numberMultTask.setThrDataPool(this.m_thrSchedule.getThrDataPool());
        this.m_numberMathTask.setThrDataPool(this.m_thrSchedule.getThrDataPool());
        //this.useMathTask();
    }
    private m_flag: number = 0;
    private useMathTask(): void {
        let total: number = 5;
        this.m_numberMathTask.reset();
        this.m_numberMathTask.setParseTotal(total);
        let sd: IThreadSendData = null;
        for (let i: number = 0; i < total; ++i) {
            let f: number = Math.round(Math.random() * 1000) % 4;
            switch (f) {
                case 0:
                    this.m_numberMathTask.addNumberList(new Float32Array([10, 12, 21, 22]));
                    break;
                case 1:
                    this.m_numberMathTask.subNumberList(new Float32Array([10, 12, 21, 22]));
                    break;
                case 2:
                    this.m_numberMathTask.divNumberList(new Float32Array([10, 12, 21, 22]));
                    break;
                case 3:
                    this.m_numberMathTask.mulNumberList(new Float32Array([10, 12, 21, 22]));
                    break;
                default:
                    break;
            }
            this.testTask();
        }
    }
    private testTask(): void {
        let t: number = this.m_flag % 3;
        this.m_numberAddTask.clacNumberList(new Float32Array([10, 12, 21, 22]));
        //this.m_numberAddTask.clacNumberList(new Float32Array([-10,-12,-21,-22])));

        switch (t) {
            case 0:
                this.m_numberAddTask.clacNumberList(new Float32Array([110, 112, 121, 122]));
                break;
            case 1:
                this.m_numberMultTask.clacNumberList(new Float32Array([210, 212, 221, 222]));
                break;
            case 2:
                break;
            default:
                break;

        }
        this.m_flag++;
    }
    private mouseDown(evt: any): void {
        console.log("mouse down evt: ", evt);
        this.testTask();
        //  if(Math.random() > 0.6)
        //  {
        //      this.useMathTask();
        //  }
    }
    runBegin(): void {
        this.m_statusDisp.update();
        this.m_rscene.setClearRGBColor3f(0.0, 0.3, 0.0);
        //this.m_rscene.setClearUint24Color(0x003300,1.0);
        super.runBegin();
    }
    run(): void {
        this.m_rscene.run();
        if (this.m_profileInstance != null) {
            this.m_profileInstance.run();
        }
        this.m_thrSchedule.run();
    }
    runEnd(): void {
        super.runEnd();
        this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
    }
}
export default DemoThreadSchedule;