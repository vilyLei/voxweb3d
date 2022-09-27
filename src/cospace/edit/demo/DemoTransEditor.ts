import { ICoRendererScene } from "../../voxengine/scene/ICoRendererScene";
import { IMouseInteraction } from "../../voxengine/ui/IMouseInteraction";
import { ICoRenderer } from "../../voxengine/ICoRenderer";
import { ICoMath } from "../../math/ICoMath";
import { ICoEdit } from "../../edit/ICoEdit";
import { ICoUI } from "../../voxui/ICoUI";
import { ICoTexture } from "../../voxtexture/ICoTexture";
import { ICoUIScene } from "../../voxui/scene/ICoUIScene";
import { ICoRScene } from "../../voxengine/ICoRScene";

import { ICoUIInteraction } from "../../voxengine/ui/ICoUIInteraction";
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
import { PostOutline } from "./effect/PostOutline";
import { TransUI } from "./edit/ui/TransUI";
import { NavigationUI } from "./edit/ui/NavigationUI";
import { RectTextTip } from "../../voxui/entity/RectTextTip";

declare var CoRenderer: ICoRenderer;
declare var CoRScene: ICoRScene;
declare var CoUIInteraction: ICoUIInteraction;
declare var CoMath: ICoMath;
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
export class DemoTransEditor {
	private m_rsc: ICoRendererScene = null;
	private m_editUIRenderer: ICoRendererScene = null;
	private m_uirsc: IRendererScene = null;
	private m_coUIScene: ICoUIScene = null;
	private m_interact: IMouseInteraction = null;
	private m_transUI = new TransUI();
	private m_nvaUI = new NavigationUI();

	private m_vcoapp: ViewerCoSApp;
	private m_vmctx: ViewerMaterialCtx;
	private m_outline: PostOutline;
	private m_scale = 20.0;

	constructor() { }

	initialize(): void {


		document.oncontextmenu = function (e) {
			e.preventDefault();
		}

		console.log("DemoTransEditor::initialize() ...");

		this.initEngineModule();
	}
	private initEngineModule(): void {

		// let url = "static/cospace/engine/mouseInteract/CoMouseInteraction.umd.js";
		let url = "static/cospace/engine/uiInteract/CoUIInteraction.umd.js";
		let uiInteractML = new ModuleLoader(2, (): void => {
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

						this.initEditUI();

						// this.createEditEntity();
						// this.initUI();
					}).load(url3).load(url4).load(url6).load(url7).load(url9).load(url10);

				}).load(url2).load(url5).load(url8);

				this.m_vcoapp = new ViewerCoSApp();
				this.m_vcoapp.initialize((): void => {
					this.loadOBJ();
				});
			}
		}).addLoader(uiInteractML)
			.load(url0)
			.load(url1);

		uiInteractML.load(url);
	}
	private m_tip: RectTextTip = null;
	private initEditUI(): void {

		this.m_coUIScene = CoUI.createUIScene();
		this.m_coUIScene.initialize();
		this.m_uirsc = this.m_coUIScene.rscene;
		this.m_graph.addScene(this.m_uirsc);

		let tip = new RectTextTip();
		tip.initialize(this.m_coUIScene, 1);
		this.m_tip = tip;


		this.m_transUI.setOutline( this.m_outline );
		this.m_transUI.initialize(this.m_rsc, this.m_editUIRenderer, this.m_coUIScene);

		this.m_nvaUI.initialize(this.m_rsc, this.m_editUIRenderer, this.m_coUIScene);

		let minV = CoMath.createVec3(-100, 0, -100);
		let maxV = minV.clone().scaleBy(-1);
		let scale = 10.0
		let grid = CoEdit.createFloorLineGrid();
		grid.initialize(this.m_rsc, 0, minV.scaleBy(scale), maxV.scaleBy(scale), 30);
		
	}

	private createDefaultEntity(): void {

		// let axis = CoRScene.createAxis3DEntity();
		// this.m_rsc.addEntity(axis);

		/*
		let texList = [this.createTexByUrl()];
		let material = CoRScene.createDefaultMaterial();
		material.setTextureList(texList);
		let entity = CoRScene.createDisplayEntity();
		entity.setMaterial(material);
		entity.copyMeshFrom(this.m_rsc.entityBlock.unitXOZPlane);
		entity.setScaleXYZ(700.0, 0.0, 700.0);
		this.m_rsc.addEntity(entity);
		//*/
	}
	private initScene(): void {
		this.createDefaultEntity();

	}
	isEngineEnabled(): boolean {
		return typeof CoRenderer !== "undefined" && typeof CoRScene !== "undefined";
	}
	private initInteract(): void {

		let r = this.m_rsc;
		if (r != null && this.m_interact == null && typeof CoUIInteraction !== "undefined") {

			this.m_interact = CoUIInteraction.createMouseInteraction();
			this.m_interact.initialize(this.m_rsc, 2, true);
			this.m_interact.setSyncLookAtEnabled(true);
		}
	}

	private m_graph: RendererSceneGraph = null;
	private initRenderer(): void {

		if (this.m_rsc == null) {

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

			rscene.addEventListener(CoRScene.MouseEvent.MOUSE_BG_DOWN, this, this.mouseDownListener);

			// rscene.addEventListener(CoRScene.KeyboardEvent.KEY_DOWN, this, this.keyDown);
			// rscene.addEventListener(CoRScene.MouseEvent.MOUSE_BG_CLICK, this, this.mouseClickListener);
			// rscene.addEventListener(CoRScene.MouseEvent.MOUSE_UP, this, this.mouseUpListener, true, true);

			this.m_rsc = rscene;

			let subScene = this.m_rsc.createSubScene(rparam, 3, false);
			subScene.enableMouseEvent(true);
			subScene.setAccessor(new SceneAccessor());

			this.m_editUIRenderer = subScene;
			this.m_graph = new RendererSceneGraph();
			this.m_graph.addScene(this.m_rsc);
			this.m_graph.addScene(this.m_editUIRenderer);
			this.m_outline = new PostOutline(rscene);

		}
	}

	private mouseDownListener(evt: any): void {
		console.log("DemoTransEditor::mouseDownListener() ...");
		this.m_tip.setText("hello-boy");
		this.m_tip.setVisible(true);
	}
	private keyDown(evt: any): void {

		console.log("DemoTransEditor::keyDown() ..., evt.keyCode: ", evt.keyCode);

		let KEY = CoRScene.Keyboard;
		switch (evt.keyCode) {
			case KEY.S:
				break;
			default:
				break;
		}
	}
	private loadOBJ(): void {

		let baseUrl: string = "static/private/obj/";
		let url = baseUrl + "base.obj";
		url = baseUrl + "base4.obj";
		console.log("loadOBJ() init...");
		this.loadGeomModel(url, CoDataFormat.OBJ);
	}

	private loadGeomModel(url: string, format: CoDataFormat): void {
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

		// this.m_recoder.save(this.m_entities);
		this.m_transUI.getRecoder().save(this.m_entities);
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
		this.m_rsc.addEntity(entity);

		entity.addEventListener(MouseEvent.MOUSE_OVER, this, this.mouseOverTargetListener);
		entity.addEventListener(MouseEvent.MOUSE_OUT, this, this.mouseOutTargetListener);
		entity.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDownTargetListener);
		entity.addEventListener(MouseEvent.MOUSE_UP, this, this.mouseUpTargetListener);

		this.m_entities.push(entity);
		return entity;
	}

	private mouseOverTargetListener(evt: any): void {
		console.log("mouseOverTargetListener()..., evt.target: ", evt.target);
	}
	private mouseOutTargetListener(evt: any): void {
		console.log("mouseOutTargetListener()..., evt.target: ", evt.target);
	}
	private mouseDownTargetListener(evt: any): void {
		console.log("mouseDownTargetListener()..., evt.target: ", evt.target);
		let entity = evt.target as ITransformEntity;
		// this.selectEntities([entity]);
		this.m_transUI.selectEntities([entity]);
	}
	private mouseUpTargetListener(evt: any): void {
		console.log("mouseUpTargetListener() mouse up...");
		// if (this.m_transCtr != null) {
		// 	this.m_transCtr.enable(this.m_ctrlType);
		// }
	}

	run(): void {
		if (this.m_graph != null) {
			if (this.m_interact != null) {
				this.m_interact.run();
			}
			if (this.m_transUI != null) {
				this.m_transUI.run();
			}
			this.m_graph.run();
		}
	}
}

export default DemoTransEditor;
