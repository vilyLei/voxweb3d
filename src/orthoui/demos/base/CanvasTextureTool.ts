
import TextureProxy from "../../../vox/texture/TextureProxy";
import ImageTextureProxy from "../../../vox/texture/ImageTextureProxy";
import RendererScene from "../../../vox/scene/RendererScene";
import RendererDeviece from "../../../vox/render/RendererDeviece";
import MathConst from "../../../vox/math/MathConst";
import ImageTextureAtlas from "../../../vox/texture/ImageTextureAtlas";
import Color4 from "../../../vox/material/Color4";
import AABB2D from "../../../vox/geom/AABB2D";
import { TexArea } from "../../../vox/texture/TexAreaNode";
import { TextureConst } from "../../../vox/texture/TextureConst";

export class CanvasTextureObject {

    constructor(){}

    uvs: Float32Array = null;
    texture: ImageTextureProxy = null;
    rect:AABB2D = null;
    uniqueName: string = "";
    getWidth(): number {
        if(this.rect != null) return this.rect.width;
        return 0;
    }
    getHeight(): number {
        if(this.rect != null) return this.rect.width;
        return 0;
    }
    destroy(): void {
        this.uvs = null;
        this.texture = null;
        this.rect = null;
    }
}
export class CanvasTextureTool {
    private m_sc: RendererScene = null;
    private static s_ins: CanvasTextureTool = null;
    private static s_imgMap: Map<string, HTMLImageElement | HTMLCanvasElement> = new Map();
    private static s_texMap: Map<string, TextureProxy> = new Map();
    private static s_atlasList: ImageTextureAtlas[] = [ null, null, null, null];
    constructor() {
        if (CanvasTextureTool.s_ins != null) {
            throw Error("class CanvasTextureTool is a singleton class.");
        }
        CanvasTextureTool.s_ins = this;
    }
    static GetInstance(): CanvasTextureTool {
        if (CanvasTextureTool.s_ins != null) {
            return CanvasTextureTool.s_ins;
        }
        return new CanvasTextureTool();
    }

    initialize(sc: RendererScene): void {
        if (this.m_sc == null) {
            this.m_sc = sc;
        }
    }

    initializeAtlas(canvasWidth: number, canvasHeight: number, fillColor: Color4, transparent: boolean = false): void {
        
        let atlas: ImageTextureAtlas = null;
        if(CanvasTextureTool.s_atlasList[0] == null) {
            atlas = new ImageTextureAtlas(this.m_sc, canvasWidth, canvasHeight, fillColor, transparent);
            atlas.getTexture().minFilter = TextureConst.NEAREST;
            atlas.getTexture().magFilter = TextureConst.NEAREST;
            CanvasTextureTool.s_atlasList[0] = atlas;
        }
    }
    addcharsToAtlas(chars: string, size: number, fontStyle: string = "rgba(255,255,255,1.0)", bgStyle: string = "rgba(255,255,255,0.3)"): CanvasTextureObject {
        
        if(chars != "") {
            let atlas: ImageTextureAtlas = CanvasTextureTool.s_atlasList[0];
            let image: HTMLImageElement | HTMLCanvasElement = ImageTextureAtlas.CreateCharsTexture(chars, size, fontStyle, bgStyle);
            return this.addImageToAtlas(chars,image);
        }
        return null;
    }
    addImageToAtlas(uniqueName: string, img: HTMLCanvasElement | HTMLImageElement): CanvasTextureObject {

        let atlas: ImageTextureAtlas = CanvasTextureTool.s_atlasList[0];
        let texArea: TexArea =  atlas.addSubImage(uniqueName, img);

        if(texArea != null) {

            let texNode: CanvasTextureObject = new CanvasTextureObject();
            texNode.texture = atlas.getTexture();
            texNode.uvs = texArea.uvs;
            texNode.rect = texArea.texRect;
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

    createCharsImage(chars: string, size: number, fontStyle: string = "rgba(255,255,255,1.0)", bgStyle: string = "rgba(255,255,255,0.3)"): HTMLCanvasElement | HTMLImageElement {
        if (chars == null || chars == "" || size < 8) {
            return null;
        }
        
        let keyStr: string = chars + "_" + size + fontStyle + "_" + bgStyle;
        if (CanvasTextureTool.s_imgMap.has(keyStr)) {
            return CanvasTextureTool.s_imgMap.get(keyStr);
        }

        if (RendererDeviece.IsWebGL1()) {
            size = MathConst.CalcCeilPowerOfTwo(size);
        }
        let width: number = size;
        let height: number = size;
        if (chars.length > 1) {
            width = size * chars.length;
        }

        let canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        canvas.style.display = 'bolck';
        canvas.style.left = '0px';
        canvas.style.top = '0px';
        canvas.style.position = 'absolute';
        canvas.style.backgroundColor = 'transparent';
        //canvas.style.pointerEvents = 'none';

        let ctx2D = canvas.getContext("2d");
        ctx2D.font = (size - 4) + "px Verdana";
        //ctx2D.textBaseline = "top" || "hanging" || "middle" || "alphabetic" || "ideographic" || "bottom";
        ctx2D.textBaseline = "top";
        var metrics: any = ctx2D.measureText(chars);
        let texWidth: number = metrics.width;

        if (chars.length > 1) {
            width = Math.round(texWidth + 8);
            if (RendererDeviece.IsWebGL1()) {
                width = MathConst.CalcCeilPowerOfTwo(width);
            }
            //preW = width;
            canvas.width = width;
            ctx2D = canvas.getContext("2d");
            ctx2D.font = (size - 4) + "px Verdana";
            ctx2D.textBaseline = "top";
        }
        //console.log("metrics: ",metrics);
        ctx2D.fillStyle = bgStyle;
        ctx2D.fillRect(0, 0, width, height);
        ctx2D.textAlign = "left";
        ctx2D.fillStyle = fontStyle;
        //ctx2D.fillText(chars, (size - texWidth) * 0.5, size - (size - metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent * 2.0) * 0.5);
        if (RendererDeviece.IsMobileWeb()) {
            if (RendererDeviece.IsWebGL1()) {
                ctx2D.fillText(chars, (width - texWidth) - 4, -4);
            }
            else {
                ctx2D.fillText(chars, (width - texWidth) * 0.5, -4);
            }
        }
        else {
            if (RendererDeviece.IsWebGL1()) {
                ctx2D.fillText(chars, (width - texWidth) - 4, 4);
            }
            else {
                ctx2D.fillText(chars, (width - texWidth) * 0.5, 4);
            }
        }
        //ctx2D.fillText(chars, (size - texWidth) * 0.5, (size - metrics.fontBoundingBoxDescent) * 0.5);

        /*
        actualBoundingBoxAscent: 22
        actualBoundingBoxDescent: -17
        actualBoundingBoxLeft: -4
        actualBoundingBoxRight: 24
        fontBoundingBoxAscent: 60
        fontBoundingBoxDescent: 13
        */
        
        return canvas;
    }
    createCharsTexture(chars: string, size: number, fontStyle: string = "rgba(255,255,255,1.0)", bgStyle: string = "rgba(255,255,255,0.3)"): TextureProxy {
        if (chars == null || chars == "" || size < 8) {
            return null;
        }
        let canvas: HTMLCanvasElement | HTMLImageElement = this.createCharsImage(chars, size, fontStyle, bgStyle);
        let keyStr: string = chars + "_" + size + fontStyle + "_" + bgStyle;
        /*
        //size = Math.round(size * RendererDeviece.GetDevicePixelRatio());
        let keyStr: string = chars + "_" + size + fontStyle + "_" + bgStyle;
        if (CanvasTextureTool.s_texMap.has(keyStr)) {
            return CanvasTextureTool.s_texMap.get(keyStr);
        }

        if (RendererDeviece.IsWebGL1()) {
            size = MathConst.CalcCeilPowerOfTwo(size);
        }
        let width: number = size;
        let height: number = size;
        if (chars.length > 1) {
            width = size * chars.length;
        }

        let canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        canvas.style.display = 'bolck';
        canvas.style.left = '0px';
        canvas.style.top = '0px';
        canvas.style.position = 'absolute';
        canvas.style.backgroundColor = 'transparent';
        //canvas.style.pointerEvents = 'none';

        let ctx2D = canvas.getContext("2d");
        ctx2D.font = (size - 4) + "px Verdana";
        //ctx2D.textBaseline = "top" || "hanging" || "middle" || "alphabetic" || "ideographic" || "bottom";
        ctx2D.textBaseline = "top";
        var metrics: any = ctx2D.measureText(chars);
        let texWidth: number = metrics.width;

        if (chars.length > 1) {
            width = Math.round(texWidth + 8);
            if (RendererDeviece.IsWebGL1()) {
                width = MathConst.CalcCeilPowerOfTwo(width);
            }
            //preW = width;
            canvas.width = width;
            ctx2D = canvas.getContext("2d");
            ctx2D.font = (size - 4) + "px Verdana";
            ctx2D.textBaseline = "top";
        }
        //console.log("metrics: ",metrics);
        ctx2D.fillStyle = bgStyle;
        ctx2D.fillRect(0, 0, width, height);
        ctx2D.textAlign = "left";
        ctx2D.fillStyle = fontStyle;
        //ctx2D.fillText(chars, (size - texWidth) * 0.5, size - (size - metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent * 2.0) * 0.5);
        if (RendererDeviece.IsMobileWeb()) {
            if (RendererDeviece.IsWebGL1()) {
                ctx2D.fillText(chars, (width - texWidth) - 4, -4);
            }
            else {
                ctx2D.fillText(chars, (width - texWidth) * 0.5, -4);
            }
        }
        else {
            if (RendererDeviece.IsWebGL1()) {
                ctx2D.fillText(chars, (width - texWidth) - 4, 4);
            }
            else {
                ctx2D.fillText(chars, (width - texWidth) * 0.5, 4);
            }
        }
        //ctx2D.fillText(chars, (size - texWidth) * 0.5, (size - metrics.fontBoundingBoxDescent) * 0.5);

        //*/
        let tex: ImageTextureProxy = this.m_sc.textureBlock.createImageTex2D(size, size);
        tex.premultiplyAlpha = true;
        tex.setDataFromImage(canvas);
        CanvasTextureTool.s_texMap.set(keyStr, tex);
        return tex;
    }
    private getPixelsBounds(data: Uint8ClampedArray, width: number, height: number, threshold: number = 100): any {

        let minX: number, minY: number;
        let maxX: number, maxY: number;

        minX = minY = 99999;
        maxX = maxY = -99999;
        //console.log("data.length: ",data.length);
        let k: number = 0;
        for (let i: number = 0; i < height; ++i) {
            for (let j: number = 0; j < width; ++j) {
                k = i * width + j;
                k *= 4;
                if (data[k + 3] > threshold) {

                    if (j < minX) minX = j;
                    else if (j > maxX) maxX = j;

                    if (i < minY) minY = i;
                    else if (i > maxY) maxY = i;
                }
            }
        }

        let bounds = { x: minX, y: minY, width: (maxX - minX) + 1, height: (maxY - minY) + 1 };
        return bounds;
    }
    private m_whiteTex: TextureProxy = null;
    createWhiteTex(): TextureProxy {
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

        let tex: ImageTextureProxy = this.m_sc.textureBlock.createImageTex2D(32, 32);
        tex.setDataFromImage(canvas);
        this.m_whiteTex = tex;
        tex.premultiplyAlpha = true;
        return tex;
    }
}
export default CanvasTextureTool;