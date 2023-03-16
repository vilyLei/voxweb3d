/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
import Vector3D from "../../../vox/math/Vector3D";
import Stage3D from "../../../vox/display/Stage3D";
import { RenderBlendMode, CullFaceMode, DepthTestMode } from "../../../vox/render/RenderConst";
import TextureConst from "../../../vox/texture/TextureConst";
import TextureProxy from "../../../vox/texture/TextureProxy";
import ImageTextureLoader from "../../../vox/texture/ImageTextureLoader";

import CameraBase from "../../../vox/view/CameraBase";
import RendererState from "../../../vox/render/RendererState";
import { IRendererInstanceContext } from "../../../vox/scene/IRendererInstanceContext";
import FBOInstance from "../../../vox/scene/FBOInstance";
import RendererScene from "../../../vox/scene/RendererScene";

import Sphere3DEntity from "../../../vox/entity/Sphere3DEntity";
import { FogMeshGeomFactorMaterial } from "../../../advancedDemo/depthLight/material/FogMeshGeomFactorMaterial";
import { FogUnit } from "../../../advancedDemo/depthLight/scene/FogUnit";

export class FogSphSystem {
	constructor() {}

	private m_rc: RendererScene = null;
	private m_rct: IRendererInstanceContext = null;

	private m_middleFBO: FBOInstance = null;
	private m_factorFBO: FBOInstance = null;
	private m_stage3D: Stage3D = null;
	//
	texLoader: ImageTextureLoader = null;
	factorEntityIndex: number = 0;
	maxRadius: number = 800.0;
	//factorEntity:Plane3DEntity;
	factorEntity: Sphere3DEntity;
	fogFactorM: FogMeshGeomFactorMaterial;
	getImageTexByUrl(pns: string): TextureProxy {
		let tex: TextureProxy = this.texLoader.getImageTexByUrl("static/assets/" + pns);
		tex.setWrap(TextureConst.WRAP_REPEAT);
		tex.mipmapEnabled = true;
		return tex;
	}
	initialize(rc: RendererScene, middleFBO: FBOInstance, factorFBO: FBOInstance): void {
		if (this.m_rc == null) {
			this.m_rc = rc;
			this.m_rct = this.m_rc.getRendererContext();
			this.m_stage3D = this.m_rct.getStage3D() as Stage3D;
			this.m_middleFBO = middleFBO;
			this.m_factorFBO = factorFBO;

			this.initFog();
		}
	}
	private m_fogUnits: FogUnit[] = [];
	private initFog(): void {
		let i: number = 0;
		let rState0 = RendererState.CreateRenderState("ADD02", CullFaceMode.FRONT, RenderBlendMode.TRANSPARENT, DepthTestMode.ALWAYS);
		let rState1 = RendererState.BACK_TRANSPARENT_ALWAYS_STATE;
		this.maxRadius = 800.0; //141.25;
		let baseRadius = this.maxRadius;
		let fogUnit: FogUnit;
		for (i = 0; i < 40; ++i) {

			fogUnit = new FogUnit();
			if (Math.random() > 0.9) fogUnit.rstate = rState0;
			else fogUnit.rstate = rState1;
			const range = 2000.0;
			const halfR = range * 0.5;
			fogUnit.initRandom(baseRadius, range);
			let r = fogUnit.radius;
			fogUnit.pos.setXYZ(Math.random() * range - halfR, Math.random() * range * 0.3 + r * 0.2, Math.random() * range - halfR);
			//  fogUnit.radius = baseRadius * 0.6;
			//  fogUnit.fogColor.setRGB3f(1.0,1.0,1.0);
			//  fogUnit.factorColor.setRGB3f(1.0,1.0,1.0);
			//  fogUnit.pos.setXYZ(0.0,0.0,0.0);
			this.m_fogUnits.push(fogUnit);
		}
		// rState0 = RendererState.CreateRenderState("factorSphState", CullFaceMode.FRONT, RenderBlendMode.TRANSPARENT, DepthTestMode.ALWAYS);
		rState0 = RendererState.FRONT_TRANSPARENT_ALWAYS_STATE;
		// let tex3 = this.getImageTexByUrl("displacement_03.jpg");
		let tex3 = this.getImageTexByUrl("cloud_01.jpg");
		this.fogFactorM = new FogMeshGeomFactorMaterial();
		// this.fogFactorM.setDensity(1.5);
		this.factorEntity = new Sphere3DEntity();
		this.factorEntity.setRenderState(rState0);
		this.factorEntity.setMaterial(this.fogFactorM);
		this.factorEntity.initialize(1.0, 20, 20, [this.m_middleFBO.getRTTAt(1), tex3]);

		this.m_rc.addEntity(this.factorEntity, this.m_factorFBO.getRProcessIDAt(0));
	}
	private m_pv = new Vector3D();
	private m_status = 1;
	setStatus(status: number): void {
		this.m_status = status % 3;
		console.log("this.m_status: ", this.m_status);
	}
	runBegin(): void {}
	runBase(): void {
		if (this.m_rc) {
			// draw middle depth and color
			this.m_middleFBO.unlockRenderState();
			this.m_middleFBO.run();
		}
	}
	getFogVolumesTotal(): number {
		return this.m_fogUnits.length;
	}
	runFog(): void {

		if (this.m_rc) {
			let status = this.m_status;
			let len = this.m_fogUnits.length;
			if (len > 0) {
				this.m_factorFBO.unlockMaterial();
				this.m_factorFBO.unlockRenderState();
				this.m_factorFBO.setClearColorEnabled(true);
				this.m_factorFBO.runBegin();
				// for test: select a displaying mode

				switch (status) {
					case 0:
						this.fogFactorM.setFogDis(this.maxRadius * 5.0);
						break;
					case 1:
						this.fogFactorM.setFactorRGB3f(1.0, 1.0, 1.0);
						this.fogFactorM.setFogDis(this.maxRadius * 1.0);
						break;
					case 2:
						this.fogFactorM.setFactorRGB3f(1.0, 1.0, 1.0);
						this.fogFactorM.setFogDis(this.maxRadius * 2.0);
						break;
					default:
						break;
				}
				let fogUnit: FogUnit;
				let outerTotal = 0;
				const pv = this.m_pv;
				let cam = this.m_rc.getCamera();
				for (let i = 0; i < len; ++i) {
					fogUnit = this.m_fogUnits[i];
					pv.copyFrom(fogUnit.pos);
					this.m_pv.w = 1.0;
					if (fogUnit.isAlive() && cam.visiTestSphere3(pv, fogUnit.radius, -fogUnit.radius * 2.0)) {
					// if (fogUnit.isAlive()) {
						// this.factorEntity.setRenderState(fogUnit.rstate);
						this.factorEntity.setPosition(fogUnit.pos);
						this.factorEntity.setScaleXYZ(fogUnit.radius, fogUnit.radius, fogUnit.radius);
						this.factorEntity.update();
						// 将fog factor 写入到目标tex buf
						cam.getViewMatrix().transformOutVector3(fogUnit.pos, pv);

						this.fogFactorM.setRadius(fogUnit.radius);
						this.fogFactorM.setXYZ3f(pv.x, pv.y, pv.z);
						if (status < 1) {
							this.fogFactorM.setFactorRGBColor(fogUnit.factorColor);
						} else if (status == 1) {
							this.fogFactorM.setFogRGBColor(fogUnit.fogColor);
						}
						this.m_factorFBO.runAt(0);
					} else {
						outerTotal++;
					}
				}
				// console.log("outerTotal: ", outerTotal);
			}
		}
	}
}
