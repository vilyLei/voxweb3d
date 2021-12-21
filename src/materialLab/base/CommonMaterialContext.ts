import RendererScene from "../../vox/scene/RendererScene";
import { MaterialPipeline } from "../../vox/material/pipeline/MaterialPipeline";
import { IShaderLibConfigure, ShaderCodeType, ShaderCodeUUID, ShaderCodeConfigure, IShaderLibListener, MaterialContext, MaterialContextParam } from "./MaterialContext";

import LambertLightMaterial from "../../vox/material/mcase/LambertLightMaterial";
import PBRMaterial from "../../pbr/material/PBRMaterial";
import PBRShaderDecorator from "../../pbr/material/PBRShaderDecorator";
import Default3DMaterial from "../../vox/material/mcase/Default3DMaterial";
import TextureProxy from "../../vox/texture/TextureProxy";

/**
 * 实现 material 构造 pipeline 的上下文
 */
class CommonMaterialContext extends MaterialContext {
    
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
        if (this.m_rscene == null) {
            
            if (shaderLibConfigure == null) {
                let libConfig = this.createShaderLibConfig();

                let configure: ShaderCodeConfigure = null;
                if(param == null) {
                    param = new MaterialContextParam();
                }
                param.loadAllShaderCode = true;
                param.shaderCodeBinary = true;

                if (param.lambertMaterialEnabled) {
                    configure = new ShaderCodeConfigure();
                    configure.uuid = ShaderCodeUUID.Lambert;
                    configure.types = [ShaderCodeType.VertHead, ShaderCodeType.VertBody, ShaderCodeType.FragHead, ShaderCodeType.FragBody];
                    configure.urls = [
                        "static/shader/glsl/lambert/glsl01.bin",
                        "static/shader/glsl/lambert/glsl02.bin",
                        "static/shader/glsl/lambert/glsl03.bin",
                        "static/shader/glsl/lambert/glsl04.bin"
                    ]
                    configure.binary = true;
                    libConfig.shaderCodeConfigures.push(configure);
                }
                if (param.pbrMaterialEnabled) {
                    configure = new ShaderCodeConfigure();
                    configure.uuid = ShaderCodeUUID.PBR;
                    configure.types = [ShaderCodeType.VertHead, ShaderCodeType.VertBody, ShaderCodeType.FragHead, ShaderCodeType.FragBody];
                    configure.urls = [
                        "static/shader/glsl/pbr/glsl01.bin",
                        "static/shader/glsl/pbr/glsl02.bin",
                        "static/shader/glsl/pbr/glsl03.bin",
                        "static/shader/glsl/pbr/glsl04.bin"
                    ]
                    configure.binary = true;
                    libConfig.shaderCodeConfigures.push(configure);
                }

                shaderLibConfigure = libConfig;
            }

            super.initialize(rscene, param, shaderLibConfigure);
            let selfT: any = this;
            selfT.pbrPipeline = this.createPipeline();
            selfT.lambertPipeline = this.createPipeline();
        }
    }
}
export { ShaderCodeUUID, IShaderLibConfigure, IShaderLibListener, ShaderCodeConfigure, ShaderCodeType, MaterialContextParam, MaterialContext, CommonMaterialContext };