/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

export namespace vox
{
    export namespace render
    {
        /**
         * 管理gpu资源的引用情况
         */
        export class TextureGpuUidStore
        {
            private m_useidList:number[] = [];
            private m_removeidList:number[] = [];
            constructor()
            {
            }
            attachTexAt(index:number):void
            {
                if(index < this.m_useidList.length)
                {
                    ++this.m_useidList[index];
                }
                else
                {
                    let i:number = this.m_useidList.length;
                    for(; i <= index; ++i)
                    {
                        this.m_useidList.push(0);
                    }
                    ++this.m_useidList[index];
                }
                //console.log("TextureGpuUidStore::attachTexAt() this.m_useidList["+index+"]: "+this.m_useidList[index]);
            }
            detachTexAt(index:number):void
            {
                --this.m_useidList[index];
                if(this.m_useidList[index] < 1)
                {
                    this.m_useidList[index] = 0;
                    //console.log("TextureGpuUidStore::detachTexAt("+index+") tex useCount value is 0.");
                    this.m_removeidList.push(index);
                }
            }
            getAttachCountAt(index:number):number
            {
                if(index < this.m_useidList.length)
                {
                    return this.m_useidList[index];
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
            private m_timeDelay:number = 11;
            disposeTest(remvedUids:number[]):number
            {
                --this.m_timeDelay;
                let total:number = 0;
                if(this.m_timeDelay < 1)
                {
                    this.m_timeDelay = 11;

                    if(this.m_removeidList.length > 0)
                    {
                        let list:number[] = this.m_removeidList;
                        let len:number = list.length;
                        let i:number = 0;
                        let puid:number = 0;
                        let testTotal:number = Math.min(remvedUids.length,list.length);
                        for(; i < testTotal; ++i)
                        {
                            if(len > 0)
                            {
                                puid = list.pop();
                                --len;
                                if(this.getAttachCountAt(puid) < 1)
                                {
                                    // for dispose txture gpu res;
                                    remvedUids[total++] = puid;
                                }
                            }
                            else
                            {
                                break;
                            }
                        }
                    }
                }
                return total;
            }
        }
    }
}