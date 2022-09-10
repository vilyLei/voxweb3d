import ITransformEntity from "../../../vox/entity/ITransformEntity";
import { IColorClipLabel } from "./IColorClipLabel";
import IVector3D from "../../../vox/math/IVector3D";
import IColor4 from "../../../vox/material/IColor4";
import { IClipLabel } from "./IClipLabel";

import { ICoMaterial } from "../../voxmaterial/ICoMaterial";
declare var CoMaterial: ICoMaterial;

class ColorClipLabel implements IColorClipLabel {
	private m_colors: IColor4[] = null;
	private m_index = 0;
	private m_total = 0;
	private m_hasTex: boolean = true;
	private m_label: IClipLabel = null;

	hasTexture(): boolean {
		return this.m_hasTex;
	}
	initialize(label: IClipLabel, colorsTotal: number): void {

		if (this.m_label == null && colorsTotal > 0) {
			this.m_label = label;
			// this.m_hasTex = false;
			// let material = CoMaterial.createDefaultMaterial();
			// if(idns != "" && atlas != null) {
			// 	let obj = atlas.getTexObjFromAtlas(idns);
			// 	if(this.m_fixSize) {
			// 		this.m_width = obj.getWidth();
			// 		this.m_height = obj.getHeight();
			// 	}
			// 	this.m_hasTex = true;
			// 	material.setTextureList([obj.texture]);
			// }
			// let mesh = this.createMesh(atlas, idns);
			// let et = (this.m_entity = CoEntity.createDisplayEntity());
			// et.setMaterial(material);
			// et.setMesh(mesh);
			// this.m_material = material;
			// this.m_pos = CoMath.createVec3();

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
			this.m_label.setColor(this.m_colors[i]);
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

	getColors(): IColor4[] {
		return this.m_colors;
	}

	getClipWidth(): number {
		return this.m_label.getClipHeight();
	}
	getClipHeight(): number {
		return this.m_label.getClipWidth();
	}
	getWidth(): number {
		return this.m_label.getWidth();
	}
	getHeight(): number {
		return this.m_label.getHeight();
	}
	setX(x: number): void {
		this.m_label.setX( x );
	}
	setY(y: number): void {
		this.m_label.setX( y );
	}
	setZ(z: number): void {
		this.m_label.setZ( z );
	}
	getX(): number {
		return this.m_label.getX();
	}
	getY(): number {
		return this.m_label.getY();
	}
	getZ(): number {
		return this.m_label.getZ();
	}
	setXY(px: number, py: number): void {
		return this.m_label.setXY(px, py);
	}
	setPosition(pv: IVector3D): void {
		return this.m_label.setPosition(pv);
	}
	getPosition(pv: IVector3D): void {
		this.m_label.getPosition(pv);
	}
	setRotation(r: number): void {
		this.m_label.setRotation(r);
	}
	getRotation(): number {
		return this.m_label.getRotation();
	}
	setScaleXY(sx: number, sy: number): void {
		this.m_label.setScaleXY(sx, sy);
	}
	setScaleX(sx: number): void {
		this.m_label.setScaleX(sx);
	}
	setScaleY(sy: number): void {
		this.m_label.setScaleY(sy);
	}
	getScaleX(): number {
		return this.m_label.getScaleX();
	}
	getScaleY(): number {
		return this.m_label.getScaleY();
	}
	/**
	 * get renderable entity for renderer scene
	 * @returns ITransformEntity instance
	 */
	getREntity(): ITransformEntity {
		return this.m_label.getREntity();
	}
	update(): void {
		this.m_label.update();
	}
	destroy(): void {
		this.m_colors = null;
		this.m_total = 0;
		if (this.m_label != null) {
			this.m_label.destroy();
			this.m_label = null;
		}
	}
}
export { ColorClipLabel };
