
import IRendererScene from "../../../vox/scene/IRendererScene";
import { IMaterial } from "../../../vox/material/IMaterial";

interface IAppLambert {
    initialize(rsecne: IRendererScene): void;
    createMaterial(vertUniformEnabled?: boolean): IMaterial;

}
export { IAppLambert }
