import RendererScene from "../../vox/scene/RendererScene";
import { IMaterialPipeline } from "../../vox/material/pipeline/IMaterialPipeline";
import { IShaderLibConfigure, ShaderCodeType, ShaderCodeUUID, ShaderCodeConfigure, IShaderLibListener, MaterialContext, MaterialContextParam } from "./MaterialContext";

import LambertLightMaterial from "../../vox/material/mcase/LambertLightMaterial";
import PBRMaterial from "../../pbr/material/PBRMaterial";
import PBRShaderDecorator from "../../pbr/material/PBRShaderDecorator";
import Default3DMaterial from "../../vox/material/mcase/Default3DMaterial";
import IRenderTexture from "../../vox/render/texture/IRenderTexture";
import { VertUniformComp } from "../../vox/material/component/VertUniformComp";
import { SpecularTextureLoader } from "../../pbr/mana/TextureLoader";
import MathConst from "../../vox/math/MathConst";
import { LightModule } from "../../light/base/LightModule";
import EnvLightModule from "../../light/base/EnvLightModule";
import ShadowVSMModule from "../../shadow/vsm/base/ShadowVSMModule";
import { Vector3D } from "../../app/VoxApp";

/**
 * 实现 material 构造 pipeline 的上下文
 */
class CommonMaterialContext extends MaterialContext {

    private m_specularLoader: SpecularTextureLoader = null;
    private m_specularEnvMap: IRenderTexture = null;

    /**
     * 构造 lambert light material流水线
     */
    readonly lambertPipeline: IMaterialPipeline = null;
    /**
     * 构造 pbr light material流水线
     */
    readonly pbrPipeline: IMaterialPipeline = null;
    constructor() {
        super();
    }
    createDefaultMaterial(textures: IRenderTexture[], initialization: boolean = true): Default3DMaterial {
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
        if (vertUniform) material.vertUniform = new VertUniformComp();
        return material;
    }
    createSpecularTex(hdrBrnEnabled: boolean): IRenderTexture {

        if (this.m_specularEnvMap == null) {
            let envMapUrl: string = "static/bytes/spe.mdf";
            if (hdrBrnEnabled) {
                envMapUrl = "static/bytes/speBrn.bin";
            }
            this.m_specularLoader = new SpecularTextureLoader();
            this.m_specularLoader.hdrBrnEnabled = hdrBrnEnabled;
            this.m_specularLoader.loadTextureWithUrl(envMapUrl, this.m_rscene);
            this.m_specularEnvMap = this.m_specularLoader.texture;
            this.m_specularEnvMap.__$attachThis();
        }
        return this.m_specularEnvMap;
    }
    createPBRLightMaterial(decorator: boolean = true, vertUniform: boolean = false, specularEnvMapEnabled: boolean = false): PBRMaterial {

        let material: PBRMaterial = new PBRMaterial();
        material.setMaterialPipeline(this.pbrPipeline);
        if (decorator) material.decorator = new PBRShaderDecorator();
        if (vertUniform) material.vertUniform = new VertUniformComp();
        if (material.decorator != null) {
            if (specularEnvMapEnabled) {
                material.decorator.hdrBrnEnabled = true;
                material.decorator.specularEnvMap = this.createSpecularTex(material.decorator.hdrBrnEnabled);
            }
        }
        return material;
    }
    initialize(rscene: RendererScene, param: MaterialContextParam = null, shaderLibConfigure: IShaderLibConfigure = null): void {
        if (this.m_rscene == null) {
            // shaderLibConfigure = this.buildConfigure(param, shaderLibConfigure);
            super.initialize(rscene, param, shaderLibConfigure);
        }
    }
    
    protected initPipes(param: MaterialContextParam): void {
        
        let selfT: any = this;
        
        param.pointLightsTotal = MathConst.Clamp(param.pointLightsTotal, 0, 256);
        param.directionLightsTotal = MathConst.Clamp(param.directionLightsTotal, 0, 256);
        param.spotLightsTotal = MathConst.Clamp(param.spotLightsTotal, 0, 256);

        let shdCtx = this.m_rscene.getRenderProxy().uniformContext;
        selfT.lightModule = new LightModule(shdCtx);
        for (let i: number = 0; i < param.pointLightsTotal; ++i) {
            this.lightModule.appendPointLight();
        }
        for (let i: number = 0; i < param.directionLightsTotal; ++i) {
            this.lightModule.appendDirectionLight();
        }
        for (let i: number = 0; i < param.spotLightsTotal; ++i) {
            this.lightModule.appendSpotLight();
        }
        this.lightModule.update();

        selfT.envData = new EnvLightModule(shdCtx);
        this.envData.initialize();
        this.envData.setFogColorRGB3f(0.0, 0.8, 0.1);
        if (param.vsmEnabled) {
            let vsmModule = new ShadowVSMModule(param.vsmFboIndex);
            vsmModule.setCameraPosition(new Vector3D(1, 800, 1));
            vsmModule.setCameraNear(10.0);
            vsmModule.setCameraFar(3000.0);
            vsmModule.setMapSize(512.0, 512.0);
            vsmModule.setCameraViewSize(4000, 4000);
            vsmModule.setShadowRadius(2);
            vsmModule.setShadowBias(-0.0005);
            vsmModule.initialize(this.m_rscene, [0], 3000);
            vsmModule.setShadowIntensity(0.8);
            vsmModule.setColorIntensity(0.3);

            selfT.vsmModule = vsmModule;
        }
    }
    protected buildConfigure(param: MaterialContextParam, shaderLibConfigure: IShaderLibConfigure): IShaderLibConfigure {
        if (shaderLibConfigure == null) {
            param.loadAllShaderCode = true;
        }
        return super.buildConfigure(param, shaderLibConfigure);
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