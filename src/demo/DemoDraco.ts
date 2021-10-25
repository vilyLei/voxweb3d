
import Vector3D from "../vox/math/Vector3D";
import RendererDevice from "../vox/render/RendererDevice";
import RendererParam from "../vox/scene/RendererParam";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";

import Axis3DEntity from "../vox/entity/Axis3DEntity";
import AxisQuad3DEntity from "../vox/entity/AxisQuad3DEntity";
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
import DivLog from "../vox/utils/DivLog";
import RendererSubScene from "../vox/scene/RendererSubScene";
import Plane3DEntity from "../vox/entity/Plane3DEntity";

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

    private moduleLoader: DracoModuleLoader = new DracoWholeModuleLoader();
    private m_subScene: RendererSubScene = null;
    protected initializeSceneParam(param: RendererParam): void {
        this.m_processTotal = 4;
        param.maxWebGLVersion = 2;
        param.setAttriAntialias(true);
        param.setCamProject(45, 1.0, 10000.0)
        param.setCamPosition(1500.0, 1500.0, 1500.0);

    }
    protected initializeSceneObj(): void {

        //DivLog.SetDebugEnabled( true );
        
        this.m_camTrack = new CameraTrack();
        this.m_camTrack.bindCamera(this.m_rcontext.getCamera());

        RendererDevice.SHADERCODE_TRACE_ENABLED = true;
        RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
        //RendererDevice.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;
        this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);
        //  this.m_profileInstance.initialize(this.m_rscene.getRenderer());
        this.m_statusDisp.initialize();

        this.m_rscene.enableMouseEvent(true);
        this.m_cameraZoomController.bindCamera(this.m_rscene.getCamera());
        this.m_cameraZoomController.initialize(this.m_rscene.getStage3D());
        this.m_stageDragSwinger.initialize(this.m_rscene.getStage3D(), this.m_rscene.getCamera());

        let tex0: TextureProxy = this.getImageTexByUrl("static/assets/default.jpg");
        let tex1: TextureProxy = this.getImageTexByUrl("static/assets/broken_iron.jpg");

        let rparam: RendererParam = new RendererParam();
        rparam.setAttriAntialias(!RendererDevice.IsMobileWeb());
        rparam.setCamPosition(1800.0, 1800.0, 1800.0);
        rparam.setCamProject(45, 20.0, 9000.0);
        this.m_subScene = this.m_rscene.createSubScene();
        this.m_subScene.initialize(rparam, 3, false);
        // add common 3d display entity
        var plane: Plane3DEntity = new Plane3DEntity();
        plane.initializeXOZ(-200.0, -150.0, 400.0, 300.0, [tex0]);
        this.m_subScene.addEntity(plane, 0);
        
        this.m_subScene.disable();
        //this.m_rscene.disable();
        // let quadAxis:AxisQuad3DEntity = new AxisQuad3DEntity();
        // quadAxis.wireframe = true;
        // quadAxis.initialize(300.0,20.0);
        // this.m_rscene.addEntity(quadAxis);
        // return;
        let axis: Axis3DEntity = new Axis3DEntity();
        axis.initialize(300.0);
        this.m_rscene.addEntity(axis);
        //  let box: Box3DEntity = new Box3DEntity();
        //  box.initialize(new Vector3D(-100.0, -100.0, -100.0), new Vector3D(100.0, 100.0, 100.0), [tex1]);
        //  this.m_rscene.addEntity(box);
        return;
        console.log("------------------------------------------------------------------");
        console.log("------------------------------------------------------------------");

        this.m_dracoMeshLoader.initialize(2);
        
        this.moduleLoader.initialize(this.m_rscene, this.m_dracoMeshLoader);
        let urlsTotal: number = 20;
        let urls: string[] = [];            
        for(let i: number = 0; i < 30; ++i) {
            urls.push("static/assets/modules/skirt01/dracos_"+ i +".drc.zip");
        }
        urlsTotal = urls.length;    
        //this.moduleLoader.setUrlList(urls);

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
        this.m_subScene.run(true);
        //  if (this.m_profileInstance != null) {
        //      this.m_profileInstance.run();
        //  }
        ThreadSystem.Run();
        this.m_stageDragSwinger.runWithYAxis();
        this.m_cameraZoomController.run(Vector3D.ZERO, 30.0);
    }
}
export default DemoDraco;