import RendererDevice from "../vox/render/RendererDevice";
import RendererParam from "../vox/scene/RendererParam";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";
import Axis3DEntity from "../vox/entity/Axis3DEntity";
import TextureConst from "../vox/texture/TextureConst";
import TextureProxy from "../vox/texture/TextureProxy";

import MouseEvent from "../vox/event/MouseEvent";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import RendererScene from "../vox/scene/RendererScene";
import { MouseInteraction } from "../vox/ui/MouseInteraction";
import { GLTFLoader } from "./loader/GLTFLoader";

export class DemoGLTF {
	constructor() {}

	private m_rscene: RendererScene = null;
	private m_texLoader: ImageTextureLoader = null;
	private getImageTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): TextureProxy {
		let ptex: TextureProxy = this.m_texLoader.getImageTexByUrl(purl);
		ptex.mipmapEnabled = mipmapEnabled;
		if (wrapRepeat) ptex.setWrap(TextureConst.WRAP_REPEAT);
		return ptex;
	}
	initialize(): void {
		console.log("DemoGLTF::initialize()......");
		if (this.m_rscene == null) {

			RendererDevice.SHADERCODE_TRACE_ENABLED = false;
			RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
			//RendererDevice.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;
			let rparam = new RendererParam();
			rparam.setCamPosition(800.0, 800.0, 800.0);
			rparam.setAttriAntialias(true);
			rparam.setAttriStencil(true);

			this.m_rscene = new RendererScene();
			this.m_rscene.initialize(rparam, 3);
			this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);

			new RenderStatusDisplay(this.m_rscene, true);
			new MouseInteraction().initialize(this.m_rscene, 0, true).setAutoRunning(true);

			this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);

			let axis = new Axis3DEntity();
			axis.initialize(500.0);
			this.m_rscene.addEntity(axis, 1);

			this.m_rscene.setClearUint24Color(0x265d7e);

			// this.initTest();
			this.init();
		}
	}
	private init(): void {
		console.log(">>>>>>>>>>>>>>>>>>>>>>  init  >>>>>>>>>>>>>>>>>>>>>>>>>");
		let loader = new GLTFLoader();
		loader.initialize();
	}
	private initTest(): void {
		let purl: string = "static/assets/gltf/sample01/sample01.gltf";

		const request = new XMLHttpRequest();
		request.open("GET", purl, true);
		request.responseType = "text";
		request.onload = () => {
			//reader.readAsArrayBuffer(request.response);
			//console.log("request.response: ",request.response);
			let gltf: any = JSON.parse(request.response);
			console.log(gltf);
		};
		request.send();
	}
	private mouseDown(evt: any): void {
		console.log("mouse down... ...");
	}
	run(): void {
		this.m_rscene.run();
	}
}
export default DemoGLTF;
