/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

/**
 * 本类作为当前 renderer instance 的共享 uniform 数据管理类
 */
class UniformDataSlot {
    private m_total: number = 256;
    private m_rcuid: number = 0;
    constructor(rcuid: number, total: number = 256) {

        this.m_rcuid = rcuid;
        this.m_total = total;
        
        this.flagList = new Uint16Array(this.m_total);
        this.dataList = new Array(this.m_total);
        for (let i: number = 0; i < this.m_total; ++i) {
            this.dataList[i] = null;
            this.flagList[i] = 0;
        }
    }
    /**
     * @returns return renderer context unique id
     */
    getRCUid(): number {
        return this.m_rcuid;
    }
    /**
     * 记录当前的数据序号，不可随意更改
     */
    index: number = 0;
    dataList: Float32Array[] = null;
    flagList: Uint16Array = null;
}
export { UniformDataSlot }