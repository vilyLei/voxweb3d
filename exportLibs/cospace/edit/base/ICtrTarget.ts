import IVector3D from "../../../vox/math/IVector3D";
import IEntityTransform from "../../../vox/entity/IEntityTransform";

interface ICtrTarget extends IEntityTransform {

    /**
     * center
     */
    position: IVector3D;
    version: number;
    select(controller?: IEntityTransform): void;
    deselect(): void;
    addCtrlEntity(entity: IEntityTransform): void;
    setTargets(targets: IEntityTransform[]): void;
    getTargets(): IEntityTransform[];
    setCtrlScaleXYZ(sx: number, sy: number, sz: number): void;
    updateCtrl(): void;
}
export { ICtrTarget };