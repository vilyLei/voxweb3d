import { ICoRendererScene } from "../../voxengine/scene/ICoRendererScene";
import { IMouseInteraction } from "../../voxengine/ui/IMouseInteraction";
import { ICoRenderer } from "../../voxengine/ICoRenderer";
import { ICoMath } from "../../math/ICoMath";
import { ICoAGeom } from "../../ageom/ICoAGeom";
import { ICoEdit } from "../../edit/ICoEdit";
import { ICoUI } from "../../voxui/ICoUI";
import { ICoTexture } from "../../voxtexture/ICoTexture";
import { ICoUIScene } from "../../voxui/scene/ICoUIScene";
import { CoMaterialContextParam, ICoRScene } from "../../voxengine/ICoRScene";

import { ICoMouseInteraction } from "../../voxengine/ui/ICoMouseInteraction";
import ViewerMaterialCtx from "../../demo/coViewer/ViewerMaterialCtx";
import { ModuleLoader } from "../../modules/loaders/ModuleLoader";
import { ViewerCoSApp } from "../../demo/coViewer/ViewerCoSApp";
import IRenderTexture from "../../../vox/render/texture/IRenderTexture";
import ITransformEntity from "../../../vox/entity/ITransformEntity";
import { CoGeomDataType, CoDataFormat, CoGeomDataUnit } from "../../app/CoSpaceAppData";
import IVector3D from "../../../vox/math/IVector3D";
import IRendererScene from "../../../vox/scene/IRendererScene";
import { IRendererSceneAccessor } from "../../../vox/scene/IRendererSceneAccessor";
import RendererSceneGraph from "../../../vox/scene/RendererSceneGraph";
import { TransformController } from "../transform/TransformController";
import { IButton } from "../../voxui/entity/IButton";
import { IClipLabel } from "../../voxui/entity/IClipLabel";

declare var CoRenderer: ICoRenderer;
declare var CoRScene: ICoRScene;
declare var CoMouseInteraction: ICoMouseInteraction;
declare var CoMath: ICoMath;
declare var CoAGeom: ICoAGeom;
declare var CoEdit: ICoEdit;
declare var CoUI: ICoUI;
declare var CoTexture: ICoTexture;


class SceneAccessor implements IRendererSceneAccessor {
	constructor() { }
	renderBegin(rendererScene: IRendererScene): void {
		let p = rendererScene.getRenderProxy();
		p.clearDepth(1.0);
	}
	renderEnd(rendererScene: IRendererScene): void {
	}
}
/**
 * cospace renderer
 */
export class DemoEditTrans {
	private m_rscene: ICoRendererScene = null;
	private m_editRScene: ICoRendererScene = null;
	private m_uiRScene: IRendererScene = null;
	private m_coUIScene: ICoUIScene = null;
	private m_interact: IMouseInteraction = null;

	private m_vcoapp: ViewerCoSApp;
	private m_vmctx: ViewerMaterialCtx;
	private m_scale = 20.0;

	constructor() { }

	initialize(): void {

		
		document.oncontextmenu = function (e) {
			e.preventDefault();
		}

		console.log("DemoEditTrans::initialize() ...");
		document.onmousedown = (evt: any): void => {
			this.mouseDown(evt);
		};


		this.initEngineModule();
	}
	private initEngineModule(): void {

		let url = "static/cospace/engine/mouseInteract/CoMouseInteraction.umd.js";
		let mouseInteractML = new ModuleLoader(2, (): void => {
			this.initInteract();
		});

		let url0 = "static/cospace/engine/renderer/CoRenderer.umd.js";
		let url1 = "static/cospace/engine/rscene/CoRScene.umd.js";
		let url2 = "static/cospace/math/CoMath.umd.js";
		let url3 = "static/cospace/ageom/CoAGeom.umd.js";
		let url4 = "static/cospace/coedit/CoEdit.umd.js";
		let url5 = "static/cospace/comesh/CoMesh.umd.js";
		let url6 = "static/cospace/coentity/CoEntity.umd.js";
		let url7 = "static/cospace/particle/CoParticle.umd.js";
		let url8 = "static/cospace/coMaterial/CoMaterial.umd.js";
		let url9 = " static/cospace/cotexture/CoTexture.umd.js";
		let url10 = "static/cospace/coui/CoUI.umd.js";

		new ModuleLoader(2, (): void => {
			if (this.isEngineEnabled()) {
				console.log("engine modules loaded ...");
				this.initRenderer();

				this.initScene();
				new ModuleLoader(3, (): void => {

					console.log("math module loaded ...");

					new ModuleLoader(6, (): void => {
						console.log("ageom module loaded ...");
						this.createEditEntity();
						this.initUI();
					}).load(url3).load(url4).load(url6).load(url7).load(url9).load(url10);

				}).load(url2).load(url5).load(url8);

				this.m_vcoapp = new ViewerCoSApp();
				this.m_vcoapp.initialize((): void => {
					this.loadOBJ();
				});

			}
		}).addLoader(mouseInteractML)
			.load(url0)
			.load(url1);

		mouseInteractML.load(url);
	}
	private m_transCtr: TransformController = null;

	private createEditEntity(): void {

		let editsc = this.m_editRScene;

		this.m_transCtr = new TransformController();
		this.m_transCtr.initialize(editsc);
	}
	private initUI(): void {

		this.m_coUIScene = CoUI.createUIScene();
		this.m_coUIScene.initialize();
		this.m_uiRScene = this.m_coUIScene.rscene;
		this.m_graph.addScene(this.m_uiRScene);

		let uiScene = this.m_coUIScene;
		/*
		let clipColorLabel = CoUI.createClipColorLabel();
		clipColorLabel.initializeWithoutTex(50, 32, 4);
		clipColorLabel.getColorAt(0).setRGB3f(0.0, 0.8, 0.8);
		clipColorLabel.getColorAt(1).setRGB3f(0.2, 1.0, 0.2);
		clipColorLabel.getColorAt(2).setRGB3f(1.0, 0.2, 1.0);
		// this.m_coUIScene.addEntity(clipColorLabel);
		let btn01 = CoUI.createButton();
		btn01.initializeWithLable(clipColorLabel);
		uiScene.addEntity(btn01);
		//*/

		///*

		let texAtlas = uiScene.texAtlas;

		let urls: string[] = ["框选", "移动", "缩放", "旋转"];
		let img = texAtlas.createCharsCanvasFixSize(90, 40, urls[0], 30);
		texAtlas.addImageToAtlas(urls[0], img);
		img = texAtlas.createCharsCanvasFixSize(90, 40, urls[1], 30);
		texAtlas.addImageToAtlas(urls[1], img);
		img = texAtlas.createCharsCanvasFixSize(90, 40, urls[2], 30);
		texAtlas.addImageToAtlas(urls[2], img);
		img = texAtlas.createCharsCanvasFixSize(90, 40, urls[3], 30);
		texAtlas.addImageToAtlas(urls[3], img);
		console.log("XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX 0");

		///*
		let btnUrls = [urls[0], urls[1], urls[2], urls[1]];
		btnUrls = urls;
		// let btn = CoUI.createButton(); //new Button();
		// btn.initialize(texAtlas, btnUrls);
		// // btn.initializeWithLable(lable01);
		// this.m_uisc.addEntity(btn);

		let csLable = CoUI.createClipLabel();
		csLable.initialize(texAtlas, urls);

		let px: number = 10;
		let py: number = 300;
		let selectBtn = this.crateBtn(urls, px, py - (5 + csLable.getClipHeight()) * 0, 0, "select");
		selectBtn.disable();
		selectBtn.setClipIndex(4);
		let moveBtn = this.crateBtn(urls, px, py - (5 + csLable.getClipHeight()) * 1, 1, "move");
		let scaleBtn = this.crateBtn(urls, px, py - (5 + csLable.getClipHeight()) * 2, 2, "scale");
		let rotateBtn = this.crateBtn(urls, px, py - (5 + csLable.getClipHeight()) * 3, 3, "rotate");
		//*/

	}
	private crateBtn(urls: string[], px: number, py: number, labelIndex: number, idns: string): IButton {


		let texAtlas = this.m_coUIScene.texAtlas;
		let label = CoUI.createClipLabel();
		label.initialize(texAtlas, urls);
		let colorClipLabel = CoUI.createColorClipLabel();
		colorClipLabel.initialize(label, 5);
		colorClipLabel.getColorAt(0).setRGB3f(0.0, 0.8, 0.8);
		colorClipLabel.getColorAt(1).setRGB3f(0.2, 1.0, 0.2);
		colorClipLabel.getColorAt(2).setRGB3f(1.0, 0.2, 1.0);
		colorClipLabel.getColorAt(4).setRGB3f(0.5, 0.5, 0.5);
		colorClipLabel.setLabelClipIndex(labelIndex);
		// colorClipLabel.setXY(200,0);
		// colorClipLabel.setClipIndex(2);
		// this.m_uisc.addEntity(colorClipLabel);

		let btn = CoUI.createButton();
		btn.uuid = idns;
		btn.initializeWithLable(colorClipLabel);
		btn.setXY(px, py);
		this.m_coUIScene.addEntity(btn);
		btn.addEventListener(CoRScene.MouseEvent.MOUSE_UP, this, this.btnMouseUpListener);
		return btn;
	}
	private m_ctrlType: number = 0;
	private btnMouseUpListener(evt: any): void {
		console.log("btnMouseUpListener(), evt: ", evt);
		let uuid = evt.uuid;
		switch (uuid) {
			case "move":
				this.m_ctrlType = this.m_transCtr.TRANSLATION;
				this.m_transCtr.enable(this.m_ctrlType);
				break;

			case "scale":

				this.m_ctrlType = this.m_transCtr.SCALE;
				this.m_transCtr.enable(this.m_ctrlType);
				break;

			case "rotate":

				this.m_ctrlType = this.m_transCtr.ROTATION;
				this.m_transCtr.enable(this.m_ctrlType);
				break;

			default:
				break;
		}
	}
	private m_selectFlag: boolean = false;
	private mouseUpListener(evt: any): void {

		console.log("DemoEditTrans::mouseUpListener() ...");
		if (this.m_transCtr != null) {
			this.m_transCtr.decontrol();
		}
	}
	private mouseBgDownListener(evt: any): void {

		console.log("DemoEditTrans::mouseBgDownListener() ...");
		if (this.m_transCtr != null) {
			this.m_transCtr.disable();
		}
	}
	private createDefaultEntity(): void {

		let axis = CoRScene.createAxis3DEntity();
		this.m_rscene.addEntity(axis);

		/*
		let texList = [this.createTexByUrl()];
		let material = CoRScene.createDefaultMaterial();
		material.setTextureList(texList);
		let entity = CoRScene.createDisplayEntity();
		entity.setMaterial(material);
		entity.copyMeshFrom(this.m_rscene.entityBlock.unitXOZPlane);
		entity.setScaleXYZ(700.0, 0.0, 700.0);
		this.m_rscene.addEntity(entity);
		//*/
	}
	private initScene(): void {

		this.createDefaultEntity();

	}
	isEngineEnabled(): boolean {
		return typeof CoRenderer !== "undefined" && typeof CoRScene !== "undefined";
	}

	private createTexByUrl(url: string = ""): IRenderTexture {

		let tex = this.m_rscene.textureBlock.createImageTex2D(64, 64, false);

		// this.m_plane = new Plane3DEntity();
		// this.m_plane.initializeXOZ(-400.0, -400.0, 800.0, 800.0, [tex]);
		// this.m_rscene.addEntity(this.m_plane);

		let img = new Image();
		img.onload = (evt: any): void => {
			tex.setDataFromImage(img, 0, 0, 0, false);
		}
		img.src = url != "" ? url : "static/assets/box.jpg";
		return tex;
	}
	private initInteract(): void {
		if (this.m_rscene != null && this.m_interact == null && typeof CoMouseInteraction !== "undefined") {
			this.m_interact = CoMouseInteraction.createMouseInteraction();
			this.m_interact.setEventParams(1, true);
			this.m_interact.initialize(this.m_rscene);
			this.m_interact.setSyncLookAtEnabled(true);
		}
	}

	private m_graph: RendererSceneGraph = null;
	private initRenderer(): void {

		if (this.m_rscene == null) {

			let RendererDevice = CoRScene.RendererDevice;
			RendererDevice.SHADERCODE_TRACE_ENABLED = false;
			RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
			RendererDevice.SetWebBodyColor("#606060");

			let rparam = CoRScene.createRendererSceneParam();
			rparam.setAttriAntialias(!RendererDevice.IsMobileWeb());
			rparam.setCamPosition(1000.0, 1000.0, 1000.0);
			rparam.setCamProject(45, 20.0, 9000.0);
			let rscene = CoRScene.createRendererScene(rparam, 3);
			rscene.setClearRGBColor3f(0.23, 0.23, 0.23);
			// console.log("60/255: ", 60/255);
			// rscene.setClearUint24Color((60 << 16) + (60 << 8) + 60);

			rscene.addEventListener(CoRScene.MouseEvent.MOUSE_UP, this, this.mouseUpListener, true, true);
			rscene.addEventListener(CoRScene.MouseEvent.MOUSE_BG_DOWN, this, this.mouseBgDownListener);
			this.m_rscene = rscene;

			let subScene = this.m_rscene.createSubScene(rparam, 3, false);
			subScene.enableMouseEvent(true);
			subScene.setAccessor(new SceneAccessor());

			// let rnode = subScene;
			// this.m_rscene.appendRenderNode(rnode);
			this.m_editRScene = subScene;
			this.m_graph = new RendererSceneGraph();
			this.m_graph.addScene(this.m_rscene);
			this.m_graph.addScene(this.m_editRScene);

		}
	}
	private loadOBJ(): void {
		let baseUrl: string = "static/private/obj/";
		let url = baseUrl + "base.obj";
		url = baseUrl + "base4.obj";
		console.log("loadOBJ() init...");
		this.loadGeomModel(url, CoDataFormat.OBJ);
	}

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

		for (let i = 0; i < len; ++i) {
			let entity = this.createEntity(unit.data.models[i]);
			entity.setScaleXYZ(m_scale, m_scale, m_scale);
		}
	}
	private m_entities: ITransformEntity[] = [];
	private createEntity(model: CoGeomDataType): ITransformEntity {
		// let rst = CoRenderer.RendererState;

		const MouseEvent = CoRScene.MouseEvent;
		// let material = new CoNormalMaterial().build().material;
		let material = CoRScene.createDefaultMaterial(true);
		material.initializeByCodeBuf(false);
		material.setRGB3f(0.7, 0.7, 0.7);

		let mesh = CoRScene.createDataMeshFromModel(model, material);
		let cv = mesh.bounds.center.clone();
		let vs = model.vertices;
		let tot = vs.length;
		for (let i = 0; i < tot;) {
			vs[i++] -= cv.x;
			vs[i++] -= cv.y;
			vs[i++] -= cv.z;
		}


		cv.scaleBy(this.m_scale);
		mesh = CoRScene.createDataMeshFromModel(model, material);
		let entity = CoRScene.createMouseEventEntity();
		entity.setMaterial(material);
		entity.setMesh(mesh);
		entity.setPosition(cv);
		// entity.setRenderState(rst.NONE_CULLFACE_NORMAL_STATE);
		this.m_rscene.addEntity(entity);

		entity.addEventListener(MouseEvent.MOUSE_OVER, this, this.mouseOverTargetListener);
		entity.addEventListener(MouseEvent.MOUSE_OUT, this, this.mouseOutTargetListener);
		entity.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDownTargetListener);
		entity.addEventListener(MouseEvent.MOUSE_UP, this, this.mouseUpTargetListener);

		this.m_entities.push(entity);
		return entity;
	}

	private mouseOverTargetListener(evt: any): void {
		// console.log("mouseOverTargetListener() mouse over...");
	}
	private mouseOutTargetListener(evt: any): void {
		// console.log("mouseOutTargetListener() mouse out...");
	}
	private mouseDownTargetListener(evt: any): void {
		console.log("mouseDownTargetListener() mouse down...");

		let pos = CoMath.createVec3();
		let entity = evt.target as ITransformEntity;
		entity.getPosition(pos);
		let wpos = evt.wpos as IVector3D;
		pos.subtractBy(wpos);


		if (this.m_transCtr != null) {
			let ls = this.m_entities;
			this.m_transCtr.select([ls[0], ls[1], entity], wpos);
		}
	}
	private mouseUpTargetListener(evt: any): void {
		console.log("mouseUpTargetListener() mouse up...");
		if (this.m_transCtr != null) {
			this.m_transCtr.enable(this.m_ctrlType);
			// this.m_transCtr.enable(this.m_transCtr.TRANSLATION);
			// this.m_transCtr.enable(this.m_transCtr.SCALE);
			// this.m_transCtr.enable(this.m_transCtr.ROTATION);
		}
	}

	private mouseDown(evt: any): void { }
	run(): void {
		if (this.m_graph != null) {
			if(this.m_interact != null) {
				this.m_interact.run();
			}
			if (this.m_transCtr != null) {
				this.m_transCtr.run();
			}
			this.m_graph.run();

		}
	}
}

export default DemoEditTrans;
