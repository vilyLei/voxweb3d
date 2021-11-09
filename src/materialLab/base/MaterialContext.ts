import RendererScene from "../../vox/scene/RendererScene";
import Vector3D from "../../vox/math/Vector3D";

import {MaterialPipeline} from "../../vox/material/pipeline/MaterialPipeline";
import GlobalLightData from "../../light/base/GlobalLightData";
import Color4 from "../../vox/material/Color4";
import EnvLightData from "../../light/base/EnvLightData";
import ShadowVSMModule from "../../shadow/vsm/base/ShadowVSMModule";
/**
 * 实现 material 构造 pipeline 的上下文
 */
class MaterialContext {

    private m_rscene: RendererScene = null;
    private m_initFlag: boolean = true;
    /**
     * 全局的灯光数据
     */
    readonly lightData: GlobalLightData = new GlobalLightData();
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
    constructor() { }

    initialize(rscene: RendererScene, pointLightsTotal: number = 2, directionLightsTotal: number = 2, vsmFboIndex: number = 0): void {
        if (this.m_initFlag) {

            this.m_rscene = rscene;

            let selfT: any = this;
            let areaSize: number = 800.0;
            let color: Color4 = new Color4(1.0,1.0,0.0);
            
            this.lightData.initialize(pointLightsTotal, directionLightsTotal);
            color.normalizeRandom(1.1);
            this.lightData.setPointLightAt(0, new Vector3D(Math.random() * areaSize - 0.5 * areaSize, 50 + Math.random() * 100,Math.random() * 600 - 300), color);
            color.normalizeRandom(1.1);
            this.lightData.setPointLightAt(1, new Vector3D((Math.random() * areaSize - 0.5 * areaSize, 50 + Math.random() * 100,Math.random() * 600 - 300)), color);
            color.normalizeRandom(1.9);
            this.lightData.setDirecLightAt(0, new Vector3D(1.0,1.0,1.0), color);
            color.normalizeRandom(1.9);
            this.lightData.setDirecLightAt(1, new Vector3D(-1.0,1.0,-1.0), color);
            this.lightData.buildData();

            selfT.envData = new EnvLightData();
            this.envData.initialize();
            this.envData.setFogColorRGB3f(0.0, 0.8, 0.1);

            selfT.vsmModule = new ShadowVSMModule( vsmFboIndex );
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

            selfT.pipeline = new MaterialPipeline();
            this.pipeline.addPipe( this.lightData );
            this.pipeline.addPipe( this.envData );
            this.pipeline.addPipe( this.vsmModule.getVSMData() );
        }
    }
    run(): void {
        this.vsmModule.run();
    }
    destroy(): void {
        this.m_rscene = null;
    }
}
export {MaterialContext};