import IRendererScene from "../../../vox/scene/IRendererScene";
import { IEnvLightModule } from "../../../light/base/IEnvLightModule";
import EnvLightModule from "../../../light/base/EnvLightModule";
import { IAppEnvLightModule } from "../interfaces/IAppEnvLightModule";

class Instance implements IAppEnvLightModule{
    constructor() {
    }
    createEnvLightModule(rsecne: IRendererScene): IEnvLightModule {
        let ctx = rsecne.getRenderProxy().uniformContext;
        return new EnvLightModule(ctx);
    }
}
export { EnvLightModule, Instance };
