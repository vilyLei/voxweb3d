import { RecordeNodeFactory } from "../edit/ToyBrushRecordeNode";
import { ToyBrushDataRecorder } from "../edit/ToyBrushDataRecorder";
import { CommonDataRecorder } from "../edit/CommonDataRecorder";
import { ParamCtrlUI } from "../../../orthoui/usage/ParamCtrlUI";
import IToTransparentPNG from "../../material/IToTransparentPNG";
import {
	ImgOperateMode,
	InvertDiscard,
	InvertAlpha,
	InvertRGB,
	SeparateAlpha,
	InitAlphaFactor,
	ColorAlphaStrength,
	ColorStrength,
	AlphaDiscardFactor,
	AlphaDiscardThreshold,
	TPBrushFeature
} from "./TPBrushFeature";

import IRendererScene from "../../../vox/scene/IRendererScene";
import MouseEvent from "../../../vox/event/MouseEvent";

class ToyTransparentBrush {
	private m_list: TPBrushFeature[];
	private m_ruisc: IRendererScene = null;

	// readonly brushRecorder = new ToyBrushDataRecorder();
	readonly brushRecorder = new CommonDataRecorder();

	readonly imgOperateMode = new ImgOperateMode();
	readonly invertDiscard = new InvertDiscard();
	readonly invertAlpha = new InvertAlpha();
	readonly invertRGB = new InvertRGB();
	readonly separateAlpha = new SeparateAlpha();
	readonly initAlphaFactor = new InitAlphaFactor();
	readonly colorAlphaStrength = new ColorAlphaStrength();
	readonly colorStrength = new ColorStrength();
	readonly alphaDiscardFactor = new AlphaDiscardFactor();
	readonly alphaDiscardThreshold = new AlphaDiscardThreshold();

	constructor() {
		this.m_list = [
			this.imgOperateMode,
			this.invertDiscard,
			this.invertAlpha,
			this.invertRGB,
			this.separateAlpha,
			this.initAlphaFactor,
			this.colorAlphaStrength,
			this.colorStrength,
			this.alphaDiscardFactor,
			this.alphaDiscardThreshold
		];
	}
	initialize(ruisc: IRendererScene): void {
		if (this.m_ruisc == null && ruisc != null) {
			ruisc.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);
			ruisc.addEventListener(MouseEvent.MOUSE_UP, this, this.mouseUp);

			this.brushRecorder.setNodeFactory(new RecordeNodeFactory());
			this.m_ruisc = ruisc;
		}
	}
	private mouseDown(evt: any): void {
		let ls = this.m_list;
		for (let i = 0; i < ls.length; ++i) {
			ls[i].setMouseFlag(1);
		}
	}
	private mouseUp(evt: any): void {
		let ls = this.m_list;
		for (let i = 0; i < ls.length; ++i) {
			ls[i].setMouseFlag(2);
		}
	}
	setCtrlParams(ctrlui: ParamCtrlUI, material: IToTransparentPNG): void {
		let ls = this.m_list;
		for (let i = 0; i < ls.length; ++i) {
			const t = ls[i];
			t.ctrlui = ctrlui;
			t.setMaterial(material);
			t.recorder = this.brushRecorder;
		}
	}
	resetAll(): void {}
	redo(): void {
		console.log("ToyTransparentBrush::redo() ...");
		this.brushRecorder.redo();
	}
	undo(): void {
		console.log("ToyTransparentBrush::undo() ...");
		this.brushRecorder.undo();
	}
}

export { ToyTransparentBrush };
