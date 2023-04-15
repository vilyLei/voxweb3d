/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

// import RendererState from "../../vox/render/RendererState";
// import DisplayEntity from "../../vox/entity/DisplayEntity";
import Plane3DEntity from "../../vox/entity/Plane3DEntity";
// import IRenderMaterial from "../../vox/render/IRenderMaterial";
// import ScreenPlaneMaterial from "../../vox/material/mcase/ScreenPlaneMaterial";
// import IRenderTexture from "../../vox/render/texture/IRenderTexture";
// import RectPlaneMesh from "../../vox/mesh/RectPlaneMesh";
// import {SpaceCullingMask} from "../../vox/space/SpaceCullingMask";

export default class ScreenAlignPlaneEntity extends Plane3DEntity {
    constructor() {
        super();
        this.alignScreen = true;
        console.log("ScreenAlignPlaneEntity::constructor() ...");
    }
    /*
    private m_startX: number = 0;
    private m_startZ: number = 0;
    private m_pwidth: number = 0;
    private m_plong: number = 0;
    private m_flag: number = 0;
    private m_currMaterial: ScreenPlaneMaterial = null;
    flipVerticalUV: boolean = false;
    mapLodEnabled: boolean = false;
    constructor() {
        super();
    }
    setRGB3f(pr: number, pg: number, pb: number): void {
        this.m_currMaterial.setRGB3f(pr, pg, pb);
    }
    setRGBA4f(pr: number, pg: number, pb: number, pa: number): void {
        this.m_currMaterial.setRGBA4f(pr, pg, pb, pa);
    }
    setOffsetRGB3f(pr: number, pg: number, pb: number): void {
        this.m_currMaterial.setOffsetRGB3f(pr, pg, pb);
    }
    setOffsetRGBA4f(pr: number, pg: number, pb: number, pa: number): void {
        this.m_currMaterial.setOffsetRGBA4f(pr, pg, pb, pa);
    }

    setTextureLodLevel(lodLv: number): void {
        if(this.mapLodEnabled) {
            this.m_currMaterial.setTextureLodLevel( lodLv );
        }
    }
    createMaterial(texList: IRenderTexture[]): void {
        if (this.getMaterial() == null) {
            this.m_currMaterial = new ScreenPlaneMaterial();
            this.m_currMaterial.mapLodEnabled = this.mapLodEnabled;
            this.m_currMaterial.setTextureList(texList);
            this.setMaterial(this.m_currMaterial);
        }
        else if (texList != null && this.getMaterial().getTextureTotal() < 1) {
            this.getMaterial().setTextureList(texList);
        }
    }
    showDoubleFace(): void {
        this.setRenderState(RendererState.NONE_CULLFACE_NORMAL_STATE);
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
        this.m_currMaterial = null;
    }
    //*/
}