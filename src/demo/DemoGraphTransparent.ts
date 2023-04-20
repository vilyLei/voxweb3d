import RendererDevice from "../vox/render/RendererDevice";
import RendererParam from "../vox/scene/RendererParam";

import DisplayEntity from "../vox/entity/DisplayEntity";
import RendererScene from "../vox/scene/RendererScene";
import DivLog from "../vox/utils/DivLog";
import Default3DMaterial from "../vox/material/mcase/Default3DMaterial";
import Box3DEntity from "../vox/entity/Box3DEntity";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";
import { MouseInteraction } from "../vox/ui/MouseInteraction";
import DefaultPassGraph from "../vox/render/pass/DefaultPassGraph";
import ConvexTransparentPassItem from "./pass/ConvexTransParentPassItem";
import Sphere3DEntity from "../vox/entity/Sphere3DEntity";
import IRenderTexture from "../vox/render/texture/IRenderTexture";
import TextureResLoader from "../vox/assets/TextureResLoader";
import TextureConst from "../vox/texture/TextureConst";

export class DemoGraphTransparent {
	private m_init = true;
	private m_texLoader: TextureResLoader = null;
	constructor() {}

	private getAssetTexByUrl(pns: string): IRenderTexture {
		return this.getTexByUrl("static/assets/" + pns);
	}
	private getTexByUrl(url: string, preAlpha: boolean = false, wrapRepeat: boolean = true, mipmapEnabled = true): IRenderTexture {
		let hostUrl = window.location.href;
		if (hostUrl.indexOf(".artvily.") > 0) {
			hostUrl = "http://www.artvily.com:9090/";
			url = hostUrl + url;
		}
		return this.m_texLoader.getTexByUrl(url, preAlpha, wrapRepeat, mipmapEnabled);
	}

	initialize(): void {
		console.log("DemoGraphTransparent::initialize()......");
		if (this.m_init) {
			this.m_init = false;

			document.oncontextmenu = function(e) {
				// e.preventDefault();
			};

			RendererDevice.SHADERCODE_TRACE_ENABLED = false;
			RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;

			let rparam = new RendererParam();
			rparam.setCamProject(45, 0.1, 6000.0);
			rparam.setCamPosition(1100.0, 1100.0, 1100.0);
			// 保持 html body color 和 renderer clear color 同步，以便正确表现alpha混合
			// rparam.syncBgColor = false;

			let rscene = new RendererScene();
			rscene.initialize(rparam).setAutoRunning(true);
			rscene.setClearRGBAColor4f(0.0, 0.0, 0.0, 1.0);

			this.m_texLoader = new TextureResLoader(rscene);

			new MouseInteraction().initialize(rscene, 0, true).setAutoRunning(true);
			new RenderStatusDisplay(rscene, true);

			this.initScene(rscene);
		}
	}
	private testDataMesh(rscene: RendererScene): void {

		// 推荐的模型数据组织形式
		let alpha = 0.5;
		let material = new Default3DMaterial();
		material.setAlpha(alpha);
		material.normalEnabled = true;
		material.setTextureList([this.getTexByUrl("static/assets/blueTransparent.png", true)]);

		let sph = new Sphere3DEntity();
		sph.setMaterial(material);
		sph.initialize(160, 20, 20);

		let graph = new DefaultPassGraph().addItem(new ConvexTransparentPassItem()).initialize();
		material.graph = graph;

		let entity = new DisplayEntity();
		entity.setMaterial(material);
		entity.copyMeshFrom(sph);
		entity.setRotationXYZ(0, 0, 150);
		rscene.addEntity(entity, 1);

		material = new Default3DMaterial();
		material.graph = graph;
		material.setAlpha(alpha);
		material.normalEnabled = true;
		material.setTextureList([this.getTexByUrl("static/assets/redTransparent.png", true)]);

		entity = new DisplayEntity();
		entity.setMaterial(material);
		entity.copyMeshFrom(sph);
		entity.setXYZ(0, 0, -200);
		rscene.addEntity(entity, 1);
	}

	private initScene(rscene: RendererScene): void {
		this.initEntities(rscene);
		this.testDataMesh(rscene);
	}

	private initEntities(rscene: RendererScene): void {
		let box0 = new Box3DEntity();
		box0.normalEnabled = true;
		box0.initializeCube(100, [this.getTexByUrl("static/assets/box.jpg")]);
		rscene.addEntity(box0);
	}
}
export default DemoGraphTransparent;
