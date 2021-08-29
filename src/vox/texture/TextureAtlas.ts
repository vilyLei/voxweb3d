
import { TextureConst } from "../../vox/texture/TextureConst";
import TextureProxy from "../../vox/texture/TextureProxy";
import AABB2D from "../geom/AABB2D";


class TexArea {
    area: AABB2D = new AABB2D();
    uvs: number[] = [
        0, 0,
        1, 0,
        1, 1,
        0, 1
    ];
    constructor() { }
}

class TexAreaNode {
    area: AABB2D = null;
    subAreas: TexAreaNode[] = null;
    constructor(px: number = 0.0, py: number = 0.0, pwidth: number = 100.0, pheight: number = 100.0) {
        this.area = new AABB2D(px, py, pwidth, pheight);
    }
    /**
     * 添加 texture area 到当前空间管理节点,  默认用四分法均分这个区域无法分的情况再不平衡的2分法(横向或者纵向),叶子节点则不会划分而直接使用当前节点区域
     * @param texArea 填入的纹理区域
     * @param map 
     */
    addTexArea(texArea: TexArea, map: Map<string, TexArea>): boolean {

        let dstW: number = texArea.area.width;
        let dstH: number = texArea.area.height;
        if (dstW <= this.area.width && dstH <= this.area.height) {
            
            // 开始做空间划分
            let pw: number = this.area.width * 0.5;
            let ph: number = this.area.height * 0.5;

            if (dstW <= pw && dstH <= ph) {
                // 四块区域均分
                // 检测是否已经填满子空间, 如果填满了就不能填入了
            }
            else if (dstW <= pw) {
                // 横向非均匀划分
                // 检测是否已经填满子空间, 如果填满了就不能填入了
            }
            else if (dstH <= ph) {
                // 纵向非均匀划分
                // 检测是否已经填满子空间, 如果填满了就不能填入了
            }
            return true;
        }
        return false;
    }
}
/*
class TexFourAreaNode extends TexAreaNode{

    constructor(){
        super();
    }
}

class TexTowAreaNode extends TexAreaNode{

    constructor(){
        super();
    }
}
//*/

export class TextureAtlas {

    private m_rootArea: TexAreaNode = new TexAreaNode(0, 0, 512, 512);
    private m_keyMap: Map<string, TexArea> = new Map();
    constructor() { }

    addImage(uniqueNS: string, image: HTMLCanvasElement | HTMLImageElement): number[] {
        let uvs: number[] = [];

        return uvs;
    }


}