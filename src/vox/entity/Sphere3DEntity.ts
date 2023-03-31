/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IROTransform from "../../vox/display/IROTransform";
import DisplayEntity from "../../vox/entity/DisplayEntity";
import IRenderMaterial from "../../vox/render/IRenderMaterial";
import Default3DMaterial from "../../vox/material/mcase/Default3DMaterial";
import IRenderTexture from "../../vox/render/texture/IRenderTexture";
import Sphere3DMesh from "../../vox/mesh/Sphere3DMesh"
import RendererState from "../render/RendererState";
import Color4 from "../material/Color4";

export default class Sphere3DEntity extends DisplayEntity {
    constructor(transform: IROTransform = null) {
        super(transform);
    }
    premultiplyAlpha = false;
    normalEnabled = false;
    doubleTriFaceEnabled = false;
    wireframe = false;
    shape = true;
    inverseUV = false;
    uvScale = 1.0;
	/**
	 *  1: positive half sphere
	 *  0: entire sphere
	 * -1:negative half sphere
	 */
    meshMode = 0;
    vtxColor: Color4 = null;
    private m_radius = 50.0;
    private m_longitudeNumSegments = 10;
    private m_latitudeNumSegments = 10;

    showBackFace(): void {
        this.setRenderState(RendererState.NORMAL_STATE);
    }
    showFrontFace(): void {
        this.setRenderState(RendererState.FRONT_CULLFACE_NORMAL_STATE);
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
    createMaterial(texList: IRenderTexture[]): void {
        if (this.getMaterial() == null) {
            let cm = new Default3DMaterial();
            cm.premultiplyAlpha = this.premultiplyAlpha;
            cm.vertColorEnabled = this.vtxColor != null;
            cm.normalEnabled = this.normalEnabled;
            cm.setTextureList(texList);
            this.setMaterial(cm);
        }
        else if (texList != null && this.getMaterial().getTextureTotal() < 1) {
            this.getMaterial().setTextureList(texList);
        }
    }

    initializeFrom(entity: DisplayEntity, texList: IRenderTexture[] = null) {
        this.copyMeshFrom(entity);
        this.copyMaterialFrom(entity);

        this.createMaterial(texList);
        this.activeDisplay();
    }
    initialize(radius: number, longitudeNumSegments: number, latitudeNumSegments: number, texList: IRenderTexture[] = null) {
        this.m_radius = radius;
        this.m_longitudeNumSegments = longitudeNumSegments;
        this.m_latitudeNumSegments = latitudeNumSegments;

        this.createMaterial(texList);
        this.activeDisplay();
    }

    protected __activeMesh(material: IRenderMaterial): void {
        if (this.getMesh() == null) {
            let mesh = new Sphere3DMesh();
            mesh.mode = this.meshMode;
            mesh.wireframe = this.wireframe;
            mesh.shape = this.shape;
            mesh.inverseUV = this.inverseUV;
            mesh.uvScale = this.uvScale;
            mesh.vbWholeDataEnabled = this.vbWholeDataEnabled;
            mesh.setVtxBufRenderData(material);
            mesh.initialize(this.m_radius, this.m_longitudeNumSegments, this.m_latitudeNumSegments, this.doubleTriFaceEnabled);
            this.setMesh(mesh);
        }
    }
}
