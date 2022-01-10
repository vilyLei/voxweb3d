/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import TextureProxy from "../../../vox/texture/TextureProxy";
import { TextureConst } from "../../../vox/texture/TextureConst";
import { MaterialContext } from "../../../materialLab/base/MaterialContext";
import DisplayEntity from "../../../vox/entity/DisplayEntity";
import { MaterialPipeType } from "../../../vox/material/pipeline/MaterialPipeType";
import { IMaterialPipeline } from "../../../vox/material/pipeline/IMaterialPipeline";
import Box3DEntity from "../../../vox/entity/Box3DEntity";
import Sphere3DEntity from "../../../vox/entity/Sphere3DEntity";
import Plane3DEntity from "../../../vox/entity/Plane3DEntity";

export default class AssetsModule {

    private static s_ins: AssetsModule = null;
    private m_materialCtx: MaterialContext = null;
    private static s_materialCtx: MaterialContext = null;
    readonly unitPlane: Plane3DEntity = new Plane3DEntity();
    readonly unitBox: Box3DEntity = new Box3DEntity();
    readonly unitSphere: Sphere3DEntity = new Sphere3DEntity();
    particleGroupDepthOffset: number = -0.001;
    constructor() {
        if (AssetsModule.s_ins != null) {
            throw Error("AssetsModule is a singleton class.");
        }
        AssetsModule.s_ins = this;        
    }

    static GetInstance(): AssetsModule {
        if (AssetsModule.s_ins != null) {
            return AssetsModule.s_ins;
        }
        return new AssetsModule();
    }
    getImageTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): TextureProxy {
        return this.m_materialCtx.getTextureByUrl(purl, wrapRepeat, mipmapEnabled);
    }
    static GetImageTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): TextureProxy {
        return AssetsModule.s_ins.getImageTexByUrl(purl, wrapRepeat, mipmapEnabled);
    }
    initialize(materialCtx: MaterialContext): void {

        if (this.m_materialCtx == null) {
            this.m_materialCtx = materialCtx;

            AssetsModule.s_materialCtx = materialCtx;

            materialCtx.getTextureByUrl("static/assets/particle/explosion/explodeBg_01c.png");
            materialCtx.getTextureByUrl("static/assets/box_wood01.jpg");
            materialCtx.getTextureByUrl("static/assets/moss_01.jpg");
            materialCtx.getTextureByUrl("static/assets/moss_03.jpg");
        
            materialCtx.getTextureByUrl("static/assets/rock_a_n.jpg");
            materialCtx.getTextureByUrl("static/assets/rock_a.jpg");

            materialCtx.getTextureByUrl("static/assets/testEFT4.jpg");
            materialCtx.getTextureByUrl("static/assets/stones_02.png");
            //materialCtx.getTextureByUrl("static/assets/stones_06.png");

            materialCtx.getTextureByUrl("static/assets/image_003.jpg");
            materialCtx.getTextureByUrl("static/assets/brn_03.jpg");
            materialCtx.getTextureByUrl("static/assets/flare_core_02.jpg");

            materialCtx.getTextureByUrl("static/assets/xulie_02_07.png");
            materialCtx.getTextureByUrl("static/assets/color_05.jpg");

            materialCtx.getTextureByUrl("static/assets/wood_01.jpg");
            materialCtx.getTextureByUrl("static/assets/yanj.jpg");
            materialCtx.getTextureByUrl("static/assets/skin_01.jpg");
            materialCtx.getTextureByUrl("static/assets/default.jpg");
            materialCtx.getTextureByUrl("static/assets/warter_01.jpg");
            materialCtx.getTextureByUrl("static/assets/metal_02.jpg");
            materialCtx.getTextureByUrl("static/assets/image_003.jpg");
            materialCtx.getTextureByUrl("static/assets/metal_08.jpg");

            this.initGeomData();
        }
    }
    
    private initGeomData(): void {

        let materialCtx = AssetsModule.s_materialCtx;
        
        this.unitPlane.normalEnabled = true;
        this.unitPlane.initializeXOZSquare(1.0, [materialCtx.getTextureByUrl("static/assets/box_wood01.jpg")]);
        this.unitBox.normalEnabled = true;
        this.unitBox.initializeCube(1.0, [materialCtx.getTextureByUrl("static/assets/box_wood01.jpg")]);
        this.unitSphere.normalEnabled = true;
        this.unitSphere.initialize(0.5,10,10, [materialCtx.getTextureByUrl("static/assets/box_wood01.jpg")]);
    }
    static GetMaterialPipeline(): IMaterialPipeline {
        if (AssetsModule.s_materialCtx != null) {
            return AssetsModule.s_materialCtx.pipeline;
        }
    }
    static UseFog(entity: DisplayEntity): void {

        if (AssetsModule.s_materialCtx != null) {

            entity.setMaterialPipeline(AssetsModule.s_materialCtx.pipeline);
            entity.pipeTypes = [ MaterialPipeType.FOG_EXP2 ];
        }
    }
    static GetBulTex(type: number): TextureProxy {
        //return AssetsModule.s_ins.getImageTexByUrl("static/assets/flare_core_01.jpg");
        return AssetsModule.s_ins.getImageTexByUrl("static/assets/flare_core_02.jpg");
    }
}