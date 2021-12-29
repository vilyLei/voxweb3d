import RendererScene from "../../vox/scene/RendererScene";
import { MaterialPipeline } from "../../vox/material/pipeline/MaterialPipeline";
import { IShaderLibConfigure, ShaderCodeType, ShaderCodeUUID, ShaderCodeConfigure, IShaderLibListener, MaterialContext, MaterialContextParam } from "./MaterialContext";

import LambertLightMaterial from "../../vox/material/mcase/LambertLightMaterial";
import PBRMaterial from "../../pbr/material/PBRMaterial";
import PBRShaderDecorator from "../../pbr/material/PBRShaderDecorator";
import Default3DMaterial from "../../vox/material/mcase/Default3DMaterial";
import TextureProxy from "../../vox/texture/TextureProxy";
import { VertUniformComp } from "../../vox/material/component/VertUniformComp";
import { SpecularTextureLoader } from "../../pbr/mana/TextureLoader";

/**
 * 实现 material 构造 pipeline 的上下文
 */
class CommonMaterialContext extends MaterialContext {

    private m_specularLoader: SpecularTextureLoader = null;
    private m_specularEnvMap: TextureProxy = null;
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
        material.setMaterialPipeline(this.pipeline);
        material.setTextureList(textures);
        if (initialization) {
            let hasTex: boolean = textures != null && textures.length > 0 && textures[0] != null;
            material.initializeByCodeBuf(hasTex);
        }
        return material;
    }
    createLambertLightMaterial(vertUniform: boolean = false): LambertLightMaterial {
        let material: LambertLightMaterial = new LambertLightMaterial();
        material.setMaterialPipeline(this.lambertPipeline);
        if(vertUniform) material.vertUniform = new VertUniformComp();
        return material;
    }
    createPBRLightMaterial(decorator: boolean = true, vertUniform: boolean = false, specularEnvMapEnabled: boolean = false): PBRMaterial {

        let material: PBRMaterial = new PBRMaterial();
        material.setMaterialPipeline(this.pbrPipeline);
        if(decorator) material.decorator = new PBRShaderDecorator();
        if(vertUniform) material.vertUniform = new VertUniformComp();
        if(material.decorator != null) {
            if(specularEnvMapEnabled) {
                material.decorator.hdrBrnEnabled = true;
                if(this.m_specularEnvMap == null) {
                    let envMapUrl: string = "static/bytes/spe.mdf";
                    if (material.decorator.hdrBrnEnabled) {
                        envMapUrl = "static/bytes/spe.hdrBrn";
                    }
                    this.m_specularLoader = new SpecularTextureLoader();
                    this.m_specularLoader.hdrBrnEnabled = material.decorator.hdrBrnEnabled;
                    this.m_specularLoader.loadTextureWithUrl(envMapUrl, this.m_rscene);
                    this.m_specularEnvMap = this.m_specularLoader.texture;
                    this.m_specularEnvMap.__$attachThis();
                }
                material.decorator.specularEnvMap = this.m_specularEnvMap;
            }
            
        }
        return material;
    }
    initialize(rscene: RendererScene, param: MaterialContextParam = null, shaderLibConfigure: IShaderLibConfigure = null): void {
        if (this.m_rscene == null) {
            shaderLibConfigure = this.buildConfigure(param, shaderLibConfigure);
            super.initialize(rscene, param, shaderLibConfigure);
        }
    }
    protected buildConfigure(param: MaterialContextParam, shaderLibConfigure: IShaderLibConfigure): IShaderLibConfigure {

        if (shaderLibConfigure == null) {
            let libConfig = this.createShaderLibConfig();

            let configure: ShaderCodeConfigure = null;
            if (param == null) {
                param = new MaterialContextParam();
            }
            param.loadAllShaderCode = true;

            if (param.loadAllShaderCode) {
                if (param.lambertMaterialEnabled) {
                    configure = new ShaderCodeConfigure();
                    configure.buildBinaryFile = param.buildBinaryFile;
                    configure.uuid = ShaderCodeUUID.Lambert;
                    configure.types = [ShaderCodeType.VertHead, ShaderCodeType.VertBody, ShaderCodeType.FragHead, ShaderCodeType.FragBody];
                    if (param.shaderCodeBinary) {
                        configure.urls = [
                            "static/shader/glsl/lambert/glsl01.bin",
                            "static/shader/glsl/lambert/glsl02.bin",
                            "static/shader/glsl/lambert/glsl03.bin",
                            "static/shader/glsl/lambert/glsl04.bin"
                        ]
                    }
                    configure.binary = param.shaderCodeBinary;
                    libConfig.shaderCodeConfigures.push(configure);
                }
                if (param.pbrMaterialEnabled) {
                    configure = new ShaderCodeConfigure();
                    configure.buildBinaryFile = param.buildBinaryFile;
                    configure.uuid = ShaderCodeUUID.PBR;
                    configure.types = [ShaderCodeType.VertHead, ShaderCodeType.VertBody, ShaderCodeType.FragHead, ShaderCodeType.FragBody];
                    if (param.shaderCodeBinary) {
                        configure.urls = [
                            "static/shader/glsl/pbr/glsl01.bin",
                            "static/shader/glsl/pbr/glsl02.bin",
                            "static/shader/glsl/pbr/glsl03.bin",
                            "static/shader/glsl/pbr/glsl04.bin"
                        ]
                        configure.binary = param.shaderCodeBinary;
                    }
                    libConfig.shaderCodeConfigures.push(configure);
                }
            }

            shaderLibConfigure = libConfig;
        }
        return shaderLibConfigure;
    }
    protected initEnd(param: MaterialContextParam): void {

        let selfT: any = this;
        if (this.pbrPipeline == null) selfT.pbrPipeline = this.createPipeline();
        if (this.lambertPipeline == null) selfT.lambertPipeline = this.createPipeline();
        this.pbrPipeline.uuid = "pbr";
        this.lambertPipeline.uuid = "lambert";
        super.initEnd(param);
    }
}
export { ShaderCodeUUID, IShaderLibConfigure, IShaderLibListener, ShaderCodeConfigure, ShaderCodeType, MaterialContextParam, MaterialContext, CommonMaterialContext };