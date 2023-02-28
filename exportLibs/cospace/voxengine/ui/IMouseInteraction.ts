
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
    initialize(rscene: IRendererScene, buttonType?: number, bgEventEnabled?: boolean): IMouseInteraction;
    
    enableSwing(): void;
    isEnabledSwing(): boolean;
    enableSlide(): void;
    setSyncLookAtEnabled(ennabled: boolean): IMouseInteraction;
    setLookAtPosition(v: IVector3D): IMouseInteraction;
    /**
	 * @param enabled enable auto runnning or not
	 * @param axisType 0 is y-axis, 1 is z-axis
	 */
	setAutoRunning(enabled: boolean, axisType?: number): IMouseInteraction;
    run(): void;
}

export { IMouseInteraction };
