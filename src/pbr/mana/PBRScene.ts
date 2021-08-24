
import Vector3D from "../../vox/math/Vector3D";
import TextureProxy from "../../vox/texture/TextureProxy";
import ImageTextureLoader from "../../vox/texture/ImageTextureLoader";

import RendererScene from "../../vox/scene/RendererScene";
import DefaultPBRUI from "./DefaultPBRUI";
import PBRMaterialBuilder from "../../pbr/mana/PBRMaterialBuilder";
import PBRMirror from "./PBRMirror";
import CubeRttBuilder from "../../renderingtoy/mcase/CubeRTTBuilder";
import ShadowVSMModule from "../../shadow/vsm/base/ShadowVSMModule";
import GlobalLightData from "../../light/base/GlobalLightData";
import EnvLightData from "../../light/base/EnvLightData";
import DefaultPBRLight from "../../pbr/mana/DefaultPBRLight";
import PBREntityUtils from "../../pbr/mana/PBREntityUtils";
import PBREntityManager from "../../pbr/mana/PBREntityManager";
import Axis3DEntity from "../../vox/entity/Axis3DEntity";
import { SpecularTextureLoader } from "../mana/TextureLoader";


export default class PBRScene
{
    private m_rscene:RendererScene = null;
    private m_texLoader:ImageTextureLoader = null;
    private m_uiModule: DefaultPBRUI;
    private m_envMap: TextureProxy = null;
    private m_mirrorEffector: PBRMirror = null;

    private m_materialBuilder: PBRMaterialBuilder;
    private m_cubeRTTBuilder: CubeRttBuilder;
    private m_vsmModule: ShadowVSMModule;

    private m_mirrorRprIndex: number = 3;
    private m_lightData: GlobalLightData = new GlobalLightData();
    private m_entityUtils: PBREntityUtils = null;
    private m_entityManager: PBREntityManager = null;
    private m_envData: EnvLightData;

    private m_reflectPlaneY: number = -220.0;

    fogEnabled: boolean = true;
    hdrBrnEnabled: boolean = true;
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
            if(this.hdrBrnEnabled) {
                envMapUrl = "static/bytes/spe.hdrBrn";
            }
            let loader: SpecularTextureLoader = new SpecularTextureLoader();
            loader.hdrBrnEnabled = this.hdrBrnEnabled;
            loader.loadTextureWithUrl(envMapUrl, this.m_rscene);
            this.m_envMap = loader.texture;

            let lightModule: DefaultPBRLight = new DefaultPBRLight();
            lightModule.create(4, 2);

            this.m_materialBuilder = new PBRMaterialBuilder();
            this.m_materialBuilder.hdrBrnEnabled = this.hdrBrnEnabled;

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
            this.m_vsmModule.seetCameraPosition(new Vector3D(10, 800, 10));
            this.m_vsmModule.setCameraNear( 10.0 );
            this.m_vsmModule.setCameraFar( 3000.0 );
            this.m_vsmModule.setMapSize(128.0, 128.0);
            this.m_vsmModule.setCameraViewSize(3000, 3000);
            this.m_vsmModule.setShadowRadius(4.0);
            this.m_vsmModule.setShadowBias(-0.0005);
            this.m_vsmModule.initialize(this.m_rscene, [0,1], 3000);
            this.m_vsmModule.setShadowIntensity(0.95);
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

            this.m_mirrorEffector.fogEnabled = this.fogEnabled;
            this.m_mirrorEffector.envData = this.m_envData;
            this.m_mirrorEffector.envMap = this.m_envMap;
            this.m_mirrorEffector.vsmModule = this.m_vsmModule;
            this.m_mirrorEffector.materialBuilder = this.m_materialBuilder;            
            this.m_mirrorEffector.initialize(this.m_rscene, this.m_texLoader, this.m_uiModule, [this.m_mirrorRprIndex]);

            this.m_entityUtils = new PBREntityUtils(this.m_materialBuilder, this.m_cubeRTTBuilder, this.m_vsmModule, this.m_envData);
            this.m_entityUtils.initialize(this.m_rscene, texLoader, this.m_mirrorEffector, this.m_mirrorRprIndex);
            this.m_entityManager = new PBREntityManager();
            this.m_entityManager.initialize(this.m_rscene, this.m_entityUtils, this.m_mirrorEffector, uiModule, this.m_envMap);

        }
    }
    
    update(): void {
        this.m_entityManager.run();
    }
    prerender(): void {
        // --------------------------------------------- vsm runbegin
        this.m_vsmModule.run();
        // --------------------------------------------- vsm rtt end

        // --------------------------------------------- cube rtt runbegin
        this.m_cubeRTTBuilder.run();
        // --------------------------------------------- cube rtt run end
        this.m_rscene.setClearRGBAColor4f(0.0, 0.0, 0.0, 1.0);

        this.m_mirrorEffector.render();
    }
    render(): void {
        this.m_rscene.runAt(0);
        this.m_rscene.runAt(1);
        this.m_rscene.runAt(2);
        //this.m_rscene.runAt(3);
    }
}