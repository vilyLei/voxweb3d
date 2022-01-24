
import IRendererScene from "../../../vox/scene/IRendererScene";
import IRenderMaterial from "../../../vox/render/IRenderMaterial";
import Box3DEntity from "../../../vox/entity/Box3DEntity";
import Plane3DEntity from "../../../vox/entity/Plane3DEntity";
import Axis3DEntity from "../../../vox/entity/Axis3DEntity";
import { IMaterialContext } from "../../../materialLab/base/IMaterialContext";

interface IAppBase {
    initialize(rsecne: IRendererScene): void;
    createDefaultMaterial(): IRenderMaterial;
    createMaterialContext(): IMaterialContext;

}
// export {VoxAppBase, Axis3DEntity, Box3DEntity, Sphere3DEntity};
export {IAppBase, Axis3DEntity, Plane3DEntity, Box3DEntity};
