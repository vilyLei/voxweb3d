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
import { FogMeshGeomFactorMaterial } from "../material/FogMeshGeomFactorMaterial";
import { FogUnit } from "./FogUnit";
import { IRTTTexture } from "../../../vox/render/texture/IRTTTexture";

export class FogSphBuilder {
	constructor() {}

	private m_rc: RendererScene = null;

	private m_factorFBO: FBOInstance = null;
	private m_disTex: IRTTTexture = null;
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
	initialize(rc: RendererScene, disTex: IRTTTexture, factorFBO: FBOInstance): void {
		if (this.m_rc == null) {
			this.m_rc = rc;
			this.m_disTex = disTex;
			this.m_factorFBO = factorFBO;

			this.initFog();
		}
	}
	private m_fogUnits: FogUnit[] = [];
	private initFog(): void {
		let i: number = 0;
		let rState0 = RendererState.CreateRenderState("ADD02", CullFaceMode.FRONT, RenderBlendMode.BLAZE, DepthTestMode.ALWAYS);
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
			this.m_fogUnits.push(fogUnit);
		}
		// rState0 = RendererState.CreateRenderState("factorSphState", CullFaceMode.FRONT, RenderBlendMode.TRANSPARENT, DepthTestMode.ALWAYS);
		rState0 = RendererState.FRONT_TRANSPARENT_ALWAYS_STATE;
		// rState1 = rState0;
		// let tex3 = this.getImageTexByUrl("displacement_03.jpg");
		let tex3 = this.getImageTexByUrl("cloud_01.jpg");
		this.fogFactorM = new FogMeshGeomFactorMaterial();
		// this.fogFactorM.setDensity(1.5);
		this.factorEntity = new Sphere3DEntity();
		this.factorEntity.setRenderState(rState0);
		this.factorEntity.setMaterial(this.fogFactorM);
		this.factorEntity.initialize(1.0, 20, 20, [this.m_disTex, tex3]);

		// this.m_rc.addEntity(this.factorEntity, this.m_factorFBO.getRProcessIDAt(0));
	}
	private m_pv = new Vector3D();
	private m_status = 1;
	setStatus(status: number): void {
		// this.m_status = status % 3;
		console.log("this.m_status: ", this.m_status);
	}
	getTotal(): number {
		return this.m_fogUnits.length;
	}
	private m_nodesTotal = 0;
	private m_rsn: FogUnit;

    private sorting(low: number, high: number): number {
        let arr = this.m_fogUnits;
        //标记位置为待排序数组段的low处也就时枢轴值
        this.m_rsn = arr[low];
        while (low < high) {
            //  如果当前数字已经有序的位于我们的枢轴两端，我们就需要移动它的指针，是high或是low
            while (low < high && arr[high].dis >= this.m_rsn.dis) {
                --high;
            }
            // 如果当前数字不满足我们的需求，我们就需要将当前数字移动到它应在的一侧
            arr[low] = arr[high];
            while (low < high && arr[low].dis <= this.m_rsn.dis) {
                ++low;
            }
            arr[high] = arr[low];
        }
        arr[low] = this.m_rsn;
        return low;
    }
    private snsort(low: number, high: number): void {
        if (low < high) {
            let pos = this.sorting(low, high);
            this.snsort(low, pos - 1);
            this.snsort(pos + 1, high);
        }
    }
	maxDistance = 7000.0;
	run(): void {

		if (this.m_rc) {
			let status = this.m_status;
			let len = this.m_fogUnits.length;
			this.m_nodesTotal = len;
			if (len > 0) {

				const cam = this.m_rc.getCamera();
				for(let i = 0; i < len; ++i) {
					const t = this.m_fogUnits[i];
					t.dis = Vector3D.Distance(t.pos, cam.getPosition());
					t.dis -= t.radius;
					// t.dis = Math.round(t.dis - t.radius);
				}
				// this.snsort(0, len - 1);
				// let i = 10;
				// console.log("this.m_fogUnits[0].dis: ", this.m_fogUnits[i].dis, Math.round(cam.getPosition().getLength()));
				const entity = this.factorEntity;

				this.m_factorFBO.unlockMaterial();
				this.m_factorFBO.unlockRenderState();
				this.m_factorFBO.setClearColorEnabled(true);
				this.m_factorFBO.runBegin();
				// for test: select a displaying mode
				const fogM = this.fogFactorM;
				switch (status) {
					case 0:
						fogM.setFogDis(this.maxRadius * 5.0);
						break;
					case 1:
						fogM.setFactorRGB3f(1.0, 1.0, 1.0);
						fogM.setFogDis(this.maxRadius * 1.0);
						break;
					case 2:
						fogM.setFactorRGB3f(1.0, 1.0, 1.0);
						fogM.setFogDis(this.maxRadius * 2.0);
						break;
					default:
						break;
				}


				let fu: FogUnit;

				let skipTotal = 0;

				const pv = this.m_pv;
				const viewMat = cam.getViewMatrix();

				for (let i = 0; i < len; ++i) {
					fu = this.m_fogUnits[i];
					pv.copyFrom(fu.pos).w = 1.0;
					if (fu.dis < this.maxDistance && fu.isAlive() && cam.visiTestSphere3(pv, fu.radius, -fu.radius * 0.1)) {

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
						this.m_factorFBO.drawEntity(this.factorEntity);
					} else {
						skipTotal++;
					}
				}
				// console.log("skip volume Total: ", skipTotal);
			}
		}
	}
}
