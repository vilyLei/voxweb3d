import RendererScene from "../../../vox/scene/RendererScene";
import { MaterialContextParam } from "../../../materialLab/base/CommonMaterialContext";
import { DebugMaterialContext } from "../../../materialLab/base/DebugMaterialContext";

import { TerrainData } from "../../../terrain/tile/TerrainData";
import { SimpleTerrain } from "../../../terrain/tile/SimpleTerrain";

class TerrainModule {
    constructor() { }

    private m_rscene: RendererScene = null;
    private m_terrainData: TerrainData = null;
    private m_toyTerrain: SimpleTerrain = new SimpleTerrain();
    
    // private m_materialCtx: CommonMaterialContext = new CommonMaterialContext();
    private m_materialCtx: DebugMaterialContext;// = new DebugMaterialContext();

    getTerrainData(): TerrainData {
        return this.m_terrainData;
    }
    private initTerrain(): void {

        let terrainObsVS = new Uint16Array(
            [
                0, 0, 0, 0, 0, 0,
                0, 0, 1, 1, 0, 0,
                0, 0, 0, 0, 0, 0,
                0, 0, 0, 1, 0, 0,
                0, 0, 0, 1, 0, 0,
                0, 0, 0, 0, 0, 0
            ]
        );
        let terrData: TerrainData = new TerrainData();
        terrData.rn = 6;
        terrData.cn = 6;
        terrData.stvs = terrainObsVS;

        terrData.rn = 30;
        terrData.cn = 30;
        terrData.terrainHeight = 15;
        terrData.obstacleHeight = terrData.terrainHeight;
        terrData.obstacleY = 0;
        terrData.gridSize = 80.0;
        
        terrData.positionOffset.y = -terrData.terrainHeight;

        let stvs: Uint16Array = new Uint16Array(terrData.rn * terrData.cn);
        for(let i: number = 0; i < stvs.length; ++i) {
            stvs[i] = Math.random() > 0.9 ? 1 : 0;
        }
        terrData.stvs = stvs;

        terrData.initialize();
        
        this.m_terrainData = terrData;
        this.initTerrainIns( terrData );
    }
    
    private initTerrainIns(terrData: TerrainData): void {

        this.m_toyTerrain = new SimpleTerrain();
        this.m_toyTerrain.initialize(this.m_rscene, this.m_materialCtx, terrData);

    }
    
    private initMaterialCtx(): void {

        let mcParam: MaterialContextParam = new MaterialContextParam();
        mcParam.pointLightsTotal = 0;
        mcParam.directionLightsTotal = 1;
        mcParam.spotLightsTotal = 0;
        
    }
    
    initialize(rscene: RendererScene, materialCtx: DebugMaterialContext): void {
        console.log("TerrainModule::initialize()......");
        if (this.m_rscene == null) {
            this.m_rscene = rscene;
            this.m_materialCtx = materialCtx;

            this.initTerrain();
        }
    }
    
}
export {TerrainModule};