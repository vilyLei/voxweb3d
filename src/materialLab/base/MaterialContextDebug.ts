import RendererScene from "../../vox/scene/RendererScene";
import { IShaderLibConfigure, ShaderCodeType, ShaderCodeUUID, ShaderCodeConfigure, IShaderLibListener, MaterialContext, MaterialContextParam } from "./MaterialContext";

import { LambertLightShaderCode } from "../../vox/material/mcase/glsl/LambertLightShaderCode";
import LambertLightMaterial from "../../vox/material/mcase/LambertLightMaterial";

import { PBRShaderCode } from "../../pbr/material/glsl/PBRShaderCode";
import PBRMaterial from "../../pbr/material/PBRMaterial";
import PBRShaderDecorator from "../../pbr/material/PBRShaderDecorator";
import { MaterialPipeline } from "../../vox/material/pipeline/MaterialPipeline";
/**
 * 实现 material 构造 pipeline 的上下文, 用于debug测试(会打包shader代码到程序中)
 */
class MaterialContextDebug extends MaterialContext {
    
    /**
     * 构造 lambert light material流水线
     */
    readonly lambertPipeline: MaterialPipeline = null;
    /**
     * 构造 pbr light material流水线
     */
    readonly pbrPipeline: MaterialPipeline = null;
    
    constructor() {
        super();
    }

    // createLambertLightMaterial(): LambertLightMaterial {
    //     let material: LambertLightMaterial = new LambertLightMaterial();
    //     material.setMaterialPipeline(this.pipeline);
    //     return material;
    // }
    // createPBRLightMaterial(): PBRMaterial {
    //     let material: PBRMaterial = new PBRMaterial();
    //     material.setMaterialPipeline(this.pipeline);
    //     material.decorator = new PBRShaderDecorator();
    //     return material;
    // }
    
    createLambertLightMaterial(): LambertLightMaterial {
        let material: LambertLightMaterial = new LambertLightMaterial();
        console.log("this.lambertPipeline: ",this.lambertPipeline);
        material.setMaterialPipeline(this.lambertPipeline);
        return material;
    }
    createPBRLightMaterial(): PBRMaterial {
        let material: PBRMaterial = new PBRMaterial();
        material.setMaterialPipeline(this.pbrPipeline);
        material.decorator = new PBRShaderDecorator();
        return material;
    }

    initialize(rscene: RendererScene, param: MaterialContextParam = null, shaderLibConfigure: IShaderLibConfigure = null): void {

        if(param != null) {
            param.shaderCodeBinary = false;
            param.loadAllShaderCode = false;
        }
        super.initialize(rscene, param, shaderLibConfigure);        
    }
    
    protected initEnd(param: MaterialContextParam): void {

        let selfT: any = this;
        selfT.pbrPipeline = this.createPipeline();
        selfT.lambertPipeline = this.createPipeline();
        this.addShaderCodeObject(ShaderCodeUUID.PBR, PBRShaderCode);
        this.addShaderCodeObject(ShaderCodeUUID.Lambert, LambertLightShaderCode);
        super.initEnd( param );
    }
}
export { ShaderCodeUUID, IShaderLibConfigure, IShaderLibListener, ShaderCodeConfigure, ShaderCodeType, MaterialContextParam, MaterialContext, MaterialContextDebug };