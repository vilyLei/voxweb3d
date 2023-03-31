import { Bin4DataLoader } from "./Bin4DataLoader";
import IGeomModelData from "../../../vox/mesh/IGeomModelData";
declare var BakingModule: any;
export class BakedModelViewerTest2 {
	constructor() {}

	private m_init = true;
	private m_viewer: any = null;

	initialize(): void {
		console.log("BakedModelViewerTest2::initialize()......");
		if(this.m_init) {
			this.m_init = false;
			// this.m_viewer = new BakedModelViewer();
			// this.m_viewer.initialize(0,0,512, 512);
			// this.initModel();
			let moduleUrl = "static/private/module/BakingModule.umd.js";
			this.loadModule( moduleUrl );
		}
	}
	private initApp(): void {
		console.log("BakingModule: ", BakingModule);
		this.m_viewer = BakingModule.createModelViewer();
		this.m_viewer.initialize(0,0,512, 512);
		this.initModel();
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
			// this.createEntity(model, tex);
			this.m_viewer.createEntityWithParams(loader.getVS(), loader.getUV2(), loader.getIVS(), tex);
		});
		loader.loadData(vsUrl, uvs1Url, uvs2Url, nvsUrl, "");
	}


	protected loadModule(url: string): void {

		let req = new XMLHttpRequest();
		req.open("GET", url, true);
		req.onerror = function (err) {
			console.error("load error: ", err);
		}
		// req.onprogress = e => { };
		req.onload = evt => {
			this.loadedData(req.response, url);
		}
		req.send(null);
	}

	protected loadedData(data: string | ArrayBuffer, url: string): void {
		console.log("ModuleLoader::loadedData(), module js file loaded, url: ", url);
		let scriptEle = document.createElement("script");
		scriptEle.onerror = evt => {
			console.error("module script onerror, e: ", evt);
		};
		scriptEle.type = "text/javascript";
		try {
			scriptEle.innerHTML = data as string;
			document.head.appendChild(scriptEle);
			this.initApp();
		} catch (e) {
			console.error("ModuleLoader::loadedData() apply script ele error.");
			throw e;
		}
	}
}
export default BakedModelViewerTest2;
