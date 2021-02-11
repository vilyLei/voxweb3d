/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

export namespace vox
{
    export namespace utils
    {
        export class IndexBuilder
        {
            //  private static S_FLAG_BUSY:number = 1;
            //  private static S_FLAG_FREE:number = 0;

            private static m_nodeListLen:number = 0;
            private static m_nodeFlagList:number[] = [];
            private static m_freeIdList:number[] = [];
            
            static GetFreeId():number
            {
                if(IndexBuilder.m_freeIdList.length > 0)
                {
                    return IndexBuilder.m_freeIdList.pop();
                }
                return -1; 
            }

            static Create():number
            {
                let index:number = IndexBuilder.GetFreeId();
                if(index >= 0)
                {
                    IndexBuilder.m_nodeFlagList[index] = 1;
                }
                else
                {
                    IndexBuilder.m_nodeFlagList.push(1);
                    index = IndexBuilder.m_nodeListLen;
                    IndexBuilder.m_nodeListLen++;
                }
                return index;
            }
            static Restore(pindex:number):void
            {
                if(pindex >=0 && IndexBuilder.m_nodeFlagList[pindex] == 1)
                {
                    IndexBuilder.m_freeIdList.push(pindex);
                    IndexBuilder.m_nodeFlagList[pindex] = 0;
                }
            }
        }
    }
}