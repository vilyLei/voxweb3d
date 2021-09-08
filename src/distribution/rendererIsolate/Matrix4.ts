
import {Vector3D} from "./Vector3D";

export interface Matrix4 {
    
    identity(): void;
    appendRotationY(rad: number): void;
    appendRotationX(rad: number): void;
    appendRotationZ(rad: number): void;
    transformVectorSelf(v3: Vector3D): void;    
    copyFrom(dst: Matrix4): void;
    transpose(): void;
    deltaTransformOutVector(in_v3: Vector3D, out_v3: Vector3D): void;
}
