import Vector3D from "../vox/math/Vector3D";
import RendererDevice from "../vox/render/RendererDevice";
import RendererParam from "../vox/scene/RendererParam";
import { RenderBlendMode, CullFaceMode, DepthTestMode } from "../vox/render/RenderConst";
import RendererState from "../vox/render/RendererState";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";

import Plane3DEntity from "../vox/entity/Plane3DEntity";
import Box3DEntity from "../vox/entity/Box3DEntity";

import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import CameraTrack from "../vox/view/CameraTrack";
import ScreenFixedPlaneMaterial from "../vox/material/mcase/ScreenFixedPlaneMaterial";
import { PSDepthMaterial } from "../demo/material/PSDepthMaterial";

import RendererScene from "../vox/scene/RendererScene";
import { IRendererInstanceContext } from "../vox/scene/IRendererInstanceContext";
import { MouseInteraction } from "../vox/ui/MouseInteraction";


export class DemoPreDepth {
	constructor() {}
	private m_rscene: RendererScene = null;
	private m_rcontext: IRendererInstanceContext = null;
	private m_texLoader: ImageTextureLoader;
	// private m_camTrack: CameraTrack = null;
    
	private m_depMaterial = new PSDepthMaterial();
	initialize(): void {
		console.log("DemoPreDepth::initialize()......");

		if (this.m_rscene == null) {

			RendererDevice.SHADERCODE_TRACE_ENABLED = true;
			RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
			RendererDevice.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;

			let rparam = new RendererParam();
            // rparam.maxWebGLVersion = 1;
			rparam.setCamProject(45.0, 30.0, 5000.0);

			this.m_rscene = new RendererScene();
			this.m_rscene.initialize(rparam);
			this.m_rcontext = this.m_rscene.getRendererContext();

            new MouseInteraction().initialize(this.m_rscene, 0, true).setAutoRunning(true);
            new RenderStatusDisplay(this.m_rscene, true);
			RendererState.CreateRenderState("depthSt", CullFaceMode.BACK, RenderBlendMode.NORMAL, DepthTestMode.TRUE_GEQUAL);
			//RendererState.CreateRenderState("depthSt", CullFaceMode.BACK, RenderBlendMode.NORMAL, DepthTestMode.TRUE_EQUAL);

			this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);
			let tex0 = this.m_texLoader.getTexByUrl("static/assets/default.jpg");
			let tex1 = this.m_texLoader.getTexByUrl("static/assets/broken_iron.jpg");

			// this.m_camTrack = new CameraTrack();
			// this.m_camTrack.bindCamera(this.m_rcontext.getCamera());
			// add common 3d display entity
			var plane: Plane3DEntity = new Plane3DEntity();
			plane.initializeXOZ(-200.0, -150.0, 400.0, 300.0, [tex0]);
			this.m_rscene.addEntity(plane);

			let scale: number = 0.5;
			let box: Box3DEntity;
			let box_minV: Vector3D = new Vector3D(-100.0, -100.0, -100.0);
			let box_maxV: Vector3D = new Vector3D(100.0, 100.0, 100.0);
			for (let i: number = 0; i < 100; ++i) {
				box = new Box3DEntity();
				box.initialize(box_minV, box_maxV, [tex1]);
				box.setScaleXYZ(scale, scale, scale);
				box.setXYZ(Math.random() * 1000.0 - 500.0, Math.random() * 1000.0 - 500.0, Math.random() * 1000.0 - 500.0);
				this.m_rscene.addEntity(box);
			}
			// add rtt texture display entity
			let scrM = new ScreenFixedPlaneMaterial();
			let scrPlane = new Plane3DEntity();
			scrPlane.setMaterial(scrM);
			scrPlane.initializeXOY(-1.0, -1.0, 2.0, 2.0, [this.m_rscene.textureBlock.getRTTTextureAt(1)]);
			this.m_rscene.addEntity(scrPlane, 1);
		}
	}
	run(): void {
        
		let rsc = this.m_rscene;
		let pcontext = this.m_rcontext;

		rsc.setClearRGBColor3f(0.0, 0.0, 0.0);
		pcontext.renderBegin();
		// rsc.runBegin();
		rsc.update();

		// --------------------------------------------- rtt begin

		pcontext.setClearRGBColor3f(0.0, 0.0, 0.0);
		pcontext.synFBOSizeWithViewport();
		pcontext.useGlobalMaterial(this.m_depMaterial);
		pcontext.setRenderToTexture(this.m_rscene.textureBlock.getRTTTextureAt(0), true, false, 0);
        // 新写入深度
		pcontext.useFBO(true, true, false);
		rsc.runAt(0);

		pcontext.unlockMaterial();
		pcontext.useGlobalRenderStateByName("depthSt");
		pcontext.setRenderToTexture(this.m_rscene.textureBlock.getRTTTextureAt(1), true, false, 0);
        // 基于前面写入的深度做调整
		pcontext.useFBO(true, false, false);
		rsc.runAt(0);

		// --------------------------------------------- rtt end
		pcontext.unlockRenderState();
		pcontext.setClearRGBColor3f(0.0, 3.0, 2.0);
		pcontext.setRenderToBackBuffer();
		rsc.runAt(1);

		rsc.runEnd();

		rsc.updateCamera();
	}
}
export default DemoPreDepth;
