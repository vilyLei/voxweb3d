import RendererDevice from "../vox/render/RendererDevice";
import RendererParam from "../vox/scene/RendererParam";

import DisplayEntity from "../vox/entity/DisplayEntity";
import RendererScene from "../vox/scene/RendererScene";
import DivLog from "../vox/utils/DivLog";
import Default3DMaterial from "../vox/material/mcase/Default3DMaterial";
import Box3DEntity from "../vox/entity/Box3DEntity";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";
import { MouseInteraction } from "../vox/ui/MouseInteraction";
import DefaultPassGraph from "../vox/render/pass/DefaultPassGraph";
import StencilOutlinePassItem from "./pass/StencilOutlinePassItem";
import Sphere3DEntity from "../vox/entity/Sphere3DEntity";
import IRenderTexture from "../vox/render/texture/IRenderTexture";
import TextureResLoader from "../vox/assets/TextureResLoader";
import { GLStencilFunc, GLStencilOp } from "../vox/render/RenderConst";
import MouseEvent from "../vox/event/MouseEvent";
import DebugFlag from "../vox/debug/DebugFlag";

export class DemoGraphStencil {
	private m_init = true;
	private m_texLoader: TextureResLoader = null;
	private m_rscene: RendererScene = null;
	constructor() { }

	private getTexByUrl(purl: string, preAlpha: boolean =false, wrapRepeat: boolean = true, mipmapEnabled = true): IRenderTexture {
		return this.m_texLoader.getTexByUrl(purl, preAlpha, wrapRepeat, mipmapEnabled);
	}

	initialize(): void {

		console.log("DemoGraphStencil::initialize()......");
		if (this.m_init) {
			this.m_init = false;

			document.oncontextmenu = function (e) {
				// e.preventDefault();
			}

			RendererDevice.SHADERCODE_TRACE_ENABLED = false;
			RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
			DivLog.SetDebugEnabled(false);

			let rparam = new RendererParam();
			rparam.setCamProject(45, 0.1, 6000.0);
			rparam.setCamPosition(1100.0, 1100.0, 1100.0);
			rparam.setAttriStencil(true);
			
			let rscene = new RendererScene();
			rscene.initialize(rparam).setAutoRunning(true);
			rscene.setClearRGBAColor4f(0.0,0.0,0.0,0.0);

			this.m_rscene = rscene;
			this.m_texLoader = new TextureResLoader(rscene);

			new MouseInteraction().initialize(rscene, 0, true).setAutoRunning(true);
			new RenderStatusDisplay(rscene, true);

			this.initScene(rscene);
		}
	}
	private testDataMesh(rscene: RendererScene): void {

		let material = new Default3DMaterial();
		material.normalEnabled = true;
		material.setTextureList([this.getTexByUrl("static/assets/box.jpg", true)]);
		
		let item = new StencilOutlinePassItem();

		let stc = item.stencil0;
        stc.setStencilOp(GLStencilOp.KEEP, GLStencilOp.KEEP, GLStencilOp.REPLACE);
        stc.setStencilFunc(GLStencilFunc.ALWAYS, 1, 0xFF);
        stc.setStencilMask(0xFF);
		
		stc = item.stencil1;
        stc.setStencilFunc(GLStencilFunc.NOTEQUAL, 1, 0xFF);
        stc.setStencilMask(0x0);

		let graph = new DefaultPassGraph().addItem(item).initialize();
		material.graph = graph;
		
		let sph = new Sphere3DEntity();
		sph.setMaterial(material);
		sph.initialize(80, 20, 20);
		sph.setXYZ(-200, 0, -200);
		rscene.addEntity(sph, 1);
		
		let box = new Box3DEntity();
		box.setMaterial(material);
		box.initializeCube(200.0);
		this.m_rscene.addEntity(box,0);
	}
	
	private initScene(rscene: RendererScene): void {
		this.testDataMesh(rscene);
		rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);
	}
	private mouseDown(): void {
		DebugFlag.Flag_0 = 1;
	}
}
export default DemoGraphStencil;
