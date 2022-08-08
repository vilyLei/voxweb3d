
import IVector3D from "../../../vox/math/IVector3D";
import IRendererScene from "../../../vox/scene/IRendererScene";

interface IMouseInteraction {

    readonly drager: any;
    readonly zoomer: any;
    zoomLookAtPosition: IVector3D;
    zoomMinDistance: number;


    /**
     * 是否启用摄像机用户控制
     */
    cameraCtrlEnabled: boolean;

    initialize(rscene: IRendererScene): void;
    setSyncLookAtEnabled(ennabled: boolean): void;
    run(): void;
}

export { IMouseInteraction };
