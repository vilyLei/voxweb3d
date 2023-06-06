import Vector3D from "../../vox/math/Vector3D";
import RendererDevice from "../../vox/render/RendererDevice";
import RendererParam from "../../vox/scene/RendererParam";
import RenderStatusDisplay from "../../vox/scene/RenderStatusDisplay";

import MouseEvent from "../../vox/event/MouseEvent";
import ImageTextureLoader from "../../vox/texture/ImageTextureLoader";
import RendererScene from "../../vox/scene/RendererScene";

import { EntityLayouter } from "../../vox/utils/EntityLayouter";
import { CoGeomDataType, CoModelTeamLoader } from "../../cospace/app/common/CoModelTeamLoader";

import DisplayEntity from "../../vox/entity/DisplayEntity";
import RendererState from "../../vox/render/RendererState";
import Matrix4 from "../../vox/math/Matrix4";
import Default3DMaterial from "../../vox/material/mcase/Default3DMaterial";
import { MouseInteraction } from "../../vox/ui/MouseInteraction";
import MeshFactory from "../../vox/mesh/MeshFactory";
import IRenderTexture from "../../vox/render/texture/IRenderTexture";

export class ModelDataDownload {
	constructor() {}

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

		new RenderStatusDisplay(this.m_rscene, true);
		new MouseInteraction().initialize(this.m_rscene, 0, true).setAutoRunning(true);
	}
	initialize(): void {
		console.log("ModelDataDownload::initialize()......");
		if (this.m_rscene == null) {
			RendererDevice.SHADERCODE_TRACE_ENABLED = false;
			RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;

			let rparam = new RendererParam();
			rparam.setCamPosition(1200.0, 1200.0, 1200.0);
			this.m_rscene = new RendererScene();
			this.m_rscene.initialize(rparam).setAutoRunning(true);

			this.initSys();

			this.initModels();
		}
	}
	private initModels(): void {
		let url0 = "static/private/fbx/soleBig01.fbx";

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

			// let fio = new FileIO();

			// fio.downloadBinFile(model.vertices, "vs","bin");
			// fio.downloadBinFile(model.normals, "nvs","bin");
			// fio.downloadBinFile(model.uvsList[0], "uvs1","bin");
			// fio.downloadBinFile(model.indices, "ivs","bin");

			// fio.downloadBinFile(model.uvsList[0], "uvs2","bin");

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
export default ModelDataDownload;
