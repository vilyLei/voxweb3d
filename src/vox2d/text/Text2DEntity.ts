/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import RendererState from "../../vox/render/RendererState";
import DisplayEntity from "../../vox/entity/DisplayEntity";
import MaterialBase from '../../vox/material/MaterialBase';
import Text2DMaterial from "../../vox2d/material/mcase/Text2DMaterial";
import TextureProxy from "../../vox/texture/TextureProxy";
import TextRectMesh from "../../vox/text/TextRectMesh";
import H5FontSystem from "../../vox/text/H5FontSys";
import { SpaceCullingMask } from "../../vox/space/SpaceCullingMask";
import VtxDrawingInfo from "../../vox/render/vtx/VtxDrawingInfo";

export default class Text2DEntity extends DisplayEntity {
    private m_dynamicEnbaled: boolean = true;
    private m_currMaterial: Text2DMaterial = null;
    private m_currMesh: TextRectMesh = null;
    private m_charsStr: string = "";
    private m_alignFactorX: number = 0.5;
    private m_alignFactorY: number = 0.5;
    flipVerticalUV: boolean = false;
    constructor(dynamicEnbaled: boolean = true) {
        super();
        this.m_dynamicEnbaled = dynamicEnbaled;
    }
    setAlignFactor(alignFactorX: number, alignFactorY: number): void {
        this.m_alignFactorX = alignFactorX;
        this.m_alignFactorY = alignFactorY;
        if (this.m_currMesh != null) {
            this.m_currMesh.updateCharStr(this.m_charsStr);
        }
    }
    alignLeftTop(): void {
        this.setAlignFactor(0.0, 0.0);
    }
    alignCenter(): void {
        this.setAlignFactor(0.5, 0.5);
    }
    alignLeftCenter(): void {
        this.setAlignFactor(0.0, 0.5);
    }
    setText(charsStr: string): void {
        if (this.m_currMesh != null) {
            this.m_charsStr = charsStr;
            this.m_currMesh.alignFactorX = this.m_alignFactorX;
            this.m_currMesh.alignFactorY = this.m_alignFactorY;
            this.m_currMesh.updateCharStr(charsStr);
            this.update();
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
    setAlpha(pa: number): void {
        this.m_currMaterial.setAlpha(pa);
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

    getWidth(): number {
        return this.m_currMesh.getWidth() * this.m_currMaterial.getScaleX();
    }
    getHeight(): number {
        return this.m_currMesh.getHeight() * this.m_currMaterial.getScaleY();
    }
    setXYZ(px: number, py: number, pz: number): Text2DEntity {
        if (this.m_currMaterial != null) {
            this.m_currMaterial.setXY(px, py);
        }
        return this;
    }
    setXY(px: number, py: number): void {
        if (this.m_currMaterial != null) {
            this.m_currMaterial.setXY(px, py);
        }
    }
    setX(px: number): void {
        if (this.m_currMaterial != null) {
            this.m_currMaterial.setX(px);
        }
    }
    setY(py: number): void {
        if (this.m_currMaterial != null) {
            this.m_currMaterial.setY(py);
        }
    }
    getX(): number {
        if (this.m_currMaterial != null) {
            return this.m_currMaterial.getX();
        }
        return 0.0;
    }
    getY(): number {
        if (this.m_currMaterial != null) {
            return this.m_currMaterial.getY();
        }
        return 0.0;
    }
    setScale(s: number): void {
        if (this.m_currMaterial != null) {
            this.m_currMaterial.setScale(s);
        }
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
            this.m_currMaterial = new Text2DMaterial();
            this.m_currMaterial.vtxInfo = new VtxDrawingInfo();
            this.m_currMaterial.setTextureList(texList);
            this.setMaterial(this.m_currMaterial);
        }
        else {
            this.m_currMaterial.setTextureList(texList);
        }
    }
    initialize(charsStr: string, texList: TextureProxy[] = null): void {
        this.m_charsStr = charsStr;
        this.spaceCullMask = SpaceCullingMask.NONE;
        this.spaceCullMask = 0;
        this.m_alignFactorX = 0.0;
        this.m_alignFactorY = 0.0;
        if (texList == null) {
            this.createMaterial([H5FontSystem.GetInstance().getTextureAt(0)]);
        }
        else {
            this.createMaterial(texList);
        }
        this.activeDisplay();
        this.setRenderState(RendererState.BACK_TRANSPARENT_ALWAYS_STATE);
        //this.setRenderState(RenderStateObject.BACK_NORMAL_ALWAYS_STATE);
    }
    protected createBounds(): void {
    }
    protected __activeMesh(material: MaterialBase): void {
        if (this.getMesh() == null) {
            //bufDataUsage:number = VtxBufConst.VTX_DYNAMIC_DRAW
            let mesh: TextRectMesh = new TextRectMesh();
            mesh.vbWholeDataEnabled = this.vbWholeDataEnabled;
            mesh.alignFactorX = this.m_alignFactorX;
            mesh.alignFactorY = this.m_alignFactorY;
            mesh.setBufSortFormat(material.getBufSortFormat());
            mesh.initialize(this.m_charsStr);
            this.setMesh(mesh);
            this.m_currMesh = mesh;
        }
    }
    update(): void {
        if (this.m_dynamicEnbaled && this.m_mesh.isGeomDynamic()) {
            //this.setIvsParam(0, this.m_mesh.vtCount);
            const material = this.getMaterial();
            if(material) {
                material.vtxInfo.setIvsParam(0, this.m_mesh.vtCount);
            }
        }
        this.m_trs.update();
    }
}