
import IAABB2D from "../../../vox/geom/IAABB2D";
import AABB2D from "../../../vox/geom/AABB2D";

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
    // 自身在列表数组中的序号
    listIndex: number = -1;
    atlasUid: number = 0;
    /**
     * 占据的区域
     */
    rect: IAABB2D = null;
    // 纹理覆盖实际区域
    texRect: IAABB2D = null;
    offset: number = 2;
    minSize: number = 32;
    readonly uvs: Float32Array = new Float32Array(8);
    constructor(px: number = 0.0, py: number = 0.0, pwidth: number = 100.0, pheight: number = 100.0) {
        this.rect = new AABB2D(px, py, pwidth, pheight);
        this.texRect = new AABB2D(px, py, pwidth, pheight);
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

    uniqueNS: string = "TexAreaNode";
    subIndex: number = 0;

    // 记录自身的填满方式
    protected m_fillType: TexAreaFillType = TexAreaFillType.NONE;

    constructor(px: number = 0.0, py: number = 0.0, pwidth: number = 100.0, pheight: number = 100.0) {
        this.rect = new AABB2D(px, py, pwidth, pheight);
    }
    protected isFull(): boolean {

        if (this.subNodes == null) {
            return false;
        }

        let node: TexAreaNode = null;
        let nodes: TexAreaNode[] = this.subNodes;
        if (nodes.length == 1) {
            return true;
        }
        for (let i: number = 0; i < nodes.length; ++i) {
            node = nodes[i];
            if (!node.isFull()) {
                return false;
            }
        }
        return true;
    }
    protected fillFour(texArea: TexArea, map: Map<string, TexArea>): boolean {

        let boo: boolean = false;
        if (this.subNodes == null) {
            let rect: IAABB2D = this.rect;
            let halfW: number = this.rect.width * 0.5;
            let halfH: number = this.rect.height * 0.5;
            // // 四区域均分
            let leftBottomAreaNode: TexAreaNode = new TexAreaNode(rect.x, rect.y, halfW, halfH);
            let rightBottomAreaNode: TexAreaNode = new TexAreaNode(rect.x + halfW, rect.y, halfW, halfH);
            let rightTopAreaNode: TexAreaNode = new TexAreaNode(rect.x + halfW, rect.y + halfH, halfW, halfH);
            let leftTopAreaNode: TexAreaNode = new TexAreaNode(rect.x, rect.y + halfH, halfW, halfH);

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

            for (let i: number = 0; i < this.subNodes.length; ++i) {
                this.subNodes[i].subIndex = i;
            }
            let node: TexAreaNode = this.subNodes[0];
            // 通过面积排序, 优先使用面积小的
            this.subNodes.sort((a, b) => { return a.rect.width * a.rect.height - b.rect.width * b.rect.height });
            this.m_fillType = TexAreaFillType.FOUR;
            boo = node.fillOne(texArea);
        }
        else {

            let node: TexAreaNode = null;
            let nodes: TexAreaNode[] = this.subNodes;
            for (let i: number = 0; i < nodes.length; ++i) {
                node = nodes[i];
                if (!node.isFull()) {
                    boo = node.addTexArea(texArea);
                    if (boo) {
                        break;
                    }
                }
            }
        }
        return boo;
    }
    ///*

    protected fillThree(texArea: TexArea): boolean {

        let boo: boolean = false;
        if (this.subNodes == null) {
            let rect: AABB2D = this.rect;
            let srcR: IAABB2D = texArea.rect;

            // // 三区域不均分，尽量保留最大可用空间
            let areaNode0: TexAreaNode = new TexAreaNode(rect.x, rect.y, srcR.width, srcR.height);
            let areaNode1: TexAreaNode;
            let areaNode2: TexAreaNode;
            if (srcR.width > srcR.height) {
                areaNode1 = new TexAreaNode(rect.x + srcR.width, rect.y, this.rect.width - srcR.width, this.rect.height);
                areaNode2 = new TexAreaNode(rect.x, rect.y + srcR.height, srcR.width, this.rect.height - srcR.height);
            }
            else {
                areaNode1 = new TexAreaNode(rect.x + srcR.width, rect.y, this.rect.width - srcR.width, srcR.height);
                areaNode2 = new TexAreaNode(rect.x, rect.y + srcR.height, this.rect.width, this.rect.height - srcR.height);
            }
            this.subNodes = [
                areaNode0,
                areaNode1,
                areaNode2
            ];

            for (let i: number = 0; i < this.subNodes.length; ++i) {
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
            if (a.rect.width * a.rect.height > b.rect.width * b.rect.height) {
                this.subNodes[1] = b;
                this.subNodes[2] = a;
            }
            this.m_fillType = TexAreaFillType.THREE;
            return this.subNodes[0].fillOne(texArea);
        }
        else {

            let node: TexAreaNode = null;
            let nodes: TexAreaNode[] = this.subNodes;
            for (let i: number = 0; i < nodes.length; ++i) {
                node = nodes[i];
                if (!node.isFull()) {
                    boo = node.addTexArea(texArea);
                    if (boo) {
                        break;
                    }
                }
            }
        }
        return boo;
    }
    protected fillTwoH(texArea: TexArea): boolean {

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
            return leftArea.fillOne(texArea);
        }

        if (!this.subNodes[1].isFull()) {
            return this.subNodes[1].addTexArea(texArea);
        }
        return false;
    }
    protected fillTwoV(texArea: TexArea): boolean {

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
            return bottomArea.fillOne(texArea);
        }
        if (!this.subNodes[1].isFull()) {
            return this.subNodes[1].addTexArea(texArea);
        }
        return false;
    }
    //*/
    protected fillOne(texArea: TexArea): boolean {

        let boo: boolean = true;
        if (this.subNodes == null) {
            this.subNodes = [
                this
            ];
            this.m_fillType = TexAreaFillType.ONE;
            texArea.rect.x = this.rect.x;
            texArea.rect.y = this.rect.y;
            texArea.update();
            this.uniqueNS = texArea.uniqueNS;
            //console.log("fillOne: ",texArea);
        }
        return boo;
    }
    findByXY(px: number, py: number): TexAreaNode {
        if (this.rect.containsXY(px, py)) {
            if (this.subNodes != null) {
                if (this.m_fillType == TexAreaFillType.ONE) {
                    return this;
                }
                let node: TexAreaNode;
                for (let i: number = 0; i < this.subNodes.length; ++i) {
                    node = this.subNodes[i].findByXY(px, py);
                    if (node != null) {
                        return node;
                    }
                }
            }
        }
        return null;
    }
    /**
     * 添加 texture area 到当前空间管理节点,  默认用四分法均分这个区域无法分的情况再不平衡的2分法(横向或者纵向),叶子节点则不会划分而直接使用当前节点区域
     * @param texArea 填入的纹理区域
     * @param map 
     */
    addTexArea(texArea: TexArea): boolean {

        let srcW: number = texArea.rect.width;
        let srcH: number = texArea.rect.height;
        if (this.rect.width <= texArea.minSize && this.rect.height <= texArea.minSize) {
            if (srcW <= this.rect.width && srcH <= this.rect.height && !this.isFull()) {
                // 填入当前区域，不需要划分子区域。
                // 检测是否已经填满, 如果填满了就不能填入了
                return this.fillOne(texArea);
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
            if (this.m_fillType == TexAreaFillType.NONE) {

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
            } else if (fillType == TexAreaFillType.ONE) {
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
                    return this.fillThree(texArea);
                }
                else if (fillType == TexAreaFillType.TWO_H) {

                    // 横向非均匀划分
                    // 检测是否已经填满子空间, 如果填满了就不能填入了
                    return this.fillTwoH(texArea);
                }
                else if (fillType == TexAreaFillType.TWO_V) {
                    //console.log("B");
                    // 纵向非均匀划分
                    // 检测是否已经填满子空间, 如果填满了就不能填入了
                    return this.fillTwoV(texArea);
                }
                else {
                    //console.log("C");
                    // 填入当前区域，不需要划分子区域。
                    // 检测是否已经填满, 如果填满了就不能填入了
                    //fillType == TexAreaFillType.ONE
                    return this.fillOne(texArea);
                }
            }
            return false;
        }
        return false;
    }
}