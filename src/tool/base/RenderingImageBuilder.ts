import TextureResLoader from "../../vox/assets/TextureResLoader";
import IColor4 from "../../vox/material/IColor4";
import IRenderEntity from "../../vox/render/IRenderEntity";
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

	initialize(rparam: IRendererParam, color: IColor4): void {
		console.log("RenderingImageBuilder::initialize()......");

		if (this.m_init) {
			this.m_init = false;
			this.rscene = this.m_graph.createScene(rparam);
			this.rscene.setClearColor(color);
		}
	}
	private m_entity: IRenderEntity = null;
	private m_pw = 300;
	private m_ph = 200;
	private m_times = 0;
	private m_name = "";
	setName(ns: string): void {
		if (this.isEnabled()) {
			this.m_name = ns;
			console.log("CCCCCCCCCCCCCCCC this.m_name: ", this.m_name);
		}
	}
	isEnabled(): boolean {
		return this.m_times < 1;
	}
	addEntity(entity: IRenderEntity): void {
		if (this.isEnabled()) {
			if (this.m_entity) {
				this.rscene.removeEntity(this.m_entity);
			}
			entity.update();
			this.m_entity = entity;
			this.rscene.addEntity(entity);
		}
	}
	setSize(pw: number, ph: number): void {
		if (this.isEnabled()) {
			this.m_pw = pw;
			this.m_ph = ph;
			let div = this.rscene.getRenderProxy().getDiv() as any;
			div.style.width = pw + "px";
			div.style.height = ph + "px";
			let canvas = this.createCanvas(pw, ph);
			(this.rscene as any).setCanvas(canvas);
			(this.rscene as any).updateRenderBufferSize();
			// this.rscene.updateCamera();
			// this.rscene.setClearRGBColor3f(0.3 * Math.random(), 0.3 * Math.random(), 0.3 * Math.random());
			this.m_times = 3;
			// this.m_graph.setAutoRunning(true);
		}
	}
	private m_index = 0;
	private createCanvasData(): string {
		let mapEntity = this.m_entity;
		let pw = this.m_pw;
		let ph = this.m_ph;
		const srcCanvas = this.rscene.getRenderProxy().getCanvas();
		const canvas = document.createElement("canvas");
		canvas.width = pw;
		canvas.height = ph;
		let k = 1 + this.m_index++;
		let ri = 1;
		canvas.style.display = "bolck";
		canvas.style.zIndex = "9999";
		canvas.style.left = `${66 + k * 66}px`;
		canvas.style.top = `${200 + ri * 66}px`;
		canvas.style.position = "absolute";
		// canvas.style.width = pw + 'px';
		// canvas.style.width = ph + 'px';
		// let st = this.rscene.getStage3D();
		// let dpr = st.getDevicePixelRatio();
		console.log("RenderingImageBuilder::createCanvasData(), pw, ph: ", pw,ph);
		let pos = mapEntity.getPosition();
		const ctx2d = canvas.getContext("2d");
		ctx2d.drawImage(
			srcCanvas,
			0,0,
			srcCanvas.width,
			srcCanvas.height,
			0,
			0,
			canvas.width,
			canvas.height
		);
		// document.body.appendChild(canvas);
		return canvas.toDataURL('image/jpeg');
		return "";
	}

	private createCanvas(pw: number, ph: number): HTMLCanvasElement {
		const canvas = document.createElement("canvas");
		canvas.width = pw;
		canvas.height = ph;
		canvas.style.display = "bolck";
		canvas.style.position = "absolute";
		return canvas;
	}

	private m_imgData = "";
	private saveImage(): void {
		this.m_imgData = this.createCanvasData();
		this.downloadSavedImage();
	}
	private downloadSavedImage(): void {
		const a = document.createElement('a');
		a.href =  this.m_imgData;
		a.download = this.m_name != "" ? this.m_name + "_new.jpg": "normal.jpg";
		document.body.appendChild(a);
		(a as any).style = 'display: none';
		a.click();
		a.remove();
		this.m_imgData = "";
	}
	run(): void {
		if (this.m_times > 0) {
			// console.log("#### this.m_entity.isInRenderer(): ", this.m_entity.isInRenderer());
			// this.rscene.updateCamera();
			// this.rscene.useMainCamera();
			this.m_graph.run();
			this.m_times--;
			if (this.m_times == 1) {
				// this.m_graph.setAutoRunning(false);
				this.saveImage();
			}
		}
	}
}
export default RenderingImageBuilder;
