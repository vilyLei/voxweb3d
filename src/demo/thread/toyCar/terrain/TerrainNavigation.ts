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
    
    initialize(): void {        
        this.m_pathSearchData = new Uint16Array(1024 * 2);
        this.m_pathData = new Uint16Array(1024 * 4);
    }
    getSearchPathData(): Uint16Array[] {
        return [];
    }
    setSearchedPathData(streams: Uint16Array[]): void {

    }
}
export { TerrainNavigation };