
import {RoadPath} from "./RoadPath";
//import {Bezier3Curve} from "../../vox/geom/curve/BezierCurve";
// import EngineBase from "../../vox/engine/EngineBase";

/**
 * only road data builder
 */
class RoadBuilder {

    private m_pathList:RoadPath[] = [];

    constructor() { }
    // initializeByBezier(bezier3: Bezier3Curve): void {
    // }
    // private m_engine: EngineBase = null;
    // initialize(engine: EngineBase): void {
    //     if (this.m_engine == null) {
    //         this.m_engine = engine;
    //     }
    // }
    appendPath(): RoadPath {
        let rp: RoadPath = new RoadPath();
        this.m_pathList.push(rp);
        return rp;
    }
    getPathAt(i: number): RoadPath {
        return this.m_pathList[i];
    }
    getPathTotal(): number {
        return this.m_pathList.length;
    }

    update(): void {
    }
}

export {RoadBuilder};