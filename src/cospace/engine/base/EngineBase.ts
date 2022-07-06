
import IRendererScene from "../../../vox/scene/IRendererScene";
import IRenderMaterial from "../../../vox/render/IRenderMaterial";
import { IMaterialContext } from "../../../materialLab/base/IMaterialContext";

interface EngineBase {
    initialize(rsecne: IRendererScene): void;
    createDefaultMaterial(normalEnabled?: boolean): IRenderMaterial;
    createMaterialContext(): IMaterialContext;

}
export {EngineBase};
