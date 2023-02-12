
import IAABB2D from "../../../vox/geom/IAABB2D";
import ITexArea from "./ITexArea";

export default interface ITexAreaNode {

    rect: IAABB2D;
    subNodes: ITexAreaNode[];
    uniqueNS: string;
    subIndex: number;

    findByXY(px: number, py: number): ITexAreaNode;
    /**
     * 添加 texture area 到当前空间管理节点,  默认用四分法均分这个区域无法分的情况再不平衡的2分法(横向或者纵向),叶子节点则不会划分而直接使用当前节点区域
     * @param texArea 填入的纹理区域
     * @param map
     */
    addTexArea(texArea: ITexArea): boolean;
}
