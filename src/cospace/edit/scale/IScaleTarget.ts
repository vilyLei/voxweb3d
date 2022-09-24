import IVector3D from "../../../vox/math/IVector3D";
import IAABB from "../../../vox/geom/IAABB";
import IEntityTransform from "../../../vox/entity/IEntityTransform";

interface IScaleTarget extends IEntityTransform {

    /**
     * center
     */
    position: IVector3D;

    select(controller?: IEntityTransform): void;
    deselect(): void;
    addCtrlEntity(entity: IEntityTransform): void;
    setTargets(targets: IEntityTransform[]): void;
    getTargets(): IEntityTransform[];
    setCtrlScaleXYZ(sx: number, sy: number, sz: number): void;
}
export { IScaleTarget };