import RendererDevice from "../vox/render/RendererDevice";
import RendererParam from "../vox/scene/RendererParam";

import DisplayEntity from "../vox/entity/DisplayEntity";
import TextureProxy from "../vox/texture/TextureProxy";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import RendererScene from "../vox/scene/RendererScene";
import DivLog from "../vox/utils/DivLog";
import MouseEvent from "../vox/event/MouseEvent";
import Default3DMaterial from "../vox/material/mcase/Default3DMaterial";
import IGeomModelData from "../vox/mesh/IGeomModelData";
import MeshFactory from "../vox/mesh/MeshFactory";
import Box3DEntity from "../vox/entity/Box3DEntity";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";
import Axis3DEntity from "../vox/entity/Axis3DEntity";
import { MouseInteraction } from "../vox/ui/MouseInteraction";

import { EntityLayouter } from "../vox/utils/EntityLayouter";
import { CoGeomDataType, CoModelTeamLoader } from "../cospace/app/common/CoModelTeamLoader";
import Vector3D from "../vox/math/Vector3D";
import Matrix4 from "../vox/math/Matrix4";
import RendererState from "../vox/render/RendererState";
export class DemoVtxMultiRDP {
	private m_init = true;
	private m_texLoader: ImageTextureLoader = null;
	private m_teamLoader = new CoModelTeamLoader();
	private m_layouter = new EntityLayouter();
	private m_rscene: RendererScene = null;
	constructor() { }

	private getTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): TextureProxy {
		return this.m_texLoader.getTexByUrl(purl, wrapRepeat, mipmapEnabled) as TextureProxy;
	}

	private initEvent(rscene: RendererScene): void {
		rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDownListener, true, false);
		rscene.addEventListener(MouseEvent.MOUSE_RIGHT_DOWN, this, this.RMouseDownListener, true, false);
		rscene.addEventListener(MouseEvent.MOUSE_MIDDLE_DOWN, this, this.MMouseDownListener, true, false);
	}
	initialize(): void {
		console.log("DemoVtxMultiRDP::initialize()......");
		if (this.m_init) {
			this.m_init = false;

			document.oncontextmenu = function (e) {
				e.preventDefault();
			}

			RendererDevice.SHADERCODE_TRACE_ENABLED = false;
			RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
			DivLog.SetDebugEnabled(false);

			let rparam = new RendererParam();
			// rparam.maxWebGLVersion = 1;
			rparam.setCamProject(45, 0.1, 6000.0);
			rparam.setCamPosition(1100.0, 1100.0, 1100.0);
			let rscene = new RendererScene();
			// rscene.initialize(rparam).setAutoRunning(true);
			rscene.initialize(rparam);
			this.m_rscene = rscene;
			this.m_texLoader = new ImageTextureLoader(rscene.textureBlock);

			new MouseInteraction().initialize(rscene, 0, true).setAutoRunning(true);
			new RenderStatusDisplay(rscene, true);

			this.initScene(rscene);
			this.initEvent(rscene);
			// this.initObjs(rscene);
		}
	}
	private initObjs(rscene: RendererScene): void {

		let url0 = "static/assets/fbx/face4Parts.fbx";
		let loader = this.m_teamLoader;

		loader.load([url0], (models: CoGeomDataType[], transforms: Float32Array[]): void => {

			this.m_layouter.layoutReset();
			for (let i = 0; i < models.length; ++i) {
				this.createEntity(rscene, models[i], transforms != null ? transforms[i] : null, 1.0);
			}
			this.m_layouter.layoutUpdate(300, new Vector3D(0, 0, 0));

		});
	}

	protected createEntity(rscene: RendererScene, model: CoGeomDataType, transform: Float32Array = null, uvScale: number = 1.0): DisplayEntity {
		if (model != null) {
			console.log("createEntity(), model: ", model);

			let material = new Default3DMaterial();
			material.normalEnabled = true;
			material.setUVScale(uvScale, uvScale);
			material.setTextureList([
				this.getTexByUrl("static/assets/effectTest/metal_01_COLOR.png")
			]);

			let mesh = MeshFactory.createDataMeshFromModel(model, material);
			let entity = new DisplayEntity();
			entity.setRenderState(RendererState.NONE_CULLFACE_NORMAL_STATE);
			entity.setMesh(mesh);
			entity.setMaterial(material);

			rscene.addEntity(entity);
			this.m_layouter.layoutAppendItem(entity, new Matrix4(transform));
			return entity;
		}
	}

	private m_tarEntity: DisplayEntity = null;
	private m_tarREntity: DisplayEntity = null;
	private m_tarMEntity: DisplayEntity = null;
	private testDataMesh(rscene: RendererScene): void {
		// 推荐的模型数据组织形式
		console.log("XXX ------------ XXXXXXXXXX testDataMesh XXXXXXXXXXXX ------------ XXX");
		let staticVtx = true;
		let material = new Default3DMaterial();
		if (staticVtx) material.vtxInfo.toStatic();
		// material.normalEnabled = true;
		material.setTextureList([this.getTexByUrl("static/assets/box.jpg")]);

		let nvs = new Float32Array([0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0]);
		let uvs = new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]);
		let vs = new Float32Array([10, 0, -10, -10, 0, -10, -10, 0, 10, 10, 0, 10]);
		let ivs = new Uint16Array([0, 1, 2, 0, 2, 3]);
		let model: IGeomModelData = {
			vertices: vs,
			uvsList: [uvs],
			normals: nvs,
			indices: ivs,
			wireframe: true,
			extraIndicesList: [
				{ indices: new Uint16Array([0, 1, 2]), wireframe: false },
				{ indices: new Uint16Array([0, 2, 3]), wireframe: true }
			]
		};
		let mesh = MeshFactory.createDataMeshFromModel(model);

		// 0, 1, 1, 2, 2, 0, 0, 2, 2, 3, 3, 0
		// 0, 1, 1, 2, 2, 0, 0, 2, 2, 3, 3, 0

		let scale = 10.0;
		let entity = new DisplayEntity();
		entity.setMaterial(material);
		entity.setMesh(mesh);
		entity.setScaleXYZ(scale, scale, scale);
		rscene.addEntity(entity);
		this.m_tarEntity = entity;

		material = new Default3DMaterial();
		// if(staticVtx) material.vtxInfo.toStatic();
		// material.normalEnabled = true;
		material.setTextureList([this.getTexByUrl("static/assets/box.jpg")]);

		entity = new DisplayEntity();
		entity.setMaterial(material);
		entity.setMesh(mesh);
		entity.setScaleXYZ(scale, scale, scale);
		entity.setXYZ(250, 0, 0);
		rscene.addEntity(entity);
		this.m_tarREntity = entity;

		// /*
		entity = new DisplayEntity();
		entity.setMaterial(material);
		entity.setMesh(mesh);
		entity.setScaleXYZ(scale, scale, scale);
		entity.setXYZ(500, 0, 0);
		rscene.addEntity(entity);
		this.m_tarMEntity = entity;

		material = new Default3DMaterial();
		if (staticVtx) material.vtxInfo.toStatic();
		// material.normalEnabled = true;
		material.setTextureList([this.getTexByUrl("static/assets/box.jpg")]);
		entity = new DisplayEntity();
		entity.setMaterial(material);
		entity.setMesh(mesh);
		entity.setScaleXYZ(scale, scale, scale);
		entity.setXYZ(500, 0, 200);
		rscene.addEntity(entity);
		entity = new DisplayEntity();
		entity.setMaterial(material);
		entity.setMesh(mesh);
		entity.setScaleXYZ(scale, scale, scale);
		entity.setXYZ(500, 0, 400);
		rscene.addEntity(entity);
		//*/
	}
	private m_flag = true;
	private m_RFlag = true;
	private m_MFlag = true;
	private m_index = 0;
	mouseDownListener(evt: any): void {

		console.log("mouse down");
		if (this.m_tarEntity != null) {
			let material = this.m_tarEntity.getMaterial();
			let vtxInfo = material.vtxInfo;
			// vtxInfo.applyIvsDataAt( 1 );
			vtxInfo.applyIvsDataAt((this.m_index++) % 4);
			// return;
			if (this.m_tarEntity != null) {
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
		if (this.m_tarMEntity != null) {
			let material = this.m_tarMEntity.getMaterial();
			let vtxInfo = material.vtxInfo;
			vtxInfo.setWireframe(this.m_MFlag);
			// if(this.m_MFlag) {
			// 	vtxInfo.setIvsParam(0,3);
			// }else {
			// 	vtxInfo.setIvsParam(0,6);
			// }
			this.m_MFlag = !this.m_MFlag;
		}
	}
	RMouseDownListener(evt: any): void {

		console.log("right mouse down");
		if (this.m_tarREntity != null) {
			// this.m_tarREntity.setIvsParam(0, 3);
			let material = this.m_tarREntity.getMaterial();
			let vtxInfo = material.vtxInfo;
			// vtxInfo.setWireframe(this.m_RFlag);
			vtxInfo.applyIvsDataAt(this.m_RFlag ? 1 : 0);
			// if(this.m_RFlag) {
			// 	vtxInfo.setIvsParam(0,3);
			// }else {

			// 	vtxInfo.setIvsParam(0,6);
			// }
			this.m_RFlag = !this.m_RFlag;
		}
	}

	private initScene(rscene: RendererScene): void {
		this.testDataMesh(rscene);
		// this.initEntitys(rscene);
	}
	private initEntitys(rscene: RendererScene): void {

		// let axis = new Axis3DEntity();
		// axis.initialize();
		// rscene.addEntity(axis);

		// let plane = new Plane3DEntity();
		// plane.wireframe = true;
		// plane.initializeXOZSquare(100);
		// this.m_rscene.addEntity( plane );

		// return;
		let box0 = new Box3DEntity();
		box0.normalEnabled = true;
		box0.wireframe = true;
		// box0.shape = false;
		box0.setXYZ(-150, 0, 0);
		box0.initializeCube(100);
		rscene.addEntity(box0);
		this.m_tarMEntity = box0;
	}
	run(): void {
		if (this.m_rscene != null) {
			// console.log(">>> begin");
			this.m_rscene.run();
			// console.log(">>> end");
		}
	}
}
export default DemoVtxMultiRDP;
