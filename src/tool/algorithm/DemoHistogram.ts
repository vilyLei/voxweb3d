import RendererDevice from "../../vox/render/RendererDevice";
import RendererParam from "../../vox/scene/RendererParam";

import RendererScene from "../../vox/scene/RendererScene";
import IRenderTexture from "../../vox/render/texture/IRenderTexture";
import TextureResLoader from "../../vox/assets/TextureResLoader";
import MouseEvent from "../../vox/event/MouseEvent";
import IRendererScene from "../../vox/scene/IRendererScene";
import { CtrlInfo, ItemCallback, CtrlItemParam, ParamCtrlUI } from "../../orthoui/usage/ParamCtrlUI";
import RendererSceneGraph from "../../vox/scene/RendererSceneGraph";
import Plane3DEntity from "../../vox/entity/Plane3DEntity";
import { IFileUrlObj, IDropFileListerner, DropFileController } from "../base/DropFileController";
import Color4 from "../../vox/material/Color4";
import { MouseInteraction } from "../../vox/ui/MouseInteraction";
import RenderStatusDisplay from "../../vox/scene/RenderStatusDisplay";
import Default3DMaterial from "../../vox/material/mcase/Default3DMaterial";
import ImageTextureProxy from "../../vox/texture/ImageTextureProxy";

interface DataSrc {
	data: Uint8ClampedArray;
	rows: number;
	cols: number;
}
class HistogramTool {
	constructor(){}

	private createCanvasFromImg(img: HTMLImageElement | HTMLCanvasElement): DataSrc {

		let pw = img.width;
		let ph = img.height;

		const srcCanvas = img;
		const canvas = document.createElement('canvas');
		canvas.width = pw;
		canvas.height = ph;
		canvas.style.display = 'bolck';

		const ctx2d = canvas.getContext('2d')!;
		ctx2d.drawImage(
			srcCanvas,
			0,
			0,
			srcCanvas.width,
			srcCanvas.height,
			0,
			0,
			canvas.width,
			canvas.height,
		);
		let fontTexData = ctx2d.getImageData(0, 0, pw, ph);
		let pixData = fontTexData.data;
		return {rows: ph, cols: pw, data: pixData};
	}

	calcFloatThreshold(img: HTMLImageElement | HTMLCanvasElement): number {
		let dataSrc = this.createCanvasFromImg(img);
		let threshold = this.calcThreshold(dataSrc);
		console.log("threshold: ", threshold);
		return threshold;
	}
	calcFloatThresholdWithImg(img: HTMLImageElement | HTMLCanvasElement): number {
		let threshold = this.calcFloatThreshold(img);
		let thresholdFloat = threshold / 255.0;
		console.log("thresholdFloat: ", thresholdFloat);
		return thresholdFloat;
	}
	//大津算法(Otsu's method)
	calcThreshold(src: DataSrc): number {
		let hist = new Uint16Array(256);
		let total = src.rows * src.cols;
		let data = src.data;
		let j = 0, h = 0;

		for (let i = 0; i < total; i++) {
			j = i * 4;
			h = Math.round(( data[j] + data[j+1] + data[j+2] )* 0.33333);
			hist[h]++;
		}
		let sum = 0;
		for (let i = 0; i < 256; i++) {
			sum += i * hist[i];
		}
		let w0 = 0, w1 = 0;
		let sum0 = 0, sum1 = 0;
		let max_b = 0, threshold = 0;
		for (let i = 0; i < 256; i++) {
			w0 += hist[i];
			if (w0 == 0) {
				continue;
			}
			w1 = total - w0;
			if (w1 == 0) {
				break;
			}
			sum0 += i * hist[i];
			sum1 = sum - sum0;
			const mu0 = sum0 / w0;
			const mu1 = sum1 / w1;
			const b = w0 * w1 * (mu0 - mu1) * (mu0 - mu1);
			if (b > max_b) {
				max_b = b;
				threshold = i;
			}
		}
		return threshold;
	}
}
export class DemoHistogram {
	private m_init = true;

	private m_texUrl = "static/assets/circleWave_disp.png";
	private m_graph = new RendererSceneGraph();
	private m_texLoader: TextureResLoader = null;
	private m_rscene: IRendererScene = null;
	private m_ctrlui = new ParamCtrlUI(false);
	private m_div: HTMLDivElement = null;
	private m_dropController = new DropFileController();
	private m_histogramTool = new HistogramTool();
	constructor() {}

	private getAssetTexByUrl(pns: string): IRenderTexture {
		return this.getTexByUrl("static/assets/" + pns);
	}

	getTexByUrl(url: string, preAlpha: boolean = false, wrapRepeat: boolean = true, mipmapEnabled = true): IRenderTexture {
		if(url.indexOf("blob:") < 0) {
			console.log("use common tex url");
			let hostUrl = window.location.href;
			if (hostUrl.indexOf(".artvily.") > 0) {
				hostUrl = "http://www.artvily.com:9090/";
				url = hostUrl + url;
			}
		}
		return this.m_texLoader.getTexByUrl(url, preAlpha, wrapRepeat, mipmapEnabled);
	}
	initialize(): void {
		console.log("DemoHistogram::initialize()......");
		if (this.m_init) {
			this.m_init = false;

			document.oncontextmenu = function(e) {
				e.preventDefault();
			};

			RendererDevice.SHADERCODE_TRACE_ENABLED = false;
			RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;

			let rparam = new RendererParam();
			rparam.setCamProject(45, 0.1, 6000.0);
			rparam.setCamPosition(1100.0, 1100.0, 1100.0);
			rparam.setAttriAlpha(true);
			// rparam.autoSyncRenderBufferAndWindowSize = false;
			// 保持 html body color 和 renderer clear color 同步，以便正确表现alpha混合
			rparam.syncBgColor = false;

			let rscene = this.m_graph.createScene(rparam);
			rscene.setClearRGBAColor4f(0.2, 0.3, 0.2, 1.0);
			rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);

			this.m_rscene = rscene;
			this.m_texLoader = new TextureResLoader(rscene);

			new MouseInteraction().initialize(rscene, 0, true).setAutoRunning(true);
			new RenderStatusDisplay(rscene, true);

			this.initScene(rscene);
			this.initUI();

			this.m_dropController.initialize(document.body as any, this);
			this.initTextDiv();

		}
	}
	private initTextDiv(): void {
	}
	private m_dropEnabled = true;
	initFileLoad(files: IFileUrlObj[]): void {
	}
	isDropEnabled(): boolean {
		return this.m_dropEnabled;
	}
	private m_name = "";
	private loadedRes(url: string, name: string): void {
		// console.log("loadedRes A, url: ", url,", name: ", name);
		if(name.indexOf(".") > 0) {
			name = name.slice(0, name.indexOf("."));
		}
		console.log("loadedRes, url: ", url,", name: ", name);
		this.m_name = name;
	}
	private mouseDown(evt: any): void {
		console.log("mouseDown() ...");
	}
	private m_currEntity: Plane3DEntity = null;
	private m_currTexture: IRenderTexture = null;
	private initScene(rscene: IRendererScene): void {

		this.m_loadingTex = this.getTexByUrl( this.m_texUrl );
	}
	private m_loadingTex: IRenderTexture = null;

	private createAEntityByTexUrl(url: string): void {
		if(this.m_currEntity) {
			this.m_rscene.removeEntity(this.m_currEntity);
		}
		let tex = this.getTexByUrl(url) as ImageTextureProxy;
		let texData = tex.getTexData();
		console.log("xxx texData: ", texData);

		let ht = this.m_histogramTool;
		let threshold = ht.calcFloatThresholdWithImg(texData.data as HTMLImageElement);
		let thresholdStr = threshold.toFixed(4);

		console.log("thresholdStr: ", thresholdStr);

		let plane = new Plane3DEntity();

		plane.materialName = "threshold";
		plane.materialFragBodyTailCode = `
	float threshold = ${thresholdStr};
	FragColor0.xyz = length(FragColor0.xyz) > threshold ? vec3(1.0) : vec3(0.0);
		`;

		plane.initializeXOZSquare(500, [tex]);
		this.m_rscene.addEntity( plane );
		this.m_currEntity = plane;
	}
	private m_savingImg = false;
	private m_initUI = true;
	private m_bgColor = new Color4();
	private initUI(): void {
		if (!this.m_initUI) {
			return;
		}
		this.m_initUI = false;

		let ui = this.m_ctrlui;
		ui.fontBgColor.setRGBA4f(0.7,0.8,0.6, 0.6);
		ui.proBarBGBarAlpha = 0.9;
		ui.proBarBGPlaneAlpha = 0.7;
		ui.initialize(this.m_rscene, true);

		ui.addStatusItem("保存", "save", "图片", "图片", true, (info: CtrlInfo): void => {
			// this.m_savingImg = true;
		}, true, false);
		// ui.addValueItem("透明度比例", "alpha_factor", 1.0, 0.0, 3.0, (info: CtrlInfo): void => {
		// 	if(this.m_currMaterial) {
		// 		this.m_currMaterial.setParam0(info.values[0]);
		// 	}
		// }, false, true, null, false);

		this.m_graph.addScene(ui.ruisc);
	}
	private setUIItemValue(ns: string, value: number, syncEnabled: boolean = true): void {
		let item = this.m_ctrlui.getItemByUUID(ns);
		item.param.value = value;
		item.syncEnabled = syncEnabled;
		item.updateParamToUI();
	}
	private resetCtrlValue(): void {
		console.log("resetCtrlValue() ...");
		this.setUIItemValue("alpha_factor", 			1.0);
	}


	private m_rflag = false;
	private saveBegin(): void {

		let pw = this.m_currTexture.getWidth();
		let ph = this.m_currTexture.getHeight();
		let div = this.m_div;
		div.style.width = pw + "px";
		div.style.height = ph + "px";
		(this.m_rscene as RendererScene).updateRenderBufferSize();
		if(this.m_currEntity) {
			this.m_currEntity.setXYZ(0,0,0);
			this.m_currEntity.setScaleXYZ(1.0, 1.0, 1.0);
			this.m_currEntity.update();
		}
	}
	private saveEnd(): void {
		let pw = 512;
		let ph = 512;
		let div = this.m_div;
		div.style.width = pw + "px";
		div.style.height = ph + "px";
		(this.m_rscene as RendererScene).updateRenderBufferSize();
		this.layoutEntity();
	}
	private createCanvasData(): string {

		let pw = this.m_currTexture.getWidth();
		let ph = this.m_currTexture.getHeight();

		const srcCanvas = this.m_rscene.getRenderProxy().getCanvas();
		const canvas = document.createElement('canvas');
		canvas.width = pw;
		canvas.height = ph;
		canvas.style.display = 'bolck';

		const ctx2d = canvas.getContext('2d')!;
		ctx2d.drawImage(
			srcCanvas,
			0,
			0,
			srcCanvas.width,
			srcCanvas.height,
			0,
			0,
			canvas.width,
			canvas.height,
		);

		return canvas.toDataURL('image/png');
	}
	private saveImage(): void {
		const a = document.createElement('a');
		a.href = this.createCanvasData();
		a.download = this.m_name != "" ? this.m_name + "_new.png": "pngfile.png";
		document.body.appendChild(a);
		(a as any).style = 'display: none';
		a.click();
		a.remove();
	}
	private layoutEntity(): void {
		let pw = this.m_currTexture.getWidth();
		let ph = this.m_currTexture.getHeight();
		if(this.m_currEntity) {
			let k = pw / ph;
			ph = 0.5;
			pw = k * ph;
			if(pw > 0.8) {
				k = 0.8 / pw;
				pw *= k;
				ph *= k;
			}
			// this.m_currEntity.setXYZ(0.0, 0.1, 0.5);
			this.m_currEntity.setXYZ(0.0, 0.1, 0.0);
			this.m_currEntity.setScaleXYZ(pw, ph, 1.0);
			this.m_currEntity.update();
		}
	}
	run(): void {
		// if(this.m_loadingTex && this.m_loadingTex.isDataEnough()) {
		// 	this.layoutEntity();
		// 	this.m_loadingTex = null;
		// }
		// if(this.m_savingImg) {
		// 	this.m_ctrlui.ruisc.disable();
		// 	this.m_rflag = true;
		// 	this.saveBegin();
		// }
		if(this.m_loadingTex && this.m_loadingTex.isDataEnough()) {
			this.m_loadingTex = null;
			this.createAEntityByTexUrl( this.m_texUrl );
		}
		this.m_graph.run();
		// if(this.m_rflag && this.m_savingImg) {
		// 	this.saveImage();
		// 	this.m_savingImg = false;
		// 	this.m_ctrlui.ruisc.enable();
		// 	this.m_rflag = false;
		// 	this.saveEnd();
		// }
	}
}
export default DemoHistogram;
