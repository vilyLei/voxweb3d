import IRendererScene from "../../../vox/scene/IRendererScene";
import MouseCamDrager from "./MouseCamDrager";
import MouseCamZoomer from "./MouseCamZoomer";
import { IMouseInteraction } from "./IMouseInteraction";
import IVector3D from "../../../vox/math/IVector3D";

class MouseInteraction implements IMouseInteraction {
	private m_rscene: IRendererScene = null;

	readonly drager = new MouseCamDrager();
	readonly zoomer = new MouseCamZoomer();
	// zoomLookAtPosition: IVector3D = null;
	zoomMinDistance = 30;

	constructor() {}

	/**
	 * 是否启用摄像机用户控制
	 */
	cameraCtrlEnabled: boolean = true;
	
	/**
	 * @param rscene renderer scene instance
	 * @param buttonType the default value is 0, the value contains 0(mouse left button), 1(mouse middle button), 2(mouse right button)
	 * @param bgEventEnabled apply background mouse event true or false, the default value is true
	 */
	initialize(rscene: IRendererScene, buttonType: number = 0, bgEventEnabled: boolean = true): void {
		if (this.m_rscene == null) {

			this.m_rscene = rscene;
			rscene.enableMouseEvent(true);

			const d = this.drager;
			const z = this.zoomer;

			d.buttonType = buttonType;
			d.bgEventEnabled = bgEventEnabled;
			d.initialize(rscene.getStage3D(), rscene.getCamera());

			z.bindCamera(rscene.getCamera());
			z.initialize(rscene.getStage3D());
			z.setLookAtCtrlEnabled(false);
		}
	}
	
    enableSwing(): void {
        this.drager.enableSwing();
    }
    isEnabledSwing(): boolean {
        return this.isEnabledSwing();
    }
    enableSlide(): void {
        this.drager.enableSlide();
    }
	setSyncLookAtEnabled(ennabled: boolean): void {
		this.zoomer.syncLookAt = ennabled;
	}
	setLookAtPosition(v: IVector3D): void {
		this.zoomer.setLookAtPosition(v);
	}
	run(): void {
		if (this.cameraCtrlEnabled) {
			this.zoomer.run(this.zoomMinDistance);
			this.drager.runWithYAxis();
		}
	}
	destroy(): void {}
}

export { MouseInteraction };
