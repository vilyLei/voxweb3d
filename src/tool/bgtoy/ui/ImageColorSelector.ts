import SelectionBar from "../../../orthoui/button/SelectionBar";
import SelectionBarStyle from "../../../orthoui/button/SelectionBarStyle";
import SelectionEvent from "../../../vox/event/SelectionEvent";
import IAABB2D from "../../../vox/geom/IAABB2D";
import RendererState from "../../../vox/render/RendererState";
import IRendererScene from "../../../vox/scene/IRendererScene";
import { UIBuilder } from "./UIBuilder";
import { UIHTMLInfo } from "./UIHTMLInfo";
import { Background2D } from "./Background2D";
import { ImageFileSystem } from "../fio/ImageFileSystem";
import Color4 from "../../../vox/material/Color4";
import Plane3DEntity from "../../../vox/entity/Plane3DEntity";
import Vector3D from "../../../vox/math/Vector3D";
import RemoveBlackBGMaterial2 from "../../material/RemoveBlackBGMaterial2";
import AABB2D from "../../../vox/geom/AABB2D";
import { ILayoutBtn, BtnLayouter } from "./BtnLayouter";

class ImageColorSelector {
	private m_uisc: IRendererScene = null;
	uiBuilder: UIBuilder = null;
	uiHTMLInfo: UIHTMLInfo = null;
	uiBackground: Background2D = null;
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
	setVisible(v: boolean): void {
		// this.m_colorSelectBtn.setVisible(v);
		let btns = this.m_btns;
		for (let i = 0; i < btns.length; ++i) {
			btns[i].setVisible(v);
		}
		this.m_colorRectPlane.setVisible(v);
	}
	isVisible(): boolean {
		return this.m_colorSelectBtn.isVisible();
	}
	select(): void {
		this.m_selecting = true;
	}
	deselect(): void {
		this.m_selecting = false;
		this.setVisible(false);
		this.updateSelectColorStatus();
	}
	disable(): void {
		// console.log("ImageColorSelector()::disable() ...");
	}
	enable(): void {
		// console.log("ImageColorSelector()::enable() ...");
	}
	reset(onlyColor: boolean = false): void {
		if (!onlyColor) {
			this.deselect();
		}
		this.m_selecting = false;
		this.m_currUUID = "black_color_select";
		this.m_colorRectPlane.setRGB3f(0, 0, 0);
		this.updateSelectColorStatus();
		this.updateLayout();
	}
	isHitImgWithMouseXY(): boolean {
		let st = this.m_uisc.getStage3D();
		return this.fileSys.containsXYByImg(st.mouseX, st.mouseY);
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
	private m_btns: SelectionBar[] = [];
	private m_btnMap: Map<string, SelectNode> = new Map();
	private m_currUUID = "black_color_select";
	private init(): void {
		let sc = this.m_uisc;

		let style: SelectionBarStyle = null;
		style = new SelectionBarStyle();
		style.fontSize = 25;
		//readonly outColor = new Color4(0.8, 0.8, 0.8, 1.0);
		style.renderState = RendererState.BACK_TRANSPARENT_STATE;
		style.headFontBgColor.setRGBA4f(1.0, 1.0, 1.0, 0.0);
		style.bodyFontBgColor.setRGBA4f(0.7, 0.7, 0.7, 0.7);
		style.headAlignType = "right";
		// style.headAlignPosValue = -20;
		style.headEnabled = false;
		style.bodyFixWidth = 110;

		console.log("ImageColorSelector::init(), apply the color .........................");
		let csBtn = this.m_colorSelectBtn;

		let uuid = "user_select_color";
		let selectNS = "自选色去除";
		csBtn = this.createSelectColorBtn(uuid, selectNS, style, new Color4());
		this.m_colorSelectBtn = csBtn;

		let h = csBtn.getRect().height - 4;
		this.m_colorRectPlane.initializeXOY(-h, -0.5 * h, h, h);
		// this.m_colorRectPlane.initializeXOY(0, 0, h, h);
		// this.m_colorRectPlane.initializeXOYSquare(h);
		this.m_colorRectPlane.setRGB3f(0.0, 0.0, 0.0);
		// this.m_colorRectPlane.setVisible(false);
		sc.addEntity(this.m_colorRectPlane, 1);

		this.createSelectColorBtns(style);
		this.updateLayout(null);

		//		csBtn.addEventListener(SelectionEvent.SELECT, this, this.colorSelectChange);
		let btns = this.m_btns;
		for (let i = 0; i < btns.length; ++i) {
			btns[i].addEventListener(SelectionEvent.SELECT, this, this.colorSelectChange);
		}
	}
	private createSelectColorBtn(uuid: string, selectNS: string, style: SelectionBarStyle, color: Color4): SelectionBar {
		let sc = this.m_uisc;
		let csBtn = new SelectionBar();
		csBtn.uuid = uuid;
		csBtn.style = style;
		if(this.m_btns.length == 0) {
			csBtn.initialize(sc, "", selectNS+"开", selectNS+"关", style.fontSize);
		}else {
			csBtn.initialize(sc, "", selectNS, selectNS, style.fontSize);
		}
		csBtn.deselect();
		csBtn.update();
		csBtn.setVisible(false);
		let node = new SelectNode();
		node.uuid = uuid;
		node.btn = csBtn;
		node.color = color;
		node.index = this.m_btns.length;
		this.m_btnMap.set(uuid, node);
		this.m_btns.push(csBtn);
		return csBtn;
	}
	private createSelectColorBtns(style: SelectionBarStyle): void {

		let csBtn: SelectionBar;

		let uuid = "black_color_select";
		let selectNS = "黑色去除";
		csBtn = this.createSelectColorBtn(uuid, selectNS, style, new Color4().scaleBy(0.0));

		uuid = "white_color_select";
		selectNS = "白色去除";
		csBtn = this.createSelectColorBtn(uuid, selectNS, style, new Color4().gammaCorrect());

		uuid = "red_color_select";
		selectNS = "红色去除";
		csBtn = this.createSelectColorBtn(uuid, selectNS, style, new Color4(1.0, 0.0, 0.0).gammaCorrect());

		uuid = "green_color_select";
		selectNS = "绿色去除";
		csBtn = this.createSelectColorBtn(uuid, selectNS, style, new Color4(0.0, 1.0, 0.0).gammaCorrect());

		uuid = "blue_color_select";
		selectNS = "蓝色去除";
		csBtn = this.createSelectColorBtn(uuid, selectNS, style, new Color4(0.0, 0.0, 1.0).gammaCorrect());
	}
	private m_currMaterial: RemoveBlackBGMaterial2 = null;
	setCurrMaterial(currMaterial: RemoveBlackBGMaterial2): void {
		this.m_currMaterial = currMaterial;
	}
	private m_userSelectStatus = false;
	private updateSelectColorStatus(): void {
		if(this.m_userSelectStatus) {
			if(this.m_selecting) {
				this.uiHTMLInfo.setAreaInfo("点击上图选择图片颜色");
			}else {
				this.m_btns[0].deselect(false);
				this.uiHTMLInfo.setAreaInfo("点击上图区域选择本地图片文件");
			}
		}
	}
	private colorSelectChange(evt: SelectionEvent): void {
		console.log("colorSelectChange(), evt.uuid: ", evt.uuid);
		this.m_userSelectStatus = true;
		let uuid = evt.uuid;
		this.m_colorRectPlane.setVisible(true);
		this.uiBuilder.hideSpecBtns();
		this.uiHTMLInfo.hideSpecInfos();
		this.uiBackground.enable();
		if (uuid == this.m_btns[0].uuid) {
			this.m_selecting = evt.flag;
			// this.m_colorRectPlane.setVisible(this.m_selecting);
			// console.log("xxx this.m_selecting: ", this.m_selecting);
		} else {
			if(this.m_currMaterial) {
				let node = this.m_btnMap.get(uuid);
				let c = node.color;
				this.m_currMaterial.setDiscardDstRGB(c.r, c.g, c.b);
			}
			this.m_selecting = false;
		}
		this.updateSelectColorStatus();
		this.m_currUUID = uuid;
		this.updateLayout(this.m_areaRect);
	}
	private m_areaRect: IAABB2D = null;
	private m_rect: IAABB2D = new AABB2D();
	private m_layouter = new BtnLayouter();
	updateLayout(rect: IAABB2D = null): void {
		if(rect) {
			this.m_areaRect = rect;
		}else {
			rect = this.m_areaRect;
		}
		let sc = this.m_uisc;
		if (sc && rect) {
			let csBtn = this.m_colorSelectBtn;
			if (csBtn) {
				let tr = csBtn.getRect();

				let btns = this.m_btns;

				// let width = 0;
				// for (let i = 0; i < btns.length; ++i) {
				// 	btns[i].update();
				// 	width += btns[i].getRect().width;
				// }
				// width = rect.width - width;
				// let disX = width / (btns.length - 1);
				// let px = rect.x;
				// let py = rect.y - tr.height * 3;
				// let pv = new Vector3D();
				// for (let i = 0; i < btns.length; ++i) {
				// 	const bt = btns[i];
				// 	bt.getPosition(pv);
				// 	pv.x = Math.round(px);
				// 	pv.y = Math.round(py);
				// 	bt.setPosition(pv);
				// 	bt.update();
				// 	px += bt.getRect().width + disX;
				// }

				this.m_rect.copyFrom(rect);
				this.m_rect.y = rect.y - tr.height * 3;
				this.m_rect.update();
				this.m_layouter.horizontalLayout(this.m_rect, btns as ILayoutBtn[]);

				let node = this.m_btnMap.get(this.m_currUUID);
				let btn = node.btn;
				tr = btn.getRect();
				let pl = this.m_colorRectPlane;
				pl.setXYZ(tr.x - 2, tr.getCenterY() + 1, 1.0);
				pl.update();
				if (node.index > 0) {
					pl.setColor(node.color);
				}
			}
		}
	}
}

class SelectNode {
	color = new Color4();
	btn: SelectionBar = null;
	uuid: string = "";
	index = 0;
	constructor() {}
}
export { ImageColorSelector };
