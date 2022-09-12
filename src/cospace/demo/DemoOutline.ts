import Vector3D from "../../vox/math/Vector3D";
import RendererDevice from "../../vox/render/RendererDevice";
import RendererParam from "../../vox/scene/RendererParam";
import RendererScene from "../../vox/scene/RendererScene";
import RenderStatusDisplay from "../../vox/scene/RenderStatusDisplay";
import MouseEvent from "../../vox/event/MouseEvent";

import DisplayEntity from "../../vox/entity/DisplayEntity";
import Axis3DEntity from "../../vox/entity/Axis3DEntity";
import Box3DEntity from "../../vox/entity/Box3DEntity";
import Sphere3DEntity from "../../vox/entity/Sphere3DEntity";
import BoxFrame3D from "../../vox/entity/BoxFrame3D";
import TextureProxy from "../../vox/texture/TextureProxy";
import TextureConst from "../../vox/texture/TextureConst";
import ImageTextureLoader from "../../vox/texture/ImageTextureLoader";
import DataMesh from "../../vox/mesh/DataMesh";
import DisplayEntityContainer from "../../vox/entity/DisplayEntityContainer";

import CameraStageDragSwinger from "../../voxeditor/control/CameraStageDragSwinger";
import CameraZoomController from "../../voxeditor/control/CameraZoomController";
import MouseEvt3DDispatcher from "../../vox/event/MouseEvt3DDispatcher";
import OcclusionPostOutline from "../../renderingtoy/mcase/outline/OcclusionPostOutline";
import { RenderableMaterialBlock } from "../../vox/scene/block/RenderableMaterialBlock";
import { RenderableEntityBlock } from "../../vox/scene/block/RenderableEntityBlock";
import { CoGeomDataType, CoDataFormat, CoGeomDataUnit } from "../app/CoSpaceAppData";
import { ViewerCoSApp } from "./coViewer/ViewerCoSApp";

import { CoNormalMaterial } from "../voxengine/material/CoNormalMaterial";
import { NormalUVViewerMaterial } from "./material/NormalUVViewerMaterial";

export class DemoOutline {

	private m_vcoapp: ViewerCoSApp;
    private m_rscene: RendererScene = null;
    private m_texLoader: ImageTextureLoader;
    private m_statusDisp: RenderStatusDisplay = new RenderStatusDisplay();
    private m_stageDragSwinger: CameraStageDragSwinger = new CameraStageDragSwinger();
    private m_cameraZoomController: CameraZoomController = new CameraZoomController();
    private m_postOutline: OcclusionPostOutline = new OcclusionPostOutline();

    private m_followEntity: DisplayEntity = null;
    private m_texList: TextureProxy[] = [];
    constructor() {
    }

    initTex(): void {
        let i: number = 0;

        let urls: string[] = [
            "static/assets/default.jpg"
            , "static/assets/broken_iron.jpg"
            , "static/assets/guangyun_H_0007.png"
        ];
        for (; i < urls.length; ++i) {
            this.m_texList.push(this.m_texLoader.getImageTexByUrl(urls[i]));
            this.m_texList[i].mipmapEnabled = true;
            this.m_texList[i].setWrap(TextureConst.WRAP_REPEAT);
        }
    }
    initialize(): void {
        console.log("DemoOutline::initialize()......");
        if (this.m_rscene == null) {

            RendererDevice.SHADERCODE_TRACE_ENABLED = true;
            RendererDevice.SetWebBodyColor();

            let scale: number = 1.0;
            let i: number = 0;

            let rparam: RendererParam = new RendererParam();
            rparam.setAttriAntialias(true);
            rparam.setCamPosition(1000.0, 1000.0, 1000.0);
            rparam.setCamProject(45, 20.0, 9000.0);
            this.m_rscene = new RendererScene();
            this.m_rscene.initialize(rparam);

            let rscene = this.m_rscene;
            let materialBlock = new RenderableMaterialBlock();
            materialBlock.initialize();
            rscene.materialBlock = materialBlock;
            let entityBlock = new RenderableEntityBlock();
            entityBlock.initialize();
            rscene.entityBlock = entityBlock;


            this.m_postOutline.initialize(this.m_rscene, 1, [0]);
            this.m_postOutline.setFBOSizeScaleRatio(0.5);
            this.m_postOutline.setRGB3f(0.0,2.0,0.0);
            this.m_postOutline.setOutlineDensity(2.5);
            this.m_postOutline.setOcclusionDensity(0.2);

            this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDownListener);
            this.m_rscene.addEventListener(MouseEvent.MOUSE_UP, this, this.mouseUpListener);

            this.m_statusDisp.initialize();

            this.m_rscene.enableMouseEvent(true);
            this.m_cameraZoomController.bindCamera(this.m_rscene.getCamera());
            this.m_cameraZoomController.initialize(this.m_rscene.getStage3D());
            this.m_stageDragSwinger.initialize(this.m_rscene.getStage3D(), this.m_rscene.getCamera());
            this.m_stageDragSwinger.setAutoRotationEnabled( false );

            this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);
            this.initTex();
            this.m_rscene.setClearRGBColor3f(0.0, 0.2, 0.0);


			this.m_vcoapp = new ViewerCoSApp();
			this.m_vcoapp.initialize((): void => {
				this.loadOBJ();
			});
        }
    }
	private loadOBJ(): void {
		let baseUrl: string = "static/private/obj/";
		let url = baseUrl + "base.obj";
		url = baseUrl + "base4.obj";
		this.loadGeomModel(url, CoDataFormat.OBJ);
	}
	private m_scale = 25.0;
	loadGeomModel(url: string, format: CoDataFormat): void {
		let ins = this.m_vcoapp.coappIns;
		if (ins != null) {

			ins.getCPUDataByUrlAndCallback(
				url,
				format,
				(unit: CoGeomDataUnit, status: number): void => {
					this.createEntityFromUnit(unit, status);
				},
				true
			);
		}
	}
	private createEntityFromUnit(unit: CoGeomDataUnit, status: number = 0): void {

		let len = unit.data.models.length;
		let m_scale = this.m_scale;
		len = 1;
		for (let i: number = 0; i < len; ++i) {
			let entity = this.createEntity(unit.data.models[i]);
			entity.setScaleXYZ(m_scale, m_scale, m_scale);
		}
	}
	private createEntity(model: CoGeomDataType): DisplayEntity {

		// let material = new Default3DMaterial();
		// material.setTextureList( [this.m_texList[0]] );
		// material.initializeByCodeBuf();

		let material = new NormalUVViewerMaterial();
		material.initializeByCodeBuf();
		let entity = new DisplayEntity();
		let mesh: DataMesh = new DataMesh();
		mesh.setVS(model.vertices);
		mesh.setUVS(model.uvsList[0]);
		mesh.setIVS(model.indices);
		mesh.setBufSortFormat(material.getBufSortFormat());
		mesh.initialize();
		entity.setMaterial( material );
		entity.setMesh( mesh );
		this.m_rscene.addEntity(entity);
        this.useEntityEvtDispatcher(entity);
		return entity;
	}

    private mouseOverTargetListener(evt: any): void {

		if(evt.target != null) {

			let targets: DisplayEntity[] = [ evt.target ];
			this.m_postOutline.setTargetList( targets );
		}
    }
    private mouseOutTargetListener(evt: any): void {
        //console.log("mouseOutTargetListener mouse out...");
        this.m_postOutline.setTargetList( null );
    }
    private useEntityEvtDispatcher(entity: DisplayEntity, frameBoo: boolean = false): void {

        let dispatcher: MouseEvt3DDispatcher = new MouseEvt3DDispatcher();
        dispatcher.addEventListener(MouseEvent.MOUSE_OVER, this, this.mouseOverTargetListener);
        dispatcher.addEventListener(MouseEvent.MOUSE_OUT, this, this.mouseOutTargetListener);
        entity.setEvtDispatcher(dispatcher);
        entity.mouseEnabled = true;

    }
    private useContainerEvtDispatcher(entity: DisplayEntityContainer, frameBoo: boolean = false): void {

        let dispatcher: MouseEvt3DDispatcher = new MouseEvt3DDispatcher();
        dispatcher.addEventListener(MouseEvent.MOUSE_OVER, this, this.mouseOverTargetListener);
        dispatcher.addEventListener(MouseEvent.MOUSE_OUT, this, this.mouseOutTargetListener);
        entity.setEvtDispatcher(dispatcher);
        entity.mouseEnabled = true;

    }
    mouseDownListener(evt: any): void {
    }
    mouseUpListener(evt: any): void {
    }
    pv: Vector3D = new Vector3D();
    delayTime: number = 10;

    run(): void {

        this.m_statusDisp.update();

        this.m_stageDragSwinger.runWithYAxis();
        this.m_cameraZoomController.run(Vector3D.ZERO, 30.0);

		//this.m_rscene.run();

        this.m_rscene.runBegin();
        this.m_rscene.run(true);
        this.m_postOutline.drawBegin();
        this.m_postOutline.draw();
        this.m_postOutline.drawEnd();
        this.m_rscene.runEnd();
    }

    private initEntityBoundsTest(): void {

        let srcBox: Box3DEntity = new Box3DEntity();
        srcBox.mouseEnabled = true;
        srcBox.initialize(new Vector3D(-100.0, -100.0, -100.0), new Vector3D(100.0, 100.0, 100.0), [this.m_texList[0]]);

        srcBox.setXYZ(Math.random() * 2000.0 - 1000.0, Math.random() * 2000.0 - 1000.0, Math.random() * 2000.0 - 1000.0);
        srcBox.setRotationXYZ(Math.random() * 360.0, Math.random() * 360.0, Math.random() * 360.0);
        srcBox.setScaleXYZ(Math.random() + 0.5, Math.random() + 0.5, Math.random() + 0.5);
        this.m_rscene.addEntity(srcBox);
        this.useEntityEvtDispatcher(srcBox);

    }
}

export default DemoOutline;
