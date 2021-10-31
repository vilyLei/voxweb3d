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
    private m_tvTool: TVTool = new TVTool();
    readonly bezier3Curve: Bezier3Curve = new Bezier3Curve();

    pathClosed: boolean = false;
    version: number = -1;
    stepDistance: number = 20;
    constructor() {
        this.bezier3Curve.setSegTot(10);
    }
    setBezierCurveSegTotal(segTotal: number): void {
        this.bezier3Curve.setSegTot(segTotal);
    }
    calcSegCurve(pv0: Vector3D, pv1: Vector3D, ctrlA: Vector3D, ctrlB: Vector3D): void {
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
        if(total != currTotal) {
            this.bezier3Curve.setSegTot( currTotal );
            this.bezier3Curve.updateCalc();
        }
        
        let posList: Pos3D[] = Pos3DPool.CreateList(this.bezier3Curve.getPosTotal());
        this.bezier3Curve.getPosList( posList );

        if (this.m_posTable.length > 0) {
            let list: Pos3D[] = this.m_posTable[this.m_posTable.length - 1];
            if (Vector3D.Distance(list[list.length - 1], posList[0]) < 0.0001) {
                let pv: Pos3D = list.pop();
                Pos3DPool.Restore( pv );
            }
        }
        this.m_posTable.push(posList);
    }
    private m_tempV0: Vector3D = new Vector3D();
    private m_tempV1: Vector3D = new Vector3D();
    private m_tempV2: Vector3D = new Vector3D();

    private clacPosTVAt(index: number, nodeList: PathKeyNode[], pathClosed: boolean, freeze: boolean = false): void {

        let node: PathKeyNode = nodeList[index];
        freeze = node.curvationFreeze || freeze;
        //let total: number = nodeList.length;
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
        //
        this.m_tempV1.copyFrom(tv1);
        this.m_tempV1.scaleBy(dis * node1.positiveCtrlFactor);
        this.m_tempV1.addBy(v1);
        // 计算曲线数据
        this.stepDistance = node0.stepDistance;
        this.calcSegCurve(v0, v1, this.m_tempV2, this.m_tempV1);
    }
    private m_curvePosList: Pos3D[] = null;
    buildPathCurveData(list: Pos3D[], closePath: boolean, nodeList: PathKeyNode[]): Pos3D[] {

        closePath = closePath && list.length >= 3;

        this.pathClosed = closePath;
        if (list.length > 2) {
            let curvePosList: Pos3D[] = null;
            // 如果这个 closePath 值为 true, 则表示需要最后一个位置点要与第一个点建立曲线链接
            
            let pathClosed: boolean = closePath;
            
            //  console.log("XXXX pathClosed: ",pathClosed, list.length);
            let posTable: Pos3D[][] = [];
            this.m_posTable = [];
            posTable = this.m_posTable;

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
                posTable[i] = [];
            }
            this.m_curvePosList = curvePosList;
            return curvePosList;
        }
        else if (list.length == 2) {
            return list;
        }
        return [];
    }
}

export { Bezier3Module };