import RendererScene from "../../../../vox/scene/RendererScene";
import TextureProxy from "../../../../vox/texture/TextureProxy";
import { TextureConst } from "../../../../vox/texture/TextureConst";
import ImageTextureLoader from "../../../../vox/texture/ImageTextureLoader";

import ThreadSystem from "../../../../thread/ThreadSystem";
import { ToyCarTask } from "../task/ToyCarTask";
import { ToyCarBuilder } from "./ToyCarBuilder";
import { TerrainData } from "../terrain/TerrainData";
import { ToyCarTerrain } from "../terrain/ToyCarTerrain";

class ToyCarScene {

    constructor() { }

    private m_rscene: RendererScene = null;
    private m_texLoader: ImageTextureLoader;
    private m_toyCarBuilder: ToyCarBuilder = new ToyCarBuilder();
    private m_toyTerrain: ToyCarTerrain = new ToyCarTerrain();
    private m_entitiesTotal: number = 0;
    private m_toyCarTasks: ToyCarTask[] = [];
    
    initialize(scene: RendererScene, texLoader: ImageTextureLoader): void {
        if (this.m_rscene == null) {
            this.m_rscene = scene;
            this.m_texLoader = texLoader;
            
            this.m_toyCarBuilder.initialize(scene, texLoader);


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
            terrData.initialize();

            this.initThread(terrData);
            this.buildEntities();

            this.initTerrain(terrData);
        }
    }
    
    private buildThreadTask(terrData: TerrainData): void {
        
        let total: number = 2;
        let matTask: ToyCarTask = new ToyCarTask();
        matTask.initialize(total);
        matTask.setThrDataPool(ThreadSystem.GetThrDataPool());

        matTask.aStarInitialize(terrData);

        this.m_entitiesTotal += total;
        this.m_toyCarTasks.push(matTask);
        
    }
    private buildEntities(): void {

        for(let i: number = 0; i < this.m_toyCarTasks.length; ++i) {
            let task: ToyCarTask = this.m_toyCarTasks[i];
            this.m_toyCarBuilder.buildEntities(task);

        }
        
    }
    private updateThreadTask(): void {
        let list = this.m_toyCarTasks;
        let len: number = list.length;
        for (let i: number = 0; i < len; ++i) {
            list[i].updateEntitiesTrans();
        }
    }
    private initThread(terrData: TerrainData): void {
        this.buildThreadTask(terrData);

        // 注意: m_codeStr 代码中描述的 getTaskClass() 返回值 要和 threadToyCar 中的 getTaskClass() 返回值 要相等
        ThreadSystem.InitTaskByURL("static/thread/threadToyCar.js", 0);
        ThreadSystem.Initialize(1);
    }
    testDose(): void {
        let task = this.m_toyCarTasks[0];
        if(task.isAStarEnabled()) {
            //task.aStarSearch( {r0: 1, c0: 1, r1: 4, c1: 5} );
            task.searchPath();
        }
    }
    private initTerrain(terrData: TerrainData): void {

        this.m_toyTerrain = new ToyCarTerrain();
        this.m_toyTerrain.initialize(this.m_rscene, this.m_texLoader, terrData);
        
    }
    updateThread(): void {
        this.updateThreadTask();
    }

    run(): void {
        this.m_toyCarBuilder.run();
    }
}
export { ToyCarScene }
