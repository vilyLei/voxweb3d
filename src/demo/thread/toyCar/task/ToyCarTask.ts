/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
import IThreadSendData from "../../../../thread/base/IThreadSendData";
import ThreadTask from "../../../../thread/control/ThreadTask";
import ThreadSystem from "../../../../thread/ThreadSystem";
import {ToyCarSendData} from "./ToyCarSendData";
import { IToyEntity } from "../base/IToyEntity";

class ToyCarTask extends ThreadTask {
    
    private m_total: number = 0;
    private m_matsTotal: number = 1;
    private m_fs32Data: Float32Array = null;
    private m_enabled: boolean = true;
    private m_entityIndex: number = 0;
    private m_entities: IToyEntity[] = [];
    private m_flag: number = 0;
    constructor() {
        super();
    }
    
    initialize(entitiesTotal: number): void {
        if (this.m_total < 1 && this.m_fs32Data == null) {
            
            this.m_total = entitiesTotal;
            this.m_fs32Data = new Float32Array(entitiesTotal * 16 * 5);
        }
    }
    getFS32Data(): Float32Array {
        return this.m_fs32Data;
    }

    addEntity(entity: IToyEntity): void {
        if(this.m_entityIndex < this.m_total) {

            entity.setFS32Data(this.getFS32Data(), this.m_entityIndex);
            this.m_entities.push(entity);
            this.m_entityIndex ++;
        }
    }
    getTotal(): number {
        return this.m_total;
    }
    updateEntitiesTrans(): void {
        if (this.isSendEnabled()) {
            if (this.m_entities.length > 0) {
                this.sendTransData();
            }
        }
    }
    isSendEnabled(): boolean {
        return this.m_enabled;
    }
    isDataEnabled(): boolean {
        return this.m_enabled;
    }
    
    private sendTransData(): void {
        if (this.m_enabled) {
            let sd: ToyCarSendData = ToyCarSendData.Create();
            sd.taskCmd = "car_trans";
            sd.paramData = this.m_fs32Data;
            sd.param = {flag: this.m_flag, calcType: 1, allTotal: this.m_total, matsTotal: this.m_matsTotal};
            this.addData(sd);
            ThreadSystem.AddData(sd);
            this.m_enabled = false;
            this.m_flag = 1;
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
            index += step;
        }
    }
    // return true, task finish; return false, task continue...
    parseDone(data: any, flag: number): boolean {
        
        this.m_fs32Data = (data.paramData);
        ToyCarSendData.RestoreByUid(data.dataIndex);

        switch(data.taskCmd) {
            case "car_trans":
                //this.updateTrans( this.m_fs32Data );
                this.updateEntityTrans( this.m_fs32Data );
                break;
            case "aStar_exec":
                break;
            case "aStar_init":
                break;
            default:

                break;
        }
        this.m_enabled = true;
        return true;
    }
    getWorkerSendDataAt(i: number): IThreadSendData {
        return null;
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
export { ToyCarSendData, ToyCarTask };