import { IShadowVSMModule } from "../../../shadow/vsm/base/IShadowVSMModule";

interface IVSMShadowModule{
    create(vsmFboIndex: number): IShadowVSMModule;
}
export { IVSMShadowModule };