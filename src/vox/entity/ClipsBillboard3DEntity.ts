/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import DisplayEntity from "../../vox/entity/DisplayEntity";
import IRenderMaterial from "../../vox/render/IRenderMaterial";
import ClipsBillboardMaterial from "../../vox/material/mcase/ClipsBillboardMaterial";
import TextureProxy from "../../vox/texture/TextureProxy";
import BillboardPlaneMesh from "../../vox/mesh/BillboardPlaneMesh";
export default class ClipsBillboard3DEntity extends DisplayEntity {
    constructor() {
        super();
    }
    flipVerticalUV: boolean = false;
    private m_playMode: number = 0;
    private m_playTime: number = 0.0;
    private m_playDTime: number = 0.05;
    private m_circleBoo: boolean = true;
    private m_bw: number = 0;
    private m_bh: number = 0;
    private m_billMateiral: ClipsBillboardMaterial = null;
    setRGBA4f(pr: number, pg: number, pb: number, pa: number): void {
        if (this.m_billMateiral != null) {
            this.m_billMateiral.setRGBA4f(pr, pg, pb, pa);
        }
    }
    setRGB3f(pr: number, pg: number, pb: number): void {
        if (this.m_billMateiral != null) {
            this.m_billMateiral.setRGB3f(pr, pg, pb);
        }
    }
    autoPlay(boo: boolean, dTime: number = 0.1, circleBoo: boolean = true): void {
        this.m_playDTime = dTime;
        if (boo) {
            this.m_playMode = 1;
        }
        else {
            this.m_playMode = 0;
        }
    }
    setClipsUVRNCN(rn: number, cn: number): void {
        if (this.m_billMateiral != null) {
            this.m_billMateiral.setClipsRNCN(rn, cn);
        }
    }
    setPlayTime(time: number): void {
        this.m_playTime = time;
        if (this.m_billMateiral != null) {
            this.m_billMateiral.setPlayTime(time);
        }
    }
    setRGBOffset3f(pr: number, pg: number, pb: number): void {
        if (this.m_billMateiral != null) {
            this.m_billMateiral.setRGBOffset3f(pr, pg, pb);
        }
    }

    setAlpha(pa: number): void {
        this.m_billMateiral.setAlpha(pa);
    }
    getAlpha(): number {
        return this.m_billMateiral.getAlpha();
    }
    setBrightness(brighness: number): void {
        this.m_billMateiral.setBrightness(brighness);
    }
    getBrightness(): number {
        return this.m_billMateiral.getBrightness();
    }
    getRotationZ(): number { return this.m_billMateiral.getRotationZ(); };
    setRotationZ(degrees: number): void {
        this.m_billMateiral.setRotationZ(degrees);
    }
    getScaleX(): number { return this.m_billMateiral.getScaleX(); }
    getScaleY(): number { return this.m_billMateiral.getScaleY(); }
    setScaleX(p: number): void { this.m_billMateiral.setScaleX(p); }
    setScaleY(p: number): void { this.m_billMateiral.setScaleY(p); }
    setScaleXY(sx: number, sy: number): void {
        this.m_billMateiral.setScaleXY(sx, sy);
    }
    createMaterial(texList: TextureProxy[]): void {
        if (this.getMaterial() == null) {
            this.m_billMateiral = new ClipsBillboardMaterial();
            this.m_billMateiral.setTextureList(texList);
            this.setMaterial(this.m_billMateiral);
        }
        else {
            this.m_billMateiral = this.getMaterial() as ClipsBillboardMaterial;
            this.m_billMateiral.setTextureList(texList);
        }
    }
    initialize(bw: number, bh: number, texList: TextureProxy[]): void {
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
        }
    }
    update(): void {
        if (this.m_playMode > 0) {
            if (this.m_billMateiral != null) {
                //console.log("this.m_playTime: "+this.m_playTime);
                this.m_billMateiral.setPlayTime(this.m_playTime);
            }
            switch (this.m_playMode) {
                case 1:
                    this.m_playTime += this.m_playDTime;
                    break;
            }
            if (this.m_playTime > 1.0) {
                if (this.m_circleBoo) {
                    this.m_playTime = 0.0;
                }
                else {
                    this.m_playTime = 1.0;
                }
            }
        }
        this.m_trs.update();
    }
    toString(): string {
        return "ClipsBillboard3DEntity(uid = " + this.getUid() + ", rseFlag = " + this.__$rseFlag + ")";
    }
}