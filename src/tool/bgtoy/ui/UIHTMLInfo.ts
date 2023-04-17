import IRendererScene from "../../../vox/scene/IRendererScene";
import IAABB2D from "../../../vox/geom/IAABB2D";

class UIHTMLInfo {
	private m_rscene: IRendererScene = null;
	private m_areaRect: IAABB2D = null;
	private m_uiInited = false;
	constructor() {}

	initialize(ruisc: IRendererScene): void {
		if (this.m_rscene == null && ruisc != null) {
			this.m_rscene = ruisc;

			this.m_uiInited = true;
			this.initTextDiv();
		}
	}
	// hideAwardInfo(): void {
	// 	if (this.m_infoDiv) {
	// 		this.m_infoDiv.style.visibility = "hidden";
	// 	}
	// }
	// showAwardInfo(): void {
	// 	if (this.m_infoDiv) {
	// 		this.m_infoDiv.style.visibility = "visible";
	// 	}
	// }

	applyFunction(key: string): void {
		// this.uiSys.applyFunction(key);
		switch (key) {
			case "open_award":
				if (this.m_infoDiv) {
					this.m_infoDiv.style.visibility = "hidden";
				}
				break;
			case "close_award":
				if (this.m_infoDiv) {
					this.m_infoDiv.style.visibility = "visible";
				}
				break;
			default:
				break;
		}
	}
	hideSpecInfos(): void {
		if (this.m_infoDiv && this.m_infoDiv.parentElement) {
			document.body.removeChild(this.m_infoDiv);
		}
	}
	updateLayout(rect: IAABB2D = null): void {
		if (this.m_uiInited) {
			this.m_areaRect = rect;
			let st = this.m_rscene.getStage3D();
			if (this.m_infoDiv) {
				let div = this.m_infoDiv;
				let tx = st.viewWidth * 0.5 - 315;
				let ty = st.viewHeight * 0.5 + 110;
				div.style.left = tx + "px";
				div.style.top = ty + "px";
			}
			if (this.m_withMeDiv) {
				let div = this.m_withMeDiv;
				let tx = st.viewWidth * 0.5 - 130.0;
				let ty = st.viewHeight - 30;
				div.style.left = tx + "px";
				div.style.top = ty + "px";
			}
		}
	}
	private m_infoDiv: HTMLDivElement = null;
	private initTextDiv(): void {
		let div = document.createElement("div");
		div.style.color = "";
		let pdiv: any = div;
		pdiv.width = 300;
		pdiv.height = 200;
		let fontColor = "#cccccc";
		div.style.fontSize = "12pt";
		div.style.textAlign = "center";
		div.style.pointerEvents = "none";
		div.style.left = 10 + "px";
		div.style.top = 10 + "px";
		div.style.zIndex = "99999";
		div.style.position = "absolute";
		document.body.appendChild(pdiv);
		pdiv.innerHTML = `<font color='${fontColor}'>将图片拖入任意区域, 或点击选择本地图片</font></br><font color='${fontColor}'>去除黑色或白色背景, 生成透明PNG图</font></br><font color='${fontColor}'>可支持最大的图像尺寸:&nbsp16K</font>`;
		this.m_infoDiv = pdiv;
		this.initWithMeDiv();
	}
	private m_withMeDiv: HTMLDivElement = null;
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
		this.m_withMeDiv = pdiv;
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
