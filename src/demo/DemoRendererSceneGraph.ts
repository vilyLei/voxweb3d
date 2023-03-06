import Vector3D from "../vox/math/Vector3D";
import RendererDevice from "../vox/render/RendererDevice";
import RendererParam from "../vox/scene/RendererParam";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";
import MouseEvent from "../vox/event/MouseEvent";
import Stage3D from "../vox/display/Stage3D";
import RendererScene from "../vox/scene/RendererScene";
import RendererSubScene from "../vox/scene/RendererSubScene";

import DisplayEntity from "../vox/entity/DisplayEntity";
import Axis3DEntity from "../vox/entity/Axis3DEntity";
import Box3DEntity from "../vox/entity/Box3DEntity";
import Sphere3DEntity from "../vox/entity/Sphere3DEntity";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import CameraTrack from "../vox/view/CameraTrack";

import MouseEventEntityController from "../voxeditor/control/MouseEventEntityController";
import ScreenFixedAlignPlaneEntity from "../vox/entity/ScreenFixedAlignPlaneEntity";
import IRendererSceneGraph from "../vox/scene/IRendererSceneGraph";
import RendererSceneGraph from "../vox/scene/RendererSceneGraph";
import IRendererScene from "../vox/scene/IRendererScene";
import IRenderStage3D from "../vox/render/IRenderStage3D";

import DebugFlag from "../vox/debug/DebugFlag";
import EventBase from "../vox/event/EventBase";

class LeftScene {
	private m_rendererScene: IRendererScene = null;
	private m_texLoader: ImageTextureLoader;
	constructor() {}
	initialize(rscene: IRendererScene, texLoader: ImageTextureLoader): void {
		this.m_rendererScene = rscene;
		this.m_texLoader = texLoader;

		let tex0 = this.m_texLoader.getTexByUrl("static/assets/default.jpg");
		let tex1 = this.m_texLoader.getTexByUrl("static/assets/broken_iron.jpg");

		let axis = new Axis3DEntity();
		axis.initialize(600.0);
		this.m_rendererScene.addEntity(axis);
		let i: number = 0;
		let box: Box3DEntity;
		for (i = 0; i < 1; ++i) {
			box = new Box3DEntity();
			box.initialize(new Vector3D(-50.0, -50.0, -50.0), new Vector3D(50.0, 50.0, 5.0), [tex1]);
			box.setXYZ(Math.random() * 1000.0 - 500.0, Math.random() * 1000.0 - 500.0, Math.random() * 1000.0 - 500.0);
			this.m_rendererScene.addEntity(box);
			this.useEvt(box);
		}
		let sphere: Sphere3DEntity;
		for (i = 0; i < 1; ++i) {
			sphere = new Sphere3DEntity();
			sphere.initialize(110.0, 15, 15, [tex0]);
			sphere.setXYZ(Math.random() * 1000.0 - 500.0, Math.random() * 1000.0 - 500.0, Math.random() * 1000.0 - 500.0);
			this.m_rendererScene.addEntity(sphere);
			this.useEvt(sphere);
		}
	}

	private useEvt(disp: DisplayEntity): void {
		let evtCtrl = new MouseEventEntityController();
		evtCtrl.bindTarget(disp);
	}
}

class RightScene {
	private m_rendererScene: IRendererScene = null;
	private m_texLoader: ImageTextureLoader;
	constructor() {}
	initialize(rscene: IRendererScene, texLoader: ImageTextureLoader): void {
		this.m_rendererScene = rscene;
		this.m_texLoader = texLoader;

		let tex1 = this.m_texLoader.getTexByUrl("static/assets/broken_iron.jpg");
		let tex2 = this.m_texLoader.getTexByUrl("static/assets/warter_01.jpg");
		// bg color
		let scrPlane: ScreenFixedAlignPlaneEntity = new ScreenFixedAlignPlaneEntity();
		scrPlane.showDoubleFace(true, false);
		scrPlane.initialize(-1.0, -1.0, 2.0, 2.0);
		// (scrPlane.getMaterial() as any).setRGB3f(Math.random() * 0.3, Math.random() * 0.3, Math.random() * 0.3);
		(scrPlane.getMaterial() as any).setRGB3f(0.1, 0.3, 0.3);
		rscene.addEntity(scrPlane);

		let axis = new Axis3DEntity();
		axis.initialize(600.0);
		this.m_rendererScene.addEntity(axis);
		let i = 0;
		let box: Box3DEntity;
		for (i = 0; i < 1; ++i) {
			box = new Box3DEntity();
			box.initialize(new Vector3D(-50.0, -50.0, -50.0), new Vector3D(50.0, 50.0, 5.0), [tex2]);
			box.setXYZ(Math.random() * 1000.0 - 500.0, Math.random() * 1000.0 - 500.0, Math.random() * 1000.0 - 500.0);
			this.m_rendererScene.addEntity(box);

			this.useEvt(box);
		}
		let sphere: Sphere3DEntity;
		for (i = 0; i < 1; ++i) {
			sphere = new Sphere3DEntity();
			sphere.initialize(110.0, 15, 15, [tex1]);
			sphere.setXYZ(Math.random() * 1000.0 - 500.0, Math.random() * 1000.0 - 500.0, Math.random() * 1000.0 - 500.0);
			this.m_rendererScene.addEntity(sphere);

			this.useEvt(sphere);
		}
	}

	private useEvt(disp: DisplayEntity): void {
		let evtCtrl = new MouseEventEntityController();
		evtCtrl.bindTarget(disp);
	}
}
export class DemoRendererSceneGraph {
	constructor() {}

	private m_rendererLeftScene: IRendererScene = null;
	private m_rendererRightScene: IRendererScene = null;
	private m_texLoader: ImageTextureLoader;
	private m_camTrack: CameraTrack = null;
	private m_camTrack2: CameraTrack = null;
	private m_stage3D: IRenderStage3D = null;

	private m_leftScene = new LeftScene();
	private m_rightScene = new RightScene();
	private m_graph: IRendererSceneGraph = null;

	initialize(): void {
		console.log("DemoRendererSceneGraph::initialize()......");

		if (this.m_graph == null) {
			RendererDevice.SHADERCODE_TRACE_ENABLED = true;
			this.m_graph = new RendererSceneGraph().setAutoRunning(true);

			let rparam = this.m_graph.createRendererSceneParam();
			rparam.divW = 800;
			rparam.divH = 600;
			rparam.syncBgColor = false;
			rparam.autoSyncRenderBufferAndWindowSize = false;
			rparam.setCamProject(45.0, 0.1, 5000.0);
			rparam.setCamPosition(1500.0, 1500.0, 1500.0);
			this.m_rendererLeftScene = this.m_graph.createScene(rparam);
			this.m_rendererLeftScene.initialize(rparam);
			this.m_rendererLeftScene.enableMouseEvent(true);
			this.m_rendererLeftScene.setClearRGBColor3f(0.3, 0.1, 0.1);
			this.m_stage3D = this.m_rendererLeftScene.getStage3D();

			this.m_texLoader = new ImageTextureLoader(this.m_rendererLeftScene.textureBlock);

			rparam = new RendererParam();
			rparam.setCamProject(45.0, 0.1, 5000.0);
			rparam.setCamPosition(1500.0, 1500.0, 1200.0);
			this.m_rendererRightScene = this.m_graph.createSubScene(rparam);
			this.m_rendererRightScene.enableMouseEvent(true);

			new RenderStatusDisplay(this.m_rendererLeftScene, true);

			this.m_rendererLeftScene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDownListener);
			this.m_rendererLeftScene.addEventListener(EventBase.ENTER_FRAME, this, this.enterFrame);

			this.m_camTrack = new CameraTrack();
			this.m_camTrack.bindCamera(this.m_rendererLeftScene.getCamera());
			this.m_camTrack2 = new CameraTrack();
			this.m_camTrack2.bindCamera(this.m_rendererRightScene.getCamera());

			this.m_leftScene.initialize(this.m_rendererLeftScene, this.m_texLoader);
			this.m_rightScene.initialize(this.m_rendererRightScene, this.m_texLoader);

			let vw = this.m_stage3D.stageWidth;
			let vh = this.m_stage3D.stageHeight;
			let halfVW = vw * 0.5;
			this.m_rendererRightScene.setViewPort(0, 0, halfVW * 0.7, vh * 0.7);
		}
	}
	mouseDownListener(evt: any): void {
		// DebugFlag.Flag_0 = 1;
	}
	private enterFrame(): void {
		this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
		this.m_camTrack2.rotationOffsetAngleWorldY(-0.1);
	}
	// run(): void {
	//     if(this.m_graph != null) {
	//         this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
	//         this.m_camTrack2.rotationOffsetAngleWorldY(-0.1);
	//         this.m_graph.run();
	//     }
	// }
}
