import IRendererScene from "../../../vox/scene/IRendererScene";
// import { IEnvLightModule } from "../../../light/base/IEnvLightModule";
import EnvLightModule from "../../../light/base/EnvLightModule";
// import { ICoEnvLightModule } from "./ICoEnvLightModule";

// class Instance implements IAppEnvLightModule{
//     constructor() {
//     }
//     createEnvLightModule(rsecne: IRendererScene): IEnvLightModule {
//         let ctx = rsecne.getRenderProxy().uniformContext;
//         return new EnvLightModule(ctx);
//     }
// }
function create(rsecne: IRendererScene): EnvLightModule {
    let ctx = rsecne.getRenderProxy().uniformContext;
    return new EnvLightModule(ctx);
}
export { EnvLightModule, create };
