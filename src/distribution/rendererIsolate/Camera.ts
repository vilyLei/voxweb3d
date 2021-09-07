
import {Vector3D} from "./Vector3D";

interface Camera {
    
    getPosition(): Vector3D;
    getLookAtPosition(): Vector3D;
    setPosition(v3: Vector3D): void;
}

export {Camera}