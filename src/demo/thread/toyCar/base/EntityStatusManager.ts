/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import { NavigationStatus } from "../../../../voxnav/tileTerrain/NavigationStatus";
import { IToyEntity } from "./IToyEntity";
class EntityStatusManager {
    private m_statusList: number[] = [0,2,2,0];
    private m_statusData: Uint16Array = null;
    constructor() {
    }
    initialize(total: number): void {
        this.m_statusData = new Uint16Array(total);
    }
    updateEntityStatus(entities: IToyEntity[]): void {        
        for (let i: number = 0; i < entities.length; ++i) {
            this.m_statusData[i] = this.m_statusList[entities[i].getStatus()];
        }
        //console.log("this.m_statusData: ",this.m_statusData);
    }
    isEnabledAt(i: number): boolean {
        return this.m_statusData[i] > 1;
    }
    setStatusData(statusData: Uint16Array): void {
        this.m_statusData = statusData;
    }
    getStatusData(): Uint16Array {
        return this.m_statusData;
    }
}
export {EntityStatusManager}