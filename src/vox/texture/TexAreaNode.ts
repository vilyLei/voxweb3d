
import { TextureConst } from "../../vox/texture/TextureConst";
import TextureProxy from "../../vox/texture/TextureProxy";
import AABB2D from "../geom/AABB2D";
import MathConst from "../math/MathConst";
import RendererDeviece from "../render/RendererDeviece";


export enum TexAreaFillType {
    NONE,
    ONE,
    TWO_H,
    TWO_V,
    THREE,
    FOUR,
}
export class TexArea {
    uniqueNS: string = "TexArea";
    rect: AABB2D = null;
    offset: number = 2;
    minSize: number = 32;
    readonly uvs: Float32Array = new Float32Array(8);
    constructor(px: number = 0.0, py: number = 0.0, pwidth: number = 100.0, pheight: number = 100.0) {
        this.rect = new AABB2D(px, py, pwidth, pheight);
    }
    copyFrom(dst: TexArea): void {
        this.uniqueNS = dst.uniqueNS;
        this.rect.copyFrom(dst.rect);
        this.offset = dst.offset;
        this.uvs.set(dst.uvs, 0);
    }
    update(): void {
        this.rect.update();
    }
}

export class TexAreaNode {
    rect: AABB2D = null;
    subNodes: TexAreaNode[] = null;

    subIndex: number = 0;
    //minSize: number = 32;
    // 记录自身的填满方式
    protected m_fillType: TexAreaFillType = TexAreaFillType.NONE;

    constructor(px: number = 0.0, py: number = 0.0, pwidth: number = 100.0, pheight: number = 100.0) {
        this.rect = new AABB2D(px, py, pwidth, pheight);
    }
    //  isFull(): boolean {
    //      if (this.subNodes == null) {
    //          return true;
    //      }
    //  }
    protected isFull(): boolean {

        if (this.subNodes == null) {
            return false;
        }

        let node: TexAreaNode = null;
        let nodes: TexAreaNode[] = this.subNodes;
        if(nodes.length == 1) {
            return true;
        }
        for(let i: number = 0; i < nodes.length; ++i) {
            node = nodes[ i ];
            if(!node.isFull()) {
                return false;
            }
        }
        return true;
    }
    protected fillFour(texArea: TexArea, map: Map<string, TexArea>): boolean {

        let boo: boolean = false;
        if (this.subNodes == null) {
            let rect: AABB2D = this.rect;
            let srcR: AABB2D = texArea.rect;
            let halfW: number = this.rect.width * 0.5;
            let halfH: number = this.rect.height * 0.5;
            // // 四区域均分
            let leftBottomAreaNode: TexAreaNode = new TexAreaNode(  rect.x,             rect.y,                 halfW, halfH  );
            let rightBottomAreaNode: TexAreaNode = new TexAreaNode( rect.x + halfW,     rect.y,                 halfW, halfH  );
            let rightTopAreaNode: TexAreaNode = new TexAreaNode(    rect.x + halfW,     rect.y + halfH,         halfW, halfH  );
            let leftTopAreaNode: TexAreaNode = new TexAreaNode(     rect.x,             rect.y + halfH,         halfW, halfH  );

            /*
            // // 四区域不均分, 会产生更多的无效碎片
            let leftBottomAreaNode: TexAreaNode = new TexAreaNode(  rect.x,                 rect.y,                    srcR.width, srcR.height  );
            let rightBottomAreaNode: TexAreaNode = new TexAreaNode( rect.x + srcR.width,    rect.y,                    this.rect.width - srcR.width, srcR.height  );
            let rightTopAreaNode: TexAreaNode = new TexAreaNode(    rect.x + srcR.width,    rect.y + srcR.height,      this.rect.width - srcR.width, this.rect.height - srcR.height  );
            let leftTopAreaNode: TexAreaNode = new TexAreaNode(     rect.x,                 rect.y + srcR.height,      srcR.width, this.rect.height - srcR.height  );

            //*/
            this.subNodes = [
                leftBottomAreaNode,
                rightBottomAreaNode,
                rightTopAreaNode,
                leftTopAreaNode
            ];

            for(let i: number = 0; i < this.subNodes.length; ++i) {
                this.subNodes[i].subIndex = i;
            }
            let node: TexAreaNode = this.subNodes[0];
            // 通过面积排序, 优先使用面积小的
            this.subNodes.sort((a, b) => { return a.rect.width * a.rect.height - b.rect.width * b.rect.height });
            this.m_fillType = TexAreaFillType.FOUR;
            boo = node.fillOne(texArea, map);
        }
        else {
            
            let node: TexAreaNode = null;
            let nodes: TexAreaNode[] = this.subNodes;
            for(let i: number = 0; i < nodes.length; ++i) {
                node = nodes[ i ];
                if(!node.isFull()) {
                    boo = node.addTexArea(texArea, map);
                    if(boo) {
                        break;
                    }
                }
            }
        }
        return boo;
    }
    ///*
    
    protected fillThree(texArea: TexArea, map: Map<string, TexArea>): boolean {

        let boo: boolean = false;
        if (this.subNodes == null) {
            let rect: AABB2D = this.rect;
            let srcR: AABB2D = texArea.rect;
            
            // // 三区域不均分，尽量保留最大可用空间
            let areaNode0: TexAreaNode = new TexAreaNode(  rect.x,   rect.y,       srcR.width, srcR.height  );
            let areaNode1: TexAreaNode;
            let areaNode2: TexAreaNode;
            if(srcR.width > srcR.height) {
                areaNode1 = new TexAreaNode( rect.x + srcR.width,    rect.y,       this.rect.width - srcR.width, this.rect.height  );
                areaNode2 = new TexAreaNode( rect.x,    rect.y + srcR.height,      srcR.width, this.rect.height - srcR.height  );
            }
            else {
                areaNode1 = new TexAreaNode( rect.x + srcR.width,    rect.y,       this.rect.width - srcR.width, srcR.height );
                areaNode2 = new TexAreaNode( rect.x,    rect.y + srcR.height,      this.rect.width, this.rect.height - srcR.height  );
            }
            this.subNodes = [
                areaNode0,
                areaNode1,
                areaNode2
            ];

            for(let i: number = 0; i < this.subNodes.length; ++i) {
                this.subNodes[i].subIndex = i;
                //  if(this.subNodes[i].rect.width < texArea.minSize || this.subNodes[i].rect.height < texArea.minSize) {
                //      console.log("new subnode less minSize.");
                //  }
            }
            // 通过面积排序, 优先使用面积小的
            //this.subNodes.sort((a, b) => { return a.rect.width * a.rect.height - b.rect.width * b.rect.height });
            // 如果一个拆分的区域小于 minSize 则可以从subNodes里面删除并且放回回收整合逻辑，整合为更大的一片有效区域
            let a: TexAreaNode = this.subNodes[1];
            let b: TexAreaNode = this.subNodes[2];
            // 指定排序,优先使用面积小的
            if(a.rect.width * a.rect.height > b.rect.width * b.rect.height) {
                this.subNodes[1] = b;
                this.subNodes[2] = a;
            }
            this.m_fillType = TexAreaFillType.THREE;
            return this.subNodes[0].fillOne(texArea, map);
        }
        else {
            
            let node: TexAreaNode = null;
            let nodes: TexAreaNode[] = this.subNodes;
            for(let i: number = 0; i < nodes.length; ++i) {
                node = nodes[ i ];
                if(!node.isFull()) {
                    boo = node.addTexArea(texArea, map);
                    if(boo) {
                        break;
                    }
                }
            }
        }
        return boo;
    }
    protected fillTwoH(texArea: TexArea, map: Map<string, TexArea>): boolean {

        if (this.subNodes == null) {
            
            let width0: number = texArea.rect.width;
            let width1: number = this.rect.width - texArea.rect.width;
            let height: number = this.rect.height;
    
            let rect: AABB2D = this.rect;
            let leftArea: TexAreaNode = new TexAreaNode(rect.x, rect.y, width0, height);
            let rightArea: TexAreaNode = new TexAreaNode(rect.x + width0, rect.y, width1, height);
            this.subNodes = [
                leftArea,
                rightArea
            ];

            this.m_fillType = TexAreaFillType.TWO_H;
            return leftArea.fillOne(texArea, map);
        }

        if(!this.subNodes[1].isFull()) {
            return this.subNodes[1].addTexArea(texArea, map);
        }
        return false;
    }
    protected fillTwoV(texArea: TexArea, map: Map<string, TexArea>): boolean {
        
        if (this.subNodes == null) {

            let width: number = this.rect.width;
    
            let height0: number = texArea.rect.height;
            let height1: number = this.rect.height - texArea.rect.height;
    
            let rect: AABB2D = this.rect;
            let bottomArea: TexAreaNode = new TexAreaNode(rect.x, rect.y, width, height0);
            let topArea: TexAreaNode = new TexAreaNode(rect.x, rect.y + height0, width, height1);
            this.subNodes = [
                bottomArea,
                topArea
            ];
            this.m_fillType = TexAreaFillType.TWO_V;
            return bottomArea.fillOne(texArea, map);
        }
        if(!this.subNodes[1].isFull()) {
            return this.subNodes[1].addTexArea(texArea, map);
        }
        return false;
    }
    //*/
    protected fillOne(texArea: TexArea, map: Map<string, TexArea>): boolean {

        let boo: boolean = true;
        if (this.subNodes == null) {
            this.subNodes = [
                this
            ];
            this.m_fillType = TexAreaFillType.ONE;
            texArea.rect.x = this.rect.x;
            texArea.rect.y = this.rect.y;
            texArea.update();
            //console.log("fillOne: ",texArea);
        }
        return boo;
    }
    /**
     * 添加 texture area 到当前空间管理节点,  默认用四分法均分这个区域无法分的情况再不平衡的2分法(横向或者纵向),叶子节点则不会划分而直接使用当前节点区域
     * @param texArea 填入的纹理区域
     * @param map 
     */
    addTexArea(texArea: TexArea, map: Map<string, TexArea>): boolean {

        let srcW: number = texArea.rect.width;
        let srcH: number = texArea.rect.height;
        if(this.rect.width <= texArea.minSize && this.rect.height <= texArea.minSize) {
            if (srcW <= this.rect.width && srcH <= this.rect.height && !this.isFull()) {
                // 填入当前区域，不需要划分子区域。
                // 检测是否已经填满, 如果填满了就不能填入了
                return this.fillOne(texArea, map);
            }
            else {
                return false;
            }
        }
        let dstW: number = this.rect.width > texArea.minSize ? this.rect.width : texArea.minSize;
        let dstH: number = this.rect.height > texArea.minSize ? this.rect.height : texArea.minSize;
        //console.log("srcW,dstW: ",srcW,dstW);
        if (srcW <= dstW && srcH <= dstH) {

            // 开始做空间划分
            let pw: number = dstW * 0.5;
            let ph: number = dstH * 0.5;
            let fillType: TexAreaFillType = this.m_fillType;
            if(this.m_fillType == TexAreaFillType.NONE) {
                
                if (srcW <= pw && srcH <= ph) {
                    fillType = TexAreaFillType.FOUR;
                }
                else if (srcW <= pw) {
                    fillType = TexAreaFillType.TWO_H;
                }
                else if (srcH <= ph) {
                    fillType = TexAreaFillType.TWO_V;
                }
                else {
                    fillType = TexAreaFillType.ONE;
                }
            } else if(fillType == TexAreaFillType.ONE){
                return false;
            }
            if (!this.isFull()) {

                if (fillType == TexAreaFillType.THREE || fillType == TexAreaFillType.FOUR) {

                    // 四块区域均分
                    // 检测是否已经填满子空间, 如果填满了就不能填入了
                    // 分配策略为: 尽可能的保留最大有效可用空间, 减少无效碎片
                    // 一下注释掉的代码实际上更容易产生碎片
                    // let k: number = 1.0;
                    // if(texArea.rect.width > texArea.rect.height) {
                    //     k = texArea.rect.height / texArea.rect.width;
                    // }
                    // else {
                    //     k = texArea.rect.width / texArea.rect.height;
                    // }
                    // if(Math.random() < 0.9) {
                    //     return this.fillThree(texArea, map);
                    // }
                    // else {
                    //     // 更容易产生无效碎片，因为分配的区域增多了
                    //     return this.fillFour(texArea, map);
                    // }
                    return this.fillThree(texArea, map);
                }
                else if (fillType == TexAreaFillType.TWO_H) {
                    
                    // 横向非均匀划分
                    // 检测是否已经填满子空间, 如果填满了就不能填入了
                    return this.fillTwoH(texArea, map);
                }
                else if (fillType == TexAreaFillType.TWO_V) {
                    //console.log("B");
                    // 纵向非均匀划分
                    // 检测是否已经填满子空间, 如果填满了就不能填入了
                    return this.fillTwoV(texArea, map);
                }
                else {
                    //console.log("C");
                    // 填入当前区域，不需要划分子区域。
                    // 检测是否已经填满, 如果填满了就不能填入了
                    //fillType == TexAreaFillType.ONE
                    return this.fillOne(texArea, map);
                }
            }
            return false;
        }
        return false;
    }
}