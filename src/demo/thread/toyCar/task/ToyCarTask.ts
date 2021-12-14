/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
import ThreadTask from "../../../../thread/control/ThreadTask";
import { IToyEntity } from "../base/IToyEntity";
import { TerrainData } from "../terrain/TerrainData";

class ToyCarTask extends ThreadTask {
    private m_dataStepLength: number = 16 * 5;
    private m_total: number = 0;
    private m_matsTotal: number = 1;
    private m_transFS32Data: Float32Array = null;
    private m_pathU16Data: Uint16Array = null;
    private m_transEnabled: boolean = true;
    private m_pathSerachEnabled: boolean = true;
    private m_entityIndex: number = 0;
    private m_entities: IToyEntity[] = [];
    private m_transFlag: number = 0;
    private m_terrainData: TerrainData = null;
    private static s_aStarFlag: number = 0;
    constructor() {
        super();
    }
    
    initialize(entitiesTotal: number): void {
        if (this.m_total < 1 && this.m_transFS32Data == null) {
            
            this.m_total = entitiesTotal;
            this.m_transFS32Data = new Float32Array(entitiesTotal * this.m_dataStepLength);
        }
    }
    getTransFS32Data(): Float32Array {
        return this.m_transFS32Data;
    }

    addEntity(entity: IToyEntity): void {
        if(this.m_entityIndex < this.m_total) {

            entity.setFS32Data(this.getTransFS32Data(), this.m_entityIndex);
            this.m_entities.push(entity);
            this.m_entityIndex ++;
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

    private sendTransData(): void {
        if (this.m_transEnabled) {

            let descriptor: any = {flag: this.m_transFlag, calcType: 1, allTotal: this.m_total, matsTotal: this.m_matsTotal};            
            this.addDataWithParam("car_trans", [this.m_transFS32Data], descriptor);
            this.m_transEnabled = false;
            this.m_transFlag = 1;
            //console.log("sendTransData success...uid: "+this.getUid());
        }
        else {
            console.log("sendTransData failure...");
        }
    }
    private updateEntityTrans(fs32: Float32Array): void {

        let step: number = 5 * 16;
        let index: number = 0;
        for (let i: number = 0; i < this.m_entities.length; ++i) {
            this.m_entities[i].updateTrans(fs32, index);
            index += this.m_dataStepLength;
        }
    }
    
    aStarInitialize(terrData: TerrainData): void {
        if(ToyCarTask.s_aStarFlag == 0 && terrData != null) {
            this.m_terrainData = terrData;
            let descriptor: any = terrData.clone();
            this.addDataWithParam("aStar_init", [descriptor.stvs], descriptor);
            ToyCarTask.s_aStarFlag = 1;
            this.m_pathU16Data = new  Uint16Array(1024);
        }
    }
    /**
     * @param descriptor like: {r0: 1, c0: 1, r1: 4, c1: 3}
     */
    aStarSearch(descriptor: any): void {
        if(this.m_pathSerachEnabled) {
            this.m_pathSerachEnabled = false;
            this.addDataWithParam("aStar_exec", [this.m_pathU16Data], descriptor);
            
        }
    }
    isAStarEnabled(): boolean {
        return ToyCarTask.s_aStarFlag == 2;
    }
    // return true, task finish; return false, task continue...
    parseDone(data: any, flag: number): boolean {
        

        switch(data.taskCmd) {
            case "car_trans":

                this.m_transFS32Data = data.streams[0];
                this.updateEntityTrans( this.m_transFS32Data );
                this.m_transEnabled = true;
                break;
            case "aStar_exec":
                this.m_pathU16Data = data.streams[0];
                this.m_pathSerachEnabled = true;
                console.log("XXXX aStar_exec...");
                break;
            case "aStar_init":

                console.log("XXXX aStar_init...");
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