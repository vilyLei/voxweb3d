import URLFilter from "../../cospace/app/utils/URLFilter";
import TextureResLoader from "../../vox/assets/TextureResLoader";
import Plane3DEntity from "../../vox/entity/Plane3DEntity";
import ScreenAlignPlaneEntity from "../../vox/entity/ScreenAlignPlaneEntity";
import Color4 from "../../vox/material/Color4";
import IRenderEntity from "../../vox/render/IRenderEntity";
import RendererDevice from "../../vox/render/RendererDevice";
import IRenderTexture from "../../vox/render/texture/IRenderTexture";
import IFBOInstance from "../../vox/scene/IFBOInstance";
import IRendererScene from "../../vox/scene/IRendererScene";
import RenderStatusDisplay from "../../vox/scene/RenderStatusDisplay";
import RendererSceneGraph from "../../vox/scene/RendererSceneGraph";
import { MouseInteraction } from "../../vox/ui/MouseInteraction";
import Cloud01Material from "./material/Cloud01Material";
import Cloud02Material from "./material/Cloud02Material";
import Cloud03Material from "./material/Cloud03Material";
import Cloud04Material from "./material/Cloud04Material";
import Cloud05Material from "./material/Cloud05Material";

interface TimeRunningNode {
	setTime(t: number): void;
}
export class DemoCloud {
	private m_init = true;

	graph = new RendererSceneGraph();
	texLoader: TextureResLoader = null;
	rscene: IRendererScene = null;
	constructor() {}

	getAssetTexByUrl(pns: string): IRenderTexture {
		return this.getTexByUrl("static/assets/" + pns);
	}
	getTexByUrl(url: string, preAlpha: boolean = false, wrapRepeat: boolean = true, mipmapEnabled = true): IRenderTexture {
		url = URLFilter.filterUrl(url);
		return this.texLoader.getTexByUrl(url, preAlpha, wrapRepeat, mipmapEnabled);
	}

	initialize(): void {
		console.log("DemoCloud::initialize()......");

		if (this.m_init) {
			this.m_init = false;

			document.oncontextmenu = function(e) {
				e.preventDefault();
			};

			RendererDevice.SHADERCODE_TRACE_ENABLED = true;
			RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;

			let rparam = this.graph.createRendererParam();
			rparam.setCamProject(45, 0.1, 3000.0);
			rparam.setCamPosition(0.0, 0.0, 1500.0);
			// rparam.setAttriAlpha(true);
			rparam.cameraPerspectiveEnabled = false;

			let rscene = this.graph.createScene(rparam);
			rscene.setClearRGBColor3f(0.1, 0.1, 0.1);

			this.rscene = rscene;
			this.texLoader = new TextureResLoader(rscene);

			new MouseInteraction().initialize(rscene, 0, true).setAutoRunning(true);
			new RenderStatusDisplay(rscene, true).setParams(true);

			this.initScene();
		}
	}
	private m_fboIns: IFBOInstance = null;
	private m_fixPlane = new ScreenAlignPlaneEntity();
	private m_currEntity: IRenderEntity = null;
	private m_trnode: TimeRunningNode;
	private initFBO(): void {
		let pw = 256;
		let ph = 256;
		let fboIns = this.rscene.createFBOInstance();
		fboIns.setClearRGBAColor4f(0.3, 0.0, 0.0, 1.0); // set rtt background clear rgb(r=0.3,g=0.0,b=0.0) color
		fboIns.createFBOAt(0, pw, ph, false, false);
		fboIns.setRenderToRTTTextureAt(0); // apply the first rtt texture, and apply the fbo framebuffer color attachment 0
		fboIns.asynFBOSizeWithViewport();
		fboIns.setRProcessIDList([0], false);
		fboIns.setAutoRunning(true);
		this.m_fboIns = fboIns;

		let whiteTex = this.rscene.textureBlock.createRGBATex2D(pw, ph, new Color4());
		let material_cloud01 = new Cloud01Material();
		material_cloud01.fixScreen = true;
		material_cloud01.setSize(pw, ph);
		material_cloud01.setTextureList([whiteTex]);
		material_cloud01.setTime(Math.random() * 200);
		material_cloud01.setFactor(Math.random() * 2.0 + 0.2);
		this.m_fixPlane.setMaterial(material_cloud01);
		this.m_fixPlane.initialize(-1, -1, 2, 2);
		// this.m_fboIns.drawEntity(this.m_fixPlane);
		this.m_fixPlane.intoRendererListener = (): void => {
			this.m_currEntity = this.m_fixPlane;
		};
		this.rscene.addEntity(this.m_fixPlane, 0);

		// let viewPlane = new Plane3DEntity();
		// viewPlane.initializeXOY(0, 0, pw, ph, [fboIns.getRTTAt(0)]);
		// viewPlane.setXYZ(200, 200, 0);
		// this.rscene.addEntity(viewPlane, 1);

		let viewPlane = new ScreenAlignPlaneEntity();
		viewPlane.initialize(-1, -1, 2, 2, [fboIns.getRTTAt(0)]);
		viewPlane.setRGB3f(0.3, 0.3, 0.3);
		this.rscene.addEntity(viewPlane, 1);
	}
	private initScene(): void {

		this.apply05();
		// this.apply04();
		// this.apply03();
		// this.apply02();
		// this.apply01();
		// this.initFBO();
	}
	private apply05(): void {

		let pw = 256;
		let ph = 256;
		let whiteTex = this.getAssetTexByUrl("noise_01.png");
		let material_cloud05 = new Cloud05Material();
		material_cloud05.fixScreen = false;
		material_cloud05.setSize(pw, ph);
		material_cloud05.setTextureList([whiteTex]);
		material_cloud05.setTime(Math.random() * 200);
		material_cloud05.setFactor(Math.random() * 2.0 + 0.2);
		let plane = new Plane3DEntity();
		plane.setMaterial(material_cloud05);
		plane.initializeXOY(-0.5 * pw, -0.5 * ph, pw, ph);
		this.rscene.addEntity(plane, 1);
		this.m_trnode = material_cloud05;
	}
	private apply04(): void {

		let pw = 256;
		let ph = 256;
		let whiteTex = this.getAssetTexByUrl("noise_01.png");
		let material_cloud04 = new Cloud04Material();
		material_cloud04.fixScreen = false;
		material_cloud04.setSize(pw, ph);
		material_cloud04.setTextureList([whiteTex]);
		material_cloud04.setTime(Math.random() * 200);
		material_cloud04.setFactor(Math.random() * 2.0 + 0.2);
		let plane = new Plane3DEntity();
		plane.setMaterial(material_cloud04);
		plane.initializeXOY(-0.5 * pw, -0.5 * ph, pw, ph);
		this.rscene.addEntity(plane, 1);
		this.m_trnode = material_cloud04;
	}
	private apply03(): void {

		let pw = 256;
		let ph = 256;
		let whiteTex = this.getAssetTexByUrl("bg001.jpg");
		let material_cloud02 = new Cloud03Material();
		material_cloud02.fixScreen = false;
		material_cloud02.setSize(pw, ph);
		material_cloud02.setTextureList([whiteTex]);
		material_cloud02.setTime(Math.random() * 200);
		material_cloud02.setFactor(Math.random() * 2.0 + 0.2);
		let plane = new Plane3DEntity();
		plane.setMaterial(material_cloud02);
		plane.initializeXOY(-0.5 * pw, -0.5 * ph, pw, ph);
		this.rscene.addEntity(plane, 1);
	}
	private apply02(): void {

		let pw = 256;
		let ph = 256;
		let whiteTex = this.rscene.textureBlock.createRGBATex2D(pw, ph, new Color4());
		let material_cloud02 = new Cloud02Material();
		material_cloud02.fixScreen = false;
		material_cloud02.setSize(pw, ph);
		material_cloud02.setTextureList([whiteTex]);
		material_cloud02.setTime(Math.random() * 200);
		material_cloud02.setFactor(Math.random() * 2.0 + 0.2);
		let plane = new Plane3DEntity();
		plane.setMaterial(material_cloud02);
		plane.initializeXOY(-0.5 * pw, -0.5 * ph, pw, ph);
		this.rscene.addEntity(plane, 1);
	}
	private apply01(): void {

		let pw = 256;
		let ph = 256;
		let whiteTex = this.rscene.textureBlock.createRGBATex2D(pw, ph, new Color4());
		let material_cloud01 = new Cloud01Material();
		material_cloud01.fixScreen = false;
		material_cloud01.setSize(pw, ph);
		material_cloud01.setTextureList([whiteTex]);
		material_cloud01.setTime(Math.random() * 200);
		material_cloud01.setFactor(Math.random() * 2.0 + 0.2);
		let plane = new Plane3DEntity();
		plane.setMaterial(material_cloud01);
		plane.initializeXOY(-0.5 * pw, -0.5 * ph, pw, ph);
		this.rscene.addEntity(plane, 1);
	}
	private m_times = 3;
	private m_time = 0.0;
	run(): void {
		this.graph.run();
		if(this.m_trnode) {
			this.m_trnode.setTime(this.m_time += 0.01);
		}
		if (this.m_currEntity) {
			if (this.m_times > 0) {
				this.m_times--;
				if (this.m_times == 1) {
					this.m_currEntity = null;
					this.m_fboIns.setAutoRunning(false);
					this.rscene.removeRenderNode( this.m_fboIns );
				}
			}
		}
	}
}

export default DemoCloud;
