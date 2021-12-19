import RendererScene from "../../vox/scene/RendererScene";
import { MaterialPipeline } from "../../vox/material/pipeline/MaterialPipeline";
import { IShaderLibConfigure, ShaderCodeType, ShaderCodeUUID, ShaderCodeConfigure, IShaderLibListener, MaterialContext, MaterialContextParam } from "./MaterialContext";

import LambertLightMaterial from "../../vox/material/mcase/LambertLightMaterial";
import PBRMaterial from "../../pbr/material/PBRMaterial";

/**
 * 实现 material 构造 pipeline 的上下文, 用于debug测试(会打包shader代码到程序中)
 */
class CommonMaterialContex extends MaterialContext {
    /**
     * material 构造material流水线, 这是一个默认的material pipeline
     */
    readonly lambertPipeline: MaterialPipeline = null;
    constructor() {
        super();
    }
    createLambertMaterial(): LambertLightMaterial {
        let material: LambertLightMaterial = new LambertLightMaterial();
        material.setMaterialPipeline(this.lambertPipeline);
        return material;
    }
    initialize(rscene: RendererScene, param: MaterialContextParam = null, shaderLibConfigure: IShaderLibConfigure = null): void {

        if(shaderLibConfigure == null) {
            let libConfig = this.createShaderLibConfig();
            let configure = new ShaderCodeConfigure();
            configure.uuid = ShaderCodeUUID.Lambert;
            //  configure.buildBinaryFile = false;
            configure.types = [ShaderCodeType.VertHead, ShaderCodeType.VertBody, ShaderCodeType.FragHead, ShaderCodeType.FragBody];
            configure.urls = [
                "static/shader/glsl/lambert/glsl01.bin",
                "static/shader/glsl/lambert/glsl02.bin",
                "static/shader/glsl/lambert/glsl03.bin",
                "static/shader/glsl/lambert/glsl04.bin"
            ]
            configure.binary = true;
            libConfig.shaderCodeConfigures.push( configure );
            shaderLibConfigure = libConfig;
        }

        super.initialize(rscene, param, shaderLibConfigure);
    }
}
export { ShaderCodeUUID, IShaderLibConfigure, IShaderLibListener, ShaderCodeConfigure, ShaderCodeType, MaterialContextParam, MaterialContext, CommonMaterialContex };