/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

// import RendererState from "../../../vox/render/RendererState";
import ITransformEntity from "../../../vox/entity/ITransformEntity";
import IRenderMaterial from "../../../vox/render/IRenderMaterial";
import IRenderTexture from "../../../vox/render/texture/IRenderTexture";
import IRawMesh from "../../../vox/mesh/IRawMesh";
import BillboardFlareMesh from "../mesh/BillboardFlareMesh";
import { BillboardFlareMaterial } from "../material/BillboardFlareMaterial";

import { ICoRScene } from "../../voxengine/ICoRScene";
declare var CoRScene: ICoRScene;

export default class BillboardFlowGroup {
	private m_billMaterial: BillboardFlareMaterial = null;
	private m_billMesh: BillboardFlareMesh = null;
	private m_brightnessEnabled: boolean = true;
	private m_alphaEnabled: boolean = false;
	private m_clipEnabled: boolean = false;
	private m_clipMixEnabled: boolean = false;

	entity: ITransformEntity = CoRScene.createDisplayEntity();
	vbWholeDataEnabled: boolean = false;
	flipVerticalUV: boolean = false;
	premultiplyAlpha: boolean = false;

	constructor() {
		this.entity.setRenderState(CoRScene.RendererState.BACK_ADD_BLENDSORT_STATE);
	}
	createGroup(billboardTotal: number): void {

		if (billboardTotal > 0 && this.m_billMesh == null) {
			this.m_billMesh = new BillboardFlareMesh();
			this.m_billMesh.createData(billboardTotal);
		}
	}
	private createMaterial(texList: IRenderTexture[]): void {
		if (this.m_billMaterial == null) {
			this.m_billMaterial = new BillboardFlareMaterial(this.m_brightnessEnabled, this.m_alphaEnabled, this.m_clipEnabled);
			this.m_billMaterial.diffuseMap = texList[0];
			this.m_billMaterial.premultiplyAlpha = this.premultiplyAlpha;

			this.m_billMaterial.initialize();
			this.entity.setMaterial(this.m_billMaterial.material);
			this.m_billMaterial.material.initializeByCodeBuf(texList.length > 0);
		}
	}
	protected activeMesh(material: IRenderMaterial): void {
		let mesh: IRawMesh = this.m_billMesh.mesh;
		mesh.vbWholeDataEnabled = this.vbWholeDataEnabled;
		this.m_billMesh.flipVerticalUV = this.flipVerticalUV;
		mesh.setBufSortFormat(material.getBufSortFormat());
		this.m_billMesh.initialize();
		this.entity.setMesh(mesh);
	}

	initialize(brightnessEnabled: boolean, alphaEnabled: boolean, clipEnabled: boolean, texList: IRenderTexture[]): void {
		this.m_clipEnabled = clipEnabled;
		this.m_brightnessEnabled = brightnessEnabled;
		this.m_alphaEnabled = alphaEnabled;
		if (this.m_billMesh != null) {
			this.createMaterial(texList);
			this.activeMesh(this.m_billMaterial.material);
		}
	}
	/**
	 * 设置深度偏移量
	 * @param offset the value range: [-2.0 -> 2.0]
	 */
	setDepthOffset(offset: number): void {
		this.m_billMaterial.setDepthOffset(offset);
	}
	setSizeAndScaleAt(i: number, width: number, height: number, minScale: number, maxScale: number): void {
		if (this.m_billMesh != null) {
			this.m_billMesh.setSizeAndScaleAt(i, width, height, minScale, maxScale);
		}
	}
	setPositionAt(i: number, x: number, y: number, z: number): void {
		if (this.m_billMesh != null) {
			this.m_billMesh.setPositionAt(i, x, y, z);
		}
	}
	setUVRectAt(i: number, u: number, v: number, du: number, dv: number): void {
		if (this.m_billMesh != null) {
			this.m_billMesh.setUVRectAt(i, u, v, du, dv);
		}
	}
	setTimeAt(i: number, lifeTime: number, fadeInEndFactor: number, fadeOutBeginFactor: number, timeSpeed: number = 1.0): void {
		if (this.m_billMesh != null) {
			this.m_billMesh.setTimeAt(i, lifeTime, fadeInEndFactor, fadeOutBeginFactor, timeSpeed);
		}
	}
	setAlphaAt(i: number, alpha: number): void {
		if (this.m_billMesh != null) {
			this.m_billMesh.setAlphaAt(i, alpha);
		}
	}
	setBrightnessAt(i: number, brightness: number): void {
		if (this.m_billMesh != null) {
			this.m_billMesh.setBrightnessAt(i, brightness);
		}
	}
	setRGBA4f(pr: number, pg: number, pb: number, pa: number): void {
		if (this.m_billMaterial != null) {
			this.m_billMaterial.setRGBA4f(pr, pg, pb, pa);
		}
	}
	setRGB3f(pr: number, pg: number, pb: number): void {
		if (this.m_billMaterial != null) {
			this.m_billMaterial.setRGB3f(pr, pg, pb);
		}
	}

	setRGBAOffset4f(pr: number, pg: number, pb: number, pa: number): void {
		if (this.m_billMaterial != null) {
			this.m_billMaterial.setRGBAOffset4f(pr, pg, pb, pa);
		}
	}
	setRGBOffset3f(pr: number, pg: number, pb: number): void {
		if (this.m_billMaterial != null) {
			this.m_billMaterial.setRGBOffset3f(pr, pg, pb);
		}
	}

	setAlpha(pa: number): void {
		if (this.m_billMaterial != null) {
			this.m_billMaterial.setAlpha(pa);
		}
	}
	getAlpha(): number {
		return this.m_billMaterial.getAlpha();
	}
	setBrightness(brighness: number): void {
		this.m_billMaterial.setBrightness(brighness);
	}
	getBrightness(): number {
		return this.m_billMaterial.getBrightness();
	}
	setClipUVParam(cn: number, total: number, du: number, dv: number): void {
		if (this.m_clipEnabled && this.m_billMaterial != null) {
			this.m_billMaterial.setClipUVParam(cn, total, du, dv);
		}
	}
	getTime(): number {
		return this.m_billMaterial.getTime();
	}
	setTime(time: number): void {
		this.m_billMaterial.setTime(time);
	}
	updateTime(timeOffset: number): void {
		this.m_billMaterial.updateTime(timeOffset);
	}
	getScaleX(): number {
		return this.m_billMaterial.getScaleX();
	}
	getScaleY(): number {
		return this.m_billMaterial.getScaleY();
	}
	setScaleX(p: number): void {
		this.m_billMaterial.setScaleX(p);
	}
	setScaleY(p: number): void {
		this.m_billMaterial.setScaleY(p);
	}
	setScaleXY(sx: number, sy: number): void {
		this.m_billMaterial.setScaleXY(sx, sy);
	}
	setPlayParam(clipMixEnabled: boolean): void {
		this.m_clipMixEnabled = clipMixEnabled;
	}

	toTransparentBlend(always: boolean = false): void {
		if (always) {
			this.entity.setRenderState(CoRScene.RendererState.BACK_TRANSPARENT_ALWAYS_STATE);
		} else {
			this.entity.setRenderState(CoRScene.RendererState.BACK_TRANSPARENT_STATE);
		}
	}
	toBrightnessBlend(always: boolean = false): void {
		if (always) {
			this.entity.setRenderState(CoRScene.RendererState.BACK_ADD_ALWAYS_STATE);
		} else {
			this.entity.setRenderState(CoRScene.RendererState.BACK_ADD_BLENDSORT_STATE);
		}
	}
	setUV(pu: number, pv: number, du: number, dv: number): void {
		if (this.m_billMesh != null) {
			this.m_billMesh.setUV(pu, pv, du, dv);
		}
	}
	update(): void {
		this.entity.update();
	}
	destroy(): void {
		console.log("destroy flareEntity.");

		if (this.entity != null) {
			this.entity.destroy();
			this.entity = null;
		}
		if (this.m_billMesh != null) {
			this.m_billMesh.destroy();
			this.m_billMesh = null;
		}
		if (this.m_billMaterial != null) {
			this.m_billMaterial.destroy();
			this.m_billMaterial = null;
		}
	}
}
