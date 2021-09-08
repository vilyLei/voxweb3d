
import {Vector3D} from "./Vector3D";
import {Matrix4} from "./Matrix4";

interface Camera {
    
    getPosition(): Vector3D;
    getLookAtPosition(): Vector3D;
    setPosition(v3: Vector3D): void;
    getViewInvMatrix(): Matrix4;
}

export {Camera}