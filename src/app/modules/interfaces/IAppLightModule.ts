import IRendererScene from "../../../vox/scene/IRendererScene";
import { ILightModule } from "../../../light/base/ILightModule";
interface IAppLightModule {
    createLightModule(rsecne: IRendererScene): ILightModule;
}
export { IAppLightModule }