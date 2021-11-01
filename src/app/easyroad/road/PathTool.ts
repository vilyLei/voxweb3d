import Vector3D from "../../../vox/math/Vector3D";
import { Pos3D } from "../base/Pos3D";
import { Pos3DPool } from "../base/Pos3DPool";

class PathTool {

    private m_tv: Vector3D = new Vector3D();
    private m_tv1: Vector3D = new Vector3D();
    private m_rv: Vector3D = new Vector3D();
    private m_pv: Vector3D = new Vector3D();

    constructor() { }
    /**
     * 
     * @param posListL 左边位置数组 
     * @param posListR 右边位置数组
     * @returns 返回左边到右边两个对应位置的连线的切线
     */
    calcTVList(posListL: Vector3D[], posListR: Vector3D[]): Pos3D[] {

        let tv: Pos3D;
        let list: Pos3D[] = new Array(posListR.length);

        for (let i: number = 0; i < posListR.length; ++i) {
            tv = Pos3DPool.Create();
            tv.subVecsTo(posListR[i], posListL[i]);
            tv.normalize();
            list[i] = tv;
        }
        return list;
    }
    /**
     * 计算左边和右边的新位置数组, 相当于原左边和右边的缩放与平移
     * @param tvList 左边和右边两个对应位置的连线的切线
     * @param posListL 左边位置数组 
     * @param posListR 右边位置数组
     * @param offsetXYZ 整体位置偏移量
     * @param dis 延 tvList 中的切线方向的位置偏移距离
     * @returns [左边新位置数组，右边新位置数组]
     */
    calcOnePosListByTVList(tvList: Vector3D[], srcPosList: Vector3D[], offsetXYZ: Vector3D, dis: number): Pos3D[] {

        let tv: Pos3D = Pos3DPool.Create();
        let pv: Pos3D = Pos3DPool.Create();
        let list: Pos3D[] = new Array(srcPosList.length);
        for (let i: number = 0; i < srcPosList.length; ++i) {
            list[i] = Pos3DPool.Create();
            list[i].copyFrom(srcPosList[i]);
        }
        for (let i: number = 0; i < srcPosList.length; ++i) {
            tv.copyFrom(tvList[i]);
            tv.scaleBy(dis);
            pv.copyFrom(tv);
            list[i].addBy(pv);
            list[i].addBy(offsetXYZ);
        }
        Pos3DPool.Restore(tv);
        Pos3DPool.Restore(pv);
        return list;
    }
    /**
     * 计算左边和右边的新位置数组, 相当于原左边和右边的缩放与平移
     * @param tvList 左边和右边两个对应位置的连线的切线
     * @param posListL 左边位置数组 
     * @param posListR 右边位置数组
     * @param offsetXYZ 整体位置偏移量
     * @param dis 延 tvList 中的切线方向的位置偏移距离
     * @returns [左边新位置数组，右边新位置数组]
     */
    calcTwoPosListByTVList(tvList: Vector3D[], posListL: Vector3D[], posListR: Vector3D[], offsetXYZ: Vector3D, dis: number): Pos3D[][] {

        let tv: Pos3D = Pos3DPool.Create();
        let pv: Pos3D = Pos3DPool.Create();
        let listR: Pos3D[] = new Array(posListR.length);
        let listL: Pos3D[] = new Array(posListL.length);
        for (let i: number = 0; i < posListR.length; ++i) {
            listR[i] = Pos3DPool.Create();
            listR[i].copyFrom(posListR[i]);
            listL[i] = Pos3DPool.Create();
            listL[i].copyFrom(posListL[i]);
        }
        for (let i: number = 0; i < posListR.length; ++i) {
            tv.copyFrom(tvList[i]);
            tv.scaleBy(dis);
            pv.copyFrom(tv);
            pv.scaleBy(-1.0);
            listR[i].addBy(pv);
            listR[i].addBy(offsetXYZ);
            listL[i].addBy(tv);
            listL[i].addBy(offsetXYZ);
        }
        Pos3DPool.Restore(tv);
        Pos3DPool.Restore(pv);

        return [listL, listR];
    }
    /**
     * 计算左手到右手方向的切线
     * @param in_posList 
     * @param out_tvList 
     * @param closed 
     * @returns 
     */
    calcExpandXOZTVList(in_posList: Vector3D[], out_tvList: Pos3D[], closed: boolean = false): Pos3D[] {

        if(out_tvList == null) {
            out_tvList = Pos3DPool.CreateList(in_posList.length);
        }
        closed = closed && Pos3D.Distance(in_posList[in_posList.length - 1], in_posList[0]) < 0.001;

        let tv: Vector3D = this.m_tv;
        let tv1: Vector3D = this.m_tv1;
        let rv: Vector3D = this.m_rv;
        let pv: Vector3D = this.m_pv;

        let i: number = 0;
        let len: number = in_posList.length;
        let maxIndex: number = 0;
        let pa: Vector3D = null;
        let pb: Vector3D = null;
        let pc: Vector3D = null;
        if (closed) {
            len -= 1;
            maxIndex = len - 1;
        }
        maxIndex = len - 1;
        for (; i < len; ++i) {
                
            pb = in_posList[i];
            if (i < 1) {
                pv.subVecsTo(in_posList[i], in_posList[i + 1]);
                pv.addBy(pb);
                pa = pv;
                pc = in_posList[1];

            } else if (i < maxIndex) {
                pa = in_posList[i - 1];
                pc = in_posList[i + 1];
            }
            else {
                pa = in_posList[i - 1];
                pv.subVecsTo(in_posList[i], in_posList[i - 1]);
                pv.addBy(pb);
                pc = pv;
            }
            tv.subVecsTo(pb, pa);
            Vector3D.Cross(Pos3D.Y_AXIS, tv, rv);
            tv.y = 0;
            tv.normalize();
            tv1.subVecsTo(pc, pb);
            tv1.y = 0;
            tv1.normalize();
            tv.addBy(tv1);
            Vector3D.Cross(Pos3D.Y_AXIS, tv, rv);
            rv.y = 0;
            rv.normalize();
            out_tvList[i].copyFrom(rv);
        }
        if (closed) {
            out_tvList[len].copyFrom(out_tvList[0]);
        }
        return out_tvList;
    }
}

export { PathTool };