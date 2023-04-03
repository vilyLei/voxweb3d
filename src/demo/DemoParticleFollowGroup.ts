import Vector3D from "../vox/math/Vector3D";
import RendererDevice from "../vox/render/RendererDevice";
import RendererParam from "../vox/scene/RendererParam";
import RendererScene from "../vox/scene/RendererScene";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";
import MouseEvent from "../vox/event/MouseEvent";

import Axis3DEntity from "../vox/entity/Axis3DEntity";
import Billboard3DFlowEntity from "../vox/entity/Billboard3DFlowEntity";
import TextureProxy from "../vox/texture/TextureProxy";
import TextureConst from "../vox/texture/TextureConst";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import CameraViewRay from "../vox/view/CameraViewRay";
import { MouseInteraction } from "../vox/ui/MouseInteraction";
import Color4 from "../vox/material/Color4";
import FollowParticle from "../particle/base/FollowParticle";
import Plane3DEntity from "../vox/entity/Plane3DEntity";

export class DemoParticleFollowGroup {
	constructor() {}
	private m_rscene: RendererScene = null;
	private m_texLoader: ImageTextureLoader = null;

	private m_axis: Axis3DEntity = null;
	private m_textures: TextureProxy[] = null;
	private m_viewRay = new CameraViewRay();
	private m_followParticle = new FollowParticle();
	getImageTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): TextureProxy {
		let ptex = this.m_texLoader.getImageTexByUrl(purl);
		ptex.mipmapEnabled = mipmapEnabled;
		if (wrapRepeat) ptex.setWrap(TextureConst.WRAP_REPEAT);
		return ptex;
	}

	initialize(): void {
		console.log("DemoParticleFollowGroup::initialize()......");
		if (this.m_rscene == null) {
			RendererDevice.SHADERCODE_TRACE_ENABLED = true;

			let rparam = new RendererParam();
			rparam.setTickUpdateTime(20);
			rparam.setAttriAlpha(false);
			rparam.setMatrix4AllocateSize(8192 * 4);
			rparam.setCamProject(45.0, 10.0, 3000.0);
			rparam.setCamPosition(1500.0, 1500.0, 1500.0);

			this.m_rscene = new RendererScene();
			this.m_rscene.initialize(rparam, 3);
			this.m_rscene.setRendererProcessParam(1, true, true);

			this.m_viewRay.initialize(this.m_rscene);
			this.m_viewRay.setPlaneParam(new Vector3D(0.0, 1.0, 0.0), 0.0);

			this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);

			this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDownListener);

			new RenderStatusDisplay(this.m_rscene, true).setParams(true);
			new MouseInteraction().initialize(this.m_rscene, 0, true).setAutoRunning(true);

			let axis = new Axis3DEntity();
			axis.initialize(300.0);
			this.m_rscene.addEntity(axis);
			let textures: TextureProxy[] = [];
			textures.push(this.getImageTexByUrl("static/assets/default.jpg"));
			// textures.push(this.getImageTexByUrl("static/assets/color_05.jpg"));
			// textures.push(this.getImageTexByUrl("static/assets/color_03.jpg"));
			// textures.push(this.getImageTexByUrl("static/assets/partile_tex_001.jpg"));
			// textures.push(this.getImageTexByUrl("static/assets/arrow01.png"));
			// textures.push(this.getImageTexByUrl("static/assets/guangyun_H_0007.png"));
			// textures.push(this.getImageTexByUrl("static/assets/flare_core_01.jpg"));
			// textures.push(this.getImageTexByUrl("static/assets/flare_core_02.jpg"));
			// textures.push(this.getImageTexByUrl("static/assets/a_02_c.jpg"));
			// textures.push(this.getImageTexByUrl("static/assets/xulie_02_07.png"));
			// textures.push(this.getImageTexByUrl("static/assets/testEFT4_01.jpg"));
			// textures.push(this.getImageTexByUrl("static/assets/testFT4.jpg"));
			// textures.push(this.getImageTexByUrl("static/assets/testEFT4_monochrome3.jpg"));
			// this.m_textures = textures;

			let texs = [this.getImageTexByUrl("static/assets/testEFT4_monochrome3.jpg")];
			this.m_followParticle.initialize(500, texs);
			this.m_flowBill = this.m_followParticle.particleEntity;
			// this.m_flowBill.setXYZ(0,);
			this.m_rscene.addEntity(this.m_followParticle.particleEntity, 1);
			//wood_02
			let plane = new Plane3DEntity();
			plane.initializeXOZ(-500.0, -500.0, 1000.0, 1000.0, [ this.getImageTexByUrl("static/assets/wood_02.jpg") ]);
			plane.setXYZ(0, -50, 0);
			//      //plane.toTransparentBlend(false);
			this.m_rscene.addEntity(plane);
			this.update();
		}
	}
	private initializeBillEntity(): void {
		if (this.m_rscene != null) {
			//  let charTex:TextureProxy = this.getImageTexByUrl("static/assets/letterA.png");
			//  let ripple:TextureProxy = this.getImageTexByUrl("static/assets/pattern.png");
			//  this.m_charTex = charTex;
			//  this.m_ripple = ripple;
			// this.initFlowBillOneByOne(this.m_textures);
			//this.initFlowDirecBill(this.m_textures[7], null, false, true,true,true);
			//  this.initFlowDirecBill(this.m_textures[4], null, false, true, true, true);
			// this.initFlowBill(this.m_textures[this.m_textures.length - 1],this.m_textures[2], true);
			//this.initFlowBill(this.m_textures[this.m_textures.length - 1],null, false, true);
			// this.initFlowBill(this.m_textures[this.m_textures.length - 1],null, true, true);
			// this.initFlowBill(this.m_textures[this.m_textures.length - 2],null, true, true,false,true);
			// this.initFlowBill(this.m_textures[this.m_textures.length - 1], null, false, false);
			// this.initFlowBill(this.m_textures[this.m_textures.length - 1], null, false, true);
			// let texs = [this.getImageTexByUrl("static/assets/testEFT4_monochrome3.jpg")];
			// this.m_followParticle.initialize(1, texs);
			// this.m_rscene.addEntity( this.m_followParticle.particleEntity );
			// this.m_flowBill = this.m_followParticle.particleEntity;
		}
	}
	private m_billInited: boolean = true;
	private m_flowBill: Billboard3DFlowEntity = null;
	private m_timeoutId: any = -1;
	position = new Vector3D();
	mouseDownListener(evt: any): void {
		console.log("mouseDownListener(), call ...");
		// if (this.m_flowBill != null) {
		// 	let currTime = this.m_flowBill.getTime();
		// 	this.m_flowBill.setPositionAt(0, 400 * Math.random() - 200, 0, 0);
		// 	this.m_flowBill.setTimeAt(0, 200.0 * Math.random() + 300, 0.2, 0.8, currTime);
		// 	this.m_flowBill.updateData();
		// 	this.m_flowBill.updateMeshToGpu();
		// }
		this.m_viewRay.intersectPlane();
		let pv = this.m_viewRay.position;
		this.m_followParticle.createParticles(pv, Math.round(Math.random() * 5) + 1, 20);
		return;
		if (this.m_flowBill != null) {
			//this.m_rscene.updateCamera();
			//this.m_rscene.getMouseXYWorldRay(this.m_rlpv, this.m_rltv);
			//Plane.IntersectionSLV2(this.m_pnv, this.m_pdis, this.m_rlpv, this.m_rltv, this.m_pv);
			if (this.m_axis) {
				this.m_axis.setPosition(pv);
				this.m_axis.update();
			}

			this.m_flowBill.setVisible(true);
			this.m_flowBill.setPosition(pv);
			this.m_flowBill.setAcceleration(Math.random() * 0.01 - 0.005, Math.random() * 0.002, Math.random() * 0.01 - 0.005);
			this.m_flowBill.setTime(0.0);
			this.m_flowBill.setRotationXYZ(0.0, Math.random() * 360.0, 0.0);
			this.m_flowBill.update();
		}
	}
	private update(): void {
		if (this.m_timeoutId > -1) {
			clearTimeout(this.m_timeoutId);
		}
		this.m_timeoutId = setTimeout(this.update.bind(this), 20); // 50 fps

		// if (this.m_flowBill) this.m_flowBill.updateTime(1.0);
		this.m_followParticle.run();
	}
	run(): void {
		this.m_rscene.run();
	}
}
export default DemoParticleFollowGroup;
