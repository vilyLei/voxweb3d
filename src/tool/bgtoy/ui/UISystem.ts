import AABB2D from "../../../vox/geom/AABB2D";
import IRendererScene from "../../../vox/scene/IRendererScene";
import IRendererSceneGraph from "../../../vox/scene/IRendererSceneGraph";

import RemoveBlackBGMaterial2 from "../../material/RemoveBlackBGMaterial2";
import { ProgressItemBuildParam, ValueItemBuildParam, StatusItemBuildParam, CtrlInfo, ParamCtrlUI } from "../../../orthoui/usage/ParamCtrlUI";

import { Background2D } from "./Background2D";
import Vector3D from "../../../vox/math/Vector3D";
import { UIBuilder } from "./UIBuilder";
import { UIHTMLInfo } from "./UIHTMLInfo";
import { ImageColorSelector } from "./ImageColorSelector";
import { AlphaOperationUI } from "./AlphaOperationUI";
import IAABB2D from "../../../vox/geom/IAABB2D";
import IRenderTexture from "../../../vox/render/texture/IRenderTexture";
import { KeyboardInteraction } from "../../../vox/ui/KeyboardInteraction";
import Keyboard from "../../../vox/ui/Keyboard";

class UISystem {
	private m_rscene: IRendererScene = null;
	private m_graph: IRendererSceneGraph = null;

	readonly keyInteraction = new KeyboardInteraction();
	readonly background = new Background2D();
	readonly imageSelector = new ImageColorSelector();
	readonly uiHTMLInfo = new UIHTMLInfo();
	readonly alphaOpUI = new AlphaOperationUI();

	uiBuilder: UIBuilder;
	ctrlui: ParamCtrlUI;
	processTotal = 3;
	constructor() {

		let aopui = this.alphaOpUI;
		this.uiBuilder = aopui.uiBuilder;
		this.background.uiBuilder = this.uiBuilder;
		aopui.background = this.background;
		aopui.imageSelector = this.imageSelector;
		aopui.uiHTMLInfo = this.uiHTMLInfo;
	}

	initialize(graph: IRendererSceneGraph): void {
		if (this.m_graph == null && graph != null) {
			this.m_graph = graph;
			this.m_rscene = this.m_graph.getNodeAt(0).getRScene();
			this.init();
		}
	}
	private init(): void {

		let aopui = this.alphaOpUI;
		this.uiBuilder = aopui.uiBuilder;
		this.ctrlui = aopui.ctrlui;

		let bg = this.background;
		bg.initialize(this.m_graph);

		aopui.buildFinishCall = (): void =>{
			this.updateLayout();
			this.m_initCall();
		}
		aopui.initialize( this.m_graph );

		let platform = navigator.platform as any;
		window.addEventListener("keydown", (e: any): void => {
			if (e.keyCode == 83 && (navigator.platform && navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
				this.saveImage();
				e.preventDefault();
			}
		}, false);

		const keyIt = this.keyInteraction;
		keyIt.initialize(this.m_rscene);

		let Key = Keyboard;
		let type = keyIt.createKeysEventType([Key.CTRL, Key.Y]);
		keyIt.addKeysDownListener(type, this, this.keyCtrlYDown);
		type = keyIt.createKeysEventType([Key.CTRL, Key.Z]);
		keyIt.addKeysDownListener(type, this, this.keyCtrlZDown);
	}
	private saveImage(): void {
		this.alphaOpUI.saveImage();
	}
	private keyCtrlYDown(evt: any): void {
		this.alphaOpUI.transparentBrush.redo();
	}
	private keyCtrlZDown(evt: any): void {
		this.alphaOpUI.transparentBrush.undo();
	}
	private m_initCall: () => void = null;
	setCurrMaterial(currMaterial: RemoveBlackBGMaterial2): void {
		this.imageSelector.setCurrMaterial(currMaterial);

		this.alphaOpUI.setCurrMaterial(currMaterial);
	}
	setSavingListener(call: () => void): void {
		this.alphaOpUI.setSavingListener( call );
	}
	setOpeningListener(call: () => void): void {
		this.alphaOpUI.setOpeningListener( call );
	}
	setInitListener(call: () => void): void {
		this.m_initCall = call;
	}
	isInited(): boolean {
		return this.alphaOpUI.isInited();
	}
	hideSpecBtns(): void {
		this.uiBuilder.hideSpecBtns();
		this.uiHTMLInfo.hideSpecInfos();
	}
	private m_areaRect: IAABB2D = null;
	private m_uiRect = new AABB2D();
	updateLayout(rect: IAABB2D = null): void {
		if (rect) {
			this.m_areaRect = rect;
		} else {
			rect = this.m_areaRect;
		}
		if(rect) {
			if (this.isInited()) {

				this.alphaOpUI.updateLayout(rect);

				this.m_uiRect.copyFrom(rect);

				this.m_uiRect.union(this.alphaOpUI.ctrlui.bounds);
				this.uiHTMLInfo.updateLayout(rect);
				this.imageSelector.updateLayout(this.m_uiRect);
			}
			this.background.updateLayout(rect);
		}
	}
}

export { UISystem };
