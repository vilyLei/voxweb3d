
import IRenderEntity from "../../../vox/render/IRenderEntity";
import {ICoVec3} from "../math/ICoVec3";

interface ICoDisplayEntity extends IRenderEntity {
	setXYZ(px: number, py: number, pz: number): void;
    setRotationXYZ(rx: number, ry: number, rz: number): void;
    setScaleXYZ(sx: number, sy: number, sz: number): void;

    offsetPosition(pv: ICoVec3): void;
    setPosition(pv: ICoVec3): void;
    getPosition(pv: ICoVec3): void;
    setRotation3(rotV: ICoVec3): void;
    setScale3(scaleV: ICoVec3): void;
    getRotationXYZ(pv: ICoVec3): void
    getScaleXYZ(pv: ICoVec3): void;

	update(): void;
}

export { ICoDisplayEntity }
