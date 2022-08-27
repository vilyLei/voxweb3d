import IVector3D from "../../../vox/math/IVector3D";
import IRendererScene from "../../../vox/scene/IRendererScene";
import IEntityTransform from "../../../vox/entity/IEntityTransform";
import { IRayControl } from "../base/IRayControl";

interface IDragMoveController extends IRayControl {

    axisSize: number;
    planeSize: number;
    planeAlpha: number;
    pickTestAxisRadius: number;
    runningVisible: boolean;
    uuid: string;
    
    /**
     * initialize the DragMoveController instance.
     * @param editRendererScene a IRendererScene instance.
     * @param processid this destination renderer process id in the editRendererScene, its default value is 0
     */
    initialize(rc: IRendererScene, processid?: number): void;

    selectByParam(raypv: IVector3D, raytv: IVector3D, wpos: IVector3D): void;
    setTargetPosOffset(offset: IVector3D): void;
    setTarget(target: IEntityTransform): void;
    getTarget(): IEntityTransform;
   
    run(): void;
    isSelected(): boolean;
    select(): void;
    deselect(): void;
    setVisible(visible: boolean): void;
    moveByRay(rpv: IVector3D, rtv: IVector3D): void;
    getVisible(): boolean;

    /*
    setXYZ(px: number, py: number, pz: number): void;

    setPosition(pv: IVector3D): void;
    getPosition(pv: IVector3D): void;
    setRotationXYZ(rx: number, ry: number, rz: number): void;
    setScaleXYZ(sx: number, sy: number, sz: number): void;
    getRotationXYZ(pv: IVector3D): void;
    getScaleXYZ(pv: IVector3D): void;
    
    localToGlobal(pv: IVector3D): void;
    globalToLocal(pv: IVector3D): void;
    update(): void;
    destroy(): void;
    //*/

}

export { IDragMoveController };