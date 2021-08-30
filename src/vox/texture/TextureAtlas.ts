
import { TextureConst } from "../../vox/texture/TextureConst";
import TextureProxy from "../../vox/texture/TextureProxy";
import AABB2D from "../geom/AABB2D";
import MathConst from "../math/MathConst";
import RendererDeviece from "../render/RendererDeviece";
import {TexArea,TexAreaNode} from "./TexAreaNode";

export default class TextureAtlas {

    private static s_uid: number = 0;
    private m_uid: number = 0;
    private m_texAreaNode: TexAreaNode = null;
    private m_keyMap: Map<string, TexArea> = new Map();
    private m_area: TexArea = new TexArea();
    private m_offset: number = 2;
    private m_minSize: number = 32;
    private m_width: number = 32;
    private m_height: number = 32;
    private static s_imgMap: Map<string, HTMLCanvasElement> = new Map();
    constructor(width: number, height: number) {
        if(width < 128) width = 128;
        if(height < 128) height = 128;
        this.m_width = width;
        this.m_height = height;
        this.m_texAreaNode = new TexAreaNode(0, 0, width, height);
        this.m_uid = TextureAtlas.s_uid++;
    }
    getUid(): number {
        return this.m_uid;
    }
    setMinSize(minSize: number): void 
    {
        this.m_minSize = Math.max(minSize,4);
    }
    
    addImageDebug(uniqueNS: string, image: HTMLCanvasElement | HTMLImageElement, canvas2d: any): TexArea {
        let area: TexArea = this.addSubImage(uniqueNS, image);
        if(area != null) {
            ///*
            // for test
            
            let offset: number = area.offset;
            let rect: AABB2D = area.rect.clone();
            rect.y = this.m_texAreaNode.rect.height - rect.getTop();
            //console.log("result rect: ",rect,offset);
            canvas2d.drawImage(image, rect.x + offset, rect.y + offset, rect.width-offset, rect.height-offset);
            //*/
        }
        return area;
    }

    getAreaByName(uniqueNS: string): TexArea {
        if (this.m_keyMap.has(uniqueNS)) {
            return this.m_keyMap.get(uniqueNS);
        }
        return null;
    }
    addSubImage(uniqueNS: string, image: HTMLCanvasElement | HTMLImageElement): TexArea {
        if(uniqueNS == undefined || uniqueNS == "") {
            if(uniqueNS == undefined) {
                console.error("the value of the uniqueNS is invalid(uniqueNS value is undefined).");
            }
            else {
                console.error("the value of the uniqueNS is invalid(uniqueNS value is '').");
            }
        }
        if (this.m_keyMap.has(uniqueNS)) {
            return this.m_keyMap.get(uniqueNS);
        }
        else {

            let area: TexArea = this.m_area;
            area.offset = this.m_offset;
            area.minSize = this.m_minSize;
            area.uniqueNS = uniqueNS;
            area.rect.width = image.width + area.offset * 2;
            area.rect.height = image.height + area.offset * 2;
    
            let flag: boolean = this.m_texAreaNode.addTexArea(area, null);
            if( flag ) {

                /*
                // for test
                
                let offset: number = area.offset;
                let px: number = 20;
                let py: number = 20;
                let rect: AABB2D = area.rect.clone();
                rect.y = this.m_texAreaNode.rect.height - rect.getTop();
                //console.log("result rect: ",rect,offset);
                canvas2d.drawImage(image, rect.x + offset, rect.y + offset, rect.width-offset, rect.height-offset);
                //*/
                

                area = new TexArea();
                area.copyFrom(this.m_area);
                this.m_keyMap.set(uniqueNS, area);

                let rect: AABB2D = area.rect;
                let uMin: number = (rect.x + area.offset)/this.m_width;
                let vMin: number = (this.m_height - (rect.y + area.offset))/this.m_height;
                let uMax: number = (rect.getRight() - area.offset)/this.m_width;
                let vMax: number = (this.m_height - (rect.getTop() - area.offset))/this.m_height;
                area.uvs.set([
                    uMin, vMin,
                    uMax, vMin,
                    uMax, vMax,
                    uMin, vMax
                ],0);
                return area;
            }
            else {
                console.warn(this.m_uid+",####### 超出了...");
                return null;
            }
        }
    }

    createCharsTexture(chars: string, size: number, fontStyle: string = "rgba(255,255,255,1.0)", bgStyle: string = "rgba(64,0,64,1.0)"): HTMLCanvasElement {
        if(chars == null || chars == "" || size < 8) {
            return null;
        }
        //size = Math.round(size * RendererDeviece.GetDevicePixelRatio());
        let keyStr: string = chars + "_" + size + fontStyle + "_" + bgStyle;
        if(TextureAtlas.s_imgMap.has(keyStr)) {
            return TextureAtlas.s_imgMap.get(keyStr);
        }
        
        let width: number = size;
        let height: number = size;
        if(chars.length > 1) {
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
        
        if(chars.length > 1) {
            width = Math.round(texWidth + 8);
            if(RendererDeviece.IsWebGL1()) {
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
        ctx2D.fillRect(0,0,width,height);
        ctx2D.textAlign = "left";
        ctx2D.fillStyle = fontStyle;
        //ctx2D.fillText(chars, (size - texWidth) * 0.5, size - (size - metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent * 2.0) * 0.5);
        if(RendererDeviece.IsMobileWeb()) {
            ctx2D.fillText(chars, (width - texWidth) * 0.5, -4);
        }
        else {
            ctx2D.fillText(chars, (width - texWidth) * 0.5, 4);
        }
        //ctx2D.fillText(chars, (size - texWidth) * 0.5, (size - metrics.fontBoundingBoxDescent) * 0.5);
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