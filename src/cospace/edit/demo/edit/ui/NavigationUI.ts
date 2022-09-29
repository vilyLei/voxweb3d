import { ICoRendererScene } from "../../../../voxengine/scene/ICoRendererScene";
import { ICoRenderer } from "../../../../voxengine/ICoRenderer";
import { ICoUI } from "../../../../voxui/ICoUI";
import { ICoUIScene } from "../../../../voxui/scene/ICoUIScene";
import { ICoRScene } from "../../../../voxengine/ICoRScene";
import IRendererScene from "../../../../../vox/scene/IRendererScene";
import { IButton } from "../../../../voxui/entity/IButton";
import { ICoMaterial } from "../../../../voxmaterial/ICoMaterial";
import { IRectTextTip } from "../../../../voxui/entity/IRectTextTip";
import { TipInfo } from "../../../../voxui/base/TipInfo";
import { ColorLabel } from "../../../../voxui/entity/ColorLabel";
import { IColorLabel } from "../../../../voxui/entity/IColorLabel";
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
	tip: IRectTextTip = null;

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
	private m_bgLabel: IColorLabel = null;
	private m_bgLabelW: number;
	private resize(evt: any): void {
		let st = this.m_coUIScene.getStage();
		this.m_bgLabel.setScaleX( st.stageWidth/this.m_bgLabelW );
		this.m_bgLabel.update();
	}
	private initNavigationUI(): void {

		let uiScene = this.m_coUIScene;
		let tta = uiScene.transparentTexAtlas;
		
		let px = 0;
		let py = 0;

		let pw = 90;
		let ph = 40;

		let st = this.m_coUIScene.getStage();

		this.m_bgLabelW = st.stageWidth;
		let bgLabel = CoUI.createColorLabel();
		bgLabel.initialize(st.stageWidth, ph);
		bgLabel.setY(st.stageHeight - ph);
		bgLabel.setColor(bgLabel.getColor().setRGB3Bytes(40,40,40));
		// bgLabel.setZ(-0.01);
		uiScene.addEntity(bgLabel);
		this.m_bgLabel = bgLabel;

		let EB = CoRScene.EventBase;
		uiScene.getStage().addEventListener(EB.RESIZE, this, this.resize);

		let keys = ["file", "edit", "model", "normal", "texture", "material", "light", "animation", "particle", "help"];
		let urls = ["文件", "编辑", "模型", "法线", "纹理", "材质", "灯光", "动画", "粒子" ,"帮助"];
		let infos = [
			"File system operations.",
			"Editing operations.",
			"Geometry model operations.",
			"Normal data operations.",
			"Texture data operations.",
			"Material system operations.",
			"Light system operations.",
			"Animation system operations.",
			"Paiticle system operations.",
			"Help infomation.",
		];

		let layouter = uiScene.layout.createLeftTopLayouter();
		let fontColor = CoMaterial.createColor4().setRGB3Bytes(170,170,170);
		let bgColor = CoMaterial.createColor4(1, 1, 1, 0);
		
		for (let i = 0; i < urls.length; ++i) {
			let img = tta.createCharsCanvasFixSize(pw, ph, urls[i], 30, fontColor, bgColor);
			tta.addImageToAtlas(urls[i], img);
		}

		px = 0;
		py = st.stageHeight - ph;
		for (let i = 0; i < urls.length; ++i) {
			let btn = this.crateBtn(urls, pw, ph, px + pw * i, py, i, keys[i], infos[i]);
			this.tip.addEntity(btn)
			this.m_navBtns.push(btn);
			layouter.addUIEntity(btn);
		}

	}
	
	private crateBtn(urls: string[], pw: number, ph: number, px: number, py: number, labelIndex: number, idns: string, info: string): IButton {

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
		btn.info = CoUI.createTipInfo().alignBottom().setContent(info);
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
