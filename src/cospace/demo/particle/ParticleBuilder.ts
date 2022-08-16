
import { ICoRendererScene } from "../../voxengine/scene/ICoRendererScene";
import { ICoRScene } from "../../voxengine/ICoRScene";
import { ICoParticle } from "../../particle/ICoParticle";
import IBillboardFlareGroup from "../../particle/entity/IBillboardFlareGroup";
import IBillboardFlowGroup from "../../particle/entity/IBillboardFlowGroup";
import IRenderTexture from "../../../vox/render/texture/IRenderTexture";
import { IMaterialContext } from "../../../materialLab/base/IMaterialContext";

declare var CoRScene: ICoRScene;
declare var CoParticle: ICoParticle;

export default class ParticleBuilder {

	private m_rscene: ICoRendererScene = null;
	private m_mctx: IMaterialContext = null;

	constructor() { }

	initialize(rscene: ICoRendererScene, mctx: IMaterialContext): void {

		this.m_rscene = rscene;
		this.m_mctx = mctx;

		this.initScene();
	}

	private m_flowBill2: IBillboardFlowGroup = null;
	private m_flareBill2: IBillboardFlareGroup = null;
	private initScene(): void {

		let loader = this.m_mctx;
		let textures: IRenderTexture[] = [];
		textures.push(loader.getTextureByUrl("static/assets/default.jpg"));
		textures.push(loader.getTextureByUrl("static/assets/color_05.jpg"));
		textures.push(loader.getTextureByUrl("static/assets/color_03.jpg"));
		textures.push(loader.getTextureByUrl("static/assets/partile_tex_001.jpg"));
		textures.push(loader.getTextureByUrl("static/assets/arrow01.png"));
		textures.push(loader.getTextureByUrl("static/assets/guangyun_H_0007.png"));
		textures.push(loader.getTextureByUrl("static/assets/flare_core_01.jpg"));
		textures.push(loader.getTextureByUrl("static/assets/flare_core_02.jpg"));
		textures.push(loader.getTextureByUrl("static/assets/a_02_c.jpg"));
		textures.push(loader.getTextureByUrl("static/assets/xulie_02_07.png"));
		textures.push(loader.getTextureByUrl("static/assets/testEFT4.jpg"));
		textures.push(loader.getTextureByUrl("static/assets/testFT4.jpg"));

		// this.createDefaultEntity( textures );



		// let texList = [ textures[8] ];
		// console.log("create billboard entity...");
		// let billboard = CoParticle.createBillboard();
		// billboard.toBrightnessBlend();
		// billboard.initialize(130,130, texList);
		// billboard.setXYZ(50,100,100);
		// billboard.setRotationZ(50);
		// this.m_rscene.addEntity(billboard.entity, 1);

		
		// this.initFlowBillOneByOne(textures);
		// this.initFlowBill(textures[textures.length - 1], textures[2], true);
		// this.initFlowBill(textures[textures.length - 1], null, false, true);
		// this.initFlowBill(textures[textures.length - 1], null, true, true);
		this.initFlowBill(textures[textures.length - 2], null, true, true, false, true);
		// this.initFlowBill(textures[textures.length - 1], null, false, false);
		// this.initFlareBill(textures[textures.length - 1], textures[1], true);
		// this.initFlareBill(textures[textures.length - 1], textures[1], false);
		// this.initFlareBill(textures[textures.length - 1], null, true);
		//this.initFlareBill(textures[textures.length - 2], null, true, true);
		//this.initFlareBill(textures[textures.length - 1], null, false);


	}
	
	private initFlowBillOneByOne(textures: IRenderTexture[]): void {
		let size: number = 100;
		let params: number[][] = [
			[0.0, 0.0, 0.5, 0.5],
			[0.5, 0.0, 0.5, 0.5],
			[0.0, 0.5, 0.5, 0.5],
			[0.5, 0.5, 0.5, 0.5]
		];
		let tex = textures[textures.length - 1];
		let total: number = 15;

		let billGroup = CoParticle.createBillboardFlowGroup();
		billGroup.createGroup(total);
		let pv = CoRScene.createVec3();
		for (let i: number = 0; i < total; ++i) {
			size = Math.random() * Math.random() * Math.random() * 180 + 10.0;
			billGroup.setSizeAndScaleAt(i, size, size, 0.5, 1.0);
			let uvparam: number[] = params[Math.floor((params.length - 1) * Math.random() + 0.5)];
			billGroup.setUVRectAt(i, uvparam[0], uvparam[1], uvparam[2], uvparam[3]);
			billGroup.setTimeAt(i, 100.0 * Math.random() + 100, 0.4, 0.6, i * 100);
			billGroup.setBrightnessAt(i, Math.random() * 0.8 + 0.8);
			billGroup.setTimeSpeed(i, Math.random() * 1.0 + 0.5);
			//billGroup.setPositionAt(i,100.0,0.0,100.0);
			//billGroup.setPositionAt(i, Math.random() * 500.0 - 250.0,Math.random() * 500.0 - 250.0, Math.random() * 500.0 - 250.0);
			pv.setTo(Math.random() * 500.0 - 250.0, Math.random() * 50.0 + 50.0, Math.random() * 500.0 - 250.0);
			billGroup.setPositionAt(i, pv.x, pv.y, pv.z);

			//billGroup.setVelocityAt(i,0.0,Math.random() * 2.0 + 0.2,0.0);
			pv.normalize();
			pv.scaleBy((Math.random() * 2.0 + 0.2) * -1.0);
			//billGroup.setVelocityAt(i,pv.x,pv.y,pv.z);
		}
		billGroup.initialize(true, false, false, [tex]);
		this.m_rscene.addEntity(billGroup.entity);

		billGroup.setTime(5.0);
		this.m_flowBill2 = billGroup;
	}
	//*/

	private initFlareBill(tex: IRenderTexture, colorTex: IRenderTexture, clipEnabled: boolean = false, clipMixEnabled: boolean = false): void {
		let size: number = 100;
		let params: number[][] = [
			[0.0, 0.0, 0.5, 0.5],
			[0.5, 0.0, 0.5, 0.5],
			[0.0, 0.5, 0.5, 0.5],
			[0.5, 0.5, 0.5, 0.5]
		];
		let total: number = 15;
		let billGroup = CoParticle.createBillboardFlareGroup();
		billGroup.createGroup(total);
		for (let i: number = 0; i < total; ++i) {
			if (total > 1) size = Math.random() * Math.random() * Math.random() * 180 + 10.0;
			billGroup.setSizeAndScaleAt(i, size, size, 0.5, 1.0);
			if (!clipEnabled) {
				let uvparam: number[] = params[Math.floor((params.length - 1) * Math.random() + 0.5)];
				billGroup.setUVRectAt(i, uvparam[0], uvparam[1], uvparam[2], uvparam[3]);
			}
			billGroup.setTimeAt(i, 200.0 * Math.random() + 100, 0.4, 0.6, Math.random() * 6.0 + 0.2);
			billGroup.setBrightnessAt(i, Math.random() * 0.8 + 0.8);
			//billGroup.setPositionAt(i,100.0,0.0,100.0);
			billGroup.setPositionAt(i, Math.random() * 500.0 - 250.0, Math.random() * 500.0 - 250.0, Math.random() * 500.0 - 250.0);
			//billGroup.setPositionAt(i, Math.random() * 500.0 - 250.0,Math.random() * 100.0 - 50.0, Math.random() * 500.0 - 250.0);
		}
		billGroup.setPlayParam(clipMixEnabled);
		if (colorTex != null) {
			billGroup.initialize(true, false, clipEnabled, [tex, colorTex]);
			billGroup.setRGB3f(0.1, 0.1, 0.1);
		} else {
			billGroup.initialize(true, false, clipEnabled, [tex]);
		}
		//billGroup.setClipUVParam(4,16,0.25,0.25);
		billGroup.setClipUVParam(2, 4, 0.5, 0.5);

		this.m_rscene.addEntity(billGroup.entity);
		billGroup.setTime(0.0);
		this.m_flareBill2 = billGroup;
	}
	private initFlowBill(
		tex: IRenderTexture,
		colorTex: IRenderTexture,
		clipEnabled: boolean = false,
		playOnce: boolean = false,
		direcEnabled: boolean = false,
		clipMixEnabled: boolean = false
	): void {
		let size: number = 100;
		let params: number[][] = [
			[0.0, 0.0, 0.5, 0.5],
			[0.5, 0.0, 0.5, 0.5],
			[0.0, 0.5, 0.5, 0.5],
			[0.5, 0.5, 0.5, 0.5]
		];
		let total: number = 15;
		let billGroup = CoParticle.createBillboardFlowGroup();
		billGroup.createGroup(total);
		let pv = CoRScene.createVec3();
		for (let i: number = 0; i < total; ++i) {
			size = Math.random() * Math.random() * Math.random() * 180 + 10.0;
			billGroup.setSizeAndScaleAt(i, size, size, 0.5, 1.0);
			if (!clipEnabled) {
				let uvparam: number[] = params[Math.floor((params.length - 1) * Math.random() + 0.5)];
				billGroup.setUVRectAt(i, uvparam[0], uvparam[1], uvparam[2], uvparam[3]);
			}
			billGroup.setTimeAt(i, 200.0 * Math.random() + 300, 0.2, 0.8, 0.0);
			//billGroup.setTimeAt(i, 500.0, 0.4,0.6, 0.0);
			billGroup.setBrightnessAt(i, Math.random() * 0.8 + 0.8);
			//billGroup.setPositionAt(i,100.0,0.0,100.0);
			//billGroup.setPositionAt(i, Math.random() * 500.0 - 250.0,Math.random() * 500.0 - 250.0, Math.random() * 500.0 - 250.0);
			pv.setTo(Math.random() * 500.0 - 250.0, Math.random() * 50.0 + 50.0, Math.random() * 500.0 - 250.0);
			billGroup.setPositionAt(i, pv.x, pv.y, pv.z);

			//billGroup.setVelocityAt(i,0.0,Math.random() * 2.0 + 0.2,0.0);
			billGroup.setAccelerationAt(i, 0.003, -0.003, 0.0);
			billGroup.setVelocityAt(i, 0.0, 0.8 + Math.random() * 0.8, 0.0);
			pv.normalize();
			pv.scaleBy((Math.random() * 2.0 + 0.2) * -1.0);
			//billGroup.setVelocityAt(i,pv.x,pv.y,pv.z);
		}
		billGroup.setPlayParam(playOnce, direcEnabled, clipMixEnabled);
		if (colorTex != null) {
			billGroup.initialize(true, false, clipEnabled, [tex, colorTex]);
			billGroup.setRGB3f(0.1, 0.1, 0.1);
		} else {
			billGroup.initialize(true, false, clipEnabled, [tex]);
		}
		//billGroup.setClipUVParam(4,16,0.25,0.25);
		billGroup.setClipUVParam(2, 4, 0.5, 0.5);
		this.m_rscene.addEntity(billGroup.entity);

		billGroup.setTime(5.0);
		this.m_flowBill2 = billGroup;
	}

	run(): void {
		
		if (this.m_rscene != null) {
			if (this.m_flowBill2 != null) this.m_flowBill2.updateTime(1.0);
			if (this.m_flareBill2 != null) this.m_flareBill2.updateTime(1.0);
		}
	}
}
