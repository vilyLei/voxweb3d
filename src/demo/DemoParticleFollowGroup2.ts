import Vector3D from "../vox/math/Vector3D";
import RendererDevice from "../vox/render/RendererDevice";
import RendererParam from "../vox/scene/RendererParam";
import RendererScene from "../vox/scene/RendererScene";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";
import MouseEvent from "../vox/event/MouseEvent";

import Axis3DEntity from "../vox/entity/Axis3DEntity";
import TextureProxy from "../vox/texture/TextureProxy";
import TextureConst from "../vox/texture/TextureConst";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import CameraViewRay from "../vox/view/CameraViewRay";
import { MouseInteraction } from "../vox/ui/MouseInteraction";
import { FollowParticleParam, PathFollowParticle } from "../particle/base/PathFollowParticle";
import DisplayEntityContainer from "../vox/entity/DisplayEntityContainer";

export class DemoParticleFollowGroup2 {
	constructor() { }
	private m_rscene: RendererScene = null;
	private m_texLoader: ImageTextureLoader = null;
	private m_axis: Axis3DEntity = null;
	private m_viewRay = new CameraViewRay();
	getImageTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): TextureProxy {
		let ptex = this.m_texLoader.getImageTexByUrl(purl);
		ptex.mipmapEnabled = mipmapEnabled;
		if (wrapRepeat) ptex.setWrap(TextureConst.WRAP_REPEAT);
		return ptex;
	}

	initialize(): void {
		console.log("DemoParticleFollowGroup2::initialize()......");
		if (this.m_rscene == null) {
			RendererDevice.SHADERCODE_TRACE_ENABLED = true;

			let rparam = new RendererParam();
			rparam.setTickUpdateTime(20);
			rparam.setAttriAlpha(false);
			rparam.setMatrix4AllocateSize(8192 * 4);
			rparam.setCamProject(45.0, 10.0, 6000.0);
			rparam.setCamPosition(1500.0, 1500.0, 1500.0);

			this.m_rscene = new RendererScene();
			this.m_rscene.initialize(rparam, 3);
			this.m_rscene.setRendererProcessParam(1, true, true);

			this.m_viewRay.initialize(this.m_rscene);
			this.m_viewRay.setPlaneParam(new Vector3D(0.0, 1.0, 0.0), 0.0);

			this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);

			this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDownListener);

			new RenderStatusDisplay(this.m_rscene, true).setParams(true, true);
			new MouseInteraction().initialize(this.m_rscene, 0, true).setAutoRunning(true);

			// let axis = new Axis3DEntity();
			// axis.initialize(300.0);
			// this.m_rscene.addEntity(axis);

			let texs = [this.getImageTexByUrl("static/assets/testEFT4_monochrome3.jpg")];
			let fpParam = new FollowParticleParam();
			fpParam.textures = texs;
			fpParam.speedScale = 3.0;
			fpParam.timeScale = 2.0;
			// fpParam.uvParams = texs;
			// this.m_followParticle.initialize(1000, fpParam);
			// this.m_flowBill = this.m_followParticle.particleEntity;
			// // this.m_flowBill.setXYZ(0,);
			// this.m_rscene.addEntity(this.m_followParticle.particleEntity, 1);

			this.m_pathFollowEntity.initialize(2000, fpParam);
			this.m_rscene.addEntity(this.m_pathFollowEntity.particleEntity, 1);

			// let plane = new Plane3DEntity();
			// plane.initializeXOZ(-500.0, -500.0, 1000.0, 1000.0, [ this.getImageTexByUrl("static/assets/wood_02.jpg") ]);
			// plane.setXYZ(0, -50, 0);
			// this.m_rscene.addEntity(plane);

			let container = new DisplayEntityContainer();
            container.setXYZ(100.0, 100.0, 100.0);
            let containerB = new DisplayEntityContainer();
            containerB.addChild(container);
            this.m_container = container;
            this.m_containerMain = containerB;

			this.update();
		}
	}
    private m_container: DisplayEntityContainer = null;
    private m_containerMain: DisplayEntityContainer = null;
	private m_pathFollowEntity: PathFollowParticle = new PathFollowParticle();
	private m_timeoutId: any = -1;
	position = new Vector3D();
	mouseDownListener(evt: any): void {
		console.log("mouseDownListener(), call ...");
		this.m_viewRay.intersectPlane();
		let pv = this.m_viewRay.position;
		this.m_pathFollowEntity.addPosition(pv, 1, 20);
	}
	private update(): void {

		if (this.m_timeoutId > -1) {
			clearTimeout(this.m_timeoutId);
		}
		this.m_timeoutId = setTimeout(this.update.bind(this), 20); // 50 fps
		
		this.m_container.setRotationY(this.m_container.getRotationY() + 1.0);
		this.m_containerMain.setRotationZ(this.m_containerMain.getRotationZ() + 1.0);
		this.m_containerMain.update();

		let pv = this.position;
		pv.setXYZ(300.0, 10.0, 300.0);
        this.m_container.localToGlobal(pv);
		const total = Math.random() * 3 + 1;
		const spaceRange = Math.random() * 15 + 5;
		this.m_pathFollowEntity.addPosition(pv, total, spaceRange);
		
		this.m_pathFollowEntity.run();
	}
	run(): void {
		this.m_rscene.run();
	}
}
export default DemoParticleFollowGroup2;
