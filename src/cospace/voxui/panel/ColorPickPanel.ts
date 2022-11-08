import { ICoMesh } from "../../voxmesh/ICoMesh";
import { ICoMaterial } from "../../voxmaterial/ICoMaterial";
import { ICoEntity } from "../../voxentity/ICoEntity";

import { ICoRScene } from "../../voxengine/ICoRScene";
import { IButton } from "../button/IButton";
import { ICoUIScene } from "../scene/ICoUIScene";
import { TextLabel } from "../entity/TextLabel";
import { UIPanel } from "./UIPanel";
import IColor4 from "../../../vox/material/IColor4";
import IRenderTexture from "../../../vox/render/texture/IRenderTexture";

declare var CoRScene: ICoRScene;
declare var CoMesh: ICoMesh;
declare var CoMaterial: ICoMaterial;
declare var CoEntity: ICoEntity;

class ColorPickPanel extends UIPanel {

	/**
	 * 边距留白尺寸
	 */
	private m_marginWidth: number = 70;

	constructor() { super(); }

	initialize(scene: ICoUIScene, rpi: number, panelW: number, panelH: number, marginWidth: number = 15): void {
		if (this.isIniting()) {
			this.init();

			this.m_marginWidth = marginWidth;
			this.m_scene = scene;
			this.m_rpi = rpi;

			this.m_panelW = panelW;
			this.m_panelH = panelH;

			if(this.m_bgColor == null) this.m_bgColor = CoMaterial.createColor4();
		}
	}
	// setListener(confirmFunc: () => void, cancelFunc: () => void): void {
	// 	this.m_confirmFunc = confirmFunc;
	// 	this.m_cancelFunc = cancelFunc;
	// }
	destroy(): void {
		super.destroy();

	}

	protected buildPanel(pw: number, ph: number): void {

		this.buildItems();
	}
	private m_initing: boolean = true;
	protected buildItems(): void {
		if (this.m_initing == null) {
			let sc = this.getScene();
			let tta = sc.transparentTexAtlas;
			// let fc4 = CoMaterial.createColor4;

			// let cfg = this.m_scene.uiConfig;
			// let gColor = cfg.getUIGlobalColor();
			// let uiCfg = cfg.getUIPanelCfgByName("promptPanel");
			// let keys = uiCfg.btnKeys;
			// let btf = uiCfg.btnTextFontFormat;
			// let ltf = uiCfg.textFontFormat;
			
			// this.addEntity(textLabel);
			
			let plb = CoMesh.plane;
			let cplUrl = "static/assets/colors.png";
			let material = CoMaterial.createDefaultMaterial(false);
			material.initializeByCodeBuf( true );
			material.setTextureList( [this.createTexByUrl( cplUrl )] );
			plb.applyMaterial( material, true );

			let cplMesh = plb.createXOY(0,0,256,256);
			let entity = CoEntity.createDisplayEntity();
			entity.setMaterial( material );
			entity.setMesh( cplMesh );
			

		}
	}

    private createTexByUrl(url: string = ""): IRenderTexture {
		let sc = this.getScene();

        let tex = sc.rscene.textureBlock.createImageTex2D(64, 64, false);
        let img = new Image();
        img.onload = (evt: any): void => {
            tex.setDataFromImage(img, 0, 0, 0, false);
        };
        img.src = url != "" ? url : "static/assets/box.jpg";
        return tex;
    }
	protected openThis(): void {

		let ME = CoRScene.MouseEvent;
		if (this.m_scene != null) {
			this.m_scene.addEventListener(ME.MOUSE_DOWN, this, this.stMouseDownListener);

			// this.layoutItems();
		}
	}
	protected closeThis(): void {
		let ME = CoRScene.MouseEvent;
		if (this.m_scene != null) {
			this.m_scene.removeEventListener(ME.MOUSE_DOWN, this, this.stMouseDownListener);
		}
	}

	private stMouseDownListener(evt: any): void {

		console.log("color pick stMouseDownListener...");

		let px = evt.mouseX;
		let py = evt.mouseY;
		let pv = this.m_v0;
		pv.setXYZ(px, py, 0);

		this.globalToLocal(pv);

		if (pv.x < 0 || pv.x > this.m_panelW || pv.y < 0 || pv.y > this.m_panelH) {
			this.close();
		}
	}
}
export { ColorPickPanel };
