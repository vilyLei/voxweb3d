import IRendererScene from "../../vox/scene/IRendererScene";
import { IMaterialPipeline } from "../../vox/material/pipeline/IMaterialPipeline";
import { ILightModule } from "../../light/base/ILightModule";
import { IEnvLightModule } from "../../light/base/IEnvLightModule";
import { IShadowVSMModule } from "../../shadow/vsm/base/IShadowVSMModule";
import ImageTextureLoader from "../../vox/texture/ImageTextureLoader";
import IRenderTexture from "../../vox/render/texture/IRenderTexture";
import { TextureConst } from "../../vox/texture/TextureConst";
import { ShaderCodeUUID } from "../../vox/material/ShaderCodeUUID";
import { ShaderCodeConfigure, ShaderCodeType, IShaderLibConfigure, IShaderLibListener, ShaderLib } from "../shader/ShaderLib";
import IShaderCodeObject from "../../vox/material/IShaderCodeObject";
import { MaterialContextParam } from "./MaterialContextParam";
import { IMaterialContext } from "./IMaterialContext";

/**
 * 实现 material 构造 pipeline 的上下文
 */
class MaterialContext implements IMaterialContext {
    
    private m_initFlag: boolean = true;
    private m_texLoader: ImageTextureLoader = null;
    private m_param: MaterialContextParam;
    protected m_rscene: IRendererScene = null;
    /**
     * 全局的灯光模块
     */
    lightModule: ILightModule = null;
    /**
     * 全局的环境参数
     */
    envLightModule: IEnvLightModule = null;
    /**
     * vsm 阴影
     */
    vsmModule: IShadowVSMModule = null;
    /**
     * material 构造material流水线, 这是一个默认的material pipeline
     */
    pipeline: IMaterialPipeline = null;
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
    getTextureByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled: boolean = true): IRenderTexture {
        let tex: IRenderTexture = null;
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
    
    protected buildConfigure(param: MaterialContextParam, shaderLibConfigure: IShaderLibConfigure): IShaderLibConfigure {

        if (shaderLibConfigure == null) {
            let libConfig = this.createShaderLibConfig();
            if (param == null) {
                param = new MaterialContextParam();
            }
            // param.loadAllShaderCode = true;

            if (param.loadAllShaderCode) {

                let configure: ShaderCodeConfigure = MaterialContext.ShaderLib.createShaderCodeConfigure(param);
                if (configure != null) {
                    libConfig.shaderCodeConfigures.push(configure);
                }
            }

            shaderLibConfigure = libConfig;
        }
        return shaderLibConfigure;
    }
    initialize(rscene: IRendererScene, param: MaterialContextParam = null, shaderLibConfigure: IShaderLibConfigure = null): void {

        if (this.m_initFlag) {

            shaderLibConfigure = this.buildConfigure(param, shaderLibConfigure);

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
            
            this.initPipes( this.m_param );

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
    protected initPipes(param: MaterialContextParam): void {
       
    }
    protected initEnd(param: MaterialContextParam): void {

    }

    addShaderCodeObject(uuid: ShaderCodeUUID, shaderCodeObject: IShaderCodeObject): void {
        MaterialContext.ShaderLib.addShaderCodeObject(uuid, shaderCodeObject);
    }
    addPipeline(pipeline: IMaterialPipeline): void {
        if (pipeline != null && pipeline != this.pipeline) {
            if(this.lightModule != null) pipeline.addPipe(this.lightModule);
            if(this.envLightModule != null) pipeline.addPipe(this.envLightModule);
            if (this.vsmModule != null) pipeline.addPipe(this.vsmModule);
        }
    }
    createPipeline(): IMaterialPipeline {
        let pipeline = this.m_rscene.materialBlock.createMaterialPipeline(MaterialContext.ShaderLib);
        if(this.lightModule != null) pipeline.addPipe(this.lightModule);
        if(this.envLightModule != null) pipeline.addPipe(this.envLightModule);
        if (this.vsmModule != null) pipeline.addPipe(this.vsmModule);
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