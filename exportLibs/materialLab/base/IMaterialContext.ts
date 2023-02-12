import IRendererScene from "../../vox/scene/IRendererScene";
import { IMaterialPipeline } from "../../vox/material/pipeline/IMaterialPipeline";
import { ILightModule } from "../../light/base/ILightModule";
import { IEnvLightModule } from "../../light/base/IEnvLightModule";
import { IShadowVSMModule } from "../../shadow/vsm/base/IShadowVSMModule";
import IRenderTexture from "../../vox/render/texture/IRenderTexture";
import { ShaderCodeUUID } from "../../vox/material/ShaderCodeUUID";
import { IShaderLibListener } from "../shader/IShaderLibListener";
import { IShaderLibConfigure } from "../shader/IShaderLibConfigure";
import IShaderCodeObject from "../../vox/material/IShaderCodeObject";
import { IMaterialContextParam } from "./IMaterialContextParam";

/**
 * 实现 material 构造 pipeline 的上下文
 */
interface IMaterialContext {

    /**
     * 全局的灯光模块
     */
    lightModule: ILightModule;
    /**
     * 全局的环境参数
     */
    envLightModule: IEnvLightModule;
    /**
     * vsm 阴影
     */
    vsmModule: IShadowVSMModule;
    /**
     * material 构造material流水线, 这是一个默认的material pipeline
     */
    pipeline: IMaterialPipeline;
    /**
     * shader code management module
     */
    // static readonly ShaderLib: IShaderLib;

    addShaderLibListener(listener: IShaderLibListener): void;

    isTextureLoadedAll(): boolean;
    getTextureByUrl(purl: string, wrapRepeat?: boolean, mipmapEnabled?: boolean): IRenderTexture;
    createShaderLibConfig(): IShaderLibConfigure;

    initialize(rscene: IRendererScene, param?: IMaterialContextParam, shaderLibConfigure?: IShaderLibConfigure): void;
    hasShaderCodeObjectWithUUID(uuid: ShaderCodeUUID): boolean;
    addShaderCodeObject(uuid: ShaderCodeUUID, shaderCodeObject: IShaderCodeObject): void
    addPipeline(pipeline: IMaterialPipeline): void
    createPipeline(): IMaterialPipeline;
    run(): void;
    destroy(): void;
}
export { IMaterialContext }