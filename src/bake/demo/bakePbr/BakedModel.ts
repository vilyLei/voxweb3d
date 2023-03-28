import RendererDevice from "../../../vox/render/RendererDevice";
import RendererParam from "../../../vox/scene/RendererParam";
import RenderStatusDisplay from "../../../vox/scene/RenderStatusDisplay";
import DisplayEntity from "../../../vox/entity/DisplayEntity";
import TextureProxy from "../../../vox/texture/TextureProxy";

import MouseEvent from "../../../vox/event/MouseEvent";
import ImageTextureLoader from "../../../vox/texture/ImageTextureLoader";
import CameraTrack from "../../../vox/view/CameraTrack";
import RendererScene from "../../../vox/scene/RendererScene";
import CameraStageDragSwinger from "../../../voxeditor/control/CameraStageDragSwinger";
import CameraZoomController from "../../../voxeditor/control/CameraZoomController";

import Vector3D from "../../../vox/math/Vector3D";
import Color4 from "../../../vox/material/Color4";

import PBREnvLightingMaterial from "../../../pbr/material/PBREnvLightingMaterial";
import PBRBakingMaterial from "./PBRBakingMaterial";
import IMeshBase from "../../../vox/mesh/IMeshBase";
import RendererState from "../../../vox/render/RendererState";

import { CoGeomDataType, CoDataFormat, CoGeomModelLoader } from "../../../cospace/app/common/CoGeomModelLoader";
import { EntityLayouter } from "../../../vox/utils/EntityLayouter";
import DataMesh from "../../../vox/mesh/DataMesh";
import SurfaceNormalCalc from "../../../vox/geom/SurfaceNormalCalc";
import Matrix4 from "../../../vox/math/Matrix4";
import MaterialBase from "../../../vox/material/MaterialBase";
import ITransformEntity from "../../../vox/entity/ITransformEntity";
import { ModelData, ModelDataLoader } from "./ModelDataLoader";
import { BakedViewer } from "./BakedViewer";
import { Bin4DataLoader } from "./Bin4DataLoader";
import VtxDrawingInfo from "../../../vox/render/vtx/VtxDrawingInfo";
import { MouseInteraction } from "../../../vox/ui/MouseInteraction";
import IGeomModelData from "../../../vox/mesh/IGeomModelData";
import IRenderTexture from "../../../vox/render/texture/IRenderTexture";
import MeshFactory from "../../../vox/mesh/MeshFactory";
import Default3DMaterial from "../../../vox/material/mcase/Default3DMaterial";

type BakingParamType = { su: number; sv: number; bakeUrl: string; bakeType: number, drawLine: boolean, drawShape: boolean };

export class BakedModel {
	constructor() {}

	private m_rscene: RendererScene = null;
	private m_texLoader: ImageTextureLoader = null;
	private m_layouter = new EntityLayouter();

	private getTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): TextureProxy {
		return this.m_texLoader.getTexByUrl(purl, wrapRepeat, mipmapEnabled) as TextureProxy;
	}

	initialize(): void {
		console.log("BakedModel::initialize()......");

		if (this.m_rscene == null) {
			RendererDevice.SHADERCODE_TRACE_ENABLED = false;
			RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
			//RendererDevice.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;
			RendererDevice.SetWebBodyColor("white");
			// let rparam = this.m_graph.createRendererParam(this.createDiv(0, 0, 512, 512));
			// rparam.autoSyncRenderBufferAndWindowSize = false;
			let rparam = new RendererParam();
			rparam.setCamPosition(1500.0, 1500.0, 1500.0);
			rparam.setAttriAntialias(true);
			rparam.setCamProject(45, 1.0, 8000)

			this.m_rscene = new RendererScene();
			this.m_rscene.initialize(rparam);
			// this.m_rscene.setClearRGBColor3f(1.0, 1.0, 1.0);

			this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);

			new RenderStatusDisplay(this.m_rscene, true);
			new MouseInteraction().initialize(this.m_rscene, 0, true).setAutoRunning(true);

			this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);

			this.initModel();
		}
	}
	private mIndex = 0;
	private mTotal = 1;
	private initModel(): void {
		this.m_layouter.layoutReset();
		this.initModelWithName("hat_a_01");
		this.initModelWithName("hat_a_02");
	}
	private initModelWithName(ns: string): void {
		// this.m_bakedViewer = new BakedViewer(this.m_rscene, this.m_texLoader);

		let vsUrl = "static/private/bake/"+ns+"/vertices.bin";
		let uvs1Url = "static/private/bake/"+ns+"/uv1.bin";
		let uvs2Url = "static/private/bake/"+ns+"/uv2.bin";
		let nvsUrl = "static/private/bake/"+ns+"/normal.bin";
		let bakeUrl = "static/private/bake/"+ns+"/"+ns+".png";

		let loader = new Bin4DataLoader();
		loader.setListener((model: IGeomModelData): void => {
			console.log("Bin4DataLoader loaded model: ", model);
			// this.createEntity(model, null, uvParams);
			// this.updateEntities();
			model.uvsList[0] = model.uvsList[1];
			let tex = this.getTexByUrl(bakeUrl);
			this.createEntity(model, tex);
		});
		loader.loadData(vsUrl, uvs1Url, uvs2Url, nvsUrl, "");
	}
	private createEntity(model: IGeomModelData, tex: IRenderTexture): void {
		let material = new Default3DMaterial();
		material.setTextureList([tex]);
		let mesh = MeshFactory.createDataMeshFromModel(model, material);
		let entity = new DisplayEntity();
		entity.setMesh(mesh);
		entity.setMaterial(material);
		this.m_rscene.addEntity(entity);
		this.m_layouter.layoutAppendItem( entity, null );

		this.mIndex++;
		if(this.mIndex >= this.mTotal) {
			this.m_layouter.layoutUpdate();
		}
	}
	private mouseDown(evt: any): void {
		console.log("mouse down... ...");
	}

	run(): void {
		if (this.m_rscene != null) {
			this.m_rscene.run();
		}
	}
}
export default BakedModel;
