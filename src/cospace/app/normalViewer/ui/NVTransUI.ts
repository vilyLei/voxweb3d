import IRendererScene from "../../../../vox/scene/IRendererScene";
import { ICoRScene } from "../../../voxengine/ICoRScene";
import { ICoMath } from "../../../math/ICoMath";
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
import { NVRectFrameQuery } from "./NVRectFrameQuery";
import IRenderEntity from "../../../../vox/render/IRenderEntity";
import { ICoKeyboardInteraction } from "../../../voxengine/ui/ICoKeyboardInteraction";
import { ICoTransformRecorder } from "../../../edit/recorde/ICoTransformRecorder";
import { ISelectButtonGroup } from "../../../voxui/button/ISelectButtonGroup";
import { ButtonBuilder } from "../../../voxui/button/ButtonBuilder";
import { NormalEntityScene } from "../sc/NormalEntityScene";
// import { CoTransformRecorder } from "../../../edit/recorde/CoTransformRecorder";

declare var CoRScene: ICoRScene;
declare var CoUIInteraction: ICoUIInteraction;
declare var CoMath: ICoMath;
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
	private m_transCtr: ITransformController = null;
	private m_selectFrame: NVUIRectLine = null;
	private m_keyInterac: ICoKeyboardInteraction;
	private m_recoder: ICoTransformRecorder;
	private m_entityQuery: NVRectFrameQuery = null;
	private m_selectList: IRenderEntity[] = null;
	private m_transBtns: IButton[] = [];
	entityScene: NormalEntityScene = null;
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
	getKeyInterac(): ICoKeyboardInteraction {
		return this.m_keyInterac;
	}
	getCoUIScene(): ICoUIScene {
		return this.m_coUIScene;
	}
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
		this.m_coUIScene.keyboardInteraction = this.m_keyInterac;

		let Key = CoRScene.Keyboard;
		let type = this.m_keyInterac.createKeysEventType([Key.CTRL, Key.Y]);
		this.m_keyInterac.addKeysDownListener(type, this, this.keyCtrlYDown);
		type = this.m_keyInterac.createKeysEventType([Key.CTRL, Key.Z]);
		this.m_keyInterac.addKeysDownListener(type, this, this.keyCtrlZDown);
		type = this.m_keyInterac.createKeysEventType([Key.CTRL, Key.A]);
		this.m_keyInterac.addKeysDownListener(type, this, this.keyCtrlADown);

		this.m_recoder = CoEdit.createTransformRecorder();
		// this.m_recoder = new CoTransformRecorder();

		this.initUI();
	}
	selectAll(): void {
		let list = this.entityScene.getAllEntities();
		this.selectEntities(list);
	}
	private keyCtrlADown(evt: any): void {
		this.selectAll();
	}
	private keyCtrlZDown(evt: any): void {
		// console.log("ctrl-z, undo() begin.");
		this.m_recoder.undo();
		let list = this.m_recoder.getCurrList();
		if (list != null) {
			let flag = true;
			for (let i = 0; i < list.length; ++i) {
				if (!list[i].getVisible()) {
					flag = false;
				}
			}
			if (flag) {
				this.selectEntities(list);
			}
		}
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
		let list = evt.currentTarget.getTargetEntities();
		// console.log("editBegin(), entity list: ", list);
		let st = this.m_rsc.getStage3D();
		this.m_prevPos.setXYZ(st.mouseX, st.mouseY, 0);
		this.m_recoder.saveBegin(list);
	}
	private editEnd(evt: any): void {
		let st = this.m_rsc.getStage3D();
		this.m_currPos.setXYZ(st.mouseX, st.mouseY, 0);
		if (CoMath.Vector3D.Distance(this.m_prevPos, this.m_currPos) > 0.5) {
			let list = evt.currentTarget.getTargetEntities();
			// console.log("editEnd(), save list: ", list);
			this.m_recoder.saveEnd(list);
		} else {
			this.m_recoder.saveEnd(null);
		}
	}
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
		let uiCfg = cfg.getUIPanelCfgByName("transformCtrl");

		this.m_btnGroup = CoUI.createSelectButtonGroup();
		let pw = uiCfg.btnTextAreaSize[0];
		let ph = uiCfg.btnTextAreaSize[1];
		let btnNames = uiCfg.btnNames;
		let keys = uiCfg.btnKeys;
		let btnTypes = uiCfg.btnTypes!;
		if (!btnTypes) {
			btnTypes = new Array(keys.length);
			btnTypes.fill(0);
		}
		console.log("NVTransUI::initTransUI(), XXXXXX btnTypes: ", btnTypes);

		let px = 5;
		pw = uiCfg.btnSize[0];
		ph = uiCfg.btnSize[1];
		// let py = uiScene.getStage().stageHeight - ph * 5 - 200;
		let py = 0;
		let defaultKey = "";
		let uiContainer = CoUI.creatUIEntityContainer();
		uiContainer.initContainer();
		for (let i = 0; i < btnNames.length; ++i) {
			const btn = ButtonBuilder.createPanelBtnWithCfg(uiScene, px, py - ph * i, i, uiCfg);
			console.log("XXXXXXXXX uiContainer: ", uiContainer);
			// this.m_coUIScene.addEntity(btn, 1);
			uiContainer.addEntity(btn);
			this.m_transBtns.push(btn);
			if (btnTypes[i] == 1) {
				if (defaultKey == "") {
					defaultKey = keys[i];
				}
				this.m_btnGroup.addButton(btn);
			} else {
				btn.addEventListener(CoRScene.MouseEvent.MOUSE_UP, this, this.btnMouseUpListener);
			}
		}
		this.m_coUIScene.addEntity(uiContainer, 1);
		let layouter = uiScene.layout.createLeftTopLayouter();
		uiContainer.setY(uiScene.getStage().stageHeight - ph * 5);
		layouter.addUIEntity(uiContainer);

		this.m_btnGroup.setSelectedFunction(
			(btn: IButton): void => {
				cfg.applyButtonGlobalColor(btn, "selected");
				this.selectTrans(btn.uuid);
			},
			(btn: IButton): void => {
				cfg.applyButtonGlobalColor(btn, "common");
			}
		);
		if (defaultKey != "") {
			this.m_btnGroup.select(defaultKey);
		}
	}
	private btnMouseUpListener(evt: any): void {
		console.log("evt.uuid: ", evt.uuid);
		switch (evt.uuid) {
			case "select_all":
				console.log("select all...");
				this.selectAll();
				break;
			case "select":
				console.log("select...");
				break;
			default:
				break;
		}
	}
	private uiMouseDownListener(evt: any): void {
		this.m_selectFrame.begin(evt.mouseX, evt.mouseY);
		// console.log("NVTransUI::uiMouseDownListener(), evt: ", evt);
		// console.log("ui down (x, y): ", evt.mouseX, evt.mouseY);
	}
	private uiMouseUpListener(evt: any): void {
		// console.log("NVTransUI::uiMouseUpListener(), evt: ", evt);

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
	private selectTrans(uuid: string): void {
		console.log("selectTrans(), uuid: ", uuid);
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
		// console.log("NVTransUI::keyDown() ..., evt.keyCode: ", evt.keyCode);

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
	private m_selectListeners: ((list: IRenderEntity[]) => void)[] = [];
	private m_selectFilter: (list: IRenderEntity[]) => IRenderEntity[] = null;
	addSelectFilter(filter: (list: IRenderEntity[]) => IRenderEntity[]): void {
		this.m_selectFilter = filter;
	}
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
			if (this.m_selectFilter != null) {
				list = this.m_selectFilter(list);
				this.m_selectList = list;
				if (list == null || list.length < 1) {
					this.m_selectList = null;
					return;
				}
			}
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
