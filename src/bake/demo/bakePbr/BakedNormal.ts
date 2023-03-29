import RendererDevice from "../../../vox/render/RendererDevice";
import RendererParam from "../../../vox/scene/RendererParam";
import RenderStatusDisplay from "../../../vox/scene/RenderStatusDisplay";
import DisplayEntity from "../../../vox/entity/DisplayEntity";
import TextureProxy from "../../../vox/texture/TextureProxy";

import MouseEvent from "../../../vox/event/MouseEvent";
import ImageTextureLoader from "../../../vox/texture/ImageTextureLoader";
import RendererScene from "../../../vox/scene/RendererScene";
import { EntityLayouter } from "../../../vox/utils/EntityLayouter";
import { Bin4DataLoader } from "./Bin4DataLoader";
import { MouseInteraction } from "../../../vox/ui/MouseInteraction";
import IGeomModelData from "../../../vox/mesh/IGeomModelData";
import IRenderTexture from "../../../vox/render/texture/IRenderTexture";
import MeshFactory from "../../../vox/mesh/MeshFactory";
import Default3DMaterial from "../../../vox/material/mcase/Default3DMaterial";
import { CoGeomDataType, CoModelTeamLoader } from "../../../cospace/app/common/CoModelTeamLoader";
import SurfaceNormalCalc from "../../../vox/geom/SurfaceNormalCalc";
import Vector3D from "../../../vox/math/Vector3D";
import { FileIO } from "../../../app/slickRoad/io/FileIO";

export class BakedNormal {
	constructor() {}

	private m_rscene: RendererScene = null;
	private m_texLoader: ImageTextureLoader = null;
	private m_layouter = new EntityLayouter();
    private m_teamLoader = new CoModelTeamLoader();

	private getTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): TextureProxy {
		return this.m_texLoader.getTexByUrl(purl, wrapRepeat, mipmapEnabled) as TextureProxy;
	}

	initialize(): void {
		console.log("BakedNormal::initialize()......");

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

			// this.initModel();
			this.initModels();
		}
	}
	private initModels(): void {

		let url01 = "static/private/bake/hat_b_02/hat_b_02.fbx";
        let loader = this.m_teamLoader;
        loader.load([url01], (models: CoGeomDataType[], transforms: Float32Array[]): void => {
			let model = models[0];
			console.log("mmmxxx hat_b_02.fbx, model: ", model);
			let fio = new FileIO();
			fio.downloadBinFile(model.vertices, "vertices", "bin");
			fio.downloadBinFile(model.normals, "normal", "bin");
			fio.downloadBinFile(model.uvsList[0], "uv1", "bin");
			fio.downloadBinFile(model.indices, "indices", "bin");
        });

		let url02 = "static/private/bake/hat_b_02/hat_b_02_unwrap.fbx";
        loader.load([url02], (models: CoGeomDataType[], transforms: Float32Array[]): void => {
			let model = models[0];
			console.log("mmmxxx hat_b_02_unwrap.fbx, model: ", model);
			let fio = new FileIO();
			// fio.downloadBinFile(model.vertices, "vertices", "bin");
			fio.downloadBinFile(model.uvsList[0], "uv2", "bin");
        });

		// let url03 = "static/private/bake/hat_a_02/model.ctm";
        // loader.load([url03], (models: CoGeomDataType[], transforms: Float32Array[]): void => {
		// 	let model = models[0];
		// 	console.log("mmmxxx model.ctm, model: ", model);
        // });
		// this.initModelWithNameShow("hat_a_02");
	}

	private initModelWithNameShow(ns: string): void {

		// this.m_bakedViewer = new BakedViewer(this.m_rscene, this.m_texLoader);

		let vsUrl = "static/private/bake/"+ns+"/vertices.bin";
		let uvs1Url = "static/private/bake/"+ns+"/uv1.bin";
		let uvs2Url = "static/private/bake/"+ns+"/uv2.bin";
		let nvsUrl = "static/private/bake/"+ns+"/normal.bin";
		let bakeUrl = "static/private/bake/"+ns+"/"+ns+".png";

		let loader = new Bin4DataLoader();
		loader.setListener((model: IGeomModelData): void => {
			console.log("mmmxxx model param show, models: ", model);
		});
		loader.loadData(vsUrl, uvs1Url, uvs2Url, nvsUrl, "");
	}
    private initModels2(): void {
        // let url01 = "static/private/bake/hat_a_01/model.ctm";
        let url02 = "static/private/bake/hat_a_02/model.ctm";
        // url02 = "static/private/ctm/errorNormal.ctm";
        let loader = this.m_teamLoader;

        loader.load([url02], (models: CoGeomDataType[], transforms: Float32Array[]): void => {
			console.log("xxx loaded models ...");

			let model = models[0];
			let ivs = model.indices;
			let vs = model.vertices;
			let nvs = model.normals;
			let vtxTotal = vs.length / 3;
			let trisNumber = ivs.length / 3;
			let nvs1 = new Float32Array(vs.length);
			SurfaceNormalCalc.ClacTrisNormal(vs, vs.length, trisNumber, ivs, nvs1);
			let v0 = new Vector3D();
			let v1 = new Vector3D();
			let j = 0;
			let total = 0;
			let vtTotal = 0;
			for(let i = 0; i < vtxTotal; ++i) {
				j = i * 3;
				v0.setXYZ(nvs[j], nvs[j+1], nvs[j+2]);
				v1.setXYZ(nvs1[j], nvs1[j+1], nvs1[j+2]);
				vtTotal++;
				if(v0.dot(v1) < 0.5) {
					total++;
				}
			}
			console.log("vtTotal: ", vtTotal, ", 反向法线数量 total: ", total);
        });
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
export default BakedNormal;
