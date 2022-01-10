import RendererScene from "../../../vox/scene/RendererScene";
import { CommonMaterialContext } from "../../../materialLab/base/CommonMaterialContext";

class RenderModule {

    private static s_ins: RenderModule = null;
    private m_rscene: RendererScene = null;
    private m_materialCtx: CommonMaterialContext = null;
    constructor() {
        
        if (RenderModule.s_ins != null) {
            throw Error("RenderModule is a singleton class.");
        }
        RenderModule.s_ins = this;
    }

    // envAmbientLightEnabled: boolean = true;
    // shadowEnabled: boolean = true;
    // fogEnabled: boolean = true;

    readonly roleLayerIndex: number = 0;
    readonly terrainLayerIndex: number = 1;
    readonly envBoxLayerIndex: number = 2;
    readonly particleLayerIndex: number = 4;
    readonly explosionFlareLayerIndex: number = 4;

    initialize(rscene: RendererScene, materialCtx: CommonMaterialContext): void {

        if (this.m_rscene == null) {
            this.m_rscene = rscene;
            this.m_materialCtx = materialCtx;

            this.init();
        }
    }
    private init(): void {

    }
    
    static GetInstance(): RenderModule {
        if (RenderModule.s_ins != null) {
            return RenderModule.s_ins;
        }
        return new RenderModule();
    }
}
export { RenderModule };