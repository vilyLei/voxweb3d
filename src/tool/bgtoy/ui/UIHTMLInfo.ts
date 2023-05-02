import IRendererScene from "../../../vox/scene/IRendererScene";
import IAABB2D from "../../../vox/geom/IAABB2D";
import RendererDevice from "../../../vox/render/RendererDevice";
import AABB2D from "../../../vox/geom/AABB2D";

class UIHTMLInfo {
	private m_rscene: IRendererScene = null;
	private m_areaRect: IAABB2D = null;
	private m_uiInited = false;
	constructor() {}

	initialize(ruisc: IRendererScene): void {
		if (this.m_rscene == null && ruisc != null) {
			this.m_rscene = ruisc;

			this.m_uiInited = true;
			this.initIntroTextDiv();
		}
	}
	applyFunction(key: string): void {
		switch (key) {
			case "open_award":
				if (this.m_introDiv) {
					this.m_introDiv.style.visibility = "hidden";
				}
				break;
			case "close_award":
				if (this.m_introDiv) {
					this.m_introDiv.style.visibility = "visible";
				}
				break;
			default:
				break;
		}
	}
	hideSpecInfos(): void {
		if (this.m_introDiv && this.m_introDiv.parentElement) {
			document.body.removeChild(this.m_introDiv);
		}
	}
	private m_rect = new AABB2D();
	updateLayout(rect: IAABB2D = null): void {
		if(rect) {
			this.m_areaRect = rect;
		}else {
			rect = this.m_areaRect;
		}
		if (this.m_uiInited) {
			let st = this.m_rscene.getStage3D();

			let drpK = 1.0 / st.getDevicePixelRatio();

			let pr = this.m_rect;
			pr.copyFrom(rect);
			pr.scaleBy(drpK);

			if (this.m_introDiv && this.m_introDiv.parentElement) {

				let div = this.m_introDiv;
				let docrect = div.getBoundingClientRect();

				let tx = pr.getCenterX() - (docrect.width + pr.height) * 0.5;
				let ty = pr.getCenterY() + pr.height * 0.5;

				div.style.left = tx + "px";
				div.style.top = ty + "px";
			}
			if (this.m_contactWithMeDiv) {
				let div = this.m_contactWithMeDiv;
				let docrect = div.getBoundingClientRect();
				let tx = (st.viewWidth - docrect.width) * 0.5;
				let ty = st.viewHeight - docrect.height;
				div.style.left = tx + "px";
				div.style.top = ty + "px";
			}
			if (this.m_versionDiv) {
				let div = this.m_versionDiv;
				let docrect = div.getBoundingClientRect();
				let tx = (st.viewWidth - docrect.width) * 0.5;
				let ty = st.viewHeight - docrect.height * 2.0;
				div.style.left = tx + "px";
				div.style.top = ty + "px";
			}
			if(this.m_areaInfoDiv) {
				let div = this.m_areaInfoDiv;
				let docrect = div.getBoundingClientRect();

				let tx = pr.getCenterX() - (docrect.width + pr.height) * 0.5;
				let ty = pr.getCenterY() + pr.height * 0.5;
				div.style.left = tx + "px";
				div.style.top = ty + "px";
			}
		}
	}
	private m_introDiv: HTMLDivElement = null;
	private m_areaInfoDiv: HTMLDivElement = null;
	private initIntroTextDiv(): void {
		if (this.m_introDiv == null) {
			let div = document.createElement("div");
			div.style.color = "";
			let pdiv: any = div;
			pdiv.width = 300;
			pdiv.height = 200;
			let fontColor = "#aaaaaa";
			div.style.fontSize = "10pt";
			div.style.textAlign = "center";
			div.style.pointerEvents = "none";
			div.style.left = 10 + "px";
			div.style.top = 10 + "px";
			div.style.zIndex = "99999";
			div.style.position = "absolute";
			document.body.appendChild(pdiv);
			if (RendererDevice.IsMobileWeb()) {
				pdiv.innerHTML = this.createHtmlInfo("将图片拖入窗口任意区域", fontColor, true);
				pdiv.innerHTML += this.createHtmlInfo("或点击上图选择本地图片", fontColor, true);
				pdiv.innerHTML += this.createHtmlInfo("去除黑色或其他颜色背景", fontColor, true);
				pdiv.innerHTML += this.createHtmlInfo("生成透明背景PNG图", fontColor, true);
				pdiv.innerHTML += this.createHtmlInfo("最大可处理16K图片", fontColor, true);
				pdiv.innerHTML += this.createHtmlInfo("暂不支持苹果系统", fontColor);
			} else {
				pdiv.innerHTML = `<font color='${fontColor}'>将图片拖入窗口任意区域, 或点击上图选择本地图片</font></br><font color='${fontColor}'>去除黑色或其他颜色背景, 生成透明背景PNG图</font></br><font color='${fontColor}'>最大可处理16K图片</font></br><font color='${fontColor}'>暂不支持苹果系统</font></br><font color='${fontColor}'>图片不会存放服务器，杜绝信息泄露</font>`;
			}
			this.m_introDiv = pdiv;
		}
		this.initWithMeDiv();
		this.initVersionDiv();
	}
	private initWorkAreaInfoDiv(): void {

		if (this.m_areaInfoDiv == null) {

			let div = document.createElement("div");
			div.style.color = "";
			let pdiv: any = div;
			pdiv.width = 300;
			pdiv.height = 200;
			let fontColor = "#aaaaaa";
			div.style.fontSize = "10pt";
			div.style.textAlign = "center";
			div.style.pointerEvents = "none";
			div.style.left = 10 + "px";
			div.style.top = 10 + "px";
			div.style.zIndex = "9999";
			div.style.position = "absolute";
			document.body.appendChild(pdiv);
			pdiv.innerHTML = `<font color='${fontColor}'>点击上图选择本地图片</font`;
			div.style.visibility = "hidden";
			this.m_areaInfoDiv = pdiv;
		}
	}
	setAreaInfo(info: string): void {
		this.initWorkAreaInfoDiv();
		let fontColor = "#aaaaaa";
		let div = this.m_areaInfoDiv;
		div.innerHTML = `<font color='${fontColor}'>${info}</font`;
		div.style.visibility = "visible";
		this.updateLayout();
	}
	private createHtmlInfo(str: string, fontColor: string, multiLines: boolean = false): string {
		let pstr = `<font color='${fontColor}'>${str}</font>`;
		if (multiLines) {
			pstr += "</br>";
		}
		return pstr;
	}
	private m_contactWithMeDiv: HTMLDivElement = null;
	private m_versionDiv: HTMLDivElement = null;
	private initWithMeDiv(): void {
		let div = document.createElement("div");
		div.style.color = "";
		let pdiv: any = div;
		// pdiv.width = 300;
		// pdiv.height = 200;
		let fontColor = "#888888";
		div.style.fontSize = "12pt";
		div.style.textAlign = "center";
		// div.style.pointerEvents = "none";
		div.style.left = 10 + "px";
		div.style.top = 10 + "px";
		div.style.zIndex = "99999";
		div.style.position = "absolute";
		document.body.appendChild(pdiv);
		pdiv.innerHTML = `<font color='${fontColor}'>Contacts with me: vily313@126.com</font>`;
		this.m_contactWithMeDiv = pdiv;
	}
	private initVersionDiv(): void {
		let div = document.createElement("div");
		div.style.color = "";
		let pdiv: any = div;
		let fontColor = "#888888";
		div.style.fontSize = "10pt";
		div.style.textAlign = "center";
		div.style.left = 10 + "px";
		div.style.top = 10 + "px";
		div.style.zIndex = "99999";
		div.style.position = "absolute";
		document.body.appendChild(pdiv);
		pdiv.innerHTML = `<font color='${fontColor}'>试用版 1.01</font>`;
		this.m_versionDiv = pdiv;
	}
	createDiv(px: number, py: number, pw: number, ph: number): HTMLDivElement {
		let div = document.createElement("div");
		div.style.width = pw + "px";
		div.style.height = ph + "px";
		document.body.appendChild(div);
		div.style.display = "bolck";
		div.style.left = px + "px";
		div.style.top = py + "px";
		div.style.pointerEvents = "none";
		div.style.position = "absolute";
		div.style.display = "bolck";
		div.style.position = "absolute";
		return div;
	}
}

export { UIHTMLInfo };
