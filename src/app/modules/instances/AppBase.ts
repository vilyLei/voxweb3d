import IRendererScene from "../../../vox/scene/IRendererScene";
import { RenderableMaterialBlock } from "../../../vox/scene/block/RenderableMaterialBlock";
import { RenderableEntityBlock } from "../../../vox/scene/block/RenderableEntityBlock";

import IRenderMaterial from "../../../vox/render/IRenderMaterial";
import Default3DMaterial from "../../../vox/material/mcase/Default3DMaterial";

import { IAppBase } from "../interfaces/IAppBase";
import { IMaterialContext } from "../../../materialLab/base/IMaterialContext";
import { MaterialContext } from "../../../materialLab/base/MaterialContext";

class Instance implements IAppBase {
    constructor() {

    }
    initialize(rsecne: IRendererScene): void {

        let rscene = rsecne;
        let materialBlock = new RenderableMaterialBlock();
        materialBlock.initialize();
        rscene.materialBlock = materialBlock;
        let entityBlock = new RenderableEntityBlock();
        entityBlock.initialize();
        rscene.entityBlock = entityBlock;
    }
    createDefaultMaterial(): IRenderMaterial {
        return new Default3DMaterial();
    }
    createMaterialContext(): IMaterialContext {
        return new MaterialContext();
    }
}

// export {VoxAppBase, Axis3DEntity, Box3DEntity, Sphere3DEntity};
export { MaterialContext, Instance }
