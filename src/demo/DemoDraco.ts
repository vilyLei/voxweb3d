
import Vector3D from "../vox/math/Vector3D";
import RendererDeviece from "../vox/render/RendererDeviece";
import RendererParam from "../vox/scene/RendererParam";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";

import Axis3DEntity from "../vox/entity/Axis3DEntity";
import TextureProxy from "../vox/texture/TextureProxy";
import CameraTrack from "../vox/view/CameraTrack";
import MouseEvent from "../vox/event/MouseEvent";
import DemoInstance from "./DemoInstance";
import ProfileInstance from "../voxprofile/entity/ProfileInstance";
import ThreadSystem from "../thread/ThreadSystem";
import DracoMeshBuilder from "../voxmesh/draco/DracoMeshBuilder";
import {DracoModuleLoader, DracoWholeModuleLoader, DracoMultiPartsModuleLoader} from "../voxmesh/draco/DracoModuleLoader";


import CameraStageDragSwinger from "../voxeditor/control/CameraStageDragSwinger";
import CameraZoomController from "../voxeditor/control/CameraZoomController";

export class DemoDraco extends DemoInstance {
    constructor() {
        super();
    }
    private m_camTrack: CameraTrack = null;
    private m_statusDisp: RenderStatusDisplay = new RenderStatusDisplay();
    private m_profileInstance: ProfileInstance = new ProfileInstance();
    private m_dracoMeshLoader: DracoMeshBuilder = new DracoMeshBuilder();

    private m_stageDragSwinger: CameraStageDragSwinger = new CameraStageDragSwinger();
    private m_cameraZoomController: CameraZoomController = new CameraZoomController();

    //private moduleLoader: DracoModuleLoader = new DracoWholeModuleLoader();
    private moduleLoader: DracoModuleLoader = new DracoMultiPartsModuleLoader();
    protected initializeSceneParam(param: RendererParam): void {
        this.m_processTotal = 4;
        param.maxWebGLVersion = 2;
        param.setAttriAntialias(true);
        param.setCamProject(45, 1.0, 10000.0)
        param.setCamPosition(1500.0, 1500.0, 1500.0);

    }
    protected initializeSceneObj(): void {

        this.m_camTrack = new CameraTrack();
        this.m_camTrack.bindCamera(this.m_rcontext.getCamera());

        RendererDeviece.SHADERCODE_TRACE_ENABLED = true;
        RendererDeviece.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
        //RendererDeviece.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;
        this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);
        this.m_profileInstance.initialize(this.m_rscene.getRenderer());
        this.m_statusDisp.initialize("rstatus", this.m_rscene.getStage3D().viewWidth - 180);

        this.m_rscene.enableMouseEvent(true);
        this.m_cameraZoomController.bindCamera(this.m_rscene.getCamera());
        this.m_cameraZoomController.initialize(this.m_rscene.getStage3D());
        this.m_stageDragSwinger.initialize(this.m_rscene.getStage3D(), this.m_rscene.getCamera());

        let tex0: TextureProxy = this.getImageTexByUrl("static/assets/default.jpg");
        let tex1: TextureProxy = this.getImageTexByUrl("static/assets/broken_iron.jpg");

        // add common 3d display entity
        //  var plane: Plane3DEntity = new Plane3DEntity();
        //  plane.initializeXOZ(-200.0, -150.0, 400.0, 300.0, [tex0]);
        //  this.m_rscene.addEntity(plane, 2);

        let axis: Axis3DEntity = new Axis3DEntity();
        axis.initialize(300.0);
        this.m_rscene.addEntity(axis);
        //  let box: Box3DEntity = new Box3DEntity();
        //  box.initialize(new Vector3D(-100.0, -100.0, -100.0), new Vector3D(100.0, 100.0, 100.0), [tex1]);
        //  this.m_rscene.addEntity(box);

        console.log("------------------------------------------------------------------");
        console.log("------------------------------------------------------------------");

        this.m_dracoMeshLoader.initialize(2);
        
        this.moduleLoader.initialize(this.m_rscene, this.m_dracoMeshLoader);
        this.moduleLoader.setPartsTotal(30);
        this.moduleLoader.setScale( 1.0 );
        this.moduleLoader.setPosition(new Vector3D(0.0, -400.0, 0.0));
        this.moduleLoader.loadNext();
    }
    private mouseDown(evt: any): void {
        console.log("mouse down evt: ", evt);
    }
    runBegin(): void {
        this.m_statusDisp.update();
        this.m_rscene.setClearRGBColor3f(0.0, 0.3, 0.0);
        super.runBegin();
    }
    run(): void {
        this.m_rscene.run();
        if (this.m_profileInstance != null) {
            this.m_profileInstance.run();
        }
        ThreadSystem.Run();
        this.m_stageDragSwinger.runWithYAxis();
        this.m_cameraZoomController.run(Vector3D.ZERO, 30.0);
    }
}
export default DemoDraco;