import ScreenAlignPlaneEntity from "../../../vox/entity/ScreenAlignPlaneEntity";
import AABB2D from "../../../vox/geom/AABB2D";
import Color4 from "../../../vox/material/Color4";
import RendererState from "../../../vox/render/RendererState";
import IRendererScene from "../../../vox/scene/IRendererScene";
import IRendererSceneGraph from "../../../vox/scene/IRendererSceneGraph";

import RemoveBlackBGMaterial from "../../material/RemoveBlackBGMaterial";

import SelectionBarStyle from "../../../orthoui/button/SelectionBarStyle";
import { CtrlInfo, ItemCallback, CtrlItemParam, ParamCtrlUI } from "../../../orthoui/usage/ParamCtrlUI";

import { Background } from "./Background";
import Vector3D from "../../../vox/math/Vector3D";
import ProgressBarStyle from "../../../orthoui/button/ProgressBarStyle";
import { UIBuilder } from "./UIBuilder";
import MouseEvent from "../../../vox/event/MouseEvent";
import IAABB2D from "../../../vox/geom/IAABB2D";
import IRenderTexture from "../../../vox/render/texture/IRenderTexture";

class UISystem {
	private m_rscene: IRendererScene = null;
	private m_graph: IRendererSceneGraph = null;
	private m_bgTex: IRenderTexture;

	uiBuilder = new UIBuilder();
	background = new Background();
	ctrlui = new ParamCtrlUI(false);
	position = new Vector3D(552, 80);
	processTotal = 3;
	constructor() {}

	initialize(graph: IRendererSceneGraph, bgTex: IRenderTexture = null): void {
		if (this.m_graph == null && graph != null) {
			this.m_graph = graph;
			this.m_rscene = this.m_graph.getNodeAt(0).getRScene();
			this.m_bgTex = bgTex;
			this.init();
		}
	}
	private init(): void {
		let graph = this.m_graph;

		let bg = this.background;
		bg.initialize(this.m_rscene, this.m_bgTex);

		this.initUI();
		this.uiBuilder.buildFinishCall = (): void => {
			this.initUIItems();
		};
		this.uiBuilder.initialize(graph);
	}

	private m_currMaterial: RemoveBlackBGMaterial = null;
	private m_initUI = true;
	private m_bgColor = new Color4();
	private m_savingCall: () => void = null;
	private m_openingCall: () => void = null;
	setCurrMaterial(currMaterial: RemoveBlackBGMaterial): void {
		this.m_currMaterial = currMaterial;
	}
	setSavingListener(call: () => void): void {
		this.m_savingCall = call;
	}
	setOpeningListener(call: () => void): void {
		this.m_openingCall = call;
	}
	disable(): void {
		this.ctrlui.ruisc.disable();
		this.background.disable();
	}
	enable(): void {
		this.ctrlui.ruisc.enable();
		this.background.enable();
	}
	private initUI(): void {
		if (!this.m_initUI) {
			return;
		}
		this.m_initUI = false;

		let ui = this.ctrlui;
		ui.processTotal = this.processTotal;
		ui.syncStageSize = false;
		ui.selectPlaneEnabled = false;
		ui.syncStageSize = false;
		ui.fontBgColor.setRGBA4f(0.7, 0.8, 0.6, 0.6);
		ui.proBarBGBarAlpha = 0.9;
		ui.proBarBGPlaneAlpha = 0.7;
		ui.initialize(this.m_rscene, true);
		this.m_graph.addScene(ui.ruisc);
	}
	private initUIItems(): void {
		let ui = this.ctrlui;
		let selectBarStyle: SelectionBarStyle = null;
		selectBarStyle = new SelectionBarStyle();
		selectBarStyle.fontSize = 25;
		selectBarStyle.renderState = RendererState.BACK_ALPHA_ADD_BLENDSORT_STATE;
		selectBarStyle.headFontBgColor.setRGBA4f(1.0, 1.0, 1.0, 0.0);
		selectBarStyle.bodyFontBgColor.setRGBA4f(0.7, 0.7, 0.7, 0.3);
		selectBarStyle.headAlignType = "left";
		selectBarStyle.headAlignPosValue = -190;
		selectBarStyle.headEnabled = false;
		selectBarStyle.bodyFixWidth = 70;

		let progressBarStyle: ProgressBarStyle = null;
		progressBarStyle = new ProgressBarStyle();
		progressBarStyle.renderState = selectBarStyle.renderState;
		progressBarStyle.fontSize = selectBarStyle.fontSize;
		progressBarStyle.headFontBgColor.setRGBA4f(0.7, 0.7, 0.7, 0.0);
		// progressBarStyle.bodyFontBgColor.setRGBA4f(0.5, 0.5, 0.5, 0.1);
		progressBarStyle.progressBtnFontBgColor.setRGBA4f(0.7, 0.7, 0.7, 0.3);
		progressBarStyle.progressBarBgOverColor.setRGBA4f(0.7, 0.7, 0.7, 0.3);
		progressBarStyle.progressBarBgOutColor.setRGBA4f(0.5, 0.5, 0.5, 0.3);
		progressBarStyle.headAlignType = "left";
		progressBarStyle.headAlignPosValue = selectBarStyle.headAlignPosValue;
		progressBarStyle.headEnabled = selectBarStyle.headEnabled;
		progressBarStyle.progressBarLength = 250;

		selectBarStyle.headVisible = false;
		ui.addStatusItem(
			"切换",
			"change_bg_color",
			"切换随机背景",
			"切换随机背景",
			false,
			(info: CtrlInfo): void => {
				this.changeBGColor();
			},
			true,
			false,
			selectBarStyle
		);
		selectBarStyle.headVisible = true;
		ui.addStatusItem(
			"图像处理方式",
			"reset_init_img",
			"原图展示",
			"透明剔除",
			false,
			(info: CtrlInfo): void => {
				if (this.m_currMaterial) {
					this.m_currMaterial.setParam3(info.flag ? 0.0 : 1.0);
				}
			},
			true,
			false,
			selectBarStyle
		);
		ui.addStatusItem(
			"剔除方式",
			"invert_discard",
			"白色背景剔除",
			"黑色背景剔除",
			false,
			(info: CtrlInfo): void => {
				if (this.m_currMaterial) {
					this.m_currMaterial.setInvertDiscard(info.flag);
				}
			},
			true,
			false,
			selectBarStyle
		);

		ui.addValueItem(
			"透明度强度",
			"alpha_factor",
			1.0,
			0.0,
			3.0,
			(info: CtrlInfo): void => {
				if (this.m_currMaterial) {
					this.m_currMaterial.setParam0(info.values[0]);
				}
			},
			false,
			true,
			null,
			false,
			progressBarStyle
		);

		ui.addValueItem(
			"颜色强度",
			"color_factor",
			1.0,
			0.0,
			5.0,
			(info: CtrlInfo): void => {
				if (this.m_currMaterial) {
					this.m_currMaterial.setParam1(info.values[0]);
				}
			},
			false,
			true,
			null,
			false,
			progressBarStyle
		);

		ui.addValueItem(
			"透明度剔除比例",
			"alpha_discard_factor",
			0.02,
			0.0,
			0.96,
			(info: CtrlInfo): void => {
				if (this.m_currMaterial) {
					this.m_currMaterial.setParam2(info.values[0]);
				}
			},
			false,
			true,
			null,
			false,
			progressBarStyle
		);
		// 还可以设置: 更红，更绿，更蓝

		let resetBtn = this.uiBuilder.resetBtn;
		let saveBtn = this.uiBuilder.saveBtn;
		let addIntoBtn = this.uiBuilder.addIntoBtn;
		resetBtn.addEventListener(MouseEvent.MOUSE_DOWN, this, (evt: any): void => {
			this.resetCtrlValue();
		});
		saveBtn.addEventListener(MouseEvent.MOUSE_DOWN, this, (evt: any): void => {
			if (this.m_savingCall) {
				this.m_savingCall();
			}
		});
		addIntoBtn.addEventListener(MouseEvent.MOUSE_DOWN, this, (evt: any): void => {
			if (this.m_openingCall) {
				this.m_openingCall();
			}
		});
		ui.ruisc.addEntity(resetBtn);
		ui.ruisc.addEntity(saveBtn);
		ui.ruisc.addEntity(addIntoBtn);

		this.initTextDiv();
		this.updateLayoutUI();
		this.changeBGColor();
	}
	changeBGColor(color: Color4 = null): void {

		this.m_bgColor.randomRGB(0.25, 0.05);
		this.m_bgColor.rgbSizeTo(0.3 + Math.random() * 0.2);
		color = color ? color : this.m_bgColor;
		this.m_rscene.setClearRGBAColor4f(color.r, color.g, color.b, 0.0);
		this.background.setBGRGBAColor(color);
	}
	hideBtns(): void {
		let addIntoBtn = this.uiBuilder.addIntoBtn;
		if(addIntoBtn) {
			// addIntoBtn.mouseEnabled = false;
			// addIntoBtn.setVisible(false);
			addIntoBtn.outColor.setRGBA4f(0.8, 0.8, 0.8, 0.0);
			addIntoBtn.overColor.setRGBA4f(1.0, 1.0, 1.0, 0.0);
			addIntoBtn.downColor.setRGBA4f(1.0, 1.0, 0.2, 0.0);
			if(this.m_infoDiv && this.m_infoDiv.parentElement) {
				document.body.removeChild(this.m_infoDiv);
			}
		}
	}

	applyFunction(key: string): void {
		// this.uiSys.applyFunction(key);
		switch(key) {
			case "open_award":
				if(this.m_infoDiv) {
					this.m_infoDiv.style.visibility = "hidden";
				}
				break;
			case "close_award":
				if(this.m_infoDiv) {
					this.m_infoDiv.style.visibility = "visible";
				}
				break;
			default:
				break;
		}
	}
	private resetCtrlValue(): void {
		let ui = this.ctrlui;

		console.log("resetCtrlValue() ...");
		ui.setUIItemValue("alpha_factor", 1.0);
		ui.setUIItemValue("color_factor", 1.0);
		ui.setUIItemValue("alpha_discard_factor", 0.02);
		ui.setUIItemFlag("reset_init_img", false);
		ui.setUIItemFlag("invert_discard", false);
	}
	updateLayoutUI(): void {
		this.updateLayout( this.m_areaRect );
	}
	private m_areaRect: IAABB2D = null;
	updateLayout(rect: IAABB2D = null): void {
		this.m_areaRect = rect;
		let ui = this.ctrlui;
		if (ui) {
			ui.setYSpace(48);
			let st = this.m_rscene.getStage3D();
			let pv = this.position;
			pv.x = st.stageHalfWidth + 20;
			pv.y = st.stageHalfHeight + (-256 + 105);
			ui.updateLayout(true, pv);

			let bounds = ui.bounds;
			let py = st.stageHalfHeight - 256 - 2;
			let resetBtn = this.uiBuilder.resetBtn;
			let saveBtn = this.uiBuilder.saveBtn;
			let addIntoBtn = this.uiBuilder.addIntoBtn;
			if(resetBtn) {
				resetBtn.setXY(bounds.x, py);
				saveBtn.setXY(bounds.getRight() - saveBtn.getWidth(), py);
				let sx = 512 /addIntoBtn.getWidth();
				let sy = 512 /addIntoBtn.getHeight();
				addIntoBtn.setXY(st.stageHalfWidth - 512, st.stageHalfHeight - 256);
				addIntoBtn.setScaleXYZ(sx, sy, 1.0);
				addIntoBtn.update();
			}
			if(this.m_infoDiv) {
				let div = this.m_infoDiv;
				let tx = st.viewWidth * 0.5 - 315;
				let ty = st.viewHeight * 0.5 + 110;
				div.style.left = tx + "px";
				div.style.top = ty + "px";
			}
			if(this.m_withMeDiv) {
				let div = this.m_withMeDiv;
				let tx = st.viewWidth * 0.5 - 130.0;
				let ty = st.viewHeight - 30;
				div.style.left = tx + "px";
				div.style.top = ty + "px";
			}
			//this.m_withMeDiv
		}
		if(this.background) {
			this.background.updateLayout( rect );
		}
	}
	private m_infoDiv: HTMLDivElement = null;
	private initTextDiv(): void {
		let div = document.createElement("div");
		div.style.color = "";
		let pdiv: any = div;
		pdiv.width = 300;
		pdiv.height = 200;
		let fontColor = "#cccccc"
		div.style.fontSize = "12pt";
		div.style.textAlign = "center";
		div.style.pointerEvents = "none";
		div.style.left = 10 + "px";
		div.style.top = 10 + "px";
		div.style.zIndex = "99999";
		div.style.position = "absolute";
		document.body.appendChild(pdiv);
		pdiv.innerHTML = `<font color='${fontColor}'>将图片拖入任意区域, 或点击选择本地图片</font></br><font color='${fontColor}'>去除黑色或白色背景, 生成透明PNG图</font></br><font color='${fontColor}'>可支持的最大图像尺寸:&nbsp16K</font>`;
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
		let fontColor = "#888888"
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

export { UISystem };
