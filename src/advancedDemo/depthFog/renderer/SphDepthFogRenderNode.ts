/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
import Vector3D from "../../../vox/math/Vector3D";
import { RenderBlendMode, CullFaceMode, DepthTestMode } from "../../../vox/render/RenderConst";
import TextureConst from "../../../vox/texture/TextureConst";
import TextureProxy from "../../../vox/texture/TextureProxy";
import ImageTextureLoader from "../../../vox/texture/ImageTextureLoader";

import RendererState from "../../../vox/render/RendererState";
import FBOInstance from "../../../vox/scene/FBOInstance";
import RendererScene from "../../../vox/scene/RendererScene";

import Sphere3DEntity from "../../../vox/entity/Sphere3DEntity";

import { IRTTTexture } from "../../../vox/render/texture/IRTTTexture";
import TextureFormat from "../../../vox/texture/TextureFormat";
import TextureDataType from "../../../vox/texture/TextureDataType";
import IRenderNode from "../../../vox/scene/IRenderNode";
import RendererDevice from "../../../vox/render/RendererDevice";

import { FogSphFactorMaterial } from "./FogSphFactorMaterial";
import { SphDepthFogUnit } from "./SphDepthFogUnit";
import { FogSphShowMaterial } from "./FogSphShowMaterial";

export class SphDepthFogRenderNode implements IRenderNode {
	constructor() {}

	private m_rc: RendererScene = null;
	private m_factorFBO: FBOInstance = null;
	private m_commonFBO: FBOInstance = null;

	texLoader: ImageTextureLoader = null;
	factorEntityIndex = 0;
	maxRadius = 800.0;

	private m_factorEntity: Sphere3DEntity;
	private m_fogFactorM: FogSphFactorMaterial;
	private getImageTexByUrl(pns: string): TextureProxy {
		let tex: TextureProxy = this.texLoader.getImageTexByUrl("static/assets/" + pns);
		tex.setWrap(TextureConst.WRAP_REPEAT);
		tex.mipmapEnabled = true;
		return tex;
	}

	private m_texs: IRTTTexture[] = [null, null, null, null, null, null];
	public getTextureAt(index: number, float: boolean = false): IRTTTexture {
		if (this.m_texs[index] != null) {
			return this.m_texs[index];
		}
		let tex = (this.m_texs[index] = this.m_rc.textureBlock.createRTTTex2D());
		if (float) {
			tex.internalFormat = TextureFormat.RGBA16F;
			tex.srcFormat = TextureFormat.RGBA;
			if (RendererDevice.IsWebGL1()) {
				tex.dataType = TextureDataType.HALF_FLOAT_OES;
			} else {
				tex.dataType = TextureDataType.HALF_FLOAT;
			}
		} else {
			tex.internalFormat = TextureFormat.RGBA;
			tex.srcFormat = TextureFormat.RGBA;
		}
		tex.minFilter = TextureConst.NEAREST;
		tex.magFilter = TextureConst.NEAREST;

		return tex;
	}
	getCommonFBO(): FBOInstance {
		return this.m_commonFBO;
	}
	getFactorFBO(): FBOInstance {
		return this.m_factorFBO;
	}
	private createCommonFBO(rpids: number[]): void {
		let fbo = this.m_rc.createFBOInstance();
		fbo.setClearRGBAColor4f(0.0, 0.0, 0.0, 1.0);
		fbo.createViewportSizeFBOAt(0, true, false);
		fbo.setClearState(true, true, false);
		fbo.setRenderToTexture(this.getTextureAt(0, RendererDevice.IsWebGL1()), 0); // color
		fbo.setRenderToTexture(this.getTextureAt(1, true), 1); // depth
		fbo.setRProcessIDList(rpids, false);
		fbo.setAutoRunning( true );
		this.m_commonFBO = fbo;
	}

	private createParticleFBO(rpids: number[]): void {
		let fbo = this.m_commonFBO.clone();
		fbo.setRenderToTexture(this.getTextureAt(0, RendererDevice.IsWebGL1()), 0);
		fbo.setClearState(false, false, false);
		fbo.setRProcessIDList(rpids, false);
		fbo.setAutoRunning( true );
	}
	private createFactorFBO(): void {
		let fbo = this.m_rc.createFBOInstance();
		fbo.setClearRGBAColor4f(0.0, 0.0, 0.0, 0.0);
		fbo.createViewportSizeFBOAt(1, true, false);
		fbo.setClearState(true, true, false);
		fbo.setRenderToTexture(this.getTextureAt(2, false), 0);
		fbo.setRenderToTexture(this.getTextureAt(3, false), 1);
		this.m_factorFBO = fbo;
	}
	createDisplayMaterial(): FogSphShowMaterial {
		let m = new FogSphShowMaterial();
		m.setTextureList(
			[
				this.m_commonFBO.getRTTAt(0)
				, this.m_factorFBO.getRTTAt(0)
				, this.m_factorFBO.getRTTAt(1)
			]
		);
		return m;
	}
	initialize(rc: RendererScene, conmonPIds: number[], particlePIds: number[]): void {

		if (this.m_rc == null && rc) {

			this.m_rc = rc;
			this.createCommonFBO(conmonPIds);
			this.createParticleFBO(particlePIds);
			this.createFactorFBO();
			this.initFog();
			this.m_rc.prependRenderNode( this );
		}
	}
	private m_units: SphDepthFogUnit[] = [];
	private initFog(): void {
		let i: number = 0;
		let rState0 = RendererState.CreateRenderState("ADD02", CullFaceMode.FRONT, RenderBlendMode.BLAZE, DepthTestMode.ALWAYS);
		let rState1 = RendererState.BACK_TRANSPARENT_ALWAYS_STATE;
		this.maxRadius = 800.0; //141.25;
		let baseRadius = this.maxRadius;
		let fogUnit: SphDepthFogUnit;
		for (i = 0; i < 40; ++i) {
			fogUnit = new SphDepthFogUnit();
			if (Math.random() > 0.9) fogUnit.rstate = rState0;
			else fogUnit.rstate = rState1;
			const range = 2000.0;
			const halfR = range * 0.5;
			fogUnit.initWithRandomParam(baseRadius, range);
			let r = fogUnit.radius;
			fogUnit.pos.setXYZ(Math.random() * range - halfR, Math.random() * range * 0.3 + r * 0.2, Math.random() * range - halfR);
			this.m_units.push(fogUnit);
		}
		// rState0 = RendererState.CreateRenderState("factorSphState", CullFaceMode.FRONT, RenderBlendMode.TRANSPARENT, DepthTestMode.ALWAYS);
		rState0 = RendererState.FRONT_TRANSPARENT_ALWAYS_STATE;
		// rState1 = rState0;
		// let tex3 = this.getImageTexByUrl("displacement_03.jpg");
		let tex3 = this.getImageTexByUrl("cloud_01.jpg");
		this.m_fogFactorM = new FogSphFactorMaterial();
		// this.m_fogFactorM.setDensity(1.5);
		this.m_factorEntity = new Sphere3DEntity();
		this.m_factorEntity.setRenderState(rState0);
		this.m_factorEntity.setMaterial(this.m_fogFactorM);
		this.m_factorEntity.initialize(1.0, 20, 20, [this.m_commonFBO.getRTTAt(1), tex3]);

		const fogM = this.m_fogFactorM;
		fogM.setFactorRGB3f(1.0, 1.0, 1.0);
		fogM.setFogDis(this.maxRadius);
	}
	private m_pv = new Vector3D();
	private m_status = 1;
	set status(status: number) {
		this.m_status = status % 3;
		console.log("this.m_status: ", this.m_status);
	}
	get status(): number {
		return this.m_status;
	}
	getTotal(): number {
		return this.m_units.length;
	}
	maxDistance = 7000.0;

	render(): void {
		if (this.m_rc) {
			let len = this.m_units.length;
			if (len > 0) {
				const status = this.m_status;
				const cam = this.m_rc.getCamera();
				for (let i = 0; i < len; ++i) {
					const t = this.m_units[i];
					t.dis = Vector3D.Distance(t.pos, cam.getPosition());
					t.dis -= t.radius;
					// t.dis = Math.round(t.dis - t.radius);
				}
				const entity = this.m_factorEntity;

				this.m_factorFBO.unlockMaterial();
				this.m_factorFBO.unlockRenderState();
				this.m_factorFBO.setClearColorEnabled(true);
				this.m_factorFBO.runBegin();

				// for test: select a displaying mode

				const fogM = this.m_fogFactorM;
				let fu: SphDepthFogUnit;

				const rst0 = RendererState.BACK_TRANSPARENT_STATE;
				const rst1 = RendererState.FRONT_TRANSPARENT_ALWAYS_STATE;

				let skipTotal = 0;

				const pv = this.m_pv;
				const viewMat = cam.getViewMatrix();

				for (let i = 0; i < len; ++i) {
					fu = this.m_units[i];
					pv.copyFrom(fu.pos).w = 1.0;
					if (fu.dis < this.maxDistance && fu.isAlive() && cam.visiTestSphere3(pv, fu.radius, -fu.radius * 0.1)) {
						const flag = cam.visiTestNearPlaneWithSphere(pv, fu.radius);
						// console.log("XXX flag: ", flag);
						if(flag == 1) {
							entity.setRenderState(rst0);
						}else {
							entity.setRenderState(rst1);
						}
						entity.setPosition(fu.pos);
						entity.setScaleXYZ(fu.radius, fu.radius, fu.radius);
						entity.update();
						// 将fog factor 写入到目标tex buf
						viewMat.transformOutVector3(fu.pos, pv);

						fogM.setRadius(fu.radius);
						fogM.setXYZ3f(pv.x, pv.y, pv.z);
						if (status < 1) {
							fogM.setFactorRGBColor(fu.factorColor);
						} else if (status == 1) {
							fogM.setFogRGBColor(fu.fogColor);
						}
						this.m_factorFBO.drawEntity(this.m_factorEntity);
					} else {
						skipTotal++;
					}
				}
				// console.log("skip volume Total: ", skipTotal);
			}
		}
	}
}
