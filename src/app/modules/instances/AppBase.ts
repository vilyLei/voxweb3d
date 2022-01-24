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

class Instance implements IAppBase {
    //private m_rsecne: IRendererScene = null;
    constructor() {

    }
    initialize(rsecne: IRendererScene): void {
        //this.m_rsecne = rsecne;
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
}

// export {VoxAppBase, Axis3DEntity, Box3DEntity, Sphere3DEntity};
export { MaterialContext, Instance }
