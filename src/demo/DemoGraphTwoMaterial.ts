import RendererDevice from "../vox/render/RendererDevice";
import RendererParam from "../vox/scene/RendererParam";

import DisplayEntity from "../vox/entity/DisplayEntity";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import RendererScene from "../vox/scene/RendererScene";
import DivLog from "../vox/utils/DivLog";
import MouseEvent from "../vox/event/MouseEvent";
import Default3DMaterial from "../vox/material/mcase/Default3DMaterial";
import Box3DEntity from "../vox/entity/Box3DEntity";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";
import { MouseInteraction } from "../vox/ui/MouseInteraction";
import DebugFlag from "../vox/debug/DebugFlag";
import VtxDrawingInfo from "../vox/render/vtx/VtxDrawingInfo";
import DefaultPassGraph from "../vox/render/pass/DefaultPassGraph";
import SigleMaterialPassItem from "./pass/SigleMaterialPassItem";
import TwoTexMaterial from "./pass/materials/multiTex/TwoTexMaterial";
import Sphere3DEntity from "../vox/entity/Sphere3DEntity";
import IRenderTexture from "../vox/render/texture/IRenderTexture";
import RendererState from "../vox/render/RendererState";
import { CullFaceMode, DepthTestMode, RenderBlendMode } from "../vox/render/RenderConst";
import Plane3DEntity from "../vox/entity/Plane3DEntity";

export class DemoGraphTwoMaterial {
	private m_init = true;
	private m_texLoader: ImageTextureLoader = null;
	private m_rscene: RendererScene = null;
	private m_autoRunning = true;
	constructor() { }

	private getTexByUrl(purl: string, preAlpha: boolean =false, wrapRepeat: boolean = true, mipmapEnabled = true): IRenderTexture {
		let tex = this.m_texLoader.getTexByUrl(purl, wrapRepeat, mipmapEnabled);
		tex.premultiplyAlpha = preAlpha;
		return tex;
	}

	private initEvent(rscene: RendererScene): void {
		rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDownListener, true, false);
		rscene.addEventListener(MouseEvent.MOUSE_RIGHT_DOWN, this, this.RMouseDownListener, true, false);
		rscene.addEventListener(MouseEvent.MOUSE_MIDDLE_DOWN, this, this.MMouseDownListener, true, false);
	}
	initialize(): void {
		console.log("DemoGraphTwoMaterial::initialize()......");
		if (this.m_init) {
			this.m_init = false;

			document.oncontextmenu = function (e) {
				e.preventDefault();
			}

			RendererDevice.SHADERCODE_TRACE_ENABLED = true;
			RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;
			DivLog.SetDebugEnabled(false);

			let rparam = new RendererParam();
			
			// rparam.maxWebGLVersion = 1;
			rparam.setCamProject(45, 50.0, 6000.0);
			rparam.setCamPosition(1100.0, 1100.0, 1100.0);
			rparam.setAttriAlpha(true);
			rparam.setAttriAntialias(true);
			
			let rscene = new RendererScene();
			// rscene.initialize(rparam).setAutoRunning(true);
			rscene.initialize(rparam, 3);
			rscene.setAutoRunning(this.m_autoRunning);
			// rscene.setRendererProcessParam(1, false, false);
			
            // rscene.setAutoRenderingSort(true);
            // rscene.setProcessSortEnabledAt(1, true);
			
			this.m_rscene = rscene;
			this.m_texLoader = new ImageTextureLoader(rscene.textureBlock);

			new MouseInteraction().initialize(rscene, 0, true).setAutoRunning(true);
			new RenderStatusDisplay(rscene, true);

			this.initScene(rscene);
			this.initEvent(rscene);
		}
	}
	private m_tarEntity: DisplayEntity = null;
	private m_tarREntity: DisplayEntity = null;
	private m_tarMEntity: DisplayEntity = null;
	private createVtxInfo(): VtxDrawingInfo {
		// return null;
		return new VtxDrawingInfo();
	}
	private testDataMesh(rscene: RendererScene): void {
		// 推荐的模型数据组织形式
		console.log("XXX ------------ XXXXXXXXXX testDataMesh XXXXXXXXXXXX ------------ XXX");
		let staticVtx = false;
		let alpha = 0.3;
		let material = new Default3DMaterial();
		// material.setAlpha(alpha);
		material.normalEnabled = true;
		material.setTextureList([this.getTexByUrl("static/assets/box.jpg")]);
		// material.setTextureList([this.getTexByUrl("static/assets/color_07.jpg")]);

		let sph = new Sphere3DEntity();
		sph.setMaterial(material);
		sph.initialize(16, 20, 20);
		let mesh = sph.getMesh();
		/**
		let nvs = new Float32Array([0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0]);
		let uvs = new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]);
		let vs = new Float32Array([10, 0, -10, -10, 0, -10, -10, 0, 10, 10, 0, 10]);
		let ivs = new Uint16Array([0, 1, 2, 0, 2, 3]);
		let model: IGeomModelData = {
			vertices: vs,
			uvsList: [uvs],
			normals: nvs,
			indices: ivs,
			wireframe: false
		};
		let mesh = MeshFactory.createDataMeshFromModel(model);
		// */
		let st0 = RendererState.CreateRenderState("ADD01", CullFaceMode.BACK, RenderBlendMode.ADD, DepthTestMode.BLEND);
		let st1 = RendererState.CreateRenderState("ADD02", CullFaceMode.BACK, RenderBlendMode.BLAZE, DepthTestMode.TRUE_LEQUAL);

		// 0, 1, 1, 2, 2, 0, 0, 2, 2, 3, 3, 0
		// 0, 1, 1, 2, 2, 0, 0, 2, 2, 3, 3, 0
		
		let st = this.m_rscene.getRenderProxy().renderingState;
		let item0 = new SigleMaterialPassItem();
		item0.renderState = st.NORMAL_STATE;
		let itemMaterial = new Default3DMaterial();
		itemMaterial.normalEnabled = true;
		itemMaterial.setTextureList([this.getTexByUrl("static/assets/color_07.jpg")]);
		// itemMaterial.initializeByCodeBuf(true);
		item0.material = itemMaterial;
		let item1 = new SigleMaterialPassItem();
		// item1
		item1.renderState = st1;//st.BACK_ADD_ALWAYS_STATE;
		let itemMaterial1 = new TwoTexMaterial();
		// let itemMaterial1 = new Default3DMaterial();
		itemMaterial1.name = "xxx";
		itemMaterial1.normalEnabled = true;
		itemMaterial1.setTextureList([
			this.getTexByUrl("static/assets/yanj.jpg"),
			this.getTexByUrl("static/assets/heightMap04.jpg")
		]);
		// itemMaterial1.initializeByCodeBuf(true);

		item1.material = itemMaterial1;
		let scale = 10;
		let graph = new DefaultPassGraph().addItem(item0).addItem(item1).initialize();
		// let graph = new DefaultPassGraph().addItem(item1).initialize();
		// let graph = new DefaultPassGraph().addItem(item0).initialize();
		material.graph = graph;
		// let scale = 10.0;
		let entity = new DisplayEntity();
		// entity.setRenderState(st.BACK_TRANSPARENT_STATE);
		if(material.graph != null) {
			entity.setMaterial(material);
		}else {
			entity.setMaterial(itemMaterial1);
		}
		entity.setMesh(mesh);
		entity.setScaleXYZ(scale, scale, scale);
		rscene.addEntity(entity, 1);
		this.m_tarEntity = entity;

	}
	
	private initScene(rscene: RendererScene): void {
		// this.initEntitys(rscene);
		this.testDataMesh(rscene);
	}
	private m_flag = true;
	private m_RFlag = true;
	private m_MFlag = true;
	private m_index = 0;
	mouseDownListener(evt: any): void {

		// this.m_autoRunning = !this.m_autoRunning;
		// this.m_rscene.setAutoRunning(this.m_autoRunning);
		// DebugFlag.Flag_0 = 1;
		// console.log("############### mouse down");
		return;
		if (this.m_tarEntity != null) {
			let material = this.m_tarEntity.getMaterial();
			// let graph = material.graph;
			// if (graph) {
			// 	let t = graph.isEnabled() ? graph.disable() : graph.enable();
			// }
			// return;
			let vtxInfo = material.vtxInfo;
			// return;
			if (this.m_tarEntity && vtxInfo) {
				// vtxInfo.applyIvsDataAt( 1 );
				// vtxInfo.applyIvsDataAt((this.m_index++) % 9);
				vtxInfo.setWireframe(this.m_flag);
				// vtxInfo.setWireframe(Math.random() > -0.5);
				// if(this.m_flag) {
				// 	vtxInfo.setIvsParam(0,3);
				// }else {
				// 	vtxInfo.setIvsParam(0,6);
				// }
				this.m_flag = !this.m_flag;
			}
		}
	}
	MMouseDownListener(evt: any): void {

		console.log("middle mouse down, this.m_tarMEntity != null: ", this.m_tarMEntity != null);
		if (this.m_tarMEntity) {
			let material = this.m_tarMEntity.getMaterial();
			let vtxInfo = material.vtxInfo;
			if (this.m_tarMEntity && vtxInfo) {
				vtxInfo.setWireframe(this.m_MFlag);
				// if(this.m_MFlag) {
				// 	vtxInfo.setIvsParam(0,3);
				// }else {
				// 	vtxInfo.setIvsParam(0,6);
				// }
			}
			this.m_MFlag = !this.m_MFlag;
		}
	}
	RMouseDownListener(evt: any): void {

		console.log("right mouse down");
		if (this.m_tarREntity != null) {
			// this.m_tarREntity.setIvsParam(0, 3);
			let material = this.m_tarREntity.getMaterial();

			let vtxInfo = material.vtxInfo;
			if (this.m_tarREntity && vtxInfo) {
				// vtxInfo.setWireframe(this.m_RFlag);
				vtxInfo.applyIvsDataAt(this.m_RFlag ? 1 : 0);
				// if(this.m_RFlag) {
				// 	vtxInfo.setIvsParam(0,3);
				// }else {
				// 	vtxInfo.setIvsParam(0,6);
				// }
			}
			this.m_RFlag = !this.m_RFlag;
		}
	}

	private initEntitys(rscene: RendererScene): void {

		// let axis = new Axis3DEntity();
		// axis.initialize();
		// rscene.addEntity(axis);

		let plane = new Plane3DEntity();
		plane.normalEnabled = true;
		// plane.wireframe = true;
		plane.initializeXOZSquare(500, [this.getTexByUrl("static/assets/box.jpg")]);
		this.m_rscene.addEntity( plane, 2 );

		// return;
		let box0 = new Box3DEntity();
		box0.normalEnabled = true;
		box0.wireframe = true;
		// box0.shape = false;
		box0.setXYZ(150, 0, 0);
		//		material.setTextureList([this.getTexByUrl("static/assets/redTransparent.png", true)]);
		box0.initializeCube(100, [this.getTexByUrl("static/assets/box.jpg")]);
		rscene.addEntity(box0, 2);
		this.m_tarMEntity = box0;
	}
	// run(): void {

	// 	if (this.m_rscene != null) {
	// 		// console.log(">>> begin");
	// 		this.m_rscene.run();
	// 		// if(DebugFlag.Flag_0 > 0) {
	// 		// 	this.m_rscene.run();
	// 		// }
	// 		// console.log(">>> end");
	// 		DebugFlag.Flag_0 = 0;
	// 	}
	// }
}
export default DemoGraphTwoMaterial;
