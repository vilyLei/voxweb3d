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
import { IAppObjData } from "../../modules/interfaces/IAppObjData";
import IObjGeomDataParser from "../../../vox/mesh/obj/IObjGeomDataParser";
import IDataMesh from "../../../vox/mesh/IDataMesh";import DivLog from "../../../vox/utils/DivLog";
import { IShadowVSMModule } from "../../../shadow/vsm/base/IShadowVSMModule";
import { IAppShadow } from "../../modules/interfaces/IAppShadow";
;

declare var AppEngine: any;
declare var AppBase: any;
declare var AppEnvLightModule: any;
declare var AppLightModule: any;
declare var AppObjData: any;
declare var AppShadow: any;

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
    private m_voxAppObjData: IAppObjData = null;
    private m_voxAppShadow: IAppShadow = null;
    private m_rscene: IRendererScene;
    private m_materialCtx: IMaterialContext;

    private m_mf: ModuleFlag = new ModuleFlag();
    private m_scene: ViewerScene = new ViewerScene();

    pbrMaterialEnabled: boolean = false;
    lambertMaterialEnabled: boolean = true;
    constructor() { }

    setLoadedModuleFlag(flag: number): void {

        this.m_mf.addFlag(flag);
        console.log("setLoadedModuleFlag(), flag: ", flag);
        if (this.m_mf.hasAllSysModules()) {
            console.log("loaded all modules.");
            this.initLightScene();
        }
        else if (this.m_mf.hasEngineModule()) {
            console.log("loaded all engine modules.");
            this.initEngine();
        }
        if (this.m_mf.hasObjDataModule()) {
            this.initObjData();
        }
        this.m_scene.addMaterial( flag );
    }

    private m_geomDataParser: IObjGeomDataParser = null;
    private m_mesh: IDataMesh = null;
    private buildMeshData(): void {

        if (this.m_mesh == null && this.m_rscene != null && this.m_geomDataParser != null) {

            let parser = this.m_geomDataParser;
            //console.log("parse obj geom parser: ",parser);
            let mesh = this.m_rscene.entityBlock.createMesh();
            mesh.setVS(parser.getVS());
            mesh.setUVS(parser.getUVS());
            mesh.setNVS(parser.getNVS());
            mesh.setIVS(parser.getIVS());
            this.m_mesh = mesh;
            this.m_scene.addDataMesh(mesh);

            this.m_scene.initCommonScene(1);
        }
    }
    private m_objDataUrl: string;
    setObjDataUrl(url: string): void {
        this.m_objDataUrl = url;
    }
    private initObjData(): void {
        if (this.m_voxAppObjData == null) {
            console.log("start load data");
            //let objUrl = "static/assets/obj/apple_01.obj";
            let objData = new AppObjData.Instance() as IAppObjData;
            objData.load(this.m_objDataUrl, (parser: IObjGeomDataParser): void => {
                this.m_geomDataParser = parser;
                this.buildMeshData();
                // if(this.pbrMaterialEnabled) {
                //     this.m_scene.addMaterial(ModuleFlag.AppPBR);
                // }
                this.m_scene.preloadData();
            })
            this.m_voxAppObjData = objData;
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

            voxAppEngine.setSyncLookEnabled(true);
            main(voxAppEngine);
            // DivLog.ShowLog("init engine..");
            this.m_scene.initialize(voxAppBase, this.m_rscene);
            this.buildMeshData();
            // this.m_scene.initDefaultEntities();
        }
    }
    private initLightScene(): void {
        if (this.m_voxAppEngine == null) {
            this.initEngine();
        }
        if (this.m_materialCtx == null) {

            let mcParam = new MaterialContextParam();
            mcParam.shaderLibVersion = "v101";
            mcParam.pointLightsTotal = 1;
            mcParam.directionLightsTotal = 2;
            mcParam.spotLightsTotal = 0;
            mcParam.loadAllShaderCode = true;
            mcParam.shaderCodeBinary = true;
            mcParam.pbrMaterialEnabled = this.pbrMaterialEnabled;
            mcParam.lambertMaterialEnabled = this.lambertMaterialEnabled;
            mcParam.shaderFileNickname = true;
            mcParam.vsmFboIndex = 0;
            //nickname
            mcParam.vsmEnabled = true;
            // mcParam.buildBinaryFile = true;

            this.m_materialCtx = this.m_voxAppBase.createMaterialContext();
            this.m_materialCtx.addShaderLibListener(this);

            // DivLog.ShowLog("init materialCtx..");
            this.initEnvLight();
            this.buildLightModule(mcParam);
            this.buildShadowModule(mcParam);

            this.m_materialCtx.initialize(this.m_rscene, mcParam);

            // this.m_scene.preLoadLMMaps(this.m_materialCtx, "box", true, false, true);
            this.m_scene.setMaterialContext(this.m_materialCtx);
            // this.m_scene.initEnvBox();
            this.m_voxAppEngine.setMaterialContext( this.m_materialCtx );


        }
    }

    shaderLibLoadComplete(loadingTotal: number, loadedTotal: number): void {

        if(this.lambertMaterialEnabled) {
            let envLightModule = this.m_materialCtx.envLightModule;
            envLightModule.setAmbientColorRGB3f(3.0, 3.0, 3.0);
            envLightModule.setEnvAmbientLightAreaOffset(-500.0, -500.0);
            envLightModule.setEnvAmbientLightAreaSize(1000.0, 1000.0);
            envLightModule.setEnvAmbientMap(this.m_materialCtx.getTextureByUrl("static/assets/brn_03.jpg"));
        }
        console.log("shaderLibLoadComplete(), loadingTotal, loadedTotal: ", loadingTotal, loadedTotal);

        // DivLog.ShowLog("init materialCtx loaded..");
        this.m_scene.initCommonScene(2);
    }
    protected buildShadowModule(param: MaterialContextParam): void {

        if (this.m_mf.hasShadowModule()) {
            //IShadowVSMModule
            this.m_voxAppShadow = new AppShadow.Instance();
            let vsmModule = this.m_voxAppShadow.createVSMShadow(param.vsmFboIndex);
            vsmModule.setCameraPosition(new Vector3D(1, 800, 1));
            vsmModule.setCameraNear(10.0);
            vsmModule.setCameraFar(3000.0);
            vsmModule.setMapSize(512.0, 512.0);
            vsmModule.setCameraViewSize(4000, 4000);
            vsmModule.setShadowRadius(2);
            vsmModule.setShadowBias(-0.0005);
            vsmModule.initialize(this.m_rscene, [0], 3000);
            vsmModule.setShadowIntensity(0.8);
            vsmModule.setColorIntensity(0.3);
            this.m_materialCtx.vsmModule = vsmModule;
            console.log("buildShadowModule(), vsmModule: ",vsmModule);
        }
    }
    private initEnvLight(): void {

        if (this.m_mf.hasEnvLightModule()) {
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

        if (this.m_mf.hasLightModule()) {
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
        if (pointLight != null) {
            // pointLight.position.setXYZ(200.0, 180.0, 200.0);
            pointLight.position.setXYZ(0.0, 190.0, 0.0);
            pointLight.color.setRGB3f(0.0, 2.2, 0.0);
            pointLight.attenuationFactor1 = 0.00001;
            pointLight.attenuationFactor2 = 0.00005;
        }
        let spotLight = lightModule.getSpotLightAt(0);
        if (spotLight != null) {
            spotLight.position.setXYZ(0.0, 30.0, 0.0);
            spotLight.direction.setXYZ(0.0, -1.0, 0.0);
            spotLight.color.setRGB3f(0.0, 40.2, 0.0);
            spotLight.attenuationFactor1 = 0.000001;
            spotLight.attenuationFactor2 = 0.000001;
            spotLight.angleDegree = 30.0;
        }
        let directLight = lightModule.getDirectionLightAt(0);
        if (directLight != null) {
            directLight.color.setRGB3f(2.0, 0.0, 0.0);
            directLight.direction.setXYZ(-1.0, -1.0, 0.0);
            directLight = lightModule.getDirectionLightAt(1);
            if (directLight != null) {
                directLight.color.setRGB3f(0.0, 0.0, 2.0);
                directLight.direction.setXYZ(1.0, 1.0, 0.0);
            }
        }
        lightModule.update();
        /*
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
        //*/

    }
}
export default LightViewer;