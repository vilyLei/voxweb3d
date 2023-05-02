import RendererState from "../../../vox/render/RendererState";
import IRendererScene from "../../../vox/scene/IRendererScene";
import IRendererSceneGraph from "../../../vox/scene/IRendererSceneGraph";

import RemoveBlackBGMaterial2 from "../../material/RemoveBlackBGMaterial2";

import SelectionBarStyle from "../../../orthoui/button/SelectionBarStyle";
import { ProgressItemBuildParam, ValueItemBuildParam, StatusItemBuildParam, CtrlInfo, ParamCtrlUI } from "../../../orthoui/usage/ParamCtrlUI";

import { Background2D } from "./Background2D";
import Vector3D from "../../../vox/math/Vector3D";
import ProgressBarStyle from "../../../orthoui/button/ProgressBarStyle";
import { UIBuilder } from "./UIBuilder";
import { UIHTMLInfo } from "./UIHTMLInfo";
import { ImageColorSelector } from "./ImageColorSelector";
import MouseEvent from "../../../vox/event/MouseEvent";
import IAABB2D from "../../../vox/geom/IAABB2D";
import ColorRectImgButton from "../../../orthoui/button/ColorRectImgButton";
import SelectionBar from "../../../orthoui/button/SelectionBar";
import UIBarTool from "../../../orthoui/button/UIBarTool";
import TextureConst from "../../../vox/texture/TextureConst";
import AABB2D from "../../../vox/geom/AABB2D";
import { ILayoutBtn, BtnLayouter } from "./BtnLayouter";
import { ToyBrushDataRecorder } from "../edit/ToyBrushDataRecorder";
import { ToyTransparentBrush } from "../edit/ToyTransparentBrush";

class AlphaOperationUI {
	private m_rscene: IRendererScene = null;
	private m_graph: IRendererSceneGraph = null;

	background: Background2D = null;
	imageSelector: ImageColorSelector;
	uiHTMLInfo: UIHTMLInfo;
	processTotal = 6;

	// brushRecorder: ToyBrushDataRecorder = null;
	readonly transparentBrush = new ToyTransparentBrush();
	readonly ctrlui = new ParamCtrlUI(false);
	readonly uiBuilder = new UIBuilder();

	buildFinishCall: () => void = null;
	constructor() {}

	initialize(graph: IRendererSceneGraph): void {
		if (this.m_graph == null && graph != null) {
			this.m_graph = graph;
			this.m_rscene = this.m_graph.getNodeAt(0).getRScene();
			// this.brushRecorder = this.transparentBrush.brushRecorder;
			this.initUI();
			this.transparentBrush.initialize( this.ctrlui.ruisc );

			this.uiBuilder.buildFinishCall = (): void => {
				this.initUIItems();
				if (this.buildFinishCall) {
					this.buildFinishCall();
				}
			};
			this.uiBuilder.initialize(graph);
		}
	}
	saveImage(): void {
		if (this.m_savingCall) {
			this.m_savingCall();
		}
	}
	private m_currMaterial: RemoveBlackBGMaterial2 = null;
	private m_initUI = true;
	private m_savingCall: () => void = null;
	private m_openingCall: () => void = null;
	setSavingListener(call: () => void): void {
		this.m_savingCall = call;
	}
	setOpeningListener(call: () => void): void {
		this.m_openingCall = call;
	}
	setCurrMaterial(currMaterial: RemoveBlackBGMaterial2): void {
		this.m_currMaterial = currMaterial;
		this.imageSelector.setCurrMaterial(currMaterial);
		this.transparentBrush.setCtrlParams(this.ctrlui, currMaterial);
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
	// private m_showInitImg = false;
	private m_expandUIItemBtn: SelectionBar = null;
	isInited(): boolean {
		return this.m_uiInited;
	}
	private initUIItems(): void {

		// let brd = this.brushRecorder;
		let brush = this.transparentBrush;

		this.m_uiInited = true;
		let ui = this.ctrlui;
		UIBarTool.TexPool.heightOffset = 9;
		let itemForceVisible = false;
		let selectBarStyle: SelectionBarStyle = null;
		selectBarStyle = new SelectionBarStyle();
		selectBarStyle.scale = 1.0;
		selectBarStyle.fontSize = 25;
		selectBarStyle.renderState = RendererState.BACK_ALPHA_ADD_BLENDSORT_STATE;
		selectBarStyle.headFontBgColor.setRGBA4f(1.0, 1.0, 1.0, 0.0);
		selectBarStyle.bodyFontBgColor.setRGBA4f(0.7, 0.7, 0.7, 0.3);
		// selectBarStyle.headAlignType = "left";
		// selectBarStyle.headAlignPosValue = -190;
		selectBarStyle.headAlignType = "right";
		selectBarStyle.headAlignPosValue = -20;
		selectBarStyle.headEnabled = false;
		selectBarStyle.bodyFixWidth = 308;

		let progressBarStyle: ProgressBarStyle = null;
		progressBarStyle = new ProgressBarStyle();
		progressBarStyle.scale = selectBarStyle.scale;
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
		selectBarStyle.visible = false || itemForceVisible;

		let str = "随机切换环境背景";
		let statusp = new StatusItemBuildParam("切换", "change_bg_color", str, str, false);
		statusp.style = selectBarStyle;
		ui.addStatusItemWithParam(statusp, (info: CtrlInfo): void => {
			this.background.changeBGColor();
		});
		selectBarStyle.headVisible = true;

		selectBarStyle.visible = true || itemForceVisible;
		// statusp = new StatusItemBuildParam("图像处理方式", "img_operate_mode", "保持原图", "去除背景", brush.imgOperateMode.flag);
		statusp = brush.imgOperateMode.createUIItemParam() as StatusItemBuildParam;
		statusp.style = selectBarStyle;
		ui.addStatusItemWithParam(statusp, (info: CtrlInfo): void => {
			// this.m_showInitImg = info.flag;
			// this.m_currMaterial.setShowInitImg(info.flag);
			brush.imgOperateMode.setFlag(info.flag);
		});

		selectBarStyle.visible = false || itemForceVisible;
		// statusp = new StatusItemBuildParam("背景去除方式", "invert_discard", "反相去除", "正常去除", brush.invertDiscard.flag);
		statusp = brush.invertDiscard.createUIItemParam() as StatusItemBuildParam;
		statusp.style = selectBarStyle;
		ui.addStatusItemWithParam(statusp, (info: CtrlInfo): void => {
			brush.invertDiscard.setFlag(info.flag);
			// if (this.m_currMaterial) {
			// 	this.m_currMaterial.setInvertDiscard(info.flag);
			// }
		});
		selectBarStyle.visible = false || itemForceVisible;
		// statusp = new StatusItemBuildParam("输出透明度翻转", "invert_alpha", "是", "否", false);
		statusp = brush.invertAlpha.createUIItemParam() as StatusItemBuildParam;
		statusp.style = selectBarStyle;
		ui.addStatusItemWithParam(statusp, (info: CtrlInfo): void => {
			// if (this.m_currMaterial) {
			// 	this.m_currMaterial.setInvertAlpha(info.flag);
			// }
			brush.invertAlpha.setFlag(info.flag);
		});
		selectBarStyle.visible = false || itemForceVisible;
		// statusp = new StatusItemBuildParam("输出颜色值翻转", "invert_rgb", "是", "否", false);
		statusp = brush.invertRGB.createUIItemParam() as StatusItemBuildParam;
		statusp.style = selectBarStyle;
		ui.addStatusItemWithParam(statusp, (info: CtrlInfo): void => {
			// if (this.m_currMaterial) {
			// 	this.m_currMaterial.setInvertRGB(info.flag);
			// }
			brush.invertRGB.setFlag(info.flag);
		});
		progressBarStyle.visible = false || itemForceVisible;
		// let valuep = new ValueItemBuildParam("透明度分离", "separate_alpha", 1, 1, 15);
		let valuep = brush.separateAlpha.createUIItemParam() as ValueItemBuildParam;
		valuep.style = progressBarStyle;
		ui.addValueItemWithParam(valuep, (info: CtrlInfo): void => {
			// if (this.m_currMaterial) {
			// 	this.m_currMaterial.setSeparateAlpha(info.values[0]);
			// }
			brush.separateAlpha.setValue( info.values[0] );
		});

		progressBarStyle.visible = false || itemForceVisible;
		// valuep = new ValueItemBuildParam("应用原始透明度", "init_alpha_factor", 1, 0, 1);
		valuep = brush.initAlphaFactor.createUIItemParam() as ValueItemBuildParam;
		valuep.style = progressBarStyle;
		ui.addValueItemWithParam(valuep, (info: CtrlInfo): void => {
			// if (this.m_currMaterial) {
			// 	this.m_currMaterial.setInitAlphaFactor(info.values[0]);
			// }
			brush.initAlphaFactor.setValue( info.values[0] );
		});
		progressBarStyle.visible = true || itemForceVisible;
		// valuep = new ValueItemBuildParam("透明度强度", "color_alpha_strength", 1, 0, 3);
		valuep = brush.colorAlphaStrength.createUIItemParam() as ValueItemBuildParam;
		valuep.style = progressBarStyle;
		ui.addValueItemWithParam(valuep, (info: CtrlInfo): void => {
			// if (this.m_currMaterial) {
			// 	this.m_currMaterial.setColorAlphaStrength(info.values[0]);
			// }
			brush.colorAlphaStrength.setValue(info.values[0]);
		});
		progressBarStyle.visible = false || itemForceVisible;
		// valuep = new ValueItemBuildParam("色彩强度", "color_strength", 1, 0, 5);
		valuep = brush.colorStrength.createUIItemParam() as ValueItemBuildParam;
		valuep.style = progressBarStyle;
		ui.addValueItemWithParam(valuep, (info: CtrlInfo): void => {
			// if (this.m_currMaterial) {
			// 	this.m_currMaterial.setColorStrength(info.values[0]);
			// }
			brush.colorStrength.setValue( info.values[0] );
		});

		progressBarStyle.visible = true || itemForceVisible;
		// valuep = new ValueItemBuildParam("背景去除比例", "alpha_discard_factor", 0.02, 0.0, 0.96);
		valuep = brush.alphaDiscardFactor.createUIItemParam() as ValueItemBuildParam;
		valuep.style = progressBarStyle;
		ui.addValueItemWithParam(valuep, (info: CtrlInfo): void => {
			// if (this.m_currMaterial) {
			// 	this.m_currMaterial.setAlphaDiscardFactor(info.values[0]);
			// }
			brush.alphaDiscardFactor.setValue( info.values[0] );
		});
		progressBarStyle.visible = true || itemForceVisible;
		// valuep = new ValueItemBuildParam("背景去除颜色阈值", "alpha_discard_threshold", 0.5, 0.0, 1.0);
		valuep = brush.alphaDiscardThreshold.createUIItemParam() as ValueItemBuildParam;
		valuep.style = progressBarStyle;
		ui.addValueItemWithParam(valuep, (info: CtrlInfo): void => {
			// if (this.m_currMaterial) {
			// 	this.m_currMaterial.setDiscardRadius(info.values[0]);
			// }
			// console.log("alpha_discard_threshold, info: ", info);
			brush.alphaDiscardThreshold.setValue( info.values[0] );
		});

		let imgSelector = this.imageSelector;
		imgSelector.uiBuilder = this.uiBuilder;
		imgSelector.uiHTMLInfo = this.uiHTMLInfo;
		imgSelector.uiBackground = this.background;
		imgSelector.initialize(ui.ruisc);

		selectBarStyle.bodyFontColor.setRGBA4f(1.0, 1.0, 1.0, 1.0);
		selectBarStyle.bodyFontBgColor.setRGBA4f(1.0, 1.0, 1.0, 0.3);
		selectBarStyle.trueImageKey = "expandUIItem_true";
		selectBarStyle.falseImageKey = "expandUIItem_false";
		statusp = new StatusItemBuildParam("", "expandUIItem", "-", "-", true);

		statusp.style = selectBarStyle;
		statusp.layout = false;
		selectBarStyle.visible = true || itemForceVisible;

		ui.addStatusItemWithParam(statusp, (info: CtrlInfo): void => {
			this.m_expandUIItemBtn = ui.getBtnByUUID("expandUIItem") as SelectionBar;
			this.itemsExpand(!info.flag);
		});

		let resetBtn = this.uiBuilder.resetBtn;
		let saveBtn = this.uiBuilder.saveBtn;
		let addIntoBtn = this.uiBuilder.addIntoBtn;
		resetBtn.addEventListener(MouseEvent.MOUSE_UP, this, (evt: any): void => {
			this.resetCtrlValue();
		});
		saveBtn.addEventListener(MouseEvent.MOUSE_UP, this, (evt: any): void => {
			this.saveImage();
		});

		this.m_currUIDs = ui.getVisibleLayoutBtnUUIDs();
		this.m_allUIDs = ui.getAllLayoutBtnUUIDs();

		this.applyAddIntoBtn(addIntoBtn);
		let ruisc = ui.ruisc;
		ruisc.addEntity(resetBtn);
		ruisc.addEntity(saveBtn);
		ruisc.addEntity(addIntoBtn);

		this.background.buildInfo();
		this.uiHTMLInfo.initialize(ui.ruisc);
		this.updateLayoutUI();
		this.background.changeBGColor();
		// if (this.m_initCall) {
		// 	this.m_initCall();
		// }
	}
	private m_currUIDs: string[] = [];
	private m_allUIDs: string[] = [];
	private m_uiAreaH = 430;
	private m_uiAreaHK = 0.84;
	private itemsExpand(flag: boolean): void {
		let ui = this.ctrlui;
		let ls = flag ? this.m_allUIDs : this.m_currUIDs;
		for (let i = 0; i < this.m_allUIDs.length; ++i) {
			ui.getItemByUUID(this.m_allUIDs[i]).btn.setVisible(false);
		}
		if (flag) {
			this.imageSelector.setVisible(true);
			this.m_uiAreaH = 430;
			this.m_uiAreaHK = 0.84;
			for (let i = 0; i < ls.length; ++i) {
				ui.getItemByUUID(ls[i]).btn.setVisible(true);
			}
		} else {
			this.m_uiAreaH = 410;
			this.m_uiAreaHK = 0.8;
			for (let i = 0; i < ls.length; ++i) {
				ui.getItemByUUID(ls[i]).btn.setVisible(true);
			}
			this.m_selectColor = false;
			this.imageSelector.reset();
			if (this.m_currMaterial) {
				this.m_currMaterial.setShowInitImg(this.transparentBrush.imgOperateMode.flag);
			}
		}
		this.uiHTMLInfo.hideSpecInfos();
		this.updateLayoutUI();
	}
	private m_selectColor = false;
	private applyAddIntoBtn(addIntoBtn: ColorRectImgButton): void {
		let tar = this.imageSelector;
		addIntoBtn.addEventListener(MouseEvent.MOUSE_MOVE, this, (evt: any): void => {
			if (tar.isSelecting()) {
				if (this.m_currMaterial) {
					if (tar.isHitImgWithMouseXY() && this.m_selectColor) {
						this.m_currMaterial.setShowInitImg(false);
					} else {
						this.m_currMaterial.setShowInitImg(this.transparentBrush.imgOperateMode.flag);
					}
				}
			}
		});
		addIntoBtn.addEventListener(MouseEvent.MOUSE_DOWN, this, (evt: any): void => {
			let mt = this.m_currMaterial;
			if (mt && tar.isSelecting()) {
				let color = tar.selectColor();
				if (color) {
					this.m_selectColor = true;
					mt.setDiscardDstRGB(color.r, color.g, color.b);
					mt.setShowInitImg(false);
					return;
				}
			}
			if (this.m_openingCall) {
				this.m_openingCall();
			}
		});

		addIntoBtn.addEventListener(MouseEvent.MOUSE_OVER, this, (evt: any): void => {
			if (tar.isSelecting() && tar.isHitImgWithMouseXY()) {
				if (this.m_currMaterial) {
					this.m_currMaterial.setShowInitImg(true);
				}
			}
		});
		addIntoBtn.addEventListener(MouseEvent.MOUSE_OUT, this, (evt: any): void => {
			this.m_selectColor = false;
			if (this.imageSelector.isSelecting()) {
				if (this.m_currMaterial) {
					this.m_currMaterial.setShowInitImg(this.transparentBrush.imgOperateMode.flag);
				}
			}
		});
	}
	private resetCtrlValue(): void {
		let ui = this.ctrlui;

		console.log("resetCtrlValue() ...");
		ui.setUIItemValue("color_alpha_strength", 1.0);
		ui.setUIItemValue("color_strength", 1.0);
		ui.setUIItemValue("alpha_discard_factor", 0.02);
		ui.setUIItemValue("alpha_discard_threshold", 0.5);
		ui.setUIItemValue("init_alpha_factor", 1.0);
		ui.setUIItemValue("separate_alpha", 1.0);
		ui.setUIItemFlag("invert_alpha", false);
		ui.setUIItemFlag("invert_rgb", false);
		ui.setUIItemFlag("img_operate_mode", false);
		ui.setUIItemFlag("invert_discard", false);

		if (this.m_currMaterial) {
			this.m_currMaterial.setDiscardDstRGB(0, 0, 0);
			// this.m_currMaterial.setShowInitImg( this.transparentBrush.imgOperateMode.flag );
		}
		this.imageSelector.reset(true);
	}
	private updateLayoutUI(): void {
		this.updateLayout(this.m_areaRect);
	}
	private m_areaRect: IAABB2D = null;
	private m_rect = new AABB2D();
	private m_layouter = new BtnLayouter();
	private m_pv = new Vector3D();
	updateLayout(rect: IAABB2D = null): void {
		if (rect) {
			this.m_areaRect = rect;
		} else {
			rect = this.m_areaRect;
		}
		if (this.m_uiInited && rect) {
			let ui = this.ctrlui;
			if (ui) {
				let cx = rect.getCenterX();
				// let cy = rect.getCenterY();
				let uiAreaH = Math.round(rect.height * this.m_uiAreaHK);
				let pv = this.m_pv;
				pv.x = cx + 25;
				pv.y = rect.getTop() - uiAreaH;
				ui.updateLayout(true, pv, 0, uiAreaH);

				let addIntoBtn = this.uiBuilder.addIntoBtn;
				if (addIntoBtn) {
					let size = Math.min(rect.width, rect.height);
					let sx = size / addIntoBtn.getWidth();
					let sy = size / addIntoBtn.getHeight();
					addIntoBtn.setXY(rect.x, rect.y);
					addIntoBtn.setScaleXYZ(sx, sy, 1.0);
					addIntoBtn.update();
				}

				let bounds = ui.bounds;
				this.m_rect.copyFrom(bounds);
				this.m_rect.y = rect.y - 2;
				this.m_rect.height = rect.height - uiAreaH;
				this.updateItemBottomUI(this.m_rect);
			}
		}
	}
	private updateItemBottomUI(rect: IAABB2D): void {
		let resetBtn = this.uiBuilder.resetBtn;
		if (resetBtn) {
			let saveBtn = this.uiBuilder.saveBtn;
			let expandBtn = this.m_expandUIItemBtn;
			this.m_layouter.horizontalLayout(rect, [expandBtn, resetBtn, saveBtn] as ILayoutBtn[]);
		}
	}
}

export { AlphaOperationUI };
