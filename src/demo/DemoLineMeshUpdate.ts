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

export class DemoLineMeshUpdate {
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
		console.log("DemoLineMeshUpdate::initialize()......");
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

			console.log("line::initialize()......XXXXXXXXXXXXXXXXXXXXXXXXXXXX");
			this.m_line = new Line3DEntity();
			this.m_line.initializeByPosList(this.m_posList);
			this.m_rscene.addEntity(this.m_line);

			// let posList = [new Vector3D(), new Vector3D(200, 0, -200), new Vector3D(150,0,150)];
			// let line = new Line3DEntity();
			// line.dynColorEnabled = true;
			// line.initializeByPosList( posList );
			// line.setRGB3f(0.0, 0.8, 0.1);
			// line.setXYZ(0,-10,0);
			// this.m_rscene.addEntity( line );
		}
	}
	private m_posList = [new Vector3D(), new Vector3D(100), new Vector3D(150, 0, 150)];
	private m_line: Line3DEntity = null;
	private m_flag = true;
	private mouseBgDown(evt: any): void {}
	private mouseDown(evt: any): void {
		console.log("mouse down... ...");
		if (this.m_flag) {
			this.m_flag = false;
			// let posList = [new Vector3D(), new Vector3D(200, 0, -200), new Vector3D(170, 0, 170)];
			let posList = [new Vector3D(), new Vector3D(200, 0, -200), new Vector3D(170, 0, 170), new Vector3D(210,0,190)];
			this.m_line.initializeByPosList(posList);
			this.m_line.reinitializeMesh();
			this.m_line.updateMeshToGpu();
		}

		DebugFlag.Flag_0 = 1;
	}

	updateCurve(factor: number, radiusFactor: number): void {
		let posList = this.getCurvePosList(factor, radiusFactor);
		this.drawCurve(posList, factor, radiusFactor);
	}

	private m_bezier2 = new Bezier2Curve();
	getCurvePosList(factor: number, radiusFactor: number): Vector3D[] {
		let total = 20;
		let y0 = 300;
		let y1 = 70;
		let dy = Math.abs(y1 - y0);
		this.m_bezier2.begin.setXYZ(0, y0, 0);
		this.m_bezier2.end.setXYZ(dy + 1.0, y1, 0);
		this.m_bezier2.setSegTot(total);

		let dis = Vector3D.Distance(this.m_bezier2.begin, this.m_bezier2.end);

		let direcTV = new Vector3D();
		direcTV.subVecsTo(this.m_bezier2.end, this.m_bezier2.begin);
		let direcNV = new Vector3D(-direcTV.y, direcTV.x);
		direcNV.normalize();
		direcNV.scaleBy(radiusFactor * dy);

		direcTV.normalize();
		direcTV.scaleBy(dis * factor);
		this.m_bezier2.ctrPos.addVecsTo(direcTV, this.m_bezier2.begin);
		this.m_bezier2.ctrPos.addBy(direcNV);

		this.m_bezier2.updateCalc();
		return this.m_bezier2.getPosList();
	}

	private m_curveLS: Line3DEntity = null;
	private drawCurve(posList: Vector3D[], factor: number, radiusFactor: number): void {
		if (this.m_curveLS != null) {
			radiusFactor = radiusFactor * 0.5 + 0.5;
			let f = factor * radiusFactor;
			this.m_curveLS.setRGB3f(factor, radiusFactor, f);
			this.m_curveLS.initializeByPosList(posList);
			this.m_curveLS.reinitializeMesh();
			this.m_curveLS.updateMeshToGpu();
			return;
		}
		let ls = new Line3DEntity();
		this.m_curveLS = ls;
		ls.dynColorEnabled = true;
		ls.initializeByPosList(posList);
		radiusFactor = radiusFactor * 0.5 + 0.5;
		let f = factor * radiusFactor;
		ls.setRGB3f(factor, radiusFactor, f);
		ls.setXYZ(50, 100, 1);
		// this.m_ruisc.addEntity(ls);
		// if (this.m_flag0) {
		//     this.m_flag0 = false;
		//     ls = new Line3DEntity();
		//     ls.dynColorEnabled = true;
		//     //ls.setRGB3f(0.0,1.0,0.0);
		//     ls.initializeByPosList([this.m_bezier2.begin, this.m_bezier2.end]);
		//     ls.setXYZ(50, 100, 1);
		//     this.m_ruisc.addEntity(ls);
		// }
	}
	run(): void {
		if (this.m_rscene) {
			this.m_rscene.run();
		}
		DebugFlag.Reset();
	}
}
export default DemoLineMeshUpdate;
