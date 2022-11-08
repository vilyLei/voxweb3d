import IDefault3DMaterial from "../../../vox/material/mcase/IDefault3DMaterial";
import IColor4 from "../../../vox/material/IColor4";
import { UIEntityBase } from "./UIEntityBase";
import { ICoUIScene } from "../../voxui/scene/ICoUIScene";
import IRenderTexture from "../../../vox/render/texture/IRenderTexture";

import { ICoRScene } from "../../voxengine/ICoRScene";
declare var CoRScene: ICoRScene;
import { ICoMesh } from "../../voxmesh/ICoMesh";
declare var CoMesh: ICoMesh;
import { ICoMaterial } from "../../voxmaterial/ICoMaterial";
declare var CoMaterial: ICoMaterial;
import { ICoEntity } from "../../voxentity/ICoEntity";
declare var CoEntity: ICoEntity;

class TextureLabel extends UIEntityBase {

	private m_pw = 10;
	private m_ph = 10;
	private m_sx = 1.0;
	private m_sy = 1.0;
	private m_material: IDefault3DMaterial = null;
	private m_uiScene: ICoUIScene;
	private m_color: IColor4;
	private m_tex: IRenderTexture = null;
	constructor() {
		super();
	}

	initialize(uiScene: ICoUIScene, tex: IRenderTexture): void {

		if (tex != null && this.isIniting()) {

			this.init();
			
			this.m_tex = tex;
			this.m_uiScene = uiScene;

			let entity = CoEntity.createDisplayEntity();

			this.m_color = CoMaterial.createColor4();
			
			this.m_tex.flipY = true;
			this.m_tex.premultiplyAlpha = true;
			this.m_tex.minFilter = CoRScene.TextureConst.LINEAR;
			this.m_tex.magFilter = CoRScene.TextureConst.NEAREST;

			let material = this.createMaterial(this.m_tex);
			this.m_material = material;
			CoMesh.plane.setBufSortFormat(material.getBufSortFormat());
			let mesh = CoMesh.plane.createXOY(0, 0, 1.0, 1.0);

			this.m_pw = tex.getWidth();
			this.m_ph = tex.getHeight();

			entity.setMaterial(material);
			entity.setMesh(mesh);
			this.m_entities.push(entity);
			this.applyRST(entity);
			super.setScaleXY(this.m_sx * this.m_pw, this.m_sy * this.m_ph);
			this.update();
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

	setColor(c: IColor4): TextureLabel {
		this.m_color.copyFrom(c);
		if (this.m_material != null) {
			this.m_material.setColor(c);
		}
		return this;
	}
	getColor(): IColor4 {
		return this.m_color;
	}
	destroy(): void {
		super.destroy();
		this.m_material = null;
		this.m_uiScene = null;
		this.m_tex = null;
	}
}
export { TextureLabel };
