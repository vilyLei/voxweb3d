import RendererScene from "../../vox/scene/RendererScene";
import { IShaderLibConfigure, ShaderCodeType, ShaderCodeUUID, ShaderCodeConfigure, IShaderLibListener, MaterialContext, MaterialContextParam } from "./MaterialContext";

import { LambertLightShaderCode } from "../../vox/material/mcase/glsl/LambertLightShaderCode";
import LambertLightMaterial from "../../vox/material/mcase/LambertLightMaterial";

import { PBRShaderCode } from "../../pbr/material/glsl/PBRShaderCode";
import PBRMaterial from "../../pbr/material/PBRMaterial";
/**
 * 实现 material 构造 pipeline 的上下文, 用于debug测试(会打包shader代码到程序中)
 */
class MaterialContextDebug extends MaterialContext {
    constructor() {
        super();
    }
    initialize(rscene: RendererScene, param: MaterialContextParam = null, shaderLibConfigure: IShaderLibConfigure = null): void {

        let lambertMaterial: LambertLightMaterial = new LambertLightMaterial();
        lambertMaterial.getCodeBuf().setShaderCodeObject( LambertLightShaderCode );

        let pbrMaterial: PBRMaterial = new PBRMaterial();
        pbrMaterial.getCodeBuf().setShaderCodeObject( PBRShaderCode );

        super.initialize(rscene, param, shaderLibConfigure);
    }
}
export { ShaderCodeUUID, IShaderLibConfigure, IShaderLibListener, ShaderCodeConfigure, ShaderCodeType, MaterialContextParam, MaterialContext, MaterialContextDebug };