/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
import MouseEvent from "../../vox/event/MouseEvent";
import DisplayEntity from "../../vox/entity/DisplayEntity";
import MouseEvt3DDispatcher from "../../vox/event/MouseEvt3DDispatcher";
import ROTransform from "../../vox/display/ROTransform";
import {ISelectable} from "../../voxeditor/base/ISelectable";

/**
 * 在一个平面上拖动
 */
class EditableEntity extends DisplayEntity implements ISelectable {

    private m_selectable: boolean = false;
    private m_dispatcher: MouseEvt3DDispatcher = null;
    uuid: string = "EditableEntity";
    constructor(transform: ROTransform = null) {
        super(transform);
    }

    initializeEvent(): void {

        if(this.m_dispatcher == null) {
            this.m_dispatcher = new MouseEvt3DDispatcher();
            this.m_dispatcher.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDownListener);
            // this.m_dispatcher.addEventListener(MouseEvent.MOUSE_OVER,this,this.mouseOverListener);
            // this.m_dispatcher.addEventListener(MouseEvent.MOUSE_OUT,this,this.mouseOutListener);
            this.setEvtDispatcher(this.m_dispatcher);
        }
        this.mouseEnabled = true;
    }
    
    addEventListener(type: number, listener: any, func: (evt: any) => void, captureEnabled: boolean = true, bubbleEnabled: boolean = false): void {
        this.m_dispatcher.addEventListener(type, listener, func, captureEnabled, bubbleEnabled);
    }
    removeEventListener(type: number, listener: any, func: (evt: any) => void): void {
        this.m_dispatcher.removeEventListener(type, listener, func);
    }
    private mouseDownListener(evt: any): void {
        this.select();
    }
    isSelected(): boolean {
        return this.m_selectable;
    }
    select(): void {
        this.m_selectable = true;
    }
    deselect(): void {
        this.m_selectable = false;
    }
    destroy(): void {
        
        super.destroy();
        if(this.m_dispatcher != null) {
            this.m_dispatcher.destroy();
            this.m_dispatcher = null;
        }
    }
}

export {EditableEntity};