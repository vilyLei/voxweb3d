import { UIEntityContainer } from "../entity/UIEntityContainer";
import { ICoMaterial } from "../../voxmaterial/ICoMaterial";

import { ICoRScene } from "../../voxengine/ICoRScene";

import { ColorLabel } from "../entity/ColorLabel";
import IColor4 from "../../../vox/material/IColor4";
import ITransformEntity from "../../../vox/entity/ITransformEntity";
import { IUIPanel } from "../panel/IUIPanel";
import { ICoUIScene } from "../scene/ICoUIScene";

declare var CoRScene: ICoRScene;
declare var CoMaterial: ICoMaterial;
class UIPanel extends UIEntityContainer implements IUIPanel {

	protected m_scene: ICoUIScene;
	protected m_rpi: number;
	protected m_bgColor: IColor4;
	protected m_bgLabel: ColorLabel;

	protected m_panelW: number = 100;
	protected m_panelH: number = 150;

	protected m_isOpen = false;
	autoLayout = true;
	constructor() { super(); }

	setSize(pw: number, ph: number): void {
		this.m_panelW = pw;
		this.m_panelH = ph;
	}
	setBGColor(c: IColor4): IUIPanel {

		if (this.m_bgColor == null) this.m_bgColor = CoMaterial.createColor4();
		this.m_bgColor.copyFrom(c);
		if (this.m_bgLabel != null) {
			this.m_bgLabel.setColor(c);
		}
		return this;
	}
	// initialize(scene: ICoUIScene, rpi: number, panelW: number, panelH: number): void {
	// 	if (this.isIniting()) {
	// 		this.init();

	// 		this.m_scene = scene;
	// 		this.m_rpi = rpi;

	// 		this.m_panelW = panelW;
	// 		this.m_panelH = panelH;

	// 		this.m_bgColor = CoMaterial.createColor4();
	// 	}
	// }
	protected init(): void {

		if (this.isIniting()) {

			if (this.m_bgColor == null) this.m_bgColor = CoMaterial.createColor4();
			super.init();
		}
	}
	setUIscene(scene: ICoUIScene, rpi: number = -1): void {
		if (this.m_scene == null && scene != null) {
			this.m_scene = scene;
			if(rpi >= 0) this.m_rpi = rpi;
			this.init();
		}
	}
	protected openThis(): void {
	}
	protected closeThis(): void {		
	}
	protected m_openListener: ()=>void = null;
	protected m_closeListener: ()=>void = null;
	setOpenAndLoseListener(openListener: ()=>void, closeListener: ()=>void): void {
		this.m_openListener = openListener;
		this.m_closeListener = closeListener;
	}
	open(uiscene: ICoUIScene = null, rpi: number = -1): void {

		if (!this.m_isOpen) {
			if (this.isIniting()) {
				this.init();
			}
			if (uiscene != null) this.m_scene = uiscene;
			if(rpi >= 0) this.m_rpi = rpi;

			this.m_scene.addEntity(this, this.m_rpi);
			if (this.autoLayout) {
				this.addLayoutEvt();
				this.layout();
			}

			this.m_isOpen = true;
			this.setVisible(true);

			this.openThis();
			if(this.m_openListener != null) {
				this.m_openListener();
			}
		}
	}
	isOpen(): boolean {
		return this.m_isOpen;
	}
	close(): void {

		if (this.m_isOpen) {

			this.m_scene.removeEntity(this);

			this.m_isOpen = false;
			this.setVisible(false);
			this.removeLayoutEvt();

			this.closeThis();
			if(this.m_closeListener != null) {
				this.m_closeListener();
			}
		}
	}
	destroy(): void {

		super.destroy();
		this.m_panelBuilding = true;
		if (this.m_bgLabel != null) {

			this.m_bgLabel.destroy();
			this.m_bgLabel = null;
		}
		this.m_openListener = null;
		this.m_closeListener = null;
	}
	private m_panelBuilding = true;
	protected buildPanel(pw: number, ph: number): void {

	}
	protected updateScene(): void {
		let sc = this.getScene();
		if (sc != null && this.m_panelBuilding && this.m_bgLabel == null) {

			this.m_panelBuilding = false;

			let pw = this.m_panelW;
			let ph = this.m_panelH;
			let bgLabel = this.createBG(pw, ph);
			this.buildPanel(pw, ph);			
			this.addEntity(bgLabel);
			this.setVisible(this.m_isOpen);
			if (this.m_isOpen) {
				this.addLayoutEvt();
				this.layout();
			}
		}
	}
	protected addLayoutEvt(): void {
		if (this.autoLayout) {
			let sc = this.getScene();
			if (sc != null) {
				let EB = CoRScene.EventBase;
				sc.addEventListener(EB.RESIZE, this, this.resize);
			}
		}
	}
	protected removeLayoutEvt(): void {
		if (this.autoLayout) {
			let sc = this.getScene();
			if (sc != null) {
				let EB = CoRScene.EventBase;
				sc.removeEventListener(EB.RESIZE, this, this.resize);
			}
		}
	}
	protected createBG(pw: number, ph: number): ColorLabel {
		let bgLabel = new ColorLabel();
		bgLabel.depthTest = true;
		bgLabel.initialize(pw, ph);
		bgLabel.setZ(-0.1);
		bgLabel.setColor(this.m_bgColor);
		this.m_bgLabel = bgLabel;
		this.initializeEvent(bgLabel.getREntities()[0]);
		return bgLabel;
	}

	protected initializeEvent(entity: ITransformEntity, uuid: string = "uiPlane"): void {

		const me = CoRScene.MouseEvent;
		let dpc = CoRScene.createMouseEvt3DDispatcher();
		dpc.currentTarget = this;
		dpc.uuid = uuid;
		dpc.addEventListener(me.MOUSE_OVER, this, this.mouseOverListener);
		dpc.addEventListener(me.MOUSE_OUT, this, this.mouseOutListener);
		entity.setEvtDispatcher(dpc);
		entity.mouseEnabled = true;
	}
	protected mouseOverListener(evt: any): void {
		// console.log("mouseOverListener() ...");
	}
	protected mouseOutListener(evt: any): void {
		// console.log("mouseOutListener() ...");
	}
	private resize(evt: any): void {
		this.layout();
	}
	protected layout(): void {
		let sc = this.getScene();
		if (sc != null) {
			let rect = sc.getRect();
			let px = rect.x + (rect.width - this.getWidth()) * 0.5;
			let py = rect.y + (rect.height - this.getHeight()) * 0.5;
			this.setXY(px, py);
			this.update();
		}
	}
}
export { UIPanel };
