import ITransformEntity from "../../../vox/entity/ITransformEntity";
import IDisplayEntityContainer from "../../../vox/entity/IDisplayEntityContainer";
import { IColorClipLabel } from "./IColorClipLabel";
import IVector3D from "../../../vox/math/IVector3D";
import IColor4 from "../../../vox/material/IColor4";
import { IClipLabel } from "./IClipLabel";
import { IUIEntity } from "./IUIEntity";
import { UIEntityBase } from "./UIEntityBase";

import { ICoMaterial } from "../../voxmaterial/ICoMaterial";
declare var CoMaterial: ICoMaterial;

class ColorClipLabel extends UIEntityBase implements IColorClipLabel {

	private m_index = 0;
	private m_total = 0;

	private m_colors: IColor4[] = null;
	private m_hasTex: boolean = true;
	private m_lb: IClipLabel = null;
	private m_ilb: IClipLabel = null;
	uuid = "colorClipLabel";
	
	constructor() { super(); }

	hasTexture(): boolean {
		return this.m_hasTex;
	}
	setIconLabel(label: IClipLabel): void {
		this.m_ilb = label;
	}
	getIconLabel(): IClipLabel {
		return this.m_ilb;
	}
	initialize(label: IClipLabel, colorsTotal: number): void {

		if (this.isIniting() && colorsTotal > 0) {
			
			this.init();
			this.m_lb = label;
			let colors = new Array(colorsTotal);
			for (let i = 0; i < colorsTotal; ++i) {
				colors[i] = CoMaterial.createColor4();
			}
			this.m_colors = colors;
			this.m_total = colorsTotal;
			this.setClipIndex(0);
		}
	}
	getColorAt(i: number): IColor4 {
		if (i >= 0 && i < this.m_total) {
			return this.m_colors[i];
		}
	}
	setColorAt(i: number, color4: IColor4): void {
		if (i >= 0 && i < this.m_total && color4 != null) {
			this.m_colors[i].copyFrom(color4);
		}
	}
	setClipIndex(i: number): void {
		if (i >= 0 && i < this.m_total) {
			this.m_index = i;
			this.m_lb.setColor(this.m_colors[i]);
		}
	}
	setCircleClipIndex(i: number): void {
		i %= this.m_total;
		i += this.m_total;
		i %= this.m_total;
		this.setClipIndex(i);
	}
	getClipIndex(): number {
		return this.m_index;
	}
	getClipsTotal(): number {
		return this.m_total;
	}

	setLabelClipIndex(i: number): void {
		this.m_lb.setClipIndex(i);
	}
	getLabelClipIndex(): number {
		return this.m_lb.getClipIndex();
	}
	setLabelCircleClipIndex(i: number): void {
		this.m_lb.setCircleClipIndex(i);
	}
	getLabelClipsTotal(): number {
		return this.m_lb.getClipsTotal();
	}

	getColors(): IColor4[] {
		return this.m_colors;
	}

	getClipWidth(): number {
		return this.m_lb.getClipHeight();
	}
	getClipHeight(): number {
		return this.m_lb.getClipWidth();
	}
	copyTransformFrom(src: IUIEntity): void {
		if (src != null) {
			let sx = src.getScaleX();
			let sy = src.getScaleY();
			let r = src.getRotation();
			this.setScaleXY(sx, sy);
			this.setRotation(r);
			src.getPosition(this.m_v0);
			this.setPosition(this.m_v0);
		}
	}
	/**
	 * get renderable entities for renderer scene
	 * @returns ITransformEntity instance list
	 */
	getREntities(): ITransformEntity[] {
		if (this.m_ilb != null) {
			let ls = this.m_lb.getREntities();
			return ls.concat(this.m_ilb.getREntities());
		}
		return this.m_lb.getREntities();
	}
	getRContainer(): IDisplayEntityContainer {
		return null;
	}
	update(): void {
		this.m_bounds.reset();
		let sv = this.m_scaleV;
		let b = this.m_lb;
		b.setRotation(this.m_rotation);
		b.setScaleXY(sv.x, sv.y);
		b.setPosition(this.m_pos);
		b.update();
		this.m_bounds.union(b.getGlobalBounds());
		b = this.m_ilb;
		if (b != null) {
			b.copyTransformFrom(this.m_lb);
			b.update();
			this.m_bounds.union(b.getGlobalBounds());
		}
		this.m_bounds.updateFast();
	}
	destroy(): void {
		
		this.m_colors = null;
		this.m_total = 0;

		let b = this.m_lb;
		if (b != null) {
			b.destroy();
			b = null;
		}
		b = this.m_ilb;
		if (b != null) {
			b.destroy();
			b = null;
		}
		super.destroy();
	}
}
export { ColorClipLabel };
