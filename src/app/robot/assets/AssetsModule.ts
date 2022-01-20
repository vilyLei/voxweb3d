/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IRenderTexture from "../../../vox/render/texture/IRenderTexture";
import { TextureConst } from "../../../vox/texture/TextureConst";
import { MaterialContext } from "../../../materialLab/base/MaterialContext";
import DisplayEntity from "../../../vox/entity/DisplayEntity";
import { MaterialPipeType } from "../../../vox/material/pipeline/MaterialPipeType";
import { IMaterialPipeline } from "../../../vox/material/pipeline/IMaterialPipeline";
import Box3DEntity from "../../../vox/entity/Box3DEntity";
import Sphere3DEntity from "../../../vox/entity/Sphere3DEntity";
import Plane3DEntity from "../../../vox/entity/Plane3DEntity";
import MaterialBase from "../../../vox/material/MaterialBase";
import RendererScene from "../../../vox/scene/RendererScene";

export default class AssetsModule {
    
    private static s_ins: AssetsModule = null;
    private m_rscene: RendererScene = null;
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
    getImageTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): IRenderTexture {
        return this.m_materialCtx.getTextureByUrl(purl, wrapRepeat, mipmapEnabled);
    }
    static GetImageTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): IRenderTexture {
        return AssetsModule.s_ins.getImageTexByUrl(purl, wrapRepeat, mipmapEnabled);
    }
    initialize(rscene: RendererScene, materialCtx: MaterialContext): void {

        if (this.m_materialCtx == null) {

            this.m_rscene = rscene;
            this.m_materialCtx = materialCtx;

            AssetsModule.s_materialCtx = materialCtx;

            materialCtx.getTextureByUrl("static/assets/particle/explosion/explodeBg_01c.png");
            materialCtx.getTextureByUrl("static/assets/particle/explosion/explosionCrack01.png");
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

        // this.m_rscene.addEntity(this.unitPlane);
        // this.m_rscene.addEntity(this.unitBox);
        // this.m_rscene.addEntity(this.unitSphere);
        // this.unitSphere.setVisible( false );
        // this.unitBox.setVisible( false );
        // this.unitSphere.setVisible( false );
    }
    static GetMaterialPipeline(): IMaterialPipeline {
        if (AssetsModule.s_materialCtx != null) {
            return AssetsModule.s_materialCtx.pipeline;
        }
    }
    static UseFogToMaterial(material: MaterialBase): void {

        if (AssetsModule.s_materialCtx != null) {
            material.setMaterialPipeline(AssetsModule.s_materialCtx.pipeline);
            material.pipeTypes = [ MaterialPipeType.FOG_EXP2 ];
        }
    }
    static UseFog(entity: DisplayEntity): void {

        if (AssetsModule.s_materialCtx != null) {

            entity.setMaterialPipeline(AssetsModule.s_materialCtx.pipeline);
            entity.pipeTypes = [ MaterialPipeType.FOG_EXP2 ];
        }
    }
    static GetBulTex(type: number): IRenderTexture {
        //return AssetsModule.s_ins.getImageTexByUrl("static/assets/flare_core_01.jpg");
        return AssetsModule.s_ins.getImageTexByUrl("static/assets/flare_core_02.jpg");
    }
}