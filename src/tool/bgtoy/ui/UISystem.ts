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

class UISystem {
	private m_rscene: IRendererScene = null;
	private m_graph: IRendererSceneGraph = null;
	private m_bgTex: IRenderTexture;

	uiBuilder: UIBuilder;
	ctrlui: ParamCtrlUI;
	readonly background = new Background2D();
	readonly imageSelector = new ImageColorSelector();
	readonly uiHTMLInfo = new UIHTMLInfo();
	readonly alphaOpUI = new AlphaOperationUI();
	processTotal = 3;
	constructor() {

		let aopui = this.alphaOpUI;
		this.uiBuilder = aopui.uiBuilder;
		this.background.uiBuilder = this.uiBuilder;
		aopui.background = this.background;
		aopui.imageSelector = this.imageSelector;
		aopui.uiHTMLInfo = this.uiHTMLInfo;
	}

	initialize(graph: IRendererSceneGraph, bgTex: IRenderTexture = null): void {
		if (this.m_graph == null && graph != null) {
			this.m_graph = graph;
			this.m_rscene = this.m_graph.getNodeAt(0).getRScene();
			this.m_bgTex = bgTex;
			this.init();
		}
	}
	private init(): void {

		let aopui = this.alphaOpUI;
		this.uiBuilder = aopui.uiBuilder;
		this.ctrlui = aopui.ctrlui;

		let bg = this.background;
		bg.initialize(this.m_graph, this.m_bgTex);

		aopui.buildFinishCall = (): void =>{
			this.updateLayout();
			this.m_initCall();
		}
		aopui.initialize( this.m_graph )
	}
	private m_initCall: () => void = null;
	setCurrMaterial(currMaterial: RemoveBlackBGMaterial2): void {
		// this.m_currMaterial = currMaterial;
		this.imageSelector.setCurrMaterial(currMaterial);

		this.alphaOpUI.setCurrMaterial(currMaterial);
	}
	setSavingListener(call: () => void): void {
		// this.m_savingCall = call;
		this.alphaOpUI.setSavingListener( call );
	}
	setOpeningListener(call: () => void): void {
		// this.m_openingCall = call;
		this.alphaOpUI.setOpeningListener( call );
	}
	setInitListener(call: () => void): void {
		this.m_initCall = call;
	}
	isInited(): boolean {
		return this.alphaOpUI.isInited();
		// return this.m_uiInited;
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

export { UISystem };
