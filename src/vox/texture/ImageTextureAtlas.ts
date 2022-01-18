
import { TextureConst } from "../../vox/texture/TextureConst";
import IRenderTexture from "../../vox/render/texture/IRenderTexture";
import { IImageTexture } from "../../vox/render/texture/IImageTexture";
import AABB2D from "../geom/AABB2D";
import MathConst from "../math/MathConst";
import RendererDevice from "../render/RendererDevice";
import { TexArea, TexAreaNode } from "./TexAreaNode";
import TextureAtlas from "./TextureAtlas";
import RendererScene from "../../vox/scene/RendererScene";

import Color4 from "../material/Color4";

export default class ImageTextureAtlas extends TextureAtlas {

    private static s_imgMap: Map<string, HTMLCanvasElement> = new Map();
    private m_canvas: HTMLCanvasElement = null;
    private m_canvas2D: CanvasRenderingContext2D = null;
    private m_rscene: RendererScene = null;
    private m_texture: IImageTexture = null;
    private m_transparent: boolean = false;
    private m_fillColor: Color4 = null;
    constructor(rscene: RendererScene, canvasWidth: number, canvasHeight: number, fillColor: Color4, transparent: boolean = false, debugEnabled: boolean = false) {

        super(canvasWidth, canvasHeight);
        let canvas = document.createElement('canvas');
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        canvas.style.display = 'bolck';
        canvas.style.left = '0px';
        canvas.style.top = '0px';
        canvas.style.position = 'absolute';
        canvas.style.pointerEvents = 'none';
        this.m_transparent = transparent;
        if (transparent) {
            canvas.style.backgroundColor = 'transparent';
        }
        this.m_fillColor = fillColor;
        this.m_rscene = rscene;
        this.m_canvas = canvas;
        this.m_canvas2D = canvas.getContext("2d");
        if (transparent) {
            this.m_canvas2D.fillStyle = fillColor.getCSSDecRGBAColor();
        }
        else {
            this.m_canvas2D.fillStyle = fillColor.getCSSHeXRGBColor();
        }
        this.m_canvas2D.fillRect(0, 0, canvasWidth, canvasHeight);

        this.m_uvFlipY = true;
        this.m_texture = this.m_rscene.textureBlock.createImageTex2D(32, 32);
        this.m_texture.__$setRenderProxy(this.m_rscene.getRenderProxy());
        this.m_texture.setDataFromImage(this.m_canvas, 0, 0, 0, false);
        this.m_texture.premultiplyAlpha = true;
        this.m_texture.__$attachThis();
    }
    clone(): ImageTextureAtlas {
        let atlas: ImageTextureAtlas = new ImageTextureAtlas(this.m_rscene, this.m_width, this.m_height, this.m_fillColor, this.m_transparent);
        return atlas;
    }
    getTexture(): IImageTexture {
        return this.m_texture;
    }
    getCanvas(): HTMLCanvasElement {
        return this.m_canvas;
    }
    addSubImage(uniqueNS: string, image: HTMLCanvasElement | HTMLImageElement): TexArea {

        let area: TexArea = this.getAreaByName(uniqueNS);
        if (area != null) {
            return area;
        }
        area = this.addSubTexArea(uniqueNS, image.width, image.height);
        if (area != null) {
            let rect: AABB2D = area.texRect;
            this.m_canvas2D.drawImage(image, rect.x, rect.y, rect.width, rect.height);
            this.m_texture.setDataFromImage(this.m_canvas, 0,0,0,false);
            this.m_texture.updateDataToGpu(null, true);
        }
        return area;
    }

    static CreateCharsTexture(chars: string, size: number, fontStyle: string = "rgba(255,255,255,1.0)", bgStyle: string = "rgba(64,0,64,1.0)"): HTMLCanvasElement {
        if (chars == null || chars == "" || size < 8) {
            return null;
        }
        //size = Math.round(size * RendererDevice.GetDevicePixelRatio());
        let keyStr: string = chars + "_" + size + "_" + fontStyle + "_" + bgStyle;

        if (ImageTextureAtlas.s_imgMap.has(keyStr)) {
            return ImageTextureAtlas.s_imgMap.get(keyStr);
        }

        let width: number = size;
        let height: number = size + 2;
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
            //preW = width;
            canvas.width = width;
            ctx2D = canvas.getContext("2d");
            ctx2D.font = (size - 4) + "px Verdana";
            ctx2D.textBaseline = "top";
        }

        ctx2D.fillStyle = bgStyle;
        ctx2D.fillRect(0, 0, width, height);
        ctx2D.textAlign = "left";
        ctx2D.fillStyle = fontStyle;
        //ctx2D.fillText(chars, (size - texWidth) * 0.5, size - (size - metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent * 2.0) * 0.5);
        if (RendererDevice.IsMobileWeb()) {
            if (RendererDevice.IsIOS()) {
                ctx2D.fillText(chars, (width - texWidth) * 0.5, -4);
            }
            else {
                ctx2D.fillText(chars, (width - texWidth) * 0.5, 4);
            }
        }
        else {
            ctx2D.fillText(chars, (width - texWidth) * 0.5, 4);
        }
        ImageTextureAtlas.s_imgMap.set(keyStr, canvas);
        return canvas;
        /*
        actualBoundingBoxAscent: 22
        actualBoundingBoxDescent: -17
        actualBoundingBoxLeft: -4
        actualBoundingBoxRight: 24
        fontBoundingBoxAscent: 60
        fontBoundingBoxDescent: 13
        */
    }

}