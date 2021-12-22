/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
import ThreadTask from "../../../../thread/control/ThreadTask";
import { IToyEntity } from "../base/IToyEntity";
import { EntityStatusManager } from "../base/EntityStatusManager";
import { TerrainData } from "../../../..//terrain/tile/TerrainData";
import { PathSerachListener } from "../../../../voxnav/tileTerrain/PathSerachListener";
import { TerrainNavigation } from "../../../../voxnav/tileTerrain/TerrainNavigation";
import { StatusDetector } from "../base/StatusDetector";

class ToyCarTask extends ThreadTask {
    
    private m_aStarFlag: number = 0;
    private m_dataStepLength: number = 16 * 5;
    private m_total: number = 0;
    private m_matsTotal: number = 1;
    private m_transInputData: Float32Array = null;
    private m_transParamData: Float32Array = null;
    private m_transOutputData: Float32Array = null;
    
    private m_searchPathListener: PathSerachListener = null;

    private m_transEnabled: boolean = true;
    private m_pathSerachEnabled: boolean = true;
    private m_entityIndex: number = 0;
    private m_entities: IToyEntity[] = [];
    
    private m_transFlag: number = 0;
    private m_calcType: number = 1;
    private m_statusManager: EntityStatusManager = new EntityStatusManager();
    private m_terrNav: TerrainNavigation = new TerrainNavigation();
    private m_detector: StatusDetector = new StatusDetector();
    private m_time: number = 0;

    taskIndex: number = 0;

    constructor() {
        super();
    }
    
    initialize(entitiesTotal: number): void {
        if (this.m_total < 1 && this.m_transInputData == null) {
            
            this.m_total = entitiesTotal;
            this.m_transInputData = new Float32Array(entitiesTotal * this.m_dataStepLength);
            this.m_transParamData = new Float32Array(entitiesTotal * this.m_dataStepLength);
            this.m_transOutputData = new Float32Array(entitiesTotal * this.m_dataStepLength);

            this.m_statusManager.initialize( entitiesTotal );
        }
    }
    getTransFS32Data(): Float32Array {
        return this.m_transInputData;
    }

    addEntity(entity: IToyEntity): void {
        if(this.m_entityIndex < this.m_total) {

            entity.setEntityIndex(this.m_entityIndex);
            entity.transform.detector = this.m_detector;
            entity.transform.setFS32Data(this.getTransFS32Data(), this.m_entityIndex);

            this.m_entities.push( entity );

            this.m_terrNav.addPathNavigator( entity.navigator );

            this.m_entityIndex ++;
            this.m_matsTotal = this.m_entityIndex * 5;
        }
    }
    getTotal(): number {
        return this.m_total;
    }
    navigationRun(): void {
        this.m_terrNav.run();
    }
    run(): void {
        
        if (this.isSendTransEnabled()) {
            if (this.m_matsTotal > 0) {
                this.sendTransData();
            }
        }
        if (this.isAStarEnabled()) {
            this.searchPath();
        }
    }

    isSendTransEnabled(): boolean {
        return this.m_transEnabled;
    }
    private sendTransData(): void {

        if (this.m_transEnabled) {
            if(this.m_detector.version > 0) {
                this.m_detector.version = 0;

                this.m_transParamData.set(this.m_transInputData);
                this.m_statusManager.updateEntityStatus(this.m_entities);
                let descriptor: any = {taskIndex: this.taskIndex, flag: this.m_transFlag, calcType: this.m_calcType, allTotal: this.m_total, matsTotal: this.m_matsTotal};
                this.addDataWithParam("car_trans", [this.m_transParamData, this.m_transOutputData, this.m_statusManager.getStatusData()], descriptor, true);
                this.m_transEnabled = false;
                this.m_transFlag = 0;
                this.m_calcType = 0;
            }
        }
        else {
            console.log("sendTransData failure...");
        }
    }
    
    aStarInitialize(terrData: TerrainData): void {

        if(this.m_aStarFlag == 0 && terrData != null) {
            
            let descriptor: any = {
                rn: terrData.rn,
                cn: terrData.cn,
                stvs: terrData.stvs.slice(0),
                taskIndex: this.taskIndex
            };
            this.addDataWithParam("aStar_init", [descriptor.stvs], descriptor, true);
            this.m_aStarFlag = 1;
            this.m_terrNav.initialize(4);
        }
    }

    setSearchPathListener(listener: PathSerachListener): void {
        this.m_searchPathListener = listener;
    }
    private searchPath(): void {
        if(this.m_pathSerachEnabled) {
            
            this.m_terrNav.buildSearchData();

            let otherStreams: Uint16Array[] = this.m_searchPathListener != null ? this.m_searchPathListener.getSearchPathData() : null;
            let streams: Uint16Array[] = this.m_terrNav.getSearchPathData();
            if(otherStreams != null) {
                streams = streams != null ? streams.concat(otherStreams) : otherStreams;
                //console.log("searchPath(), streams: ",streams);
            }
            if(streams != null) {
                
                this.m_pathSerachEnabled = false;
                let descriptor: any = {
                    taskIndex: this.taskIndex,
                    otherStreams: otherStreams != null
                };
                this.addDataWithParam("aStar_search", streams, descriptor, true);
            }
        }
    }
    isAStarEnabled(): boolean {
        return this.m_aStarFlag == 2;
    }
    
    private updateEntityTrans(fs32: Float32Array): void {
        for (let i: number = 0; i < this.m_entities.length; ++i) {
            
            if(this.m_statusManager.isEnabledAt(i)){
                this.m_entities[i].updateTrans(fs32);
            }
        }
    }
    updateEntityBounds(): void {
        // for (let i: number = 0; i < this.m_entities.length; ++i) {
        //     if(this.m_entities[i].boundsChanged){
        //         this.m_entities[i].updateBounds();
        //     }
        // }
    }
    
    // return true, task finish; return false, task continue...
    parseDone(data: any, flag: number): boolean {
        

        switch(data.taskCmd) {
            case "car_trans":

                //this.m_time = Date.now() - this.m_time;
                this.m_transParamData = data.streams[0];
                this.m_transOutputData = data.streams[1];
                this.m_statusManager.setStatusData(data.streams[2]);
                this.updateEntityTrans( this.m_transOutputData );
                this.m_transEnabled = true;
                break;
            case "aStar_search":
                // console.log("parseDone XXXX aStar_search...", this.getUid());
                let descriptor = data.descriptor;
                let streams = data.streams;
                if(descriptor.otherStreams) {
                    if(streams.length > 2) {
                        this.m_terrNav.receiveSearchedPathData([streams[0], streams[1]]);
                        streams = streams.slice(2);
                    }
                    if(streams.length > 0 && this.m_searchPathListener != null) {
                        this.m_searchPathListener.receiveSearchedPathData(streams);
                    }
                }
                else {
                    this.m_terrNav.receiveSearchedPathData(streams);
                }
                this.m_pathSerachEnabled = true;
                break;
            case "aStar_init":

                console.log("parseDone XXXX aStar_init...");
                this.m_aStarFlag = 2;
                this.m_pathSerachEnabled = true;
                break;
            default:

                break;
        }
        return true;
    }
    destroy(): void {

        if(this.m_entityIndex > 0) {

            this.m_total = 0;
            this.m_matsTotal = 0;
            this.m_transInputData = null;
            this.m_transParamData = null;
            this.m_transOutputData = null;

            for(let i: number = 0; i < this.m_entityIndex; ++i) {
                this.m_entities[i].destroy();
                this.m_entities[i] = null;
            }
            this.m_entityIndex = 0;
            this.m_entities = [];
        }

        if (this.getUid() > 0) {
            super.destroy();
        }
    }

    getTaskClass(): number {
        return 0;
    }
}
export { ToyCarTask };