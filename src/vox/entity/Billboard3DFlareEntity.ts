/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IROTransform from "../../vox/display/IROTransform";
import RendererState from "../../vox/render/RendererState";
import DisplayEntity from "../../vox/entity/DisplayEntity";
import IRenderMaterial from "../../vox/render/IRenderMaterial";
import BillboardFlareMaterial from "../../vox/material/mcase/BillboardFlareMaterial";
import IRenderTexture from "../../vox/render/texture/IRenderTexture";
import BillboardPlaneFlareMesh from "../../vox/mesh/BillboardPlaneFlareMesh";

export default class Billboard3DFlareEntity extends DisplayEntity {
    private m_mt: BillboardFlareMaterial = null;
    private m_mh: BillboardPlaneFlareMesh = null;
    private m_brightnessEnabled: boolean = true;
    private m_alphaEnabled: boolean = false;
    private m_clipEnabled: boolean = false;
    private m_clipMixEnabled: boolean = false;
    flipVerticalUV = false;
    brnToAlpha = false;
    constructor(transform: IROTransform = null) {
        super(transform);
        this.setRenderState(RendererState.BACK_ADD_BLENDSORT_STATE);
    }
    createGroup(billboardTotal: number): void {
        if (billboardTotal > 0 && this.m_mh == null && this.getMesh() == null) {
            this.m_mh = new BillboardPlaneFlareMesh();
            this.m_mh.createData(billboardTotal);
        }
    }
    setSizeAndScaleAt(i: number, width: number, height: number, minScale: number, maxScale: number): void {
        if (this.m_mh != null) {
            this.m_mh.setSizeAndScaleAt(i, width, height, minScale, maxScale);
        }
    }
    setPositionAt(i: number, x: number, y: number, z: number): void {
        if (this.m_mh != null) {
            this.m_mh.setPositionAt(i, x, y, z);
        }
    }
    setUVRectAt(i: number, u: number, v: number, du: number, dv: number): void {
        if (this.m_mh != null) {
            this.m_mh.setUVRectAt(i, u, v, du, dv);
        }
    }
    setTimeAt(i: number, lifeTime: number, fadeInEndFactor: number, fadeOutBeginFactor: number, timeSpeed: number = 1.0): void {
        if (this.m_mh != null) {
            this.m_mh.setTimeAt(i, lifeTime, fadeInEndFactor, fadeOutBeginFactor, timeSpeed);
        }
    }
    setAlphaAt(i: number, alpha: number): void {
        if (this.m_mh != null) {
            this.m_mh.setAlphaAt(i, alpha);
        }
    }
    setBrightnessAt(i: number, brightness: number): void {
        if (this.m_mh != null) {
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
    setClipUVParam(cn: number, total: number, du: number, dv: number): void {
        if (this.m_clipEnabled && this.m_mt != null) {
            this.m_mt.setClipUVParam(cn, total, du, dv);
        }
    }
    getTime(): number { return this.m_mt.getTime(); };
    setTime(time: number): void {
        this.m_mt.setTime(time);
    }
    updateTime(timeOffset: number): void {
        this.m_mt.updateTime(timeOffset);
    }
    getScaleX(): number { return this.m_mt.getScaleX(); }
    getScaleY(): number { return this.m_mt.getScaleY(); }
    setScaleX(p: number): void { this.m_mt.setScaleX(p); }
    setScaleY(p: number): void { this.m_mt.setScaleY(p); }
    setScaleXY(sx: number, sy: number): void {
        this.m_mt.setScaleXY(sx, sy);
    }
    createMaterial(texList: IRenderTexture[]): void {
        if (this.getMaterial() == null) {
            this.m_mt = new BillboardFlareMaterial(
                this.m_brightnessEnabled
                , this.m_alphaEnabled
                , this.m_clipEnabled
                , this.m_clipMixEnabled
            );
			this.m_mt.brnToAlpha = this.brnToAlpha;
            this.m_mt.setTextureList(texList);
            this.setMaterial(this.m_mt);
        }
        else {
            this.m_mt = this.getMaterial() as BillboardFlareMaterial;
            this.m_mt.setTextureList(texList);
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
    setPlayParam(clipMixEnabled: boolean): void {
        this.m_clipMixEnabled = clipMixEnabled;
    }
    initialize(brightnessEnabled: boolean, alphaEnabled: boolean, clipEnabled: boolean, texList: IRenderTexture[]): void {
        this.m_brightnessEnabled = brightnessEnabled;
        this.m_alphaEnabled = alphaEnabled;
        this.m_clipEnabled = clipEnabled;
        if (this.m_mh != null) {
            this.createMaterial(texList);
            this.activeDisplay();
        }
        else {
            console.error("billMesh is null, please call createGroup() function!");
        }
    }
    protected createBounds(): void {
    }
    protected __activeMesh(material: IRenderMaterial): void {
        if (this.getMesh() == null) {
            let mesh = this.m_mh;
            mesh.vbWholeDataEnabled = this.vbWholeDataEnabled;
            mesh.flipVerticalUV = this.flipVerticalUV;
            mesh.setBufSortFormat(material.getBufSortFormat());
            mesh.initialize();
            this.setMesh(mesh);
        }
    }

    setUV(pu: number, pv: number, du: number, dv: number): void {
        if (this.m_mh != null) {
            this.m_mh.setUV(pu, pv, du, dv);
        }
    }
    update(): void {
        this.m_trs.update();
    }
    destroy(): void {
        this.m_mt = null;
        this.m_mh = null;
        super.destroy();
    }
}
