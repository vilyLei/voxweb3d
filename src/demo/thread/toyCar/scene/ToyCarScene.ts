import RendererScene from "../../../../vox/scene/RendererScene";

import ThreadSystem from "../../../../thread/ThreadSystem";
import { ToyCarTask } from "../task/ToyCarTask";
import { ToyCarBuilder } from "./ToyCarBuilder";
import { TerrainData } from "../../../../terrain/tile/TerrainData";
import { SimpleTerrain } from "../../../../terrain/tile/SimpleTerrain";
import { CarEntity } from "../base/CarEntity";
import { TerrainNavigation } from "../../../../voxnav/tileTerrain/TerrainNavigation";
import Vector3D from "../../../../vox/math/Vector3D";
import { NavigationStatus } from "../../../../voxnav/tileTerrain/NavigationStatus";
import { CommonMaterialContext } from "../../../../materialLab/base/CommonMaterialContext";

class ToyCarScene {

    constructor() { }

    private m_rscene: RendererScene = null;
    private m_materialCtx: CommonMaterialContext;
    private m_toyCarBuilder: ToyCarBuilder = new ToyCarBuilder();
    private m_toyTerrain: SimpleTerrain = new SimpleTerrain();
    private m_entitiesTotal: number = 0;
    private m_toyCarTasks: ToyCarTask[] = [];
    private m_terrainData: TerrainData = null;
    private m_bodyScale: number = 1.0;
    private m_buildEntitiesTotal: number = 10;
    private m_tasksTotal: number = 1;
    private m_threadsTotal: number = 2;
    
    initialize(scene: RendererScene, materialCtx: CommonMaterialContext): void {
        if (this.m_rscene == null) {
            this.m_rscene = scene;
            this.m_materialCtx = materialCtx;

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

            terrData.rn = 20;
            terrData.cn = 20;
            terrData.terrainHeight = 15;
            terrData.gridSize = 40.0;
            let stvs: Uint16Array = new Uint16Array(terrData.rn * terrData.cn);
            for(let i: number = 0; i < stvs.length; ++i) {
                stvs[i] = Math.random() > 0.9 ? 1 : 0;
            }
            terrData.stvs = stvs;

            terrData.initialize();
            
            this.m_bodyScale = terrData.gridSize / 80.0;

            this.m_terrainData = terrData;

            this.m_toyCarBuilder.initialize(scene, materialCtx, this.m_terrainData);


            this.initThread(terrData);
            this.buildEntities();

            this.initTerrain(terrData);
        }
    }
    private buildThreadTask(terrData: TerrainData, threadIndex: number = 0): void {

        let tasksTotal: number = this.m_tasksTotal;
        for(let i: number = 0; i < tasksTotal; ++i) {

            let total: number = this.m_buildEntitiesTotal;
            let matTask: ToyCarTask = new ToyCarTask();
            matTask.taskIndex = i;
            ThreadSystem.BindTask(matTask, threadIndex);
            matTask.initialize(total);
            matTask.aStarInitialize(terrData);
    
            this.m_entitiesTotal += total;
            this.m_toyCarTasks.push(matTask);
    
        }
    }
    private m_entity0: CarEntity;
    private buildEntities(): void {

        let entity: CarEntity;        
        for (let i: number = 0; i < this.m_toyCarTasks.length; ++i) {

            let task: ToyCarTask = this.m_toyCarTasks[i];
            for (let j: number = 0; j < this.m_buildEntitiesTotal; ++j) {

                entity = this.m_toyCarBuilder.buildCarEntity(task, this.m_bodyScale);                
                this.m_entity0 = entity;
            }
        }
    }
    private updateThreadTask(): void {

        let tasks = this.m_toyCarTasks;
        let len: number = tasks.length;
        for (let i: number = 0; i < len; ++i) {
            tasks[i].run();
        }
    }
    private initThread(terrData: TerrainData): void {
        // 注意: m_codeStr 代码中描述的 getTaskClass() 返回值 要和 threadToyCar 中的 getTaskClass() 返回值 要相等
        ThreadSystem.InitTaskByURL("static/thread/threadToyCar.js", 0);
        ThreadSystem.Initialize(2);
        for(let i: number = 0; i < this.m_threadsTotal; i++) {
            this.buildThreadTask(terrData, i);
        }

    }
    private m_dis: number = 0;
    private m_testFlag: number = 0;
    private m_rc0: number[];
    private m_rc1: number[];
    private m_terrNav: TerrainNavigation = null;//new TerrainNavigation();
    testDose(pv: Vector3D): void {
        ///*
        if(this.m_terrainData != null) {
            let task = this.m_toyCarTasks[0];
            if(this.m_terrNav == null) {
                this.m_terrNav = new TerrainNavigation();
                this.m_terrNav.initialize();
                task.setSearchPathListener( this.m_terrNav );
            }

            let containsFlag: boolean = this.m_terrainData.containsPosition( pv );
            console.log("containsFlag: ",containsFlag);
            if(containsFlag) {
                //if(this.m_testFlag < 2 && this.m_entity0.navigator.isStopped()) {
                if(this.m_testFlag < 2) {
                    let i: number = this.m_testFlag * 2;
                    let rc: number[] = this.m_terrainData.getRCByPosition(pv);
                    if(this.m_testFlag == 0) {
                        this.m_rc0 = rc;
                        // this.m_entity0.navigator.setBeginRC(rc[0], rc[1]);
                        // this.m_entity0.setPosition( this.m_terrainData.getTerrainPositionByRC(rc[0], rc[1]) );

                    }
                    else if(this.m_testFlag == 1) {
                        this.m_rc1 = rc;
                        // this.m_entity0.navigator.setEndRC(rc[0], rc[1]);
                        // this.m_entity0.navigator.searchPath();
                        this.m_terrNav.resetSearchPath();
                        this.m_terrNav.setSearchPathParamAt(
                            0,
                            this.m_rc0[0], this.m_rc0[1],
                            this.m_rc1[0], this.m_rc1[1]
                            );
                    }
                    this.m_testFlag ++;
                }
                else {
                    this.m_testFlag = 0;
                }
            }
        }
        //*/
        // if (task.isAStarEnabled()) {
        //     //task.aStarSearch( {r0: 1, c0: 1, r1: 4, c1: 5} );
        //     task.searchPath();
        //     // this.m_entity0.setWheelRotSpeed(20.0);
        //     //this.m_entity0.setXYZ(200, 25, -100 + this.m_dis);
        //     this.m_dis += 10.0;
        // }
        // this.updateThreadTask();
        // let rc: number[] = this.m_terrainData.getRCByPosition(pv);
        // console.log("rc: ", rc);
    }
    private initTerrain(terrData: TerrainData): void {

        this.m_toyTerrain = new SimpleTerrain();
        this.m_toyTerrain.initialize(this.m_rscene, this.m_materialCtx, terrData);

    }
    updateThread(): void {
        this.updateThreadTask();
    }

    run(): void {
        
        let tasks = this.m_toyCarTasks;
        let len: number = tasks.length;
        for (let i: number = 0; i < len; ++i) {
            tasks[i].navigationRun();
        }
    }
}
export { ToyCarScene }
