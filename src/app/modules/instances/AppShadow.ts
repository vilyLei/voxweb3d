import { IShadowVSMModule } from "../../../shadow/vsm/base/IShadowVSMModule";
import ShadowVSMModule from "../../../shadow/vsm/base/ShadowVSMModule";

class Instance {
    constructor() {
    }
    createVSMShadow(vsmFboIndex: number): IShadowVSMModule {
        return new ShadowVSMModule(vsmFboIndex);
    }
}
export { ShadowVSMModule, Instance };