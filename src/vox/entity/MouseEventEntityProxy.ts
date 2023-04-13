/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import MouseEvent from "../../vox/event/MouseEvent";
import MouseEvt3DDispatcher from "../../vox/event/MouseEvt3DDispatcher";
import IRenderEntityBase from "../render/IRenderEntityBase";

export default class MouseEventEntityProxy {

    private m_dispatcher = new MouseEvt3DDispatcher();
    private m_entityDispatcher: MouseEvt3DDispatcher = null;
    private m_target: IRenderEntityBase = null;
    constructor(target: IRenderEntityBase = null) {
		this.setTarget(target);
    }
    setTarget(target: IRenderEntityBase): void {
        if (target != this.m_target) {
            if(this.m_target) {
                (this.m_target as any).setEvtDispatcher( null );
                this.m_target.mouseEnabled = false;
            }
            this.m_target = target;
            if(this.m_target) {
                this.initMouseEvt();
            }
        }
    }
    addEventListener(type: number, listener: any, func: (evt: any) => void, captureEnabled: boolean = true, bubbleEnabled: boolean = false): void {
        this.m_dispatcher.addEventListener(type, listener, func, captureEnabled, bubbleEnabled);
    }
    removeEventListener(type: number, listener: any, func: (evt: any) => void): void {
        this.m_dispatcher.removeEventListener(type, listener, func);
    }
    protected mousEvtListener(evt: any): void {
        this.m_dispatcher.dispatchEvt(evt);
    }

    private initMouseEvt(): void {

        this.m_target.mouseEnabled = true;
        if(this.m_entityDispatcher == null) {
			const me = MouseEvent;
            let dispatcher = new MouseEvt3DDispatcher();
            dispatcher.addEventListener(me.MOUSE_DOWN, this, this.mousEvtListener);
            dispatcher.addEventListener(me.MOUSE_UP, this, this.mousEvtListener);
            dispatcher.addEventListener(me.MOUSE_CLICK, this, this.mousEvtListener);
            dispatcher.addEventListener(me.MOUSE_DOUBLE_CLICK, this, this.mousEvtListener);
            dispatcher.addEventListener(me.MOUSE_OVER, this, this.mousEvtListener);
            dispatcher.addEventListener(me.MOUSE_OUT, this, this.mousEvtListener);
            this.m_entityDispatcher = dispatcher;
        }
        (this.m_target as any).setEvtDispatcher(this.m_entityDispatcher);
    }

}
