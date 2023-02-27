import Vector3D from "../vox/math/Vector3D";
import RendererDevice from "../vox/render/RendererDevice";
import RendererParam from "../vox/scene/RendererParam";
import DisplayEntity from "../vox/entity/DisplayEntity";
import TextureProxy from "../vox/texture/TextureProxy";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import RendererScene from "../vox/scene/RendererScene";
import DivLog from "../vox/utils/DivLog";
import MouseEvent from "../vox/event/MouseEvent";
import Color4 from "../vox/material/Color4";
import IRenderTexture from "../vox/render/texture/IRenderTexture";
import Default3DMaterial from "../vox/material/mcase/Default3DMaterial";
import Box3DEntity from "../vox/entity/Box3DEntity";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";
import { MouseInteraction } from "../vox/ui/MouseInteraction";

export class DemoIVtxBuf {
	private m_clearColor = new Color4(0.1, 0.2, 0.1, 1.0);
	private m_tex: IRenderTexture = null;
	private m_rscene: RendererScene = null;
	private m_texLoader: ImageTextureLoader = null;
	private m_currDispEntity: DisplayEntity = null;
	constructor() {}

	getImageTexByUrl(purl: string): TextureProxy {
		return this.m_texLoader.getImageTexByUrl(purl);
	}

	private initEvent(): void {
		this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDownListener, true, false);
		// this.m_rscene.addEventListener(MouseEvent.MOUSE_UP, this, this.mouseUpListener);
		// this.m_rscene.addEventListener(MouseEvent.MOUSE_MOVE, this, this.mouseMoveListener);

		// this.m_rscene.addEventListener(MouseEvent.MOUSE_BG_DOWN, this, this.test_bgmouseDownListener);
		// this.m_rscene.addEventListener(MouseEvent.MOUSE_BG_UP, this, this.test_bgmouseUpListener);
	}
	mouseDownListener(evt: any): void {
		console.log("XXXXXXXXXXXXXXX DemoIVtxBuf::mouseDownListener()...");
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
			material.setTextureList([this.getImageTexByUrl("static/assets/white.jpg")]);
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

	initialize(): void {
		console.log("DemoIVtxBuf::initialize()......");
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

			new MouseInteraction().initialize(this.m_rscene, 0, true).setAutoRunning(true);
            new RenderStatusDisplay(this.m_rscene, true);

			this.initScene();
			this.initEvent();
			this.m_rscene.setClearColor(this.m_clearColor);
		}
	}
	private initScene(): void {
		
		let boxEntity = new Box3DEntity();
		boxEntity.normalEnabled = true;
		// boxEntity.wireframe = true;
		boxEntity.initializeCube(100.0, [this.getImageTexByUrl("static/assets/white.jpg")]);
		boxEntity.setXYZ(-200, 0, 0);
		this.m_rscene.addEntity(boxEntity);
		this.m_currDispEntity = boxEntity;
	}
	run(): void {
		if (this.m_rscene != null) {
			this.m_rscene.run(true);
		}
	}
}
export default DemoIVtxBuf;
