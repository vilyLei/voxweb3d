/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ROTransform from "../../vox/display/ROTransform";
import RendererState from "../../vox/render/RendererState";
import DisplayEntity from "../../vox/entity/DisplayEntity";
import MaterialBase from '../../vox/material/MaterialBase';
import BillboardFlowMaterial from "../../vox/material/mcase/BillboardFlowMaterial";
import TextureProxy from "../../vox/texture/TextureProxy";
import BillboardPlaneFlowMesh from "../../vox/mesh/BillboardPlaneFlowMesh";

export default class Billboard3DFlowEntity extends DisplayEntity {

    private m_currMaterial: BillboardFlowMaterial = null;
    private m_billMesh: BillboardPlaneFlowMesh = null;
    private m_brightnessEnabled: boolean = true;
    private m_alphaEnabled: boolean = false;
    private m_playOnce: boolean = false;
    private m_direcEnabled: boolean = false;
    private m_clipEnabled: boolean = false;
    private m_clipMixEnabled: boolean = false;
    private m_spdScaleEnabled: boolean = false;
    flipVerticalUV: boolean = false;
    premultiplyAlpha: boolean = false;
    
    constructor(transform: ROTransform = null) {
        super(transform);
        this.setRenderState(RendererState.BACK_ADD_BLENDSORT_STATE);
    }
    createGroup(billboardTotal: number): void {
        this.m_billMesh = this.getMesh() as BillboardPlaneFlowMesh;
        if (billboardTotal > 0 && this.m_billMesh == null) {
            this.m_billMesh = new BillboardPlaneFlowMesh();
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
        if (this.m_currMaterial != null) {
            this.m_currMaterial.setRGBA4f(pr, pg, pb, pa);
        }
    }
    setRGB3f(pr: number, pg: number, pb: number): void {
        if (this.m_currMaterial != null) {
            this.m_currMaterial.setRGB3f(pr, pg, pb);
        }
    }

    setRGBAOffset4f(pr: number, pg: number, pb: number, pa: number): void {
        if (this.m_currMaterial != null) {
            this.m_currMaterial.setRGBAOffset4f(pr, pg, pb, pa);
        }
    }
    setRGBOffset3f(pr: number, pg: number, pb: number): void {
        if (this.m_currMaterial != null) {
            this.m_currMaterial.setRGBOffset3f(pr, pg, pb);
        }
    }

    setAlpha(pa: number): void {
        if (this.m_currMaterial != null) {
            this.m_currMaterial.setAlpha(pa);
        }
    }
    getAlpha(): number {
        return this.m_currMaterial.getAlpha();
    }
    setBrightness(brighness: number): void {
        this.m_currMaterial.setBrightness(brighness);
    }
    getBrightness(): number {
        return this.m_currMaterial.getBrightness();
    }

    setAcceleration(accX: number, accY: number, accZ: number): void {
        if (this.m_currMaterial != null) {
            this.m_currMaterial.setAcceleration(accX, accY, accZ);
        }
    }
    setSpdScaleMax(spdScaleMax: number, factor: number = 1.0): void {
        if (this.m_currMaterial != null) {
            this.m_currMaterial.setSpdScaleMax(spdScaleMax, factor);
        }
    }
    setClipUVParam(cn: number, total: number, du: number, dv: number): void {
        if (this.m_clipEnabled && this.m_currMaterial != null) {
            this.m_currMaterial.setClipUVParam(cn, total, du, dv);
        }
    }
    getTime(): number { return this.m_currMaterial.getTime(); };
    setTime(time: number): void {
        this.m_currMaterial.setTime(time);
    }
    /**
     * 设置深度偏移量
     * @param offset the value range: [-2.0 -> 2.0]
     */
    setDepthOffset(offset: number): void {
        this.m_currMaterial.setDepthOffset( offset );
    }
    updateTime(timeOffset: number): void {
        this.m_currMaterial.updateTime(timeOffset);
    }
    getScaleX(): number { return this.m_currMaterial.getScaleX(); }
    getScaleY(): number { return this.m_currMaterial.getScaleY(); }
    setScaleX(p: number): void { this.m_currMaterial.setScaleX(p); }
    setScaleY(p: number): void { this.m_currMaterial.setScaleY(p); }
    setScaleXY(sx: number, sy: number): void {
        this.m_currMaterial.setScaleXY(sx, sy);
    }
    createMaterial(texList: TextureProxy[]): void {
        if (this.getMaterial() == null) {
            this.m_currMaterial = new BillboardFlowMaterial(this.m_brightnessEnabled, this.m_alphaEnabled, this.m_clipEnabled);
            this.m_currMaterial.setPlayParam(this.m_playOnce, this.m_direcEnabled, this.m_clipMixEnabled, this.m_spdScaleEnabled);
            this.m_currMaterial.setTextureList(texList);
            this.m_currMaterial.premultiplyAlpha = this.premultiplyAlpha;
            this.setMaterial(this.m_currMaterial);
        }
        else {
            this.m_currMaterial = this.getMaterial() as BillboardFlowMaterial;
            this.m_currMaterial.setTextureList(texList);
        }
    }
    toTransparentBlend(always: boolean = false): void {
        if (always) {
            this.setRenderState(RendererState.BACK_TRANSPARENT_ALWAYS_STATE);
        }
        else {
            this.setRenderState(RendererState.BACK_TRANSPARENT_STATE);
        }
    }
    toBrightnessBlend(always: boolean = false): void {
        if (always) {
            this.setRenderState(RendererState.BACK_ADD_ALWAYS_STATE);
        }
        else {
            this.setRenderState(RendererState.BACK_ADD_BLENDSORT_STATE);
        }
    }
    setPlayParam(playOnce: boolean, direcEnabled: boolean, clipMixEnabled: boolean = false, spdScaleEnabled: boolean = false): void {
        this.m_playOnce = playOnce;
        this.m_direcEnabled = direcEnabled;
        this.m_clipMixEnabled = clipMixEnabled;
        this.m_spdScaleEnabled = spdScaleEnabled;
    }
    initialize(brightnessEnabled: boolean, alphaEnabled: boolean, clipEnabled: boolean, texList: TextureProxy[]): void {
        this.m_clipEnabled = clipEnabled;
        this.m_brightnessEnabled = brightnessEnabled;
        this.m_alphaEnabled = alphaEnabled;
        if (this.m_billMesh != null) {
            this.createMaterial(texList);
            this.activeDisplay();
        }
        else {
            console.error("billMesh is null, please call createGroup() function!");
        }
    }
    protected createBounds(): void {
    }
    protected __activeMesh(material: MaterialBase): void {
        if (this.getMesh() == null) {
            let mesh: BillboardPlaneFlowMesh = this.m_billMesh;
            mesh.vbWholeDataEnabled = this.vbWholeDataEnabled;
            mesh.flipVerticalUV = this.flipVerticalUV;
            mesh.setBufSortFormat(material.getBufSortFormat());
            mesh.initialize();
            this.setMesh(mesh);
        }
    }

    setUV(pu: number, pv: number, du: number, dv: number): void {
        if (this.m_billMesh != null) {
            this.m_billMesh.setUV(pu, pv, du, dv);
        }
    }
    update(): void {
        this.m_transfrom.update();
    }
    isAwake(): boolean {
        return this.m_playOnce && this.m_currMaterial.getTime() < this.m_billMesh.getEndTime();
    }
    destroy(): void {
        console.log("destroy flowEntity.");
        this.m_currMaterial = null;
        this.m_billMesh = null;
        super.destroy();
    }
    toString(): string {
        return "Billboard3DFlowEntity(uid = " + this.getUid() + ", rseFlag = " + this.__$rseFlag + ")";
    }
}