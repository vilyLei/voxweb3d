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
import Billboard3TexMixMaterial from "../../vox/material/mcase/Billboard3TexMixMaterial";
import IRenderTexture from "../../vox/render/texture/IRenderTexture";
import BillboardPlaneMesh from "../../vox/mesh/BillboardPlaneMesh";


export default class Billboard3D3TexMixEntity extends DisplayEntity {
    private m_brightnessEnabled: boolean = true;
    private m_alphaEnabled: boolean = false;
    private m_bw: number = 0;
    private m_bh: number = 0;
    private m_currMaterial: Billboard3TexMixMaterial = null;
    private m_billMesh: BillboardPlaneMesh = null;
    flipVerticalUV: boolean = false;
    constructor(transform: IROTransform = null) {
        super(transform);
        this.setRenderState(RendererState.BACK_ADD_BLENDSORT_STATE);
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

    setFadeFactor(pa: number): void {
        if (this.m_currMaterial != null) {
            this.m_currMaterial.setFadeFactor(pa);
        }
    }
    getFadeFactor(): number {
        return this.m_currMaterial.getFadeFactor();
    }
    setMixFactor(pa: number): void {
        if (this.m_currMaterial != null) {
            this.m_currMaterial.setMixFactor(pa);
        }
    }
    getMixFactor(): number {
        return this.m_currMaterial.getMixFactor();
    }
    setClipUVSize(du: number, dv: number): void {
        if (this.m_currMaterial != null) {
            this.m_currMaterial.setClipUVSize(du, dv);
        }
    }
    setClipUVPosAt(i: number, pu: number, pv: number): void {
        if (this.m_currMaterial != null) {
            this.m_currMaterial.setClipUVPosAt(i, pu, pv);
        }
    }

    getRotationZ(): number { return this.m_currMaterial.getRotationZ(); }
    setRotationZ(degrees: number): void {
        this.m_currMaterial.setRotationZ(degrees);
    }
    getScaleX(): number { return this.m_currMaterial.getScaleX(); }
    getScaleY(): number { return this.m_currMaterial.getScaleY(); }
    setScaleX(p: number): void { this.m_currMaterial.setScaleX(p); }
    setScaleY(p: number): void { this.m_currMaterial.setScaleY(p); }
    setScaleXY(sx: number, sy: number): void {
        this.m_currMaterial.setScaleXY(sx, sy);
    }
    createMaterial(texList: IRenderTexture[]): void {
        if (this.getMaterial() == null) {
            this.m_currMaterial = new Billboard3TexMixMaterial(this.m_brightnessEnabled, this.m_alphaEnabled, texList.length == 1);
            this.m_currMaterial.setTextureList(texList);
            this.setMaterial(this.m_currMaterial);
        }
        else {
            this.m_currMaterial = this.getMaterial() as Billboard3TexMixMaterial;
            this.m_currMaterial.setTextureList(texList);
        }
    }
    toTransparentBlend(always: boolean = false): void {
        this.m_brightnessEnabled = false;
        this.m_alphaEnabled = true;
        if (always) {
            this.setRenderState(RendererState.BACK_TRANSPARENT_ALWAYS_STATE);
        }
        else {
            this.setRenderState(RendererState.BACK_TRANSPARENT_STATE);
        }
    }
    toBrightnessBlend(always: boolean = false): void {
        this.m_brightnessEnabled = true;
        this.m_alphaEnabled = false;
        if (always) {
            this.setRenderState(RendererState.BACK_ADD_ALWAYS_STATE);
        }
        else {
            this.setRenderState(RendererState.BACK_ADD_BLENDSORT_STATE);
        }
    }
    initializeSquare(size: number, texList: IRenderTexture[]): void {
        this.m_bw = size;
        this.m_bh = size;
        this.createMaterial(texList);
        this.activeDisplay();
    }
    initialize(bw: number, bh: number, texList: IRenderTexture[]): void {
        if (texList == null || texList.length < 1) {
            throw Error("texList == null or texList.length < 1 is fatal error!!!");
        }
        this.m_bw = bw;
        this.m_bh = bh;
        this.createMaterial(texList);
        this.activeDisplay();
    }
    protected createBounds(): void {
    }
    protected __activeMesh(material: IRenderMaterial): void {
        if (this.getMesh() == null) {
            let mesh: BillboardPlaneMesh = new BillboardPlaneMesh();
            mesh.vbWholeDataEnabled = this.vbWholeDataEnabled;
            mesh.flipVerticalUV = this.flipVerticalUV;
            mesh.setBufSortFormat(material.getBufSortFormat());
            mesh.initialize(this.m_bw, this.m_bh);
            this.setMesh(mesh);
            this.m_billMesh = mesh;
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
    destroy(): void {
        this.m_currMaterial = null;
        this.m_billMesh = null;
        super.destroy();
    }
    toString(): string {
        return "Billboard3D3TexMixEntity(uid = " + this.getUid() + ", rseFlag = " + this.__$rseFlag + ")";
    }
}
