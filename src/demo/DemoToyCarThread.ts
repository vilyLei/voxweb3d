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

import CameraTrack from "../vox/view/CameraTrack";
import MouseEvent from "../vox/event/MouseEvent";
import DemoInstance from "./DemoInstance";
import ProfileInstance from "../voxprofile/entity/ProfileInstance";
import ThreadSystem from "../thread/ThreadSystem";
import CameraDragController from "../voxeditor/control/CameraDragController";
import CameraZoomController from "../voxeditor/control/CameraZoomController";

import { ToyCarTask } from "./thread/toyCar/task/ToyCarTask";
import { ToyCarScene } from "./thread/toyCar/scene/ToyCarScene";

export class DemoToyCarThread extends DemoInstance {
    constructor() {
        super();
    }
    private m_camTrack: CameraTrack = null;
    private m_statusDisp: RenderStatusDisplay = null;
    private m_profileInstance: ProfileInstance = new ProfileInstance();
    private m_stageDragCtrl: CameraDragController = new CameraDragController();
    private m_cameraZoomController: CameraZoomController = new CameraZoomController();

    private m_objScene: ToyCarScene = new ToyCarScene();

    protected initializeSceneParam(param: RendererParam): void {
        this.m_processTotal = 4;
        param.maxWebGLVersion = 1;
        param.setMatrix4AllocateSize(4096 * 4);
        param.setCamPosition(500.0, 500.0, 500.0);
    }

    protected initializeSceneObj(): void {
        console.log("DemoToyCarThread::initialize()......");
        this.m_camTrack = new CameraTrack();
        this.m_camTrack.bindCamera(this.m_rcontext.getCamera());

        RendererDevice.SHADERCODE_TRACE_ENABLED = false;
        RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
        //RendererDevice.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;
        this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);
        if (this.m_profileInstance != null) this.m_profileInstance.initialize(this.m_rscene.getRenderer());
        if (this.m_statusDisp != null) this.m_statusDisp.initialize();

        this.m_rscene.enableMouseEvent(true);
        this.m_cameraZoomController.bindCamera(this.m_rscene.getCamera());
        this.m_cameraZoomController.initialize(this.m_rscene.getStage3D());
        this.m_stageDragCtrl.initialize(this.m_rscene.getStage3D(), this.m_rscene.getCamera());
        this.m_cameraZoomController.setLookAtCtrlEnabled(false);

        let tex0: TextureProxy = this.getImageTexByUrl("static/assets/default.jpg");

        // add common 3d display entity
        //  var plane:Plane3DEntity = new Plane3DEntity();
        //  plane.initializeXOZ(-200.0,-150.0,400.0,300.0,[tex0]);
        //  this.m_rscene.addEntity(plane,2);
        let axis: Axis3DEntity = new Axis3DEntity();
        axis.initialize(300.0);
        this.m_rscene.addEntity(axis);

        console.log("------------------------------------------------------------------");
        console.log("------------------------------------------------------------------");

        this.m_rscene.setClearRGBColor3f(0.0, 0.3, 0.0);
        this.m_objScene.initialize(this.m_rscene, this.m_texLoader);
        
        this.update();
    }
    
    private m_downFlag: number = 0;
    private mouseDown(evt: any): void {
        this.m_downFlag++;
    }
    private m_timeoutId: any = -1;
    private update(): void {
        
        if (this.m_timeoutId > -1) {
            clearTimeout(this.m_timeoutId);
        }
        //this.m_timeoutId = setTimeout(this.update.bind(this),16);// 60 fps
        this.m_timeoutId = setTimeout(this.update.bind(this), 30);// 20 fps
        
        this.m_objScene.updateThread();
    }
    runBegin(): void {
        this.m_stageDragCtrl.runWithYAxis();
        this.m_cameraZoomController.run(null, 30.0);
        
        if (this.m_statusDisp != null) this.m_statusDisp.update();
        
    }
    run(): void {

        ThreadSystem.Run();

        this.m_rscene.run();

        if (this.m_profileInstance != null) {
            this.m_profileInstance.run();
        }
    }
    runEnd(): void {
    }
}
export default DemoToyCarThread;