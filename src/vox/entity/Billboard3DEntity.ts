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
import BillboardMaterial from "../../vox/material/mcase/BillboardMaterial";
import IRenderTexture from "../../vox/render/texture/IRenderTexture";
import BillboardPlaneMesh from "../../vox/mesh/BillboardPlaneMesh";

export default class Billboard3DEntity extends DisplayEntity {
    private m_brightnessEnabled = true;
    private m_alphaEnabled = false;
    private m_boundsBoo = false;
    private m_bw = 0;
    private m_bh = 0;
    private m_mt: BillboardMaterial = null;
    private m_mh: BillboardPlaneMesh = null;

    flipVerticalUV = false;

    constructor(transform: IROTransform = null, bounds: boolean = true) {
        super(transform);
		this.m_boundsBoo = bounds;
		if(this.m_boundsBoo) {
			super.createBounds();
		}
        this.setRenderState(RendererState.BACK_ADD_BLENDSORT_STATE);
    }
    setRGB3f(pr: number, pg: number, pb: number): void {
        if (this.m_mt != null) {
            this.m_mt.setRGB3f(pr, pg, pb);
        }
    }
    setRGBOffset3f(pr: number, pg: number, pb: number): void {
        if (this.m_mt) {
            this.m_mt.setRGBOffset3f(pr, pg, pb);
        }
    }

    setFadeFactor(pa: number): void {
        if (this.m_mt) {
            this.m_mt.setFadeFactor(pa);
        }
    }
    getFadeFactor(): number {
        return this.m_mt.getFadeFactor();
    }
    getRotationZ(): number { return this.m_mt.getRotationZ(); };
    setRotationZ(degrees: number): void {
        this.m_mt.setRotationZ(degrees);
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
            this.m_mt = new BillboardMaterial(this.m_brightnessEnabled, this.m_alphaEnabled);
            this.m_mt.setTextureList(texList);
            this.setMaterial(this.m_mt);
        }
        else {
            this.m_mt = this.getMaterial() as BillboardMaterial;
            this.m_mt.setTextureList(texList);
        }
    }
    toTransparentBlend(always: boolean = false): void {
        this.m_brightnessEnabled = false;
        this.m_alphaEnabled = true;
        if (always) {
            this.setRenderState(RendererState.BACK_TRANSPARENT_STATE);
        }
        else {
            this.setRenderState(RendererState.BACK_TRANSPARENT_ALWAYS_STATE);
        }
    }
    toBrightnessBlend(always: boolean = false): void {
        this.m_brightnessEnabled = true;
        this.m_alphaEnabled = false;
        if (always) {
            this.setRenderState(RendererState.BACK_ADD_BLENDSORT_STATE);
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
            this.m_mh = mesh;
        }
    }

    setUV(pu: number, pv: number, du: number, dv: number): void {
        if (this.m_mh != null) {
            this.m_mh.setUV(pu, pv, du, dv);
        }
    }
    update(): void {
		if(this.m_boundsBoo) {
			super.update();
		}else {
			this.m_trs.update();
		}
    }
    destroy(): void {
        this.m_mt = null;
        this.m_mh = null;
        super.destroy();
    }
}
