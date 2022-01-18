import IRendererScene from "../../vox/scene/IRendererScene";
import Vector3D from "../../vox/math/Vector3D";

import { IMaterialPipeline } from "../../vox/material/pipeline/IMaterialPipeline";
import { LightModule } from "../../light/base/LightModule";
import Color4 from "../../vox/material/Color4";
import EnvLightData from "../../light/base/EnvLightData";
import ShadowVSMModule from "../../shadow/vsm/base/ShadowVSMModule";
import MathConst from "../../vox/math/MathConst";
import ImageTextureLoader from "../../vox/texture/ImageTextureLoader";
import TextureProxy from "../../vox/texture/TextureProxy";
import { TextureConst } from "../../vox/texture/TextureConst";
import { ShaderCodeUUID } from "../../vox/material/ShaderCodeUUID";
import { ShaderCodeConfigure, ShaderCodeType, IShaderLibConfigure, IShaderLibListener, ShaderLib } from "../shader/ShaderLib";
import { ShaderCodeObject } from "../shader/ShaderCodeObject";

class MaterialContextParam {

    pointLightsTotal: number = 1;
    directionLightsTotal: number = 1;
    spotLightsTotal: number = 0;
    vsmFboIndex: number = 0;
    vsmEnabled: boolean = true;
    loadAllShaderCode: boolean = false;
    shaderCodeBinary: boolean = false;
    shaderLibVersion: string = "";
    shaderFileRename: boolean = false;

    lambertMaterialEnabled: boolean = true;
    pbrMaterialEnabled: boolean = true;
    /**
     * 生产 二进制 glsl代码文件
     */
    buildBinaryFile: boolean = false;

    constructor() { }
}
/**
 * 实现 material 构造 pipeline 的上下文
 */
class MaterialContext {

    private m_initFlag: boolean = true;
    private m_texLoader: ImageTextureLoader = null;
    private m_param: MaterialContextParam;
    protected m_rscene: IRendererScene = null;
    /**
     * 全局的灯光模块
     */
    readonly lightModule: LightModule;
    /**
     * 全局的环境参数
     */
    readonly envData: EnvLightData = null;
    /**
     * vsm 阴影
     */
    readonly vsmModule: ShadowVSMModule = null;
    /**
     * material 构造material流水线, 这是一个默认的material pipeline
     */
    readonly pipeline: IMaterialPipeline = null;
    /**
     * shader code management module
     */
    static readonly ShaderLib: ShaderLib = new ShaderLib();

    constructor() { }

    addShaderLibListener(listener: IShaderLibListener): void {
        if (MaterialContext.ShaderLib != null) {
            MaterialContext.ShaderLib.setListener(listener);
        }
    }
    getTextureLoader(): ImageTextureLoader {
        return this.m_texLoader;
    }

    isTextureLoadedAll(): boolean {
        return this.m_texLoader.isLoadedAll();
    }
    getTextureByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): TextureProxy {
        let tex: TextureProxy = null;
        let suffix: string = purl.slice(purl.lastIndexOf(".") + 1);
        suffix = suffix.toLocaleLowerCase();
        switch (suffix) {
            case "jpeg":
            case "jpg":
            case "png":
            case "gif":
                tex = this.m_texLoader.getImageTexByUrl(purl);
                tex.mipmapEnabled = mipmapEnabled;
                if (wrapRepeat) tex.setWrap(TextureConst.WRAP_REPEAT);
                break;
            default:
                console.warn("texture resource data type is undefined.");
                break;
        }
        return tex;
    }
    createShaderLibConfig(): IShaderLibConfigure {
        return { shaderCodeConfigures: [], version: "" };
    }
    initialize(rscene: IRendererScene, param: MaterialContextParam = null, shaderLibConfigure: IShaderLibConfigure = null): void {

        if (this.m_initFlag) {

            this.m_initFlag = false;
            this.m_rscene = rscene;
            this.m_texLoader = new ImageTextureLoader((this.m_rscene as any).textureBlock);

            let selfT: any = this;
            if (param == null) {
                param = new MaterialContextParam();
            }
            this.m_param = param;
            if (param.shaderLibVersion != "") shaderLibConfigure.version = param.shaderLibVersion;

            MaterialContext.ShaderLib.initialize(shaderLibConfigure, param.shaderCodeBinary);
            if (param.loadAllShaderCode) {
                MaterialContext.ShaderLib.addAllShaderCodeObject();
            }

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

            selfT.envData = new EnvLightData(shdCtx);
            this.envData.initialize();
            this.envData.setFogColorRGB3f(0.0, 0.8, 0.1);
            if (param.vsmEnabled) {
                selfT.vsmModule = new ShadowVSMModule(param.vsmFboIndex);
                this.vsmModule.setCameraPosition(new Vector3D(1, 800, 1));
                this.vsmModule.setCameraNear(10.0);
                this.vsmModule.setCameraFar(3000.0);
                this.vsmModule.setMapSize(512.0, 512.0);
                this.vsmModule.setCameraViewSize(4000, 4000);
                this.vsmModule.setShadowRadius(2);
                this.vsmModule.setShadowBias(-0.0005);
                this.vsmModule.initialize(rscene, [0], 3000);
                this.vsmModule.setShadowIntensity(0.8);
                this.vsmModule.setColorIntensity(0.3);
            }

            selfT.pipeline = this.createPipeline();

            this.initEnd(param);

            if (!param.loadAllShaderCode) {
                let listener = MaterialContext.ShaderLib.getListener();
                if (listener != null) {
                    listener.shaderLibLoadComplete(0, 0);
                }
            }
        }
    }
    protected initEnd(param: MaterialContextParam): void {

    }

    addShaderCodeObject(uuid: ShaderCodeUUID, shaderCodeObject: ShaderCodeObject): void {
        MaterialContext.ShaderLib.addShaderCodeObject(uuid, shaderCodeObject);
    }
    addPipeline(pipeline: IMaterialPipeline): void {
        if (pipeline != null && pipeline != this.pipeline) {
            pipeline.addPipe(this.lightModule);
            pipeline.addPipe(this.envData);
            if (this.vsmModule != null) {
                pipeline.addPipe(this.vsmModule);
            }
        }
    }
    createPipeline(): IMaterialPipeline {
        let pipeline = this.m_rscene.materialBlock.createMaterialPipeline(MaterialContext.ShaderLib);
        pipeline.addPipe(this.lightModule);
        pipeline.addPipe(this.envData);
        if (this.vsmModule != null) {
            pipeline.addPipe(this.vsmModule);
        }
        return pipeline;
    }
    run(): void {

        if (this.vsmModule != null && this.m_param.vsmEnabled) {
            this.vsmModule.run();
        }
    }
    destroy(): void {
        this.m_rscene = null;
    }
}
export { ShaderCodeUUID, IShaderLibConfigure, IShaderLibListener, ShaderCodeConfigure, ShaderCodeType, MaterialContextParam, MaterialContext };