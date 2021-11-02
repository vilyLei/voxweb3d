import Vector3D from "../../../vox/math/Vector3D";
import { PathKeyNode } from "./PathKeyNode";
import { TVTool } from "./TVTool";
import { Bezier3Module } from "./Bezier3Module";
import { Pos3DPool } from "../base/Pos3DPool";
import { Pos3D } from "../base/Pos3D";

/**
 * only road path path data
 */
class RoadPath {
    version: number = -1;
    private m_posList: Pos3D[] = null;
    private m_nodeList: PathKeyNode[] = null;
    private m_pathClosed: boolean = false;
    private m_curvePosList: Pos3D[] = null;
    readonly bezier3Module: Bezier3Module = new Bezier3Module();
    // stepDistance: number = 30;
    constructor() {
    }
    setBezierCurveSegTotal(segTotal: number): void {
        this.bezier3Module.setBezierCurveSegTotal(segTotal);
    }

    buildPathCurve(type: number = 3, closePathEnabled: boolean = false, minDis: number = 50): Pos3D[] {

        this.m_pathClosed = false;
        closePathEnabled = closePathEnabled && this.getCloseEnabled();

        let list: Pos3D[] = this.m_posList;
        let curvePosList: Pos3D[] = null;
        if (type == 3) {
            // this.bezier3Module.stepDistance = this.stepDistance;
            curvePosList = this.bezier3Module.buildPathCurveData(list, closePathEnabled, this.m_nodeList);
            this.m_pathClosed = this.bezier3Module.pathClosed;
        }
        else {
            //curvePosList = this.buildPathCurve2Data(list, closePathEnabled, minDis);
            throw Error("illegal operation");
        }
        this.m_curvePosList = curvePosList;
        return curvePosList;
    }
    /**
     * 获取曲线路径上的所有位置点对象的分段数据
     * @returns 曲线路径上的所有位置点对象的分段数据
     */
    getCurvePosTable(): Pos3D[][] {
        return this.bezier3Module.getPathPosTable();
    }
    /**
     * 获取曲线路径上的所有位置点对象
     * @returns 曲线路径上的所有位置点对象
     */
    getCurvePosList(): Pos3D[] {
        return this.m_curvePosList;
    }
    // initialize(begin: Vector3D, end: Vector3D): void {
    //     this.m_posList = [Pos3DPool.Create(), Pos3DPool.Create()];
    //     this.m_posList[0].copyFrom(begin);
    //     this.m_posList[1].copyFrom(end);
    // }
    setPosAt(i: number, pos: Vector3D): void {

        if (this.m_posList != null) {
            if (this.m_posList.length > i) {
                this.m_posList[i].copyFrom(pos);
            }
            else {
                //console.error("there is no index " + i + ", the pos list length is " + this.m_posList.length);
                let node: PathKeyNode = new PathKeyNode();
                node.pos.copyFrom(pos);
                this.m_nodeList.push(node);
                this.m_posList.push(node.pos);
            }
        }
        else {
            let node: PathKeyNode = new PathKeyNode();
            node.pos.copyFrom(pos);
            this.m_nodeList = [node];
            this.m_posList = [node.pos];
            node.index = 0;
        }
    }
    insertPosAt(i: number, pos: Vector3D): void {

        let node: PathKeyNode = new PathKeyNode();
        node.pos.copyFrom(pos);
        if (this.m_posList != null) {
            if (i < this.m_posList.length) {
                this.m_nodeList.splice(i, 0, node);
                this.m_posList.splice(i, 0, node.pos);
                for (; i < this.m_nodeList.length; ++i) {
                    this.m_nodeList[i].index = i;
                }
            }
            else {
                this.m_nodeList.push(node);
                this.m_posList.push(node.pos);
            }
        }
        else {
            this.m_nodeList = [node];
            this.m_posList = [node.pos];
            node.index = 0;
        }
    }
    deletePosAt(index: number): void {

        if (this.m_posList != null && index >= 0 && index < this.m_posList.length) {
            let node: PathKeyNode = this.m_nodeList[index];
            node.destroy();
            this.m_nodeList.splice(index, 1);
            this.m_posList.splice(index, 1);
            for (let i: number = index; i < this.m_nodeList.length; ++i) {
                this.m_nodeList[i].index = i;
            }
        }
    }
    appendPos(pos: Vector3D): void {

        let node: PathKeyNode = new PathKeyNode();
        node.pos.copyFrom(pos);
        if (this.m_posList != null) {
            this.m_nodeList.push(node);
            this.m_posList.push(node.pos);
            node.index = this.m_posList.length - 1;
        }
        else {
            this.m_nodeList = [node];
            this.m_posList = [node.pos];
            node.index = 0;
        }
    }
    getPosNodeList(): PathKeyNode[] {
        return this.m_nodeList;
    }
    getPosNodeAt(i: number): PathKeyNode {
        return this.m_nodeList[i];
    }
    getPosList(): Pos3D[] {
        return this.m_posList;
    }
    getPosListLength(): number {
        return this.m_posList != null ? this.m_posList.length : 0;
    }
    getCloseEnabled(): boolean {
        return this.getPosListLength() >= 3;
    }
    isClosed(): boolean {
        if (this.getPosListLength() >= 3) {
            return this.m_pathClosed;
        }
        return false;
    }

    clear(): void {

        if (this.m_posList != null) {
            this.m_posList = null;
            for (let i: number = 0; i < this.m_nodeList.length; ++i) {
                this.m_nodeList[i].destroy();
            }
            this.m_nodeList = null;
        }
        this.m_pathClosed = false;
    }
}

export { TVTool, RoadPath };