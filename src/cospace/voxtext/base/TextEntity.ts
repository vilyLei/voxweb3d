/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import RendererState from "../../../vox/render/RendererState";
import DisplayEntity from "../../../vox/entity/DisplayEntity";
import IRenderMaterial from '../../../vox/render/IRenderMaterial';
import BillboardAlphaTexMaterial from "../../../vox/material/mcase/BillboardAlphaTexMaterial";
import IRenderTexture from "../../../vox/render/texture/IRenderTexture";
import TextMeshBuilder from "./TextGeometryBuilder";
import H5Text from "./H5Text";

export default class TextEntity extends DisplayEntity {

    private m_dynamicEnbaled: boolean = true;
    private m_material: BillboardAlphaTexMaterial = null;
    private m_width: number = 0;
    private m_height: number = 0;

    private m_text: string = "";
    private m_alignFactorX: number = 0.5;
    private m_alignFactorY: number = 0.5;
    private m_h5Text: H5Text;

    flipVerticalUV = false;
    constructor(dynamicEnbaled: boolean = true) {
        super();
        this.m_dynamicEnbaled = dynamicEnbaled;
    }
    getWidth(): number {
        return this.m_width;
    }
    getHeight(): number {
        return this.m_height;
    }
    setAlignFactor(alignFactorX: number, alignFactorY: number): void {
        this.m_alignFactorX = alignFactorX;
        this.m_alignFactorY = alignFactorY;
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

    }
    setRGBA4f(pr: number, pg: number, pb: number, pa: number): void {
        if (this.m_material != null) {
            this.m_material.setRGBA4f(pr, pg, pb, pa);
        }
    }
    setRGB3f(pr: number, pg: number, pb: number): void {
        if (this.m_material != null) {
            this.m_material.setRGB3f(pr, pg, pb);
        }
    }
    setAlpha(pa: number): void {
        this.m_material.setAlpha(pa);
    }
    getAlpha(): number {
        return this.m_material.getAlpha();
    }
    setBrightness(brighness: number): void {
        this.m_material.setBrightness(brighness);
    }
    getBrightness(): number {
        return this.m_material.getBrightness();
    }
    getRotationZ(): number { return this.m_material.getRotationZ(); };
    setRotationZ(degrees: number): void {
        this.m_material.setRotationZ(degrees);
    }
    getScaleX(): number { return this.m_material.getScaleX(); }
    getScaleY(): number { return this.m_material.getScaleY(); }
    setScaleX(p: number): void { this.m_material.setScaleX(p); }
    setScaleY(p: number): void { this.m_material.setScaleY(p); }
    setScaleXY(sx: number, sy: number): void {
        this.m_material.setScaleXY(sx, sy);
    }
    createMaterial(texList: IRenderTexture[]): void {
        if (this.getMaterial() == null) {
            this.m_material = new BillboardAlphaTexMaterial();
            this.m_material.setTextureList(texList);
            this.setMaterial(this.m_material);
        }
        else {
            this.m_material.setTextureList(texList);
        }
    }
    initialize(text: string, h5Text: H5Text, texList: IRenderTexture[] = null): void {
        this.m_text = text;
		this.m_h5Text = h5Text;
        if (texList == null) {
            this.createMaterial([h5Text.getTextureAt(0)]);
        }
        else {
            this.createMaterial(texList);
        }
        this.activeDisplay();
        this.setRenderState(RendererState.BACK_TRANSPARENT_STATE);
    }
    protected createBounds(): void {
    }
    protected __activeMesh(material: IRenderMaterial): void {
        if (this.getMesh() == null) {
			let builder = new TextMeshBuilder();
            builder.vbWholeDataEnabled = this.vbWholeDataEnabled;
            builder.alignFactorX = this.m_alignFactorX;
            builder.alignFactorY = this.m_alignFactorY;
            builder.initialize(this.m_h5Text);
			this.m_width = builder.getWidth();
			this.m_height = builder.getHeight();
            let mesh = builder.create(this.m_text);
            this.setMesh(mesh);
        }
    }
    update(): void {
        if(this.m_transfrom != null) {
            if (this.m_dynamicEnbaled && this.m_mesh.isGeomDynamic()) {
                this.setIvsParam(0, this.m_mesh.vtCount);
            }
            this.m_transfrom.update();
        }
    }
    destroy(): void {
        super.destroy();
        this.m_h5Text = null;
    }
}
