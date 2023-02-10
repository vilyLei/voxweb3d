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
import IRenderTexture from "../../vox/render/texture/IRenderTexture";
import BillboardGroupMaterial from "../../vox/material/mcase/BillboardGroupMaterial";
import BillboardPlaneGroupMesh from "../../vox/mesh/BillboardPlaneGroupMesh";

export default class Billboard3DGroupEntity extends DisplayEntity {
    private m_brightnessEnabled: boolean = true;
    private m_currMaterial: BillboardGroupMaterial = null;
    private m_billMesh: BillboardPlaneGroupMesh = null;
    flipVerticalUV: boolean = false;
    constructor(transform: IROTransform = null) {
        super(transform);
        this.setRenderState(RendererState.BACK_ADD_BLENDSORT_STATE);
    }
    createGroup(billboardTotal: number): void {
        if (billboardTotal > 0 && this.m_billMesh == null && this.getMesh() == null) {
            this.m_billMesh = new BillboardPlaneGroupMesh();
            this.m_billMesh.createData(billboardTotal);
        }
    }
    setSizeAt(i: number, width: number, height: number): void {
        if (this.m_billMesh != null) {
            this.m_billMesh.setSizeAt(i, width, height);
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
    getRotationZ(): number { return this.m_currMaterial.getRotationZ(); };
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
            this.m_currMaterial = new BillboardGroupMaterial( this.m_brightnessEnabled );
            this.m_currMaterial.setTextureList( texList );
            this.setMaterial( this.m_currMaterial );
        }
        else if(this.getMaterial().getTextureTotal() < 1){
            this.m_currMaterial = this.getMaterial() as BillboardGroupMaterial;
            this.m_currMaterial.setTextureList( texList );
        }
    }
    toTransparentBlend(always: boolean = false): void {
        this.m_brightnessEnabled = false;
        if (always) {
            this.setRenderState(RendererState.BACK_TRANSPARENT_STATE);
        }
        else {
            this.setRenderState(RendererState.BACK_TRANSPARENT_ALWAYS_STATE);
        }
    }
    toBrightnessBlend(always: boolean = false): void {
        this.m_brightnessEnabled = true;
        if (always) {
            this.setRenderState(RendererState.BACK_ADD_ALWAYS_STATE);
        }
        else {
            this.setRenderState(RendererState.BACK_ADD_BLENDSORT_STATE);
        }
    }
    initialize(texList: IRenderTexture[]): void {
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
    protected __activeMesh(material: IRenderMaterial): void {
        if (this.getMesh() == null) {
            let mesh: BillboardPlaneGroupMesh = this.m_billMesh;
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
        this.m_trs.update();
    }
    destroy(): void {
        this.m_currMaterial = null;
        this.m_billMesh = null;
        super.destroy();
    }
    toString(): string {
        return "Billboard3DGroupEntity(uid = " + this.getUid() + ", rseFlag = " + this.__$rseFlag + ")";
    }
}