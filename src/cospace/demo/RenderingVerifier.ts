import Vector3D from "../../vox/math/Vector3D";
import MouseEvent from "../../vox/event/MouseEvent";
import RendererDevice from "../../vox/render/RendererDevice";
import CameraTrack from "../../vox/view/CameraTrack";

import RendererParam from "../../vox/scene/RendererParam";
import RendererScene from "../../vox/scene/RendererScene";
import CameraStageDragSwinger from "../../voxeditor/control/CameraStageDragSwinger";
import CameraZoomController from "../../voxeditor/control/CameraZoomController";

import DivLog from "../../vox/utils/DivLog";
import { CoSpace } from "../CoSpace";
import ProfileInstance from "../../voxprofile/entity/ProfileInstance";
import { VerifierScene } from "./renderVerifier/VerifierScene";
import Color4 from "../../vox/material/Color4";

export class RenderingVerifier {

	private m_rscene: RendererScene = null;
	private m_camTrack: CameraTrack = null;
	private m_stageDragSwinger: CameraStageDragSwinger = new CameraStageDragSwinger();
	private m_cameraZoomController: CameraZoomController = new CameraZoomController();
	private m_profileInstance: ProfileInstance = null;

	private m_verifierScene: VerifierScene = new VerifierScene();
	private m_cameraUPY: boolean = false;

	constructor() { }

	initialize(): void {

		console.log("RenderingVerifier::initialize()......");

		if (this.m_rscene == null) {

			RendererDevice.SHADERCODE_TRACE_ENABLED = false;
			RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
			RendererDevice.SetWebBodyColor("white");
			//RendererDevice.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;
			DivLog.SetDebugEnabled(true);
			let color = new Color4()
			color.setRGB3f(0.0, 0.4185, 0.6896);
			DivLog.SetTextBgColor(color.getRGBUint24());
			DivLog.SetTextColor(0xeeeeee);
			DivLog.SetTextBgEnabled(false);
			DivLog.SetXY(2, 8);

			let rparam: RendererParam = new RendererParam();
			//rparam.maxWebGLVersion = 1;
			rparam.setCamProject(45, 50.0, 10000.0);
			rparam.setAttriStencil(true);
			rparam.setAttriAntialias(true);
			rparam.setCamPosition(2000.0, 2000.0, 2000.0);
			if (this.m_cameraUPY) {
				rparam.setCamUpDirect(0.0, 1.0, 0.0);
			} else {
				rparam.setCamUpDirect(0.0, 0.0, 1.0);
			}
			rparam.setCamLookAtPos(this.m_lookV.x, this.m_lookV.y, this.m_lookV.z);
			this.m_rscene = new RendererScene();
			this.m_rscene.initialize(rparam, 5);
			this.m_rscene.updateCamera();

			this.m_profileInstance = new ProfileInstance();
			this.m_profileInstance.initialize(this.m_rscene.getRenderer());

			this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);
			this.m_rscene.addEventListener(MouseEvent.MOUSE_UP, this, this.mouseUp);

			this.m_rscene.enableMouseEvent(true);
			this.m_cameraZoomController.bindCamera(this.m_rscene.getCamera());
			this.m_cameraZoomController.initialize(this.m_rscene.getStage3D());
			this.m_cameraZoomController.syncLookAt = true;

			this.m_stageDragSwinger.initialize(
				this.m_rscene.getStage3D(),
				this.m_rscene.getCamera()
			);
			this.m_camTrack = new CameraTrack();
			this.m_camTrack.bindCamera(this.m_rscene.getCamera());

			//this.m_profileInstance.initialize(this.m_rscene.getRenderer());

			this.m_rscene.setClearRGBColor3f(0.5, 0.5, 0.5);

			//   DivLog.ShowLog("renderer inited.");
			//   DivLog.ShowLog(RendererDevice.GPU_RENDERER);

			this.m_verifierScene.initialize(this.m_rscene);
			this.m_verifierScene.initTest();
		}
	}
	private mouseDown(evt: any): void {
		this.m_verifierScene.mouseDown(evt);
	}
	private mouseUp(evt: any): void { }
	private m_lookV: Vector3D = new Vector3D(0.0, 0.0, 0.0);
	run(): void {

		this.m_verifierScene.run();
		if (this.m_cameraUPY) {
			this.m_stageDragSwinger.runWithYAxis();
		} else {
			this.m_stageDragSwinger.runWithZAxis();
		}
		// this.m_stageDragSwinger.runWithCameraAxis();
		this.m_cameraZoomController.run(this.m_lookV, 30.0);

		this.m_rscene.run(true);

		if (this.m_profileInstance != null) {
			this.m_profileInstance.run();
		}
	}
}

export default RenderingVerifier;
