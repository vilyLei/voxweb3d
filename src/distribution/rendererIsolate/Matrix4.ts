
import {Vector3D} from "./Vector3D";

export interface Matrix4 {
    
    identity(): void;
    appendRotationY(rad: number): void;
    appendRotationX(rad: number): void;
    appendRotationZ(rad: number): void;
    transformVectorSelf(v3: Vector3D): void;
}
