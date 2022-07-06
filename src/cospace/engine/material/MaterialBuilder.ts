import IRenderMaterial from "../../../vox/render/IRenderMaterial";
import IRendererScene from "../../../vox/scene/IRendererScene";
import { EngineBase } from "../base/EngineBase"
import { IMaterialContext } from "../../../materialLab/base/IMaterialContext";
import { IMaterial } from "../../../vox/material/IMaterial";
import Color4 from "../../../vox/material/Color4";
import MaterialModule from "../material/MaterialModule";
export default class MaterialBuilder {

    private m_appBase: EngineBase = null;
    private m_builderMap: Map<number, MaterialModule> = new Map();
    
    private m_materialCtx: IMaterialContext;
    private m_rscene: IRendererScene;
    constructor() { }

    initialize(voxAppBase: EngineBase, rscene: IRendererScene): void {

        this.m_appBase = voxAppBase;
        this.m_rscene = rscene;
    }
    setMaterialContext(materialCtx: IMaterialContext): void {

        this.m_materialCtx = materialCtx;
        console.log("MaterialBuilder setMaterialContext...");
        for (const [key, value] of this.m_builderMap) {
            value.active(this.m_rscene, this.m_materialCtx);
        }
    }
    
    preloadData(): void {
        // console.log("NNNNNNNNNNNN MaterialBuilder preloadData...");
        //this.m_materialBuilder.preloadData();
    }
    createDefaultMaterial(): IRenderMaterial {
        let material = this.m_appBase.createDefaultMaterial();
        (material as any).normalEnabled = true;
        material.setTextureList([this.m_rscene.textureBlock.createRGBATex2D(32, 32, new Color4(0.2, 0.8, 0.4))]);
        return material;
    }

    addMaterial(flag: number): number {

        return 0;
    }

    isEnabledWithFlag(flag: number): boolean {

        let builder = this.m_builderMap.get(flag);
        return (builder != null && builder.isEnabled());
    }
    hasMaterialWithFlag(flag: number): boolean {
        return this.m_builderMap.has( flag );
    }
    createMaterialWithFlag(flag: number): IMaterial {
        let builder = this.m_builderMap.get(flag);
        if(builder != null) {
            return builder.createMaterial();
        }
        return null;
    }
}