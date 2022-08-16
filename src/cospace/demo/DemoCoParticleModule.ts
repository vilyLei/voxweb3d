import { CoDataFormat } from "../app/CoSpaceAppData";

import { ICoRendererScene } from "../voxengine/scene/ICoRendererScene";
import { IMouseInteraction } from "../voxengine/ui/IMouseInteraction";
import { ICoRenderer } from "../voxengine/ICoRenderer";
import { CoMaterialContextParam, ICoRScene } from "../voxengine/ICoRScene";

import { ICoMouseInteraction } from "../voxengine/ui/ICoMouseInteraction";
import { ICoParticle } from "../particle/ICoParticle";
import ViewerMaterialCtx from "./coViewer/ViewerMaterialCtx";
import { TextPackedLoader } from "../modules/loaders/TextPackedLoader";
import { ModuleLoader } from "../modules/loaders/ModuleLoader";
import { ViewerCoSApp } from "./coViewer/ViewerCoSApp";
import IBillboard from "../particle/entity/IBillboard";
import IBillboardFlareGroup from "../particle/entity/IBillboardFlareGroup";
import IBillboardFlowGroup from "../particle/entity/IBillboardFlowGroup";
import IRenderTexture from "../../vox/render/texture/IRenderTexture";
import { IMaterialContext } from "../../materialLab/base/IMaterialContext";

declare var CoRenderer: ICoRenderer;
declare var CoRScene: ICoRScene;
declare var CoMouseInteraction: ICoMouseInteraction;
declare var CoParticle: ICoParticle;

/**
 * cospace renderer
 */
export class DemoCoParticleModule {
	private m_rscene: ICoRendererScene = null;
	private m_interact: IMouseInteraction = null;

	private m_vcoapp: ViewerCoSApp;
	private m_vmctx: ViewerMaterialCtx;
	private m_mctx: IMaterialContext = null;

	constructor() { }

	initialize(): void {

		document.onmousedown = (evt: any): void => {
			this.mouseDown(evt);
		};


		this.initEngineModule();

	}

	private initEngineModule(): void {

		let url = "static/cospace/engine/mouseInteract/CoMouseInteraction.umd.js";
		let mouseInteractML = new ModuleLoader(2, (): void => {
			this.initInteract();
		});

		let url0 = "static/cospace/engine/renderer/CoRenderer.umd.js";
		let url1 = "static/cospace/engine/rscene/CoRScene.umd.js";

		let url2 = "static/cospace/particle/CoParticle.umd.js";

		new ModuleLoader(2, (): void => {
			if (this.isEngineEnabled()) {
				console.log("engine modules loaded ...");
				this.initRenderer();

				// this.initScene();

				// this.m_vcoapp = new ViewerCoSApp();
				// this.m_vcoapp.initialize((): void => {
				// 	this.loadOBJ();
				// });
				new ModuleLoader(1, (): void => {
					this.initScene();
				}).load(url2)

			}
		}).addLoader(mouseInteractML)
			.load(url0)
			.load(url1);

		mouseInteractML.load(url);
	}
	private createDefaultEntity(textures: IRenderTexture[]): void {

		let axis = CoRScene.createAxis3DEntity();
		this.m_rscene.addEntity(axis);

		let texList = [textures[0]];
		let material = CoRScene.createDefaultMaterial();
		material.setTextureList(texList);
		let entity = CoRScene.createDisplayEntity();
		entity.setMaterial(material);
		entity.copyMeshFrom(this.m_rscene.entityBlock.unitXOZPlane);
		entity.setScaleXYZ(700.0, 0.0, 700.0);
		this.m_rscene.addEntity(entity);

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


		this.update();
	}
	isEngineEnabled(): boolean {
		return typeof CoRenderer !== "undefined" && typeof CoRScene !== "undefined";
	}

	private initInteract(): void {
		if (this.m_rscene != null && this.m_interact == null && typeof CoMouseInteraction !== "undefined") {
			this.m_interact = CoMouseInteraction.createMouseInteraction();
			this.m_interact.initialize(this.m_rscene);
			this.m_interact.setSyncLookAtEnabled(true);
		}
	}
	private initRenderer(): void {

		if (this.m_rscene == null) {

			let RendererDevice = CoRScene.RendererDevice;
			RendererDevice.SHADERCODE_TRACE_ENABLED = true;
			RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
			RendererDevice.SetWebBodyColor("#888888");

			let rparam = CoRScene.createRendererSceneParam();
			rparam.setAttriAntialias(!RendererDevice.IsMobileWeb());
			rparam.setCamPosition(1000.0, 1000.0, 1000.0);
			rparam.setCamProject(45, 20.0, 9000.0);
			this.m_rscene = CoRScene.createRendererScene(rparam, 3);
			this.m_rscene.setClearUint24Color(0x888888);

			this.m_mctx = CoRScene.createMaterialContext();
			this.m_mctx.initialize(this.m_rscene);

		}
	}
	private loadOBJ(): void {
		let baseUrl: string = "static/private/obj/";
		let url = baseUrl + "base.obj";
		url = baseUrl + "base4.obj";

	}
	private mouseDown(evt: any): void { }
	
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

	private m_timeoutId: any = -1;
	private update(): void {
		if (this.m_timeoutId > -1) {
			clearTimeout(this.m_timeoutId);
		}
		this.m_timeoutId = setTimeout(this.update.bind(this), 20); // 50 fps

		if (this.m_rscene != null) {
			if (this.m_flowBill2 != null) this.m_flowBill2.updateTime(1.0);
			if (this.m_flareBill2 != null) this.m_flareBill2.updateTime(1.0);
		}
	}
	run(): void {
		if (this.m_rscene != null) {
			if (this.m_interact != null) {
				this.m_interact.run();
			}
			this.m_rscene.run();
		}
	}
}

export default DemoCoParticleModule;
