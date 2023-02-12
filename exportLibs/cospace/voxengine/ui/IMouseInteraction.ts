
import IVector3D from "../../../vox/math/IVector3D";
import IRendererScene from "../../../vox/scene/IRendererScene";

interface IMouseInteraction {

    readonly drager: any;
    readonly zoomer: any;
    // zoomLookAtPosition: IVector3D;
    zoomMinDistance: number;


    /**
     * 是否启用摄像机用户控制
     */
    cameraCtrlEnabled: boolean;
    
	/**
	 * @param rscene renderer scene instance
	 * @param buttonType the default value is 0, the value contains 0(mouse left button), 1(mouse middle button), 2(mouse right button)
	 * @param bgEventEnabled apply background mouse event true or false, the default value is true
	 */
    initialize(rscene: IRendererScene, buttonType?: number, bgEventEnabled?: boolean): void;
    
    enableSwing(): void;
    isEnabledSwing(): boolean;
    enableSlide(): void;
    setSyncLookAtEnabled(ennabled: boolean): void;
    setLookAtPosition(v: IVector3D): void;
    run(): void;
}

export { IMouseInteraction };
