import RendererDevice from "../vox/render/RendererDevice";
import IRenderTexture from "../vox/render/texture/IRenderTexture";
import TextureResLoader from "../vox/assets/TextureResLoader";
import MouseEvent from "../vox/event/MouseEvent";
import IRendererScene from "../vox/scene/IRendererScene";
import RendererSceneGraph from "../vox/scene/RendererSceneGraph";
import { IFileUrlObj, IDropFileListerner, DropFileController } from "./base/DropFileController";
import { Background3D } from "./bgtoy/ui/Background3D";
import Plane3DEntity from "../vox/entity/Plane3DEntity";
import DebugFlag from "../vox/debug/DebugFlag";

export class DemoBgRTT {
	private m_init = true;

	private m_graph = new RendererSceneGraph();
	private m_texLoader: TextureResLoader = null;
	private m_rscene: IRendererScene = null;
	private m_dropController = new DropFileController();
	private m_background = new Background3D();
	constructor() {}

	private getAssetTexByUrl(pns: string): IRenderTexture {
		return this.getTexByUrl("static/assets/" + pns);
	}
	private getTexByUrl(url: string, preAlpha: boolean = false, wrapRepeat: boolean = true, mipmapEnabled = true): IRenderTexture {
		return this.m_texLoader.getTexByUrl(url, preAlpha, wrapRepeat, mipmapEnabled);
	}

	initialize(): void {
		console.log("DemoBgRTT::initialize()......");
		if (this.m_init) {
			this.m_init = false;

			document.oncontextmenu = function(e) {
				e.preventDefault();
			};

			RendererDevice.SHADERCODE_TRACE_ENABLED = false;
			RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;

			let rparam = this.m_graph.createRendererSceneParam();
            rparam.setCamProject(45, 0.1, 6000.0);
            rparam.setCamPosition(1500.0, 1500.0, 1500.0);
			// rparam.autoSyncRenderBufferAndWindowSize = true;
			// 保持 html body color 和 renderer clear color 同步，以便正确表现alpha混合
			// rparam.syncBgColor = false;

			let rscene = this.m_graph.createScene(rparam);
			// rscene.initialize(rparam).setAutoRunning(true);
			rscene.setClearRGBAColor4f(0.2, 0.3, 0.2, 0.0);
			rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);
			this.m_rscene = rscene;
			this.m_texLoader = new TextureResLoader(rscene);
			rscene.enableMouseEvent(true);
			// new MouseInteraction().initialize(rscene, 0, true).setAutoRunning(true);
			// new RenderStatusDisplay(rscene, true);

			this.m_background.bgEnabled = false;
			this.m_background.initialize( rscene );
			this.initScene();
		}
	}
	private initScene(): void {
		console.log("DemoBgRTT::initScene() ... ...");
		let sc = this.m_rscene;
		let plane = new Plane3DEntity();
		plane.alignScreen = true;
		plane.initializeXOYSquare(0.6, [this.m_background.getFBOTex()]);
		plane.getMaterial().uuid = "scp";
		// plane.initializeXOYSquare(0.6);
		sc.addEntity(plane, 1, false);
	}

	private mouseDown(evt: any): void {
		console.log("mouseDown() ...");
		DebugFlag.Flag_0 = 1;
		this.m_times = 1;
	}
	private m_times = 0;
	run(): void {
		this.m_times --;
		this.m_graph.run();
		DebugFlag.Flag_0 = 0;
	}
}
export default DemoBgRTT;
