import IRendererScene from "../../../vox/scene/IRendererScene";
import { RenderableMaterialBlock } from "../../../vox/scene/block/RenderableMaterialBlock";
import { RenderableEntityBlock } from "../../../vox/scene/block/RenderableEntityBlock";

import IRenderMaterial from "../../../vox/render/IRenderMaterial";
import Default3DMaterial from "../../../vox/material/mcase/Default3DMaterial";

import { IAppBase } from "../interfaces/IAppBase";
import { IMaterialContext } from "../../../materialLab/base/IMaterialContext";
import { MaterialContext } from "../../../materialLab/base/MaterialContext";
import { IMaterial } from "../../../vox/material/IMaterial";
import { Material } from "../../../vox/material/Material";
import LambertLightDecorator from "../../../vox/material/mcase/LambertLightDecorator";
import { VertUniformComp } from "../../../vox/material/component/VertUniformComp";
import IRenderTexture from "../../../vox/render/texture/IRenderTexture";
import { SpecularTextureLoader } from "../../../pbr/mana/TextureLoader";
import { PBRDecorator } from "../../../pbr/material/PBRDecorator";

class Instance implements IAppBase {
    private m_rscene: IRendererScene = null;
    private m_specularEnvMap: IRenderTexture = null;
    private m_specularLoader: SpecularTextureLoader = null;
    constructor() {

    }
    initialize(rsecne: IRendererScene): void {
        this.m_rscene = rsecne;
        let rscene = rsecne;
        let materialBlock = new RenderableMaterialBlock();
        materialBlock.initialize();
        rscene.materialBlock = materialBlock;
        let entityBlock = new RenderableEntityBlock();
        entityBlock.initialize();
        rscene.entityBlock = entityBlock;
    }
    createDefaultMaterial(normalEnabled: boolean = false): IRenderMaterial {
        let m = new Default3DMaterial();
        m.normalEnabled = normalEnabled;
        return m;
    }
    createMaterialContext(): IMaterialContext {
        return new MaterialContext();
    }

    createLambertMaterial(vertUniformEnabled: boolean = true): IMaterial {

        let vertUniform: VertUniformComp = vertUniformEnabled ? new VertUniformComp() : null;
        let decor = new LambertLightDecorator();
        decor.vertUniform = vertUniform;
        let m = new Material();
        m.setDecorator(decor);

        return m;
    }
    
    createPBRMaterial(vertUniformEnabled: boolean = true): IMaterial {

        let vertUniform: VertUniformComp = vertUniformEnabled ? new VertUniformComp() : null;
        let decor = new PBRDecorator();
        decor.vertUniform = vertUniform;
        let m = new Material();
        m.setDecorator(decor);

        return m;
    }
    createSpecularTex(hdrBrnEnabled: boolean): IRenderTexture {

        if (this.m_specularEnvMap == null) {
            let envMapUrl: string = "static/bytes/spe.mdf";
            if (hdrBrnEnabled) {
                envMapUrl = "static/bytes/speBrn.bin";
            }
            this.m_specularLoader = new SpecularTextureLoader();
            this.m_specularLoader.hdrBrnEnabled = hdrBrnEnabled;
            this.m_specularLoader.loadTextureWithUrl(envMapUrl, this.m_rscene);
            this.m_specularEnvMap = this.m_specularLoader.texture;
            this.m_specularEnvMap.__$attachThis();
        }
        return this.m_specularEnvMap;
    }
}

// export {VoxAppBase, Axis3DEntity, Box3DEntity, Sphere3DEntity};
export { MaterialContext, Instance }
