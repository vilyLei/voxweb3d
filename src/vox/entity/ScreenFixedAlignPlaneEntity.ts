/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import RendererState from "../../vox/render/RendererState";
import DisplayEntity from "../../vox/entity/DisplayEntity";
import Plane3DEntity from "../../vox/entity/Plane3DEntity";
import IRenderMaterial from "../../vox/render/IRenderMaterial";
import ScreenFixedPlaneMaterial from "../../vox/material/mcase/ScreenFixedPlaneMaterial";
import IRenderTexture from "../../vox/render/texture/IRenderTexture";
import RectPlaneMesh from "../../vox/mesh/RectPlaneMesh";
import {SpaceCullingMask} from "../../vox/space/SpaceCullingMask";
import Default3DMaterial from "../material/mcase/Default3DMaterial";

export default class ScreenFixedAlignPlaneEntity extends Plane3DEntity {
    constructor() {
        super();
        this.fixAlignScreen = true;
    }
    /*
    private m_startX: number = 0;
    private m_startZ: number = 0;
    private m_pwidth: number = 0;
    private m_plong: number = 0;
    private m_flag: number = 0;
    private m_mt: Default3DMaterial = null;
    flipVerticalUV: boolean = false;
    constructor() {
        super();
    }
    setUVScale(scaleU: number, scaleV: number): void {
        if (this.m_mt) this.m_mt.setUVScale(scaleU, scaleV);
    }
    setUVTranslation(offsetU: number, offsetV: number): void {
        // if (this.m_mt) this.m_mt.setUVTranslation(offsetU, offsetV);
        if (this.m_mt) this.m_mt.setUVOffset(offsetU, offsetV);
    }
    setRGB3f(pr: number, pg: number, pb: number): void {
        if (this.m_mt) this.m_mt.setRGB3f(pr, pg, pb);
    }
    setRGBA4f(pr: number, pg: number, pb: number, pa: number): void {
        if (this.m_mt) this.m_mt.setRGBA4f(pr, pg, pb, pa);
    }
    createMaterial(texList: IRenderTexture[]): void {
        if (this.getMaterial() == null) {
            this.m_mt = new Default3DMaterial();
            this.m_mt.fixAlignScreen = true;
            this.m_mt.setTextureList(texList);
            this.setMaterial(this.m_mt);
        }
        else {
            this.getMaterial().setTextureList(texList);
        }
    }
    showDoubleFace(always: boolean = false, doubleFace: boolean = true): void {
        if (always) {
            if (doubleFace) this.setRenderState(RendererState.NONE_CULLFACE_NORMAL_ALWAYS_STATE);
            else this.setRenderState(RendererState.BACK_NORMAL_ALWAYS_STATE);
        }
        else {
            if (doubleFace) this.setRenderState(RendererState.NONE_CULLFACE_NORMAL_STATE);
            else this.setRenderState(RendererState.NORMAL_STATE);
        }
    }
    toTransparentBlend(always: boolean = false, doubleFace: boolean = false): void {
        if (always) {
            if (doubleFace) this.setRenderState(RendererState.NONE_TRANSPARENT_ALWAYS_STATE);
            else this.setRenderState(RendererState.BACK_TRANSPARENT_ALWAYS_STATE);
        }
        else {
            if (doubleFace) this.setRenderState(RendererState.NONE_TRANSPARENT_STATE);
            else this.setRenderState(RendererState.BACK_TRANSPARENT_STATE);
        }
    }
    toBrightnessBlend(always: boolean = false, doubleFace: boolean = false): void {
        if (always) {
            if (doubleFace) this.setRenderState(RendererState.NONE_ADD_ALWAYS_STATE);
            else this.setRenderState(RendererState.BACK_ADD_ALWAYS_STATE);
        }
        else {
            if (doubleFace) this.setRenderState(RendererState.NONE_ADD_BLENDSORT_STATE);
            else this.setRenderState(RendererState.BACK_ADD_BLENDSORT_STATE);
        }
    }
    initialize(startX: number, startY: number, pwidth: number, pheight: number, texList: IRenderTexture[] = null): void {
        this.m_startX = startX;
        this.m_startZ = startY;
        this.m_pwidth = pwidth;
        this.m_plong = pheight;
        this.m_flag = 0;
        this.spaceCullMask = SpaceCullingMask.NONE;
        this.createMaterial(texList);
        this.activeDisplay();
    }
    protected __activeMesh(material: IRenderMaterial) {
        if (this.getMesh() == null) {
            let mesh: RectPlaneMesh = new RectPlaneMesh();
            mesh.flipVerticalUV = this.flipVerticalUV;
            mesh.vbWholeDataEnabled = this.vbWholeDataEnabled;
            mesh.axisFlag = 0;
            mesh.setBufSortFormat(material.getBufSortFormat());
            mesh.initialize(this.m_startX, this.m_startZ, this.m_pwidth, this.m_plong);
            this.setMesh(mesh);
        }
    }

    destroy(): void {
        super.destroy();
        this.m_mt = null;
    }
    //*/
}