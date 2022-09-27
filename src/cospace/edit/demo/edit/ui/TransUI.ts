import { ICoRendererScene } from "../../../../voxengine/scene/ICoRendererScene";
import { ICoRenderer } from "../../../../voxengine/ICoRenderer";
import { ICoMath } from "../../../../math/ICoMath";
import { ICoEdit } from "../../../../edit/ICoEdit";
import { ICoUI } from "../../../../voxui/ICoUI";
import { ICoUIScene } from "../../../../voxui/scene/ICoUIScene";
import { ICoRScene } from "../../../../voxengine/ICoRScene";

import { ICoUIInteraction } from "../../../../voxengine/ui/ICoUIInteraction";
import ITransformEntity from "../../../../../vox/entity/ITransformEntity";
import IVector3D from "../../../../../vox/math/IVector3D";
import IRendererScene from "../../../../../vox/scene/IRendererScene";
import { ITransformController } from "../../../transform/ITransformController";
import { UserEditEvent } from "../../../event/UserEditEvent";
import { IButton } from "../../../../voxui/entity/IButton";
import { PostOutline } from "../../effect/PostOutline";
import { UIRectLine } from "../../edit/UIRectLine";
import { IColorClipLabel } from "../../../../voxui/entity/IColorClipLabel";
import { RectFrameQuery } from "../../edit/RectFrameQuery";
import IRenderEntity from "../../../../../vox/render/IRenderEntity";
import { ICoKeyboardInteraction } from "../../../../voxengine/ui/ICoKeyboardInteraction";
import { ICoTransformRecorder } from "../../../recorde/ICoTransformRecorder";

declare var CoRenderer: ICoRenderer;
declare var CoRScene: ICoRScene;
declare var CoUIInteraction: ICoUIInteraction;
declare var CoMath: ICoMath;
declare var CoEdit: ICoEdit;
declare var CoUI: ICoUI;

/**
 * TransUI
 */
class TransUI {

	private m_rsc: ICoRendererScene = null;
	private m_editUIRenderer: ICoRendererScene = null;
	private m_uirsc: IRendererScene = null;
	private m_coUIScene: ICoUIScene = null;
	private m_outline: PostOutline = null;

	constructor() { }

	setOutline(outline: PostOutline): void {
		this.m_outline = outline;
	}

	initialize(rsc: ICoRendererScene, editUIRenderer: ICoRendererScene, coUIScene: ICoUIScene): void {
		if(this.m_coUIScene == null) {
			this.m_rsc = rsc;
			this.m_editUIRenderer = editUIRenderer;
			this.m_coUIScene = coUIScene;

			this.init();
		}
	}
	private m_transCtr: ITransformController = null;
	private m_selectFrame: UIRectLine = null;
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

		this.m_entityQuery = new RectFrameQuery();
		this.m_entityQuery.initialize(this.m_rsc);

		let rsc = this.m_uirsc;
		this.m_rsc.addEventListener(CoRScene.MouseEvent.MOUSE_BG_DOWN, this, this.uiMouseDownListener);
		rsc.addEventListener(CoRScene.MouseEvent.MOUSE_UP, this, this.uiMouseUpListener);
		rsc.addEventListener(CoRScene.MouseEvent.MOUSE_MOVE, this, this.uiMouseMoveListener);

		if (this.m_selectFrame == null) {
			this.m_selectFrame = new UIRectLine();
			this.m_selectFrame.initialize(this.m_uirsc);
			this.m_selectFrame.enable();
		}

		this.initTransUI();
	}

	private initTransUI(): void {

		let uiScene = this.m_coUIScene;
		let texAtlas = uiScene.texAtlas;
		let pw = 90;
		let ph = 70;
		let urls = ["框选", "移动", "缩放", "旋转"];
		let keys = ["select", "move", "scale", "rotate"];

		for (let i = 0; i < urls.length; ++i) {
			let img = texAtlas.createCharsCanvasFixSize(pw, ph, urls[i], 30);
			texAtlas.addImageToAtlas(urls[i], img);
		}
		
		let csLable = CoUI.createClipLabel();
		csLable.initialize(texAtlas, [urls[0], urls[1]]);

		let px = 5;
		let py = (5 + csLable.getClipHeight()) * 4;
		ph = 5 + csLable.getClipHeight();
		for (let i = 0; i < urls.length; ++i) {
			let btn = this.crateBtn(urls, px, py - ph * i, i, keys[i]);
			if(i > 0) {
				this.m_transBtns.push(btn);
			}
		}
		this.selectBtn(this.m_transBtns[0]);
		this.m_transCtr.toTranslation();
		this.m_transCtr.disable();
	}
	private uiMouseDownListener(evt: any): void {

		this.m_selectFrame.begin(evt.mouseX, evt.mouseY);
		// console.log("TransUI::uiMouseDownListener(), evt: ", evt);
		// console.log("ui down (x, y): ", evt.mouseX, evt.mouseY);
	}
	private uiMouseUpListener(evt: any): void {
		// console.log("TransUI::uiMouseUpListener(), evt: ", evt);
		// console.log("ui up (x, y): ", evt.mouseX, evt.mouseY);
		if (this.m_selectFrame.isSelectEnabled()) {
			let b = this.m_selectFrame.bounds;
			let list = this.m_entityQuery.getEntities(b.min, b.max);
			this.selectEntities(list);
		}
		this.m_selectFrame.end(evt.mouseX, evt.mouseY);
	}
	private uiMouseMoveListener(evt: any): void {
		// console.log("TransUI::uiMouseMoveListener(), evt: ", evt);
		// console.log("ui move (x, y): ", evt.mouseX, evt.mouseY);
		this.m_selectFrame.move(evt.mouseX, evt.mouseY);
	}
	private m_currBtn: IButton = null;

	private crateBtn(urls: string[], px: number, py: number, labelIndex: number, idns: string): IButton {


		let texAtlas = this.m_coUIScene.texAtlas;
		let label = CoUI.createClipLabel();
		label.initialize(texAtlas, urls);
		let colorClipLabel = CoUI.createColorClipLabel();
		colorClipLabel.initialize(label, 5);
		colorClipLabel.getColorAt(0).setRGB3f(0.0, 0.8, 0.8);
		colorClipLabel.getColorAt(1).setRGB3f(0.2, 1.0, 0.2);
		colorClipLabel.getColorAt(2).setRGB3f(1.0, 0.2, 1.0);
		colorClipLabel.getColorAt(4).setRGB3f(0.5, 0.5, 0.5);
		colorClipLabel.setLabelClipIndex(labelIndex);

		let btn = CoUI.createButton();
		btn.uuid = idns;
		btn.initializeWithLable(colorClipLabel);
		btn.setXY(px, py);
		this.m_coUIScene.addEntity(btn, 1);
		btn.addEventListener(CoRScene.MouseEvent.MOUSE_UP, this, this.btnMouseUpListener);

		return btn;
	}

	private selectBtn(btn: IButton): void {

		let label: IColorClipLabel;

		if (this.m_currBtn != btn) {

			label = btn.getLable() as IColorClipLabel;
			label.getColorAt(0).setRGB3f(0.5, 0.8, 0.6);
			label.setClipIndex(0);

			if (this.m_currBtn != null) {
				label = this.m_currBtn.getLable() as IColorClipLabel;
				label.getColorAt(0).setRGB3f(0.0, 0.8, 0.8);
				label.setClipIndex(0);
			}

			this.m_currBtn = btn;
		}
	}
	private btnMouseUpListener(evt: any): void {

		console.log("btnMouseUpListener(), evt.currentTarget: ", evt.currentTarget);
		let uuid = evt.uuid;
		switch (uuid) {

			case "move":
				this.m_transCtr.toTranslation();
				break;

			case "scale":
				this.m_transCtr.toScale();
				break;

			case "rotate":
				this.m_transCtr.toRotation();
				this
				break;

			case "select":

				// this.m_selectFrame.enable();
				break;
			default:
				break;
		}

		this.selectBtn(evt.currentTarget as IButton);
	}

	private keyDown(evt: any): void {

		console.log("TransUI::keyDown() ..., evt.keyCode: ", evt.keyCode);

		let KEY = CoRScene.Keyboard;
		switch (evt.keyCode) {
			case KEY.W:
				this.selectBtn(this.m_transBtns[0]);
				this.m_transCtr.toTranslation();
				break;
			case KEY.E:
				this.selectBtn(this.m_transBtns[1]);
				this.m_transCtr.toScale();
				break;
			case KEY.R:
				this.selectBtn(this.m_transBtns[2]);
				this.m_transCtr.toRotation();
				break;
			default:
				break;
		}
	}
	private m_entityQuery: RectFrameQuery = null;

	selectEntities(list: IRenderEntity[]): void {

		if (list != null && list.length > 0) {
			let transCtr = this.m_transCtr;

			let pos = CoMath.createVec3();
			let pv = CoMath.createVec3();

			for (let i = 0; i < list.length; ++i) {
				pos.addBy(list[i].getPosition(pv));
			}
			pos.scaleBy(1.0 / list.length);

			if (transCtr != null) {
				transCtr.select(list as ITransformEntity[], pos);
				this.m_outline.select(list);
			}
		}
	}
	private mouseUpListener(evt: any): void {

		// console.log("TransUI::mouseUpListener() ...");
		if (this.m_transCtr != null) {
			this.m_transCtr.decontrol();
		}
	}
	private mouseClickListener(evt: any): void {

		if (this.m_transCtr != null) {
			this.m_transCtr.disable();
		}
		this.m_outline.deselect();
	}
	run(): void {
		
		if (this.m_transCtr != null) {
			this.m_transCtr.run();
		}
	}

}

export { TransUI };
