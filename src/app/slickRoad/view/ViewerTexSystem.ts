import EngineBase from "../../../vox/engine/EngineBase";
import TextureProxy from "../../../vox/texture/TextureProxy";
import LambertLightMaterial from "../../../vox/material/mcase/LambertLightMaterial";
import { MaterialContext } from "../../../materialLab/base/MaterialContext";
import { TextureConst } from "../../../vox/texture/TextureConst";

class ViewerTexSystem {

    constructor() { }

    private m_engine: EngineBase;
    private m_materialCtx: MaterialContext;

    initialize(engine: EngineBase, materialCtx: MaterialContext): void {

        console.log("ViewerTexSystem::initialize()......");

        if (this.m_engine == null) {

            this.m_engine = engine;
            this.m_materialCtx = materialCtx;

        }
    }

    getImageTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): TextureProxy {
        let ptex: TextureProxy = this.m_engine.texLoader.getImageTexByUrl(purl, 0, false, false);
        ptex.mipmapEnabled = mipmapEnabled;
        if (wrapRepeat) ptex.setWrap(TextureConst.WRAP_REPEAT);
        return ptex;
    }
    useLambertMaterial(material: LambertLightMaterial, ns: string, normalMapEnabled: boolean = true, displacementMap: boolean = true, shadowReceiveEnabled: boolean = false, aoMapEnabled: boolean = false): void {

        material.setMaterialPipeline(this.m_materialCtx.pipeline);

        material.diffuseMap = this.getImageTexByUrl("static/assets/disp/" + ns + "_COLOR.png");
        material.specularMap = this.getImageTexByUrl("static/assets/disp/" + ns + "_SPEC.png");
        if (normalMapEnabled) {
            material.normalMap = this.getImageTexByUrl("static/assets/disp/" + ns + "_NRM.png");
        }
        if (aoMapEnabled) {
            material.aoMap = this.getImageTexByUrl("static/assets/disp/" + ns + "_OCC.png");
        }
        if (displacementMap) {
            material.displacementMap = this.getImageTexByUrl("static/assets/disp/" + ns + "_DISP.png");
        }
        if (shadowReceiveEnabled) {
            material.shadowMap = this.m_materialCtx.vsmModule.getShadowMap();
        }
    }
}

export { ViewerTexSystem };