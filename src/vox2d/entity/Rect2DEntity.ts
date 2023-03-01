/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import RendererState from "../../vox/render/RendererState";
import DisplayEntity from "../../vox/entity/DisplayEntity";
import MaterialBase from '../../vox/material/MaterialBase';
import Rect2DMaterial from "../../vox2d/material/mcase/Rect2DMaterial";
import TextureProxy from "../../vox/texture/TextureProxy";
import RectPlaneMesh from "../../vox/mesh/RectPlaneMesh";
import { SpaceCullingMask } from "../../vox/space/SpaceCullingMask";
import Color4 from "../../vox/material/Color4";

export default class Rect2DEntity extends DisplayEntity {
    private m_startX: number = 0;
    private m_startZ: number = 0;
    private m_pwidth: number = 0;
    private m_height: number = 0;
    private m_flag: number = 0;
    private m_currMaterial: Rect2DMaterial = null;

    readonly color0: Color4 = new Color4();
    readonly color1: Color4 = new Color4();
    readonly color2: Color4 = new Color4();
    readonly color3: Color4 = new Color4();

    flipVerticalUV: boolean = false;
    vertColorEnabled: boolean = false;
    centerAlignEnabled: boolean = false;
    constructor() {
        super();
    }
    createMaterial(texList: TextureProxy[]): void {
        if (this.getMaterial() == null) {
            this.m_currMaterial = new Rect2DMaterial(this.centerAlignEnabled, this.vertColorEnabled);
            this.m_currMaterial.setTextureList(texList);
            this.setMaterial(this.m_currMaterial);
        }
        else {
            this.getMaterial().setTextureList(texList);
        }
    }
    protected createBounds(): void {
    }
    enabledAlpha(): void {
        this.setRenderState(RendererState.BACK_TRANSPARENT_ALWAYS_STATE);
    }
    disabledAlpha(): void {
        this.setRenderState(RendererState.BACK_NORMAL_ALWAYS_STATE);
    }
    initialize(startX: number, startY: number, pwidth: number, pheight: number, texList: TextureProxy[] = null): void {
        this.m_startX = startX;
        this.m_startZ = startY;
        this.m_pwidth = pwidth;
        this.m_height = pheight;
        this.m_flag = 0;
        this.spaceCullMask = SpaceCullingMask.NONE;
        this.createMaterial(texList);
        this.activeDisplay();
        this.setRenderState(RendererState.BACK_NORMAL_ALWAYS_STATE);
    }
    protected __activeMesh(material: MaterialBase) {
        if (this.getMesh() == null) {
            let mesh: RectPlaneMesh = new RectPlaneMesh();
            mesh.flipVerticalUV = this.flipVerticalUV;
            mesh.vbWholeDataEnabled = this.vbWholeDataEnabled;
            mesh.axisFlag = this.m_flag;
            mesh.color0.copyFrom(this.color0);
            mesh.color1.copyFrom(this.color1);
            mesh.color2.copyFrom(this.color2);
            mesh.color3.copyFrom(this.color3);
            mesh.setBufSortFormat(material.getBufSortFormat());
            mesh.initialize(this.m_startX, this.m_startZ, this.m_pwidth, this.m_height);
            this.setMesh(mesh);
        }
    }
    getWidth(): number {
        return this.m_pwidth * this.m_currMaterial.getScaleX();
    }
    getHeight(): number {
        return this.m_height * this.m_currMaterial.getScaleY();
    }
    setXYZ(px: number, py: number, pz: number): Rect2DEntity {
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
    setScaleXY(sx: number, sy: number): void {
        if (this.m_currMaterial != null) {
            this.m_currMaterial.setScaleXY(sx, sy);
        }
    }
    setScaleX(sx: number): void {
        if (this.m_currMaterial != null) {
            this.m_currMaterial.setScaleX(sx);
        }
    }
    setScaleY(sy: number): void {
        if (this.m_currMaterial != null) {
            this.m_currMaterial.setScaleY(sy);
        }
    }
    getScaleX(): number {
        if (this.m_currMaterial != null) {
            return this.m_currMaterial.getScaleX();
        }
        return 0.0;
    }
    getScaleY(): number {
        if (this.m_currMaterial != null) {
            return this.m_currMaterial.getScaleY();
        }
        return 0.0;
    }
    setRotation(pr: number): void {
        if (this.m_currMaterial != null) {
            this.m_currMaterial.setRotation(pr);
        }
    }
    getRotation(): number {
        if (this.m_currMaterial != null) {
            return this.m_currMaterial.getRotation();
        }
        return 0.0;
    }
    setRGB3f(pr: number, pg: number, pb: number): void {
        if (this.m_currMaterial != null) {
            this.m_currMaterial.setRGB3f(pr, pg, pb);
        }
    }
    setRGBA4f(pr: number, pg: number, pb: number, pa: number): void {
        if (this.m_currMaterial != null) {
            this.m_currMaterial.setRGBA4f(pr, pg, pb, pa);
        }
    }
    update(): void {
    }
}