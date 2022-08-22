import IRendererScene from "../../../vox/scene/IRendererScene";
import ImageTexAtlas from "./ImageTexAtlas";

import IColor4 from "../../../vox/material/IColor4";
import IAABB2D from "../../../vox/geom/IAABB2D";

import IRenderTexture from "../../../vox/render/texture/IRenderTexture";


import { ICoMaterial } from "../../voxmaterial/ICoMaterial";
import { ICoMath } from "../../math/ICoMath";

declare var CoMath: ICoMath;
declare var CoMaterial: ICoMaterial;

export class CanvasTexObject {

    constructor() { }

    uvs: Float32Array = null;
    texture: IRenderTexture = null;
    rect: IAABB2D = null;
    clampUVRect: IAABB2D = null;
    uniqueName: string = "";
    getWidth(): number {
        if (this.rect != null) return this.rect.width;
        return 0;
    }
    getHeight(): number {
        if (this.rect != null) return this.rect.height;
        return 0;
    }
    destroy(): void {
        this.uvs = null;
        this.texture = null;
        this.rect = null;
    }
}
export class CanvasTexAtlas {
    private m_sc: IRendererScene = null;
    private m_atlasList: ImageTexAtlas[] = [null, null, null, null];
    constructor() {
    }
    // initialize(sc: IRendererScene): void {
    //     if (this.m_sc == null) {
    //         this.m_sc = sc;
    //     }
    // }

    initialize(sc: IRendererScene, canvasWidth: number, canvasHeight: number, fillColor: IColor4 = null, transparent: boolean = false): void {
        this.m_sc = sc;
        let atlas: ImageTexAtlas = null;
		if(fillColor == null) {
			fillColor = transparent ? CoMaterial.createColor4(1.0, 1.0, 1.0, 0.0) : CoMaterial.createColor4(1.0, 1.0, 1.0, 1.0);
		}
        if (this.m_atlasList[0] == null) {

            atlas = new ImageTexAtlas(this.m_sc, canvasWidth, canvasHeight, fillColor, transparent);
            //  atlas.getTexture().minFilter = TextureConst.NEAREST;
            //  atlas.getTexture().magFilter = TextureConst.NEAREST;
            //  atlas.getTexture().mipmapEnabled = false;
            this.m_atlasList[0] = atlas;
            /*
            // for test
            let canvas0 = atlas.getCanvas();
            canvas0.width = 3000;
            canvas0.height = 4000;
            canvas0.style.width = 256 + 'px';
            canvas0.style.height = 256 + 'px';
            canvas0.style.left = 0 + 'px';
            canvas0.style.top = 0 + 'px';
            let debugEnabled: boolean = true;
            if (debugEnabled) {
                document.body.appendChild(canvas0);
            }
            //*/
        }
    }
    getAtlasAt(i: number): ImageTexAtlas {
        return this.m_atlasList[i];
    }
    addcharsToAtlas(chars: string, size: number, fontStyle: string = "rgba(255,255,255,1.0)", bgStyle: string = "rgba(255,255,255,0.3)"): CanvasTexObject {

        if (chars != "") {
            let atlas: ImageTexAtlas = this.m_atlasList[0];
            let image: HTMLImageElement | HTMLCanvasElement = ImageTexAtlas.CreateCharsTexture(chars, size, fontStyle, bgStyle);
            return this.addImageToAtlas(chars, image);
        }
        return null;
    }
    getTextureObject(uniqueName: string): CanvasTexObject {

        let atlas: ImageTexAtlas = this.m_atlasList[0];
        let texArea = atlas.getAreaByName(uniqueName);
        if (texArea != null) {

            let texNode = new CanvasTexObject();
            texNode.texture = atlas.getTexture();
            texNode.uvs = texArea.uvs.slice(0);
            texNode.rect = texArea.texRect.clone();
            texNode.clampUVRect = texArea.texRect.clone();
            texNode.clampUVRect.x /= atlas.getWidth();
            texNode.clampUVRect.y /= atlas.getHeight();
            texNode.clampUVRect.width /= atlas.getWidth();
            texNode.clampUVRect.height /= atlas.getHeight();
            texNode.uniqueName = texArea.uniqueNS;

            return texNode;
        }
        return null;
    }
    addImageToAtlas(uniqueName: string, img: HTMLCanvasElement | HTMLImageElement): CanvasTexObject {

        let atlas = this.m_atlasList[0];
        let texArea = atlas.addSubImage(uniqueName, img);

        if (texArea != null) {

            let texNode = new CanvasTexObject();
            texNode.texture = atlas.getTexture();
            texNode.uvs = texArea.uvs;
            texNode.rect = texArea.texRect;
            texNode.clampUVRect = texArea.texRect.clone();
            texNode.clampUVRect.x /= atlas.getWidth();
            texNode.clampUVRect.y /= atlas.getHeight();
            texNode.clampUVRect.width /= atlas.getWidth();
            texNode.clampUVRect.height /= atlas.getHeight();
            texNode.uniqueName = texArea.uniqueNS;

            return texNode;
        }
        else {
            console.error("addImageToAtlas error!");
        }
        return null;
    }
    getTextureObjectFromAtlas(uniqueName: string): CanvasTexObject {
        return null;
    }

    createCharsImage(chars: string, size: number, frontStyle: string = "rgba(255,255,255,1.0)", bgStyle: string = "rgba(255,255,255,0.3)"): HTMLCanvasElement | HTMLImageElement {

        if (chars == null || chars == "" || size < 8) {
            return null;
        }
        return ImageTexAtlas.CreateCharsTexture(chars, size, frontStyle, bgStyle);
    }

    private m_whiteTex: IRenderTexture = null;
    createWhiteTex(): IRenderTexture {
        if (this.m_whiteTex != null) {
            return this.m_whiteTex;
        }
        let size = 16;
        let canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;

        let ctx2D = canvas.getContext("2d");
        ctx2D.fillStyle = "white";
        ctx2D.fillRect(0, 0, size, size);

        let tex = this.m_sc.textureBlock.createImageTex2D(32, 32, false);
        tex.setDataFromImage(canvas, 0, 0, 0, false);
        this.m_whiteTex = tex;
        tex.premultiplyAlpha = true;
        return tex;
    }
}
export default CanvasTexAtlas;
