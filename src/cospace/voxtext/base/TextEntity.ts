/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ITransformEntity from "../../../vox/entity/ITransformEntity";
import IRenderMaterial from '../../../vox/render/IRenderMaterial';
import IRenderTexture from "../../../vox/render/texture/IRenderTexture";
import TextMeshBuilder from "./TextGeometryBuilder";
import { IH5Text } from "./IH5Text";
import { ITextEntity } from "./ITextEntity";

import { TextMaterial } from "../material/TextMaterial";
import IRawMesh from "../../../vox/mesh/IRawMesh";
import IVector3D from "../../../vox/math/IVector3D";

import { ICoRScene } from "../../voxengine/ICoRScene";
declare var CoRScene: ICoRScene;

class TextEntity implements ITextEntity{
    private m_rentity: ITransformEntity = null;
    private m_dynamicEnbaled: boolean = true;
    private m_material: TextMaterial = new TextMaterial();
    private m_mesh: IRawMesh;
    private m_width: number = 0;
    private m_height: number = 0;

    private m_text: string = "";
    private m_alignFactorX: number = 0.5;
    private m_alignFactorY: number = 0.5;
    private m_h5Text: IH5Text;

    flipVerticalUV = false;
    constructor(dynamicEnbaled: boolean = true) {
        this.m_dynamicEnbaled = dynamicEnbaled;
    }
    getREntity(): ITransformEntity {
        return this.m_rentity;
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
    setXYZ(px: number, py: number, pz: number): void {
        if (this.m_rentity != null) {
            this.m_rentity.setXYZ(px, py, pz);
        }
    }
    setPosition(pv: IVector3D): void {
        if (this.m_rentity != null) {
            this.m_rentity.setPosition(pv);
        }
    }
    getPosition(pv: IVector3D): IVector3D {
        if (this.m_rentity != null) {
            return this.m_rentity.getPosition(pv);
        }
    }
    private createMaterial(texList: IRenderTexture[]): void {
        this.m_material.create();
        this.m_material.material.setTextureList(texList);
        this.m_material.material.vtxInfo = CoRScene.createVtxDrawingInfo();
    }
    initialize(text: string, h5Text: IH5Text, texList: IRenderTexture[] = null): void {
        if (this.m_rentity == null) {
            this.m_rentity = CoRScene.createDisplayEntity();
            this.m_text = text;
            this.m_h5Text = h5Text;
            if (texList == null) {
                this.createMaterial([h5Text.getTextureAt(0)]);
            }
            else {
                this.createMaterial(texList);
            }
            this.m_mesh = this.createMesh(this.m_material.material);
            this.m_rentity.setMaterial(this.m_material.material);
            this.m_rentity.setMesh(this.m_mesh);
            this.m_rentity.setRenderState(CoRScene.RendererState.BACK_TRANSPARENT_STATE);
        }
    }
    protected createBounds(): void {
    }
    protected createMesh(material: IRenderMaterial): IRawMesh {
        let builder = new TextMeshBuilder();
        builder.vbWholeDataEnabled = false;
        builder.alignFactorX = this.m_alignFactorX;
        builder.alignFactorY = this.m_alignFactorY;
        builder.initialize(this.m_h5Text);
        this.m_width = builder.getWidth();
        this.m_height = builder.getHeight();
        return builder.create(this.m_text, material);
    }
    update(): void {
        if (this.m_rentity != null) {
            this.m_rentity.update();
            if (this.m_rentity.getTransform() != null) {
                if (this.m_dynamicEnbaled) {
                    this.m_rentity.getMaterial().vtxInfo.setIvsParam(0, this.m_mesh.vtCount);
                }
            }
        }
    }
    destroy(): void {
        if (this.m_rentity != null) {
            this.m_rentity.destroy();
            this.m_rentity = null;
            this.m_h5Text = null;
            this.m_material.destroy();
            this.m_material = null;
        }
    }
}
export { TextEntity }