/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import MouseEvent from "../../vox/event/MouseEvent";
import EvtNode from "../../vox/event/EvtNode";
import IEvtDispatcher from "../../vox/event/IEvtDispatcher";

export default class MouseEvt3DDispatcher implements IEvtDispatcher {
    private m_evtNodes: EvtNode[] = null;
    private m_evtNodesLen: number = 24;
    uuid: string = "";
    data: any = null;
    currentTarget: any = null;
    enabled: boolean = true;
    constructor() {
        this.m_evtNodesLen = MouseEvent.GetMouseEvtTypeValuesTotal();
        this.m_evtNodes = new Array(this.m_evtNodesLen);
    }
    getClassType(): number {
        return MouseEvent.EventClassType;
    }
    destroy(): void {
        console.log("VVVVVVVVVV this.m_evtNodesLen: ",this.m_evtNodesLen);
        for (let i: number = 0; i < this.m_evtNodesLen; ++i) {
            if(this.m_evtNodes[i] != null) {
                this.m_evtNodes[i].destroy();
            }
        }
        this.data = null;
        this.currentTarget = null;
    }
    // @return      1 is send evt yes,0 is send evt no
    dispatchEvt(evt: any): number {
        if (this.enabled && evt != null) {
            if(this.uuid != "") evt.uuid = this.uuid;
            if(this.data != null) evt.data = this.data;
            if(this.currentTarget != null) evt.currentTarget = this.currentTarget;
            let t = evt.type - MouseEvent.GetMouseEvtTypeValueBase();
            if (t >= 0 && t < MouseEvent.GetMouseEvtTypeValuesTotal()) {
                
                if (this.m_evtNodes[t] != null) return this.m_evtNodes[t].dispatch(evt);
            }
            else {
                console.log("MouseEvt3DDispatcher::dispatchEvt(), Warn: undefined Event type.");
            }
        }
        return 0;
    }

    //@return if the evt can be dispatched in this node,it returns 1,otherwise it returns 0
    passTestEvt(evt: MouseEvent): number {
        if (evt != null) {
            let t: number = evt.type - MouseEvent.GetMouseEvtTypeValueBase();
            if (t >= 0 && t < MouseEvent.GetMouseEvtTypeValuesTotal()) {
                return this.m_evtNodes[t].passTestEvt(evt);
            }
        }
        return 0;
    }
    //@return if the evt phase is in this node,it returns 1,otherwise it returns 0
    passTestPhase(phase: number): number {
        let len: number = MouseEvent.GetMouseEvtTypeValuesTotal();
        for (let i: number = 0; i < len; ++i) {
            if (this.m_evtNodes[i] != null && this.m_evtNodes[i].passTestPhase(phase) == 1) {
                return 1;
            }
        }
        return 0;
    }
    // 注意: 一个 target 只能有一个回调函授对应一个类型的事件
    addEventListener(type: number, target: any, func: (evt: any) => void, captureEnabled: boolean = true, bubbleEnabled: boolean = false): void {
        if (func != null && target != null) {
            let t: number = type - MouseEvent.GetMouseEvtTypeValueBase();
            if (t >= 0 && t < MouseEvent.GetMouseEvtTypeValuesTotal()) {
                //(capture phase),2(bubble phase)
                let phase: number = 0;
                if (captureEnabled != bubbleEnabled) {
                    if (captureEnabled) {
                        phase = 1;
                    }
                    else {
                        phase = 2;
                    }
                }
                if (this.m_evtNodes[t] != null) {
                    this.m_evtNodes[t].addListener(target, func, phase);
                }
                else {
                    this.m_evtNodes[t] = new EvtNode();
                    this.m_evtNodes[t].addListener(target, func, phase);
                }
            }
            else {
                console.log("MouseEvt3DDispatcher::addEventListener(), Warn: undefined Event type.");
            }
        }
    }
    removeEventListener(type: number, target: any, func: (evt: any) => void): void {
        if (func != null && target != null) {
            let t: number = type - MouseEvent.GetMouseEvtTypeValueBase();
            if (t >= 0 && t < MouseEvent.GetMouseEvtTypeValuesTotal()) {
                if (this.m_evtNodes[t] != null)
                {
                    this.m_evtNodes[t].removeListener(target, func);
                }
            }
            //  else
            //  {
            //      console.log("MouseEvt3DDispatcher::removeEventListener(), Warn: undefined Event type.");
            //  }
        }
    }
}