import IRendererScene from "../../../../vox/scene/IRendererScene";
import { ICoUI } from "../../../voxui/ICoUI";
import { ICoUIScene } from "../../../voxui/scene/ICoUIScene";
import { ICoRScene } from "../../../voxengine/ICoRScene";
import { IButton } from "../../../voxui/button/IButton";
import { IColorLabel } from "../../../voxui/entity/IColorLabel";
import { ButtonBuilder } from "../../../voxui/button/ButtonBuilder";

declare var CoRScene: ICoRScene;
declare var CoUI: ICoUI;

/**
 * NVNavigationUI
 */
class NVNavigationUI {

	private m_rsc: IRendererScene = null;
	private m_editUIRenderer: IRendererScene = null;
	private m_uirsc: IRendererScene = null;
	private m_coUIScene: ICoUIScene = null;

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
		let uimodule = uiScene.uiConfig.getUIPanelCfgByName("navigation");
		console.log("NVNavigationUI::initNavigationUI(), uimodule: ", uimodule);

		let px = 0;
		let py = 0;

		let pw = uimodule.btnTextAreaSize[0];
		let ph = uimodule.btnTextAreaSize[1];

		let st = this.m_coUIScene.getStage();

		this.m_bgLabelW = st.stageWidth;
		this.m_bgLabelH = ph;
		let bgLabel = CoUI.createColorLabel();
		bgLabel.initialize(this.m_bgLabelW, this.m_bgLabelH);
		bgLabel.setY(st.stageHeight - ph);
		bgLabel.setColor(bgLabel.getColor().fromBytesArray3(uimodule.bgColor));
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

		
		btnNames = uimodule.btnNames;
		keys = uimodule.btnKeys;
		tips = uimodule.btnTips;

		let layouter = uiScene.layout.createLeftTopLayouter();
		px = 0;
		py = st.stageHeight - ph;
		for (let i = 0; i < btnNames.length; ++i) {
			const btn = ButtonBuilder.createPanelBtnWithCfg(uiScene, px + pw * i, py, i, uimodule);
			btn.addEventListener(CoRScene.MouseEvent.MOUSE_UP, this, this.btnMouseUpListener);
			this.m_coUIScene.addEntity(btn, 1);
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

	private btnMouseUpListener(evt: any): void {

		// console.log("btnMouseUpListener(), evt.currentTarget: ", evt.currentTarget);
		let uuid = evt.uuid;
		
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
