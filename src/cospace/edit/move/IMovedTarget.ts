import IVector3D from "../../../vox/math/IVector3D";
import IEntityTransform from "../../../vox/entity/IEntityTransform";

interface IMovedTarget extends IEntityTransform {

    position: IVector3D;
    select(controller?: IEntityTransform): void;
    deselect(): void;
    addCtrlEntity(engity: IEntityTransform): void;
    setTargets(targets: IEntityTransform[]): void;
    getTargets(): IEntityTransform[];
    setCtrlScaleXYZ(sx: number, sy: number, sz: number): void;
}
export { IMovedTarget };