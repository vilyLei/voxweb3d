/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import { PathSerachListener } from "./PathSerachListener";

class TerrainNavigation implements PathSerachListener{

    // 存放请求寻路的信息数据
    private m_pathSearchData: Uint16Array = null;
    // 存放寻路结果
    private m_pathData: Uint16Array = null;
    private m_index: number = 0;
    private m_total: number = 0;

    initialize(): void {        
        this.m_pathSearchData = new Uint16Array(1024 * 2);
        this.m_pathData = new Uint16Array(1024 * 4);
    }
    reset(): void {
        this.m_index = 0;
        this.m_total = 0;
        this.m_pathSearchData[0] = this.m_total;
    }
    
    setSearchPathParamAt(i: number, r0: number, c0: number, r1: number, c1: number): void {

        this.m_total = i + 1;

        i = 1 + i * 5;
        let vs = this.m_pathSearchData;
        vs[i] = i;
        vs[i+1] = r0;
        vs[i+2] = c0;
        vs[i+3] = r1;
        vs[i+4] = c1;
        
    }
    getSearchPathData(): Uint16Array[] {
        if(this.m_total > 0) {
            this.m_pathSearchData[0] = this.m_total;
            this.m_total = 0;
            let streams = [this.m_pathSearchData, this.m_pathData];
            return streams;
        }
        return null;
    }
    receiveSearchedPathData(streams: Uint16Array[]): void {
        this.m_pathSearchData = streams[0];
        this.m_pathData = streams[1];
        this.updateEntityPath();
    }
    
    private updateEntityPath(): void {
        
        let params = this.m_pathSearchData;
        let pathVS = this.m_pathData;
        let total: number = params[0];
        let index: number = 0;
        let k: number = 1;
        let pathDataLen: number = 0;
        let dataLen: number = 0;
        for(let i: number = 0; i < total; ++i) {
            index = params[k];
            pathDataLen = params[k+1] * 2;
            let vs = pathVS.subarray(dataLen, dataLen + pathDataLen);
            console.log("TerrainNavigation::updateEntityPath(), vs: ",vs);
            //this.m_entities[index].searchedPath(vs);
            dataLen += pathDataLen;
            k += 5;
        }
    }
}
export { TerrainNavigation };