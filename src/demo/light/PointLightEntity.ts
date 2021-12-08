import Billboard3DEntity from "../../vox/entity/Billboard3DEntity";
import {ILightEntity} from "./ILightEntity";
import { PointLight } from "../../light/base/PointLight";
import Vector3D from "../../vox/math/Vector3D";
import DisplayEntity from "../../vox/entity/DisplayEntity";

class PointLightEntity implements ILightEntity {
    light: PointLight;
    readonly center: Vector3D = new Vector3D();
    readonly position: Vector3D = new Vector3D();
    displayEntity: DisplayEntity;
    constructor() {
    }
    run(): void {

    }
}
class FloatYPointLightEntity extends PointLightEntity {

    private m_time: number = 0.0;
    constructor() {
        super();
    }
    run(): void {
        this.position.y = this.center.y + 220 * Math.cos(this.m_time);
        this.m_time += 0.01;
        if(this.displayEntity != null) {
            this.displayEntity.setPosition( this.position );
            this.displayEntity.update();
        }
        if(this.light != null) {
            this.light.position.copyFrom(this.position);
        }        
    }
}
export {FloatYPointLightEntity, PointLightEntity}