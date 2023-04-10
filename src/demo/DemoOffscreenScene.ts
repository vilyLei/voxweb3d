import Vector3D from "../vox/math/Vector3D";
import RendererDevice from "../vox/render/RendererDevice";
import Color4 from "../vox/material/Color4";
import { RenderBlendMode, CullFaceMode, DepthTestMode } from "../vox/render/RenderConst";
import RendererState from "../vox/render/RendererState";
import RendererParam from "../vox/scene/RendererParam";

import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import RendererScene from "../vox/scene/RendererScene";
import MouseEvent from "../vox/event/MouseEvent";

import Box3DEntity from "../vox/entity/Box3DEntity";
import Sphere3DEntity from "../vox/entity/Sphere3DEntity";
import Plane3DEntity from "../vox/entity/Plane3DEntity";
import Axis3DEntity from "../vox/entity/Axis3DEntity";
import IRenderTexture from "../vox/render/texture/IRenderTexture";
import { MouseInteraction } from "../vox/ui/MouseInteraction";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";
import IMouseEvent from "../vox/event/IMouseEvent";
import IRendererScene from "../vox/scene/IRendererScene";
import DebugFlag from "../vox/debug/DebugFlag";
import ScreenAlignPlaneEntity from "../vox/entity/ScreenAlignPlaneEntity";

export class DemoOffscreenScene {
	private m_init = true;
	private m_texLoader: ImageTextureLoader = null;
	private m_rscene: IRendererScene = null;
	constructor() {}
	private m_plane: Plane3DEntity = null;
	private m_axis: Axis3DEntity = null;
	private m_times = 1000000;
	private m_flag = true;
	private m_useAxis = true;
	private getTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): IRenderTexture {
		return this.m_texLoader.getTexByUrl(purl, wrapRepeat, mipmapEnabled);
	}
	initialize(): void {
		console.log("DemoOffscreenScene::initialize()......");

		if (this.m_init) {
			this.m_init = false;

			RendererDevice.SHADERCODE_TRACE_ENABLED = false;
			RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
			let rparam = new RendererParam();
			rparam.offscreenRenderEnabled = true;
			rparam.autoAttachingHtmlDoc = !rparam.offscreenRenderEnabled;
			rparam.autoSyncRenderBufferAndWindowSize = false;
			rparam.divW = 400;
			rparam.divH = 400;
			rparam.setCamProject(45.0, 10.1, 9000.0);
			rparam.setCamPosition(1500.0, 1500.0, 1500.0);
			rparam.syncBgColor = false;

			let rscene = new RendererScene();
			rscene.initialize(rparam);
			this.m_rscene = rscene;

			new MouseInteraction().initialize(rscene, 0, true).setAutoRunning(true);
			new RenderStatusDisplay(rscene, true);

			this.m_texLoader = new ImageTextureLoader(rscene.textureBlock);

			// RendererState.CreateRenderState("ADD01", CullFaceMode.BACK, RenderBlendMode.ADD, DepthTestMode.BLEND);
			// RendererState.CreateRenderState("ADD02", CullFaceMode.BACK, RenderBlendMode.ADD, DepthTestMode.ALWAYS);

			// let tex0 = this.getTexByUrl("static/assets/default.jpg");
			// let tex1 = this.getTexByUrl("static/assets/broken_iron.jpg");
			//*
			document.onmousedown = (evt: any): void => {
				console.log("DemoOffscreenScene::initialize(), document.onmousedown() ...");

				// let canvas = this.m_rscene.getRenderProxy().getCanvas();
				// canvas.width = 300;
				// canvas.height = 200;
				// (this.m_rscene as RendererScene).updateRenderBufferSize(false);

				// if (this.m_plane != null) {
				// 	this.m_rscene.removeEntity(this.m_plane);
				// 	this.m_plane = null;

				// 	let plane = new Plane3DEntity();
				// 	plane.showDoubleFace();
				// 	plane.initializeXOZSquare(650, [tex1]);
				// 	rscene.addEntity(plane);
				// 	this.m_plane = plane;
				// }
				///*
				if (this.m_axis != null) {
					this.m_rscene.removeEntity(this.m_axis);
					this.m_axis = null;
				}
				let pw = Math.round(300 + 200 * Math.random());
				let ph = Math.round(200 + 200 * Math.random());
				this.m_rscene.getRenderProxy().loseContext();
				let div = rscene.getRenderProxy().getDiv() as any;
				div.style.width = pw + "px";
				div.style.height = ph + "px";
				let canvas = this.createCanvas(pw, ph);
				rscene.setCanvas(canvas);

				DebugFlag.Flag_0 = 1;
				if (this.m_axis == null) {
					let axis = new Axis3DEntity();
					axis.initialize(600.0);
					rscene.addEntity(axis);
					this.m_axis = axis;
				}
				rscene.updateRenderBufferSize();
				rscene.setClearRGBColor3f(0.1, 0.2, 0.0);
				//*/
				this.m_buildingImg = true;
				this.m_times = 8;
			};
			//*/
			DebugFlag.Flag_0 = 1;
			if (this.m_useAxis) {
				let axis = new Axis3DEntity();
				axis.initialize(600.0);
				rscene.addEntity(axis);
				this.m_axis = axis;
			} else {
				this.m_pl2 = new ScreenAlignPlaneEntity();
				this.m_pl2.initialize(-0.5, -0.5, 1, 1);
				rscene.addEntity(this.m_pl2);
			}
			// let plane = new Plane3DEntity();
			// plane.showDoubleFace();
			// plane.initializeXOZSquare(650, [tex0]);
			// // plane.setXYZ(Math.random() * 3000.0 - 1500.0, Math.random() * 3000.0 - 1500.0, Math.random() * 1500.0 - 1000.0);
			// rscene.addEntity(plane);
			// this.m_plane = plane;
		}
	}
	private m_pl2: ScreenAlignPlaneEntity = null;
	run(): void {
		// if (this.m_times < 1) {
		// 	// return;
		// }
		this.m_times--;
		// if(DebugFlag.Flag_0 > 0) {
		// 	console.log("..............");
		// }
		if (this.m_rscene) {
			this.m_rscene.run();
			if (this.m_buildingImg && this.m_times == 1) {
				this.m_buildingImg = false;
				this.createCanvasData();
			}
		}
		if (this.m_times > 5) {
			DebugFlag.Flag_0 = 0;
		}
	}
	private m_buildingImg = false;
	private m_drawTimes = 1;
	private createCanvas(pw: number, ph: number): HTMLCanvasElement {
		const canvas = document.createElement("canvas");
		canvas.width = pw;
		canvas.height = ph;
		canvas.style.display = "bolck";
		canvas.style.position = "absolute";
		return canvas;
	}
	private m_zIndex = 999;
	private createCanvasData(): string {
		if (this.m_drawTimes < 1) {
			return "";
		}
		// this.m_drawTimes--;
		const srcCanvas = this.m_rscene.getRenderProxy().getCanvas();
		const canvas = document.createElement("canvas");
		canvas.width = srcCanvas.width;
		canvas.height = srcCanvas.height;
		canvas.style.display = "bolck";
		canvas.style.zIndex = "" + (this.m_zIndex++);
		canvas.style.left = `200px`;
		canvas.style.top = `300px`;
		canvas.style.position = "absolute";
		console.log("createCanvasData(), pw, ph: ", canvas.width, canvas.height, ", this.m_drawTimes: ", this.m_drawTimes);

		const ctx2d = canvas.getContext("2d");
		ctx2d.drawImage(srcCanvas, 0, 0, srcCanvas.width, srcCanvas.height, 0, 0, canvas.width, canvas.height);
		document.body.appendChild(canvas);
		// return canvas.toDataURL('image/jpeg');
		return "";
	}
}
export default DemoOffscreenScene;
