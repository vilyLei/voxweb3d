import IDefault3DMaterial from "../../../vox/material/mcase/IDefault3DMaterial";
import { IColorLabel } from "./IColorLabel";
import IVector3D from "../../../vox/math/IVector3D";
import IRawMesh from "../../../vox/mesh/IRawMesh";
import { ITextLabel } from "./ITextLabel";
import IColor4 from "../../../vox/material/IColor4";
import { UIEntityBase } from "./UIEntityBase";
import { ICoUIScene } from "../../voxui/scene/ICoUIScene";

import { ICoRScene } from "../../voxengine/ICoRScene";
declare var CoRScene: ICoRScene;
import { ICoMesh } from "../../voxmesh/ICoMesh";
declare var CoMesh: ICoMesh;
import { ICoMaterial } from "../../voxmaterial/ICoMaterial";
declare var CoMaterial: ICoMaterial;
import { ICoEntity } from "../../voxentity/ICoEntity";
import { IImageTexture } from "../../../vox/render/texture/IImageTexture";
declare var CoEntity: ICoEntity;

class TextLabel extends UIEntityBase implements ITextLabel {

	private m_pw = 10;
	private m_ph = 10;
	private m_sx = 1.0;
	private m_sy = 1.0;
	private m_rpi = 0;
	private m_material: IDefault3DMaterial = null;
	private m_uiScene: ICoUIScene;
	private m_fontColor: IColor4;
	private m_bgColor: IColor4;
	private m_tex: IImageTexture = null;
	private m_fontSize = 24;
	private m_text = "";
	constructor() { super(); }

	initialize(text: string, uiScene: ICoUIScene, rpi: number = 0, fontSize: number = 24): void {

		if (text != "" && this.isIniting()) {

			if (rpi < 0) rpi = 0;
			if (fontSize < 12) fontSize = 12;
			this.init();
			this.m_text = text;
			this.m_uiScene = uiScene;
			this.m_rpi = rpi;

			let entity = CoEntity.createDisplayEntity();

			this.m_fontColor = CoMaterial.createColor4();
			this.m_bgColor = CoMaterial.createColor4(1.0, 1.0, 1.0, 0.0);

			let img = this.m_uiScene.texAtlas.createCharsImage(this.m_text, this.m_fontSize, this.m_fontColor, this.m_bgColor);
			this.m_tex = uiScene.rscene.textureBlock.createImageTex2D(img.width, img.height);
			this.m_tex.setDataFromImage(img);

			this.m_tex.flipY = true;
			this.m_tex.premultiplyAlpha = true;
			this.m_tex.minFilter = CoRScene.TextureConst.LINEAR;
			this.m_tex.magFilter = CoRScene.TextureConst.NEAREST;

			let material = this.createMaterial(this.m_tex);
			material.setColor(this.m_fontColor);
			CoMesh.plane.setBufSortFormat(material.getBufSortFormat());
			let mesh = CoMesh.plane.createXOY(0, 0, 1.0, 1.0);
			this.m_pw = img.width;
			this.m_ph = img.height;
			entity.setMaterial(material);
			entity.setMesh(mesh);
			this.m_entities.push(entity);
			this.applyRST(entity);
			// super.setScaleXY(this.m_pw, this.m_ph);
			super.setScaleXY(this.m_sx * this.m_pw, this.m_sy * this.m_ph);
		}
	}


	setScaleXY(sx: number, sy: number): void {
		this.m_sx = sx;
		this.m_sy = sy;
		super.setScaleXY(sx * this.m_pw, sy * this.m_ph);
	}
	setScaleX(sx: number): void {
		this.m_sx = sx;
		super.setScaleX(sx * this.m_pw);
	}
	setScaleY(sy: number): void {
		this.m_sy = sy;
		super.setScaleX(sy * this.m_ph);
	}
	getScaleX(): number {
		return this.m_sx;
	}
	getScaleY(): number {
		return this.m_sy;
	}

	setText(text: string): void {
		if (this.m_tex != null && text != "" && this.m_text != text) {

			this.m_text = text;
			let img = this.m_uiScene.texAtlas.createCharsImage(text, this.m_fontSize, this.m_fontColor, this.m_bgColor);

			this.m_tex.setDataFromImage(img, 0, 0, 0, true);
			this.m_tex.updateDataToGpu();

			this.m_pw = img.width;
			this.m_ph = img.height;
			super.setScaleXY(this.m_sx * this.m_pw, this.m_sy * this.m_ph);
			
		}
	}
	getText(): string {
		return this.m_text;
	}
	setColor(c: IColor4): ITextLabel {
		this.m_fontColor.copyFrom(c);
		if (this.m_material != null) {
			this.m_material.setColor(c);
		}
		return this;
	}
	getColor(): IColor4 {
		return this.m_fontColor;
	}
	destroy(): void {
		super.destroy();
		this.m_material = null;
		this.m_uiScene = null;
		this.m_tex = null;
	}
}
export { TextLabel };
