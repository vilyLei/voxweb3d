import IRendererScene from "../../vox/scene/IRendererScene";
import { IMaterialPipeline } from "../../vox/material/pipeline/IMaterialPipeline";
import MathConst from "../../vox/math/MathConst";
import { ShaderCodeUUID } from "../../vox/material/ShaderCodeUUID";
import { ShaderCodeConfigure, ShaderCodeType, IShaderLibConfigure, IShaderLibListener, ShaderLib } from "../shader/ShaderLib";
import { ShaderCodeObject } from "../shader/ShaderCodeObject";

class RuntimeMaterialContextParam {

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
class RuntimeMaterialContext {

    private m_initFlag: boolean = true;
    private m_param: RuntimeMaterialContextParam;
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
    initialize(rscene: IRendererScene, param: RuntimeMaterialContextParam = null, shaderLibConfigure: IShaderLibConfigure = null): void {

        if (this.m_initFlag) {

            this.m_initFlag = false;
            this.m_rscene = rscene;
            
            // let selfT: any = this;
            if (param == null) {
                param = new RuntimeMaterialContextParam();
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
    protected initEnd(param: RuntimeMaterialContextParam): void {
        
    }

    addShaderCodeObject(uuid: ShaderCodeUUID, shaderCodeObject: ShaderCodeObject): void {
        RuntimeMaterialContext.ShaderLib.addShaderCodeObject(uuid, shaderCodeObject);
    }
    addPipeline(pipeline: IMaterialPipeline): void {
        if (pipeline != null && pipeline != this.pipeline) {
            
        }
    }
    createPipeline(): IMaterialPipeline {
        let pipeline: IMaterialPipeline = null;//new MaterialPipeline(RuntimeMaterialContext.ShaderLib);
        // pipeline.addPipe(this.lightModule);
        // pipeline.addPipe(this.envData);
        // if (this.vsmModule != null) {
        //     // pipeline.addPipe(this.vsmModule.getVSMData());
        //     pipeline.addPipe(this.vsmModule);
        // }
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
export { ShaderCodeUUID, IShaderLibConfigure, IShaderLibListener, ShaderCodeConfigure, ShaderCodeType, RuntimeMaterialContextParam, RuntimeMaterialContext };