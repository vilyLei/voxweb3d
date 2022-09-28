import { ICoRendererScene } from "../../../../voxengine/scene/ICoRendererScene";
import { ICoRenderer } from "../../../../voxengine/ICoRenderer";
import { ICoUI } from "../../../../voxui/ICoUI";
import { ICoUIScene } from "../../../../voxui/scene/ICoUIScene";
import { ICoRScene } from "../../../../voxengine/ICoRScene";
import IRendererScene from "../../../../../vox/scene/IRendererScene";
import { IButton } from "../../../../voxui/entity/IButton";
import { ICoMaterial } from "../../../../voxmaterial/ICoMaterial";
// import { LeftTopLayouter } from "../../../../voxui/layout/LeftTopLayouter";

declare var CoRenderer: ICoRenderer;
declare var CoRScene: ICoRScene;
declare var CoMaterial: ICoMaterial;
declare var CoUI: ICoUI;

/**
 * NavigationUI
 */
class NavigationUI {

	private m_rsc: ICoRendererScene = null;
	private m_editUIRenderer: ICoRendererScene = null;
	private m_uirsc: IRendererScene = null;
	private m_coUIScene: ICoUIScene = null;

	constructor() { }

	initialize(rsc: ICoRendererScene, editUIRenderer: ICoRendererScene, coUIScene: ICoUIScene): void {
		if(this.m_coUIScene == null) {
			this.m_rsc = rsc;
			this.m_editUIRenderer = editUIRenderer;
			this.m_coUIScene = coUIScene;

			this.init();
		}
	}
	private init(): void {
		
		let editsc = this.m_editUIRenderer;

		this.initUI();
	}
	private m_navBtns: IButton[] = [];
	private initUI(): void {

		this.m_uirsc = this.m_coUIScene.rscene;

		this.initNavigationUI();
	}
	private initNavigationUI(): void {

		let uiScene = this.m_coUIScene;
		let tta = uiScene.transparentTexAtlas;
		
		let pw = 90;
		let ph = 40;
		let keys = ["file", "edit", "model", "normal", "texture", "material", "light", "animation", "particle"];
		let urls = ["文件", "编辑", "模型", "法线", "纹理", "材质", "灯光", "动画", "粒子" ,"帮助"];

		let layouter = uiScene.layout.createLeftTopLayouter();
		let fontColor = CoMaterial.createColor4().setRGB3Bytes(170,170,170);
		let bgColor = CoMaterial.createColor4(1, 1, 1, 0);
		
		for (let i = 0; i < urls.length; ++i) {
			let img = tta.createCharsCanvasFixSize(pw, ph, urls[i], 30, fontColor, bgColor);
			tta.addImageToAtlas(urls[i], img);
		}
		let px = 0;
		let py = this.m_coUIScene.getStage().stageHeight - ph;
		for (let i = 0; i < urls.length; ++i) {
			let btn = this.crateBtn(urls, pw, ph, px + pw * i, py, i, keys[i]);
			this.m_navBtns.push(btn);
			layouter.addUIEntity(btn);
		}

	}
	
	private crateBtn(urls: string[], pw: number, ph: number, px: number, py: number, labelIndex: number, idns: string): IButton {

		let colorClipLabel = CoUI.createClipColorLabel();
		colorClipLabel.initializeWithoutTex(pw, ph, 4);
		colorClipLabel.getColorAt(0).setRGB3Bytes(40, 40, 40);
		colorClipLabel.getColorAt(1).setRGB3Bytes(50, 50, 50);
		colorClipLabel.getColorAt(2).setRGB3Bytes(40, 40, 60);

		let tta = this.m_coUIScene.transparentTexAtlas;
		let iconLable = CoUI.createClipLabel();
		iconLable.transparent = true;
		iconLable.premultiplyAlpha = true;
		iconLable.initialize(tta, [urls[labelIndex]]);

		let btn = CoUI.createButton();
		btn.uuid = idns;
		btn.addLabel(iconLable);
		btn.initializeWithLable(colorClipLabel);
		btn.setXY(px, py);
		this.m_coUIScene.addEntity(btn, 1);
		btn.addEventListener(CoRScene.MouseEvent.MOUSE_UP, this, this.btnMouseUpListener);

		return btn;
	}
	private btnMouseUpListener(evt: any): void {

		console.log("btnMouseUpListener(), evt.currentTarget: ", evt.currentTarget);
		let uuid = evt.uuid;
		switch (uuid) {

			case "file":
				break;
			default:
				break;
		}
	}
	run(): void {
		
	}

}

export { NavigationUI };
