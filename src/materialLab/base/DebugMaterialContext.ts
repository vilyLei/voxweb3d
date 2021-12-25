import RendererScene from "../../vox/scene/RendererScene";
import { IShaderLibConfigure, ShaderCodeType, ShaderCodeUUID, ShaderCodeConfigure, IShaderLibListener, CommonMaterialContext, MaterialContextParam } from "./CommonMaterialContext";

import { LambertLightShaderCode } from "../../vox/material/mcase/glsl/LambertLightShaderCode";
import LambertLightMaterial from "../../vox/material/mcase/LambertLightMaterial";

import { PBRShaderCode } from "../../pbr/material/glsl/PBRShaderCode";
import PBRMaterial from "../../pbr/material/PBRMaterial";
import PBRShaderDecorator from "../../pbr/material/PBRShaderDecorator";
import { MaterialPipeline } from "../../vox/material/pipeline/MaterialPipeline";
import Default3DMaterial from "../../vox/material/mcase/Default3DMaterial";
import TextureProxy from "../../vox/texture/TextureProxy";
/**
 * 实现 material 构造 pipeline 的上下文, 用于debug测试(会打包shader代码到程序中)
 */
class DebugMaterialContext extends CommonMaterialContext {
    
    constructor() {
        super();
    }

    initialize(rscene: RendererScene, param: MaterialContextParam = null, shaderLibConfigure: IShaderLibConfigure = null): void {

        if(param == null) {
            param = new MaterialContextParam();
        }
        param.shaderCodeBinary = false;
        param.loadAllShaderCode = false;
        super.initialize(rscene, param, shaderLibConfigure);        
    }
    protected buildConfigure(param: MaterialContextParam, shaderLibConfigure: IShaderLibConfigure): IShaderLibConfigure {
        return null;
    }
    protected initEnd(param: MaterialContextParam): void {
        super.initEnd( param );
        this.addShaderCodeObject(ShaderCodeUUID.PBR, PBRShaderCode);
        this.addShaderCodeObject(ShaderCodeUUID.Lambert, LambertLightShaderCode);
    }
}
export { ShaderCodeUUID, IShaderLibConfigure, IShaderLibListener, ShaderCodeConfigure, ShaderCodeType, MaterialContextParam, DebugMaterialContext };