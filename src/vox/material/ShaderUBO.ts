/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import RenderProxy from "../../vox/render/RenderProxy";
import ShdProgram from "../../vox/material/ShdProgram";

export default class ShaderUBO
{
    private static s_uid:number = 0;
    private m_uid:number = -1;
    private m_uboNS:string = "";
    private m_bindingIndex:number = -1;
    private m_dataFloatsCount:number = 4;
    private m_uboBuf:any = null;
    constructor()
    {
        this.m_uid = ShaderUBO.s_uid++
    }
    private m_dataArray:Float32Array = null;
    private m_changed:boolean = true;

    private m_externalArrIndexList:number[] = null;
    private m_externalArrList:Float32Array[] = null;
    getUid():number
    {
        return this.m_uid;
    }
    getBindingIndex():number
    {
        return this.m_bindingIndex;
    }
    getUBOBuffer():any
    {
        return this.m_uboBuf;
    }
    initializeWithDataFloatsCount(rc:RenderProxy, uniform_block_ns:string, bindingIndex:number, dataFloatsCount:number):void
    {
        if(this.m_dataArray == null && this.m_uboBuf == null)
        {
            this.m_uboNS = uniform_block_ns;
            this.m_bindingIndex = bindingIndex;
            this.m_dataFloatsCount = dataFloatsCount;
            
            this.m_dataArray = new Float32Array(this.m_dataFloatsCount);
        
            this.m_uboBuf = rc.createUBOBufferByDataArray(this.m_dataArray);
        }
    }    
    initializeWithFloatData(uniform_block_ns:string,bindingIndex:number,dataFloatArr:Float32Array):void
    {
        if(this.m_dataArray == null)
        {
            this.m_uboNS = uniform_block_ns;
            this.m_bindingIndex = bindingIndex;
            this.m_dataFloatsCount = dataFloatArr.length;
            
            this.m_dataArray = dataFloatArr;
        }
    }
    setData4At(dataIndex:number,pa:number,pb:number,pc:number,pd:number):void
    {
        this.m_dataArray[dataIndex] = pa;
        this.m_dataArray[dataIndex+1] = pb;
        this.m_dataArray[dataIndex+2] = pc;
        this.m_dataArray[dataIndex+3] = pd;
        this.m_changed = true;
    }
    setData3At(dataIndex:number,pa:number,pb:number,pc:number):void
    {
        this.m_dataArray[dataIndex] = pa;
        this.m_dataArray[dataIndex+1] = pb;
        this.m_dataArray[dataIndex+2] = pc;
        this.m_changed = true;
    }
    setData2At(dataIndex:number,pa:number,pb:number):void
    {
        this.m_dataArray[dataIndex] = pa;
        this.m_dataArray[dataIndex+1] = pb;
        this.m_changed = true;
    }
    setDataAt(dataIndex:number,pa:number):void
    {
        this.m_dataArray[dataIndex] = pa;
        this.m_changed = true;
    }
    
    setSubDataArrAt(dataIndex:number,dataArray:Float32Array):void
    {
        if(this.m_externalArrList == null)
        {
            this.m_externalArrIndexList = [];
            this.m_externalArrList = [];
        }
        this.m_externalArrIndexList.push(dataIndex);
        this.m_externalArrList.push(dataArray);
        this.m_changed = true;
    }
    setDataChanged(boo:boolean):void
    {
        this.m_changed = boo;
    }
    getDataArray():Float32Array
    {
        return this.m_dataArray;
    }
    updateData(rc:RenderProxy):void
    {
        if(this.m_changed)
        {
            if(this.m_externalArrList != null)
            {
                let len:number = this.m_externalArrList.length - 1;
                while(len > -1)
                {
                    this.m_dataArray.set(this.m_externalArrList[len],this.m_externalArrIndexList[len]);
                    this.m_externalArrIndexList.pop();
                    this.m_externalArrList.pop();
                    --len;
                }
            }
            if(this.m_uboBuf != null)
            {
                rc.bindUBOBuffer(this.m_uboBuf);
                rc.bufferDataUBOBuffer(this.m_dataArray);
            }
            else
            {
                this.m_uboBuf = rc.createUBOBufferByDataArray(this.m_dataArray);
            }
            this.m_changed = false;
        }
    }
    bindUBOBuffer(rc:RenderProxy):void
    {
        rc.bindBufferBaseUBOBuffer(this.m_bindingIndex, this.m_uboBuf);
    }
    run(rc:RenderProxy):void
    {
        if(this.m_changed)
        {
            if(this.m_externalArrList != null)
            {
                let len:number = this.m_externalArrList.length - 1;
                while(len > -1)
                {
                    this.m_dataArray.set(this.m_externalArrList.pop(), this.m_externalArrIndexList.pop());
                    --len;
                }
            }
            if(this.m_uboBuf != null)
            {
                rc.bindUBOBuffer(this.m_uboBuf);
                rc.bufferDataUBOBuffer(this.m_dataArray);
            }
            else
            {
                this.m_uboBuf = rc.createUBOBufferByDataArray(this.m_dataArray);
            }
            this.m_changed = false;
        }
        rc.bindBufferBaseUBOBuffer(this.m_bindingIndex, this.m_uboBuf);
    }
    destroy(rc:RenderProxy):void
    {
        this.m_bindingIndex = -1;
        this.m_dataArray = null;        
        this.m_externalArrIndexList = null;
        this.m_externalArrList = null;
    
        if(this.m_uboBuf != null)
        {
            rc.deleteUBOBuffer(this.m_uboBuf);
            this.m_uboBuf = null;
        }
    }
}

export class ShaderUBOBuilder
{
    
    // record uniform block binding index and uniform block name
    private static s_uboBindingNSMap:Map<string,number> = new Map();
    private static s_uboBindingPosListTotal:number = 0;
    private static s_uboBindingPosList:Uint8Array = new Uint8Array(256);

    static GetBindingIndexByNS(uniform_block_ns:string):number
    {
        if(ShaderUBOBuilder.s_uboBindingNSMap.has(uniform_block_ns))
        {
            return ShaderUBOBuilder.s_uboBindingNSMap.get(uniform_block_ns);
        }
        let index:number = ShaderUBOBuilder.s_uboBindingPosListTotal;
        ShaderUBOBuilder.s_uboBindingPosList[index] = 31;
        ++ShaderUBOBuilder.s_uboBindingPosListTotal;
        ShaderUBOBuilder.s_uboBindingNSMap.set(uniform_block_ns,index);
        return index;
    }
    static CreateBindingIndexByNS(uniform_block_ns:string,shdProgram:ShdProgram):number
    {
        if(ShaderUBOBuilder.s_uboBindingNSMap.has(uniform_block_ns))
        {
            return ShaderUBOBuilder.s_uboBindingNSMap.get(uniform_block_ns);
        }
        let index:number = ShaderUBOBuilder.s_uboBindingPosListTotal;
        ShaderUBOBuilder.s_uboBindingPosList[index] = 31;
        ++ShaderUBOBuilder.s_uboBindingPosListTotal;
        ShaderUBOBuilder.s_uboBindingNSMap.set(uniform_block_ns,index);
        shdProgram.uniformBlockBinding(uniform_block_ns, index);        
        return index;
    }
    static BindingIndexEnabledByNS(uniform_block_ns:string):boolean
    {
        return ShaderUBOBuilder.s_uboBindingNSMap.has(uniform_block_ns);
    }
    static CreateUBOWithDataFloatsCount(rc:RenderProxy, uniform_block_ns:string,shdProgram:ShdProgram,dataFloatsCount:number):ShaderUBO
    {
        let ubo:ShaderUBO = new ShaderUBO();
        let bindingIndex:number = ShaderUBOBuilder.CreateBindingIndexByNS(uniform_block_ns,shdProgram);
        ubo.initializeWithDataFloatsCount(rc, uniform_block_ns,bindingIndex,dataFloatsCount);
        return ubo;
    }
    static CreateUBOWithFloatData(uniform_block_ns:string,shdProgram:ShdProgram,dataFloatArr:Float32Array):ShaderUBO
    {
        let ubo:ShaderUBO = new ShaderUBO();
        let bindingIndex = ShaderUBOBuilder.CreateBindingIndexByNS(uniform_block_ns,shdProgram);
        ubo.initializeWithFloatData(uniform_block_ns,bindingIndex,dataFloatArr);
        return ubo;
    }
}