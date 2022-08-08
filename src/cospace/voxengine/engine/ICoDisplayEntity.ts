import IRenderEntity from "../../../vox/render/IRenderEntity";
import IVector3D from "../../../vox/math/IVector3D";

interface ICoDisplayEntity extends IRenderEntity {
	setXYZ(px: number, py: number, pz: number): void;
	setRotationXYZ(rx: number, ry: number, rz: number): void;
	setScaleXYZ(sx: number, sy: number, sz: number): void;

	offsetPosition(pv: IVector3D): void;
	setPosition(pv: IVector3D): void;
	getPosition(pv: IVector3D): void;
	setRotation3(rotV: IVector3D): void;
	setScale3(scaleV: IVector3D): void;
	getRotationXYZ(pv: IVector3D): void;
	getScaleXYZ(pv: IVector3D): void;

	update(): void;
}

export { ICoDisplayEntity };
