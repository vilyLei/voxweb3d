/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

export default class ROVtxBufUidStore
{
    private m_useidList:number[] = [];
    private m_removeidList:number[] = [];
    private static s_ins:ROVtxBufUidStore = null;
    constructor()
    {
        if(ROVtxBufUidStore.s_ins != null)
        {
            throw Error("ROVtxBufUidStore is a singleton class!!");
        }
        ROVtxBufUidStore.s_ins = this;
    }
    static GetInstance():ROVtxBufUidStore
    {
        return ROVtxBufUidStore.s_ins;
    }
    __$getRemovedListLen():number
    {
        return this.m_removeidList.length;
    }
    __$getRemovedList():number[]
    {
        return this.m_removeidList;
    }
    __$attachAt(index:number):void
    {
        if(index < this.m_useidList.length)
        {
            ++this.m_useidList[index];
        }
        else
        {
            // 这里的内存管理需要优化
            let i:number = this.m_useidList.length;
            for(; i <= index; ++i)
            {
                this.m_useidList.push(0);
            }
            ++this.m_useidList[index];
        }
        //console.log("ROVtxBufUidStore::__$attachAt() list["+index+"]: "+this.m_useidList[index]);
    }
    __$detachAt(index:number):void
    {
        --this.m_useidList[index];
        //console.log("ROVtxBufUidStore::__$detachAt() list["+index+"]: "+this.m_useidList[index]);
        if(this.m_useidList[index] < 1)
        {
            this.m_useidList[index] = 0;
            console.log("ROVtxBufUidStore::__$detachAt("+index+") tex useCount value is 0.");
            this.m_removeidList.push(index);
        }
    }
    getAttachCountAt(uid:number):number
    {
        if(uid < this.m_useidList.length)
        {
            return this.m_useidList[uid];
        }
        return 0;
    }
    getAttachAllCount():number
    {
        let total:number = 0;
        let i:number = 0;
        let len:number = this.m_useidList.length;
        for(; i < len; ++i)
        {
            if(this.m_useidList[i] > 0)
            {
                total += this.m_useidList[i];
            }
        }
        return total;
    }
}