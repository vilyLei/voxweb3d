
import IRendererScene from "../../../vox/scene/IRendererScene";
import { IMaterial } from "../../../vox/material/IMaterial";

interface ILambertEffectInstance {
    initialize(rsecne: IRendererScene): void;
    createMaterial(vertUniformEnabled?: boolean): IMaterial;

}
interface ILambertEffect {
    create(): ILambertEffectInstance;

}
export { ILambertEffectInstance, ILambertEffect }
