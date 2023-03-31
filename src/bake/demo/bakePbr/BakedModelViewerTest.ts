import { Bin4DataLoader } from "./Bin4DataLoader";
import IGeomModelData from "../../../vox/mesh/IGeomModelData";
import BakedModelViewer from "./BakedModelViewer";

export class BakedModelViewerTest {
	constructor() {}

	private m_viewer: BakedModelViewer = null;

	initialize(): void {
		console.log("BakedModelViewerTest::initialize()......");
		if(this.m_viewer == null) {
			this.m_viewer = new BakedModelViewer();
			this.m_viewer.initialize(0,0,512, 512);
			this.initModel();
		}
	}

	private initModel(): void {
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
			let tex = this.m_viewer.getTexByUrl(bakeUrl);
			// tex.flipY = true;
			// this.createEntity(model, tex);
			this.m_viewer.createEntityWithParams(loader.getVS(), loader.getUV2(), loader.getIVS(), tex);
		});
		loader.loadData(vsUrl, uvs1Url, uvs2Url, nvsUrl, "");
	}
}
export default BakedModelViewerTest;
