import ITransformEntity from "../../../vox/entity/ITransformEntity";
import IVector3D from "../../../vox/math/IVector3D";
interface IUIEntity {

	getWidth(): number;
	getHeight(): number;
	setX(x: number): void;
	setY(y: number): void;
	setZ(z: number): void;
	getX(): number;
	getY(): number;
	getZ(): number;
	setRotation(r: number): void;
	setScaleXY(sx: number, sy: number): void;
	setXY(px: number, py: number): void;
	setPosition(pv: IVector3D): void;
	getPosition(pv: IVector3D): void;
	/**
	 * get renderable entity for renderer scene
	 * @returns ITransformEntity instance
	 */
	getREntity(): ITransformEntity;
	update(): void;
	destroy(): void;
}
export { IUIEntity };
