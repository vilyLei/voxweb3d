import Vector3D from "../vox/math/Vector3D";
import RendererDevice from "../vox/render/RendererDevice";
import RendererParam from "../vox/scene/RendererParam";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";

import MouseEvent from "../vox/event/MouseEvent";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import RendererScene from "../vox/scene/RendererScene";

import { EntityLayouter } from "../vox/utils/EntityLayouter";
import { CoGeomDataType, CoModelTeamLoader } from "../cospace/app/common/CoModelTeamLoader";

import DisplayEntity from "../vox/entity/DisplayEntity";
import RendererState from "../vox/render/RendererState";
import Matrix4 from "../vox/math/Matrix4";
import Default3DMaterial from "../vox/material/mcase/Default3DMaterial";
import { MouseInteraction } from "../vox/ui/MouseInteraction";
import MeshFactory from "../vox/mesh/MeshFactory";
import IRenderTexture from "../vox/render/texture/IRenderTexture";

import Cone3DEntity from "../vox/entity/Cone3DEntity";
import Axis3DEntity from "../vox/entity/Axis3DEntity";
import Box3DEntity from "../vox/entity/Box3DEntity";

class VVF {
	isEnabled(): boolean {
		return true;
	}
}
let pwin: any = window;
pwin["VoxVerify"] = new VVF();

export class RModelSCViewer {
	constructor() { }

	private m_rscene: RendererScene = null;
	private m_texLoader: ImageTextureLoader = null;
	private m_teamLoader = new CoModelTeamLoader();
	private m_layouter = new EntityLayouter();

	private getTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): IRenderTexture {
		return this.m_texLoader.getTexByUrl(purl, wrapRepeat, mipmapEnabled);
	}
	private initSys(): void {
		this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);
		this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);

		// new RenderStatusDisplay(this.m_rscene, true);
		new MouseInteraction().initialize(this.m_rscene, 0, true).setAutoRunning(true, 1);
	}
	initialize(div: HTMLDivElement): void {
		console.log("RModelSCViewer::initialize()......");
		if (this.m_rscene == null) {
			RendererDevice.SHADERCODE_TRACE_ENABLED = false;
			RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;

			let rparam = new RendererParam( div );
			rparam.setCamProject(45, 0.1, 2000.0);
			rparam.setCamPosition(800.0, 800.0, 800.0);
			rparam.setCamUpDirect(0.0, 0.0, 1.0);
			this.m_rscene = new RendererScene();
			this.m_rscene.initialize(rparam).setAutoRunning(true);

			let unit = 100.0

			// let cube = new Box3DEntity();
			// cube.normalEnabled = true;
			// cube.initializeCube(2 * unit);
			// this.m_rscene.addEntity(cube);

			// let cone = new Cone3DEntity();
			// cone.normalEnabled = true;
			// cone.initialize(1.0 * unit, 2.0 * unit, 30, null, 0);
			// cone.setRotationXYZ(90,0,0);
			// cone.setXYZ(-0.8 * unit, 0, 1.6 * unit)
			// this.m_rscene.addEntity(cone);

			// let axis = new Axis3DEntity();
			// axis.initialize(300)
			// this.m_rscene.addEntity(axis);

			// let cam = this.m_rscene.getCamera()
			// console.log("cam.getViewMatrix(): ")
			// console.log(cam.getViewMatrix().toString())
			// let mat = cam.getViewMatrix().clone();
			// mat.invert()
			// console.log("mat: ")
			// mat.transpose();
			// let vs = mat.getLocalFS32()
			// console.log(vs)

			this.initSys();

			// this.initSomePrimitives();
			// this.initModels();
		}
	}
	initSceneByUrl(url: string): void {
		let loader = this.m_teamLoader;

		loader.load([url], (models: CoGeomDataType[], transforms: Float32Array[]): void => {
			this.m_layouter.layoutReset();
			for (let i = 0; i < models.length; ++i) {
				this.createEntity(models[i], transforms != null ? transforms[i] : null, 2.00);
			}
			this.m_layouter.layoutUpdate(300, new Vector3D(0, 0, 0));
		});
	}
	getCameraData(posScale: number): Float32Array {
		let cam = this.m_rscene.getCamera()
		let mat = cam.getViewMatrix().clone();
		mat.invert();
		mat.transpose();
		let vs = mat.getLocalFS32().slice();
		return vs;
	}
	private initModels(): void {
		let url0 = "static/private/fbx/soleBig01_unwrapuv.fbx";
		url0 = "static/private/obj/box01.obj";
		let loader = this.m_teamLoader;

		loader.load([url0], (models: CoGeomDataType[], transforms: Float32Array[]): void => {
			this.m_layouter.layoutReset();
			for (let i = 0; i < models.length; ++i) {
				this.createEntity(models[i], transforms != null ? transforms[i] : null, 2.00);
			}
			this.m_layouter.layoutUpdate(300, new Vector3D(0, 0, 0));
		});
	}

	protected createEntity(model: CoGeomDataType, transform: Float32Array = null, uvScale: number = 1.0): DisplayEntity {
		if (model != null) {
			console.log("createEntity(), model: ", model);
			
			let material = new Default3DMaterial();
			material.normalEnabled = true;
			material.setUVScale(uvScale, uvScale);
			material.setTextureList([this.getTexByUrl("static/assets/box.jpg")]);

			let mesh = MeshFactory.createDataMeshFromModel(model, material);
			let entity = new DisplayEntity();
			entity.setRenderState(RendererState.NONE_CULLFACE_NORMAL_STATE);
			entity.setMesh(mesh);
			entity.setMaterial(material);

			this.m_rscene.addEntity(entity);
			this.m_layouter.layoutAppendItem(entity, new Matrix4(transform));
			return entity;
		}
	}

	private mouseDown(evt: any): void {
		console.log("mouse down.");
	}
}
export default RModelSCViewer;
