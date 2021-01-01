/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

//  import * as RenderProxyT from "../../vox/render/RenderProxy";
//  import RenderProxy = RenderProxyT.vox.render.RenderProxy;

export namespace vox
{
    export namespace mesh
    {
        export class ROVtxBufUidStore
        {
            private m_useidList:number[] = [];
            private m_removeidList:number[] = [];
            private static s_ins:ROVtxBufUidStore = new ROVtxBufUidStore();
            private constructor()
            {
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
                    let i:number = this.m_useidList.length;
                    for(; i <= index; ++i)
                    {
                        this.m_useidList.push(0);
                    }
                    ++this.m_useidList[index];
                }
                //console.log("ROVtxBufUidStore::__$attachAt() this.m_useidList["+index+"]: "+this.m_useidList[index]);
            }
            __$detachAt(index:number):void
            {
                --this.m_useidList[index];
                console.log("ROVtxBufUidStore::__$detachAt() this.m_useidList["+index+"]: "+this.m_useidList[index]);
                if(this.m_useidList[index] < 1)
                {
                    this.m_useidList[index] = 0;
                    console.log("ROVtxBufUidStore::__$detachAt("+index+") tex useCount value is 0.");
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
                        //++total;
                        total += this.m_useidList[i];
                    }
                }
                return total;
            }
        }
    }
}