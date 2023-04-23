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
import { PathFollowParticleShooter, FollowParticleParam, ParticleShootParam, PathFollowParticle } from "../particle/base/PathFollowParticle";
import DisplayEntityContainer from "../vox/entity/DisplayEntityContainer";
import RendererState from "../vox/render/RendererState";
import Box3DEntity from "../vox/entity/Box3DEntity";
import IDefault3DMaterial from "../vox/material/mcase/IDefault3DMaterial";
import IRenderEntity from "../vox/render/IRenderEntity";
import Sphere3DEntity from "../vox/entity/Sphere3DEntity";
import IDisplayEntity from "../vox/entity/IDisplayEntity";

export class DemoParticleFollowMultiGroups {
	constructor() {}
	private m_rscene: RendererScene = null;
	private m_texLoader: ImageTextureLoader = null;
	private m_axis: Axis3DEntity = null;
	private m_viewRay = new CameraViewRay();

	private getAssetTexByUrl(pns: string): TextureProxy {
		return this.getTexByUrl("static/assets/" + pns);
	}
	private getTexByUrl(url: string, wrapRepeat: boolean = true, mipmapEnabled = true): TextureProxy {
		let hostUrl = window.location.href;
		if (hostUrl.indexOf(".artvily.") > 0) {
			hostUrl = "http://www.artvily.com:9090/";
			url = hostUrl + url;
		}
		let ptex = this.m_texLoader.getImageTexByUrl(url);
		ptex.mipmapEnabled = mipmapEnabled;
		if (wrapRepeat) ptex.setWrap(TextureConst.WRAP_REPEAT);

		return ptex;
	}
	initialize(): void {
		console.log("DemoParticleFollowMultiGroups::initialize()......");
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

			let texs = [this.getTexByUrl("static/assets/testEFT4_monochrome3.jpg")];
			let fpParam = new FollowParticleParam();
			fpParam.brnOrAlphaRange = 1.0;
			fpParam.textures = texs;
			fpParam.speedScale = 3.0;
			fpParam.lifetimeScale = 2.0;
			fpParam.accelerationScale = 0.001;
			fpParam.clipEnabled = true;
			fpParam.clipMixEnabled = true;
			// fpParam.uvParams = texs;
			// this.m_followParticle.initialize(1000, fpParam);
			// this.m_flowBill = this.m_followParticle.particleEntity;
			// // this.m_flowBill.setXYZ(0,);
			// this.m_rscene.addEntity(this.m_followParticle.particleEntity, 1);

			this.m_pathFollowEntity.initialize(2000, fpParam);
			let entity = this.m_pathFollowEntity.particleEntity;
			this.m_rscene.addEntity(entity, 1);
			entity.setRGB3f(0.5,1.2,0.3);
			this.m_shooter0 = this.m_pathFollowEntity.createShooter();
			this.m_shooter0.setShootParam(this.m_shootParam0);

			this.m_shootParam1.setlifetimeScaleRange(0.2, 1.0);
			this.m_shooter1 = this.m_pathFollowEntity.createShooter();
			this.m_shooter1.setShootParam(this.m_shootParam1);

			this.m_shooter2 = this.m_pathFollowEntity.createShooter();
			this.m_shooter2.setShootParam(this.m_shootParam1);

			// entity.setRGBOffset3f(0.2,-0.2,-0.5);
			// this.m_pathFollowEntity.particleEntity.setRenderState(RendererState.BACK_ADD_BLENDSORT_STATE);
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

			this.m_container.setRotationY(Math.random() * 200);
			this.m_containerMain.setRotationZ(Math.random() * 200);
			this.m_containerMain.setRotationX(Math.random() * 200);
			this.m_containerMain.update();

			let envBox = new Box3DEntity();
			envBox.showFrontFace();
			envBox.initializeCube(3000, [this.getTexByUrl("static/assets/brickwall_big512.jpg")]);
			envBox.setUVScale(5.0, 5.0);
			this.m_rscene.addEntity(envBox, 0);

			let sph = new Sphere3DEntity();
			sph.initialize(10, 20, 20, [this.getTexByUrl("static/assets/color_01.jpg")]);
			sph.setRGB3f(0.5, 1.0, 0.5);
			this.m_rscene.addEntity(sph, 1);
			this.m_followEntity0 = sph;

			sph = new Sphere3DEntity();
			sph.copyMeshFrom(this.m_followEntity0 );
			sph.initialize(10, 20, 20, [this.getTexByUrl("static/assets/color_01.jpg")]);
			sph.setRGB3f(0.5, 1.0, 0.5);
			this.m_rscene.addEntity(sph, 1);
			this.m_followEntity1 = sph;

			sph = new Sphere3DEntity();
			sph.copyMeshFrom(this.m_followEntity0);
			sph.initialize(10, 20, 20, [this.getTexByUrl("static/assets/color_01.jpg")]);
			sph.setRGB3f(0.5, 1.0, 0.5);
			this.m_rscene.addEntity(sph, 1);
			this.m_followEntity2 = sph;
			this.update();
			document.body.style.overflow = "hidden";
		}
	}
	private m_followEntity0: IRenderEntity = null;
	private m_followEntity1: IRenderEntity = null;
	private m_followEntity2: IRenderEntity = null;
	private m_shootParam0 = new ParticleShootParam();
	private m_shootParam1 = new ParticleShootParam();
	private m_shooter0: PathFollowParticleShooter = null;
	private m_shooter1: PathFollowParticleShooter = null;
	private m_shooter2: PathFollowParticleShooter = null;

	private m_container: DisplayEntityContainer = null;
	private m_containerMain: DisplayEntityContainer = null;
	private m_pathFollowEntity = new PathFollowParticle();
	private m_timeoutId: any = -1;
	private m_time = 0.0;
	position = new Vector3D();
	mouseDownListener(evt: any): void {
		console.log("mouseDownListener(), call ...");
		this.m_viewRay.intersectPlane();
	}
	private m_rTime = 0.0;
	private m_gTime = 0.0;
	private update(): void {
		if (this.m_timeoutId > -1) {
			clearTimeout(this.m_timeoutId);
		}
		this.m_timeoutId = setTimeout(this.update.bind(this), 20); // 50 fps
		const cmain = this.m_containerMain;
		this.m_container.setRotationY(this.m_container.getRotationY() + 1.0);
		cmain.setRotationZ(cmain.getRotationZ() + 0.8);
		cmain.setRotationX(cmain.getRotationX() + 0.8);
		this.m_time += 0.01;
		cmain.setScaleY(Math.cos(this.m_time) * 2.0);
		// console.log("sy: ", this.m_containerMain.getScaleY());
		cmain.update();

		let pv = this.position;
		// shooter 0
		pv.setXYZ(300.0, 10.0, 300.0);
		this.m_container.localToGlobal(pv);
		this.m_followEntity0.setPosition( pv );
		this.m_shooter0.shoot(pv);

		// shooter 1
		pv.setXYZ(-200.0, 100.0, 300.0);
		this.m_container.localToGlobal(pv);
		this.m_followEntity1.setPosition( pv.scaleBy(-1.0) );
		this.m_shooter1.shoot(pv);

		// shooter 2
		pv.setXYZ(200.0, 100.0, -300.0);
		this.m_container.localToGlobal(pv);
		this.m_followEntity2.setPosition( pv );
		this.m_shooter2.shoot(pv);

		this.m_pathFollowEntity.run();

		let entity = this.m_pathFollowEntity.particleEntity;
		let c = entity.getColor();
		c.r = Math.abs(Math.cos(this.m_rTime += 0.002));
		c.g = Math.abs(Math.sin(100 + (this.m_gTime += 0.0025)));
		entity.setColor(c);
	}
	run(): void {
		this.m_rscene.run();
	}
}
export default DemoParticleFollowMultiGroups;
