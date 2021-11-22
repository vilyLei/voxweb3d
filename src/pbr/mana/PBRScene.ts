
import Vector3D from "../../vox/math/Vector3D";
import TextureProxy from "../../vox/texture/TextureProxy";
import ImageTextureLoader from "../../vox/texture/ImageTextureLoader";

import RendererScene from "../../vox/scene/RendererScene";
import DefaultPBRUI from "./DefaultPBRUI";
import PBRMaterialBuilder from "../../pbr/mana/PBRMaterialBuilder";
import PBRMirror from "./PBRMirror";
import CubeRttBuilder from "../../renderingtoy/mcase/CubeRTTBuilder";

import PBREntityUtils from "../../pbr/mana/PBREntityUtils";
import PBREntityManager from "../../pbr/mana/PBREntityManager";
import Axis3DEntity from "../../vox/entity/Axis3DEntity";
import { SpecularTextureLoader } from "../mana/TextureLoader";

import { PBRShaderCode } from "../../pbr/material/glsl/PBRShaderCode";
import { MaterialPipeType } from "../../vox/material/pipeline/MaterialPipeType";
import { MaterialContext, MaterialContextParam } from "../../materialLab/base/MaterialContext";
import { DirectionLight } from "../../light/base/DirectionLight";

export default class PBRScene {
    private m_rscene: RendererScene = null;
    private m_texLoader: ImageTextureLoader = null;
    private m_uiModule: DefaultPBRUI;
    private m_envMap: TextureProxy = null;
    private m_mirrorEffector: PBRMirror = null;

    private m_materialBuilder: PBRMaterialBuilder;
    private m_cubeRTTBuilder: CubeRttBuilder;

    private m_mirrorRprIndex: number = 3;
    private m_entityUtils: PBREntityUtils = null;
    private m_entityManager: PBREntityManager = null;

    private m_reflectPlaneY: number = -220.0;


    readonly materialCtx: MaterialContext = new MaterialContext();

    fogEnabled: boolean = true;
    hdrBrnEnabled: boolean = true;
    vtxFlatNormal: boolean = false;
    constructor() {

    }

    initialize(rscene: RendererScene, texLoader: ImageTextureLoader, uiModule: DefaultPBRUI): void {

        if (this.m_rscene == null) {
            this.m_rscene = rscene;
            this.m_texLoader = texLoader;
            this.m_uiModule = uiModule;

            let envMapUrl: string = "static/bytes/spe.mdf";
            if (this.hdrBrnEnabled) {
                envMapUrl = "static/bytes/spe.hdrBrn";
            }
            let loader: SpecularTextureLoader = new SpecularTextureLoader();
            loader.hdrBrnEnabled = this.hdrBrnEnabled;
            loader.loadTextureWithUrl(envMapUrl, this.m_rscene);
            this.m_envMap = loader.texture;

            let mcParam: MaterialContextParam = new MaterialContextParam();
            mcParam.pointLightsTotal = 0;
            mcParam.directionLightsTotal = 2;
            mcParam.spotLightsTotal = 0;
            mcParam.vsmFboIndex = 2;
            this.materialCtx.initialize(this.m_rscene, mcParam);
            let direcLight: DirectionLight = this.materialCtx.lightModule.getDirectionLightAt(0);
            if (direcLight != null) {
                direcLight.direction.setXYZ(1.0, -1.0, 0.0);
                direcLight.color.setRGB3f(1.0, 0.0, 1.0);
                direcLight = this.materialCtx.lightModule.getDirectionLightAt(1);
                if (direcLight != null) {
                    direcLight.direction.setXYZ(-1.0, -1.0, 0.0);
                    direcLight.color.setRGB3f(0.0, 1.0, 0.0);
                }
            }
            this.materialCtx.lightModule.update();

            this.m_materialBuilder = new PBRMaterialBuilder();
            this.m_materialBuilder.pipeline = this.materialCtx.pipeline;
            this.m_materialBuilder.pipeline.addShaderCode(PBRShaderCode);
            this.m_materialBuilder.hdrBrnEnabled = this.hdrBrnEnabled;
            this.m_materialBuilder.vtxFlatNormal = this.vtxFlatNormal;

            // for test
            /*
            let posList: Vector3D[] = this.m_lightData.getPointLightPosList();
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
            //*/

            let cubeRTTMipMapEnabled: boolean = true;
            let rttPos: Vector3D = new Vector3D(0.0, 0.0, 0.0);
            // for indirect light
            this.m_cubeRTTBuilder = new CubeRttBuilder();
            this.m_cubeRTTBuilder.mipmapEnabled = cubeRTTMipMapEnabled;
            this.m_cubeRTTBuilder.initialize(this.m_rscene, 256.0, 256.0, rttPos);
            //this.m_cubeRTTBuilder.setClearRGBAColor4f(0.0,0.0,0.0,1.0);
            this.m_cubeRTTBuilder.setRProcessIDList([1]);

            let vsmModule = this.materialCtx.vsmModule;
            vsmModule.setRendererProcessIDList([0,1]);
            vsmModule.setCameraPosition(new Vector3D(10, 800, 10));
            vsmModule.setCameraNear( 10.0 );
            vsmModule.setCameraFar( 3000.0 );
            vsmModule.setMapSize(128.0, 128.0);
            vsmModule.setCameraViewSize(3000, 3000);
            vsmModule.setShadowRadius(4.0);
            vsmModule.setShadowBias(-0.0005);
            vsmModule.setShadowIntensity(0.95);
            vsmModule.setColorIntensity(0.4);
            vsmModule.upate();


            let envData = this.materialCtx.envData;
            envData.setFogNear(800.0);
            envData.setFogFar(4000.0);
            envData.setFogDensity(0.0001);
            envData.setFogColorRGB3f(0.0, 0.8, 0.1);

            this.m_mirrorRprIndex = 3;

            this.m_mirrorEffector = new PBRMirror(1);
            this.m_mirrorEffector.reflectPlaneY = this.m_reflectPlaneY;

            this.m_mirrorEffector.fogEnabled = this.fogEnabled;
            this.m_mirrorEffector.envMap = this.m_envMap;
            this.m_mirrorEffector.vsmModule = vsmModule;
            this.m_mirrorEffector.materialBuilder = this.m_materialBuilder;
            this.m_mirrorEffector.initialize(this.m_rscene, this.m_texLoader, this.m_uiModule, [this.m_mirrorRprIndex]);

            this.m_entityUtils = new PBREntityUtils(this.m_materialBuilder, this.m_cubeRTTBuilder, vsmModule);
            this.m_entityUtils.initialize(this.m_rscene, texLoader, this.m_mirrorEffector, this.m_mirrorRprIndex);
            this.m_entityManager = new PBREntityManager();
            this.m_entityManager.initialize(this.m_rscene, this.m_entityUtils, this.m_mirrorEffector, uiModule, this.m_envMap);

        }
    }

    update(): void {
        this.m_entityManager.run();
    }
    private m_cubeRTTTimes: number = 2001;
    prerender(): void {

        // --------------------------------------------- material context running begin
        this.materialCtx.run();
        // --------------------------------------------- material context running end

        // --------------------------------------------- cube rtt runbegin
        if (this.m_cubeRTTTimes > 0) {
            this.m_cubeRTTTimes--;
            if (this.m_cubeRTTTimes % 15 == 0) {
                this.m_cubeRTTBuilder.run();
            }
        }
        // --------------------------------------------- cube rtt run end
        this.m_rscene.setClearRGBAColor4f(0.1, 0.5, 0.1, 1.0);

        this.m_mirrorEffector.render();

        this.m_rscene.setRenderToBackBuffer();
    }
    render(): void {
        this.m_rscene.runAt(0);
        this.m_rscene.runAt(1);
        this.m_rscene.runAt(2);
        this.m_rscene.runAt(4);
    }
}