import IRendererScene from "../../../../vox/scene/IRendererScene";
import { ICoRScene } from "../../../voxengine/ICoRScene";
import { ICoMath } from "../../../math/ICoMath";
import { ICoMaterial } from "../../../voxmaterial/ICoMaterial";
import { ICoEdit } from "../../../edit/ICoEdit";
import { ICoUI } from "../../../voxui/ICoUI";
import { ICoUIScene } from "../../../voxui/scene/ICoUIScene";

import { ICoUIInteraction } from "../../../voxengine/ui/ICoUIInteraction";
import ITransformEntity from "../../../../vox/entity/ITransformEntity";
import IVector3D from "../../../../vox/math/IVector3D";
import { ITransformController } from "../../../edit/transform/ITransformController";

import { UserEditEvent } from "../../../edit/event/UserEditEvent";
import { IButton } from "../../../voxui/button/IButton";
import { CoPostOutline } from "../../effect/CoPostOutline";
import { NVUIRectLine } from "./NVUIRectLine";
import { IColorClipLabel } from "../../../voxui/entity/IColorClipLabel";
import { NVRectFrameQuery } from "./NVRectFrameQuery";
import IRenderEntity from "../../../../vox/render/IRenderEntity";
import { ICoKeyboardInteraction } from "../../../voxengine/ui/ICoKeyboardInteraction";
import { ICoTransformRecorder } from "../../../edit/recorde/ICoTransformRecorder";
import { IRectTextTip } from "../../../voxui/entity/IRectTextTip";
import { ISelectButtonGroup } from "../../../voxui/button/ISelectButtonGroup";
import { TipInfo } from "../../../voxui/base/TipInfo";
import { IUIFontFormat } from "../../../voxui/system/IUIConfig";
import { IUIPanelConfig } from "../../../voxui/system/uiconfig/IUIPanelConfig";

declare var CoRScene: ICoRScene;
declare var CoUIInteraction: ICoUIInteraction;
declare var CoMath: ICoMath;
declare var CoMaterial: ICoMaterial;
declare var CoEdit: ICoEdit;
declare var CoUI: ICoUI;

/**
 * NVTransUI
 */
class NVTransUI {

	private m_rsc: IRendererScene = null;
	private m_editUIRenderer: IRendererScene = null;
	private m_uirsc: IRendererScene = null;
	private m_coUIScene: ICoUIScene = null;
	private m_outline: CoPostOutline = null;
	// tip: IRectTextTip = null;
	constructor() { }

	setOutline(outline: CoPostOutline): void {
		this.m_outline = outline;
	}

	initialize(rsc: IRendererScene, editUIRenderer: IRendererScene, coUIScene: ICoUIScene): void {
		if (this.m_coUIScene == null) {
			this.m_rsc = rsc;
			this.m_editUIRenderer = editUIRenderer;
			this.m_coUIScene = coUIScene;

			this.init();
		}
	}
	private m_transCtr: ITransformController = null;
	private m_selectFrame: NVUIRectLine = null;
	private m_keyInterac: ICoKeyboardInteraction;
	private m_recoder: ICoTransformRecorder;
	private init(): void {

		this.m_rsc.addEventListener(CoRScene.KeyboardEvent.KEY_DOWN, this, this.keyDown);
		this.m_rsc.addEventListener(CoRScene.MouseEvent.MOUSE_BG_CLICK, this, this.mouseClickListener);
		this.m_rsc.addEventListener(CoRScene.MouseEvent.MOUSE_UP, this, this.mouseUpListener, true, true);

		let editsc = this.m_editUIRenderer;

		this.m_transCtr = CoEdit.createTransformController();
		this.m_transCtr.initialize(editsc);
		this.m_transCtr.addEventListener(UserEditEvent.EDIT_BEGIN, this, this.editBegin);
		this.m_transCtr.addEventListener(UserEditEvent.EDIT_END, this, this.editEnd);
		this.m_prevPos = CoMath.createVec3();
		this.m_currPos = CoMath.createVec3();

		this.m_keyInterac = CoUIInteraction.createKeyboardInteraction();
		this.m_keyInterac.initialize(this.m_rsc);

		let Key = CoRScene.Keyboard;
		let type = this.m_keyInterac.createKeysEventType([Key.CTRL, Key.Y]);
		this.m_keyInterac.addKeysDownListener(type, this, this.keyCtrlYDown);
		type = this.m_keyInterac.createKeysEventType([Key.CTRL, Key.Z]);
		this.m_keyInterac.addKeysDownListener(type, this, this.keyCtrlZDown);

		this.m_recoder = CoEdit.createTransformRecorder();

		this.initUI();
	}

	private keyCtrlZDown(evt: any): void {
		this.m_recoder.undo();
		let list = this.m_recoder.getCurrList();
		this.selectEntities(list);
	}
	private keyCtrlYDown(evt: any): void {
		this.m_recoder.redo();
		let list = this.m_recoder.getCurrList();
		this.selectEntities(list);
	}
	getRecoder(): ICoTransformRecorder {
		return this.m_recoder;
	}
	private m_prevPos: IVector3D;
	private m_currPos: IVector3D;
	private editBegin(evt: any): void {
		let st = this.m_rsc.getStage3D();
		this.m_prevPos.setXYZ(st.mouseX, st.mouseY, 0);
	}
	private editEnd(evt: any): void {
		let st = this.m_rsc.getStage3D();
		this.m_currPos.setXYZ(st.mouseX, st.mouseY, 0);
		if (CoMath.Vector3D.Distance(this.m_prevPos, this.m_currPos) > 0.5) {

			let list = evt.currentTarget.getTargetEntities();
			this.m_recoder.save(list);

		}
	}
	private m_transBtns: IButton[] = [];
	private initUI(): void {

		this.m_uirsc = this.m_coUIScene.rscene;

		this.m_entityQuery = new NVRectFrameQuery();
		this.m_entityQuery.initialize(this.m_rsc);

		let rsc = this.m_uirsc;
		this.m_rsc.addEventListener(CoRScene.MouseEvent.MOUSE_BG_DOWN, this, this.uiMouseDownListener);
		rsc.addEventListener(CoRScene.MouseEvent.MOUSE_UP, this, this.uiMouseUpListener);
		rsc.addEventListener(CoRScene.MouseEvent.MOUSE_MOVE, this, this.uiMouseMoveListener);

		if (this.m_selectFrame == null) {
			this.m_selectFrame = new NVUIRectLine();
			this.m_selectFrame.initialize(this.m_uirsc);
			this.m_selectFrame.setZ(-0.5);
			this.m_selectFrame.enable();
		}

		this.initTransUI();
	}

	private m_btnGroup: ISelectButtonGroup;
	private initTransUI(): void {

		let uiScene = this.m_coUIScene;
		let cfg = uiScene.uiConfig;
		let uimodule = cfg.getUIPanelCfgByName("transformCtrl");
		console.log("NVTransUI::initTransUI(), uimodule: ", uimodule);

		this.m_btnGroup = CoUI.createSelectButtonGroup();
		// let tta = uiScene.transparentTexAtlas;
		let pw = uimodule.btnTextAreaSize[0];
		let ph = uimodule.btnTextAreaSize[1];
		// let btnNames = ["框选", "移动", "旋转", "缩放"];
		// let keys = ["select", "move", "rotate", "scale"];
		// let tips = [
		// 	"Select items using box selection.",
		// 	"Move selected items(W).",
		// 	"Rotate selected items(R).",
		// 	"Scale(resize) selected items(E)."
		// ];
		let btnNames = uimodule.btnNames;
		let keys = uimodule.btnKeys;

		// let fontFormat = uimodule.fontFormat;
		// tta.setFontName(fontFormat.font);
		// let fontColor = CoMaterial.createColor4();
		// fontColor.fromBytesArray3(cfg.getUIGlobalColor().text);
		// let bgColor = CoMaterial.createColor4(1, 1, 1, 0);
		// for (let i = 0; i < btnNames.length; ++i) {
		// 	let img = tta.createCharsCanvasFixSize(pw, ph, btnNames[i], fontFormat.fontSize, fontColor, bgColor);
		// 	tta.addImageToAtlas(btnNames[i], img);
		// }

		let px = 5;
		pw = uimodule.btnSize[0];
		ph = uimodule.btnSize[1];
		let py = ph * 4;
		for (let i = 0; i < btnNames.length; ++i) {
			let btn = this.createBtn(pw, ph, px, py - ph * i, i, uimodule);
			if (i > 0) {
				this.m_transBtns.push(btn);
				this.m_btnGroup.addButton(btn);
			}
		}

		this.m_btnGroup.setSelectedFunction(
			(btn: IButton): void => {
				cfg.applyButtonGlobalColor(btn, "selected");
				this.selectTrans(btn.uuid);
			},
			(btn: IButton): void => {
				cfg.applyButtonGlobalColor(btn, "common");
			}
		);
		this.m_btnGroup.select(keys[1]);
	}
	private uiMouseDownListener(evt: any): void {

		this.m_selectFrame.begin(evt.mouseX, evt.mouseY);
		// console.log("NVTransUI::uiMouseDownListener(), evt: ", evt);
		// console.log("ui down (x, y): ", evt.mouseX, evt.mouseY);
	}
	private uiMouseUpListener(evt: any): void {

		// console.log("NVTransUI::uiMouseUpListener(), evt: ", evt);
		// console.log("ui up (x, y): ", evt.mouseX, evt.mouseY);

		if (this.m_selectFrame.isSelectEnabled()) {

			let b = this.m_selectFrame.bounds;
			let list = this.m_entityQuery.getEntities(b.min, b.max);
			this.selectEntities(list);
		}
		this.m_selectFrame.end(evt.mouseX, evt.mouseY);
	}
	private uiMouseMoveListener(evt: any): void {
		// console.log("NVTransUI::uiMouseMoveListener(), evt: ", evt);
		// console.log("ui move (x, y): ", evt.mouseX, evt.mouseY);
		this.m_selectFrame.move(evt.mouseX, evt.mouseY);
	}
	private createBtn(pw: number, ph: number, px: number, py: number, btnIndex: number, cfgData: IUIPanelConfig): IButton {

		let tta = this.m_coUIScene.transparentTexAtlas;
		let cfg = this.m_coUIScene.uiConfig;

		let names = cfgData.btnNames;
		let keys = cfgData.btnKeys;
		let tips = cfgData.btnTips;

		let fontFormat = cfgData.btnTextFontFormat;
		tta.setFontName(fontFormat.font);
		let fontColor = CoMaterial.createColor4();
		fontColor.fromBytesArray3(cfg.getUIGlobalColor().text);
		let bgColor = CoMaterial.createColor4(1, 1, 1, 0);
		let img = tta.createCharsCanvasFixSize(pw, ph, names[btnIndex], fontFormat.fontSize, fontColor, bgColor);
		tta.addImageToAtlas(names[btnIndex], img);

		let label = CoUI.createClipColorLabel();
		label.initializeWithoutTex(pw, ph, 4);

		let iconLable = CoUI.createClipLabel();
		iconLable.transparent = true;
		iconLable.premultiplyAlpha = true;
		iconLable.initialize(tta, [names[btnIndex]]);

		let btn = CoUI.createButton();
		btn.uuid = keys[btnIndex];
		btn.addLabel(iconLable);
		btn.initializeWithLable(label);
		let btnStyle = cfgData.buttonStyle;
		console.log("XXXXXX btnStyle: ", btnStyle);
		if (btnStyle != undefined) {
			if (btnStyle.globalColor != undefined) {
				cfg.applyButtonGlobalColor(btn, btnStyle.globalColor);
			}
		}
		if (tips.length > btnIndex) {
			this.m_coUIScene.tips.addTipsTarget(btn);
			btn.info = CoUI.createTipInfo().alignRight().setContent(tips[btnIndex]);
		}

		btn.setXY(px, py);

		this.m_coUIScene.addEntity(btn, 1);

		return btn;
	}


	private selectTrans(uuid: string): void {
		switch (uuid) {

			case "move":
				this.m_transCtr.toTranslation();
				break;

			case "scale":
				this.m_transCtr.toScale();
				break;

			case "rotate":
				this.m_transCtr.toRotation();
				break;
			default:
				break;
		}
		if (this.m_selectList == null) {
			this.m_transCtr.disable();
		}
	}
	private keyDown(evt: any): void {

		console.log("NVTransUI::keyDown() ..., evt.keyCode: ", evt.keyCode);

		let KEY = CoRScene.Keyboard;
		switch (evt.keyCode) {
			case KEY.W:
				this.m_btnGroup.select(this.m_transBtns[0].uuid);
				break;
			case KEY.R:
				this.m_btnGroup.select(this.m_transBtns[1].uuid);
				break;
			case KEY.E:
				this.m_btnGroup.select(this.m_transBtns[2].uuid);
				break;
			default:
				break;
		}
	}
	private m_entityQuery: NVRectFrameQuery = null;
	private m_selectList: IRenderEntity[] = null;
	private m_selectListeners: ((list: IRenderEntity[]) => void)[] = [];
	addSelectListener(listener: (list: IRenderEntity[]) => void): void {
		if (listener != null) {
			this.m_selectListeners.push(listener);
		}
	}
	private sendSelectList(list: IRenderEntity[]): void {
		let ls = this.m_selectListeners;
		let len = ls.length;
		for (let i = 0; i < len; ++i) {
			ls[i](list);
		}
	}
	selectEntities(list: IRenderEntity[]): void {
		this.m_selectList = list;
		if (list != null && list.length > 0) {
			let transCtr = this.m_transCtr;

			let pos = CoMath.createVec3();
			let pv = CoMath.createVec3();

			for (let i = 0; i < list.length; ++i) {
				pos.addBy(pv.copyFrom(list[i].getGlobalBounds().center));
			}
			pos.scaleBy(1.0 / list.length);

			if (transCtr != null) {
				transCtr.select(list as ITransformEntity[], pos);
				this.m_outline.select(list);
			}
			this.sendSelectList(list);
		} else {
			this.sendSelectList(null);
		}
	}
	private mouseUpListener(evt: any): void {

		// console.log("NVTransUI::mouseUpListener() ...");
		if (this.m_transCtr != null) {
			this.m_transCtr.decontrol();
		}
	}
	private mouseClickListener(evt: any): void {
		this.deselect();
	}
	deselect(): void {

		this.m_selectList = null;
		if (this.m_transCtr != null) {
			this.m_transCtr.disable();
		}

		this.m_outline.deselect();
		this.sendSelectList(null);
	}
	run(): void {

		if (this.m_transCtr != null) {
			this.m_transCtr.run();
		}
	}

}

export { NVTransUI };
