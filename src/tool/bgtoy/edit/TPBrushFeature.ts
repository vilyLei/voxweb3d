import { IRecordeDataUnit, IRecordeTarget, IRecordeNode } from "../../../voxeditor/data/RecordeNodeImpl";
import { RecordeNodeData, KeyBooleanValueNode, KeyNumberValueNode, KeyValueNode, IRecordeNodeTarget, RecordeNode } from "../edit/ToyBrushRecordeNode";
import { CommonDataRecorder } from "../../../voxeditor/data/CommonDataRecorder";
import { ProgressItemBuildParam, ValueItemBuildParam, StatusItemBuildParam, CtrlInfo, ParamCtrlUI } from "../../../orthoui/usage/ParamCtrlUI";
import IToTransparentPNG from "../../material/IToTransparentPNG";
import Color4 from "../../../vox/material/Color4";

class TPBrushFeature {
	protected m_dataChanged = false;
	name = "";
	minValue = 0;
	maxValue = 1.0;
	value = 0;
	color = new Color4();
	flag = false;
	material: IToTransparentPNG = null;
	ctrlui: ParamCtrlUI = null;

	mouseFlag = -1;

	// recorder: ToyBrushDataRecorder = null;
	recorder: CommonDataRecorder = null;
	materialSetFlag: (f: boolean) => void;
	// materialGetFlag: () => boolean;
	materialSetValue: (f: number) => void;
	// materialGetValue: () => number;
	constructor(){}
	createUIItemParam(): StatusItemBuildParam | ValueItemBuildParam {
		return null;
	}
	setMaterial(material: IToTransparentPNG): void {
		this.material = material;
	}
	setMouseFlag(flag: number): void {
		this.mouseFlag = flag;
	}
	setFlag(flag: boolean): void {
		this.flag = flag;
	}
	setValue(value: number): void {
		this.value = value;
	}
	setColor(c: Color4): void {
		this.color.copyFrom(c);
	}
	setRGB3f(r: number, g: number, b: number): void {
		this.color.setRGB3f(r, g, b);
	}
	setValues(value: number, minValue: number, maxValue: number): void {
		this.value = value;
		this.minValue = minValue;
		this.maxValue = maxValue;
	}
	useRecordeNodeData(data: KeyValueNode, imgUrl: string): void {

	}
	applyRecordeNodeData(data: IRecordeDataUnit): void {

	}
	reset(): void {

	}
}

class ValueBrushFeature extends TPBrushFeature {
	constructor() {
		super();
	}
	setMouseFlag(flag: number): void {
		super.setMouseFlag(flag);
		if(this.mouseFlag == 2) {
			if(this.m_dataChanged) {
				this.recorder.saveEnd([this.getRecordeNodeData()]);
				console.log("XXX ValueBrushFeature, recorder.saveEnd() ...");
				this.mouseFlag = -1;
				this.m_dataChanged = false;
			}
		}
	}
	setValue(value: number): void {
		if(this.mouseFlag == 1) {
			this.mouseFlag = -1;
			console.log("ValueBrushFeature::setValue(), recorder.saveBegin(), this.value: ", this.value);
			this.recorder.saveBegin([this.getRecordeNodeData()]);
			this.m_dataChanged = true;
		}
		this.value = value;
		if(this.materialSetValue) {
			this.materialSetValue(value);
		}
	}
	useRecordeNodeData(data: KeyValueNode, imgUrl: string): void {
		this.value = data.value as number;
		this.materialSetValue(this.value);
		console.log("ValueBrushFeature::useRecordeNodeData(), this.value: ", this.value);
		this.ctrlui.setUIItemValue(this.name, this.value, false);
	}
	getRecordeNodeData(): RecordeNodeData {
		console.log("ValueBrushFeature::getRecordeNodeData(), this.value: ", this.value);
		let data = new KeyNumberValueNode(this.name, this.value);
		let node = new RecordeNodeData(this, data);
		return node;
	}
}

class FlagBrushFeature extends TPBrushFeature {
	constructor() {
		super();
		this.flag = false;
	}
	setFlag(flag: boolean): void {
		console.log("FlagBrushFeature::setFlag(), recorder.saveBegin(), this.flag: ", this.flag);
		this.recorder.saveBegin([this.getRecordeNodeData()]);
		this.flag = flag;
		if (this.materialSetFlag) {
			this.materialSetFlag(flag);
		}
		this.recorder.saveEnd([this.getRecordeNodeData()]);
		console.log("ValueBrushFeature::setFlag(), recorder.saveEnd() ...");
	}
	useRecordeNodeData(data: KeyValueNode, imgUrl: string): void {

		this.flag = data.value as boolean;
		this.materialSetFlag(this.flag as boolean);
		console.log("FlagBrushFeature::FlagBrushFeature(), this.flag: ", this.flag);
		this.ctrlui.setUIItemFlag(this.name, this.flag, false);
	}
	getRecordeNodeData(): RecordeNodeData {
		let data = new KeyBooleanValueNode(this.name, this.flag);
		let node = new RecordeNodeData(this, data);
		return node;
	}
}
class ImgOperateMode extends FlagBrushFeature {
	constructor() {
		super();
		this.name = "img_operate_mode";
	}
	setMaterial(material: IToTransparentPNG): void {
		super.setMaterial(material);
		this.materialSetFlag = material.setShowInitImg.bind(material);
	}
	createUIItemParam(): StatusItemBuildParam | ValueItemBuildParam {
		return new StatusItemBuildParam("图像处理方式", this.name, "保持原图", "去除背景", this.flag);
	}
}
class InvertDiscard extends FlagBrushFeature {
	constructor() {
		super();
		this.name = "invert_discard";
	}
	setMaterial(material: IToTransparentPNG): void {
		super.setMaterial(material);
		this.materialSetFlag = material.setInvertDiscard.bind(material);
	}
	createUIItemParam(): StatusItemBuildParam | ValueItemBuildParam {
		return new StatusItemBuildParam("背景去除方式", this.name, "反相去除", "正常去除", this.flag);
	}
}

class InvertAlpha extends FlagBrushFeature {
	constructor() {
		super();
		this.name = "invert_alpha";
	}
	setMaterial(material: IToTransparentPNG): void {
		super.setMaterial(material);
		this.materialSetFlag = material.setInvertAlpha.bind(material);
	}
	createUIItemParam(): StatusItemBuildParam | ValueItemBuildParam {
		return new StatusItemBuildParam("输出透明度翻转", this.name, "是", "否", this.flag);
	}
}

class InvertRGB extends FlagBrushFeature {
	constructor() {
		super();
		this.name = "invert_rgb";
	}
	setMaterial(material: IToTransparentPNG): void {
		super.setMaterial(material);
		this.materialSetFlag = material.setInvertRGB.bind(material);
	}
	createUIItemParam(): StatusItemBuildParam | ValueItemBuildParam {
		return new StatusItemBuildParam("输出颜色值翻转", this.name, "是", "否", this.flag);
	}
}
//separate_alpha
class SeparateAlpha extends ValueBrushFeature {
	constructor() {
		super();
		this.name = "separate_alpha";
	}
	setMaterial(material: IToTransparentPNG): void {
		super.setMaterial(material);
		this.materialSetValue = material.setSeparateAlpha.bind(material);
	}
	createUIItemParam(): StatusItemBuildParam | ValueItemBuildParam {
		this.minValue = 1;
		this.maxValue = 15;
		this.value = 1;
		return new ValueItemBuildParam("透明度分离", this.name, this.value, this.minValue, this.maxValue);
	}
}

//init_alpha_factor
class InitAlphaFactor extends ValueBrushFeature {
	constructor() {
		super();
		this.name = "init_alpha_factor";
	}
	setMaterial(material: IToTransparentPNG): void {
		super.setMaterial(material);
		this.materialSetValue = material.setInitAlphaFactor.bind(material);
	}
	createUIItemParam(): StatusItemBuildParam | ValueItemBuildParam {
		this.minValue = 0;
		this.maxValue = 1;
		this.value = 1;
		return new ValueItemBuildParam("应用原始透明度", this.name, this.value, this.minValue, this.maxValue);
	}
}

//color_alpha_strength
class ColorAlphaStrength extends ValueBrushFeature {
	constructor() {
		super();
		this.name = "color_alpha_strength";
	}
	setMaterial(material: IToTransparentPNG): void {
		super.setMaterial(material);
		this.materialSetValue = material.setColorAlphaStrength.bind(material);
	}
	createUIItemParam(): StatusItemBuildParam | ValueItemBuildParam {
		this.minValue = 0;
		this.maxValue = 3;
		this.value = 1.0;
		return new ValueItemBuildParam("透明度强度", this.name, this.value, this.minValue, this.maxValue);
	}
}

//color_strength
class ColorStrength extends ValueBrushFeature {
	constructor() {
		super();
		this.name = "color_strength";
	}
	setMaterial(material: IToTransparentPNG): void {
		super.setMaterial(material);
		this.materialSetValue = material.setColorStrength.bind(material);
	}
	createUIItemParam(): StatusItemBuildParam | ValueItemBuildParam {
		this.minValue = 0;
		this.maxValue = 5;
		this.value = 1.0;
		return new ValueItemBuildParam("色彩强度", this.name, this.value, this.minValue, this.maxValue);
	}
}
// alpha_discard_factor
class AlphaDiscardFactor extends ValueBrushFeature {
	constructor() {
		super();
		this.name = "alpha_discard_factor";
	}
	setMaterial(material: IToTransparentPNG): void {
		super.setMaterial(material);
		this.materialSetValue = material.setAlphaDiscardFactor.bind(material);
	}
	createUIItemParam(): StatusItemBuildParam | ValueItemBuildParam {
		this.minValue = 0.0;
		this.maxValue = 0.98;
		this.value = 0.02;
		return new ValueItemBuildParam("背景去除比例", this.name, this.value, this.minValue, this.maxValue);
	}
}

//alpha_discard_threshold
class AlphaDiscardThreshold extends ValueBrushFeature {
	constructor() {
		super();
		this.name = "alpha_discard_threshold";
	}
	setMaterial(material: IToTransparentPNG): void {
		super.setMaterial(material);
		this.materialSetValue = material.setDiscardRadius.bind(material);
	}
	createUIItemParam(): StatusItemBuildParam | ValueItemBuildParam {
		this.minValue = 0.0;
		this.maxValue = 1.0;
		this.value = 0.5;
		return new ValueItemBuildParam("背景去除颜色阈值", "alpha_discard_threshold", this.value, this.minValue, this.maxValue);
	}
}


class DiscardDstRGB extends TPBrushFeature {
	constructor() {
		super();
		this.name = "discard_dst_rgb";
	}
	createUIItemParam(): StatusItemBuildParam | ValueItemBuildParam {
		return null
	}
	setRGB3f(r: number, g: number, b: number): void {
		this.color.setRGB3f(r, g, b);
		console.log("brush discard_dst_rgb, setRGB3f(), this.color: ", this.color);
		if (this.material) {
			this.material.setDiscardDstRGB(r, g, b);
		}
	}
	useRecordeNodeData(data: KeyValueNode, imgUrl: string): void {
		const c = this.color;
		this.material.setDiscardDstRGB(c.r, c.g, c.b);
		console.log("brush img_operate_mode, setShowInitImg(), color: ", c);
	}
	getRecordeNodeData(): RecordeNodeData {
		let data = new KeyBooleanValueNode(this.name, 0);
		let node = new RecordeNodeData(this, data);
		return node;
	}
}

export { ImgOperateMode,InvertDiscard,InvertAlpha,InvertRGB,SeparateAlpha,InitAlphaFactor,ColorAlphaStrength,ColorStrength,AlphaDiscardFactor,AlphaDiscardThreshold,  ValueBrushFeature, FlagBrushFeature,TPBrushFeature }
