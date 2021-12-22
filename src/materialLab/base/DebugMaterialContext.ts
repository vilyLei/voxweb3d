import RendererScene from "../../vox/scene/RendererScene";
import { IShaderLibConfigure, ShaderCodeType, ShaderCodeUUID, ShaderCodeConfigure, IShaderLibListener, MaterialContext, MaterialContextParam } from "./MaterialContext";

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
class DebugMaterialContext extends MaterialContext {
    
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
    createDefaultMaterial(textures: TextureProxy[], initialization: boolean = true): Default3DMaterial {
        let material: Default3DMaterial = new Default3DMaterial();
        material.setMaterialPipeline(this.lambertPipeline);
        material.setTextureList(textures);
        if(initialization) {
            let hasTex: boolean = textures != null && textures.length > 0 && textures[0] != null;
            material.initializeByCodeBuf( hasTex );
        }
        return material;
    }
    createLambertLightMaterial(): LambertLightMaterial {
        let material: LambertLightMaterial = new LambertLightMaterial();
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
export { ShaderCodeUUID, IShaderLibConfigure, IShaderLibListener, ShaderCodeConfigure, ShaderCodeType, MaterialContextParam, MaterialContext, DebugMaterialContext };