import IRendererScene from "../../../vox/scene/IRendererScene";
import { ILightModule } from "../../../light/base/ILightModule";
import { LightModule } from "../../../light/base/LightModule";
import { IAppLightModule } from "../interfaces/IAppLightModule";

class Instance implements IAppLightModule{
    constructor() {
    }
    createLightModule(rsecne: IRendererScene): ILightModule {
        let ctx = rsecne.getRenderProxy().uniformContext;
        return new LightModule(ctx);
    }
}
export { LightModule, Instance };