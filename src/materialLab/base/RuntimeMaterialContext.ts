import IRendererScene from "../../vox/scene/IRendererScene";
import { IMaterialPipeline } from "../../vox/material/pipeline/IMaterialPipeline";
import MathConst from "../../vox/math/MathConst";
import { ShaderCodeUUID } from "../../vox/material/ShaderCodeUUID";
import { ShaderCodeConfigure, ShaderCodeType, IShaderLibConfigure, IShaderLibListener, ShaderLib } from "../shader/ShaderLib";
import { ShaderCodeObject } from "../shader/ShaderCodeObject";
import { MaterialContextParam } from "./MaterialContextParam";

/**
 * 实现 material 构造 pipeline 的上下文
 */
class RuntimeMaterialContext {

    private m_initFlag: boolean = true;
    private m_param: MaterialContextParam;
    protected m_rscene: IRendererScene = null;
    
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
        if (RuntimeMaterialContext.ShaderLib != null) {
            RuntimeMaterialContext.ShaderLib.setListener(listener);
        }
    }
    
    createShaderLibConfig(): IShaderLibConfigure {
        return { shaderCodeConfigures: [], version: "" };
    }
    initialize(rscene: IRendererScene, param: MaterialContextParam = null, shaderLibConfigure: IShaderLibConfigure = null): void {

        if (this.m_initFlag) {

            this.m_initFlag = false;
            this.m_rscene = rscene;
            
            // let selfT: any = this;
            if (param == null) {
                param = new MaterialContextParam();
            }
            this.m_param = param;
            if (param.shaderLibVersion != "") shaderLibConfigure.version = param.shaderLibVersion;

            RuntimeMaterialContext.ShaderLib.initialize(shaderLibConfigure, param.shaderCodeBinary);
            if (param.loadAllShaderCode) {
                RuntimeMaterialContext.ShaderLib.addAllShaderCodeObject();
            }

            param.pointLightsTotal = MathConst.Clamp(param.pointLightsTotal, 0, 256);
            param.directionLightsTotal = MathConst.Clamp(param.directionLightsTotal, 0, 256);
            param.spotLightsTotal = MathConst.Clamp(param.spotLightsTotal, 0, 256);

            let shdCtx = this.m_rscene.getRenderProxy().uniformContext;
            
            this.initEnd(param);

            if (!param.loadAllShaderCode) {
                let listener = RuntimeMaterialContext.ShaderLib.getListener();
                if (listener != null) {
                    listener.shaderLibLoadComplete(0, 0);
                }
            }
        }
    }
    protected initEnd(param: MaterialContextParam): void {
        
    }

    addShaderCodeObject(uuid: ShaderCodeUUID, shaderCodeObject: ShaderCodeObject): void {
        RuntimeMaterialContext.ShaderLib.addShaderCodeObject(uuid, shaderCodeObject);
    }
    addPipeline(pipeline: IMaterialPipeline): void {
        if (pipeline != null && pipeline != this.pipeline) {
            
        }
    }
    createPipeline(): IMaterialPipeline {
        let pipeline: IMaterialPipeline = null;
        return pipeline;
    }
    run(): void {
        // if (this.vsmModule != null && this.m_param.vsmEnabled) {
        //     this.vsmModule.run();
        // }
    }
    destroy(): void {
        this.m_rscene = null;
    }
}
export { ShaderCodeUUID, IShaderLibConfigure, IShaderLibListener, ShaderCodeConfigure, ShaderCodeType, MaterialContextParam, RuntimeMaterialContext };