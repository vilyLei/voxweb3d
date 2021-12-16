/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
import ThreadTask from "../../../../thread/control/ThreadTask";
import { IToyEntity } from "../base/IToyEntity";
import { TerrainData } from "../terrain/TerrainData";
import { TerrainPathStatus } from "../terrain/TerrainPath";

class ToyCarTask extends ThreadTask {

    private m_dataStepLength: number = 16 * 5;
    private m_total: number = 0;
    private m_matsTotal: number = 1;
    private m_transInputData: Float32Array = null;
    private m_transParamData: Float32Array = null;
    private m_transSTData: Uint16Array = null;
    private m_transInputSTData: Uint16Array = null;
    private m_transOutputData: Float32Array = null;
    // 存放请求寻路的信息数据
    private m_pathSearchData: Uint16Array = null;
    // 存放寻路结果
    private m_pathRCData: Uint16Array = null;
    private m_serachPathIndex: number = 0;

    private m_transEnabled: boolean = true;
    private m_pathSerachEnabled: boolean = true;
    private m_entityIndex: number = 0;
    private m_entities: IToyEntity[] = [];
    private m_transFlag: number = 0;
    private m_calcType: number = 1;
    private m_terrainData: TerrainData = null;

    private static s_aStarFlag: number = 0;
    constructor() {
        super();
    }
    
    initialize(entitiesTotal: number): void {
        if (this.m_total < 1 && this.m_transInputData == null) {
            
            this.m_total = entitiesTotal;
            this.m_transInputData = new Float32Array(entitiesTotal * this.m_dataStepLength);
            this.m_transParamData = new Float32Array(entitiesTotal * this.m_dataStepLength);
            this.m_transOutputData = new Float32Array(entitiesTotal * this.m_dataStepLength);

            this.m_transSTData = new Uint16Array(entitiesTotal);
            this.m_transInputSTData = new Uint16Array(entitiesTotal);
        }
    }
    getTransFS32Data(): Float32Array {
        return this.m_transInputData;
    }

    addEntity(entity: IToyEntity): void {
        if(this.m_entityIndex < this.m_total) {

            entity.setFS32Data(this.getTransFS32Data(), this.m_entityIndex);
            this.m_entities.push(entity);
            this.m_entityIndex ++;
            this.m_matsTotal = this.m_entityIndex * 5;
        }
    }
    getTotal(): number {
        return this.m_total;
    }
    updateEntitiesTrans(): void {
        if (this.isSendTransEnabled()) {
            if (this.m_entities.length > 0) {
                this.sendTransData();
            }
        }
    }
    isSendTransEnabled(): boolean {
        return this.m_transEnabled;
    }
    private m_entityStatusList: number[] = [0,0,0,1];
    private sendTransData(): void {
        if (this.m_transEnabled) {
            this.m_transParamData.set(this.m_transInputData);
            //this.m_transSTData.set(this.m_transInputSTData);
            for (let i: number = 0; i < this.m_entities.length; ++i) {
                this.m_transSTData[i] = this.m_entityStatusList[this.m_entities[i].status];
            }
            let descriptor: any = {flag: this.m_transFlag, calcType: this.m_calcType, allTotal: this.m_total, matsTotal: this.m_matsTotal};
            this.addDataWithParam("car_trans", [this.m_transParamData, this.m_transOutputData, this.m_transSTData], descriptor);
            this.m_transEnabled = false;
            this.m_transFlag = 0;
            this.m_calcType = 0;
            //this.m_transInputSTData.fill(1);
            //console.log("sendTransData success...uid: "+this.getUid(), this.m_matsTotal);
        }
        else {
            console.log("sendTransData failure...");
        }
    }
    
    aStarInitialize(terrData: TerrainData): void {

        if(ToyCarTask.s_aStarFlag == 0 && terrData != null) {
            this.m_terrainData = terrData;
            let descriptor: any = terrData.clone();
            this.addDataWithParam("aStar_init", [descriptor.stvs], descriptor);
            ToyCarTask.s_aStarFlag = 1;
            this.m_pathSearchData = new Uint16Array(512);
            this.m_pathRCData = new Uint16Array(2048);
        }
    }
    /**
     * @param descriptor like: {r0: 1, c0: 1, r1: 4, c1: 3}
     */
    aStarSearch(descriptor: any): void {
        if(this.m_pathSerachEnabled) {
            this.m_pathSerachEnabled = false;
            this.addDataWithParam("aStar_exec", [this.m_pathRCData], descriptor);
            
        }
    }
    searchPath(): void {
        if(this.m_pathSerachEnabled) {
            // 第一个 uint 16 数值存放个数
            let k: number = 1;
            let total: number = 0;
            for (let i: number = 0; i < this.m_entities.length; ++i) {
                if(this.m_entities[i].isReadySearchPath()) {
                    this.m_entities[i].path.searchingPath();
                    let path = this.m_entities[i].path;
                    this.m_pathSearchData[k++] = i;
                    this.m_pathSearchData[k++] = path.r0;
                    this.m_pathSearchData[k++] = path.c0;
                    this.m_pathSearchData[k++] = path.r1;
                    this.m_pathSearchData[k++] = path.c1;
                }
            }
            if(k > 1) {
                this.m_pathSearchData[0] = k / 5;
                this.m_pathSerachEnabled = false;
                console.log("AA have searching path, k: ",k, ", total: ",this.m_pathSearchData[0]);
                this.addDataWithParam("aStar_search", [this.m_pathSearchData, this.m_pathRCData]);
            }
            // else {
            //     console.log("BB no searching path, k: ",k);
            // }
        }
    }
    isAStarEnabled(): boolean {
        return ToyCarTask.s_aStarFlag == 2;
    }
    
    private updateEntityTrans(fs32: Float32Array): void {
        for (let i: number = 0; i < this.m_entities.length; ++i) {
            if(this.m_transSTData[i] < 1) {
                this.m_entities[i].updateTrans(fs32);
            }
        }
    }
    
    private updateEntityPath(): void {
        
        let params = this.m_pathSearchData;
        let pathVS = this.m_pathRCData;
        let total: number = params[0];
        let index: number = 0;
        let k: number = 1;
        let pathDataLen: number = 0;
        let dataLen: number = 0;
        for(let i: number = 0; i < total; ++i) {
            index = params[k];
            pathDataLen = params[k+1] * 2;
            let vs = pathVS.subarray(dataLen, dataLen + pathDataLen);
            this.m_entities[index].searchedPath(vs);
            dataLen += pathDataLen;
            k += 5;
        }
        // for (let i: number = 0; i < this.m_entities.length; ++i) {
        //     this.m_entities[i].updateTrans(fs32);
        // }
    }
    // return true, task finish; return false, task continue...
    parseDone(data: any, flag: number): boolean {
        

        switch(data.taskCmd) {
            case "car_trans":

                this.m_transParamData = data.streams[0];
                this.m_transOutputData = data.streams[1];
                this.m_transSTData = data.streams[2];
                this.updateEntityTrans( this.m_transOutputData );
                this.m_transEnabled = true;
                break;
            case "aStar_search":
                console.log("parseDone XXXX aStar_search...");
                this.m_pathSearchData = data.streams[0];
                this.m_pathRCData = data.streams[1];
                this.updateEntityPath();
                this.m_pathSerachEnabled = true;
                break;
            case "aStar_exec":
                this.m_pathRCData = data.streams[0];
                this.m_pathSerachEnabled = true;
                console.log("parseDone XXXX aStar_exec...");
                this.m_serachPathIndex = 0;
                break;
            case "aStar_init":

                console.log("parseDone XXXX aStar_init...");
                ToyCarTask.s_aStarFlag = 2;
                this.m_pathSerachEnabled = true;
                break;
            default:

                break;
        }
        return true;
    }
    destroy(): void {
        if (this.getUid() > 0) {
            super.destroy();
        }
    }

    getTaskClass(): number {
        return 0;
    }
}
export { ToyCarTask };