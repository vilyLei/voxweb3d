import Axis3DEntity from "../../../vox/entity/Axis3DEntity";
import RendererScene from "../../../vox/scene/RendererScene";
import CampMoudle from "../../../app/robot/camp/CampMoudle";
import AssetsModule from "../../../app/robot/assets/AssetsModule";
import RunnableModule from "../../../app/robot/scene/RunnableModule";

import { TerrainModule } from "../../../app/robot/terrain/TerrainModule";

import { CommonMaterialContext } from "../../../materialLab/base/CommonMaterialContext";
import { RoleBuilder } from "./RoleBuilder";
import Box3DEntity from "../../../vox/entity/Box3DEntity";
import { MaterialPipeType } from "../../../vox/material/pipeline/MaterialPipeType";

class SceneModule {

    constructor() { }

    private m_rscene: RendererScene = null;

    private m_campModule: CampMoudle = new CampMoudle();
    private m_terrain: TerrainModule = new TerrainModule();
    private m_roleBuilder: RoleBuilder = new RoleBuilder();
    private m_materialCtx: CommonMaterialContext;

    envAmbientLightEnabled: boolean = true;
    shadowEnabled: boolean = true;
    fogEnabled: boolean = true;

    initialize(rscene: RendererScene, materialCtx: CommonMaterialContext): void {

        if (this.m_rscene == null) {
            this.m_rscene = rscene;
            this.m_materialCtx = materialCtx;

            this.m_terrain.terrain.shadowReceiveEnabled = this.shadowEnabled;
            this.m_terrain.terrain.envAmbientLightEnabled = this.envAmbientLightEnabled;
            this.m_terrain.terrain.fogEnabled = this.fogEnabled;
            this.m_terrain.terrain.renderProcessIndex = 1;
            this.m_terrain.terrain.colorBrightness = 0.4;
            this.m_terrain.initialize(this.m_rscene, this.m_materialCtx);

            AssetsModule.GetInstance().initialize(this.m_materialCtx);
            this.m_campModule.initialize(this.m_rscene);

            this.m_roleBuilder.envAmbientLightEnabled = this.envAmbientLightEnabled;
            this.m_roleBuilder.fogEnabled = this.fogEnabled;
            this.m_roleBuilder.terrain = this.m_terrain;
            this.m_roleBuilder.campModule = this.m_campModule;
            this.m_roleBuilder.initialize(rscene, materialCtx);

            this.init();
        }
    }
    private init(): void {

        let axis: Axis3DEntity = new Axis3DEntity();
        axis.initialize(300.0);
        this.m_rscene.addEntity(axis);

        axis = new Axis3DEntity();
        axis.setMaterialPipeline( this.m_materialCtx.pipeline );
        axis.pipeTypes = [ MaterialPipeType.FOG_EXP2 ];
        axis.initializeCross(200.0);
        
        this.m_rscene.addEntity(axis);
        let total: number = 5;
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
        this.m_rscene.addEntity(envBox, 4);
    }

    run(): void {
        this.m_campModule.run();
        RunnableModule.Run();
    }
}
export { SceneModule };