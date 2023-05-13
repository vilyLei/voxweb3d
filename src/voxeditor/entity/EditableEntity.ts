/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
import MouseEvent from "../../vox/event/MouseEvent";
import ROTransform from "../../vox/display/ROTransform";
import {ISelectable} from "../../voxeditor/base/ISelectable";
import MouseEventEntity from "../../vox/entity/MouseEventEntity";
import EventBaseDispatcher from "../../vox/event/EventBaseDispatcher";
import SelectionEvent from "../../vox/event/SelectionEvent";

/**
 * 在一个平面上拖动
 */
class EditableEntity extends MouseEventEntity implements ISelectable {

    private m_selected: boolean = false;
    private m_selectDispatcher: EventBaseDispatcher = new EventBaseDispatcher();
    private m_currEvent: SelectionEvent = new SelectionEvent();

    constructor(transform: ROTransform = null) {
        super(transform);
    }

    protected initializeEvent(): void {

        super.initializeEvent();
        this.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDownListener);
    }
    protected mouseDownListener(evt: any): void {
        this.select(true);
    }
    private sendSelectionEvt(): void {

        this.m_selectDispatcher.uuid = this.uuid;
        this.m_currEvent.target = this;
        this.m_currEvent.type = SelectionEvent.SELECT;
        this.m_currEvent.flag = this.m_selected;
        this.m_currEvent.phase = 1;
        this.m_selectDispatcher.dispatchEvt(this.m_currEvent);
    }
    addEventListener(type: number, listener: any, func: (evt: any) => void): void {

        if(type != SelectionEvent.SELECT) {
            if (this.m_dispatcher != null) {
                this.m_dispatcher.addEventListener(type, listener, func);
            }
        }
        else {
            if (this.m_selectDispatcher != null) {
                this.m_selectDispatcher.addEventListener(type, listener, func);
            }
        }
    }
    removeEventListener(type: number, listener: any, func: (evt: any) => void): void {

        if(type != SelectionEvent.SELECT) {
            if (this.m_dispatcher != null) {
                this.m_dispatcher.removeEventListener(type, listener, func);
            }
        }
        else {
            if (this.m_selectDispatcher != null) {
                this.m_selectDispatcher.removeEventListener(type, listener, func);
            }
        }
    }
    isSelected(): boolean {
        return this.m_selected;
    }
    
    /**
     * 选中
     * @param sendEvtEnabled 是否发送选中的事件。 如果不发送事件，则只会改变状态。
     */
    select(sendEvtEnabled: boolean = false): void {
        this.m_selected = true;
        if(sendEvtEnabled) {
            this.sendSelectionEvt();
        }
    }
    /**
     * 取消选中
     * @param sendEvtEnabled 是否发送选中的事件。 如果不发送事件，则只会改变状态。
     */
    deselect(sendEvtEnabled: boolean = false): void {
        this.m_selected = false;
        if(sendEvtEnabled) {
            this.sendSelectionEvt();
        }
    }
    destroy(): void {
        super.destroy();
        if (this.m_selectDispatcher != null) {
            this.m_selectDispatcher.destroy();
            this.m_selectDispatcher = null;
        }
    }
}

export {EditableEntity};