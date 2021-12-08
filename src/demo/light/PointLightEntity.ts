import Billboard3DEntity from "../../vox/entity/Billboard3DEntity";
import {ILightEntity} from "./ILightEntity";
import { PointLight } from "../../light/base/PointLight";
import Vector3D from "../../vox/math/Vector3D";
import DisplayEntity from "../../vox/entity/DisplayEntity";
import Matrix4 from "../../vox/math/Matrix4";

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

class RotateYPointLightEntity extends PointLightEntity {

    private m_rad: number = 0.0;
    radius: number = 200.0;
    rotationSpd: number = 0.05;
    constructor(rad: number) {
        super();
        this.m_rad = rad;
    }
    run(): void {

        this.m_rad += this.rotationSpd;
        this.position.y = 0.0;
        this.position.x = this.radius * Math.cos(this.m_rad);
        this.position.z = this.radius * Math.sin(this.m_rad);
        this.position.addBy( this.center );
        if(this.displayEntity != null) {
            this.displayEntity.setPosition( this.position );
            this.displayEntity.update();
        }
        if(this.light != null) {
            this.light.position.copyFrom(this.position);
        }        
    }
    
}

export {RotateYPointLightEntity, FloatYPointLightEntity, PointLightEntity}