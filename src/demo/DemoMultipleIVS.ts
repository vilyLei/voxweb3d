import Vector3D from "../vox/math/Vector3D";
import RendererDevice from "../vox/render/RendererDevice";
import RendererParam from "../vox/scene/RendererParam";
import DisplayEntity from "../vox/entity/DisplayEntity";
import TextureProxy from "../vox/texture/TextureProxy";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import RendererScene from "../vox/scene/RendererScene";
import DivLog from "../vox/utils/DivLog";
import MouseEvent from "../vox/event/MouseEvent";
import CameraStageDragSwinger from "../voxeditor/control/CameraStageDragSwinger";
import CameraZoomController from "../voxeditor/control/CameraZoomController";
import Default3DMaterial from "../vox/material/mcase/Default3DMaterial";
import IGeomModelData from "../vox/mesh/IGeomModelData";
import MeshFactor from "../vox/mesh/MeshFactory";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";

export class DemoMultipleIVS {
	private m_rscene: RendererScene = null;
	private m_texLoader: ImageTextureLoader = null;
	private m_stageDragSwinger = new CameraStageDragSwinger();
	private m_cameraZoomController = new CameraZoomController();
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
		console.log("DemoMultipleIVS::initialize()......");
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

			this.m_rscene.enableMouseEvent(true);
			// this.m_rscene.enableMouseEvent(false);
			this.m_cameraZoomController.bindCamera(this.m_rscene.getCamera());
			this.m_cameraZoomController.initialize(this.m_rscene.getStage3D());
			this.m_stageDragSwinger.initialize(this.m_rscene.getStage3D(), this.m_rscene.getCamera());
			
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
		let mesh = MeshFactor.createDataMeshFromModel(model, material);

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
		let model: IGeomModelData = {vertices: vs, uvsList: [uvs], normals: nvs, indices: ivs};
		// let mesh = VoxRScene.createDataMeshFromModel(model, material);
		let mesh = MeshFactor.createDataMeshFromModel(model);

		let scale = 10.0;
		let entity = new DisplayEntity();
		entity.setMaterial(material);
		entity.setMesh(mesh);
		entity.setScaleXYZ(scale, scale, scale);
		this.m_rscene.addEntity(entity);
	}
	
	private initScene(): void {
		this.testNoIndicesMesh();
		// this.testHasIndicesMesh();
	}
	run(): void {
		if (this.m_rscene != null) {

			this.m_stageDragSwinger.runWithYAxis();
			this.m_cameraZoomController.run(Vector3D.ZERO, 30.0);

			this.m_rscene.run(true);
		}
	}
}
export default DemoMultipleIVS;
