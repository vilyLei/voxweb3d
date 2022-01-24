import IRendererScene from "../../../vox/scene/IRendererScene";
import { ILightModule } from "../../../light/base/ILightModule";
import { LightModule } from "../../../light/base/LightModule";
import { IAppLightModule } from "../interfaces/IAppLightModule";
import { PointLight } from "../../../light/base/PointLight";
import { DirectionLight } from "../../../light/base/DirectionLight";
import { SpotLight } from "../../../light/base/SpotLight";

class Instance implements IAppLightModule{
    constructor() {
    }
    createLightModule(rsecne: IRendererScene): ILightModule {
        let ctx = rsecne.getRenderProxy().uniformContext;
        return new LightModule(ctx);
    }
}
new PointLight
new DirectionLight
new SpotLight
export { PointLight, SpotLight, DirectionLight, LightModule, Instance };