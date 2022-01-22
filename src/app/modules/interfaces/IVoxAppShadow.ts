
import ShadowVSMModule from "../../../shadow/vsm/base/ShadowVSMModule";

interface IVoxAppShadow {
    createVSMShadow(vsmFboIndex: number): ShadowVSMModule;
}
export { IVoxAppShadow }
