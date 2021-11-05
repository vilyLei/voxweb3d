import EngineBase from "../../../vox/engine/EngineBase";
import { PathSegmentObject } from "./PathSegmentObject";
import { SegmentData } from "./segment/SegmentData";
import EventBaseDispatcher from "../../../vox/event/EventBaseDispatcher";
import SelectionEvent from "../../../vox/event/SelectionEvent";

class RoadSegObjectManager {

    private m_selectDispatcher: EventBaseDispatcher = new EventBaseDispatcher();
    constructor() { }

    private m_initFlag: boolean = true;
    private m_engine: EngineBase = null;
    private m_segList: PathSegmentObject[] = [];

    initialize(engine: EngineBase): void {

        if (this.m_initFlag) {
            this.m_engine = engine;
            this.m_initFlag = false;
        }
    }

    addEventListener(type: number, listener: any, func: (evt: any) => void): void {

        if (type == SelectionEvent.SELECT) {
            if (this.m_selectDispatcher != null) {
                this.m_selectDispatcher.addEventListener(type, listener, func);
            }
        }
    }
    removeEventListener(type: number, listener: any, func: (evt: any) => void): void {

        if (type == SelectionEvent.SELECT) {
            if (this.m_selectDispatcher != null) {
                this.m_selectDispatcher.removeEventListener(type, listener, func);
            }
        }
    }
    clear(): void {
        for (let i: number = 0; i < this.m_segList.length; ++i) {
            if (this.m_segList[i] != null) {
                this.m_segList[i].clear();
            }
        }
    }
    setWireframeEnabled(wireframeEnabled: boolean): void {
        for (let i: number = 0; i < this.m_segList.length; ++i) {
            if (this.m_segList[i] != null) {
                this.m_segList[i].setWireframeEnabled(wireframeEnabled);
            }
        }
    }
    /**
     * 取消选中
     * @param sendEvtEnabled 是否发送选中的事件。 如果不发送事件，则只会改变状态。
     */
    selectAt(i: number, sendEvtEnabled: boolean = false): void {
        if (this.m_segList[i] != null) {
            this.m_segList[i].select(sendEvtEnabled);
        }
    }

    /**
     * 取消选中
     * @param sendEvtEnabled 是否发送选中的事件。 如果不发送事件，则只会改变状态。
     */
    deselectAt(i: number, sendEvtEnabled: boolean = false): void {
        if (this.m_segList[i] != null) {
            this.m_segList[i].deselect(sendEvtEnabled);
        }
    }

    deselectAll(): void {
        for (let i: number = 0; i < this.m_segList.length; ++i) {
            if (this.m_segList[i] != null) {
                this.m_segList[i].deselect();
            }
        }
    }
    setMouseEnabled(mouseEnabled: boolean): void {
        for (let i: number = 0; i < this.m_segList.length; ++i) {
            if (this.m_segList[i] != null) {
                this.m_segList[i].setMouseEnabled(mouseEnabled);
            }
        }
    }
    getSegEntityObjectAt(i: number): PathSegmentObject {
        return this.m_segList[i];
    }
    fitSegList(dstLen: number, entitiesTotal: number): void {

        let srcLen: number = this.m_segList.length;
        let pathSeg: PathSegmentObject;
        let i: number;
        if (srcLen < dstLen) {
            // append
            for (i = srcLen; i < dstLen; ++i) {
                pathSeg = new PathSegmentObject();
                pathSeg.initialize(this.m_engine);
                pathSeg.createEntities(entitiesTotal);
                pathSeg.addEventListener(SelectionEvent.SELECT, this, this.selectListener);
                this.m_segList.push(pathSeg);
            }
        }
        else {
            // remove
            for (i = dstLen; i < srcLen; ++i) {
                pathSeg = this.m_segList.pop();
                pathSeg.removeEventListener(SelectionEvent.SELECT, this, this.selectListener);
                pathSeg.destroy();
            }
        }
        for (i = 0; i < this.m_segList.length; ++i) {
            this.m_segList[i].setSegIndex(i);
        }
    }
    getSegList(): PathSegmentObject[] {
        return this.m_segList;
    }
    private selectListener(evt: any): void {
        console.log("selectListener(), evt: ", evt);
        if (evt.type == SelectionEvent.SELECT) {
            this.m_selectDispatcher.dispatchEvt(evt);
        }
    }
    destroy(): void {
        if (this.m_selectDispatcher != null) {
            this.m_selectDispatcher.destroy();
            this.m_selectDispatcher = null;
        }
    }
}

export { RoadSegObjectManager };