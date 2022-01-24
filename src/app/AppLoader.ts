import IRenderMaterial from "../vox/render/IRenderMaterial";
import IRendererScene from "../vox/scene/IRendererScene";
import { IShadowVSMModule } from "../shadow/vsm/base/IShadowVSMModule";
import { MaterialPipeType } from "../vox/material/pipeline/MaterialPipeType";
import { IEnvLightModule } from "../light/base/IEnvLightModule";
import { IMaterialPipeline } from "../vox/material/pipeline/IMaterialPipeline";
import RendererParam from "../vox/scene/RendererParam";
import { IAppEngine } from "./modules/interfaces/IAppEngine";
import { IAppBase } from "./modules/interfaces/IAppBase";
import { IAppEnvLightModule } from "./modules/interfaces/IAppEnvLightModule";
import Vector3D from "../vox/math/Vector3D";
import { ILightModule } from "../light/base/ILightModule";
import { MaterialContextParam } from "../materialLab/base/MaterialContextParam";
import { IAppLightModule } from "./modules/interfaces/IAppLightModule";
import { IShaderLibListener } from "../materialLab/shader/IShaderLibListener";
import { IMaterialContext } from "../materialLab/base/IMaterialContext";

declare var AppEngine: any;
declare var AppBase: any;
declare var AppEnvLightModule: any;
declare var AppLightModule: any;

var Module: any = window;
function getSysModule(ns: string): any {
    return Module[ns];
}
function main(appIns: any): void {
    appIns.initialize();
    function mainLoop(now: any) {
        appIns.run();
        window.requestAnimationFrame(mainLoop);
    }
    window.requestAnimationFrame(mainLoop);
}

class AppShell implements IShaderLibListener {

    private m_loadedTotal: number = 0;
    private m_loadedFlags: number[] = [0, 0, 0, 0, 0, 0];
    private m_voxAppEngineIns: any = null;
    private m_voxAppBaseIns: any = null;
    private m_rscene: IRendererScene;
    private m_pipeline: IMaterialPipeline;
    private m_shadow: IShadowVSMModule;
    private m_materialCtx: IMaterialContext;
    constructor() { }

    loadedWithIndex(index: number): void {
        this.m_loadedTotal++;
        let flags = this.m_loadedFlags;
        flags[index] = 1;
        
        let flag: number = 0;
        for(let i = 0; i < 5; ++i) {
            flag += flags[i];
        }
        if (flags[0] > 0 && flag == 5) {
            console.log("loaded all engine sys module.");
            this.initialize();
        }
    }
    initialize(): void {
        if (this.m_voxAppEngineIns == null) {
            console.log("AppShell::initialize()..., AppEngine: ", AppEngine);
            console.log("AppShell::initialize()..., AppBase: ", AppBase);

            let rDevice = AppEngine.RendererDevice;
            let voxAppEngineIns = new AppEngine.Instance() as IAppEngine;
            let voxAppBaseIns = new AppBase.Instance() as IAppBase;
            this.m_voxAppEngineIns = voxAppEngineIns;
            this.m_voxAppBaseIns = voxAppBaseIns;

            let rparam = new RendererParam();
            // rparam.maxWebGLVersion = 1;
            rparam.setPolygonOffsetEanbled(false);
            rparam.setAttriAlpha(false);
            // rparam.setAttriAntialias(!rDevice.IsMobileWeb());
            rparam.setAttriAntialias(true);
            rparam.setCamProject(45.0, 30.0, 9000.0);
            rparam.setCamPosition(1000.0, 1000.0, 1000.0);

            voxAppEngineIns.initialize(false, rparam);

            rDevice.SHADERCODE_TRACE_ENABLED = true;
            rDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
            rDevice.SetWebBodyColor("black");

            console.log("AppShell::initialize()..., voxAppEngineIns: ", voxAppEngineIns);
            console.log("AppShell::initialize()..., voxAppBaseIns: ", voxAppBaseIns);
            this.m_rscene = voxAppEngineIns.getRendererScene() as IRendererScene;
            voxAppBaseIns.initialize(this.m_rscene);

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
            
            this.m_materialCtx = voxAppBaseIns.createMaterialContext();
            
            this.initEnvLight();
            this.buildLightModule( mcParam );

            this.m_materialCtx.initialize(this.m_rscene, mcParam);
            this.m_pipeline = this.m_materialCtx.pipeline;

            main(voxAppEngineIns);
            this.initScene();
        }
    }
    
    shaderLibLoadComplete(loadingTotal: number, loadedTotal: number): void {
        // this.m_materialCtx.envData.setAmbientColorRGB3f(3.0,3.0,3.0);
        // this.m_materialCtx.envData.setEnvAmbientLightAreaOffset(-500.0, -500.0);
        // this.m_materialCtx.envData.setEnvAmbientLightAreaSize(1000.0, 1000.0);
        // this.m_materialCtx.envData.setEnvAmbientMap( this.m_materialCtx.getTextureByUrl("static/assets/brn_03.jpg") );
        console.log("shaderLibLoadComplete(), loadingTotal, loadedTotal: ", loadingTotal, loadedTotal);
        // this.initScene();
    }
    private initEnvLight(): void {
        let flags = this.m_loadedFlags;
        if (flags[2] == 1) {
            let envLightModuleModule = new AppEnvLightModule.Instance() as IAppEnvLightModule;
            //  as IEnvLightModule;
            console.log("AppShell::initialize()..., have env light module: ", envLightModuleModule);
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

        let flags = this.m_loadedFlags;
        if (flags[3] == 1) {
            let lightModuleFactor = new AppLightModule.Instance() as IAppLightModule;
            let lightModule = lightModuleFactor.createLightModule( this.m_rscene );
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
    private initScene(): void {

        let rscene = this.m_rscene;
        let material = this.m_voxAppBaseIns.createDefaultMaterial() as IRenderMaterial;
        material.pipeTypes = [MaterialPipeType.FOG_EXP2];
        material.setMaterialPipeline(this.m_pipeline);
        material.setTextureList([this.m_voxAppEngineIns.getImageTexByUrl("static/assets/box.jpg")]);
        material.initializeByCodeBuf(true);

        let scale: number = 100.0;
        let entity = rscene.entityBlock.createEntity();
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

        this.initEnvBox();
    }
    private initEnvBox(): void {

        let renderingState = this.m_rscene.getRenderProxy().renderingState;
        let rscene = this.m_rscene;
        let material = this.m_voxAppBaseIns.createDefaultMaterial() as IRenderMaterial;
        material.pipeTypes = [MaterialPipeType.FOG_EXP2];
        material.setMaterialPipeline(this.m_pipeline);
        material.setTextureList([this.m_voxAppEngineIns.getImageTexByUrl("static/assets/box.jpg")]);
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
export class AppLoader {

    private m_appShell: AppShell = new AppShell();
    constructor() { }

    initialize(): void {
        console.log("AppLoader::initialize()......");
        let url: string = location.href + "";
        console.log("A url: ", url);
        url = this.parseUrl(url);
        console.log("B url: ", url);
        this.initUI();

        // this.load( url );

        let host = "http://192.168.0.105:9000/";
        // host = "http://localhost:9000/";
        host = "";
        let engine_url = host + "publish/build/AppEngine.package.js";
        let base_url = host + "publish/build/AppBase.package.js";
        let envLightModule_url = host + "publish/build/AppEnvLightModule.package.js";
        let LightModule_url = host + "publish/build/AppLightModule.package.js";
        let shadow_url = host + "publish/build/AppShadow.package.js";

        let engineLoader = new ModuleLoader(0, engine_url, this);
        let baseLoader = new ModuleLoader(1, base_url, this);
        let envLightLoader = new ModuleLoader(2, envLightModule_url, this);
        let LightLoader = new ModuleLoader(3, LightModule_url, this);
        let shadowLoader = new ModuleLoader(4, shadow_url, this);
    }
    private initApp(): void {

        let shell = new AppShell();
        shell.initialize();
    }
    private showLoadInfo(e: any, index: number = 0): void {
        if (index == 0) {
            this.showLoadProgressInfo(e);
        }
    }
    private parseUrl(url: string): string {

        console.log("url: ", url);
        //http://192.168.0.102:9000/renderCase?sample=demoLoader&demo=cameraFollow2
        let params: string[] = url.split("?");
        if (params.length < 2 || params[0].indexOf("renderCase") < 1) {
            return "";
        }
        let moduleName: string = params[1];
        params = moduleName.split("&");
        if (params.length < 2 || params[0].indexOf("sample") < 0) {
            return "";
        }
        moduleName = params[1];
        params = moduleName.split("=");
        if (params.length < 2 || params[0] != "demo") {
            return "";
        }
        return "static/voxweb3d/demos/" + params[1] + ".js";
        /*
        let params: string[] = url.split("?");
        if(params.length < 2 || params[0].indexOf("renderCase") < 1) {
            return "";
        }
        //renderCase?sample=cameraFollow2
        let moduleName: string = params[1];
        params = moduleName.split("=");
        if(params.length < 2 || params[0] != "sample") {
            return "";
        }
        return "static/voxweb3d/demos/"+params[1]+".js";
        //*/
    }

    private m_bodyDiv: HTMLDivElement = null;
    private m_infoDiv: HTMLDivElement = null;
    private initUI(): void {
        document.body.style.background = "#000000";
        this.m_bodyDiv = document.createElement('div');
        this.m_bodyDiv.style.width = "100vw";
        this.m_bodyDiv.style.height = "100vh";
        this.elementCenter(this.m_bodyDiv);
        document.body.appendChild(this.m_bodyDiv);
        document.body.style.margin = '0';

        this.showInfo("init...");
    }

    private showInfo(str: string): void {

        if (this.m_infoDiv == null) {
            this.m_infoDiv = document.createElement('div');
            this.m_infoDiv.style.backgroundColor = "rgba(255,255,255,0.1)";
            this.m_infoDiv.style.color = "#00ee00";
            this.elementCenter(this.m_infoDiv);
            this.m_bodyDiv.appendChild(this.m_infoDiv);
        }
        this.m_infoDiv.innerHTML = str;
    }
    showLoadProgressInfo(e: any): void {
        let str: string = "loading " + Math.round(100.0 * e.loaded / e.total) + "% ";
        this.showInfo(str);
    }

    showLoadStart(): void {
        this.showInfo("loading 0%");
    }
    showLoaded(): void {
        this.showInfo("100%");
    }
    loadFinish(index: number = 0): void {
        if (index == 0) {
            if (this.m_bodyDiv != null) {
                this.m_bodyDiv.parentElement.removeChild(this.m_bodyDiv);
                this.m_bodyDiv = null;
            }
        }
        console.log("loadFinish(), index: ", index);
        this.m_appShell.loadedWithIndex(index);
    }
    private elementCenter(ele: HTMLElement, top: string = "50%", left: string = "50%", position: string = "absolute"): void {

        ele.style.textAlign = "center";
        ele.style.display = "flex";
        ele.style.flexDirection = "column";
        ele.style.justifyContent = "center";
        ele.style.alignItems = "center";
        // ele.style.top = top;
        // ele.style.left = left;
        // ele.style.position = position;
        // ele.style.transform = "translate(-50%, -50%)";
    }
}
class ModuleLoader {

    index: number = 0;
    constructor(index: number, purl: string, listener: any) {
        this.index = index;
        this.load(purl, listener);
    }
    load(purl: string, listener: any): void {
        let codeLoader: XMLHttpRequest = new XMLHttpRequest();
        codeLoader.open("GET", purl, true);
        //xhr.responseType = "arraybuffer";
        codeLoader.onerror = function (err) {
            console.error("load error: ", err);
        }

        codeLoader.onprogress = (e) => {
            if (listener != null) listener.showLoadInfo(e, this.index);
        };
        codeLoader.onload = () => {
            let scriptEle: HTMLScriptElement = document.createElement("script");
            scriptEle.onerror = (e) => {
                console.error("module script onerror, e: ", e);
            }
            scriptEle.innerHTML = codeLoader.response;
            document.head.appendChild(scriptEle);
            if (listener != null) listener.loadFinish(this.index);
            //this.initApp();
        }
        codeLoader.send(null);
    }
}
export default AppLoader;