
import IAABB2D from "../../../vox/geom/IAABB2D";

export default interface ITexArea {
    uniqueNS: string;
    // 自身在列表数组中的序号
    listIndex: number;
    atlasUid: number;
    /**
     * 占据的区域
     */
    rect: IAABB2D;
    // 纹理覆盖实际区域
    texRect: IAABB2D;
    offset: number;
    minSize: number;
    uvs: Float32Array;
    copyFrom(dst: ITexArea): void
    update(): void;
}
