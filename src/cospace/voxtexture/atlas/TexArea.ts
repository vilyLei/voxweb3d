
import IAABB2D from "../../../vox/geom/IAABB2D";
import ITexArea from "./ITexArea";

import { ICoMath } from "../../math/ICoMath";
declare var CoMath: ICoMath;

export default class TexArea implements ITexArea {
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
    readonly uvs = new Float32Array(8);
    constructor(px: number = 0.0, py: number = 0.0, pwidth: number = 100.0, pheight: number = 100.0) {
        this.rect = CoMath.createAABB2D(px, py, pwidth, pheight);
        this.texRect = CoMath.createAABB2D(px, py, pwidth, pheight);
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
