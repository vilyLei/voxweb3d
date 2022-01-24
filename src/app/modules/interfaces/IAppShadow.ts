
import ShadowVSMModule from "../../../shadow/vsm/base/ShadowVSMModule";

interface IAppShadow {
    createVSMShadow(vsmFboIndex: number): ShadowVSMModule;
}
export { IAppShadow }
