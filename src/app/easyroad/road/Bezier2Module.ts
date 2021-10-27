import Vector3D from "../../../vox/math/Vector3D";
import { Bezier2Curve, Bezier3Curve } from "../../../vox/geom/curve/BezierCurve";
import StraightLine from "../../../vox/geom/StraightLine";
import {PathKeyNode} from "./PathKeyNode";
import {TVTool} from "./TVTool";

/**
 * bezier2 module
 */
class Bezier2Module {
    version: number = -1;
    private m_posTable: Vector3D[][] = [];
    private m_tvTool: TVTool = new TVTool();
    readonly bezier2Curve: Bezier2Curve = new Bezier2Curve();
    stepDistance: number = 30;
    pathClosed: boolean = false;
    constructor() {
    }
    setBezierCurveSegTotal(segTotal: number): void {
        this.bezier2Curve.setSegTot(segTotal);
    }
    calcSegCurve2(pv0: Vector3D, pv1: Vector3D, ctrlV: Vector3D): void {

        this.bezier2Curve.begin.copyFrom(pv0);
        this.bezier2Curve.end.copyFrom(pv1);
        this.bezier2Curve.ctrPos.copyFrom(ctrlV);
        this.bezier2Curve.updateCalc();

        let posList: Vector3D[] = this.bezier2Curve.getPosList();
        if (this.m_posTable.length > 0) {
            let list: Vector3D[] = this.m_posTable[this.m_posTable.length - 1];
            if (Vector3D.Distance(list[list.length - 1], posList[0]) < 0.0001) {
                list.pop();
            }
        }
        this.m_posTable.push(posList);
    }
    buildPathCurveData(list: Vector3D[], closePath: boolean, minDis: number): Vector3D[] {
        let curvePosList: Vector3D[] = null;
        if (list.length > 2) {
            let v0: Vector3D = null;
            let v1: Vector3D = null;
            let va: Vector3D = new Vector3D();
            let ve: Vector3D = new Vector3D();
            let dis: number = Vector3D.Distance(list[0], list[list.length - 1]);
            if (closePath && list.length > 3 && dis < minDis) {
                if (dis > 0.001) {
                    list.push(list[0]);
                }
            }
            else if (closePath) {
                //console.warn("the path can not be closed !");
                closePath = false;
            }
            
            let tvList: Vector3D[] = [];
            let posTable: Vector3D[][] = [];
            this.m_posTable = [];
            posTable = this.m_posTable;
            for (let i: number = 2; i < list.length; ++i) {
                this.m_tvTool.calc(list[i - 2], list[i - 1], list[i]);
                let ptv: Vector3D = this.m_tvTool.tv.clone();
                tvList.push(ptv);
            }

            // the first seg
            if (closePath && list.length > 4) {
                this.m_tvTool.calc(list[list.length - 2], list[0], list[1]);
                //let tv: Vector3D = new Vector3D();
                // 求交点
                StraightLine.IntersectionCopSLV2(list[0], this.m_tvTool.tv, list[1], tvList[0], ve);
            }
            else {
                ve.copyFrom(tvList[0]);
                va.subVecsTo(list[1], list[0]);
                ve.scaleBy(va.getLength() * 0.5);
                ve.addBy(list[1]);
            }
            this.calcSegCurve2(list[0], list[1], ve);

            // middle segs
            let k: number = 0;
            for (let i: number = 2; i < (list.length - 1); ++i) {
                v0 = list[i - 1];
                v1 = list[i];
                let tv0: Vector3D = tvList[k];
                let tv1: Vector3D = tvList[k + 1];

                // 求交点
                if (Vector3D.RadianBetween(tv0, tv1) > 0.0001) {
                    StraightLine.IntersectionCopSLV2(v0, tv0, v1, tv1, ve);
                }
                else {
                    ve.copyFrom(tv0);
                    va.subVecsTo(v0, v1);
                    ve.scaleBy(va.getLength() * -0.5);
                    ve.addBy(v0);
                    console.log(i, "， Vector3D.RadianBetween(tv0,tv1): ", Vector3D.RadianBetween(tv0, tv1));
                    console.log(i, "， tv0,tv1: ", tv0, tv1);
                    console.log(i, "， 交点， ve: ", ve);
                }
                // 计算曲线数据
                this.calcSegCurve2(v0, v1, ve);
                k += 1;
            }

            // the last seg
            if (closePath && list.length > 4) {
                this.m_tvTool.calc(list[list.length - 2], list[0], list[1]);
                // 求交点
                StraightLine.IntersectionCopSLV2(list[0], this.m_tvTool.tv, list[list.length - 2], tvList[tvList.length - 1], ve);
            }
            else {
                ve.copyFrom(tvList[tvList.length - 1]);
                va.subVecsTo(list[list.length - 1], list[list.length - 2]);
                ve.scaleBy(va.getLength() * -0.5);
                ve.addBy(list[list.length - 2]);
            }
            this.calcSegCurve2(list[list.length - 2], list[list.length - 1], ve);


            let total: number = 0;
            for (let i: number = 0; i < posTable.length; ++i) {
                total += posTable[i].length;
            }
            curvePosList = new Array(total);
            k = 0;
            for (let i: number = 0; i < posTable.length; ++i) {
                list = posTable[i];
                for (let j: number = 0; j < list.length; ++j) {
                    curvePosList[k] = list[j];
                    k++;
                }
            }
            return curvePosList;
        }
        else if (list.length == 2) {
            return list;
        }
        return [];
    }
}

export { Bezier2Module };