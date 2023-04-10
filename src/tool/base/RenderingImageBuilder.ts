import TextureResLoader from "../../vox/assets/TextureResLoader";
import RendererDevice from "../../vox/render/RendererDevice";
import IRenderTexture from "../../vox/render/texture/IRenderTexture";
import IRendererParam from "../../vox/scene/IRendererParam";
import IRendererScene from "../../vox/scene/IRendererScene";
import RendererSceneGraph from "../../vox/scene/RendererSceneGraph";

export class RenderingImageBuilder {
	private m_init = true;

	private m_graph = new RendererSceneGraph();
	texLoader: TextureResLoader = null;
	rscene: IRendererScene = null;
	
	constructor() {}
	getAssetTexByUrl(pns: string): IRenderTexture {
		return this.getTexByUrl("static/assets/" + pns);
	}
	getTexByUrl(url: string, preAlpha: boolean = false, wrapRepeat: boolean = true, mipmapEnabled = true): IRenderTexture {
		let hostUrl = window.location.href;
		if (hostUrl.indexOf(".artvily.") > 0) {
			hostUrl = "http://www.artvily.com:9090/";
			url = hostUrl + url;
		}
		return this.texLoader.getTexByUrl(url, preAlpha, wrapRepeat, mipmapEnabled);
	}

	initialize(rparam: IRendererParam): void {
		console.log("RenderingImageBuilder::initialize()......");
		if (this.m_init) {
			this.m_init = false;

			// document.oncontextmenu = function(e) {
			// 	e.preventDefault();
			// };
			// RendererDevice.SHADERCODE_TRACE_ENABLED = false;
			// RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;

			// let rparam = new RendererParam(this.createDiv(0,0, 512, 512));
			// let rparam = this.m_graph.createRendererParam();
			// rparam.setCamProject(45, 0.1, 6000.0);
			// rparam.setCamPosition(1100.0, 1100.0, 1100.0);
			// rparam.setAttriAlpha(true);
			// // rparam.setAttriAntialias(true);
			// rparam.offscreenRenderEnabled = true;
			// rparam.autoAttachingHtmlDoc = !rparam.offscreenRenderEnabled;
			// rparam.autoSyncRenderBufferAndWindowSize = false;
			// rparam.syncBgColor = true;
			let rscene = this.m_graph.createScene(rparam);
			rscene.setClearRGBAColor4f(0.0, 0.0, 0.0, 0.0);
			rscene = rscene;

		}
	}
	run(): void {
		this.m_graph.run();
	}
}
export default RenderingImageBuilder;
