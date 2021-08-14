
import Vector3D from "../../vox/math/Vector3D";
import TextureProxy from "../../vox/texture/TextureProxy";
import {TextureConst} from "../../vox/texture/TextureConst";
import ImageTextureLoader from "../../vox/texture/ImageTextureLoader";

import RendererScene from "../../vox/scene/RendererScene";
import DefaultPBRUI from "./DefaultPBRUI";
import Sphere3DEntity from "../../vox/entity/Sphere3DEntity";

import PBRMaterial from "../../pbr/material/PBRMaterial";
import PBRMaterialBuilder from "../../pbr/mana/PBRMaterialBuilder";
import MirrorProjEntity from "./MirrorProjEntity";
import PBRParamEntity from "./PBRParamEntity";
import PBRMirror from "./PBRMirror";
import CubeRttBuilder from "../../renderingtoy/mcase/CubeRTTBuilder";
import ShadowVSMModule from "../../shadow/vsm/base/ShadowVSMModule";
import GlobalLightData from "../../light/base/GlobalLightData";
import EnvLightData from "../../light/base/EnvLightData";
import DefaultPBRLight from "../../pbr/mana/DefaultPBRLight";
import PBREntityManager from "../../pbr/mana/PBREntityManager";
import Axis3DEntity from "../../vox/entity/Axis3DEntity";
import { SpecularTextureLoader } from "../mana/TextureLoader";
import DisplayEntity from "../../vox/entity/DisplayEntity";


export default class PBRScene
{
    private m_rscene:RendererScene = null;
    private m_texLoader:ImageTextureLoader = null;
    private m_uiModule: DefaultPBRUI;
    private m_envMap: TextureProxy = null;
    private m_mirrorEffector: PBRMirror = null;
    private m_paramEntities:PBRParamEntity[] = [];

    private m_materialBuilder: PBRMaterialBuilder;
    private m_cubeRTTBuilder: CubeRttBuilder;
    private m_vsmModule: ShadowVSMModule;

    private m_mirrorRprIndex: number = 3;
    private m_lightData: GlobalLightData = new GlobalLightData();
    private m_entityManager: PBREntityManager = null;
    private m_envData: EnvLightData;

    private m_reflectPlaneY: number = -220.0;

    m_fogEnabled: boolean = true;

    constructor() {

    }

    initialize(rscene:RendererScene, texLoader:ImageTextureLoader, uiModule: DefaultPBRUI):void
    {
        if(this.m_rscene == null)
        {
            
            this.m_rscene = rscene;
            this.m_texLoader = texLoader;
            this.m_uiModule = uiModule;
            
            let envMapUrl: string = "static/bytes/spe.mdf";
            let loader: SpecularTextureLoader = new SpecularTextureLoader();
            loader.loadTextureWithUrl(envMapUrl, this.m_rscene);
            this.m_envMap = loader.texture;

            let lightModule: DefaultPBRLight = new DefaultPBRLight();
            lightModule.create(4, 2);

            this.m_materialBuilder = new PBRMaterialBuilder();

            this.m_lightData.initialize(4, 2);
            this.m_lightData.buildData();

            this.m_materialBuilder.lightData = this.m_lightData;
            this.m_materialBuilder.texLoader = this.m_texLoader;

            // for test
            let posList: Vector3D[] = lightModule.getPointList();
            if (posList != null) {
                let tot: number = posList.length;
                tot = 0;
                for (let i: number = 0; i < tot; ++i) {
                    let crossAxis: Axis3DEntity = new Axis3DEntity();
                    crossAxis.initializeCross(30.0);
                    crossAxis.setPosition(posList[i]);
                    this.m_rscene.addEntity(crossAxis, 1);
                }
            }

            let cubeRTTMipMapEnabled: boolean = true;
            let rttPos: Vector3D = new Vector3D(0.0, 0.0, 0.0);
            // for indirect light
            this.m_cubeRTTBuilder = new CubeRttBuilder();
            this.m_cubeRTTBuilder.mipmapEnabled = cubeRTTMipMapEnabled;
            this.m_cubeRTTBuilder.initialize(this.m_rscene, 256.0, 256.0, rttPos);
            //this.m_cubeRTTBuilder.setClearRGBAColor4f(0.0,0.0,0.0,1.0);
            this.m_cubeRTTBuilder.setRProcessIDList([1]);

            this.m_vsmModule = new ShadowVSMModule(2);
            this.m_vsmModule.seetCameraPosition(new Vector3D(160, 800, 160));
            //this.m_vsmModule.setCameraNear( 0.01 );
            this.m_vsmModule.setCameraFar(2000.0);
            this.m_vsmModule.setMapSize(128.0, 128.0);
            this.m_vsmModule.setCameraViewSize(2000, 2000);
            this.m_vsmModule.setShadowRadius(2.0);
            this.m_vsmModule.setShadowBias(-0.0005);
            this.m_vsmModule.initialize(this.m_rscene, [0], 3000);
            this.m_vsmModule.setShadowIntensity(0.7);
            this.m_vsmModule.setColorIntensity(0.4);       


            this.m_envData = new EnvLightData();
            this.m_envData.initialize();
            this.m_envData.setFogNear(800.0);
            this.m_envData.setFogFar(4000.0);
            this.m_envData.setFogDensity(0.0001);
            this.m_envData.setFogColorRGB3f(0.0,0.8,0.1);

            this.m_mirrorRprIndex = 3;
            
            this.m_mirrorEffector = new PBRMirror(1);
            this.m_mirrorEffector.reflectPlaneY = this.m_reflectPlaneY;

            this.m_mirrorEffector.fogEnabled = this.m_fogEnabled;
            this.m_mirrorEffector.envData = this.m_envData;
            this.m_mirrorEffector.envMap = this.m_envMap;
            this.m_mirrorEffector.vsmModule = this.m_vsmModule;
            this.m_mirrorEffector.materialBuilder = this.m_materialBuilder;            
            this.m_mirrorEffector.initialize(this.m_rscene, this.m_texLoader, this.m_uiModule, [this.m_mirrorRprIndex]);

            this.m_entityManager = new PBREntityManager(this.m_materialBuilder, this.m_cubeRTTBuilder, this.m_vsmModule, this.m_envData);
            this.m_entityManager.initialize(this.m_rscene, texLoader, this.m_mirrorEffector, this.m_mirrorRprIndex);
            this.initObjs();
        }
    }
    
    private initObjs(): void {

        let param: PBRParamEntity;
        let material: PBRMaterial;

        this.m_paramEntities.push( this.m_mirrorEffector.getPlaneParamEntity() );
        /*
        let urls = [
            "static/assets/hw_morning/morning_ft.jpg",
            "static/assets/hw_morning/morning_bk.jpg",
            "static/assets/hw_morning/morning_up.jpg",
            "static/assets/hw_morning/morning_dn.jpg",
            "static/assets/hw_morning/morning_rt.jpg",
            "static/assets/hw_morning/morning_lf.jpg"
        ];
        let cubeTex0: TextureProxy = this.m_texLoader.getCubeTexAndLoadImg("static/assets/cubeMap", urls);
        //*/
        let sph: Sphere3DEntity;
        let rad: number;
        let radius: number;
        let total: number = 4;
        
        this.m_entityManager.createTexList();
        this.m_entityManager.addTexture(this.m_envMap);
        this.m_entityManager.addTextureByUrl("static/assets/noise.jpg");
        this.m_entityManager.addTextureByUrl("static/assets/disp/lava_03_NRM.png");
        this.m_entityManager.addTextureByUrl("static/assets/disp/lava_03_OCC.png");
        for(let i: number = 0; i < total; ++i) {

            rad = Math.random() * 100.0;
            radius = Math.random() * 250.0 + 550.0;

            let uvscale: number = Math.random() * 7.0 + 0.6;

            material = this.m_entityManager.createMaterial(uvscale,uvscale);
            material.aoMapEnabled = true;
            let pr: number = 80 + Math.random() * 100.0;
            sph = new Sphere3DEntity();
            sph.setMaterial( material );
            sph.initialize(pr, 20, 20);
            sph.setXYZ(radius * Math.cos(rad), i * 30 + (this.m_reflectPlaneY + 10) + pr + 5, radius * Math.sin(rad));
            this.m_rscene.addEntity(sph);
            
            param = new PBRParamEntity();
            param.entity = sph;
            param.setMaterial( material );
            param.pbrUI = this.m_uiModule;
            param.colorPanel = this.m_uiModule.rgbPanel;
            param.initialize();
            this.m_paramEntities.push(param);
            this.m_entityManager.createMirrorEntity(param, material);
            
        }
    }
    update(): void {
        //this.m_lightData.update();
    }
    render(): void {
        // --------------------------------------------- vsm runbegin
        this.m_vsmModule.run();
        // --------------------------------------------- vsm rtt end

        // --------------------------------------------- cube rtt runbegin
        this.m_cubeRTTBuilder.run();
        // --------------------------------------------- cube rtt run end
        this.m_rscene.setClearRGBAColor4f(0.0, 0.0, 0.0, 1.0);

        this.m_mirrorEffector.render();
    }
}