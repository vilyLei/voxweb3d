import IAABB from "../../../vox/geom/IAABB";
import IVector3D from "../../../vox/math/IVector3D";
import IRenderEntity from "../../../vox/render/IRenderEntity";
import IRendererScene from "../../../vox/scene/IRendererScene";

import { ICoMesh } from "../../voxmesh/ICoMesh";
import { ICoEntity } from "../../voxentity/ICoEntity";
import { ICoMaterial } from "../../voxmaterial/ICoMaterial";
import { ICoMath } from "../../math/ICoMath";
import ITransformEntity from "../../../vox/entity/ITransformEntity";
import ICanvasTexAtlas from "../../voxtexture/atlas/ICanvasTexAtlas";
import IRenderTexture from "../../../vox/render/texture/IRenderTexture";
import { IImageTexture } from "../../../vox/render/texture/IImageTexture";
import { ICoUIScene } from "../../voxui/scene/ICoUIScene";

declare var CoMesh: ICoMesh;
declare var CoMaterial: ICoMaterial;
declare var CoEntity: ICoEntity;
declare var CoMath: ICoMath;

class RectTextTip {

	private m_uiScene: ICoUIScene;
	private m_entity: ITransformEntity = null;
	private m_texAtlas: ICanvasTexAtlas = null;
	private m_tex: IImageTexture = null;
	private m_fontSize = 24;
	private m_text = "tipsInfo";
	constructor() {
	}

	initialize(uiScene: ICoUIScene, rpi: number = 0, fontSize: number = 24): void {

		if (this.m_entity == null) {

			if(rpi < 0) rpi = 0;
			if(fontSize < 12) fontSize = 12;
			this.m_texAtlas = uiScene.texAtlas;

			this.m_uiScene = uiScene;
			this.m_entity = CoEntity.createDisplayEntity();

			let img = this.m_texAtlas.createCharsImage(this.m_text, this.m_fontSize);
			this.m_tex = uiScene.rscene.textureBlock.createImageTex2D(img.width, img.height);
			this.m_tex.setDataFromImage( img );
			this.m_tex.flipY = true;
			
			let material = CoMaterial.createDefaultMaterial();
			material.setTextureList([ this.m_tex ]);
			material.initializeByCodeBuf( true );
			CoMesh.plane.setBufSortFormat(material.getBufSortFormat());
			let mesh = CoMesh.plane.createXOY(0,0, 1.0,1.0);
			
			this.m_entity.setMaterial(material);
			this.m_entity.setMesh(mesh);
			this.m_entity.setScaleXYZ(img.width, img.height, 1.0);
			this.m_entity.setXYZ(280, 180, 0);
			uiScene.rscene.addEntity(this.m_entity);

			// this.setVisible(false);
			
		}
	}
	setText(text: string): void {
		if( text != "" && this.m_text != text ) {
			this.m_text = text;
			console.log("setText, text: ",text);
			let img = this.m_texAtlas.createCharsImage(this.m_text, this.m_fontSize);
			this.m_tex = this.m_uiScene.rscene.textureBlock.createImageTex2D(img.width, img.height);
			this.m_tex.setDataFromImage( img );
			this.m_tex.updateDataToGpu();
			// this.m_entity.updateMaterialToGpu();
		}
	}
	getText(): string {
		return this.m_text;
	}
	setVisible(v: boolean): void {
		if (this.m_entity != null) {
			this.m_entity.setVisible(v);
		}
	}
}

export { RectTextTip }
