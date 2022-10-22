import Vector3D from "../../../vox/math/Vector3D";
import MouseEvent from "../../../vox/event/MouseEvent";
import MouseEvt3DDispatcher from "../../../vox/event/MouseEvt3DDispatcher";
import RendererDevice from "../../../vox/render/RendererDevice";
import RenderStatusDisplay from "../../../vox/scene/RenderStatusDisplay";

import RendererParam from "../../../vox/scene/RendererParam";
import RendererScene from "../../../vox/scene/RendererScene";
import CameraStageDragSwinger from "../../../voxeditor/control/CameraStageDragSwinger";
import CameraZoomController from "../../../voxeditor/control/CameraZoomController";

import DebugFlag from "../../../vox/debug/DebugFlag";

import Sphere3DEntity from "../../../vox/entity/Sphere3DEntity";
import Axis3DEntity from "../../../vox/entity/Axis3DEntity";
import Line3DEntity from "../../../vox/entity/Line3DEntity";

import { MaterialContext } from "../../../materialLab/base/MaterialContext";
import { RenderableMaterialBlock } from "../../../vox/scene/block/RenderableMaterialBlock";
import { RenderableEntityBlock } from "../../../vox/scene/block/RenderableEntityBlock";

import DivLog from "../../../vox/utils/DivLog";
import RawMesh from "../../../vox/mesh/RawMesh";
import { RenderDrawMode } from "../../../vox/render/RenderConst";
import Line3DMaterial from '../../../vox/material/mcase/Line3DMaterial';
import DisplayEntity from "../../../vox/entity/DisplayEntity";
import RadialLine from "../../../vox/geom/RadialLine";
import Plane from "../../../vox/geom/Plane";
import H5Text from "../../voxtext/base/H5Text";
import TextEntity from "../../voxtext/base/TextEntity";
import BoundsEntity from "../../../vox/entity/BoundsEntity";
import Plane3DEntity from "../../../vox/entity/Plane3DEntity";
import { Box3DEntity } from "../../voxengine/CoRendererBase";
import { QuadBrokenLine3DEntity } from "../../../vox/entity/QuadLine3DEntity";

//import { DragMoveController } from "../../../../voxeditor/entity/DragMoveController";

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
            RendererDevice.SetWebBodyColor("#333333");
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
            let entityBlock = new RenderableEntityBlock();
            entityBlock.initialize();
            rscene.entityBlock = entityBlock;

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

        // let bounds: BoundsEntity = null;
        // let box = new Box3DEntity();
        // box.normalEnabled = true;
        // box.initializeCube(100.0);
        // this.m_rscene.addEntity(box);

        // return;

        // let quadL = new QuadBrokenLine3DEntity();
        // quadL.initialize([0.0,0.0,0.0, 300.0,0.0,0.0, 300.0,300.0,0.0, 600.0,300.0,0.0], 56.0);
        // this.m_rscene.addEntity(quadL);

        
        let plane0 = new Plane3DEntity();
        // plane0.normalEnabled = true;
        plane0.premultiplyAlpha = true;
        plane0.initializeXOYSquare(200);
        this.m_rscene.addEntity(plane0);

        return;

        let plane = new Plane3DEntity();
        plane.normalEnabled = true;
        plane.initializeXOYSquare(200);
        // this.m_rscene.addEntity(plane);


        let plm = plane.getMesh();
        let ivs = plm.getIVS();
        let vs = plm.getVS();
        let uvs = new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]);//plm.getUVS();
        let nvs = plm.getNVS();

        let mesh = new RawMesh();
        // mesh.setTransformMatrix(this.transMatrix);
        mesh.reset();
        
		mesh.addFloat32Data(vs, 3);
		mesh.addFloat32Data(uvs, 2);
		mesh.addFloat32Data(nvs, 3);
		mesh.setIVS(ivs);
        console.log("YYYYYYYYYYYYYYYYY YYY YYY");
        mesh.vbWholeDataEnabled = false;
        mesh.wireframe = false;
        mesh.setPolyhedral(true);
        mesh.initialize();
        mesh.toElementsTriangles();

        let entity = new DisplayEntity();
        entity.setMaterial(plane.getMaterial());
        entity.setMesh( mesh );
        this.m_rscene.addEntity(entity);


        return;
        

        let axis = new Axis3DEntity();
        axis.initialize(300);
        this.m_rscene.addEntity(axis);

        // this.testVec();

        let bounds = new BoundsEntity();
		let radius: number = 100.0;
		let minV = new Vector3D(radius,radius,radius).scaleBy(-1.0);
		let maxV = new Vector3D(radius,radius,radius);
		bounds.setBounds(minV, maxV);

        this.initializeEvent(bounds);

        this.m_rscene.addEntity( bounds );

        let sph = new Sphere3DEntity();
        sph.normalEnabled = true;
        sph.initialize(radius, 20,20);
        this.m_rscene.addEntity( sph );
	}
    
    private initializeEvent(entity: DisplayEntity): void {
        const me = MouseEvent;
        let dispatcher = new MouseEvt3DDispatcher();
        dispatcher.addEventListener(me.MOUSE_OVER, this, this.mOverListener);
        dispatcher.addEventListener(me.MOUSE_OUT, this, this.mOutListener);
        dispatcher.addEventListener(me.MOUSE_DOWN, this, this.mDownListener);
        entity.setEvtDispatcher(dispatcher);
        entity.mouseEnabled = true;
    }

	private mOverListener(evt: any): void {
		console.log("DemoBase::mOverListener() ...");
	}
	private mOutListener(evt: any): void {
		console.log("DemoBase::mOutListener() ...");
	}
	private mDownListener(evt: any): void {
		console.log("DemoBase::mDownListener() ...");
	}
    private testVec(): void {

        let vec01 = new Vector3D();
        let vec02 = new Vector3D(70.5, 50.0, 0.0);

        let direc01 = new Vector3D().subVecsTo(vec02, vec01);

        let direc01_vertLeft = direc01.clone();
        let direc01_vertRight = direc01.clone();
        
        Vector3D.VerticalCCWOnXOY(direc01_vertLeft);
        Vector3D.VerticalCWOnXOY(direc01_vertRight);

        console.log("direc01: ", direc01);
        console.log("direc01_vertLeft  : ", direc01_vertLeft);
        console.log("direc01_vertRight : ", direc01_vertRight);

        let line01 = new Line3DEntity();
        line01.initialize(vec02, vec01);

        this.m_rscene.addEntity( line01 );
    }    
    
    protected mouseOverListener(evt: any): void {
        console.log("DemoBase::mouseOverListener() ...");
        // this.showOverColor();
    }
    protected mouseOutListener(evt: any): void {
        console.log("DemoBase::mouseOutListener() ...");
        // this.showOutColor();
    }
    private mouseDown(evt: any): void {
        // DebugFlag.Flag_0 = 1;
        let div = this.m_rscene.getDiv();
        let rect = div.getBoundingClientRect();
        console.log("mouseDown(), rect.width, rect.height: ",rect.width, rect.height);
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
