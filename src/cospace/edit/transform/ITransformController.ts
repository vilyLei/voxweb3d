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
    setScale(s: number): void;
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
     * @param type the correct value is 0, 1, or 2, the default value is -1.
     */
    enable(type?: number): void;
    /**
     * @param force the default value is false
     */
    disable(force?: boolean): void;
    decontrol(): void;
    select(targets: IEntityTransform[], wpos?: IVector3D, autoEnabled?: boolean): void;
    run(): void;
    /**
     * @param type event type
     * @param listener listener host
     * @param func istener function
     * @param captureEnabled the default value is true
     * @param bubbleEnabled the default value is false
     */
    addEventListener(type: number, listener: any, func: (evt: any) => void, captureEnabled?: boolean, bubbleEnabled?: boolean): void;
    /**
     * @param type event type
     * @param listener listener host
     * @param func istener function
     */
    removeEventListener(type: number, listener: any, func: (evt: any) => void): void;
}

export { ITransformController }