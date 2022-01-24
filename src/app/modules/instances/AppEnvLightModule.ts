import IRendererScene from "../../../vox/scene/IRendererScene";
import { IEnvLightModule } from "../../../light/base/IEnvLightModule";
import EnvLightModule from "../../../light/base/EnvLightModule";

class Instance {
    constructor() {
    }
    createEnvLightModule(rsecne: IRendererScene): IEnvLightModule {
        let ctx = rsecne.getRenderProxy().uniformContext;
        return new EnvLightModule(ctx);
    }
}
export { EnvLightModule, Instance };
