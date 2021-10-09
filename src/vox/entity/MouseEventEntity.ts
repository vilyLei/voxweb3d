/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ROTransform from "../../vox/display/ROTransform";
import DisplayEntity from "../../vox/entity/DisplayEntity";
import MouseEvent from "../../vox/event/MouseEvent";
import MouseEvt3DDispatcher from "../../vox/event/MouseEvt3DDispatcher";

export default class MouseEventEntity extends DisplayEntity{

    private m_dispatcher: MouseEvt3DDispatcher = new MouseEvt3DDispatcher();
    constructor(transform:ROTransform = null)
    {
        super(transform);
        this.initMouseEvt();
    }

    addEventListener(type: number, listener: any, func: (evt: any) => void, captureEnabled: boolean = true, bubbleEnabled: boolean = false): void {
        this.m_dispatcher.addEventListener(type, listener, func, captureEnabled, bubbleEnabled);
    }
    removeEventListener(type: number, listener: any, func: (evt: any) => void): void {
        this.m_dispatcher.removeEventListener(type, listener, func);
    }
    protected mouseOverListener(evt: any): void {
        this.m_dispatcher.dispatchEvt(evt);
    }
    protected mouseOutListener(evt: any): void {
        this.m_dispatcher.dispatchEvt(evt);
    }
    protected mouseDownListener(evt: any): void {
        this.m_dispatcher.dispatchEvt(evt);
    }
    protected mouseUpListener(evt: any): void {
        this.m_dispatcher.dispatchEvt(evt);
    }
    protected mouseClickListener(evt: any): void {
        this.m_dispatcher.dispatchEvt(evt);
    }

    private initMouseEvt(): void {

        this.mouseEnabled = true;

        let dispatcher: MouseEvt3DDispatcher = new MouseEvt3DDispatcher();
        dispatcher.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDownListener);
        dispatcher.addEventListener(MouseEvent.MOUSE_UP, this, this.mouseUpListener);
        dispatcher.addEventListener(MouseEvent.MOUSE_CLICK, this, this.mouseClickListener);
        dispatcher.addEventListener(MouseEvent.MOUSE_OVER, this, this.mouseOverListener);
        dispatcher.addEventListener(MouseEvent.MOUSE_OUT, this, this.mouseOutListener);
        this.setEvtDispatcher(dispatcher);
    }

}