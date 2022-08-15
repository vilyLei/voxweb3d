import { CoDataFormat } from "../app/CoSpaceAppData";

import { ICoRendererScene } from "../voxengine/scene/ICoRendererScene";
import { IMouseInteraction } from "../voxengine/ui/IMouseInteraction";
import { ICoRenderer } from "../voxengine/ICoRenderer";
import { CoMaterialContextParam, ICoRScene } from "../voxengine/ICoRScene";

import { ICoMouseInteraction } from "../voxengine/ui/ICoMouseInteraction";
import ViewerMaterialCtx from "./coViewer/ViewerMaterialCtx";
import { TextPackedLoader } from "../modules/loaders/TextPackedLoader";
import { ModuleLoader } from "../modules/loaders/ModuleLoader";
import { ViewerCoSApp } from "./coViewer/ViewerCoSApp";
import { Billboard } from "../particle/entity/Billboard";
import BillboardFlowEntity from "../particle/entity/BillboardFlowGroup";
import IRenderTexture from "../../vox/render/texture/IRenderTexture";

declare var CoRenderer: ICoRenderer;
declare var CoRScene: ICoRScene;
declare var CoMouseInteraction: ICoMouseInteraction;

import { RenderableMaterialBlock } from "../../vox/scene/block/RenderableMaterialBlock";
import { MaterialContext } from "../../materialLab/base/MaterialContext";
import RendererDevice from "../../vox/render/RendererDevice";
import RendererParam from "../../vox/scene/RendererParam";
import RendererScene from "../../vox/scene/RendererScene";
import Axis3DEntity from "../../vox/entity/Axis3DEntity";
import Billboard3DFlowEntity from "../../vox/entity/Billboard3DFlowEntity";
import { UserInteraction } from "../../vox/engine/UserInteraction";
import Vector3D from "../../vox/math/Vector3D";

/**
 * cospace renderer
 */
export class DemoCoParticleFlow {
	private m_rscene: RendererScene = null;
	private m_mctx: MaterialContext = null;
	readonly interaction: UserInteraction = new UserInteraction();

	// private m_rscene: ICoRendererScene = null;
	private m_interact: IMouseInteraction = null;

	constructor() {}

	initialize(): void {
		document.onmousedown = (evt: any): void => {
			this.mouseDown(evt);
		};

		// this.initEngineModule();
		this.initDirecEngine();
	}

	private initDirecEngine(): void {

		RendererDevice.SHADERCODE_TRACE_ENABLED = true;
		RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;

		//RendererDevice.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;
		// DivLog.SetDebugEnabled(true);

		let rparam = new RendererParam();
		//rparam.maxWebGLVersion = 1;
		rparam.setCamProject(45, 50.0, 10000.0);
		rparam.setAttriStencil(true);
		rparam.setAttriAntialias(true);
		rparam.setCamPosition(1000.0, 1000.0, 1000.0);
		this.m_rscene = new RendererScene();
		this.m_rscene.initialize(rparam, 5);

		let rscene = this.m_rscene;
		let materialBlock = new RenderableMaterialBlock();
		materialBlock.initialize();
		rscene.materialBlock = materialBlock;

		this.m_mctx = new MaterialContext();
		this.m_mctx.initialize(this.m_rscene);

		this.m_rscene.setClearRGBColor3f(0.5, 0.5, 0.5);

		this.interaction.initialize(rscene);
		this.interaction.cameraZoomController.syncLookAt = true;

		this.initDirecScene();

		// let url = "static/cospace/engine/mouseInteract/CoMouseInteraction.umd.js";
		// new ModuleLoader(1, (): void => {
		// 	this.initInteract();
		// }).load(url);
	}

	private initDirecScene(): void {

		// let axis = new Axis3DEntity();
		// axis.initialize(100);
		// this.m_rscene.addEntity(axis);

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

		this.initFlowBillOneByOne(textures);
		// this.initFlowBill(textures[textures.length - 1], textures[2], true);
		this.initFlowBill(textures[textures.length - 1], null, false, true);
		// this.initFlowBill(textures[textures.length - 1], null, true, true);
		// this.initFlowBill(textures[textures.length - 2], null, true, true, false, true);
		// this.initFlowBill(textures[textures.length - 1], null, false, false);
	}

	private m_flowBill: Billboard3DFlowEntity = null;
	private m_flowBill2: BillboardFlowEntity = null;
	///*
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
		
		let billGroup = new BillboardFlowEntity();
		billGroup.createGroup(total);
		let pv: Vector3D = new Vector3D();
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
	/*
	private initFlowBill2(
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
		let billGroup: Billboard3DFlowEntity = new Billboard3DFlowEntity();
		billGroup.createGroup(total);
		let pv: Vector3D = new Vector3D();
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
		this.m_rscene.addEntity(billGroup);

		billGroup.setTime(5.0);
		this.m_flowBill = billGroup;
	}
	//*/

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
		let billGroup = new BillboardFlowEntity();
		billGroup.createGroup(total);
		let pv: Vector3D = new Vector3D();
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
			// if (this.m_flowBill != null) this.m_flowBill.updateTime(1.0);
			if (this.m_flowBill2 != null) this.m_flowBill2.updateTime(1.0);

			this.interaction.run();
			// if (this.m_interact != null) {
			// 	this.m_interact.run();
			// }
			this.m_rscene.run();
		}
	}

	private initEngineModule(): void {
		let url = "static/cospace/engine/mouseInteract/CoMouseInteraction.umd.js";
		let mouseInteractML = new ModuleLoader(2, (): void => {
			this.initInteract();
		});

		let url0 = "static/cospace/engine/renderer/CoRenderer.umd.js";
		let url1 = "static/cospace/engine/rscene/CoRScene.umd.js";

		new ModuleLoader(2, (): void => {
			if (this.isEngineEnabled()) {
				console.log("engine modules loaded ...");
				this.initRenderer();

				this.initScene();

				// new ViewerCoSApp().initialize((): void => {
				// 	this.loadOBJ();
				// });
			}
		})
			.addLoader(mouseInteractML)
			.load(url0)
			.load(url1);

		mouseInteractML.load(url);
	}
	private createDefaultEntity(): void {
		let axis = CoRScene.createAxis3DEntity();
		this.m_rscene.addEntity(axis);

		let texList = [this.createTexByUrl()];
		let material = CoRScene.createDefaultMaterial();
		material.setTextureList(texList);
		let entity = CoRScene.createDisplayEntity();
		entity.setMaterial(material);
		entity.copyMeshFrom(this.m_rscene.entityBlock.unitXOZPlane);
		entity.setScaleXYZ(700.0, 0.0, 700.0);
		this.m_rscene.addEntity(entity);
	}
	private initScene(): void {
		// this.createDefaultEntity();

		let texList = [this.createTexByUrl("static/assets/a_02_c.jpg")];
		console.log("create billboard entity...");
		let entity = new Billboard();
		entity.toBrightnessBlend();
		entity.initialize(130, 130, texList);
		entity.setXYZ(50, 100, 100);
		entity.setRotationZ(50);
		this.m_rscene.addEntity(entity.entity, 1);
	}
	isEngineEnabled(): boolean {
		return typeof CoRenderer !== "undefined" && typeof CoRScene !== "undefined";
	}

	private createTexByUrl(url: string = ""): IRenderTexture {
		let tex = this.m_rscene.textureBlock.createImageTex2D(64, 64, false);

		// this.m_plane = new Plane3DEntity();
		// this.m_plane.initializeXOZ(-400.0, -400.0, 800.0, 800.0, [tex]);
		// this.m_rscene.addEntity(this.m_plane);

		let img: HTMLImageElement = new Image();
		img.onload = (evt: any): void => {
			tex.setDataFromImage(img, 0, 0, 0, false);
		};
		img.src = url != "" ? url : "static/assets/box.jpg";
		return tex;
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
			// this.m_rscene = CoRScene.createRendererScene(rparam, 3);
			// this.m_rscene.setClearUint24Color(0x888888);
		}
	}
	private loadOBJ(): void {
		let baseUrl: string = "static/private/obj/";
		let url = baseUrl + "base.obj";
		url = baseUrl + "base4.obj";
	}
	private mouseDown(evt: any): void {}
	run1(): void {
		this.m_rscene;
		if (this.m_rscene != null) {
			if (this.m_interact != null) {
				this.m_interact.run();
			}
			this.m_rscene.run();
		}
	}
}

export default DemoCoParticleFlow;
