
import MouseEvent from "../../../vox/event/MouseEvent";
import {EditableEntity} from "../../../voxeditor/entity/EditableEntity";

class PathSegmentEntity extends EditableEntity {
    segIndex: number = -1;
    constructor() { super() }
    
    protected initializeEvent(): void {

        super.initializeEvent();
        this.addEventListener(MouseEvent.MOUSE_OVER, this, this.mouseOverThis);
        this.addEventListener(MouseEvent.MOUSE_OUT, this, this.mouseOutThis);
    }
    private mouseOverThis(evt: any): void {
        //console.log("PathSegmentEntity::mouseOverThis().");
        let material: any = this.getMaterial();
        if(this.isSelected()) {
            material.setRGB3f(1.7,0.7,0.9);
        }
        else {
            material.setRGB3f(1.2,1.2,1.2);
        }
    }
    private mouseOutThis(evt: any): void {
        //console.log("PathSegmentEntity::mouseOutThis().");
        let material: any = this.getMaterial();
        if(this.isSelected()) {
            material.setRGB3f(1.3,0.8,1.0);
        }
        else {
            material.setRGB3f(1.0,1.0,1.0);
        }
    }
    /**
     * 选中
     * @param sendEvtEnabled 是否发送选中的事件。 如果不发送事件，则只会改变状态。
     */
    select(sendEvtEnabled: boolean = false): void {
        super.select(sendEvtEnabled);
        let material: any = this.getMaterial();
        material.setRGB3f(1.2,0.5,0.8);
    }
    /**
     * 取消选中
     * @param sendEvtEnabled 是否发送选中的事件。 如果不发送事件，则只会改变状态。
     */
    deselect(sendEvtEnabled: boolean = false): void {
        super.deselect(sendEvtEnabled);
        let material: any = this.getMaterial();
        material.setRGB3f(1.0,1.0,1.0);
    }
}

export { PathSegmentEntity };