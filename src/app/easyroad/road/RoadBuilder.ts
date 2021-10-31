
import {RoadPath} from "./RoadPath";

/**
 * only road data builder
 */
class RoadBuilder {

    private m_pathList:RoadPath[] = [];

    constructor() { }
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