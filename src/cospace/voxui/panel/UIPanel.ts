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

	protected m_panelW: number = 17;
	protected m_panelH: number = 130;

	protected m_isOpen = false;

	constructor() { super(); }

	setBGColor(c: IColor4): IUIPanel {
		// if(this.m_bgColor != null) {
		this.m_bgColor.copyFrom(c);
		if (this.m_bgLabel != null) {
			this.m_bgLabel.setColor(c);
		}
		// }
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
	setUIscene(scene: ICoUIScene): void {
		if(this.m_scene == null) {
			this.m_scene = scene;
		}
	}
	open(scene: ICoUIScene = null): void {

		if (!this.m_isOpen) {

			if(scene != null) this.m_scene = scene;
			this.m_scene.addEntity(this, this.m_rpi);
			this.addLayoutEvt();
			this.layout();

			this.m_isOpen = true;
			this.setVisible(true);
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
		}
	}
	destroy(): void {

		super.destroy();

		if (this.m_bgLabel != null) {

			this.m_bgLabel.destroy();
			this.m_bgLabel = null;
		}
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
			this.buildPanel(pw, ph);
			this.createBG(pw, ph);
			this.setVisible(this.m_isOpen);
			if (this.m_isOpen) {
				this.addLayoutEvt();
				this.layout();
			}
		}
	}
	protected addLayoutEvt(): void {
		let sc = this.getScene();
		if (sc != null) {
			let st = sc.getStage();
			let EB = CoRScene.EventBase;
			st.addEventListener(EB.RESIZE, this, this.resize);
		}
	}
	protected removeLayoutEvt(): void {
		let sc = this.getScene();
		if (sc != null) {
			let st = sc.getStage();
			let EB = CoRScene.EventBase;
			st.removeEventListener(EB.RESIZE, this, this.resize);
		}
	}
	protected createBG(pw: number, ph: number): void {
		let sc = this.getScene();
		let bgLabel = new ColorLabel();
		bgLabel.depthTest = true;
		bgLabel.initialize(pw, ph);
		bgLabel.setZ(-0.1);
		bgLabel.setColor(this.m_bgColor);
		this.m_bgLabel = bgLabel;
		this.initializeEvent(bgLabel.getREntities()[0]);
		this.addEntity(bgLabel);
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
			// let st = sc.getStage();
			let rect = sc.getRect();
			// let bounds = this.getGlobalBounds();

			let px = rect.x + (rect.width - this.getWidth()) * 0.5;
			let py = rect.y + (rect.height - this.getHeight()) * 0.5;
			this.setXY(px, py);
			this.update();
		}
	}
}
export { UIPanel };
