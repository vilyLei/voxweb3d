/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
import MouseEvent from "../../vox/event/MouseEvent";
import ROTransform from "../../vox/display/ROTransform";
import {ISelectable} from "../../voxeditor/base/ISelectable";
import MouseEventEntity from "../../vox/entity/MouseEventEntity";

/**
 * 在一个平面上拖动
 */
class EditableEntity extends MouseEventEntity implements ISelectable {

    private m_selected: boolean = false;
    uuid: string = "EditableEntity";
    constructor(transform: ROTransform = null) {
        super(transform);
    }

    protected initializeEvent(): void {

        super.initializeEvent();
        this.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDownListener);
    }
    protected mouseDownListener(evt: any): void {
        this.select();
    }
    isSelected(): boolean {
        return this.m_selected;
    }
    select(): void {
        this.m_selected = true;
    }
    deselect(): void {
        this.m_selected = false;
    }
}

export {EditableEntity};