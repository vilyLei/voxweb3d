import IRendererScene from "..//scene/IRendererScene";
import MouseCamDrager from "./MouseCamDrager";
import MouseCamZoomer from "./MouseCamZoomer";
import IVector3D from "../math/IVector3D";
import IEventBase from "../event/IEventBase";
import EventBase from "../event/EventBase";

class MouseInteraction {
	private m_rscene: IRendererScene = null;
	private m_autoRun = false;
	private m_axisType = 0;
	readonly drager = new MouseCamDrager();
	readonly zoomer = new MouseCamZoomer();
	zoomMinDistance = 30;
	/**
	 * 是否启用摄像机用户控制
	 */
	cameraCtrlEnabled = true;

	constructor() { }


	/**
	 * @param rscene renderer scene instance
	 * @param buttonType the default value is 0, the value contains 0(mouse left button), 1(mouse middle button), 2(mouse right button)
	 * @param bgEventEnabled apply background mouse event true or false, the default value is true
	 */
	initialize(rscene: IRendererScene, buttonType: number = 0, bgEventEnabled: boolean = true, autoRunning: boolean = false): MouseInteraction {
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
		this.setAutoRunning( autoRunning );
		return this;
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
	setSyncLookAtEnabled(ennabled: boolean): MouseInteraction {
		this.zoomer.syncLookAt = ennabled;
		return this;
	}
	setLookAtPosition(v: IVector3D): MouseInteraction {
		this.zoomer.setLookAtPosition(v);
		return this;
	}
	/**
	 * @param enabled enable auto runnning or not
	 * @param axisType 0 is y-axis, 1 is z-axis
	 */
	setAutoRunning(enabled: boolean, axisType: number = 0): MouseInteraction {
		this.m_axisType = axisType;
		this.m_autoRun = enabled;
		const type = EventBase.ENTER_FRAME;
		if (enabled) {
			this.setSyncLookAtEnabled( true );
			this.m_rscene.addEventListener(type, this, this.autoRun);
		} else {
			this.m_rscene.removeEventListener(type, this, this.autoRun);
		}
		return this;
	}
	private autoRun(evt: IEventBase): void {

		if (this.cameraCtrlEnabled) {
			this.zoomer.setLookAtPosition(null);
			this.zoomer.run(this.zoomMinDistance);
			switch (this.m_axisType) {
				case 0:
					this.drager.runWithYAxis();
					break;
				case 1:
					this.drager.runWithZAxis();
					break;
				default:
					this.drager.runWithYAxis();
					break;
			}
		}
	}
	run(): void {

		if (this.cameraCtrlEnabled && !this.m_autoRun) {
			this.zoomer.run(this.zoomMinDistance);
			this.drager.runWithYAxis();
		}
	}
	destroy(): void {
		if (this.m_rscene != null) {
			this.setAutoRunning(false);
			this.m_rscene = null;
		}
	}
}

export { MouseInteraction };
