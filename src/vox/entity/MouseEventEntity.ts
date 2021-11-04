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

export default class MouseEventEntity extends DisplayEntity {

    private m_dispatcher: MouseEvt3DDispatcher = null;
    constructor(transform: ROTransform = null) {
        super(transform);
        this.initializeEvent();
    }

    addEventListener(type: number, listener: any, func: (evt: any) => void, captureEnabled: boolean = true, bubbleEnabled: boolean = false): void {
        this.m_dispatcher.addEventListener(type, listener, func, captureEnabled, bubbleEnabled);
    }
    removeEventListener(type: number, listener: any, func: (evt: any) => void): void {
        this.m_dispatcher.removeEventListener(type, listener, func);
    }

    protected initializeEvent(): void {

        this.mouseEnabled = true;
        if(this.m_dispatcher == null) {
            this.m_dispatcher = new MouseEvt3DDispatcher();
            this.setEvtDispatcher(this.m_dispatcher);
        }
    }
    destroy(): void {
        super.destroy();
        if(this.m_dispatcher != null) {
            this.m_dispatcher.destroy();
            this.m_dispatcher = null;
        }
    }

}