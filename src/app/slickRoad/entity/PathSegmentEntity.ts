
import MouseEvent from "../../../vox/event/MouseEvent";
import {EditableEntity} from "../../../voxeditor/entity/EditableEntity";

class PathSegmentEntity extends EditableEntity {    
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
            material.setRGB3f(1.2,0.5,0.8);
        }
        else {
            material.setRGB3f(1.2,1.2,1.2);
        }
    }
    private mouseOutThis(evt: any): void {
        //console.log("PathSegmentEntity::mouseOutThis().");
        let material: any = this.getMaterial();
        if(this.isSelected()) {
            material.setRGB3f(1.0,0.6,1.0);
        }
        else {
            material.setRGB3f(1.0,1.0,1.0);
        }
    }
    
    select(): void {
        super.select();
        let material: any = this.getMaterial();
        material.setRGB3f(1.2,0.5,0.8);
    }
    deselect(): void {
        super.deselect();
        let material: any = this.getMaterial();
        material.setRGB3f(1.0,1.0,1.0);
    }
}

export { PathSegmentEntity };