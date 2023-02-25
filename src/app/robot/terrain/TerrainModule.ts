import RendererScene from "../../../vox/scene/RendererScene";
import { CommonMaterialContext } from "../../../materialLab/base/CommonMaterialContext";

import { TerrainData } from "../../../terrain/tile/TerrainData";
import { SimpleTerrain } from "../../../terrain/tile/SimpleTerrain";

class TerrainModule {
    constructor() { }

    private m_rscene: RendererScene = null;
    private m_terrainData: TerrainData = null;
    terrain: SimpleTerrain = new SimpleTerrain();
    
    private m_materialCtx: CommonMaterialContext;

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

        let stvs = new Uint16Array(terrData.rn * terrData.cn);
        for(let i = 0; i < stvs.length; ++i) {
            stvs[i] = Math.random() > 0.9 ? 1 : 0;
        }
        terrData.stvs = stvs;

        terrData.initialize();
        
        this.m_terrainData = terrData;
        this.initTerrainIns( terrData );
    }
    
    private initTerrainIns(terrData: TerrainData): void {
        this.terrain.initialize(this.m_rscene, this.m_materialCtx, terrData);

    }
        
    initialize(rscene: RendererScene, materialCtx: CommonMaterialContext): void {
        console.log("TerrainModule::initialize()......");
        if (this.m_rscene == null) {
            this.m_rscene = rscene;
            this.m_materialCtx = materialCtx;

            this.initTerrain();
        }
    }
    
}
export {TerrainModule};