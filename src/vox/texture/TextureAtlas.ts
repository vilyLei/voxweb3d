
import AABB2D from "../geom/AABB2D";
import {TexArea,TexAreaNode} from "./TexAreaNode";

export default class TextureAtlas {

    private static s_uid: number = 0;
    private m_uid: number = 0;
    protected m_texAreaNode: TexAreaNode = null;
    protected m_uvFlipY: boolean = false;
    private m_keyMap: Map<string, TexArea> = new Map();
    private m_area: TexArea = new TexArea();
    private m_offset: number = 2;
    private m_minSize: number = 32;
    private m_width: number = 32;
    private m_height: number = 32;
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
    
    getAreaByName(uniqueNS: string): TexArea {
        if (this.m_keyMap.has(uniqueNS)) {
            return this.m_keyMap.get(uniqueNS);
        }
        return null;
    }
    
    getTexAreaByXY(px: number, py: number): TexArea {

        let node:TexAreaNode = this.m_texAreaNode.findByXY(px,py);
        if(node != null) {
            if (this.m_keyMap.has(node.uniqueNS)) {
                return this.m_keyMap.get(node.uniqueNS);
            }
        }
        return null;
    }
    addSubTexArea(uniqueNS: string, areaWidth: number, areaHeight: number): TexArea {
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
            area.rect.width = areaWidth + area.offset * 2;
            area.rect.height = areaHeight + area.offset * 2;
    
            let flag: boolean = this.m_texAreaNode.addTexArea(area);
            if( flag ) {

                area = new TexArea();
                area.copyFrom(this.m_area);
                this.m_keyMap.set(uniqueNS, area);
                area.atlasUid = this.m_uid;
                
                let rect: AABB2D = area.rect;
                let texRect: AABB2D = area.texRect;
                texRect.copyFrom(rect);

                texRect.x += area.offset;
                texRect.y += area.offset;                
                texRect.width -= area.offset;
                texRect.height -= area.offset;
                texRect.flipY(this.m_height);
                                
                let uMin: number = texRect.x / this.m_width;
                let vMin: number = texRect.y / this.m_height;
                let uMax: number = texRect.getRight() / this.m_width;
                let vMax: number = texRect.getTop() / this.m_height;
                
                if(this.m_uvFlipY) {
                    area.uvs.set([
                        uMin, vMax,
                        uMax, vMax,
                        uMax, vMin,
                        uMin, vMin
                    ],0);
                }
                else {
                    area.uvs.set([
                        uMin, vMin,
                        uMax, vMin,
                        uMax, vMax,
                        uMin, vMax
                    ],0);
                }
                return area;
            }
            else {
                console.warn(this.m_uid+",####### 超出了...");
                return null;
            }
        }
    }

}