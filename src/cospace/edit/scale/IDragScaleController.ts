import IVector3D from "../../../vox/math/IVector3D";
// import IRendererScene from "../../../vox/scene/IRendererScene";
import IEntityTransform from "../../../vox/entity/IEntityTransform";
import { IUserEditController } from "../base/IUserEditController";

interface IDragScaleController extends IUserEditController {
    /**
     * example: the value is 0.05
     */
    fixSize: number;
    axisSize: number;
    planeSize: number;
    planeAlpha: number;
    pickTestAxisRadius: number;
    
    moveByRay(rpv: IVector3D, rtv: IVector3D): void;
    decontrol(): void;
    // selectByParam(raypv: IVector3D, raytv: IVector3D, wpos: IVector3D): void;
    // setTargetPosOffset(offset: IVector3D): void;
    
    // moveByRay(rpv: IVector3D, rtv: IVector3D): void;
    // getVisible(): boolean;

}

export { IDragScaleController };