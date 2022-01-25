import IRendererScene from "../../../vox/scene/IRendererScene";
import { IEnvLightModule } from "../../../light/base/IEnvLightModule";
import { IMaterialPipeline } from "../../../vox/material/pipeline/IMaterialPipeline";
import RendererParam from "../../../vox/scene/RendererParam";
import { IAppEngine } from "../../modules/interfaces/IAppEngine";
import { IAppBase } from "../../modules/interfaces/IAppBase";
import { IAppEnvLightModule } from "../../modules/interfaces/IAppEnvLightModule";
import Vector3D from "../../../vox/math/Vector3D";
import { ILightModule } from "../../../light/base/ILightModule";
import { MaterialContextParam } from "../../../materialLab/base/MaterialContextParam";
import { IAppLightModule } from "../../modules/interfaces/IAppLightModule";
import { IShaderLibListener } from "../../../materialLab/shader/IShaderLibListener";
import { IMaterialContext } from "../../../materialLab/base/IMaterialContext";
import ModuleFlag from "../base/ModuleFlag";
import ViewerScene from "./ViewerScene";

declare var AppEngine: any;
declare var AppBase: any;
declare var AppEnvLightModule: any;
declare var AppLightModule: any;

function main(appIns: any): void {
    appIns.initialize();
    function mainLoop(now: any) {
        appIns.run();
        window.requestAnimationFrame(mainLoop);
    }
    window.requestAnimationFrame(mainLoop);
}

class LightViewer implements IShaderLibListener {

    private m_voxAppEngine: IAppEngine = null;
    private m_voxAppBase: IAppBase = null;
    private m_rscene: IRendererScene;
    private m_materialCtx: IMaterialContext;

    private m_MF: ModuleFlag = new ModuleFlag();
    private m_scene: ViewerScene = new ViewerScene();
    
    constructor() { }

    setLoadedModuleFlag(flag: number): void {

        this.m_MF.addFlag( flag );
        console.log("setLoadedModuleFlag(), flag: ", flag);
        if (this.m_MF.hasAllSysModules()) {
            console.log("loaded all modules.");
            this.initLightScene();
        }
        else if (this.m_MF.hasEngineModule()) {
            console.log("loaded all engine modules.");
            this.initEngine();
        }
    }
    private initEngine(): void {

        if (this.m_voxAppEngine == null) {

            let voxAppEngine = new AppEngine.Instance() as IAppEngine;
            let voxAppBase = new AppBase.Instance() as IAppBase;

            let rDevice = AppEngine.RendererDevice;
            this.m_voxAppEngine = voxAppEngine;
            this.m_voxAppBase = voxAppBase;

            let rparam = new RendererParam();
            // rparam.maxWebGLVersion = 1;
            rparam.setPolygonOffsetEanbled(false);
            rparam.setAttriAlpha(false);
            // rparam.setAttriAntialias(!rDevice.IsMobileWeb());
            rparam.setAttriAntialias(true);
            rparam.setCamProject(45.0, 30.0, 9000.0);
            rparam.setCamPosition(1000.0, 1000.0, 1000.0);

            voxAppEngine.initialize(false, rparam);

            // rDevice.SHADERCODE_TRACE_ENABLED = true;
            // rDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
            rDevice.SetWebBodyColor("black");

            this.m_rscene = voxAppEngine.getRendererScene() as IRendererScene;
            voxAppBase.initialize(this.m_rscene);

            main( voxAppEngine );

            this.m_scene.initialize( voxAppBase, this.m_rscene );
            this.m_scene.initDefaultEntities();
        }
    }
    private initLightScene(): void {
        if (this.m_voxAppEngine == null) {
            this.initEngine();
        }
        if (this.m_materialCtx == null) {

            let mcParam = new MaterialContextParam();
            mcParam.shaderLibVersion = "v101";
            mcParam.pointLightsTotal = 3;
            mcParam.directionLightsTotal = 0;
            mcParam.spotLightsTotal = 0;
            mcParam.loadAllShaderCode = true;
            mcParam.shaderCodeBinary = true;
            mcParam.pbrMaterialEnabled = false;
            mcParam.shaderFileRename = true;
            mcParam.vsmFboIndex = 0;
            // mcParam.vsmEnabled = false;
            // mcParam.buildBinaryFile = true;

            this.m_materialCtx = this.m_voxAppBase.createMaterialContext();
            this.m_materialCtx.addShaderLibListener(this);

            this.initEnvLight();
            this.buildLightModule(mcParam);

            this.m_materialCtx.initialize(this.m_rscene, mcParam);
            
        }
    }

    shaderLibLoadComplete(loadingTotal: number, loadedTotal: number): void {

        let envLightModule = this.m_materialCtx.envLightModule;
        envLightModule.setAmbientColorRGB3f(3.0, 3.0, 3.0);
        envLightModule.setEnvAmbientLightAreaOffset(-500.0, -500.0);
        envLightModule.setEnvAmbientLightAreaSize(1000.0, 1000.0);
        envLightModule.setEnvAmbientMap(this.m_materialCtx.getTextureByUrl("static/assets/brn_03.jpg"));
        console.log("shaderLibLoadComplete(), loadingTotal, loadedTotal: ", loadingTotal, loadedTotal);

        // this.initScene();
        this.m_scene.setMaterialContext( this.m_materialCtx );
        this.m_scene.initCommonScene();
    }
    private initEnvLight(): void {
        
        if (this.m_MF.hasEnvLightModule()) {
            let envLightModuleModule = new AppEnvLightModule.Instance() as IAppEnvLightModule;
            
            let envLightPipe = envLightModuleModule.createEnvLightModule(this.m_rscene) as IEnvLightModule;
            envLightPipe.initialize();
            envLightPipe.setFogColorRGB3f(0.0, 0.8, 0.1);

            this.m_materialCtx.envLightModule = envLightPipe;
        }
    }

    private m_pos01: Vector3D = new Vector3D(-150.0, 100.0, -170.0);
    private m_pos02: Vector3D = new Vector3D(150, 0.0, 150);

    protected buildLightModule(param: MaterialContextParam): ILightModule {

        if (this.m_MF.hasLightModule()) {
            let lightModuleFactor = new AppLightModule.Instance() as IAppLightModule;
            let lightModule = lightModuleFactor.createLightModule(this.m_rscene);
            
            for (let i: number = 0; i < param.pointLightsTotal; ++i) {
                lightModule.appendPointLight();
            }
            for (let i: number = 0; i < param.directionLightsTotal; ++i) {
                lightModule.appendDirectionLight();
            }
            for (let i: number = 0; i < param.spotLightsTotal; ++i) {
                lightModule.appendSpotLight();
            }
            this.initLightModuleData(lightModule);

            this.m_materialCtx.lightModule = lightModule;
            return lightModule;
        }
        return null;
    }
    private initLightModuleData(lightModule: ILightModule): void {

        // this.m_materialCtx.initialize(this.m_rscene, mcParam);
        let pointLight = lightModule.getPointLightAt(0);
        pointLight.position.setXYZ(0.0, 150.0, -50.0);
        pointLight.color.setRGB3f(1.0, 1.0, 1.0);
        pointLight.attenuationFactor1 = 0.00001;
        pointLight.attenuationFactor2 = 0.000001;

        pointLight = lightModule.getPointLightAt(1);
        pointLight.position.copyFrom(this.m_pos01);
        pointLight.color.setRGB3f(1.0, 0.0, 0.0);
        pointLight.attenuationFactor1 = 0.00001;
        pointLight.attenuationFactor2 = 0.000001;

        pointLight = lightModule.getPointLightAt(2);
        pointLight.position.copyFrom(this.m_pos02);
        pointLight.color.setRGB3f(0.0, 1.0, 1.0);
        pointLight.attenuationFactor1 = 0.00001;
        pointLight.attenuationFactor2 = 0.000001;

        lightModule.update();
    }
}
export default LightViewer;