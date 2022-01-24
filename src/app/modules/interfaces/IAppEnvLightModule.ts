import IRendererScene from "../../../vox/scene/IRendererScene";
import { IEnvLightModule } from "../../../light/base/IEnvLightModule";
import EnvLightModule from "../../../light/base/EnvLightModule";

interface IAppEnvLightModule {

    createEnvLightModule(rsecne: IRendererScene): IEnvLightModule;
}
export { IAppEnvLightModule };
