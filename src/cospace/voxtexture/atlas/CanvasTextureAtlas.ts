import IRendererScene from "../../../vox/scene/IRendererScene";
import ImageTextureAtlas from "../../../vox/texture/ImageTextureAtlas";
import Color4 from "../../../vox/material/Color4";
import AABB2D from "../../../vox/geom/AABB2D";
import { TexArea } from "../../../vox/texture/TexAreaNode";
import IRenderTexture from "../../../vox/render/texture/IRenderTexture";

export class CanvasTextureObject {

    constructor() { }

    uvs: Float32Array = null;
    texture: IRenderTexture = null;
    rect: AABB2D = null;
    clampUVRect: AABB2D = null;
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
export class CanvasTextureAtlas {
    private m_sc: IRendererScene = null;
    // private m_imgMap: Map<string, HTMLImageElement | HTMLCanvasElement> = new Map();
    // private m_texMap: Map<string, IRenderTexture> = new Map();
    private m_atlasList: ImageTextureAtlas[] = [null, null, null, null];
    constructor() {
    }
    initialize(sc: IRendererScene): void {
        if (this.m_sc == null) {
            this.m_sc = sc;
        }
    }

    initializeAtlas(canvasWidth: number, canvasHeight: number, fillColor: Color4 = null, transparent: boolean = false): void {

        let atlas: ImageTextureAtlas = null;
		if(fillColor == null) {
			fillColor = transparent ? new Color4(1.0, 1.0, 1.0, 0.0) : new Color4(1.0, 1.0, 1.0, 1.0);
		}
        if (this.m_atlasList[0] == null) {

            atlas = new ImageTextureAtlas(this.m_sc, canvasWidth, canvasHeight, fillColor, transparent);
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
    getAtlasAt(i: number): ImageTextureAtlas {
        return this.m_atlasList[i];
    }
    addcharsToAtlas(chars: string, size: number, fontStyle: string = "rgba(255,255,255,1.0)", bgStyle: string = "rgba(255,255,255,0.3)"): CanvasTextureObject {

        if (chars != "") {
            let atlas: ImageTextureAtlas = this.m_atlasList[0];
            let image: HTMLImageElement | HTMLCanvasElement = ImageTextureAtlas.CreateCharsTexture(chars, size, fontStyle, bgStyle);
            return this.addImageToAtlas(chars, image);
        }
        return null;
    }
    getTextureObject(uniqueName: string): CanvasTextureObject {

        let atlas: ImageTextureAtlas = this.m_atlasList[0];
        let texArea: TexArea = atlas.getAreaByName(uniqueName);
        if (texArea != null) {

            let texNode: CanvasTextureObject = new CanvasTextureObject();
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
    addImageToAtlas(uniqueName: string, img: HTMLCanvasElement | HTMLImageElement): CanvasTextureObject {

        let atlas: ImageTextureAtlas = this.m_atlasList[0];
        let texArea: TexArea = atlas.addSubImage(uniqueName, img);

        if (texArea != null) {

            let texNode: CanvasTextureObject = new CanvasTextureObject();
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
    getTextureObjectFromAtlas(uniqueName: string): CanvasTextureObject {
        return null;
    }

    createCharsImage(chars: string, size: number, frontStyle: string = "rgba(255,255,255,1.0)", bgStyle: string = "rgba(255,255,255,0.3)"): HTMLCanvasElement | HTMLImageElement {

        if (chars == null || chars == "" || size < 8) {
            return null;
        }
        return ImageTextureAtlas.CreateCharsTexture(chars, size, frontStyle, bgStyle);
    }

    private m_whiteTex: IRenderTexture = null;
    createWhiteTex(): IRenderTexture {
        if (this.m_whiteTex != null) {
            return this.m_whiteTex;
        }
        let size: number = 16;
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
export default CanvasTextureAtlas;
