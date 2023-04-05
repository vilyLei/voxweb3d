import RendererDevice from "../vox/render/RendererDevice";
import RendererParam from "../vox/scene/RendererParam";

import RendererScene from "../vox/scene/RendererScene";
import Default3DMaterial from "../vox/material/mcase/Default3DMaterial";
import Box3DEntity from "../vox/entity/Box3DEntity";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";
import { MouseInteraction } from "../vox/ui/MouseInteraction";
import DefaultPassGraph from "../vox/render/pass/DefaultPassGraph";
import StencilOutlinePassItem from "./pass/StencilOutlinePassItem";
import Sphere3DEntity from "../vox/entity/Sphere3DEntity";
import IRenderTexture from "../vox/render/texture/IRenderTexture";
import TextureResLoader from "../vox/assets/TextureResLoader";
import Cylinder3DEntity from "../vox/entity/Cylinder3DEntity";

export class DemoGraphStencil {
	private m_init = true;
	private m_texLoader: TextureResLoader = null;
	private m_rscene: RendererScene = null;
	constructor() {}

	// private getTexByUrl(purl: string, preAlpha: boolean = false, wrapRepeat: boolean = true, mipmapEnabled = true): IRenderTexture {
	// 	return this.m_texLoader.getTexByUrl(purl, preAlpha, wrapRepeat, mipmapEnabled);
	// }

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
		console.log("DemoGraphStencil::initialize()......");
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
			rparam.setAttriStencil(true);

			let rscene = new RendererScene();
			rscene.initialize(rparam).setAutoRunning(true);
			rscene.setClearRGBAColor4f(0.0, 0.0, 0.0, 0.0);

			this.m_rscene = rscene;
			this.m_texLoader = new TextureResLoader(rscene);

			new MouseInteraction().initialize(rscene, 0, true).setAutoRunning(true);
			new RenderStatusDisplay(rscene, true);

			this.initScene(rscene);
		}
	}
	private initScene(rscene: RendererScene): void {

		let material = new Default3DMaterial();
		material.normalEnabled = true;
		material.setTextureList([this.getTexByUrl("static/assets/box.jpg")]);

		/**
		 * 应用material(pass) graph机制
		 */
		material.graph = new DefaultPassGraph().addItem(new StencilOutlinePassItem()).initialize();

		let sph = new Sphere3DEntity();
		sph.setMaterial(material);
		sph.initialize(110, 30, 30);
		sph.setXYZ(-200, 0, -200);
		rscene.addEntity(sph);

		// let cly = new Cylinder3DEntity();
		// cly.normalEnabled =  true;
		// cly.initialize(70, 130, 30, [this.getTexByUrl("static/assets/box.jpg")]);
		// cly.setXYZ(0, 0, 200);
		// rscene.addEntity(cly);

		let box = new Box3DEntity();
		box.setMaterial(material);
		box.initializeCube(200.0);
		this.m_rscene.addEntity(box);
	}
}
export default DemoGraphStencil;
