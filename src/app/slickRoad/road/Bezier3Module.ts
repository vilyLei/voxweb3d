import Vector3D from "../../../vox/math/Vector3D";
import { Bezier2Curve, Bezier3Curve } from "../../../vox/geom/curve/BezierCurve";
import {KeyNodeStatus, PathKeyNode} from "./PathKeyNode";
import {TVTool} from "./TVTool";
import { Pos3DPool } from "../base/Pos3DPool";
import { Pos3D } from "../base/Pos3D";

/**
 * bezier3 module
 */
class Bezier3Module {
    
    private m_posTable: Pos3D[][] = [];
    private m_radiusTable: number[][] = [];
    private m_tvTool: TVTool = new TVTool();
    private m_direcTV: Vector3D = new Vector3D();
    private m_direcNV: Vector3D = new Vector3D();
    private m_currSegsTotal: number = 1;
    readonly bezier3Curve: Bezier3Curve = new Bezier3Curve();
    readonly bezier2Curve: Bezier2Curve = new Bezier2Curve();
    /**
     * 路径是否为闭合状态
     */
    pathClosed: boolean = false;
    version: number = -1;
    /**
     * 分段估算长度
     */
    stepDistance: number = 20;
    constructor() {
        this.bezier3Curve.setSegTot(10);
    }
    setBezierCurveSegTotal(segTotal: number): void {
        this.bezier3Curve.setSegTot(segTotal);
    }
    /**
	 * 计算二次Bezier曲线
	 * */
	static CalcBezier2Y(vs: number[], tot: number, v0: Vector3D, v1: Vector3D, v2: Vector3D): void {
        //b(t) = (1-t)*(1-t)*p0 + 2*t*(1-t)*p1 + t * t * p2;
        
		let py: number = 0;
        let k: number = 0;
        if(vs.length < (tot + 1)) {
            for (let i: number = 0; i <= tot; ++i) {
                
                k = i / tot;
                py = (1.0 - k) * (1.0 - k) * v0.y + 2 * k * (1.0 - k) * v1.y + k * k * v2.y;
                vs.push(py);
            }
        }
        else {            
            for (let i: number = 0; i <= tot; ++i) {
                
                k = i / tot;
                py = (1.0 - k) * (1.0 - k) * v0.y + 2 * k * (1.0 - k) * v1.y + k * k * v2.y;
                vs[i] = py;
            }
        }
	}
    getCurveRadiusList(node0: PathKeyNode, node1: PathKeyNode, total: number): number[] {

        let factor: number = node0.pathRadiusChangeFactor;
        let amplitude: number = node0.pathRadiusChangeAmplitude;
        
        let y0: number = node0.pathRadius;
        let y1: number = node1.pathRadius;
        let dy: number = Math.abs(y1 - y0);
        this.bezier2Curve.begin.setXYZ(0, y0, 0);
        this.bezier2Curve.end.setXYZ(dy + 1.0, y1, 0);
        //this.bezier2Curve.setSegTot(total);

        let dis: number = Vector3D.Distance(this.bezier2Curve.begin, this.bezier2Curve.end);
        let direcTV = this.m_direcTV;
        direcTV.subVecsTo(this.bezier2Curve.end, this.bezier2Curve.begin);
        let direcNV = this.m_direcNV;
        direcNV.setXYZ(-direcTV.y, direcTV.x, 0.0);
        direcNV.normalize();
        direcNV.scaleBy(amplitude * dy);

        direcTV.normalize();
        direcTV.scaleBy(dis * factor);
        this.bezier2Curve.ctrPos.addVecsTo(direcTV, this.bezier2Curve.begin);
        this.bezier2Curve.ctrPos.addBy(direcNV);

        let vs: number[] = [];
        Bezier3Module.CalcBezier2Y(vs, total,  this.bezier2Curve.begin, this.bezier2Curve.ctrPos, this.bezier2Curve.end);
        return vs;

    }
    calcSegCurve(pv0: Vector3D, pv1: Vector3D, ctrlA: Vector3D, ctrlB: Vector3D): Pos3D[] {

        let dis: number = Vector3D.Distance(this.bezier3Curve.begin,this.bezier3Curve.end);
        let total: number = Math.floor(dis / this.stepDistance);
        this.bezier3Curve.setSegTot( total );
        this.bezier3Curve.begin.copyFrom(pv0);
        this.bezier3Curve.end.copyFrom(pv1);
        this.bezier3Curve.ctrAPos.copyFrom(ctrlA);
        this.bezier3Curve.ctrBPos.copyFrom(ctrlB);
        this.bezier3Curve.updateCalc();
        dis = this.bezier3Curve.getCurveDistance();
        let currTotal = Math.floor(dis / this.stepDistance);
        if(currTotal < 3) {
            currTotal = 3;
        }
        this.m_currSegsTotal = currTotal;
        if(total != currTotal) {
            this.bezier3Curve.setSegTot( currTotal );
            this.bezier3Curve.updateCalc();
        }
        
        let posList: Pos3D[] = Pos3DPool.CreateList(this.bezier3Curve.getPosTotal());
        this.bezier3Curve.getPosList( posList );

        // if (this.m_posTable.length > 0) {
        //     let list: Pos3D[] = this.m_posTable[this.m_posTable.length - 1];
        //     if (Vector3D.Distance(list[list.length - 1], posList[0]) < 0.0001) {
        //         let pv: Pos3D = list.pop();
        //         Pos3DPool.Restore( pv );
        //     }
        // }
        // this.m_posTable.push(posList);
        return posList;
    }
    private m_tempV0: Vector3D = new Vector3D();
    private m_tempV1: Vector3D = new Vector3D();
    private m_tempV2: Vector3D = new Vector3D();

    private clacPosTVAt(index: number, nodeList: PathKeyNode[], pathClosed: boolean): void {

        let node: PathKeyNode = nodeList[index];
        let freeze: boolean = node.curvationFreeze;
        
        let maxIndex: number = nodeList.length - 1;
        let prevPos: Vector3D;
        let nextPos: Vector3D;
        let currPos: Vector3D = nodeList[index].pos;
        if(index == 0) {
            if(pathClosed) {

                if(freeze) {
                    if(node.status == KeyNodeStatus.Freeze) {
                        return;
                    }
                    node.status = KeyNodeStatus.Freeze;    
                }
                prevPos = nodeList[maxIndex].pos;
            }
            else {
                if(freeze) {
                    if(node.status == KeyNodeStatus.Normal) {
                        return;
                    }
                    node.status = KeyNodeStatus.Normal;
                }

                //this.m_tempV0.subVecsTo( nodeList[index + 1].pos, nodeList[index].pos );
                this.m_tempV0.subVecsTo( nodeList[index].pos, nodeList[index + 1].pos );
                this.m_tempV0.normalize();
                node.tv.copyFrom( this.m_tempV0 );
                return;
                prevPos = this.m_tempV0;
            }
            nextPos = nodeList[index + 1].pos;
            //console.log("prevPos, currPos, nextPos: ",prevPos, currPos, nextPos);
        }
        else if(index == maxIndex) {
            prevPos = nodeList[index - 1].pos;
            if(pathClosed) {
                if(freeze) {
                    if(node.status == KeyNodeStatus.Freeze) {
                        return;
                    }
                    node.status = KeyNodeStatus.Freeze;
                }

                nextPos = nodeList[0].pos;
            }
            else {
                if(freeze) {
                    if(node.status == KeyNodeStatus.Normal) {
                        return;
                    }
                    node.status = KeyNodeStatus.Normal;
                }

                //this.m_tempV0.subVecsTo( nodeList[index].pos, nodeList[index - 1].pos );
                this.m_tempV0.subVecsTo( nodeList[index - 1].pos, nodeList[index].pos );
                this.m_tempV0.normalize();
                node.tv.copyFrom( this.m_tempV0 );
                return;
                nextPos = this.m_tempV0;
            }
        }
        else {
            if(freeze) {
                if(node.status == KeyNodeStatus.Normal) {
                    return;
                }
                node.status = KeyNodeStatus.Normal;
            }

            prevPos = nodeList[index - 1].pos;
            nextPos = nodeList[index + 1].pos;
        }
        this.m_tvTool.calc(prevPos, currPos, nextPos);
        //console.log(index, ", this.m_tvTool.tv: ",this.m_tvTool.tv);
        node.tv.copyFrom( this.m_tvTool.tv );

    }
    private buidSubCurve(index: number, nodeList: PathKeyNode[], pathClosed: boolean): void {
        
        let maxIndex: number = nodeList.length - 1;
        
        let node0: PathKeyNode = nodeList[index];
        let node1: PathKeyNode;
        if(index < maxIndex) {
            node1 = nodeList[index + 1];
        }
        else {
            if( pathClosed ) {
                node1 = nodeList[0];
            }
            else {
                return;
            }
        }
        let v0 = node0.pos;
        let v1 = node1.pos;
        let tv0: Vector3D = node0.tv;
        let tv1: Vector3D = node1.tv;
        this.m_tempV0.subVecsTo(v0, v1);
        let dis: number = this.m_tempV0.getLength();// * 0.3;
        this.m_tempV2.copyFrom(tv0);
        this.m_tempV2.scaleBy(-dis * node0.negativeCtrlFactor);
        this.m_tempV2.addBy(v0);
        
        // console.log("tv0,tv1: ",tv0,tv1);
        this.m_tempV1.copyFrom(tv1);
        this.m_tempV1.scaleBy(dis * node1.positiveCtrlFactor);
        this.m_tempV1.addBy(v1);
        
        let flag: boolean = false;
        // 计算曲线数据
        this.stepDistance = node0.stepDistance;        
        let posList: Pos3D[] = this.calcSegCurve(v0, v1, this.m_tempV2, this.m_tempV1);
        // 整合位置数据
        if (this.m_posTable.length > 0) {
            let list: Pos3D[] = this.m_posTable[this.m_posTable.length - 1];
            if (Vector3D.Distance(list[list.length - 1], posList[0]) < 0.0001) {
                let pv: Pos3D = list.pop();
                Pos3DPool.Restore( pv );
                flag = true;
            }
        }
        this.m_posTable.push(posList);
        // 计算并整合半径(半宽)数据
        let radius_vs: number[] = this.getCurveRadiusList(node0, node1, this.m_currSegsTotal);
        if (flag && this.m_radiusTable.length > 0) {
            let list: number[] = this.m_radiusTable[this.m_radiusTable.length - 1];
            list.pop();
        }
        this.m_radiusTable.push(radius_vs);
    }

    getPathRadiusTable(): number[][] {
        return this.m_radiusTable;
    }
    getPathCurvePosTable(): Pos3D[][] {
        return this.m_posTable;
    }
    private m_curvePosList: Pos3D[] = null;
    buildPathCurveData(list: Pos3D[], closePath: boolean, nodeList: PathKeyNode[]): Pos3D[] {

        closePath = closePath && list.length >= 3;

        this.pathClosed = closePath;
        if (list.length > 2) {
            let curvePosList: Pos3D[] = null;
            // 如果这个 closePath 值为 true, 则表示需要最后一个位置点要与第一个点建立曲线链接
            let pathClosed: boolean = closePath;    

            // 清理半径数据
            for (let i: number = 0; i < this.m_radiusTable.length; ++i) {                
                this.m_radiusTable[i] = [];
            }
            this.m_radiusTable = [];

            // 清理位置数据
            for (let i: number = 0; i < this.m_posTable.length; ++i) {                
                this.m_posTable[i] = [];
            }
            
            this.m_posTable = [];
            let posTable: Pos3D[][] = this.m_posTable;

            for (let i: number = 0; i < nodeList.length; ++i) {
                this.clacPosTVAt(i, nodeList, pathClosed);
            }
            let curveSegsTot: number = pathClosed ? nodeList.length : nodeList.length - 1;
            for (let i: number = 0; i < curveSegsTot; ++i) {
                this.buidSubCurve(i, nodeList, pathClosed);
            }

            let total: number = 0;
            for (let i: number = 0; i < posTable.length; ++i) {
                total += posTable[i].length;
            }
            if(this.m_curvePosList != null) {
                for (let i: number = 0; i < this.m_curvePosList.length; ++i) {
                    Pos3DPool.Restore( this.m_curvePosList[i] );
                }
            }
            curvePosList = new Array(total);

            // console.log("use bezierCurve3, total: ",total);
            let k: number = 0;
            for (let i: number = 0; i < posTable.length; ++i) {
                list = posTable[i];
                for (let j: number = 0; j < list.length; ++j) {
                    curvePosList[k] = list[j];
                    k++;
                }
                //posTable[i] = [];
            }
            this.m_curvePosList = curvePosList;
            return curvePosList;
        }
        else if (list.length == 2) {
            this.m_posTable = [list];
            return list;
        }
        this.m_posTable = [];
        return [];
    }
}

export { Bezier3Module };