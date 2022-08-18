import Vector3D from "../../../vox/math/Vector3D";
import MouseEvent from "../../../vox/event/MouseEvent";
import RendererDevice from "../../../vox/render/RendererDevice";
import RenderStatusDisplay from "../../../vox/scene/RenderStatusDisplay";

import RendererParam from "../../../vox/scene/RendererParam";
import RendererScene from "../../../vox/scene/RendererScene";
import CameraStageDragSwinger from "../../../voxeditor/control/CameraStageDragSwinger";
import CameraZoomController from "../../../voxeditor/control/CameraZoomController";

import DebugFlag from "../../../vox/debug/DebugFlag";

import Sphere3DEntity from "../../../vox/entity/Sphere3DEntity";
import Axis3DEntity from "../../../vox/entity/Axis3DEntity";

import { MaterialContext } from "../../../materialLab/base/MaterialContext";
import { RenderableMaterialBlock } from "../../../vox/scene/block/RenderableMaterialBlock";

import DivLog from "../../../vox/utils/DivLog";
import DragAxis from "../move/DragAxis";

export class DemoBase {

    constructor() { }
    private m_rscene: RendererScene = null;
    private m_statusDisp: RenderStatusDisplay = new RenderStatusDisplay();

    private m_stageDragSwinger: CameraStageDragSwinger = new CameraStageDragSwinger();
    private m_cameraZoomController: CameraZoomController = new CameraZoomController();

    private m_materialCtx: MaterialContext = new MaterialContext();
    
    initialize(): void {
		
        console.log("DemoBase::initialize()......");
        if (this.m_rscene == null) {

            RendererDevice.SHADERCODE_TRACE_ENABLED = true;
            RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
            //RendererDevice.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;

            DivLog.SetDebugEnabled(true);
            let rparam: RendererParam = new RendererParam();
            //rparam.maxWebGLVersion = 1;
            rparam.setCamProject(45, 50.0, 10000.0);
            rparam.setAttriStencil(true);
            rparam.setAttriAntialias(true);
            rparam.setCamPosition(2000.0, 2000.0, 2000.0);

            this.m_rscene = new RendererScene();
            this.m_rscene.initialize(rparam, 5);
            this.m_rscene.updateCamera();

            let rscene = this.m_rscene;
            let materialBlock = new RenderableMaterialBlock();
            materialBlock.initialize();
            rscene.materialBlock = materialBlock;
            // let entityBlock = new RenderableEntityBlock();
            // entityBlock.initialize();
            // rscene.entityBlock = entityBlock;

            this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);
            this.m_rscene.addEventListener(MouseEvent.MOUSE_UP, this, this.mouseUp);

            this.m_rscene.enableMouseEvent(true);
            this.m_cameraZoomController.bindCamera(this.m_rscene.getCamera());
            this.m_cameraZoomController.initialize(this.m_rscene.getStage3D());
            this.m_stageDragSwinger.initialize(this.m_rscene.getStage3D(), this.m_rscene.getCamera());
            this.m_materialCtx.initialize( this.m_rscene );

            this.m_statusDisp.initialize();
            
            this.m_rscene.setClearRGBColor3f(0.2, 0.5, 0.5);

            // DivLog.ShowLog("renderer inited.");
            // DivLog.ShowLog(RendererDevice.GPU_RENDERER);
           this.initScene();
        }
    }

    private initScene(): void {

        let axis: Axis3DEntity = new Axis3DEntity();
        axis.initialize(300.0);
        this.m_rscene.addEntity(axis);

        let dragAxis = new DragAxis();
    }
    private mouseDown(evt: any): void {
        DebugFlag.Flag_0 = 1;
    }
    private mouseUp(evt: any): void {
    }
    private update(): void {

        this.m_statusDisp.update(true);
    }
    run(): void {

        this.update();

        if(this.m_rscene != null) {

            this.m_stageDragSwinger.runWithYAxis();
            this.m_cameraZoomController.run(null, 30.0);
    
            this.m_rscene.run(true);
        }


        DebugFlag.Flag_0 = 0;
    }
}

export default DemoBase;
