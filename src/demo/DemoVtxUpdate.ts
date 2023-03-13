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
import VtxDrawingInfo from "../vox/render/vtx/VtxDrawingInfo";
import DataMesh from "../vox/mesh/DataMesh";
import IDataMesh from "../vox/mesh/IDataMesh";
import DebugFlag from "../vox/debug/DebugFlag";

export class DemoVtxUpdate {
	private m_init = true;
	private m_texLoader: ImageTextureLoader = null;
	constructor() { }

	private getTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): TextureProxy {
		return this.m_texLoader.getTexByUrl(purl, wrapRepeat, mipmapEnabled) as TextureProxy;
	}

	private initEvent(rscene: RendererScene): void {
		rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDownListener, true, false);
	}
	initialize(): void {
		console.log("DemoVtxUpdate::initialize()......");
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
			rscene.initialize(rparam, 3).setAutoRunning(true);

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
	private m_mesh: IDataMesh = null;
	private testDataMesh(rscene: RendererScene): void {


		console.log("testDataMesh() --------------------------------------");

		// 推荐的模型数据组织形式

		let material = new Default3DMaterial();
		// material.normalEnabled = true;
		material.vtxInfo = this.createVtxInfo();
		material.setTextureList([this.getTexByUrl("static/assets/box.jpg")]);

		let nvs = new Float32Array([0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0]);
		let uvs = new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]);
		let vs = new Float32Array([10, 0, -10, -10, 0, -10, -10, 0, 10, 10, 0, 10]);
		let ivs = new Uint16Array([0, 1, 2, 0, 2, 3]);
		let model: IGeomModelData = { vertices: vs, uvsList: [uvs], normals: nvs, indices: ivs, wireframe: false };
		let mesh = MeshFactory.createDataMeshFromModel(model);

		// let dx = 30;		
		// let nvs = new Float32Array([0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 	0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0]);
		// let uvs = new Float32Array([0, 0, 1, 0, 1, 1, 0, 1, 	0, 0, 1, 0, 1, 1, 0, 1]);
		// let vs = new Float32Array([10, 0, -10, -10, 0, -10, -10, 0, 10, 10, 0, 10, 		10 + dx, 0, -10, -10 + dx, 0, -10, -10 + dx, 0, 10, 10 + dx, 0, 10]);
		// let ivs = new Uint16Array([0, 1, 2, 0, 2, 3, 		0+4, 1+4, 2+4, 0+4, 2+4, 3+4]);
		// let model: IGeomModelData = { vertices: vs, uvsList: [uvs], normals: nvs, indices: ivs, wireframe: false };
		// let mesh = MeshFactory.createDataMeshFromModel(model);
		this.m_mesh = mesh;

		// 0, 1, 1, 2, 2, 0, 0, 2, 2, 3, 3, 0
		// 0, 1, 1, 2, 2, 0, 0, 2, 2, 3, 3, 0

		let scale = 10.0;
		let entity = new DisplayEntity();
		entity.setMaterial(material);
		entity.setMesh(mesh);
		entity.setScaleXYZ(scale, scale, scale);
		rscene.addEntity(entity);
		this.m_tarEntity = entity;

	}
	
	private testDataMesh2(): void {

		let dx = 30;
		
		let nvs = new Float32Array([0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 	0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0]);
		let uvs = new Float32Array([0, 0, 1, 0, 1, 1, 0, 1, 	0, 0, 1, 0, 1, 1, 0, 1]);
		let vs = new Float32Array([10, 0, -10, -10, 0, -10, -10, 0, 10, 10, 0, 10, 		10 + dx, 0, -10, -10 + dx, 0, -10, -10 + dx, 0, 10, 10 + dx, 0, 10]);
		let ivs = new Uint16Array([0, 1, 2, 0, 2, 3, 		0+4, 1+4, 2+4, 0+4, 2+4, 3+4]);
		let mesh = this.m_mesh;
		mesh.setVS(vs);
		mesh.setUVS(uvs);
		mesh.setNVS(nvs);
		mesh.setIVS(ivs);
		mesh.initialize();

		this.m_tarEntity.updateMeshToGpu();
		this.m_tarEntity.getMaterial().vtxInfo.setIvsParam(0, ivs.length);

		// let model: IGeomModelData = { vertices: vs, uvsList: [uvs], normals: nvs, indices: ivs, wireframe: false };
		// let mesh = MeshFactory.createDataMeshFromModel(model);
		// this.m_mesh = mesh;

	}
	private m_flag = true;
	private m_flagState = 0;
	mouseDownListener(evt: any): void {

		console.log("mouse down");
		this.m_flagState ++;
		if(this.m_flagState == 2) {
			if (this.m_tarEntity != null) {
				this.testDataMesh2();
			}
		}
		DebugFlag.Flag_0 = 1;
	}

	private initScene(rscene: RendererScene): void {
		this.testDataMesh(rscene);
		// this.initEntitys(rscene);
	}
	private initEntitys(rscene: RendererScene): void {

		let axis = new Axis3DEntity();
		axis.initialize();
		rscene.addEntity(axis);

		// let plane = new Plane3DEntity();
		// plane.wireframe = true;
		// plane.initializeXOZSquare(100);
		// this.m_rscene.addEntity( plane );

		// return;
		let box0 = new Box3DEntity();
		box0.normalEnabled = true;
		// box0.wireframe = true;
		box0.setXYZ(-150, 0, 0);
		box0.initializeCube(100);
		rscene.addEntity(box0);
	}
}
export default DemoVtxUpdate;
