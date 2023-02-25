import Vector3D from "../vox/math/Vector3D";
import RendererDevice from "../vox/render/RendererDevice";
import RendererParam from "../vox/scene/RendererParam";
import DisplayEntity from "../vox/entity/DisplayEntity";
import TextureProxy from "../vox/texture/TextureProxy";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import RendererScene from "../vox/scene/RendererScene";
import DivLog from "../vox/utils/DivLog";
import MouseEvent from "../vox/event/MouseEvent";
import CameraStageDragSwinger from "../voxeditor/control/CameraStageDragSwinger";
import CameraZoomController from "../voxeditor/control/CameraZoomController";
import Color4 from "../vox/material/Color4";
import IRenderTexture from "../vox/render/texture/IRenderTexture";
import Default3DMaterial from "../vox/material/mcase/Default3DMaterial";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";

export class DemoSharedMesh {
	private m_clearColor = new Color4(0.1, 0.2, 0.1, 1.0);
	private m_tex: IRenderTexture = null;
	private m_rscene: RendererScene = null;
	private m_texLoader: ImageTextureLoader = null;
	private m_stageDragSwinger: CameraStageDragSwinger = new CameraStageDragSwinger();
	private m_cameraZoomController: CameraZoomController = new CameraZoomController();

	private m_currDispEntity: DisplayEntity = null;
	constructor() {}

	getImageTexByUrl(purl: string): TextureProxy {
		return this.m_texLoader.getImageTexByUrl(purl);
	}

	private initEvent(): void {
		this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDownListener, true, false);
		this.m_rscene.addEventListener(MouseEvent.MOUSE_UP, this, this.mouseUpListener);
		this.m_rscene.addEventListener(MouseEvent.MOUSE_MOVE, this, this.mouseMoveListener);

		// this.m_rscene.addEventListener(MouseEvent.MOUSE_BG_DOWN, this, this.test_bgmouseDownListener);
		// this.m_rscene.addEventListener(MouseEvent.MOUSE_BG_UP, this, this.test_bgmouseUpListener);
	}
	mouseDownListener(evt: any): void {
		console.log("XXXXXXXXXXXXXXX DemoSharedMesh::mouseDownListener()...");
		if (this.m_currDispEntity != null) {
			let entity = this.m_currDispEntity;
			this.m_rscene.removeEntity(entity);

			console.log(">>>>>>>>>>>>>>>>>>>>>> repeat the display entity ...");
			entity.setXYZ(Math.random() * 1000 - 500,0,100);
			// this.m_rscene.addEntity(entity);
			let mesh = entity.getMesh();

			let tex1 = this.m_tex;
			let material = new Default3DMaterial();
			material.normalEnabled = true;
			material.setTextureList([tex1]);
			material.initializeByCodeBuf(true);
			material.setRGB3f(0.5, 1.0, 0.5);

			entity.setMaterial(material);
			this.m_rscene.addEntity(entity);
		}
	}
	mouseUpListener(evt: any): void {
		// console.log("mouseUP...");
	}
	mouseMoveListener(evt: any): void {
		//console.log("mouseDown...");
		//this.m_rscene.setClearRGBColor3f(Math.random(), 0, Math.random());
	}
	private initScene(): void {
		let tex1 = this.m_tex;

		let scale = 120.0;
		let mesh = this.m_rscene.entityBlock.unitBox.getMesh();
		// 这是错误的初始化 这个 mesh buffer 的material定义，因为这个material没有完全使用到所有的 vtertex buffers
		// let material = new Default3DMaterial();
		// material.setTextureList([tex1]);
		// material.initializeByCodeBuf(true);
		// material.setRGB3f(0.5, 1.0, 1.0);

		// 这是正确的方式
		let material = new Default3DMaterial();
		material.normalEnabled = true;
		material.setTextureList([tex1]);
		material.initializeByCodeBuf(true);
		material.setRGB3f(0.5, 1.0, 1.0);

		let boxEntity = new DisplayEntity();
		boxEntity.setMaterial(material);
		boxEntity.setMesh(mesh);
		boxEntity.setXYZ(-100, 0, 200);
		boxEntity.setScaleXYZ(scale, scale, scale);
		this.m_rscene.addEntity(boxEntity);
		this.m_currDispEntity = boxEntity;
	}

	initialize(): void {
		console.log("DemoSharedMesh::initialize()......");
		if (this.m_rscene == null) {
			
			RendererDevice.SHADERCODE_TRACE_ENABLED = true;
			RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
			DivLog.SetDebugEnabled(false);

			let rparam = new RendererParam();
			// rparam.maxWebGLVersion = 1;
			rparam.setCamProject(45, 0.1, 6000.0);
			rparam.setCamPosition(1100.0, 1100.0, 1100.0);
			this.m_rscene = new RendererScene();
			this.m_rscene.initialize(rparam, 3);
			this.m_rscene.updateCamera();

			this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);

			this.m_tex = this.getImageTexByUrl("static/assets/broken_iron.jpg");

			this.m_rscene.enableMouseEvent(true);
			// this.m_rscene.enableMouseEvent(false);
			this.m_cameraZoomController.bindCamera(this.m_rscene.getCamera());
			this.m_cameraZoomController.initialize(this.m_rscene.getStage3D());
			this.m_stageDragSwinger.initialize(this.m_rscene.getStage3D(), this.m_rscene.getCamera());

            new RenderStatusDisplay(this.m_rscene, true);
			this.initScene();
			this.initEvent();
			this.m_rscene.setClearColor(this.m_clearColor);
		}
	}
	run(): void {
		if (this.m_rscene != null) {
			// this.initialize2();

			this.m_stageDragSwinger.runWithYAxis();
			this.m_cameraZoomController.run(Vector3D.ZERO, 30.0);

			this.m_rscene.run(true);
		}
	}
}
export default DemoSharedMesh;
