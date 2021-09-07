
import {Vector3D} from "./Vector3D";

interface EntityObject {
    setRotationXYZ(rx: number, ry: number, rz: number):void;
    setScaleXYZ(sx: number, sy: number, sz: number):void;
    getPosition(pv: Vector3D): void;
    setPosition(pv: Vector3D): void;
    update():void;
}

export {EntityObject}