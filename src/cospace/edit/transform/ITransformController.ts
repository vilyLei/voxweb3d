/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
import IRendererScene from "../../../vox/scene/IRendererScene";
import IEntityTransform from "../../../vox/entity/IEntityTransform";
import IVector3D from "../../../vox/math/IVector3D";

/**
 * renderable entity transform 编辑控制器
 */
interface ITransformController {

    /**
     * the type vaule is 0
     */
    readonly TRANSLATION: number;// = 0;
    /**
     * the type vaule is 1
     */
    readonly SCALE: number;// = 1;
    /**
     * the type vaule is 2
     */
    readonly ROTATION: number;// = 2;
    /**
     * @param rsc IRendererScene instance
     * @param processid the defualt value is 0
     */
    initialize(rsc: IRendererScene, processid?: number): void;
    
    /**
     * to translation controller
     */
    toTranslation(): void;
    /**
     * to scale controller
     */
    toScale(): void;
    /**
     * to rotation controller
     */
    toRotation(): void;
    /**
     * get the current controller type
     * @returns the legal value is 0, 1, or 2, -1 or other value is illegal.
     */
    getCurrType(): number;
    /**
     * @param type the value is 0, 1, or 2.
     */
    enable(type: number): void;
    /**
     * @param force the default value is true
     */
    disable(force?: boolean): void;
    decontrol(): void;
    select(targets: IEntityTransform[], wpos: IVector3D): void;
    run(): void;
}

export { ITransformController }