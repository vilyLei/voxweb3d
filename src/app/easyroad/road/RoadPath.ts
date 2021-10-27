import Vector3D from "../../../vox/math/Vector3D";
import { PathKeyNode } from "./PathKeyNode";
import { TVTool } from "./TVTool";
import { Bezier3Module } from "./Bezier3Module";

/**
 * only road path path data
 */
class RoadPath {
    version: number = -1;
    private m_posList: Vector3D[] = null;
    private m_nodeList: PathKeyNode[] = null;
    private m_pathClosed: boolean = false;
    readonly bezier3Module: Bezier3Module = new Bezier3Module();
    stepDistance: number = 30;
    constructor() {
    }
    setBezierCurveSegTotal(segTotal: number): void {
        this.bezier3Module.setBezierCurveSegTotal(segTotal);
    }
    
    buildPathCurve(type: number = 3, closePathEnabled: boolean = false, minDis: number = 50): Vector3D[] {

        this.m_pathClosed = false;
        closePathEnabled = closePathEnabled && this.m_posList.length >= 4;

        let list: Vector3D[] = this.m_posList.slice(0);
        let curvePosList: Vector3D[] = null;
        if (type == 3) {
            this.bezier3Module.stepDistance = this.stepDistance;
            curvePosList = this.bezier3Module.buildPathCurveData(list, closePathEnabled, this.m_nodeList);
            this.m_pathClosed = this.bezier3Module.pathClosed;
        }
        else {
            //curvePosList = this.buildPathCurve2Data(list, closePathEnabled, minDis);
            throw Error("illegal operation");
        }

        return curvePosList;
    }
    
    clear(): void {
        this.m_posList = null;
        this.m_pathClosed = false;
    }
    initializePosList(posList: Vector3D[]): void {
        this.m_posList = posList.slice(0);
    }
    initialize(begin: Vector3D, end: Vector3D): void {

        this.m_posList = [begin.clone(), end.clone()];
    }
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
            this.m_posList = [pos];
            node.index = 0;
        }
    }
    appendPosAt(i: number, pos: Vector3D): void {

        let node: PathKeyNode = new PathKeyNode();
        node.pos.copyFrom(pos);
        if (this.m_posList != null) {
            if (i < this.m_posList.length) {
                this.m_nodeList.splice(1, i, node);
                this.m_posList.splice(1, i, node.pos);
                for(; i < this.m_nodeList.length; ++i) {
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
    getPosList(): Vector3D[] {
        return this.m_posList;
    }
    getPosListLength(): number {
        return this.m_posList != null ? this.m_posList.length : 0;
    }
    isClosed(): boolean {
        if (this.getPosListLength() > 3) {
            return this.m_pathClosed;
        }
        return false;
    }
    update(): void {
    }
}

export { TVTool, RoadPath };