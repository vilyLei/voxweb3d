import RendererDevice from "../vox/render/RendererDevice";
import RendererParam from "../vox/scene/RendererParam";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";
import TextureConst from "../vox/texture/TextureConst";
import TextureProxy from "../vox/texture/TextureProxy";

import MouseEvent from "../vox/event/MouseEvent";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import RendererScene from "../vox/scene/RendererScene";
import DebugFlag from "../vox/debug/DebugFlag";
import Vector3D from "../vox/math/Vector3D";
import Line3DEntity from "../vox/entity/Line3DEntity";
import { Bezier2Curve } from "../vox/geom/curve/BezierCurve";
import { MouseInteraction } from "../vox/ui/MouseInteraction";

export class DemoLinePosUpdate {
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
		console.log("DemoLinePosUpdate::initialize()......");
		if (this.m_rscene == null) {
			RendererDevice.SHADERCODE_TRACE_ENABLED = false;
			RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
			//RendererDevice.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;
			let rparam = new RendererParam();
			//rparam.maxWebGLVersion = 1;
			rparam.setCamPosition(800.0, 800.0, 800.0);
			rparam.setAttriAntialias(true);
			//rparam.setAttriStencil(true);
			rparam.setAttriAlpha(true);

			this.m_rscene = new RendererScene();
			this.m_rscene.initialize(rparam, 3);
			this.m_rscene.updateCamera();

			this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);

			new MouseInteraction().initialize(this.m_rscene).setAutoRunning(true);
			new RenderStatusDisplay(this.m_rscene, true);

			this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);
			// this.m_rscene.addEventListener(MouseEvent.MOUSE_BG_DOWN, this, this.mouseBgDown);

			let total = 50;
			let posList = this.m_posList = new Array();
			for(let i = 0; i < total; ++i) {
				posList[i] = new Vector3D(i * 5.0);
			}

			this.m_line = new Line3DEntity();
			this.m_line.initializeByPosList(this.m_posList);
			this.m_rscene.addEntity(this.m_line);
		}
	}
	private m_posList: Vector3D[];
	private m_line: Line3DEntity = null;
	private m_time = 0;
	private updateCurveData(): void {

		let posList = this.m_posList;
		for (let i = 0; i < posList.length; ++i) {
			posList[i].y = Math.cos(posList[i].x * 0.05 + this.m_time) * 100.0;
		}
		this.m_time += 0.05;
		this.m_line.updatePosListToMesh(posList);
		this.m_line.updateMeshToGpu();
	}
	private mouseDown(evt: any): void {
		console.log("mouse down... ...");

		this.updateCurveData();
	}

	run(): void {
		if (this.m_rscene) {
			this.updateCurveData();
			this.m_rscene.run();
		}
		DebugFlag.Reset();
	}
}
export default DemoLinePosUpdate;
