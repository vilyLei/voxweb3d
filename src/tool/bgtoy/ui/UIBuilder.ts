import IRendererScene from "../../../vox/scene/IRendererScene";
import IRendererSceneGraph from "../../../vox/scene/IRendererSceneGraph";
import ColorRectImgButton from "../../../orthoui/button/ColorRectImgButton";
import UIBarTool from "../../../orthoui/button/UIBarTool";
import IColor4 from "../../../vox/material/IColor4";
import Vector3D from "../../../vox/math/Vector3D";
import Color4 from "../../../vox/material/Color4";
import URLFilter from "../../base/URLFilter";

class UIBuilder {
	private m_rscene: IRendererScene = null;
	private m_uisrc: IRendererScene = null;
	private m_graph: IRendererSceneGraph = null;
	private m_total = 0;
	saveBtn: ColorRectImgButton = null;
	resetBtn: ColorRectImgButton = null;
	buildFinishCall: () => void = null;
	constructor() {}

	initialize(graph: IRendererSceneGraph): void {
		if (this.m_graph == null && graph != null) {
			this.m_graph = graph;
			this.m_rscene = this.m_graph.getNodeAt(0).getRScene();
			this.m_uisrc = this.m_graph.getNodeAt(1).getRScene();
			this.init();
		}
	}
	private init(): void {

		let url = "static/assets/ui/reset.png";
		url = URLFilter.filterUrl( url );
		let img = new Image();
		img.onload = (evt: any): void => {
			let fontColor = new Color4(1.0,1.0,1.0, 1.0);
			let bgColor = new Color4(1.0,1.0,1.0, 0.5);
			let btn = this.createBtn("reset_btn", img, 230, 60, "恢复初始设置", 30, new Vector3D(-20,0), new Vector3D(-10), fontColor, bgColor);
			// this.m_uisrc.addEntity(btn);
			this.resetBtn = btn;
			this.m_total ++;
			if(this.m_total > 1 && this.buildFinishCall) {
				this.buildFinishCall();
			}
		}
		img.src = url;

		url = "static/assets/ui/download.png";
		url = URLFilter.filterUrl( url );
		let img1 = new Image();
		img1.onload = (evt: any): void => {
			let fontColor = new Color4(1.0,1.0,1.0, 1.0);
			let bgColor = new Color4(1.0,1.0,1.0, 0.5);
			let btn = this.createBtn("save_btn", img1, 230, 60, "保存图片", 30, new Vector3D(-13,0), new Vector3D(-20), fontColor, bgColor);
			// this.m_uisrc.addEntity(btn);
			this.saveBtn = btn;
			this.m_total ++;
			if(this.m_total > 1 && this.buildFinishCall) {
				this.buildFinishCall();
			}
		}
		img1.src = url;
	}

	private m_index = 0;
	createBtn(
		keyStr: string,
		img: HTMLCanvasElement | HTMLImageElement,
		width: number,
		height: number,
		str: string,
		fontSize: number,
		textPos: Vector3D,
		imgOffset: Vector3D,
		fontColor: IColor4,
		fontBgColor: IColor4
	): ColorRectImgButton {
		let canvas = UIBarTool.CreateCharsCanvasFixSize(width, height, str, fontSize, fontColor, fontBgColor, textPos);

		let imgPx = imgOffset.x + canvas.width - img.width;
		let imgPy = imgOffset.y + Math.round(( canvas.height - img.height ) * 0.5);
		const ctx2d = canvas.getContext("2d");
		ctx2d.drawImage(img, 0, 0, img.width, img.height, imgPx, imgPy, img.width, img.height);

		// let k = 1 + this.m_index++;
		// let ri = 1;
		// canvas.style.display = "bolck";
		// canvas.style.zIndex = "9999";
		// canvas.style.left = `${66 + k * 66}px`;
		// canvas.style.top = `${200 + ri * 66}px`;
		// canvas.style.position = "absolute";
		// document.body.appendChild(canvas);

		// let keyStr = "reset_btn";
		UIBarTool.AddImageToAtlas(keyStr, canvas);
		let btn = UIBarTool.CreateBtnWithKeyStr(keyStr);

		return btn;
	}
}

export { UIBuilder };
