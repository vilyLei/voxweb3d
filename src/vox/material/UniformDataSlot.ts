/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

/**
 * 本类作为当前 renderer instance 的共享uniform数据管理类
 */
export default class UniformDataSlot
{
    // one renderer runtime by one UniformDataSlot instance.
    private static s_slots:UniformDataSlot[] = new Array(16);
    private m_total:number = 256;
    private m_uid:number = 0;
    constructor(uid:number)
    {
        this.m_uid = uid;
    }
    getUid():number
    {
        return this.m_uid;
    }
    /**
     * 记录当前的数据序号，不可随意更改
     */
    index:number = 0;
    dataList:Float32Array[] = [];
    flagList:Uint16Array = null;
    static GetSlotAt(i:number):UniformDataSlot
    {
        return UniformDataSlot.s_slots[i];
    }
    static Initialize(rcuid:number):void
    {
        let slot:UniformDataSlot = UniformDataSlot.s_slots[rcuid];
        if(slot == null)
        {
            slot = new UniformDataSlot(rcuid);
            UniformDataSlot.s_slots[rcuid] = slot;
        }
        if(slot.flagList == null)
        {                    
            slot.flagList = new Uint16Array(slot.m_total);
            for(let i:number = 0; i < slot.m_total; ++i)
            {
                slot.dataList.push(null);
                slot.flagList[i] = 0;
            }
        }
    }
}