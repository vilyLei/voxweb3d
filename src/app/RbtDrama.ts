import RendererDevice from "../vox/render/RendererDevice";
import RendererParam from "../vox/scene/RendererParam";
import Vector3D from "../vox/math/Vector3D";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";
import MouseEvent from "../vox/event/MouseEvent";
import RendererScene from "../vox/scene/RendererScene";
import { SceneModule } from "../app/robot/scene/SceneModule";

import { CommonMaterialContext } from "../materialLab/base/CommonMaterialContext";
import { IShaderLibListener, MaterialContextParam, DebugMaterialContext } from "../materialLab/base/DebugMaterialContext";
import { DirectionLight } from "../light/base/DirectionLight";
import EngineBase from "../app/engine/EngineBase";

export class RbtDrama implements IShaderLibListener {
    constructor() { }

    private m_rscene: RendererScene = null;
    private m_engine: EngineBase = null;
    private m_statusDisp = new RenderStatusDisplay();

    private m_scene = new SceneModule();

    //private m_materialCtx: CommonMaterialContext = new CommonMaterialContext();
    private m_materialCtx: DebugMaterialContext = new DebugMaterialContext();
    private updateShadow(): void {
        let vsmModule = this.m_materialCtx.vsmModule;
        if(vsmModule != null) {
            vsmModule.setRendererProcessIDList([3, 1]);
            vsmModule.setCameraPosition(new Vector3D(1, 1200, 1));
            vsmModule.setCameraNear( 100.0 );
            vsmModule.setCameraFar( 2000.0 );
            vsmModule.setMapSize(300.0, 300.0);
            vsmModule.setCameraViewSize(2600, 2600);
            vsmModule.setShadowRadius(1.0);
            vsmModule.setShadowBias(-0.001);
            vsmModule.setShadowIntensity(0.85);
            vsmModule.setColorIntensity(0.4);
            vsmModule.upate();
        }
    }
    shaderLibLoadComplete(loadingTotal: number, loadedTotal: number): void {

        this.updateShadow();
        let envLightModule = this.m_materialCtx.envLightModule;
        let brnScale: number = 5.0;
        envLightModule.setAmbientColorRGB3f(brnScale, brnScale, brnScale);
        envLightModule.setEnvAmbientLightAreaOffset(-1200.0, -1200.0);
        envLightModule.setEnvAmbientLightAreaSize(2400.0, 2400.0);
        envLightModule.setEnvAmbientMap(this.m_materialCtx.getTextureByUrl("static/assets/brn_03.jpg"));
        envLightModule.setFogDensity(0.00015);
        envLightModule.update();
        console.log("shaderLibLoadComplete(), loadingTotal, loadedTotal: ", loadingTotal, loadedTotal);
        this.initScene();
    }
    private initMaterialCtx(): void {

        let mcParam: MaterialContextParam = new MaterialContextParam();
        mcParam.pointLightsTotal = 0;
        mcParam.directionLightsTotal = 2;
        mcParam.spotLightsTotal = 0;
        mcParam.pbrMaterialEnabled = false;
        mcParam.vsmEnabled = true;
        mcParam.loadAllShaderCode = true;
        mcParam.shaderCodeBinary = true;
        this.m_materialCtx.addShaderLibListener(this);
        this.m_materialCtx.initialize(this.m_rscene, mcParam);

        // let pointLight: PointLight = this.m_materialCtx.lightModule.getPointLightAt(0);
        // pointLight.position.setXYZ(0.0, 150.0, -50.0);
        // pointLight.color.setRGB3f(1.0, 1.0, 1.0);
        // pointLight.attenuationFactor1 = 0.00001;
        // pointLight.attenuationFactor2 = 0.000001;

        let colorScale: number = 3.0;
        let lightModule = this.m_materialCtx.lightModule;
        let direcLight = lightModule.getDirectionLightAt(0);
        direcLight.color.setRGB3f(0.3 * colorScale, 1.0 * colorScale, 0.3 * colorScale);
        direcLight.direction.setXYZ(-0.5, -0.5, 0.5);
        direcLight = lightModule.getDirectionLightAt(1);
        direcLight.color.setRGB3f(1.0 * colorScale, 0.3 * colorScale, 0.3 * colorScale);
        direcLight.direction.setXYZ(0.5, -0.5, 0.5);
        this.m_materialCtx.lightModule.update();

        this.m_materialCtx.lightModule.update();
    }

    initialize(): void {
        console.log("RbtDrama::initialize()......");
        if (this.m_engine == null) {
            RendererDevice.SHADERCODE_TRACE_ENABLED = false;
            RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
            RendererDevice.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;

            let rparam: RendererParam = new RendererParam();
            // rparam.maxWebGLVersion = 1;
            rparam.setPolygonOffsetEanbled(false);
            rparam.setAttriAlpha(false);
            rparam.setAttriAntialias(!RendererDevice.IsMobileWeb());
            rparam.setCamProject(45.0, 30.0, 9000.0);
            rparam.setCamPosition(1800.0, 1800.0, 1800.0);

            this.m_engine = new EngineBase();
            this.m_engine.initialize(rparam, 7);
            this.m_engine.setProcessIdListAt(0, [0,1,2,4,5,6]);
            this.m_rscene = this.m_engine.rscene;

            this.m_statusDisp.initialize();

            this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);
            
            //this.initScene();
            this.initMaterialCtx();
            this.update();
        }
    }
    initScene(): void {

        this.m_scene.initialize(this.m_rscene, this.m_materialCtx);
    }

    private mouseDown(evt: any): void {
        this.m_engine.interaction.viewRay.intersectPlane();
        let pv: Vector3D = this.m_engine.interaction.viewRay.position;
    }

    private m_timeoutId: any = -1;
    private update(): void {
        if (this.m_timeoutId > -1) {
            clearTimeout(this.m_timeoutId);
        }
        this.m_timeoutId = setTimeout(this.update.bind(this), 50);// 20 fps
        this.m_scene.run();
        if(this.m_statusDisp != null) this.m_statusDisp.update(true);
    }
    run(): void {
        
        if(this.m_statusDisp != null) this.m_statusDisp.update(false);

        if (this.m_scene.shadowEnabled) {
            this.m_materialCtx.vsmModule.force = true;
            this.m_materialCtx.run();
        }
        this.m_engine.run();
        /*
        //this.m_rscene.run();
        this.m_rscene.runBegin();
        this.m_rscene.update();
        //this.m_rscene.run(false);
        this.m_rscene.runAt(0);
        this.m_rscene.runAt(1);
        this.m_rscene.runAt(2);
        this.m_rscene.runAt(4);

        this.m_rscene.runEnd();
        //*/
    }
}
export default RbtDrama;