import IRendererScene from "../../../../vox/scene/IRendererScene";
import { ICoRenderer } from "../../../voxengine/ICoRenderer";
import { ICoUI } from "../../../voxui/ICoUI";
import { ICoUIScene } from "../../../voxui/scene/ICoUIScene";
import { ICoRScene } from "../../../voxengine/ICoRScene";
import { IButton } from "../../../voxui/button/IButton";
import { ICoMaterial } from "../../../voxmaterial/ICoMaterial";
import { IRectTextTip } from "../../../voxui/entity/IRectTextTip";
import { TipInfo } from "../../../voxui/base/TipInfo";
import { ColorLabel } from "../../../voxui/entity/ColorLabel";
import { IColorLabel } from "../../../voxui/entity/IColorLabel";
import { PromptPanel } from "../../../voxui/panel/PromptPanel";
import { IPromptPanel } from "../../../voxui/panel/IPromptPanel";
import { IUIFontFormat } from "../../../voxui/system/IUIConfig";
// import { LeftTopLayouter } from "../../../voxui/layout/LeftTopLayouter";

declare var CoRenderer: ICoRenderer;
declare var CoRScene: ICoRScene;
declare var CoMaterial: ICoMaterial;
declare var CoUI: ICoUI;

interface UICfgData {
	button?: object;
	fontFormat: IUIFontFormat;
	btnTextAreaSize: number[];
	btnSize: number[];
	names: string[];
	keys: string[];
	tips: string[];
}
/**
 * NVNavigationUI
 */
class NVNavigationUI {

	private m_rsc: IRendererScene = null;
	private m_editUIRenderer: IRendererScene = null;
	private m_uirsc: IRendererScene = null;
	private m_coUIScene: ICoUIScene = null;
	// tip: IRectTextTip = null;

	constructor() { }

	initialize(rsc: IRendererScene, editUIRenderer: IRendererScene, coUIScene: ICoUIScene): void {
		if (this.m_coUIScene == null) {
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
	private m_bgLabelH: number;
	private resize(evt: any): void {
		let st = this.m_coUIScene.getStage();
		this.m_bgLabel.setScaleX(st.stageWidth / this.m_bgLabelW);
		this.m_bgLabel.setY(st.stageHeight - this.m_bgLabelH);
		this.m_bgLabel.update();
	}
	private initNavigationUI(): void {

		let uiScene = this.m_coUIScene;
		let tta = uiScene.transparentTexAtlas;

		
		let cfg = uiScene.uiConfig;
		let uimodule = cfg.getUIModuleByName("navigation") as UICfgData;
		console.log("NVNavigationUI::initNavigationUI(), uimodule: ", uimodule);

		let px = 0;
		let py = 0;

		// let pw = 90;
		// let ph = 40;
		let pw = uimodule.btnTextAreaSize[0];
		let ph = uimodule.btnTextAreaSize[1];

		let st = this.m_coUIScene.getStage();

		this.m_bgLabelW = st.stageWidth;
		this.m_bgLabelH = ph;
		let bgLabel = CoUI.createColorLabel();
		bgLabel.initialize(this.m_bgLabelW, this.m_bgLabelH);
		bgLabel.setY(st.stageHeight - ph);
		let bgColorData = cfg.getUIGlobalColor().background;
		// bgLabel.setColor(bgLabel.getColor().setRGB3Bytes(40, 40, 40));
		bgLabel.setColor(bgLabel.getColor().fromBytesArray3(bgColorData));
		uiScene.addEntity(bgLabel);
		this.m_bgLabel = bgLabel;

		let EB = CoRScene.EventBase;
		uiScene.getStage().addEventListener(EB.RESIZE, this, this.resize);

		let keys = ["file", "edit", "model", "normal", "texture", "material", "light", "animation", "particle", "rendering", "physics", "help"];
		let btnNames = ["文件", "编辑", "模型", "法线", "纹理", "材质", "灯光", "动画", "粒子", "渲染", "物理", "帮助"];

		let tips = [
			"File system operations.",
			"Editing operations.",
			"Geometry model operations.",
			"Normal data operations.",
			"Texture data operations.",
			"Material system operations.",
			"Light system operations.",
			"Animation system operations.",
			"Paiticle system operations.",
			"Rendering system operations.",
			"Physics system operations.",
			"Help infomation.",
		];

		// keys = keys.slice(0, 2);
		// btnNames = btnNames.slice(0, 2);
		// tips = tips.slice(0, 2);
		// keys.push("help");
		// btnNames.push("帮助");
		// tips.push("Help infomation.");
		
		btnNames = uimodule.names;
		keys = uimodule.keys;
		tips = uimodule.tips;

		let layouter = uiScene.layout.createLeftTopLayouter();
		let fontColor = CoMaterial.createColor4();
		fontColor.fromBytesArray3(cfg.getUIGlobalColor().text);
		let bgColor = CoMaterial.createColor4(1, 1, 1, 0);
		let fontFormat = uimodule.fontFormat;
		tta.setFontName(fontFormat.font);
		for (let i = 0; i < btnNames.length; ++i) {
			let img = tta.createCharsCanvasFixSize(pw, ph, btnNames[i], fontFormat.fontSize, fontColor, bgColor);
			tta.addImageToAtlas(btnNames[i], img);
		}

		px = 0;
		py = st.stageHeight - ph;
		for (let i = 0; i < btnNames.length; ++i) {
			let btn = this.createBtn(pw, ph, px + pw * i, py, i, uimodule);
			this.m_coUIScene.tips.addTipsTarget(btn);
			this.m_navBtns.push(btn);
			layouter.addUIEntity(btn);
		}


		this.m_coUIScene.prompt.setPromptListener(
			(): void => {
				console.log("prompt panel confirm...");
			},
			(): void => {
				console.log("prompt panel cancel...");
			}
		);
	}

	private createBtn(pw: number, ph: number, px: number, py: number, labelIndex: number, cfgData: UICfgData): IButton {

		let names = cfgData.names;
		let keys = cfgData.keys;
		let tips = cfgData.tips;
		let label = CoUI.createClipColorLabel();
		label.initializeWithoutTex(pw, ph, 4);
		let cfg = this.m_coUIScene.uiConfig;
		let btnColor = cfg.getUIGlobalColor().button.common;
		cfg.applyButtonColor(label.getColors(), btnColor);

		let tta = this.m_coUIScene.transparentTexAtlas;
		let iconLable = CoUI.createClipLabel();
		iconLable.transparent = true;
		iconLable.premultiplyAlpha = true;
		iconLable.initialize(tta, [names[labelIndex]]);

		let btn = CoUI.createButton();
		btn.uuid = keys[labelIndex];
		btn.info = CoUI.createTipInfo().alignBottom().setContent(tips[labelIndex]);
		btn.addLabel(iconLable);
		btn.initializeWithLable(label);
		btn.setXY(px, py);
		this.m_coUIScene.addEntity(btn, 1);
		btn.addEventListener(CoRScene.MouseEvent.MOUSE_UP, this, this.btnMouseUpListener);

		return btn;
	}
	private btnMouseUpListener(evt: any): void {

		// console.log("btnMouseUpListener(), evt.currentTarget: ", evt.currentTarget);
		let uuid = evt.uuid;
		console.log("XXX CO btnMouseUpListener(), uuid: ", uuid);
		switch (uuid) {

			case "file":
			case "edit":
			case "model":
			case "normal":
			case "texture":
			case "material":
			case "light":
			case "animation":
			case "particle":
				this.m_coUIScene.prompt.showPrompt("It can't be used now!");
				break;
			case "help":
				this.toHelp();
				break;
			default:
				break;
		}
	}
	private toHelp(): void {
		let a = document.createElement('a');
		a.href = "https://blog.csdn.net/vily_lei/article/details/127544595?spm=1001.2014.3001.5501";
		a.target = "_blank";
		document.body.appendChild(a);
		(a as any).style = 'display: none';
		a.click();
		a.remove();
	}
	run(): void {

	}

}

export { NVNavigationUI };
