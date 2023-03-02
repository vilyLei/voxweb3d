import IRendererScene from "../../vox/scene/IRendererScene";
import { ICoRenderer } from "../voxengine/ICoRenderer";
import { ICoRScene } from "../voxengine/ICoRScene";
import { ICoEntity } from "../voxentity/ICoEntity";
import { ICoMesh } from "../voxmesh/ICoMesh";
import { ICoMaterial } from "../voxmaterial/ICoMaterial";
import { ICoUIInteraction } from "../voxengine/ui/ICoUIInteraction";
import { ModuleLoader } from "../modules/loaders/ModuleLoader";
import IRenderTexture from "../../vox/render/texture/IRenderTexture";
import { VoxEntity } from "../voxentity/VoxEntity";
import IGeomModelData from "../../vox/mesh/IGeomModelData";
import { VoxRScene } from "../voxengine/VoxRScene";
import { VoxMaterial } from "../voxmaterial/VoxMaterial";

declare var CoRenderer: ICoRenderer;
declare var CoRScene: ICoRScene;
declare var CoUIInteraction: ICoUIInteraction;
declare var CoMaterial: ICoMaterial;
declare var CoEntity: ICoEntity;
declare var CoMesh: ICoMesh;

/**
 * cospace renderer scene
 */
export class DemoPrimitives {

	private m_rscene: IRendererScene = null;
	constructor() { }

	initialize(): void {

		console.log("EffectExample::initialize()......");
		document.oncontextmenu = function (e) {
			e.preventDefault();
		}

		let url0 = "static/cospace/engine/renderer/CoRenderer.umd.js";
		let url1 = "static/cospace/engine/rscene/CoRScene.umd.js";
		let url2 = "static/cospace/engine/uiInteract/CoUIInteraction.umd.js";
		let url3 = "static/cospace/comesh/CoMesh.umd.js";
		let url4 = "static/cospace/coentity/CoEntity.umd.js";
		let url5 = "static/cospace/coMaterial/CoMaterial.umd.js";
		let url6 = "static/cospace/math/CoMath.umd.js";
		let url7 = "static/cospace/ageom/CoAgeom.umd.js";

		let mouseInteractML = new ModuleLoader(2, (): void => {
			this.initMouseInteraction();
		});
		new ModuleLoader(2, (): void => {
			if (this.isEngineEnabled()) {
				console.log("engine modules loaded ...");
				this.initRenderer();
				new ModuleLoader(5, (): void => {
					console.log("ready to build scene objs.");
					this.init3DScene();
				})
					.load(url3)
					.load(url4)
					.load(url5)
					.load(url6)
					.load(url7);
			}
		})
			.addLoader(mouseInteractML)
			.load(url0)
			.load(url1);

		mouseInteractML.load(url2);
	}
	private getTexByUrl(url: string): IRenderTexture {
		let sc = this.m_rscene;

		let tex = sc.textureBlock.createImageTex2D(64, 64, false);
		let img = new Image();
		img.onload = (evt: any): void => {
			tex.setDataFromImage(img);
		};
		img.src = url;
		return tex;
	}
	private testNoIndicesMesh(): void {
		// 不推荐的模型数据组织形式
		let material = VoxMaterial.createDefaultMaterial();
		material.normalEnabled = true;
		material.setTextureList([this.getTexByUrl("static/assets/broken_iron.jpg")]);

		let nvs = new Float32Array([0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0]);
		let uvs = new Float32Array([1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0]);
		let vs = new Float32Array([-1, 0, 1, 1, 0, 1, 1, 0, -1, -1, 0, 1, 1, 0, -1, -1, 0, -1]);
		let model: IGeomModelData = {vertices: vs, uvsList: [uvs], normals: nvs};
		let mesh = VoxRScene.createDataMeshFromModel(model, material);

		let scale = 30.0;
		let entity = CoEntity.createDisplayEntity();
		entity.setMaterial(material);
		entity.setMesh(mesh);
		entity.setScaleXYZ(scale, scale, scale);
		this.m_rscene.addEntity(entity);
	}
	private testHasIndicesMesh(): void {
		// 推荐的模型数据组织形式
		let material = VoxMaterial.createDefaultMaterial();
		// material.normalEnabled = true;
		material.setTextureList([this.getTexByUrl("static/assets/box.jpg")]);

		let nvs = new Float32Array([0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0]);
		let uvs = new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]);
		let vs = new Float32Array([10, 0, -10, -10, 0, -10, -10, 0, 10, 10, 0, 10]);
		let ivs = new Uint16Array([0, 1, 2, 0, 2, 3]);
		let model: IGeomModelData = {vertices: vs, uvsList: [uvs], normals: nvs, indices: ivs};
		// let mesh = VoxRScene.createDataMeshFromModel(model, material);
		let mesh = VoxRScene.createDataMeshFromModel(model);

		let scale = 10.0;
		let entity = CoEntity.createDisplayEntity();
		entity.setMaterial(material);
		entity.setMesh(mesh);
		entity.setScaleXYZ(scale, scale, scale);
		this.m_rscene.addEntity(entity);
	}
	private init3DScene(): void {

		// this.testNoIndicesMesh();
		this.testHasIndicesMesh();
		return;

		// let material = CoRScene.createDefaultMaterial();
		// material.setTextureList([this.getTexByUrl("static/assets/box.jpg")]);

		// CoMesh.cylinder.applyMaterial(material);
		// let meshCyl = CoMesh.cylinder.create(50, 110, 10);

		// let cyl = CoRScene.createDisplayEntity();
		// cyl.setMaterial(material);
		// cyl.setMesh(meshCyl);
		// this.m_rscene.addEntity(cyl);

		// CoMesh.torus.applyMaterial(material);
		// CoMesh.torus.geometry.axisType = 0;
		// let meshTorus = CoMesh.torus.create(110, 80, 10);

		// let torus = CoRScene.createDisplayEntity();
		// // torus.setRenderState(CoRScene.RendererState.NONE_CULLFACE_NORMAL_STATE);
		// torus.setMaterial(material);
		// torus.setMesh(meshTorus);
		// this.m_rscene.addEntity(torus);
		
		// CoMesh.tube.applyMaterial(material);
		// CoMesh.tube.geometry.axisType = 2;
		// let meshTube = CoMesh.tube.create(50, 110, 10);

		// let tube = CoRScene.createDisplayEntity();
		// tube.setRenderState(CoRScene.RendererState.NONE_CULLFACE_NORMAL_STATE);
		// tube.setMaterial(material);
		// tube.setMesh(meshTube);
		// this.m_rscene.addEntity(tube);

		
		// let tubeMaterial = CoMaterial.createDefaultMaterial();
		// tubeMaterial.normalEnabled = true;
		// // let tube = CoEntity.createTube(50, 150, 30, 1, 2, tubeMaterial);
		// let tube = VoxEntity.createTube(50, 150, 30, 1, 2, tubeMaterial);
		// tube.setRenderState(CoRScene.RendererState.NONE_CULLFACE_NORMAL_STATE);
		// this.m_rscene.addEntity(tube);

		
		let torusMaterial = CoMaterial.createDefaultMaterial();
		torusMaterial.normalEnabled = true;
		torusMaterial.setRGB3f(1.0,0.0,0.0);
		// let torus = CoEntity.createTorus(100, 30, 20, 70, 2, torusMaterial);
		let torus = VoxEntity.createTorus(100, 30, 20, 70, 2, torusMaterial);
		// tube.setRenderState(CoRScene.RendererState.NONE_CULLFACE_NORMAL_STATE);
		this.m_rscene.addEntity(torus);

		return;
		let size = 50;
		let v0 = CoRScene.createVec3(-size, -size, -size);
		let entity = CoEntity.createBox(v0, v0.clone().scaleBy(-1));
		this.m_rscene.addEntity(entity);

		let cubeMaterial = CoMaterial.createDefaultMaterial();
		cubeMaterial.setRGB3f(0.7, 1.0, 1.0);
		cubeMaterial.normalEnabled = true;
		cubeMaterial.setTextureList([this.getTexByUrl("static/assets/box.jpg")]);
		let cube = CoEntity.createCube(200, cubeMaterial);
		cube.setXYZ(-300, 0, 0);
		this.m_rscene.addEntity(cube);

		let sphMaterial = CoMaterial.createDefaultMaterial();
		sphMaterial.normalEnabled = true;
		sphMaterial.setTextureList([this.getTexByUrl("static/assets/box.jpg")]);
		let sph = CoEntity.createSphere(150, 20, 20, sphMaterial);
		sph.setXYZ(300, 0, 0);
		this.m_rscene.addEntity(sph);

		let coneMaterial = CoMaterial.createDefaultMaterial();
		coneMaterial.normalEnabled = true;
		let cone = CoEntity.createCone(100, 150, 20, coneMaterial);
		cone.setXYZ(300, 0, -300);
		this.m_rscene.addEntity(cone);
		
		let planeMaterial = CoMaterial.createDefaultMaterial();
		planeMaterial.normalEnabled = true;
		let plane = CoEntity.createXOZPlane(-50, -50, 100, 100, coneMaterial);
		plane.setXYZ(-300, 0, 300);
		this.m_rscene.addEntity(plane);
	}
	
	isEngineEnabled(): boolean {
		return typeof CoRenderer !== "undefined" && typeof CoRScene !== "undefined";
	}
	private initMouseInteraction(): void {
		
		CoUIInteraction.createMouseInteraction().initialize(this.m_rscene, 0, true).setAutoRunning(true);
	}

	private initRenderer(): void {

		if (this.m_rscene == null) {

			let RendererDevice = CoRScene.RendererDevice;
			RendererDevice.SHADERCODE_TRACE_ENABLED = true;
			RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
			RendererDevice.SetWebBodyColor("black");

			let rparam = CoRScene.createRendererSceneParam();
			rparam.setAttriAntialias(true);
			rparam.setCamPosition(1000.0, 1000.0, 1000.0);
			rparam.setCamProject(45, 20.0, 9000.0);
			this.m_rscene = CoRScene.createRendererScene(rparam);
			this.m_rscene.setAutoRunning(true);
		}
	}
	// run(): void {
	// 	if (this.m_rscene != null) {
	// 		this.m_rscene.run();
	// 	}
	// }
}

export default DemoPrimitives;
