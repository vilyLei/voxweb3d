import IRendererScene from "../../../vox/scene/IRendererScene";
import MouseCamDrager from "./MouseCamDrager";
import MouseCamZoomer from "./MouseCamZoomer";
import { IMouseInteraction } from "./IMouseInteraction";

import IVector3D from "../../../vox/math/IVector3D";
// import CameraViewRay from "../../../vox/view/CameraViewRay";

class MouseInteraction implements IMouseInteraction {
	private m_rscene: IRendererScene = null;

	readonly drager: MouseCamDrager = new MouseCamDrager();
	readonly zoomer: MouseCamZoomer = new MouseCamZoomer();
	zoomLookAtPosition: IVector3D = null;
	zoomMinDistance: number = 30;

	constructor() {}

	/**
	 * 是否启用摄像机用户控制
	 */
	cameraCtrlEnabled: boolean = true;

	initialize(rscene: IRendererScene): void {
		if (this.m_rscene == null) {
			this.m_rscene = rscene;

			// this.viewRay.bindCameraAndStage(rscene.getCamera(), rscene.getStage3D());
			// this.viewRay.setPlaneParam(new Vector3D(0.0, 1.0, 0.0), 0.0);

			rscene.enableMouseEvent(true);
			this.drager.initialize(rscene.getStage3D(), rscene.getCamera());
			this.zoomer.bindCamera(rscene.getCamera());
			this.zoomer.initialize(rscene.getStage3D());
			this.zoomer.setLookAtCtrlEnabled(false);
		}
	}
	/**
	 * @param buttonType the value contains 0(mouse down), 1(mouse middle), 2(mouse right)
	 * @param bgEventEnabled apply background mouse event true or false
	 */
	setEventParams(buttonType: number, bgEventEnabled: boolean = true): void {
		this.drager.buttonType = buttonType;
		this.drager.bgEventEnabled = bgEventEnabled;
	}
	setSyncLookAtEnabled(ennabled: boolean): void {
		this.zoomer.syncLookAt = ennabled;
	}
	run(): void {
		if (this.cameraCtrlEnabled) {
			this.zoomer.run(this.zoomLookAtPosition, this.zoomMinDistance);
			this.drager.runWithYAxis();
		}
	}
	destroy(): void {}
}

export { MouseInteraction };
