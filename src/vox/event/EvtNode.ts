import EventBase from "../../vox/event/EventBase";

export default class EvtNode {
    type: number = 0;
    private m_listeners: ((evt: any) => void)[] = [];
    private m_hosts: any[] = [];
    private m_phases: number[] = [];

    addListener(target: any, func: (evt: any) => void, phase: number): void {
        let i: number = this.m_hosts.length - 1;
        for (; i >= 0; --i) {
            if (target === this.m_hosts[i]) {
                break;
            }
        }
        if (i < 0) {
            this.m_hosts.push(target);
            this.m_listeners.push(func);
            this.m_phases.push(phase);
        }
    }
    removeListener(target: any, func: (evt: any) => void): void {
        let i: number = this.m_hosts.length - 1;
        for (; i >= 0; --i) {
            if (target === this.m_hosts[i]) {
                this.m_hosts.splice(i, 1);
                this.m_listeners.splice(i, 1);
                this.m_phases.splice(i, 1);
                break;
            }
        }
    }

    // @return      1 is send evt yes,0 is send evt no
    dispatch(evt: EventBase): number {
        let flag: number = 0;
        let len: number = this.m_hosts.length;
        for (let i: number = 0; i < len; ++i) {
            if (this.m_phases[i] < 1 || evt.phase == this.m_phases[i]) {
                this.m_listeners[i].call(this.m_hosts[i], evt);
                flag = 1;
            }
        }
        return flag;
    }
    //@return if the evt can be dispatched in this node,it returns 1,otherwise it returns 0
    passTestEvt(evt: EventBase): number {
        let len: number = this.m_hosts.length;
        for (let i: number = 0; i < len; ++i) {
            if (this.m_phases[i] < 1 || evt.phase == this.m_phases[i]) {
                return 1;
                break;
            }
        }
        return 0;
    }
    passTestPhase(phase: number): number {
        let len: number = this.m_hosts.length;
        for (let i: number = 0; i < len; ++i) {
            if (this.m_phases[i] < 1 || phase == this.m_phases[i]) {
                return 1;
                break;
            }
        }
        return 0;
    }
    destroy(): void {
        this.m_hosts = [];
        this.m_listeners = [];
        this.m_phases = [];
    }
}