import IRendererScene from "../../../vox/scene/IRendererScene";
import { IEnvLightModule } from "../../../light/base/IEnvLightModule";
// import EnvLightModule from "../../../light/base/EnvLightModule";

interface ICoEnvLightModule {

    create(rsecne: IRendererScene): IEnvLightModule;
}
export { ICoEnvLightModule };
