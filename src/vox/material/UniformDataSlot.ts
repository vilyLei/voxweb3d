/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

/**
 * 本类作为当前 renderer instance 的共享uniform数据管理类
 */
class UniformDataSlot {
    // one renderer runtime by one UniformDataSlot instance.
    //private static s_slots: UniformDataSlot[] = new Array(16);
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
    dataList: Float32Array[] = null;//[];
    flagList: Uint16Array = null;
    // // static GetSlotAt(i: number): UniformDataSlot {
    // //     return UniformDataSlot.s_slots[i];
    // // }
    // static Initialize(rcuid: number): void {
    //     let slot: UniformDataSlot = UniformDataSlot.s_slots[rcuid];
    //     if (slot == null) {
    //         slot = new UniformDataSlot(rcuid);
    //         UniformDataSlot.s_slots[rcuid] = slot;
    //     }
    //     if (slot.flagList == null) {
    //         slot.flagList = new Uint16Array(slot.m_total);
    //         for (let i: number = 0; i < slot.m_total; ++i) {
    //             slot.dataList.push(null);
    //             slot.flagList[i] = 0;
    //         }
    //     }
    // }
}
export { UniformDataSlot }