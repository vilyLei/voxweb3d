/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IROTransform from "../../vox/display/IROTransform";
import RendererState from "../../vox/render/RendererState";
import DisplayEntity from "../../vox/entity/DisplayEntity";
import IRenderMaterial from "../../vox/render/IRenderMaterial";
import BillboardFlowMaterial from "../../vox/material/mcase/BillboardFlowMaterial";
import IRenderTexture from "../../vox/render/texture/IRenderTexture";
import BillboardPlaneFlowMesh from "../../vox/mesh/BillboardPlaneFlowMesh";
import Color4 from "../material/Color4";

export default class Billboard3DFlowEntity extends DisplayEntity {
	private m_mt: BillboardFlowMaterial = null;
	private m_mh: BillboardPlaneFlowMesh = null;
	private m_boundsBoo = true;
	private m_brightnessEnabled = true;
	private m_alphaEnabled = false;
	private m_playOnce = false;
	private m_direcEnabled = false;
	private m_clipEnabled = false;
	private m_clipMixEnabled = false;
	private m_spdScaleEnabled = false;

	flipVerticalUV = false;
	premultiplyAlpha = false;
	vtxColorEnabled = false;

	constructor(transform: IROTransform = null, bounds: boolean = true) {
		super(transform);
		this.m_boundsBoo = bounds;
		if (this.m_boundsBoo) {
			super.createBounds();
		}
		this.setRenderState(RendererState.BACK_ADD_BLENDSORT_STATE);
	}
	createGroup(billboardTotal: number): void {
		this.m_mh = this.getMesh() as BillboardPlaneFlowMesh;
		if (billboardTotal > 0 && this.m_mh == null) {
			this.m_mh = new BillboardPlaneFlowMesh();
			this.m_mh.vtxColorEnabled = this.vtxColorEnabled;
			this.m_mh.createData(billboardTotal);
		}
	}
	setSizeAndScaleAt(i: number, width: number, height: number, minScale: number, maxScale: number): void {
		if (this.m_mh) {
			this.m_mh.setSizeAndScaleAt(i, width, height, minScale, maxScale);
		}
	}
	setColorAt(i: number, color: Color4): void {
		if (this.m_mh) {
			this.m_mh.setColorAt(i, color.r, color.g, color.b, color.a);
		}
	}
	setPositionAt(i: number, x: number, y: number, z: number): void {
		if (this.m_mh) {
			this.m_mh.setPositionAt(i, x, y, z);
		}
	}
	setVelocityAt(i: number, spdX: number, spdY: number, spdZ: number): void {
		if (this.m_mh) {
			this.m_mh.setVelocityAt(i, spdX, spdY, spdZ);
		}
	}
	setAccelerationAt(i: number, accX: number, accY: number, accZ: number): void {
		if (this.m_mh) {
			this.m_mh.setAccelerationAt(i, accX, accY, accZ);
		}
	}
	setUVRectAt(i: number, u: number, v: number, du: number, dv: number): void {
		if (this.m_mh) {
			this.m_mh.setUVRectAt(i, u, v, du, dv);
		}
	}
	setTimeAt(i: number, lifeTime: number, fadeInEndFactor: number, fadeOutBeginFactor: number, beginTime: number = 0.0): void {
		if (this.m_mh) {
			this.m_mh.setTimeAt(i, lifeTime, fadeInEndFactor, fadeOutBeginFactor, beginTime);
		}
	}
	setTimeSpeedAt(i: number, beginTime: number): void {
		if (this.m_mh) {
			this.m_mh.setTimeSpeedAt(i, beginTime);
		}
	}
	setTimeSpeed(i: number, timeSpeed: number): void {
		if (this.m_mh) {
			this.m_mh.setTimeSpeedAt(i, timeSpeed);
		}
	}
	setAlphaAt(i: number, alpha: number): void {
		if (this.m_mh) {
			this.m_mh.setAlphaAt(i, alpha);
		}
	}
	setBrightnessAt(i: number, brightness: number): void {
		if (this.m_mh) {
			this.m_mh.setBrightnessAt(i, brightness);
		}
	}

	setRGBA4f(pr: number, pg: number, pb: number, pa: number): void {
		if (this.m_mt != null) {
			this.m_mt.setRGBA4f(pr, pg, pb, pa);
		}
	}
	setRGB3f(pr: number, pg: number, pb: number): void {
		if (this.m_mt != null) {
			this.m_mt.setRGB3f(pr, pg, pb);
		}
	}

	setRGBAOffset4f(pr: number, pg: number, pb: number, pa: number): void {
		if (this.m_mt != null) {
			this.m_mt.setRGBAOffset4f(pr, pg, pb, pa);
		}
	}
	setRGBOffset3f(pr: number, pg: number, pb: number): void {
		if (this.m_mt != null) {
			this.m_mt.setRGBOffset3f(pr, pg, pb);
		}
	}

	setAlpha(pa: number): void {
		if (this.m_mt != null) {
			this.m_mt.setAlpha(pa);
		}
	}
	getAlpha(): number {
		return this.m_mt.getAlpha();
	}
	setBrightness(brighness: number): void {
		this.m_mt.setBrightness(brighness);
	}
	getBrightness(): number {
		return this.m_mt.getBrightness();
	}

	setAcceleration(accX: number, accY: number, accZ: number): void {
		if (this.m_mt != null) {
			this.m_mt.setAcceleration(accX, accY, accZ);
		}
	}
	setSpdScaleMax(spdScaleMax: number, factor: number = 1.0): void {
		if (this.m_mt != null) {
			this.m_mt.setSpdScaleMax(spdScaleMax, factor);
		}
	}
	setClipUVParam(cn: number, total: number, du: number, dv: number): void {
		if (this.m_clipEnabled && this.m_mt != null) {
			this.m_mt.setClipUVParam(cn, total, du, dv);
		}
	}
	getTime(): number {
		if (this.m_mt) return this.m_mt.getTime();
		return 0;
	}
	setTime(time: number): void {
		if (this.m_mt) this.m_mt.setTime(time);
	}
	/**
	 * 设置深度偏移量
	 * @param offset the value range: [-2.0 -> 2.0]
	 */
	setDepthOffset(offset: number): void {
		if (this.m_mt) this.m_mt.setDepthOffset(offset);
	}
	updateTime(timeOffset: number): void {
		if (this.m_mt) this.m_mt.updateTime(timeOffset);
	}
	getScaleX(): number {
		return this.m_mt.getScaleX();
	}
	getScaleY(): number {
		return this.m_mt.getScaleY();
	}
	setScaleX(p: number): void {
		this.m_mt.setScaleX(p);
	}
	setScaleY(p: number): void {
		this.m_mt.setScaleY(p);
	}
	setScaleXY(sx: number, sy: number): void {
		this.m_mt.setScaleXY(sx, sy);
	}
	createMaterial(texList: IRenderTexture[]): void {
		if (this.getMaterial() == null) {
			this.m_mt = new BillboardFlowMaterial(this.m_brightnessEnabled, this.m_alphaEnabled, this.m_clipEnabled, this.vtxColorEnabled);
			this.m_mt.setPlayParam(this.m_playOnce, this.m_direcEnabled, this.m_clipMixEnabled, this.m_spdScaleEnabled);
			this.m_mt.setTextureList(texList);
			this.m_mt.premultiplyAlpha = this.premultiplyAlpha;
			this.setMaterial(this.m_mt);
		} else {
			this.m_mt = this.getMaterial() as BillboardFlowMaterial;
			this.m_mt.setTextureList(texList);
		}
	}
	toTransparentBlend(always: boolean = false): void {
		if (always) {
			this.setRenderState(RendererState.BACK_TRANSPARENT_ALWAYS_STATE);
		} else {
			this.setRenderState(RendererState.BACK_TRANSPARENT_STATE);
		}
	}
	toBrightnessBlend(always: boolean = false): void {
		if (always) {
			this.setRenderState(RendererState.BACK_ADD_ALWAYS_STATE);
		} else {
			this.setRenderState(RendererState.BACK_ADD_BLENDSORT_STATE);
		}
	}
	setPlayParam(playOnce: boolean, direcEnabled: boolean, clipMixEnabled: boolean = false, spdScaleEnabled: boolean = false): void {
		this.m_playOnce = playOnce;
		this.m_direcEnabled = direcEnabled;
		this.m_clipMixEnabled = clipMixEnabled;
		this.m_spdScaleEnabled = spdScaleEnabled;
	}
	initialize(brightnessEnabled: boolean, alphaEnabled: boolean, clipEnabled: boolean, texList: IRenderTexture[]): void {
		this.m_clipEnabled = clipEnabled;
		this.m_brightnessEnabled = brightnessEnabled;
		this.m_alphaEnabled = alphaEnabled;
		if (this.m_mh) {
			this.createMaterial(texList);
			this.activeDisplay();
		} else {
			console.error("billMesh is null, please call createGroup() function!");
		}
	}
	protected createBounds(): void {}
	protected __activeMesh(material: IRenderMaterial): void {
		if (this.getMesh() == null) {
			let mesh: BillboardPlaneFlowMesh = this.m_mh;
			mesh.vbWholeDataEnabled = this.vbWholeDataEnabled;
			mesh.flipVerticalUV = this.flipVerticalUV;
			mesh.setBufSortFormat(material.getBufSortFormat());
			mesh.initialize();
			this.setMesh(mesh);
		}
	}

	setUV(pu: number, pv: number, du: number, dv: number): void {
		if (this.m_mh) {
			this.m_mh.setUV(pu, pv, du, dv);
		}
	}
	update(): void {
		if (this.m_boundsBoo) {
			super.update();
		} else {
			this.m_trs.update();
		}
	}
	updateData(): void {
		if (this.m_mh) {
			this.m_mh.updateData();
		}
	}
	isAwake(): boolean {
		return this.m_playOnce && this.m_mt.getTime() < this.m_mh.getEndTime();
	}
	destroy(): void {
		if (this.m_mh) {
			this.m_mt = null;
			this.m_mh = null;
			super.destroy();
		}
	}
}
