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
import RawMesh from "../../../vox/mesh/RawMesh";
import { RenderDrawMode } from "../../../vox/render/RenderConst";
import Line3DMaterial from '../../../vox/material/mcase/Line3DMaterial';
import DisplayEntity from "../../../vox/entity/DisplayEntity";
import RadialLine from "../../../vox/geom/RadialLine";
import Plane from "../../../vox/geom/Plane";

//import { DragMoveController } from "../../../../voxeditor/entity/DragMoveController";

export class DemoBase {

    constructor() { }
    private m_rscene: RendererScene = null;
    private m_statusDisp: RenderStatusDisplay = new RenderStatusDisplay();

    private m_stageDragSwinger: CameraStageDragSwinger = new CameraStageDragSwinger();
    private m_cameraZoomController: CameraZoomController = new CameraZoomController();

    private m_materialCtx: MaterialContext = new MaterialContext();

    private testGeom(): void {

		let outV = new Vector3D();

		let plane = new Plane();
		plane.position.setXYZ(0.0, 10.0, 0.0);
		plane.nv.setXYZ(0.0, 1.0, 0.0);
		plane.update();

		let rl1 = new RadialLine();
		rl1.position.setTo(100.0, 0.0, 100.0);
		rl1.tv.setTo(1.0, -1.0, 0.0);
		rl1.update();

		let intersection = plane.intersectRadialLinePos2(rl1.position, rl1.tv, outV);
		let interBoo = plane.intersectBoo;
		console.log("plane.intersectRayLinePos2(), interBoo: ", interBoo, ", plane.intersection: ", intersection, ", outV: ", outV);
	}
    initialize(): void {

        console.log("DemoBase::initialize()......");
		this.testGeom();
		return;
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
            this.m_materialCtx.initialize(this.m_rscene);

            this.m_statusDisp.initialize();

            this.m_rscene.setClearRGBColor3f(0.2, 0.5, 0.5);

            // DivLog.ShowLog("renderer inited.");
            // DivLog.ShowLog(RendererDevice.GPU_RENDERER);
            this.initScene();
        }
    }

    private initScene(): void {


        // vs: 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1
        // colors: 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1
        let size = 100;
        let vs = new Float32Array( [ 0, 0, 0, size, 0, 0, 0, 0, 0, 0, size, 0, 0, 0, 0, 0, 0, size ]);
        let colors = new Float32Array( [ 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1 ]);
        let mesh: RawMesh = new RawMesh();
        mesh.ivsEnabled = false;
        mesh.aabbEnabled = true;
        mesh.reset();
        mesh.addFloat32Data(vs, 3);
        mesh.addFloat32Data(colors, 3);
        mesh.initialize();
        mesh.drawMode = RenderDrawMode.ARRAYS_LINES;
        mesh.vtCount = Math.floor(vs.length / 3);

        let material = new Line3DMaterial(false);
        let entity = new DisplayEntity();
        entity.setMaterial(material);
        entity.setMesh(mesh);
        this.m_rscene.addEntity(entity);
        return;

        let axis: Axis3DEntity = new Axis3DEntity();
        axis.initialize(1.0);
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

        if (this.m_rscene != null) {

            this.m_stageDragSwinger.runWithYAxis();
            this.m_cameraZoomController.run(null, 30.0);

            this.m_rscene.run(true);
        }


        DebugFlag.Flag_0 = 0;
    }
}

export default DemoBase;