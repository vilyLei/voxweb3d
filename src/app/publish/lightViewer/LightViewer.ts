import IRenderMaterial from "../../../vox/render/IRenderMaterial";
import IRendererScene from "../../../vox/scene/IRendererScene";
import { IShadowVSMModule } from "../../../shadow/vsm/base/IShadowVSMModule";
import { MaterialPipeType } from "../../../vox/material/pipeline/MaterialPipeType";
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
import { IMaterial } from "../../../vox/material/IMaterial";
import Color4 from "../../../vox/material/Color4";
import ModuleFlag from "../base/ModuleFlag";

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

    private m_voxAppEngineIns: IAppEngine = null;
    private m_voxAppBase: IAppBase = null;
    private m_rscene: IRendererScene;
    private m_pipeline: IMaterialPipeline;
    private m_materialCtx: IMaterialContext;

    private m_moduleFlag: number = 0x0;
    private ENGINE_LOADED: number = ModuleFlag.AppEngine | ModuleFlag.AppBase;
    private SYS_MODULE_LOADED: number = 3 | (7 << 2);
    constructor() { }

    hasEngineModule(): boolean {
        return (this.ENGINE_LOADED & this.m_moduleFlag) == this.ENGINE_LOADED;
    }
    hasAllSysModules(): boolean {
        console.log("this.SYS_MODULE_LOADED, this.m_moduleFlag: ", this.SYS_MODULE_LOADED, this.m_moduleFlag);
        return (this.SYS_MODULE_LOADED & this.m_moduleFlag) == this.SYS_MODULE_LOADED;
    }
    hasEnvLightModule(): boolean {
        return (ModuleFlag.AppEnvLight & this.m_moduleFlag) == ModuleFlag.AppEnvLight;
    }
    hasLightModule(): boolean {
        return (ModuleFlag.AppLight & this.m_moduleFlag) == ModuleFlag.AppLight;
    }
    setLoadedModuleFlag(flag: number): void {

        this.m_moduleFlag |= flag;

        if (this.m_moduleFlag > 0) {

            if (this.hasAllSysModules()) {
                console.log("loaded all modules.");
                this.initLightScene();
            }
            else if (this.hasEngineModule()) {
                console.log("loaded all engine modules.");
                this.initEngine();
            }
        }
    }
    private initEngine(): void {

        if (this.m_voxAppEngineIns == null) {

            let voxAppEngine = new AppEngine.Instance() as IAppEngine;
            let voxAppBase = new AppBase.Instance() as IAppBase;

            let rDevice = AppEngine.RendererDevice;
            this.m_voxAppEngineIns = voxAppEngine;
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

            rDevice.SHADERCODE_TRACE_ENABLED = true;
            rDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
            rDevice.SetWebBodyColor("black");

            this.m_rscene = voxAppEngine.getRendererScene() as IRendererScene;
            voxAppBase.initialize(this.m_rscene);

            main( voxAppEngine );
        }
    }
    private initLightScene(): void {
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
            this.m_pipeline = this.m_materialCtx.pipeline;
        }
    }

    shaderLibLoadComplete(loadingTotal: number, loadedTotal: number): void {
        let envLightModule = this.m_materialCtx.envLightModule;
        envLightModule.setAmbientColorRGB3f(3.0, 3.0, 3.0);
        envLightModule.setEnvAmbientLightAreaOffset(-500.0, -500.0);
        envLightModule.setEnvAmbientLightAreaSize(1000.0, 1000.0);
        envLightModule.setEnvAmbientMap(this.m_materialCtx.getTextureByUrl("static/assets/brn_03.jpg"));
        console.log("shaderLibLoadComplete(), loadingTotal, loadedTotal: ", loadingTotal, loadedTotal);

        this.initScene();
    }
    private initEnvLight(): void {
        
        if (this.hasEnvLightModule()) {
            let envLightModuleModule = new AppEnvLightModule.Instance() as IAppEnvLightModule;
            
            console.log("LightViewer::initialize()..., have env light module: ", envLightModuleModule);
            let envLightPipe = envLightModuleModule.createEnvLightModule(this.m_rscene) as IEnvLightModule;
            envLightPipe.initialize();
            envLightPipe.setFogColorRGB3f(0.0, 0.8, 0.1);

            this.m_materialCtx.envLightModule = envLightPipe;
            // this.m_pipeline = this.m_rscene.materialBlock.createMaterialPipeline(null);
            // this.m_pipeline.addPipe(envLightPipe);
        }
    }

    private m_pos01: Vector3D = new Vector3D(-150.0, 100.0, -170.0);
    private m_pos02: Vector3D = new Vector3D(150, 0.0, 150);

    protected buildLightModule(param: MaterialContextParam): ILightModule {

        if (this.hasLightModule()) {
            let lightModuleFactor = new AppLightModule.Instance() as IAppLightModule;
            let lightModule = lightModuleFactor.createLightModule(this.m_rscene);
            console.log("LightViewer::initialize()..., have light module: ", lightModule);
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

    private useLMMaps(docorator: any, ns: string, normalMapEnabled: boolean = true, displacementMap: boolean = true, shadowReceiveEnabled: boolean = false, aoMapEnabled: boolean = false): void {

        docorator.diffuseMap = this.m_materialCtx.getTextureByUrl("static/assets/disp/" + ns + "_COLOR.png");
        docorator.specularMap = this.m_materialCtx.getTextureByUrl("static/assets/disp/" + ns + "_SPEC.png");
        if (normalMapEnabled) {
            docorator.normalMap = this.m_materialCtx.getTextureByUrl("static/assets/disp/" + ns + "_NRM.png");
        }
        if (aoMapEnabled) {
            docorator.aoMap = this.m_materialCtx.getTextureByUrl("static/assets/disp/" + ns + "_OCC.png");
        }
        if (displacementMap) {
            if (docorator.vertUniform != null) {
                (docorator.vertUniform as any).displacementMap = this.m_materialCtx.getTextureByUrl("static/assets/disp/" + ns + "_DISP.png");
            }
        }
        docorator.shadowReceiveEnabled = shadowReceiveEnabled;
    }
    private createLM(): IMaterial {

        let m = this.m_voxAppBase.createLambertMaterial();
        let decor: any = m.getDecorator();
        let vertUniform: any = decor.vertUniform;
        // let m = this.m_rscene.materialBlock.createMaterial(decor);
        m.setMaterialPipeline(this.m_materialCtx.pipeline);
        decor.envAmbientLightEnabled = true;

        vertUniform.uvTransformEnabled = true;
        this.useLMMaps(decor, "box", true, false, true);
        decor.fogEnabled = true;
        decor.lightEnabled = true;
        decor.initialize();
        vertUniform.setDisplacementParams(3.0, 0.0);
        // material.setDisplacementParams(3.0, 0.0);
        decor.setSpecularIntensity(64.0);

        let color = new Color4();
        color.normalizeRandom(1.1);
        decor.setSpecularColor(color);
        return m;
    }
    private initScene(): void {

        let rscene = this.m_rscene;
        // let material = this.m_voxAppBaseIns.createDefaultMaterial() as IRenderMaterial;
        // material.pipeTypes = [MaterialPipeType.FOG_EXP2];
        // material.setMaterialPipeline(this.m_pipeline);
        // // material.setTextureList([this.m_voxAppEngineIns.getImageTexByUrl("static/assets/box.jpg")]);
        // material.setTextureList([this.m_materialCtx.getTextureByUrl("static/assets/box.jpg")]);
        // material.initializeByCodeBuf(true);

        let material = this.createLM();

        let scale: number = 500.0;
        let boxEntity = rscene.entityBlock.createEntity();
        boxEntity.setMaterial(material);
        boxEntity.copyMeshFrom(rscene.entityBlock.unitBox);
        boxEntity.setScaleXYZ(scale, scale * 0.05, scale);
        rscene.addEntity(boxEntity);

        // let axis = new VoxApp.Axis3DEntity();
        // axis.initialize(30);
        // axis.setXYZ(300, 0.0, 0.0);
        // appIns.addEntity(axis);

        // let box = new VoxApp.Box3DEntity();
        // box.initializeCube(100.0, [appIns.getImageTexByUrl("./assets/default.jpg")]);
        // appIns.addEntity(box);

        this.initEnvBox();
    }
    private initEnvBox(): void {

        let renderingState = this.m_rscene.getRenderProxy().renderingState;
        let rscene = this.m_rscene;
        let material = this.m_voxAppBase.createDefaultMaterial() as IRenderMaterial;
        material.pipeTypes = [MaterialPipeType.FOG_EXP2];
        material.setMaterialPipeline(this.m_pipeline);
        material.setTextureList([this.m_materialCtx.getTextureByUrl("static/assets/box.jpg")]);
        material.initializeByCodeBuf(false);

        let scale: number = 3000.0;
        let entity = rscene.entityBlock.createEntity();
        entity.setRenderState(renderingState.FRONT_CULLFACE_NORMAL_STATE);
        entity.setMaterial(material);
        entity.copyMeshFrom(rscene.entityBlock.unitBox);
        entity.setScaleXYZ(scale, scale, scale);
        rscene.addEntity(entity);

        // let axis = new VoxApp.Axis3DEntity();
        // axis.initialize(30);
        // axis.setXYZ(300, 0.0, 0.0);
        // appIns.addEntity(axis);

        // let box = new VoxApp.Box3DEntity();
        // box.initializeCube(100.0, [appIns.getImageTexByUrl("./assets/default.jpg")]);
        // appIns.addEntity(box);
    }
}
export default LightViewer;