import IVector3D from "../../../vox/math/IVector3D";
// import IRendererScene from "../../../vox/scene/IRendererScene";
import IEntityTransform from "../../../vox/entity/IEntityTransform";
import { IUserEditController } from "../base/IUserEditController";

interface IDragMoveController extends IUserEditController {
    /**
     * example: the value is 0.05
     */
    fixSize: number;
    axisSize: number;
    planeSize: number;
    planeAlpha: number;
    pickTestAxisRadius: number;
    
    moveByRay(rpv: IVector3D, rtv: IVector3D): void;
}

export { IDragMoveController };