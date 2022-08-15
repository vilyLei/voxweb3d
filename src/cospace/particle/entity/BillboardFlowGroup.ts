/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import RendererState from "../../../vox/render/RendererState";
import DisplayEntity from "../../../vox/entity/DisplayEntity";
import IRenderMaterial from "../../../vox/render/IRenderMaterial";
import IRenderTexture from "../../../vox/render/texture/IRenderTexture";
import IRawMesh from "../../../vox/mesh/IRawMesh";
import BillboardFlowMesh from "../mesh/BillboardFlowMesh";
import { BillboardFlowMaterial } from "../material/BillboardFlowMaterial";


export default class BillboardFlowGroup {

    private m_billMaterial: BillboardFlowMaterial = null;
    private m_billMesh: BillboardFlowMesh = null;
    private m_brightnessEnabled: boolean = true;
    private m_alphaEnabled: boolean = false;
    private m_playOnce: boolean = false;
    private m_direcEnabled: boolean = false;
    private m_clipEnabled: boolean = false;
    private m_clipMixEnabled: boolean = false;
    private m_spdScaleEnabled: boolean = false;

	entity: DisplayEntity = new DisplayEntity();
	vbWholeDataEnabled: boolean = false;
    flipVerticalUV: boolean = false;
    premultiplyAlpha: boolean = false;

    constructor() {
        this.entity.setRenderState(RendererState.BACK_ADD_BLENDSORT_STATE);
    }
    createGroup(billboardTotal: number): void {
        // this.m_billMesh = this.getMesh();
        if (billboardTotal > 0 && this.m_billMesh == null) {
            this.m_billMesh = new BillboardFlowMesh();
            this.m_billMesh.createData(billboardTotal);
        }
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
    setVelocityAt(i: number, spdX: number, spdY: number, spdZ: number): void {
        if (this.m_billMesh != null) {
            this.m_billMesh.setVelocityAt(i, spdX, spdY, spdZ);
        }
    }
    setAccelerationAt(i: number, accX: number, accY: number, accZ: number): void {
        if (this.m_billMesh != null) {
            this.m_billMesh.setAccelerationAt(i, accX, accY, accZ);
        }
    }
    setUVRectAt(i: number, u: number, v: number, du: number, dv: number): void {
        if (this.m_billMesh != null) {
            this.m_billMesh.setUVRectAt(i, u, v, du, dv);
        }
    }
    setTimeAt(i: number, lifeTime: number, fadeInEndFactor: number, fadeOutBeginFactor: number, beginTime: number = 0.0): void {
        if (this.m_billMesh != null) {
            this.m_billMesh.setTimeAt(i, lifeTime, fadeInEndFactor, fadeOutBeginFactor, beginTime);
        }
    }
    setTimeSpeedAt(i: number, beginTime: number): void {
        if (this.m_billMesh != null) {
            this.m_billMesh.setTimeSpeedAt(i, beginTime);
        }
    }
    setTimeSpeed(i: number, timeSpeed: number): void {
        if (this.m_billMesh != null) {
            this.m_billMesh.setTimeSpeedAt(i, timeSpeed);
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

    setAcceleration(accX: number, accY: number, accZ: number): void {
        if (this.m_billMaterial != null) {
            this.m_billMaterial.setAcceleration(accX, accY, accZ);
        }
    }
    setSpdScaleMax(spdScaleMax: number, factor: number = 1.0): void {
        if (this.m_billMaterial != null) {
            this.m_billMaterial.setSpdScaleMax(spdScaleMax, factor);
        }
    }
    setClipUVParam(cn: number, total: number, du: number, dv: number): void {
        if (this.m_clipEnabled && this.m_billMaterial != null) {
            this.m_billMaterial.setClipUVParam(cn, total, du, dv);
        }
    }
    getTime(): number { return this.m_billMaterial.getTime(); };
    setTime(time: number): void {
        this.m_billMaterial.setTime(time);
    }
    /**
     * 设置深度偏移量
     * @param offset the value range: [-2.0 -> 2.0]
     */
    setDepthOffset(offset: number): void {
        this.m_billMaterial.setDepthOffset( offset );
    }
    updateTime(timeOffset: number): void {
        this.m_billMaterial.updateTime(timeOffset);
    }
    getScaleX(): number { return this.m_billMaterial.getScaleX(); }
    getScaleY(): number { return this.m_billMaterial.getScaleY(); }
    setScaleX(p: number): void { this.m_billMaterial.setScaleX(p); }
    setScaleY(p: number): void { this.m_billMaterial.setScaleY(p); }
    setScaleXY(sx: number, sy: number): void {
        this.m_billMaterial.setScaleXY(sx, sy);
    }
    createMaterial(texList: IRenderTexture[]): void {
        if (this.m_billMaterial == null) {
            this.m_billMaterial = new BillboardFlowMaterial(this.m_brightnessEnabled, this.m_alphaEnabled, this.m_clipEnabled);
            this.m_billMaterial.setPlayParam(this.m_playOnce, this.m_direcEnabled, this.m_clipMixEnabled, this.m_spdScaleEnabled);
            this.m_billMaterial.diffuseMap = texList[0];
            this.m_billMaterial.premultiplyAlpha = this.premultiplyAlpha;

			this.m_billMaterial.initialize();
            this.entity.setMaterial(this.m_billMaterial.material);
			this.m_billMaterial.material.initializeByCodeBuf(texList.length > 0);
        }
    }
    toTransparentBlend(always: boolean = false): void {
        if (always) {
            this.entity.setRenderState(RendererState.BACK_TRANSPARENT_ALWAYS_STATE);
        }
        else {
            this.entity.setRenderState(RendererState.BACK_TRANSPARENT_STATE);
        }
    }
    toBrightnessBlend(always: boolean = false): void {
        if (always) {
            this.entity.setRenderState(RendererState.BACK_ADD_ALWAYS_STATE);
        }
        else {
            this.entity.setRenderState(RendererState.BACK_ADD_BLENDSORT_STATE);
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
		if (this.m_billMesh != null) {
            this.createMaterial(texList);
            this.activeMesh(this.m_billMaterial.material);
        }

    }
    protected createBounds(): void {
    }
    protected activeMesh(material: IRenderMaterial): void {

        	let mesh: IRawMesh = this.m_billMesh.mesh;
            mesh.vbWholeDataEnabled = this.vbWholeDataEnabled;
            this.m_billMesh.flipVerticalUV = this.flipVerticalUV;
            mesh.setBufSortFormat(material.getBufSortFormat());
            this.m_billMesh.initialize();
            this.entity.setMesh(mesh);
    }

    setUV(pu: number, pv: number, du: number, dv: number): void {
        if (this.m_billMesh != null) {
            this.m_billMesh.setUV(pu, pv, du, dv);
        }
    }
    update(): void {
        this.entity.update();
    }
    isAwake(): boolean {
        return this.m_playOnce && this.m_billMaterial.getTime() < this.m_billMesh.getEndTime();
    }
    destroy(): void {
        console.log("destroy flowEntity.");

		if( this.entity != null) {
			this.entity.destroy();
			this.entity = null;
		}
		if( this.m_billMesh != null) {
			this.m_billMesh.destroy();
			this.m_billMesh = null;
		}
		if( this.m_billMaterial != null) {
			this.m_billMaterial.destroy();
			this.m_billMaterial = null;
		}
    }
}
