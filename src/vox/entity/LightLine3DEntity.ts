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
import LightLine3DMaterial from "../../vox/material/mcase/LightLine3DMaterial";
import TextureProxy from "../../vox/texture/TextureProxy";
import LightLine3DMesh from "../../vox/mesh/LightLine3DMesh";
import IROTransform from "../../vox/display/IROTransform";

export default class LightLine3DEntity extends DisplayEntity {
    private m_brightnessEnabled: boolean = true;
    private m_alphaEnabled: boolean = false;
    private m_currMaterial: LightLine3DMaterial = null;
    private m_beginPos: Vector3D = new Vector3D();
    private m_endPos: Vector3D = new Vector3D(100.0, 0.0, 0.0);
    private m_lineW: number = 10.0;
    flipVerticalUV: boolean = false;
    flip90UV: boolean = false;
    constructor(transform: IROTransform = null) {
        super(transform);
        this.setRenderState(RendererState.BACK_ADD_BLENDSORT_STATE);
    }
    createMaterial(texList: TextureProxy[]): void {
        if (this.getMaterial() == null) {
            this.m_currMaterial = new LightLine3DMaterial(this.m_brightnessEnabled, this.m_alphaEnabled)
            this.m_currMaterial.setTextureList(texList);
            this.setMaterial(this.m_currMaterial);
        }
        else {
            this.m_currMaterial = this.getMaterial() as LightLine3DMaterial;
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
    initialize(beginPos: Vector3D, endPos: Vector3D, lineW: number, texList: TextureProxy[] = null): void {
        this.m_beginPos.copyFrom(beginPos);
        this.m_endPos.copyFrom(endPos);
        this.m_lineW = lineW;

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
            mesh.initialize(this.m_beginPos, this.m_endPos, this.m_lineW);
            this.setMesh(mesh);
        }
    }
}