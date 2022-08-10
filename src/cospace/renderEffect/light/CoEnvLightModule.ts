import IRendererScene from "../../../vox/scene/IRendererScene";
import EnvLightModule from "../../../light/base/EnvLightModule";

function create(rsecne: IRendererScene): EnvLightModule {
    let ctx = rsecne.getRenderProxy().uniformContext;
    return new EnvLightModule(ctx);
}
export { EnvLightModule, create };
