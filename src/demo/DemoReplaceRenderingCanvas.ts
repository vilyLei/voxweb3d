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

export class DemoReplaceRenderingCanvas {
	private m_init = true;
	private m_texLoader: ImageTextureLoader = null;
	private m_rscene: IRendererScene = null;
	constructor() {}
	private m_plane: Plane3DEntity = null;
	private m_axis: Axis3DEntity = null;
	private m_times = 1000000;
	private m_flag = true;
	private m_useAxis = false;
	private getTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): IRenderTexture {
		return this.m_texLoader.getTexByUrl(purl, wrapRepeat, mipmapEnabled);
	}
	initialize(): void {
		console.log("DemoReplaceRenderingCanvas::initialize()......");

		if (this.m_init) {
			this.m_init = false;

			RendererDevice.SHADERCODE_TRACE_ENABLED = false;
			RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
			let rparam = new RendererParam();
			rparam.offscreenRenderEnabled = false;
			rparam.autoAttachingHtmlDoc = true;
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
			rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, (evt: IMouseEvent): void => {
				// let color = new Color4(0.4 * Math.random(), 0.4 * Math.random(), 0.4 * Math.random());
				// rscene.setClearColor(color);
				// new OffscreenCanvas();
				console.log("DemoReplaceRenderingCanvas::initialize(), mouseDown() ... this.m_flag: ", this.m_flag);
				DebugFlag.Flag_0 = 1;
				this.m_times = 3;
				if (this.m_flag) {
					this.m_flag = false;
					if (this.m_useAxis) {
						if (this.m_axis != null) {
							this.m_rscene.removeEntity(this.m_axis);
							this.m_axis = null;
						}
						// this.m_rscene.getRenderProxy().loseContext();
						let pw = 300;
						let ph = 200;
						let canvas = this.createCanvas(pw, ph);
						rscene.setCanvas(canvas);
						let div = rscene.getRenderProxy().getDiv() as any;
						// div.width = pw;
						// div.height = ph;
						div.style.width = pw + "px";
						div.style.height = ph + "px";
						if (this.m_axis == null) {
							let axis = new Axis3DEntity();
							axis.initialize(600.0);
							rscene.addEntity(axis);
							this.m_axis = axis;
						}
					} else {
						if (this.m_pl2 != null) {
							this.m_rscene.removeEntity(this.m_pl2);
							this.m_pl2 = null;
						}
						// this.m_rscene.getRenderProxy().loseContext();
						let canvas = this.createCanvas(300, 200);
						rscene.setCanvas(canvas);
						if (this.m_pl2 == null) {
							this.m_pl2 = new ScreenAlignPlaneEntity();
							this.m_pl2.initialize(-0.5, -0.5, 1, 1, [tex0]);
							rscene.addEntity(this.m_pl2);
						}
					}
					rscene.updateRenderBufferSize();
					rscene.updateCamera();
					rscene.setClearRGBColor3f(0.1, 0.2, 0.0);
					this.m_buildingImg = true;
				}
			});
			// RendererState.CreateRenderState("ADD01", CullFaceMode.BACK, RenderBlendMode.ADD, DepthTestMode.BLEND);
			// RendererState.CreateRenderState("ADD02", CullFaceMode.BACK, RenderBlendMode.ADD, DepthTestMode.ALWAYS);

			let tex0 = this.getTexByUrl("static/assets/default.jpg");
			let tex1 = this.getTexByUrl("static/assets/broken_iron.jpg");
			/*
			document.onmousedown = (evt: any): void => {
				console.log("DemoReplaceRenderingCanvas::initialize(), document.onmousedown() ...");
				return;
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
				if(this.m_axis != null) {
					this.m_rscene.removeEntity(this.m_axis);
					this.m_axis = null;
				}
				this.m_rscene.getRenderProxy().loseContext();
				let canvas = this.createCanvas(300, 200);
				rscene.setCanvas(canvas);

				DebugFlag.Flag_0 = 1;
				if(this.m_axis == null) {
					let axis = new Axis3DEntity();
					axis.initialize(600.0);
					rscene.addEntity(axis);
					this.m_axis = axis;
				}
				rscene.setClearRGBColor3f(0.1,0.2,0.0);
				this.m_buildingImg = true;
				this.m_times = 3;
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
				this.m_pl2.initialize(-0.5, -0.5, 1, 1, [tex0]);
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
		if (this.m_times < 1) {
			return;
		}
		// this.m_times--;
		// if(DebugFlag.Flag_0 > 0) {
		// 	console.log("..............");
		// }
		if (this.m_rscene) {
			this.m_rscene.run();
			if (this.m_buildingImg) {
				this.m_buildingImg = false;
				// this.createCanvasData();
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
		canvas.style.left = "230px";
		canvas.style.top = "230px";
		canvas.style.zIndex = "9999";
		canvas.style.position = "absolute";
		return canvas;
	}
	private createCanvasData(): string {
		if (this.m_drawTimes < 1) {
			return "";
		}
		this.m_drawTimes--;
		const srcCanvas = this.m_rscene.getRenderProxy().getCanvas();
		const canvas = document.createElement("canvas");
		canvas.width = srcCanvas.width * 0.5;
		canvas.height = srcCanvas.height * 1.2;
		canvas.style.display = "bolck";
		canvas.style.zIndex = "9999";
		canvas.style.left = `20px`;
		canvas.style.top = `80px`;
		console.log("createCanvasData(), pw, ph: ", canvas.width, canvas.height, ", this.m_drawTimes: ", this.m_drawTimes);

		const ctx2d = canvas.getContext("2d");
		ctx2d.drawImage(srcCanvas, 0, 0, srcCanvas.width, srcCanvas.height, 0, 0, canvas.width, canvas.height);
		document.body.appendChild(canvas);
		// return canvas.toDataURL('image/jpeg');
		return "";
	}
}
export default DemoReplaceRenderingCanvas;
