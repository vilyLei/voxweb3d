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
import RemoveBlackBGMaterial2 from "../../material/RemoveBlackBGMaterial2";
import AABB2D from "../../../vox/geom/AABB2D";
import { ILayoutBtn, BtnLayouter } from "./BtnLayouter";
import RenderableEntityContainer from "../../../vox/entity/RenderableEntityContainer";
import Vector3D from "../../../vox/math/Vector3D";
import DisplayEntityContainer from "../../../vox/entity/DisplayEntityContainer";
import MouseEvent from "../../../vox/event/MouseEvent";

class ImageColorSelector {
	private m_uisc: IRendererScene = null;
	private m_container = new RenderableEntityContainer(true, false);
	private m_bgContainer = new DisplayEntityContainer();
	private m_btnContainer = new DisplayEntityContainer();
	private m_colorSelectBtn: SelectionBar = null;
	private m_selecting = false;
	private m_width = 512.0;
	uiBuilder: UIBuilder = null;
	uiHTMLInfo: UIHTMLInfo = null;
	uiBackground: Background2D = null;
	fileSys: ImageFileSystem = null;

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
		// let btns = this.m_btns;
		// for (let i = 0; i < btns.length; ++i) {
		// 	btns[i].setVisible(v);
		// }
		// this.m_colorRectPlane.setVisible(v);
		this.m_container.setVisible(v);
	}
	isVisible(): boolean {
		// return this.m_colorSelectBtn.isVisible();
		return this.m_container.isVisible();
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
		// style.renderState = RendererState.NORMAL_STATE;
		style.renderState = RendererState.BACK_TRANSPARENT_STATE;
		style.headFontBgColor.setRGBA4f(1.0, 1.0, 1.0, 0.0);
		style.bodyFontBgColor.setRGBA4f(1.0, 1.0, 1.0, 0.7);
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
		this.m_colorRectPlane.setRGB3f(0.0, 0.0, 0.0);

		this.m_container.addChild(this.m_bgContainer);
		this.m_container.addChild(this.m_btnContainer);

		this.m_colorRectPlane.setScaleXYZ(0.2, 1.0, 1.0);
		this.m_btnContainer.addChild(this.m_colorRectPlane);
		this.createBG();
		sc.addEntity(this.m_container, 1);

		this.createSelectColorBtns(style);
		this.updateLayout(null);

		let btns = this.m_btns;
		let available = true;
		let availables = [0];
		for (let i = 0; i < btns.length; ++i) {
			let btn = btns[i];
			if(availables.includes(i)) {
				// btn.disable();
				btn.updateStateEnabledByMouseEvt = false;
				btn.addEventListener(SelectionEvent.SELECT, this, this.disableListener);
			}else {
				if (i != 1) {
					btn.addEventListener(SelectionEvent.SELECT, this, this.colorSelectChange);
					btn.addEventListener(MouseEvent.MOUSE_OVER, this, this.overListener);
					btn.addEventListener(MouseEvent.MOUSE_OUT, this, this.outListener);
				}
			}
		}
		this.setVisible(false);
	}
	private disableListener(evt: any): void {
		console.log("disableListener() ..., 请联系作者购买使用权限。");
	}
	private overListener(evt: any): void {
		let uuid = evt.uuid;
		if (uuid == this.m_currUUID) {
			this.m_colorRectPlane.setScaleXYZ(0.3, 1.0, 1.0);
			console.log("over");
		}
	}
	private outListener(evt: any): void {
		let uuid = evt.uuid;
		if (uuid == this.m_currUUID) {
			this.m_colorRectPlane.setScaleXYZ(0.2, 1.0, 1.0);
			console.log("out");
		}
		// if (this.m_selecting) {
		// this.m_dispatcher.dispatchEvt( evt );
		// }
	}
	private createBG(): void {
		let pl0 = new Plane3DEntity();
		pl0.depthAlwaysFalse = true;
		pl0.transparentBlend = true;
		pl0.initializeXOY(0, -200, 512, 230);
		let brn = 0.6;
		pl0.setRGBA4f(brn, brn, brn, 0.2);
		this.m_bgContainer.addChild(pl0);
	}
	private createSelectColorBtn(uuid: string, selectNS: string, style: SelectionBarStyle, color: Color4): SelectionBar {
		let sc = this.m_uisc;
		let csBtn = new SelectionBar();
		csBtn.parentContainer = this.m_btnContainer;
		csBtn.uuid = uuid;
		csBtn.style = style;
		if (this.m_btns.length == 0) {
			style.headEnabled = true;
			csBtn.initialize(sc, "点选图像中的颜色", "开", "关", style.fontSize);
		}
		if (this.m_btns.length == 1) {
			style.headEnabled = false;
			style.bodyVisible = false;
			csBtn.initialize(sc, selectNS, "", "", style.fontSize);
		} else {
			style.headEnabled = false;
			style.bodyVisible = true;
			csBtn.initialize(sc, "", selectNS, selectNS, style.fontSize);
		}
		csBtn.deselect();
		csBtn.update();

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

		style.bodyEnabled = false;
		let uuid = "title_color_select";
		let selectNS = "选择需要去除的背景颜色:";
		csBtn = this.createSelectColorBtn(uuid, selectNS, style, new Color4().scaleBy(0.0));

		style.bodyEnabled = true;
		style.bodyFontColor.setRGBA4f(1.0, 1.0, 1.0, 0.0);
		style.headFontBgColor.setRGBA4f(1.0, 1.0, 1.0, 0.0);
		let alpha = 0.90;
		let scale = 1.0;
		style.bodyFontBgColor.setRGBA4f(0.10, 0.10, 0.10, 1.0);
		uuid = "black_color_select";
		selectNS = "黑色";
		csBtn = this.createSelectColorBtn(uuid, selectNS, style, new Color4().scaleBy(0.0));
		style.bodyFontBgColor.setRGBA4f(1.0, 1.0, 1.0, alpha).scaleBy(scale);
		uuid = "white_color_select";
		selectNS = "白色";
		csBtn = this.createSelectColorBtn(uuid, selectNS, style, new Color4().gammaCorrect());

		style.bodyFontBgColor.setRGBA4f(0.0, 1.0, 0.0, alpha).scaleBy(scale);
		uuid = "green_color_select";
		selectNS = "绿色";
		csBtn = this.createSelectColorBtn(uuid, selectNS, style, new Color4(0.0, 1.0, 0.0).gammaCorrect());

		style.bodyFontBgColor.setRGBA4f(1.0, 0.1, 0.1, alpha).scaleBy(scale);
		uuid = "red_color_select";
		selectNS = "红色";
		csBtn = this.createSelectColorBtn(uuid, selectNS, style, new Color4(1.0, 0.0, 0.0).gammaCorrect());

		style.bodyFontBgColor.setRGBA4f(1.0, 1.0, 0.0, alpha).scaleBy(scale);
		uuid = "yelow_color_select";
		selectNS = "黄色";
		csBtn = this.createSelectColorBtn(uuid, selectNS, style, new Color4(1.0, 1.0, 0.0).gammaCorrect());

		style.bodyFontBgColor.setRGBA4f(0.0, 0.0, 1.0, alpha).scaleBy(scale);
		uuid = "blue_color_select";
		selectNS = "蓝色";
		csBtn = this.createSelectColorBtn(uuid, selectNS, style, new Color4(0.0, 0.0, 1.0).gammaCorrect());
	}
	private m_currMaterial: RemoveBlackBGMaterial2 = null;
	setCurrMaterial(currMaterial: RemoveBlackBGMaterial2): void {
		this.m_currMaterial = currMaterial;
	}
	private m_userSelectStatus = false;
	private updateSelectColorStatus(): void {
		if (this.m_userSelectStatus) {
			if (this.m_selecting) {
				this.uiHTMLInfo.setAreaInfo("点击上图选择图片颜色");
			} else {
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
			if (this.m_currMaterial) {
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
	private m_pv = new Vector3D();
	private m_btnLayoutInit = true;
	private layoutBtns(rect: IAABB2D): void {
		let container = this.m_container;
		if (this.m_btnLayoutInit) {
			this.m_btnLayoutInit = false;
			let csBtn = this.m_colorSelectBtn;
			if (csBtn) {
				let tr = csBtn.getRect();
				let btns = this.m_btns;
				const pr = this.m_rect;
				pr.copyFrom(rect);
				pr.y = rect.y - tr.height * 2;
				pr.update();
				container.setXYZ(pr.x, pr.y, 0);
				pr.x = 5;
				pr.y = -tr.height + 20;
				let titleBtn = this.m_btns[1];
				titleBtn.setXY(pr.x + titleBtn.getRect().width, pr.y);
				titleBtn.update();

				let disY = 17;
				pr.x = 30;
				pr.y -= tr.height + disY;
				pr.width = this.m_width - pr.x * 2;
				pr.update();
				let index = 2;
				this.m_layouter.horizontalLayout(pr, btns.slice(index, index + 3) as ILayoutBtn[]);

				pr.y -= tr.height + disY;
				pr.update();
				index += 3;
				this.m_layouter.horizontalLayout(pr, btns.slice(index, index + 3) as ILayoutBtn[]);

				pr.y -= tr.height + disY;
				pr.update();
				let selfBtn = btns[0];
				selfBtn.setXY(btns[2].getRect().x - selfBtn.getRect().x - 3, pr.y);
				selfBtn.update();
			}
		} else {
			let csBtn = this.m_colorSelectBtn;
			let tr = csBtn.getRect();
			const pr = this.m_rect;
			pr.copyFrom(rect);
			pr.y = rect.y - tr.height * 2;
			pr.update();
			container.setXYZ(pr.x, pr.y, 0);
		}
		const pv = this.m_pv;
		let node = this.m_btnMap.get(this.m_currUUID);
		let btn = node.btn;
		btn.update();
		let tr = btn.getRect();
		pv.setXYZ(tr.x, tr.y, 0);
		container.globalToLocal(pv);
		let pl = this.m_colorRectPlane;
		pl.setXYZ(pv.x - 2, pv.y + tr.height * 0.5 + 1, 1.0);
		pl.update();
		if (node.index > 0) {
			pl.setColor(node.color);
		}
	}
	updateLayout(rect: IAABB2D = null): void {
		if (rect) {
			this.m_areaRect = rect;
		} else {
			rect = this.m_areaRect;
		}
		let sc = this.m_uisc;
		if (sc && rect) {
			this.layoutBtns(rect);
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
