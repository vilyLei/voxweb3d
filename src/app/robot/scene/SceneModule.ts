import Axis3DEntity from "../../../vox/entity/Axis3DEntity";
import RendererScene from "../../../vox/scene/RendererScene";
import CampMoudle from "../../../app/robot/camp/CampMoudle";
import AssetsModule from "../../../app/robot/assets/AssetsModule";
import RunnableModule from "../../../app/robot/scene/RunnableModule";

import { TerrainModule } from "../../../app/robot/terrain/TerrainModule";
import { TerrainEffect } from "../../../app/robot/terrain/TerrainEffect";

import { CommonMaterialContext } from "../../../materialLab/base/CommonMaterialContext";
import { RoleBuilder } from "./RoleBuilder";
import Box3DEntity from "../../../vox/entity/Box3DEntity";
import { MaterialPipeType } from "../../../vox/material/pipeline/MaterialPipeType";
import { RenderModule } from "./RenderModule";
import { TextBillboardLoading } from "../../../loading/base/TextBillboardLoading";

class SceneModule {

    constructor() { }

    private m_rscene: RendererScene = null;

    private m_campModule: CampMoudle = new CampMoudle();
    private m_terrain: TerrainModule = new TerrainModule();
    private m_terrainEff: TerrainEffect = new TerrainEffect();
    private m_roleBuilder: RoleBuilder = new RoleBuilder();
    private m_materialCtx: CommonMaterialContext;
    private m_waitingTotal: number = 0;
    private m_loading: TextBillboardLoading = new TextBillboardLoading();

    envAmbientLightEnabled: boolean = true;
    shadowEnabled: boolean = true;
    fogEnabled: boolean = true;

    initialize(rscene: RendererScene, materialCtx: CommonMaterialContext): void {

        if (this.m_rscene == null) {

            this.m_rscene = rscene;
            this.m_materialCtx = materialCtx;
            RenderModule.GetInstance().initialize(this.m_rscene, this.m_materialCtx);
            AssetsModule.GetInstance().initialize(this.m_rscene, this.m_materialCtx);

            this.m_waitingTotal = this.m_materialCtx.getTextureLoader().getWaitTotal();

            this.init();
        }
    }
    private init(): void {

        let axis: Axis3DEntity = new Axis3DEntity();
        axis.setMaterialPipeline(this.m_materialCtx.pipeline);
        axis.pipeTypes = [MaterialPipeType.FOG_EXP2];
        axis.initializeCross(300.0);
        this.m_rscene.addEntity(axis);

        this.m_loading.step = 4.0;
        this.m_loading.loadingInfoScale = this.m_loading.loadingNameScale = 1.0;
        this.m_loading.initialize(this.m_rscene);

    }
    private initScene(): void {

        this.m_terrainEff.initialize(this.m_rscene, 1, [RenderModule.GetInstance().bottomParticleLayerIndex]);
        this.m_campModule.redCamp.terrainEff = this.m_terrainEff;
        
        let texMaker = this.m_terrainEff.getVierTexMaker();
        let terrain = this.m_terrain.terrain;
        terrain.diffuseMap2 = texMaker.getMap();
        terrain.diffuseMap2Matrix = texMaker.getMatrix();

        terrain.shadowReceiveEnabled = this.shadowEnabled;
        terrain.envAmbientLightEnabled = this.envAmbientLightEnabled;
        terrain.fogEnabled = this.fogEnabled;
        terrain.renderProcessIndex = RenderModule.GetInstance().terrainLayerIndex;
        terrain.colorBrightness = 0.4;
        this.m_terrain.initialize(this.m_rscene, this.m_materialCtx);

        this.m_campModule.initialize(this.m_rscene);

        this.m_roleBuilder.envAmbientLightEnabled = this.envAmbientLightEnabled;
        this.m_roleBuilder.fogEnabled = this.fogEnabled;
        this.m_roleBuilder.terrain = this.m_terrain;
        this.m_roleBuilder.campModule = this.m_campModule;

        this.m_roleBuilder.initialize(this.m_rscene, this.m_materialCtx);

        let total: number = 50;
        this.m_roleBuilder.createLimbRoles(total);
        this.m_roleBuilder.createTrackWheelRoles(total);
        this.m_roleBuilder.createSillyRoles(total);

        this.initEnvBox();
    }

    private initEnvBox(): void {

        let materialBuilder = this.m_roleBuilder.materialBuilder;
        let material = materialBuilder.createBaseLambertMaterial(
            this.m_materialCtx.getTextureByUrl("static/assets/image_003.jpg")
            , null, null
            , true
        );
        material.setRGB3f(0.2, 0.2, 0.2);
        let envBox: Box3DEntity = new Box3DEntity();
        envBox.normalScale = -1.0;
        envBox.setMaterial(material);
        envBox.showFrontFace();
        envBox.initializeCube(4000.0);
        RenderModule.GetInstance().addEnvBoxEntity(envBox);
    }
    run(): void {
        if (this.m_loading.isLoaded()) {
            this.m_campModule.run();
            RunnableModule.Run();
            this.m_terrainEff.run();
        } else {
            let progress: number = (this.m_waitingTotal - this.m_materialCtx.getTextureLoader().getWaitTotal()) / this.m_waitingTotal;
            this.m_loading.run(progress);
            if (this.m_loading.isLoaded()) {
                this.initScene();
            }
        }
    }
}
export { SceneModule };