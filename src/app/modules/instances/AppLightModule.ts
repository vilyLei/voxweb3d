import IRendererScene from "../../../vox/scene/IRendererScene";
import { ILightModule } from "../../../light/base/ILightModule";
import { LightModule } from "../../../light/base/LightModule";

class Instance {
    constructor() {
    }
    createLightModule(rsecne: IRendererScene): ILightModule {
        let ctx = rsecne.getRenderProxy().uniformContext;
        return new LightModule(ctx);
    }
}
export { LightModule, Instance };