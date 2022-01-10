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
import TextBillboard3DEntity from "../../../vox/text/TextBillboard3DEntity";
import H5FontSystem from "../../../vox/text/H5FontSys";
import RendererDevice from "../../../vox/render/RendererDevice";
import { RenderModule } from "./RenderModule";

class SceneModule {

    constructor() { }

    private m_rscene: RendererScene = null;

    private m_campModule: CampMoudle = new CampMoudle();
    private m_terrain: TerrainModule = new TerrainModule();
    private m_roleBuilder: RoleBuilder = new RoleBuilder();
    private m_materialCtx: CommonMaterialContext;
    private m_waitingTotal: number = 0;

    envAmbientLightEnabled: boolean = true;
    shadowEnabled: boolean = true;
    fogEnabled: boolean = true;

    initialize(rscene: RendererScene, materialCtx: CommonMaterialContext): void {

        if (this.m_rscene == null) {

            this.m_rscene = rscene;
            this.m_materialCtx = materialCtx;
            RenderModule.GetInstance().initialize(this.m_rscene, this.m_materialCtx);

            AssetsModule.GetInstance().initialize(this.m_materialCtx);
            this.m_waitingTotal = this.m_materialCtx.getTextureLoader().getWaitTotal();
            
            this.init();
        }
    }
    private m_loadingNSEntity: TextBillboard3DEntity;
    private m_loadingEntity: TextBillboard3DEntity;

    private init(): void {

        let fontSys = H5FontSystem.GetInstance();
        fontSys.mobileEnabled = false;
        fontSys.setRenderProxy(this.m_rscene.getRenderProxy());
        fontSys.initialize("fontTex", 36, 512, 512, false, true);

        this.m_loadingNSEntity = new TextBillboard3DEntity();
        this.m_loadingNSEntity.initialize("resource");
        this.m_loadingNSEntity.setXYZ(0.0,-230.0, 0.0);
        this.m_loadingNSEntity.setScaleXY(2.0, 2.0);
        this.m_loadingNSEntity.setRGB3f(0.3, 1.7, 0.5);
        this.m_rscene.addEntity( this.m_loadingNSEntity );

        this.m_loadingEntity = new TextBillboard3DEntity();
        this.m_loadingEntity.initialize("loading 100%");
        this.m_loadingEntity.setXYZ(0.0, -370.0, 0.0);
        this.m_loadingEntity.setScaleXY(3.0, 3.0);
        this.m_loadingEntity.setRGB3f(0.5, 0.5, 1.3);
        this.m_rscene.addEntity( this.m_loadingEntity );

        let axis: Axis3DEntity = new Axis3DEntity();
        axis.initialize(300.0);
        this.m_rscene.addEntity(axis);

        axis = new Axis3DEntity();
        axis.setMaterialPipeline( this.m_materialCtx.pipeline );
        axis.pipeTypes = [ MaterialPipeType.FOG_EXP2 ];
        axis.initializeCross(200.0);

        this.m_rscene.addEntity(axis);

    }
    private initScene(): void {

        this.m_terrain.terrain.shadowReceiveEnabled = this.shadowEnabled;
        this.m_terrain.terrain.envAmbientLightEnabled = this.envAmbientLightEnabled;
        this.m_terrain.terrain.fogEnabled = this.fogEnabled;
        this.m_terrain.terrain.renderProcessIndex = RenderModule.GetInstance().terrainLayerIndex;
        this.m_terrain.terrain.colorBrightness = 0.4;
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
        this.m_rscene.addEntity(envBox, RenderModule.GetInstance().envBoxLayerIndex);
    }
    private m_loaded: boolean = false;
    
    run(): void {

        if(this.m_loaded) {
            this.m_campModule.run();
            RunnableModule.Run();
            if(this.m_loadingEntity != null) {
                this.m_rscene.removeEntity( this.m_loadingNSEntity );
                this.m_rscene.removeEntity( this.m_loadingEntity );
                this.m_loadingNSEntity = null;
                this.m_loadingEntity = null;
                this.initScene();
            }
        }
        else if(this.m_materialCtx != null){
            if(this.m_materialCtx.isTextureLoadedAll()) {
                this.m_loaded = true;
                this.m_loadingEntity.setText("loading 100%");
                this.m_loadingEntity.updateMeshToGpu();
                this.m_loadingEntity.update();
            }
            else {
                let f: number = (this.m_waitingTotal - this.m_materialCtx.getTextureLoader().getWaitTotal()) / this.m_waitingTotal;
                this.m_loadingEntity.setText("loading " + Math.round(f * 100) + "%");
                this.m_loadingEntity.updateMeshToGpu();
                this.m_loadingEntity.update();
            }
        }
    }
}
export { SceneModule };