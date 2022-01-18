/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Vector3D from "../../vox/math/Vector3D";
import RendererState from "../../vox/render/RendererState";
import DisplayEntity from "../../vox/entity/DisplayEntity";
import IRenderMaterial from "../../vox/render/IRenderMaterial";
import BillboardLine3DMaterial from "../../vox/material/mcase/BillboardLine3DMaterial";
import IRenderTexture from "../../vox/render/texture/IRenderTexture";
import LightLine3DMesh from "../../vox/mesh/LightLine3DMesh";
import ROTransform from "../../vox/display/ROTransform";

export default class BillboardLine3DEntity extends DisplayEntity {
    private m_brightnessEnabled: boolean = true;
    private m_alphaEnabled: boolean = false;
    private m_currMaterial: BillboardLine3DMaterial = null;
    flipVerticalUV: boolean = false;
    flip90UV: boolean = false;
    constructor(transform: ROTransform = null) {
        super(transform);
        this.setRenderState(RendererState.BACK_ADD_BLENDSORT_STATE);
    }
    createMaterial(texList: IRenderTexture[]): void {
        if (this.getMaterial() == null) {
            this.m_currMaterial = new BillboardLine3DMaterial(this.m_brightnessEnabled, this.m_alphaEnabled)
            this.m_currMaterial.setTextureList(texList);
            this.setMaterial(this.m_currMaterial);
        }
        else {
            this.m_currMaterial = this.getMaterial() as BillboardLine3DMaterial;
            this.m_currMaterial.setTextureList(texList);
        }
    }
    showDoubleFace(doubleFace: boolean = true): void {
        if (doubleFace) {
            this.setRenderState(RendererState.NONE_CULLFACE_NORMAL_STATE);
        }
        else {
            this.setRenderState(RendererState.NORMAL_STATE);
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
    setRGB3f(pr: number, pg: number, pb: number): void {
        if (this.m_currMaterial != null) {
            this.m_currMaterial.setRGB3f(pr, pg, pb);
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
    setBeginAndEndPos(begnPos: Vector3D, endPos: Vector3D): void {

        if (this.m_currMaterial != null) {
            return this.m_currMaterial.setBeginAndEndPos(begnPos, endPos);
        }
    }

    setBeginPos(beginPos: Vector3D): void {

        if (this.m_currMaterial != null) {
            return this.m_currMaterial.setBeginPos(beginPos);
        }
    }
    setEndPos(endPos: Vector3D): void {

        if (this.m_currMaterial != null) {
            return this.m_currMaterial.setEndPos(endPos);
        }
    }

    setLineWidth(lineWidth: number): void {
        if (this.m_currMaterial != null) {
            return this.m_currMaterial.setLineWidth(lineWidth);
        }
    }
    getLineWidth(): number {
        if (this.m_currMaterial != null) {
            return this.m_currMaterial.getLineWidth();
        }
        return 0.0;
    }

    setUVParam(uScale: number, vScale: number, uOffset: number, vOffset: number): void {
        if (this.m_currMaterial != null) {
            return this.m_currMaterial.setUVParam(uScale, vScale, uOffset, vOffset);
        }
    }
    setUVScale(uScale: number, vScale: number): void {
        if (this.m_currMaterial != null) {
            return this.m_currMaterial.setUVScale(uScale, vScale);
        }
    }
    setUVOffset(uOffset: number, vOffset: number): void {
        if (this.m_currMaterial != null) {
            return this.m_currMaterial.setUVOffset(uOffset, vOffset);
        }
    }
    setFadeRange(fadeMin: number, fadeMax: number): void {
        if (this.m_currMaterial != null) {
            return this.m_currMaterial.setFadeRange(fadeMin, fadeMax);
        }
    }
    setUVRotation(uvDegree: number): void {
        if (this.m_currMaterial != null) {
            return this.m_currMaterial.setUVRotation(uvDegree);
        }
    }
    initialize(texList: IRenderTexture[] = null): void {
        this.createMaterial(texList);
        this.activeDisplay();
    }
    protected __activeMesh(material: IRenderMaterial) {
        if (this.getMesh() == null) {
            let mesh: LightLine3DMesh = new LightLine3DMesh();
            mesh.flipVerticalUV = this.flipVerticalUV;
            mesh.vbWholeDataEnabled = this.vbWholeDataEnabled;
            mesh.flip90UV = this.flip90UV;
            mesh.setBufSortFormat(material.getBufSortFormat());
            mesh.initializeBill();
            this.setMesh(mesh);
        }
    }
    toString(): string {
        return "[BillboardLine3DEntity]";
    }
}