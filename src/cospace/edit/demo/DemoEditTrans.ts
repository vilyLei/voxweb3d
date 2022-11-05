import { IMouseInteraction } from "../../voxengine/ui/IMouseInteraction";
import { ICoRenderer } from "../../voxengine/ICoRenderer";
import { ICoMath } from "../../math/ICoMath";
import { ICoAGeom } from "../../ageom/ICoAGeom";
import { ICoEdit } from "../../edit/ICoEdit";
import { ICoUI } from "../../voxui/ICoUI";
import { ICoTexture } from "../../voxtexture/ICoTexture";
import { ICoUIScene } from "../../voxui/scene/ICoUIScene";
import { CoMaterialContextParam, ICoRScene } from "../../voxengine/ICoRScene";

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
import { TransformController } from "../transform/TransformController";
import { UserEditEvent } from "../event/UserEditEvent";
import { IButton } from "../../voxui/button/IButton";
import { IClipLabel } from "../../voxui/entity/IClipLabel";
import { PostOutline } from "./effect/PostOutline";
import { UIRectLine } from "./edit/UIRectLine";
import { IClipEntity } from "../../voxui/entity/IClipEntity";
import { IColorClipLabel } from "../../voxui/entity/IColorClipLabel";
import { RectFrameQuery } from "./edit/RectFrameQuery";
import IRenderEntity from "../../../vox/render/IRenderEntity";
import { ICoKeyboardInteraction } from "../../voxengine/ui/ICoKeyboardInteraction";
import { CoKeyboardInteraction } from "../../voxengine/ui/CoKeyboardInteraction";
import { ICoTransformRecorder } from "../recorde/ICoTransformRecorder";
import { CoTransformRecorder } from "../recorde/CoTransformRecorder";

declare var CoRenderer: ICoRenderer;
declare var CoRScene: ICoRScene;
declare var CoUIInteraction: ICoUIInteraction;
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
	private m_renderer: IRendererScene = null;
	private m_editUIRenderer: IRendererScene = null;
	private m_uiRenderer: IRendererScene = null;
	private m_coUIScene: ICoUIScene = null;
	private m_interact: IMouseInteraction = null;

	private m_vcoapp: ViewerCoSApp;
	private m_vmctx: ViewerMaterialCtx;
	private m_outline: PostOutline;
	private m_scale = 20.0;

	constructor() { }

	initialize(): void {


		document.oncontextmenu = function (e) {
			e.preventDefault();
		}

		console.log("DemoEditTrans::initialize() ...");

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
						this.createEditEntity();
						this.initUI();
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
	private m_transCtr: TransformController = null;
	private m_selectFrame: UIRectLine = null;
	private m_keyInterac: ICoKeyboardInteraction;	
    private m_recoder: ICoTransformRecorder;
	private createEditEntity(): void {

		let editsc = this.m_editUIRenderer;

		this.m_transCtr = new TransformController();
		this.m_transCtr.initialize(editsc);
		this.m_transCtr.addEventListener(UserEditEvent.EDIT_BEGIN, this, this.editBegin);
		this.m_transCtr.addEventListener(UserEditEvent.EDIT_END, this, this.editEnd);
		this.m_prevPos = CoMath.createVec3();
		this.m_currPos = CoMath.createVec3();

		this.m_keyInterac = new CoKeyboardInteraction();
		this.m_keyInterac.initialize( this.m_renderer );
		
		let Key = CoRScene.Keyboard;
		let type = this.m_keyInterac.createKeysEventType([Key.CTRL, Key.Y]);
		this.m_keyInterac.addKeysDownListener(type, this, this.keyCtrlYDown);
		type = this.m_keyInterac.createKeysEventType([Key.CTRL, Key.Z]);
		this.m_keyInterac.addKeysDownListener(type, this, this.keyCtrlZDown);

		this.m_recoder = new CoTransformRecorder();
	}
	
    private keyCtrlZDown(evt: any): void {
        console.log("DemoEditTrans::keyCtrlZDown() ..., evt.keyCode: ", evt.keyCode);
        this.m_recoder.undo();
        let list = this.m_recoder.getCurrList();
		this.selectEntities( list );
    }
    private keyCtrlYDown(evt: any): void {
        console.log("DemoEditTrans::keyCtrlYDown() ..., evt.keyCode: ", evt.keyCode);
        this.m_recoder.redo();
        let list = this.m_recoder.getCurrList();
		this.selectEntities( list );
    }
	private m_prevPos: IVector3D;
	private m_currPos: IVector3D;
	private editBegin(evt: any): void {
		// this.m_transCtr
		// console.log("XXXXXXXX Edit begin...");
		let st = this.m_renderer.getStage3D();
		this.m_prevPos.setXYZ(st.mouseX, st.mouseY, 0);
	}
	private editEnd(evt: any): void {
		// console.log("XXXXXXXX Edit end...");
		let st = this.m_renderer.getStage3D();
		this.m_currPos.setXYZ(st.mouseX, st.mouseY, 0);
		if (CoMath.Vector3D.Distance(this.m_prevPos, this.m_currPos) > 0.5) {

			console.log("XXXXXXXX Edit transforming success ...");
			let list = evt.currentTarget.getTargetEntities();
			// let list = tar.getTargets();
			console.log("XXXXXXXX Edit transforming entity list: ", list);
			this.m_recoder.save( list );

		}
	}
	private m_transBtns: IButton[] = [];
	private initUI(): void {

		this.m_coUIScene = CoUI.createUIScene();
		this.m_coUIScene.initialize();
		this.m_uiRenderer = this.m_coUIScene.rscene;
		this.m_graph.addScene(this.m_uiRenderer);

		this.m_entityQuery = new RectFrameQuery();
		this.m_entityQuery.initialize(this.m_renderer);

		let rsc = this.m_uiRenderer;
		this.m_renderer.addEventListener(CoRScene.MouseEvent.MOUSE_BG_DOWN, this, this.uiMouseDownListener);
		rsc.addEventListener(CoRScene.MouseEvent.MOUSE_UP, this, this.uiMouseUpListener);
		rsc.addEventListener(CoRScene.MouseEvent.MOUSE_MOVE, this, this.uiMouseMoveListener);

		let uiScene = this.m_coUIScene;

		if (this.m_selectFrame == null) {
			this.m_selectFrame = new UIRectLine();
			this.m_selectFrame.initialize(this.m_uiRenderer);
			this.m_selectFrame.enable();
		}

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

		///*		
		let btnUrls = [urls[0], urls[1], urls[2], urls[1]];
		btnUrls = urls;
		let csLable = CoUI.createClipLabel();
		csLable.initialize(texAtlas, urls);

		let px = 10;
		let py = 300;
		let selectBtn = this.crateBtn(urls, px, py - (5 + csLable.getClipHeight()) * 0, 0, "select");
		let moveBtn = this.crateBtn(urls, px, py - (5 + csLable.getClipHeight()) * 1, 1, "move");
		let scaleBtn = this.crateBtn(urls, px, py - (5 + csLable.getClipHeight()) * 2, 2, "scale");
		let rotateBtn = this.crateBtn(urls, px, py - (5 + csLable.getClipHeight()) * 3, 3, "rotate");
		this.m_transBtns = [moveBtn, scaleBtn, rotateBtn];
		//*/

		this.selectBtn(moveBtn);
		// this.m_transCtr.enable(this.m_ctrlType);
		this.m_transCtr.toTranslation();
	}
	private uiMouseDownListener(evt: any): void {

		this.m_selectFrame.begin(evt.mouseX, evt.mouseY);
		// console.log("DemoEditTrans::uiMouseDownListener(), evt: ", evt);
		// console.log("ui down (x, y): ", evt.mouseX, evt.mouseY);
	}
	private uiMouseUpListener(evt: any): void {
		// console.log("DemoEditTrans::uiMouseUpListener(), evt: ", evt);
		// console.log("ui up (x, y): ", evt.mouseX, evt.mouseY);
		if (this.m_selectFrame.isSelectEnabled()) {
			let b = this.m_selectFrame.bounds;
			let list = this.m_entityQuery.getEntities(b.min, b.max);
			this.selectEntities(list);
		}
		this.m_selectFrame.end(evt.mouseX, evt.mouseY);
	}
	private uiMouseMoveListener(evt: any): void {
		// console.log("DemoEditTrans::uiMouseMoveListener(), evt: ", evt);
		// console.log("ui move (x, y): ", evt.mouseX, evt.mouseY);
		this.m_selectFrame.move(evt.mouseX, evt.mouseY);
	}
	private m_currBtn: IButton = null;

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
		this.m_coUIScene.addEntity(btn, 1);
		btn.addEventListener(CoRScene.MouseEvent.MOUSE_UP, this, this.btnMouseUpListener);

		return btn;
	}

	private selectBtn(btn: IButton): void {

		let label: IColorClipLabel;

		if (this.m_currBtn != btn) {

			label = btn.getLable() as IColorClipLabel;
			label.getColorAt(0).setRGB3f(0.5, 0.8, 0.6);
			label.setClipIndex(0);

			if (this.m_currBtn != null) {
				label = this.m_currBtn.getLable() as IColorClipLabel;
				label.getColorAt(0).setRGB3f(0.0, 0.8, 0.8);
				label.setClipIndex(0);
			}

			this.m_currBtn = btn;
		}
	}
	private btnMouseUpListener(evt: any): void {

		console.log("btnMouseUpListener(), evt.currentTarget: ", evt.currentTarget);
		let uuid = evt.uuid;
		switch (uuid) {

			case "move":
				this.m_transCtr.toTranslation();
				break;

			case "scale":
				this.m_transCtr.toScale();
				break;

			case "rotate":
				this.m_transCtr.toRotation();
				this
				break;

			case "select":

				// this.m_selectFrame.enable();
				break;
			default:
				break;
		}

		this.selectBtn(evt.currentTarget as IButton);
	}
	private createDefaultEntity(): void {

		// let axis = CoRScene.createAxis3DEntity();
		// this.m_renderer.addEntity(axis);

		/*
		let texList = [this.createTexByUrl()];
		let material = CoRScene.createDefaultMaterial();
		material.setTextureList(texList);
		let entity = CoRScene.createDisplayEntity();
		entity.setMaterial(material);
		entity.copyMeshFrom(this.m_renderer.entityBlock.unitXOZPlane);
		entity.setScaleXYZ(700.0, 0.0, 700.0);
		this.m_renderer.addEntity(entity);
		//*/
	}
	private initScene(): void {
		this.createDefaultEntity();

	}
	isEngineEnabled(): boolean {
		return typeof CoRenderer !== "undefined" && typeof CoRScene !== "undefined";
	}

	private createTexByUrl(url: string = ""): IRenderTexture {

		let tex = this.m_renderer.textureBlock.createImageTex2D(64, 64, false);

		// this.m_plane = new Plane3DEntity();
		// this.m_plane.initializeXOZ(-400.0, -400.0, 800.0, 800.0, [tex]);
		// this.m_renderer.addEntity(this.m_plane);

		let img = new Image();
		img.onload = (evt: any): void => {
			tex.setDataFromImage(img, 0, 0, 0, false);
		}
		img.src = url != "" ? url : "static/assets/box.jpg";
		return tex;
	}

	private initInteract(): void {
		let r = this.m_renderer;
		if (r != null && this.m_interact == null && typeof CoUIInteraction !== "undefined") {

			this.m_interact = CoUIInteraction.createMouseInteraction();
			this.m_interact.initialize(this.m_renderer, 2, true);
			this.m_interact.setSyncLookAtEnabled(true);
		}
	}

	private m_graph: RendererSceneGraph = null;
	private initRenderer(): void {

		if (this.m_renderer == null) {

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

			// rscene.addEventListener(CoRScene.MouseEvent.MOUSE_BG_DOWN, this, this.mouseBgDownListener);
			rscene.addEventListener(CoRScene.KeyboardEvent.KEY_DOWN, this, this.keyDown);
			rscene.addEventListener(CoRScene.MouseEvent.MOUSE_BG_CLICK, this, this.mouseClickListener);
			rscene.addEventListener(CoRScene.MouseEvent.MOUSE_UP, this, this.mouseUpListener, true, true);

			this.m_renderer = rscene;

			let subScene = this.m_renderer.createSubScene(rparam, 3, false);
			subScene.enableMouseEvent(true);
			subScene.setAccessor(new SceneAccessor());

			this.m_editUIRenderer = subScene;
			this.m_graph = new RendererSceneGraph();
			this.m_graph.addScene(this.m_renderer);
			this.m_graph.addScene(this.m_editUIRenderer);
			this.m_outline = new PostOutline(rscene);

		}
	}
	
    private keyDown(evt: any): void {

        console.log("DemoEditTrans::keyDown() ..., evt.keyCode: ", evt.keyCode);

		let KEY = CoRScene.Keyboard;
		switch(evt.keyCode) {
			case KEY.W:
				this.selectBtn(	this.m_transBtns[0] );
				this.m_transCtr.toTranslation();
				break;
			case KEY.E:
				this.selectBtn(	this.m_transBtns[1] );
				this.m_transCtr.toScale();
				break;				
			case KEY.R:
				this.selectBtn(	this.m_transBtns[2] );
				this.m_transCtr.toRotation();
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
		
        this.m_recoder.save( this.m_entities );
	}
	private m_entityQuery: RectFrameQuery = null;
	private m_entities: ITransformEntity[] = [];
	private createEntity(model: CoGeomDataType): ITransformEntity {
		// let rst = CoRenderer.RendererState;

		const MouseEvent = CoRScene.MouseEvent;
		// let material = new CoNormalMaterial().build().material;
		let material = CoRScene.createDefaultMaterial(true);
		material.initializeByCodeBuf(false);
		material.setRGB3f(0.7, 0.7, 0.7);

		// let mesh = CoRScene.createDataMeshFromModel(model, material);
		// let cv = mesh.bounds.center.clone();
		// let vs = model.vertices;
		// let tot = vs.length;
		// for (let i = 0; i < tot;) {
		// 	vs[i++] -= cv.x;
		// 	vs[i++] -= cv.y;
		// 	vs[i++] -= cv.z;
		// }
		// cv.scaleBy(this.m_scale);

		let mesh = CoRScene.createDataMeshFromModel(model, material);
		let entity = CoRScene.createMouseEventEntity();
		entity.setMaterial(material);
		entity.setMesh(mesh);
		// entity.setPosition(cv);
		// entity.setRenderState(rst.NONE_CULLFACE_NORMAL_STATE);
		this.m_renderer.addEntity(entity);

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
		this.selectEntities([entity]);
	}
	private selectEntities(list: IRenderEntity[]): void {

		if(list != null && list.length > 0) {
			let transCtr = this.m_transCtr;

			let pos = CoMath.createVec3();
			let pv = CoMath.createVec3();

			for (let i = 0; i < list.length; ++i) {
				pos.addBy( list[i].getPosition(pv) );
			}
			pos.scaleBy(1.0 / list.length);
			
			if (transCtr != null) {
				transCtr.select(list as ITransformEntity[], pos);
				this.m_outline.select(list);
			}
		}
	}
	private mouseUpTargetListener(evt: any): void {
		console.log("mouseUpTargetListener() mouse up...");
		// if (this.m_transCtr != null) {
		// 	this.m_transCtr.enable(this.m_ctrlType);
		// }
	}
	private m_selectFlag: boolean = false;
	private mouseUpListener(evt: any): void {

		// console.log("DemoEditTrans::mouseUpListener() ...");
		if (this.m_transCtr != null) {
			this.m_transCtr.decontrol();
		}
	}
	private mouseClickListener(evt: any): void {

		if (this.m_transCtr != null) {
			this.m_transCtr.disable();
		}
		this.m_outline.deselect();
	}

	run(): void {
		if (this.m_graph != null) {
			if (this.m_interact != null) {
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
