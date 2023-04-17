import ScreenAlignPlaneEntity from "../../../vox/entity/ScreenAlignPlaneEntity";
import AABB2D from "../../../vox/geom/AABB2D";
import Color4 from "../../../vox/material/Color4";
import RendererState from "../../../vox/render/RendererState";
import IRendererScene from "../../../vox/scene/IRendererScene";
import IRendererSceneGraph from "../../../vox/scene/IRendererSceneGraph";

import RemoveBlackBGMaterial2 from "../../material/RemoveBlackBGMaterial2";

import SelectionBarStyle from "../../../orthoui/button/SelectionBarStyle";
import { StatusItemBuildParam, CtrlInfo, ItemCallback, CtrlItemParam, ParamCtrlUI } from "../../../orthoui/usage/ParamCtrlUI";

import { Background } from "./Background";
import Vector3D from "../../../vox/math/Vector3D";
import ProgressBarStyle from "../../../orthoui/button/ProgressBarStyle";
import { UIBuilder } from "./UIBuilder";
import { UIHTMLInfo } from "./UIHTMLInfo";
import { ImageColorSelector } from "./ImageColorSelector";
import MouseEvent from "../../../vox/event/MouseEvent";
import IAABB2D from "../../../vox/geom/IAABB2D";
import IRenderTexture from "../../../vox/render/texture/IRenderTexture";
import ColorRectImgButton from "../../../orthoui/button/ColorRectImgButton";

class UISystem {
	private m_rscene: IRendererScene = null;
	private m_graph: IRendererSceneGraph = null;
	private m_bgTex: IRenderTexture;

	uiBuilder = new UIBuilder();
	background = new Background();
	ctrlui = new ParamCtrlUI(false);
	imageSelector = new ImageColorSelector();
	uiHTMLInfo = new UIHTMLInfo();
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

		// this.imageSelector.uiBuilder = this.uiBuilder;
		// this.imageSelector.initialize(this.ctrlui.ruisc);
		// return;
		this.uiBuilder.buildFinishCall = (): void => {
			this.initUIItems();
		};
		this.uiBuilder.initialize(graph);
	}

	private m_currMaterial: RemoveBlackBGMaterial2 = null;
	private m_initUI = true;
	private m_bgColor = new Color4();
	private m_savingCall: () => void = null;
	private m_openingCall: () => void = null;
	private m_initCall: () => void = null;
	setCurrMaterial(currMaterial: RemoveBlackBGMaterial2): void {
		this.m_currMaterial = currMaterial;
	}
	setSavingListener(call: () => void): void {
		this.m_savingCall = call;
	}
	setOpeningListener(call: () => void): void {
		this.m_openingCall = call;
	}
	setInitListener(call: () => void): void {
		this.m_initCall = call;
	}
	disable(): void {
		if (this.m_uiInited) {
			this.ctrlui.ruisc.disable();
			this.background.disable();
		}
	}
	enable(): void {
		if (this.m_uiInited) {
			this.ctrlui.ruisc.enable();
			this.background.enable();
		}
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
	private m_uiInited = false;
	private m_showInitImg = false;
	isInited(): boolean {
		return this.m_uiInited;
	}
	private initUIItems(): void {
		this.m_uiInited = true;
		let ui = this.ctrlui;
		let selectBarStyle: SelectionBarStyle = null;
		selectBarStyle = new SelectionBarStyle();
		selectBarStyle.fontSize = 25;
		selectBarStyle.renderState = RendererState.BACK_ALPHA_ADD_BLENDSORT_STATE;
		selectBarStyle.headFontBgColor.setRGBA4f(1.0, 1.0, 1.0, 0.0);
		selectBarStyle.bodyFontBgColor.setRGBA4f(0.7, 0.7, 0.7, 0.3);
		// selectBarStyle.headAlignType = "left";
		// selectBarStyle.headAlignPosValue = -190;
		selectBarStyle.headAlignType = "right";
		selectBarStyle.headAlignPosValue = -20;
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
		progressBarStyle.headAlignType = selectBarStyle.headAlignType;
		progressBarStyle.headAlignPosValue = selectBarStyle.headAlignPosValue;
		progressBarStyle.headEnabled = selectBarStyle.headEnabled;
		progressBarStyle.progressBarLength = 250;

		selectBarStyle.headVisible = false;
		let bparam = new StatusItemBuildParam("切换", "change_bg_color", "随机切换环境背景", "随机切换环境背景", false);
		bparam.style = selectBarStyle;
		ui.addStatusItemWithParam(bparam, (info: CtrlInfo): void => {
			this.background.changeBGColor();
		});
		selectBarStyle.headVisible = true;
		ui.addStatusItem(
			"图像处理方式",
			"reset_init_img",
			"保持原图",
			"背景剔除",
			false,
			(info: CtrlInfo): void => {
				if (this.m_currMaterial) {
					// this.m_currMaterial.setParam3(info.flag ? 0.0 : 1.0);
					this.m_showInitImg = info.flag;
					this.m_currMaterial.showInitImg( info.flag );
				}
			},
			true,
			false,
			selectBarStyle
		);
		ui.addStatusItem(
			"背景剔除方式",
			"invert_discard",
			"反相背景剔除",
			"正常背景剔除",
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
			"输出透明度分离程度",
			"separate_alpha",
			1.0,
			1.0,
			15,
			(info: CtrlInfo): void => {
				if (this.m_currMaterial) {
					this.m_currMaterial.separateAlpha(info.values[0]);
				}
			},
			false,
			true,
			null,
			false,
			progressBarStyle
		);
		ui.addStatusItem(
			"输出透明度翻转",
			"invert_alpha",
			"是",
			"否",
			false,
			(info: CtrlInfo): void => {
				if (this.m_currMaterial) {
					this.m_currMaterial.setInvertAlpha(info.flag);
				}
			},
			true,
			false,
			selectBarStyle
		);
		ui.addStatusItem(
			"输出颜色值翻转",
			"invert_rgb",
			"是",
			"否",
			false,
			(info: CtrlInfo): void => {
				if (this.m_currMaterial) {
					this.m_currMaterial.setInvertRGB(info.flag);
				}
			},
			true,
			false,
			selectBarStyle
		);

		ui.addValueItem(
			"应用原始透明度",
			"init_alpha_factor",
			1.0,
			0.0,
			1.0,
			(info: CtrlInfo): void => {
				if (this.m_currMaterial) {
					this.m_currMaterial.setInitAlphaFactor(info.values[0]);
				}
			},
			false,
			true,
			null,
			false,
			progressBarStyle
		);
		ui.addValueItem(
			"色彩透明度强度",
			"color_alpha_factor",
			1.0,
			0.0,
			3.0,
			(info: CtrlInfo): void => {
				if (this.m_currMaterial) {
					this.m_currMaterial.setColorAlphaStrength(info.values[0]);
				}
			},
			false,
			true,
			null,
			false,
			progressBarStyle
		);

		ui.addValueItem(
			"色彩强度",
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
			"背景剔除比例",
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
		ui.addValueItem(
			"背景剔除颜色阈值",
			"alpha_discard_threshold",
			0.5,
			0.0,
			1.0,
			(info: CtrlInfo): void => {
				if (this.m_currMaterial) {
					this.m_currMaterial.setDiscardRadius(info.values[0]);
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

		this.applyAddIntoBtn( addIntoBtn );

		ui.ruisc.addEntity(resetBtn);
		ui.ruisc.addEntity(saveBtn);
		ui.ruisc.addEntity(addIntoBtn);

		this.uiHTMLInfo.initialize(ui.ruisc);
		this.updateLayoutUI();
		this.background.changeBGColor();
		if (this.m_initCall) {
			this.m_initCall();
		}
		let imgSelector = this.imageSelector;
		imgSelector.uiBuilder = this.uiBuilder;
		imgSelector.uiHTMLInfo = this.uiHTMLInfo;
		imgSelector.uiBackground = this.background;
		imgSelector.initialize(ui.ruisc);
	}
	private applyAddIntoBtn(addIntoBtn: ColorRectImgButton): void {

		addIntoBtn.addEventListener(MouseEvent.MOUSE_DOWN, this, (evt: any): void => {
			if(this.imageSelector.isSelecting()) {
				let color = this.imageSelector.selectColor();
				if(color) {
					if (this.m_currMaterial) {
						this.m_currMaterial.setDiscardDstRGB(color.r, color.g, color.b);
						this.m_currMaterial.showInitImg( false );
					}
				}
			}else {
				if (this.m_openingCall) {
					this.m_openingCall();
				}
			}
		});

		addIntoBtn.addEventListener(MouseEvent.MOUSE_OVER, this, (evt: any): void => {
			if(this.imageSelector.isSelecting()) {
				if (this.m_currMaterial) {
					this.m_currMaterial.showInitImg( true );
				}
			}
		});
		addIntoBtn.addEventListener(MouseEvent.MOUSE_OUT, this, (evt: any): void => {
			if(this.imageSelector.isSelecting()) {
				if (this.m_currMaterial) {
					this.m_currMaterial.showInitImg( this.m_showInitImg );
				}
			}
		});
	}
	hideSpecBtns(): void {
		this.uiBuilder.hideSpecBtns();
		this.uiHTMLInfo.hideSpecInfos();
	}

	applyFunction(key: string): void {
		switch (key) {
			case "open_award":
			case "close_award":
				this.uiHTMLInfo.applyFunction( key );
				break;
			default:
				break;
		}
	}
	private resetCtrlValue(): void {
		let ui = this.ctrlui;

		console.log("resetCtrlValue() ...");
		ui.setUIItemValue("color_alpha_factor", 1.0);
		ui.setUIItemValue("color_factor", 1.0);
		ui.setUIItemValue("alpha_discard_factor", 0.02);
		ui.setUIItemValue("alpha_discard_threshold", 0.5);
		ui.setUIItemValue("init_alpha_factor", 1.0);
		ui.setUIItemValue("separate_alpha", 1.0);
		ui.setUIItemFlag("invert_alpha", false);
		ui.setUIItemFlag("invert_rgb", false);
		ui.setUIItemFlag("reset_init_img", false);
		ui.setUIItemFlag("invert_discard", false);
	}
	updateLayoutUI(): void {
		this.updateLayout(this.m_areaRect);
	}
	private m_areaRect: IAABB2D = null;
	updateLayout(rect: IAABB2D = null): void {
		if (this.m_uiInited) {
			this.m_areaRect = rect;
			let ui = this.ctrlui;
			if (ui) {
				let st = this.m_rscene.getStage3D();
				// let uiBodyH = ui.getBodyHeight(true);
				let uiAreaH = 430;
				let pv = this.position;
				// pv.x = st.stageHalfWidth + 20;
				// pv.y = st.stageHalfHeight + (-256 + 105);
				pv.x = st.stageHalfWidth + 25;
				pv.y = st.stageHalfHeight + 256 - uiAreaH;
				ui.updateLayout(true, pv, 0, uiAreaH);

				let bounds = ui.bounds;
				let py = st.stageHalfHeight - 256 - 2;
				let resetBtn = this.uiBuilder.resetBtn;
				let saveBtn = this.uiBuilder.saveBtn;
				let addIntoBtn = this.uiBuilder.addIntoBtn;
				if (resetBtn) {
					resetBtn.setXY(bounds.x, py);
					saveBtn.setXY(bounds.getRight() - saveBtn.getWidth(), py);
					let sx = 512 / addIntoBtn.getWidth();
					let sy = 512 / addIntoBtn.getHeight();
					// addIntoBtn.setXY(st.stageHalfWidth - 512 + 128, st.stageHalfHeight - 128);
					addIntoBtn.setXY(st.stageHalfWidth - 512, st.stageHalfHeight - 256);
					addIntoBtn.setScaleXYZ(sx, sy, 1.0);
					addIntoBtn.update();
				}

				this.uiHTMLInfo.updateLayout();
				this.imageSelector.updateLayout(rect);
			}
			if (this.background) {
				this.background.updateLayout(rect);
			}
		}
	}
}

export { UISystem };
