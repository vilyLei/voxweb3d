import RendererScene from "../../vox/scene/RendererScene";
import Vector3D from "../../vox/math/Vector3D";

import { MaterialPipeline } from "../../vox/material/pipeline/MaterialPipeline";
import { LightModule } from "../../light/base/LightModule";
import Color4 from "../../vox/material/Color4";
import EnvLightData from "../../light/base/EnvLightData";
import ShadowVSMModule from "../../shadow/vsm/base/ShadowVSMModule";
import MathConst from "../../vox/math/MathConst";
import ImageTextureLoader from "../../vox/texture/ImageTextureLoader";
import TextureProxy from "../../vox/texture/TextureProxy";
import { TextureConst } from "../../vox/texture/TextureConst";
import { IShaderLibListener,ShaderLib } from "../shader/ShaderLib";

class MaterialContextParam {

    pointLightsTotal: number = 1;
    directionLightsTotal: number = 1;
    spotLightsTotal: number = 0;
    vsmFboIndex: number = 0;
    vsmEnabled: boolean = true;
    loadAllShaderCode: boolean = false;
    constructor() { }
}
/**
 * 实现 material 构造 pipeline 的上下文
 */
class MaterialContext {

    private m_rscene: RendererScene = null;
    private m_initFlag: boolean = true;
    private m_param: MaterialContextParam;
    /**
     * 全局的灯光模块
     */
    readonly lightModule: LightModule = new LightModule();
    /**
     * 全局的环境参数
     */
    readonly envData: EnvLightData = new EnvLightData();
    /**
     * vsm 阴影
     */
    readonly vsmModule: ShadowVSMModule = null;
    /**
     * material 构造流水线
     */
    readonly pipeline: MaterialPipeline = null;
    /**
     * shader code management module
     */
    static readonly ShaderLib: ShaderLib = new ShaderLib();

    private m_texLoader: ImageTextureLoader = null;
    constructor() { }

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

    initialize(rscene: RendererScene, param: MaterialContextParam = null, shaderLibConfigure: any = null): void {

        if (this.m_initFlag) {

            this.m_rscene = rscene;
            this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);

            let selfT: any = this;
            if (param == null) {
                param = new MaterialContextParam();
            }
            this.m_param = param;

            MaterialContext.ShaderLib.initialize(shaderLibConfigure);
            if(this.m_param.loadAllShaderCode) {
                MaterialContext.ShaderLib.addAllShaderCodeObject();
            }

            param.pointLightsTotal = MathConst.Clamp(param.pointLightsTotal, 0, 256);
            param.directionLightsTotal = MathConst.Clamp(param.directionLightsTotal, 0, 256);
            param.spotLightsTotal = MathConst.Clamp(param.spotLightsTotal, 0, 256);

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

            selfT.envData = new EnvLightData();
            this.envData.initialize();
            this.envData.setFogColorRGB3f(0.0, 0.8, 0.1);
            if (param.vsmEnabled) {
                selfT.vsmModule = new ShadowVSMModule(param.vsmFboIndex);
                this.vsmModule.setCameraPosition(new Vector3D(120, 800, 120));
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

            selfT.pipeline = new MaterialPipeline();
            this.pipeline.addPipe(this.lightModule);
            this.pipeline.addPipe(this.envData);
            if (this.vsmModule != null) {
                this.pipeline.addPipe(this.vsmModule.getVSMData());
            }
        }
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
export { IShaderLibListener, MaterialContextParam, MaterialContext };