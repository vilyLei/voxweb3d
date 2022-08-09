import { IShadowVSMModule } from "../../../shadow/vsm/base/IShadowVSMModule";
import ShadowVSMModule from "../../../shadow/vsm/base/ShadowVSMModule";

function create(vsmFboIndex: number): IShadowVSMModule {
    return new ShadowVSMModule(vsmFboIndex);
}

export { create };