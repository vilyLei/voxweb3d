// import ColorRectImgButton from "../../../orthoui/button/ColorRectImgButton";
import SelectionBar from "../../../orthoui/button/SelectionBar";
import SelectionBarStyle from "../../../orthoui/button/SelectionBarStyle";
import SelectionEvent from "../../../vox/event/SelectionEvent";
import IAABB2D from "../../../vox/geom/IAABB2D";
import RendererState from "../../../vox/render/RendererState";
import IRendererScene from "../../../vox/scene/IRendererScene";
import { UIBuilder } from "./UIBuilder";
import { UIHTMLInfo } from "./UIHTMLInfo";
import { Background } from "./Background";
import { ImageFileSystem } from "../fio/ImageFileSystem";
import Color4 from "../../../vox/material/Color4";
import Plane3DEntity from "../../../vox/entity/Plane3DEntity";

class ImageColorSelector {
	private m_uisc: IRendererScene = null;
	uiBuilder: UIBuilder = null;
	uiHTMLInfo: UIHTMLInfo = null;
	uiBackground: Background = null;
	fileSys: ImageFileSystem = null;
	private m_colorSelectBtn: SelectionBar = null;
	private m_selecting = false;
	constructor() {}

	initialize(sc: IRendererScene): void {
		if (this.m_uisc == null && sc != null) {
			this.m_uisc = sc;
			this.init();
		}
	}
	isSelecting(): boolean {
		return this.m_selecting;
	}
	select(): void {
		this.m_selecting = true;
	}
	deselect(): void {
		this.m_selecting = false;
	}
	disable(): void {
		// console.log("ImageColorSelector()::disable() ...");
	}
	enable(): void {
		// console.log("ImageColorSelector()::enable() ...");
	}
	reset(): void {
		this.m_colorRectPlane.setRGB3f(0, 0, 0);
	}
	selectColor(): Color4 {
		console.log("ImageColorSelector()::select(), color ...");
		let st = this.m_uisc.getStage3D();
		let color = this.fileSys.getColorByXY(st.mouseX, st.mouseY);
		if (color) {
			this.m_colorRectPlane.setRGB3f(color.r, color.g, color.b);
		}
		return color;
	}
	private m_colorRectPlane = new Plane3DEntity();
	private init(): void {
		let sc = this.m_uisc;

		let selectBarStyle: SelectionBarStyle = null;
		selectBarStyle = new SelectionBarStyle();
		selectBarStyle.fontSize = 25;
		// selectBarStyle.renderState = RendererState.BACK_ALPHA_ADD_BLENDSORT_STATE;
		selectBarStyle.renderState = RendererState.BACK_TRANSPARENT_STATE;
		selectBarStyle.headFontBgColor.setRGBA4f(1.0, 1.0, 1.0, 0.0);
		selectBarStyle.bodyFontBgColor.setRGBA4f(0.7, 0.7, 0.7, 0.3);
		// selectBarStyle.outColor.setRGBA4f(1.0, 0.0, 0.0, 1.0);
		// selectBarStyle.overColor.setRGBA4f(1.0, 1.0, 0.0, 1.0);
		// selectBarStyle.downColor.setRGBA4f(1.0, 0.0, 1.0, 1.0);
		// selectBarStyle.headAlignType = "left";
		// selectBarStyle.headAlignPosValue = -190;
		selectBarStyle.headAlignType = "right";
		selectBarStyle.headAlignPosValue = -20;
		selectBarStyle.headEnabled = false;
		selectBarStyle.bodyFixWidth = 70;
		console.log("ImageColorSelector::init(), apply the color .........................");
		let csBtn = this.m_colorSelectBtn;
		csBtn = new SelectionBar();
		csBtn.uuid = "color_select";
		csBtn.style = selectBarStyle;
		csBtn.initialize(sc, "", "已开启剔除颜色选择", "已关闭剔除颜色选择", 30);
		csBtn.deselect();
		csBtn.addEventListener(SelectionEvent.SELECT, this, this.colorSelectChange);
		csBtn.update();
		this.m_colorSelectBtn = csBtn;
		let h = csBtn.getRect().height - 4;
		this.m_colorRectPlane.initializeXOYSquare(h);
		this.m_colorRectPlane.setRGB3f(0.0, 0.0, 0.0);
		this.m_colorRectPlane.setVisible(false);
		sc.addEntity(this.m_colorRectPlane, 1);
		this.updateLayout(null);
	}
	private colorSelectChange(evt: SelectionEvent): void {
		this.m_selecting = evt.flag;
		this.m_colorRectPlane.setVisible( this.m_selecting );
		// console.log("xxx this.m_selecting: ", this.m_selecting);
		this.uiBuilder.hideSpecBtns();
		this.uiHTMLInfo.hideSpecInfos();
		this.uiBackground.enable();
	}
	updateLayout(rect: IAABB2D): void {
		let sc = this.m_uisc;
		if (sc) {
			let st = sc.getStage3D();
			let csBtn = this.m_colorSelectBtn;
			if (csBtn) {
				csBtn.setXY(st.stageHalfWidth - 512, st.stageHalfHeight - 256 - 30);
				csBtn.update();
				let rect = csBtn.getRect();
				let pl = this.m_colorRectPlane;
				pl.setXYZ(rect.getRight() + 6 + rect.height * 0.5, rect.y + rect.height * 0.5, 1.0);
			}
		}
	}
}

export { ImageColorSelector };
