import { ICoRendererScene } from "../../../../voxengine/scene/ICoRendererScene";
import { ICoRenderer } from "../../../../voxengine/ICoRenderer";
import { ICoMath } from "../../../../math/ICoMath";
import { ICoEdit } from "../../../../edit/ICoEdit";
import { ICoUI } from "../../../../voxui/ICoUI";
import { ICoUIScene } from "../../../../voxui/scene/ICoUIScene";
import { CoMaterialContextParam, ICoRScene } from "../../../../voxengine/ICoRScene";
import { ICoUIInteraction } from "../../../../voxengine/ui/ICoUIInteraction";
import IRendererScene from "../../../../../vox/scene/IRendererScene";
import { IButton } from "../../../../voxui/entity/IButton";

declare var CoRenderer: ICoRenderer;
declare var CoRScene: ICoRScene;
declare var CoUIInteraction: ICoUIInteraction;
declare var CoMath: ICoMath;
declare var CoEdit: ICoEdit;
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
		let texAtlas = uiScene.texAtlas;
		
		let pw = 90;
		let ph = 40;
		let keys = ["file", "edit", "model", "normal", "texture", "material", "animation", "particle"];
		let urls = ["文件", "编辑", "模型", "法线", "纹理", "材质", "动画", "粒子","帮助"];
		for (let i = 0; i < urls.length; ++i) {
			let img = texAtlas.createCharsCanvasFixSize(pw, ph, urls[i], 30);
			texAtlas.addImageToAtlas(urls[i], img);
		}
		
		let csLable = CoUI.createClipLabel();
		csLable.initialize(texAtlas, [urls[0], urls[1]]);
		console.log("XXXXXXXXXXXXXXXXXXXXXX initNavigationUI()...");
		let px = 0;
		let py = this.m_coUIScene.getStage().stageHeight - csLable.getClipHeight();
		pw = csLable.getClipWidth();
		for (let i = 0; i < urls.length; ++i) {
			let btn = this.crateBtn(urls, px + pw * i, py, i, keys[i]);
			if(i > 0) {
				this.m_navBtns.push(btn);
			}
		}
	}
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
