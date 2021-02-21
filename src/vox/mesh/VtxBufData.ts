/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
/**
 * 分块上传用于节省内存，而直接使用显存: 从源数据直接上传到显存
*/
export namespace vox
{
    export namespace mesh
    {
        export class VtxBufData
        {
            private m_indexList:any[] = [];
            private m_attriList:any[] = null;
            private m_attriBytesList:any[] = null;
            private m_attriStepsList:any[] = null;
            private m_attriTotalList:any[] = null;
            private m_attriLenTotalList:any[] = null;

            private m_indexBytesTotal:number = 0;
            private m_indexLengthsTotal:number = 0;
            private m_attributesTotal:number = 0;
            constructor(attributesTotal:number)
            {
                this.m_attributesTotal = attributesTotal;
                this.m_attriList = new Array(attributesTotal);
                this.m_attriBytesList = new Array(attributesTotal);
                this.m_attriStepsList = new Array(attributesTotal);
                this.m_attriTotalList = new Array(attributesTotal);
                this.m_attriLenTotalList = new Array(attributesTotal);
                this.m_attriBytesList.fill(0);
                this.m_attriStepsList.fill(0);
                this.m_attriTotalList.fill(0);
                this.m_attriLenTotalList.fill(0);
                for(let i:number = 0; i < this.m_attributesTotal; ++i)
                {
                    this.m_attriList[i] = [];
                }
            }
            addAttributeDataAt(attributeIndex:number,f32Data:any, step:number):void
            {
                this.m_attriList[attributeIndex].push(f32Data);
                this.m_attriBytesList[attributeIndex] += f32Data.byteLength;
                this.m_attriStepsList[attributeIndex] = step;
                this.m_attriTotalList[attributeIndex] += 1;
                this.m_attriLenTotalList[attributeIndex] += f32Data.length;
            }
            addAttributeDataStepAt(attributeIndex:number):number
            {
                return this.m_attriStepsList[attributeIndex];
            }
            getVerticesTotal():number
            {
                return this.m_attriLenTotalList[0]/this.m_attriStepsList[0];
            }
            getAttributesTotal():number
            {
                return this.m_attriList.length;
            }
            getAttributeDataAt(attributeIndex:number,dataIndex:number):any
            {
                return this.m_attriList[attributeIndex][dataIndex];
            }
            getAttributeDataTotalAt(attributeIndex:number):number
            {
                return this.m_attriTotalList[attributeIndex];
            }
            getAttributeDataTotalBytesAt(attributeIndex:number):number
            {
                return this.m_attriBytesList[attributeIndex];
            }
            getAttributeStepAt(attributeIndex:number):number
            {
                return this.m_attriStepsList[attributeIndex];
            }
            addIndexData(indexbufferArr:any):void
            {
                this.m_indexBytesTotal += indexbufferArr.byteLength;
                this.m_indexLengthsTotal += indexbufferArr.length;
                this.m_indexList.push(indexbufferArr);
            }
            getIndexDataTotal():number
            {
                return this.m_indexList.length;
            }
            getIndexDataLengthTotal():number
            {
                return this.m_indexLengthsTotal;
            }
            getTrianglesTotal():number
            {
                return this.m_indexLengthsTotal/3;
            }
            getIndexDataAt(i:number):any
            {
                return this.m_indexList[i];
            }
            getIndexDataTotalBytes():number
            {
                return this.m_indexBytesTotal;
            }
            destroy():void
            {
                if(this.m_indexList != null)
                {
                    let j:number = 0;
                    let len:number = 0;
                    let list:any[] = null;
                    for(let i:number = 0; i < this.m_attributesTotal; ++i)
                    {
                        list = this.m_attriList[i];
                        len = list.length;
                        for(j = 0; j < len; ++j)
                        {
                            list[j] = null;
                        }
                        this.m_attriList[i] = null;
                    }
    
                    list = this.m_indexList;
                    len = list.length;
                    for(j = 0; j < len; ++j)
                    {
                        list[j] = null;
                    }
                    this.m_indexList = null;
                }
            }
            
        }
    }
}