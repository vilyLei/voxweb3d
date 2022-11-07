import IAABB from "../../../vox/geom/IAABB";
import IVector3D from "../../../vox/math/IVector3D";
import IRenderEntity from "../../../vox/render/IRenderEntity";
import IRendererScene from "../../../vox/scene/IRendererScene";
import { UIEntityBase } from "./UIEntityBase";

import { ICoMesh } from "../../voxmesh/ICoMesh";
import { ICoEntity } from "../../voxentity/ICoEntity";
import { ICoMaterial } from "../../voxmaterial/ICoMaterial";
import { ICoMath } from "../../math/ICoMath";
import ITransformEntity from "../../../vox/entity/ITransformEntity";
import ICanvasTexAtlas from "../../voxtexture/atlas/ICanvasTexAtlas";
import { IImageTexture } from "../../../vox/render/texture/IImageTexture";
import { ICoUIScene } from "../../voxui/scene/ICoUIScene";
import IColor4 from "../../../vox/material/IColor4";
import { ICoRScene } from "../../voxengine/ICoRScene";
import { IUIEntity } from "./IUIEntity";
import { IMouseEvtUIEntity } from "./IMouseEvtUIEntity";
import { IRectTextTip } from "./IRectTextTip";

declare var CoRScene: ICoRScene;
declare var CoMesh: ICoMesh;
declare var CoMaterial: ICoMaterial;
declare var CoEntity: ICoEntity;
declare var CoMath: ICoMath;

class RectTextTip extends UIEntityBase implements IRectTextTip {

	private m_pw = 10;
	private m_ph = 10;
	private m_rpi = 0;
	private m_uiScene: ICoUIScene;
	private m_fontColor: IColor4;
	private m_bgColor: IColor4;
	private m_texAtlas: ICanvasTexAtlas = null;
	private m_tex: IImageTexture = null;
	private m_fontSize = 24;
	private m_text = "tipsInfo";

	constructor() {
		super();
		this.premultiplyAlpha = true;
	}

	initialize(uiScene: ICoUIScene, rpi: number = 0, fontSize: number = 24, fontColor: IColor4 = null, bgColor: IColor4 = null): void {

		if (this.isIniting()) {

			if (rpi < 0) rpi = 0;
			if (fontSize < 12) fontSize = 12;
			this.m_texAtlas = uiScene.texAtlas;
			this.init();

			this.m_uiScene = uiScene;
			this.m_rpi = rpi;

			let entity = CoEntity.createDisplayEntity();

			let cfg = uiScene.uiConfig;
			let tipsText = cfg.getUIGlobalText().fontFormat.tips;
			this.m_fontSize = tipsText.fontSize;
			// this.m_fontColor = fontColor == null ? CoMaterial.createColor4().setRGB3Bytes(170, 170, 170) : fontColor;
			this.m_fontColor = fontColor == null ? cfg.createColorByData(tipsText.fontColor) : fontColor;
			this.m_bgColor = bgColor == null ? CoMaterial.createColor4(0.1, 0.1, 0.1, 0.5) : bgColor;

			let img = this.m_texAtlas.createCharsImage(this.m_text, this.m_fontSize, this.m_fontColor, this.m_bgColor);
			this.m_tex = uiScene.rscene.textureBlock.createImageTex2D(img.width, img.height);
			this.m_tex.setDataFromImage(img);

			this.m_tex.flipY = true;
			this.m_tex.premultiplyAlpha = true;
			this.m_tex.minFilter = CoRScene.TextureConst.LINEAR;
			this.m_tex.magFilter = CoRScene.TextureConst.NEAREST;

			let material = this.createMaterial(this.m_tex);

			CoMesh.plane.setBufSortFormat(material.getBufSortFormat());
			let mesh = CoMesh.plane.createXOY(0, 0, 1.0, 1.0);
			this.m_pw = img.width;
			this.m_ph = img.height;
			entity.setMaterial(material);
			entity.setMesh(mesh);
			this.m_entities.push(entity);
			this.applyRST(entity);
			this.setScaleXY(img.width, img.height);

			// this.m_uiScene.addEntity(this, this.m_rpi);
			// this.setVisible(false);

		}
	}
	addEntity(entity: IMouseEvtUIEntity): void {
		if (entity != null) {

			const ME = CoRScene.MouseEvent;
			entity.addEventListener(ME.MOUSE_OUT, this, this.targetMouseOut);
			entity.addEventListener(ME.MOUSE_OVER, this, this.targetMouseOver);
			entity.addEventListener(ME.MOUSE_MOVE, this, this.targetMouseMove);
		}
	}
	removeEntity(entity: IMouseEvtUIEntity): void {
		if (entity != null) {

			const ME = CoRScene.MouseEvent;
			entity.removeEventListener(ME.MOUSE_OUT, this, this.targetMouseOut);
			entity.removeEventListener(ME.MOUSE_OVER, this, this.targetMouseOver);
			entity.removeEventListener(ME.MOUSE_MOVE, this, this.targetMouseMove);
		}
	}

	private moveTar(tar: IUIEntity, mx: number, my: number): void {
		
		let bounds = tar.getGlobalBounds();
		let info = tar.info;
		let pv = info.getPos(mx, my, bounds, this.getGlobalBounds());
		this.setXY(pv.x, pv.y);
		this.update();
	}
	private targetMouseOver(evt: any): void {
		if(this.getScene() == null) {
			this.m_uiScene.addEntity(this, this.m_rpi);
		}
		this.setVisible(true);
		let tar = evt.currentTarget as IUIEntity;
		this.setText(tar.info.getCotent());
		this.moveTar(tar, evt.mouseX, evt.mouseY);
	}
	private targetMouseMove(evt: any): void {
		let tar = evt.currentTarget as IUIEntity;
		this.moveTar(tar, evt.mouseX, evt.mouseY);
	}
	private targetMouseOut(evt: any): void {
		this.setVisible(false);
		// this.m_uiScene.removeEntity(this);
	}
	setText(text: string): void {
		if (this.m_tex != null && text != "" && this.m_text != text) {

			this.m_text = text;
			let img = this.m_texAtlas.createCharsImage(text, this.m_fontSize, this.m_fontColor, this.m_bgColor);

			this.m_tex.setDataFromImage(img, 0, 0, 0, true);
			this.m_tex.updateDataToGpu();

			this.m_pw = img.width;
			this.m_ph = img.height;
			this.setScaleXY(img.width, img.height);
		}
	}
	getText(): string {
		return this.m_text;
	}
	destroy(): void {
		super.destroy();
		this.m_uiScene = null;
		if(this.m_tex != null) {
			// this.m_tex.__$detachThis();
			this.m_tex = null;
		}
		this.m_texAtlas = null;
	}
}

export { RectTextTip }
