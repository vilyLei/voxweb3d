import Vector3D from "../vox/math/Vector3D";
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
import { GeometryMerger } from "../vox/mesh/GeometryMerger";
import DataMesh from "../vox/mesh/DataMesh";
import IRenderMaterial from "../vox/render/IRenderMaterial";
import Box3DEntity from "../vox/entity/Box3DEntity";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";
import Plane3DEntity from "../vox/entity/Plane3DEntity";
import Axis3DEntity from "../vox/entity/Axis3DEntity";
import { MouseInteraction } from "../vox/ui/MouseInteraction";

export class DemoDataMesh {

	private m_rscene: RendererScene = null;
	private m_texLoader: ImageTextureLoader = null;

	constructor() {}

	getTexByUrl(purl: string): TextureProxy {
		return this.m_texLoader.getImageTexByUrl(purl);
	}

	private initEvent(): void {
		this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDownListener, true, false);
	}
	mouseDownListener(evt: any): void {		
	}
	initialize(): void {
		console.log("DataMesh::initialize()......");
		if (this.m_rscene == null) {
			
			RendererDevice.SHADERCODE_TRACE_ENABLED = true;
			RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
			DivLog.SetDebugEnabled(false);

			let rparam = new RendererParam();
			// rparam.maxWebGLVersion = 1;
			rparam.setCamProject(45, 0.1, 6000.0);
			rparam.setCamPosition(1100.0, 1100.0, 1100.0);
			this.m_rscene = new RendererScene();
			this.m_rscene.initialize(rparam, 3);
			this.m_rscene.updateCamera();

			this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);

			new MouseInteraction().initialize(this.m_rscene, 0, true).setAutoRunning(true);
			new RenderStatusDisplay(this.m_rscene, true);

			this.initScene();
			this.initEvent();
		}
	}
	private testNoIndicesMesh(): void {
		// 不推荐的模型数据组织形式
		let material = new Default3DMaterial();
		material.normalEnabled = true;
		material.setTextureList([this.getTexByUrl("static/assets/broken_iron.jpg")]);

		let nvs = new Float32Array([0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0]);
		let uvs = new Float32Array([1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0]);
		let vs = new Float32Array([-1, 0, 1, 1, 0, 1, 1, 0, -1, -1, 0, 1, 1, 0, -1, -1, 0, -1]);
		let model: IGeomModelData = {vertices: vs, uvsList: [uvs], normals: nvs};
		let mesh = MeshFactory.createDataMeshFromModel(model, material);

		let scale = 150.0;
		let entity = new DisplayEntity();
		entity.setMaterial(material);
		entity.setMesh(mesh);
		entity.setScaleXYZ(scale, scale, scale);
		this.m_rscene.addEntity(entity);
	}

	private testHasIndicesMesh(): void {
		// 推荐的模型数据组织形式

		let material = new Default3DMaterial();
		// material.normalEnabled = true;
		material.setTextureList([this.getTexByUrl("static/assets/box.jpg")]);

		let nvs = new Float32Array([0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0]);
		let uvs = new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]);
		let vs = new Float32Array([10, 0, -10, -10, 0, -10, -10, 0, 10, 10, 0, 10]);
		let ivs = new Uint16Array([0, 1, 2, 0, 2, 3]);
		let model: IGeomModelData = {vertices: vs, uvsList: [uvs], normals: nvs, indices: ivs, wireframe: false};
		// let mesh = VoxRScene.createDataMeshFromModel(model, material);
		let mesh = MeshFactory.createDataMeshFromModel(model);
		// 0, 1, 1, 2, 2, 0, 0, 2, 2, 3, 3, 0
		// 0, 1, 1, 2, 2, 0, 0, 2, 2, 3, 3, 0
		let scale = 10.0;
		let entity = new DisplayEntity();
		entity.setMaterial(material);
		entity.setMesh(mesh);
		entity.setScaleXYZ(scale, scale, scale);
		this.m_rscene.addEntity(entity);
	}
	
	private initScene(): void {
		// this.testNoIndicesMesh();
		// this.testHasIndicesMesh();
		// this.initMergeGeomEntity();
		this.initEntitys();
	}
	private initEntitys(): void {

		let axis = new Axis3DEntity();
		axis.initialize();
		this.m_rscene.addEntity( axis );

		// let plane = new Plane3DEntity();
		// plane.wireframe = true;
		// plane.initializeXOZSquare(100);
		// this.m_rscene.addEntity( plane );

		return;
		let box0 = new Box3DEntity();
		box0.normalEnabled = true;
		// box0.wireframe = true;
		box0.setXYZ(-150, 0, 0);
		box0.initializeCube(100);
		this.m_rscene.addEntity( box0 );
	}
	private initMergeGeomEntity(): void {

		let box0 = new Box3DEntity();
		box0.normalEnabled = true;
		box0.setXYZ(-150, 0, 0);
		box0.initializeCube(100);

		let box1 = new Box3DEntity();
		box1.normalEnabled = true;
		box1.setXYZ(150, 0, 0);
		box1.initializeCube(100);

		let obsMeshMerger = new GeometryMerger();
		obsMeshMerger.addEntity(box0);
		obsMeshMerger.addEntity(box1);

		// this.addMergedEntity(obsMeshMerger, box0.getMaterial());

		this.m_rscene.addEntity(box0);
		this.m_rscene.addEntity(box1);
	}
    private addMergedEntity(meshMerger: GeometryMerger, material: IRenderMaterial = null): void {

        meshMerger.merger();
		
        let dataMesh = new DataMesh();
        dataMesh.setBufSortFormat(material.getBufSortFormat());
        dataMesh.initializeFromGeometry(meshMerger);

        let entity = new DisplayEntity();
        entity.setMaterial(material);
        entity.setMesh(dataMesh);
        this.m_rscene.addEntity(entity, 1);
    }
	run(): void {
		if (this.m_rscene != null) {
			this.m_rscene.run(true);
		}
	}
}
export default DemoDataMesh;
