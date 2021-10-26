import Vector3D from "../../vox/math/Vector3D";
import {Bezier2Curve, Bezier3Curve} from "../../vox/geom/curve/BezierCurve";
import StraightLine from "../../vox/geom/StraightLine";

class TVTool {
    
    va: Vector3D = new Vector3D();
    vb: Vector3D = new Vector3D();
    vc: Vector3D = new Vector3D();
    nv: Vector3D = new Vector3D();
    tv: Vector3D = new Vector3D();
    calc(v0: Vector3D, v1: Vector3D, v2: Vector3D): void {
        this.va.subVecsTo(v1, v0);
        this.vb.subVecsTo(v1, v2);
        this.vc.addVecsTo(this.va, this.vb);
        this.vc.normalize();
        Vector3D.Cross(this.va, this.vb, this.nv);
        this.nv.normalize();
        Vector3D.Cross(this.nv, this.vc, this.tv);
    }
}

class ExpandPathTool {
    
    expandXOZ(in_posList: Vector3D[], distance: number = 50.0, closed: boolean = false): Vector3D[] {
        //
        closed = closed && Vector3D.Distance(in_posList[in_posList.length - 1],in_posList[0]) < 0.001;

        let out_posList: Vector3D[] = new Array(in_posList.length);
        let tv: Vector3D = new Vector3D();
        let tv1: Vector3D = new Vector3D();
        let rv: Vector3D = new Vector3D();
        let pv: Vector3D = new Vector3D();
        let i: number = 0;
        let len: number = in_posList.length;
        if(closed) {
            len -= 1;
            let pa: Vector3D = null;
            let pb: Vector3D = null;
            let pc: Vector3D = null;
            for(; i < len; ++i) {
                
                pb = in_posList[i];
                if(i < 1) {
                    pa = in_posList[len - 1];
                    pc = in_posList[1];

                } else if(i < (len - 1)) {
                    pa = in_posList[i - 1];
                    pc = in_posList[i + 1];
                }
                else {
                    pa = in_posList[i - 1];
                    pc = in_posList[0];
                }
                tv.subVecsTo(pb,pa);
                //tv.normalize();
                Vector3D.Cross(Vector3D.Y_AXIS, tv, rv);

                tv.subVecsTo(pb, pa);
                tv.y = 0;
                tv.normalize();
                tv1.subVecsTo(pb, pc);
                tv1.y = 0;
                tv1.normalize();
                tv.addBy(tv1);
                tv.normalize();
                if(rv.dot(tv) < 0.0001) {
                    tv.scaleBy(-1);
                }
                rv.copyFrom(tv);

                pv.copyFrom( rv );
                pv.scaleBy( distance );
                pv.addBy(in_posList[i]);
                out_posList[i] = pv.clone();                
            }
            out_posList[len] = out_posList[0].clone();
        }else {
            for(; i < len; ++i) {
    
                if(i < 1) {
                    tv.subVecsTo(in_posList[i+1], in_posList[i]);
                    tv.normalize();
                    Vector3D.Cross(Vector3D.Y_AXIS, tv, rv);
                } else if(i < (len - 1)) {
                    tv.subVecsTo(in_posList[i], in_posList[i - 1]);
                    tv.normalize();
                    tv1.subVecsTo(in_posList[i], in_posList[i + 1]);
                    tv1.normalize();
                    tv.addBy(tv1);
                    tv.normalize();
                    rv.copyFrom(tv);
                }
                else {
                    tv.subVecsTo(in_posList[i], in_posList[i - 1]);
                    tv.normalize();
                    Vector3D.Cross(Vector3D.Y_AXIS, tv, rv);
                }
                pv.copyFrom( rv );
                pv.scaleBy( distance );
                pv.addBy(in_posList[i]);
                out_posList[i] = pv.clone();
            }
        }

        return out_posList;
    }
}

/**
 * only road path path data
 */
class RoadPath {
    private m_posList: Vector3D[] = null;
    private m_posTable: Vector3D[][] = [];
    private m_tvTool: TVTool = new TVTool();
    readonly bezier2Curve: Bezier2Curve = new Bezier2Curve();
    readonly bezier3Curve: Bezier3Curve = new Bezier3Curve();
    constructor() {
    }
    setBezierCurveSegTotal(segTotal: number): void {
        this.bezier2Curve.setSegTot( segTotal );
        this.bezier3Curve.setSegTot( segTotal );
    }
    private calcSegCurve2(pv0: Vector3D, pv1: Vector3D, ctrlV: Vector3D): void {
        
        this.bezier2Curve.begin.copyFrom( pv0 );
        this.bezier2Curve.end.copyFrom( pv1 );
        this.bezier2Curve.ctrPos.copyFrom( ctrlV );
        this.bezier2Curve.updateCalc();
        
        let posList: Vector3D[] = this.bezier3Curve.getPosList();
        if(this.m_posTable.length > 0) {
            let list: Vector3D[] = this.m_posTable[this.m_posTable.length - 1];
            if(Vector3D.Distance( list[list.length - 1], posList[0] ) < 0.0001 ) {
                list.pop();
            }
        }
        this.m_posTable.push( posList );
    }
    private calcSegCurve3(pv0: Vector3D, pv1: Vector3D, ctrlA: Vector3D, ctrlB: Vector3D): void {
        
        this.bezier3Curve.begin.copyFrom( pv0 );
        this.bezier3Curve.end.copyFrom( pv1 );
        this.bezier3Curve.ctrAPos.copyFrom( ctrlA );
        this.bezier3Curve.ctrBPos.copyFrom( ctrlB );
        this.bezier3Curve.updateCalc();
        let posList: Vector3D[] = this.bezier3Curve.getPosList();
        if(this.m_posTable.length > 0) {
            let list: Vector3D[] = this.m_posTable[this.m_posTable.length - 1];
            if(Vector3D.Distance( list[list.length - 1], posList[0] ) < 0.0001 ) {
                list.pop();
            }
        }
        this.m_posTable.push( posList );
    }
    buildPathCurve(type: number = 3,closePathEnabled: boolean = false, minDis: number = 50): Vector3D[] {

        let list: Vector3D[] = this.m_posList.slice(0);
        let curvePosList: Vector3D[] = null;
        if(type == 3) {
            curvePosList = this.buildPathCurve3Data(list, closePathEnabled, minDis);
        }
        else {
            curvePosList = this.buildPathCurve2Data(list, closePathEnabled, minDis);
        }

        return curvePosList;
    }
    private buildPathCurve3Data(list: Vector3D[], closePath: boolean, minDis: number): Vector3D[] {

        let curvePosList: Vector3D[] = null;
        if(list.length > 2) {

            let v0: Vector3D = null;
            let v1: Vector3D = null;
            let va: Vector3D = new Vector3D();
            let vb: Vector3D = new Vector3D();
            let ve: Vector3D = new Vector3D();
            let dis: number = Vector3D.Distance(list[0],list[list.length - 1]);

            if(closePath && list.length > 3 && dis < minDis) {
                if(dis > 0.001) {
                    list.push(list[0]);
                }
            }
            else if(closePath){
                //console.warn("the path can not be closed !");
                closePath = false;
            }

            let tvList: Vector3D[] = [];            
            let posTable: Vector3D[][] = [];
            this.m_posTable = [];
            posTable = this.m_posTable;
            for(let i: number = 2; i < list.length; ++i) {
                this.m_tvTool.calc(list[i - 2], list[i - 1], list[i]);
                let ptv: Vector3D = this.m_tvTool.tv.clone();
                tvList.push(ptv);
            }
            
            let tv: Vector3D = tvList[0];
            va.subVecsTo( list[1], list[0] );
            // the first seg
            if(closePath && list.length > 4) {
                this.m_tvTool.calc(list[list.length - 2], list[0], list[1]);
                tv = this.m_tvTool.tv;
                ve.copyFrom( tv );
                ve.scaleBy(va.getLength() * -0.3);
                ve.addBy( list[0] );

            }
            else {
                ve.copyFrom( tv );
                ve.scaleBy( va.getLength() * 0.3 );
                ve.addBy( list[1] );
                ve.subtractBy( list[0] );
                ve.normalize();
                ve.scaleBy(va.getLength() * 0.3);
                ve.addBy( list[0] );
            }
            
            vb.copyFrom(tvList[0]);
            vb.scaleBy(va.getLength() * 0.3);
            vb.addBy(list[1]);
            this.calcSegCurve3(list[0], list[1], ve, vb);

            // middle segs
            let k: number = 0;
            for(let i: number = 2; i < (list.length - 1); ++i) {

                v0 = list[i - 1];
                v1 = list[i];
                let tv0: Vector3D = tvList[k];
                let tv1: Vector3D = tvList[k+1];
                va.subVecsTo(v0, v1);
                ve.copyFrom(tv0);
                ve.scaleBy(va.getLength() * -0.3);
                ve.addBy(v0);

                vb.copyFrom( tv1 );
                vb.scaleBy( va.getLength() * 0.3 );
                vb.addBy( v1 );

                // 计算曲线数据
                this.calcSegCurve3(v0, v1, ve, vb);
                k += 1;
            }

            // the last seg
            v0 = list[list.length - 2];
            v1 = list[list.length - 1];
            tv = tvList[tvList.length - 1];
            
            ve.copyFrom(tv);
            va.subVecsTo(v1, v0);
            ve.scaleBy(va.getLength() * -0.3);
            ve.addBy(v0);

            if(closePath && list.length > 4) {
                this.m_tvTool.calc(list[list.length - 2], list[0], list[1]);
                tv = this.m_tvTool.tv;

                vb.copyFrom(tv);
                vb.scaleBy(va.getLength() * 0.3);
                vb.addBy(v1);
            }
            else {
                vb.copyFrom(ve);
                vb.subtractBy(v1);
                vb.normalize();
                vb.scaleBy(va.getLength() * 0.3);
                vb.addBy(v1);
            }
            this.calcSegCurve3(v0, v1, ve, vb);
            

            let total: number = 0;
            for(let i: number = 0; i < posTable.length; ++i) {
                total += posTable[i].length;
            }
            curvePosList = new Array(total);
            
            // console.log("use bezierCurve3, total: ",total);
            k = 0;
            for(let i: number = 0; i < posTable.length; ++i) {
                list = posTable[i];
                for(let j: number = 0; j < list.length; ++j) {
                    curvePosList[k] = list[j];
                    k++;
                }
            }
            return curvePosList;
        }
        else if(this.m_posList.length == 2) {
            return this.m_posList.slice(0);
        }
        return [];
    }
    private buildPathCurve2Data(list: Vector3D[], closePath: boolean, minDis: number): Vector3D[] {
        let curvePosList: Vector3D[] = null;
        if(list.length > 2) {
            let v0: Vector3D = null;
            let v1: Vector3D = null;
            let va: Vector3D = new Vector3D();
            let ve: Vector3D = new Vector3D();
            let dis: number = Vector3D.Distance(list[0],list[list.length - 1]);
            if(closePath && list.length > 3 && dis < minDis) {
                if(dis > 0.001) {
                    list.push(list[0]);
                }
            }
            else if(closePath){
                //console.warn("the path can not be closed !");
                closePath = false;
            }
            
            let tvList: Vector3D[] = [];            
            let posTable: Vector3D[][] = [];
            this.m_posTable = [];
            posTable = this.m_posTable;
            for(let i: number = 2; i < list.length; ++i) {
                this.m_tvTool.calc(list[i - 2], list[i - 1], list[i]);
                let ptv: Vector3D = this.m_tvTool.tv.clone();
                tvList.push(ptv);
            }
            
            // the first seg
            if(closePath && list.length > 4) {
                this.m_tvTool.calc(list[list.length - 2], list[0], list[1]);
                //let tv: Vector3D = new Vector3D();
                // 求交点
                StraightLine.IntersectionCopSLV2(list[0],this.m_tvTool.tv, list[1], tvList[0], ve);
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
            for(let i: number = 2; i < (list.length - 1); ++i) {
                v0 = list[i - 1];
                v1 = list[i];
                let tv0: Vector3D = tvList[k];
                let tv1: Vector3D = tvList[k+1];

                // 求交点
                if(Vector3D.RadianBetween(tv0,tv1) > 0.0001) {
                    StraightLine.IntersectionCopSLV2(v0,tv0, v1,tv1, ve);
                }
                else {
                    ve.copyFrom(tv0);
                    va.subVecsTo(v0,v1);
                    ve.scaleBy(va.getLength() * -0.5);
                    ve.addBy(v0);
                    console.log(i, "， Vector3D.RadianBetween(tv0,tv1): ",Vector3D.RadianBetween(tv0,tv1));
                    console.log(i, "， tv0,tv1: ",tv0,tv1);
                    console.log(i, "， 交点， ve: ",ve);
                }
                // 计算曲线数据
                this.calcSegCurve2(v0, v1, ve);
                k += 1;
            }

            // the last seg
            if(closePath && list.length > 4) {
                this.m_tvTool.calc(list[list.length - 2], list[0], list[1]);
                // 求交点
                StraightLine.IntersectionCopSLV2(list[0],this.m_tvTool.tv, list[list.length - 2], tvList[tvList.length - 1], ve);
            }
            else {
                ve.copyFrom(tvList[tvList.length - 1]);
                va.subVecsTo(list[list.length - 1], list[list.length - 2]);
                ve.scaleBy(va.getLength() * -0.5);
                ve.addBy(list[list.length - 2]);
            }
            this.calcSegCurve2(list[list.length - 2], list[list.length - 1], ve);
            

            let total: number = 0;
            for(let i: number = 0; i < posTable.length; ++i) {
                total += posTable[i].length;
            }
            curvePosList = new Array(total);
            k = 0;
            for(let i: number = 0; i < posTable.length; ++i) {
                list = posTable[i];
                for(let j: number = 0; j < list.length; ++j) {
                    curvePosList[k] = list[j];
                    k++;
                }
            }
            return curvePosList;
        }
        else if(this.m_posList.length == 2) {
            return this.m_posList.slice(0);
        }
        return [];
    }
    clear(): void {
        this.m_posList = null;
    }
    initializePosList(posList: Vector3D[]): void {
        this.m_posList = posList.slice(0);
    }
    initialize(begin: Vector3D, end: Vector3D): void {
        
        this.m_posList = [begin.clone(), end.clone()];
    }
    setPosAt(i: number, pos: Vector3D): void {
        if(this.m_posList != null) {
            if (this.m_posList.length > i) {
                this.m_posList[i].copyFrom(pos);
            }
            else {
                //console.error("there is no index " + i + ", the pos list length is " + this.m_posList.length);
                this.m_posList.push(pos.clone());
            }
        }
        else {
            this.m_posList = [pos.clone()];
        }
    }
    appendPosAt(i: number, pos: Vector3D): void {
        if(this.m_posList != null) {
            if(i < this.m_posList.length) {
                this.m_posList.splice(1, i, pos.clone());
            }
            else {
                this.m_posList.push(pos.clone());
            }
        }
        else {
            this.m_posList = [pos.clone()];
        }
    }
    appendPos(pos: Vector3D): void {
        if(this.m_posList != null) {
            this.m_posList.push(pos.clone());
        }
        else {
            this.m_posList = [pos.clone()];
        }
    }
    getPosList(): Vector3D[] {
        return this.m_posList;
    }
    getPosListLength(): number {
        return this.m_posList != null ? this.m_posList.length : 0;
    }
    testCloseSatus(minDis: number): boolean {
        if (this.m_posList != null) {
            let list: Vector3D[] = this.m_posList;
            if (this.m_posList.length > 3) {
                let dis: number = Vector3D.Distance( list[list.length - 1], list[0] );
                return dis < minDis;
            }
        }
        return false;
    }
    isClosed(): boolean {
        if (this.m_posList != null) {
            let list: Vector3D[] = this.m_posList;
            if (this.m_posList.length > 3) {
                let dis: number = Vector3D.Distance( list[list.length - 1], list[0] );
                return dis < 0.0001;
            }
        }
        return false;
    }
    update(): void {
    }
}

export { TVTool, ExpandPathTool, RoadPath };