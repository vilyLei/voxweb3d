import IRendererScene from "../../../vox/scene/IRendererScene";
import { RenderableMaterialBlock } from "../../../vox/scene/block/RenderableMaterialBlock";
import { RenderableEntityBlock } from "../../../vox/scene/block/RenderableEntityBlock";

import IRenderMaterial from "../../../vox/render/IRenderMaterial";
import Default3DMaterial from "../../../vox/material/mcase/Default3DMaterial";
import { IMaterialContext } from "../../../materialLab/base/IMaterialContext";
import { MaterialContext } from "../../../materialLab/base/MaterialContext";
import Box3DEntity from "../../../vox/entity/Box3DEntity";
import DisplayEntity from "../../../vox/entity/DisplayEntity";
import Box3DMesh from "../../../vox/mesh/Box3DMesh";
import RectPlaneMesh from "../../../vox/mesh/RectPlaneMesh";
import { IAppBase } from "../interfaces/IAppBase";
import MouseEventEntity from "../../../vox/entity/MouseEventEntity";
import DisplayEntityContainer from "../../../vox/entity/DisplayEntityContainer";

class Instance implements IAppBase {
    private m_rscene: IRendererScene = null;
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
}
// new DisplayEntityContainer
// new MouseEventEntity
export { DisplayEntity, DisplayEntityContainer, RectPlaneMesh, Box3DMesh, Box3DEntity, Instance }
// export { DisplayEntity, Instance }
