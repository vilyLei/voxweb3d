/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// 渲染运行时buffer相关的操作

import * as IVtxShdCtrT from "../../vox/material/IVtxShdCtr";
import IVtxShdCtr = IVtxShdCtrT.vox.material.IVtxShdCtr;

export namespace vox
{
    export namespace render
    {
        export interface IBufferBuilder
        {
            createBuf():any;
            deleteBuf(buf:any):void;
            bindArrBuf(buf:any):void;
            bindEleBuf(buf:any):void;
            arrBufSubData(float32Arr:Float32Array, offset:number):void;
            arrBufData(float32Arr:Float32Array, usage:number):void;
            eleBufSubData(uintDataArr:Uint16Array|Uint32Array, offset:number):void;
            eleBufData(uintDataArr:Uint16Array|Uint32Array, usage:number):void;
            arrBufDataMem(bytesSize:number, usage:number):void;
            eleBufDataMem(bytesSize:number, usage:number):void;
            useVtxAttribsPtrTypeFloat(shdp:IVtxShdCtr, buf:any,attribTypes:number[],attribTypesLen:number, wholeOffsetList:number[],wholeStride:number):void;
            useVtxAttribsPtrTypeFloatMulti(shdp:IVtxShdCtr, bufs:any[],attribTypes:number[],attribTypesLen:number, wholeOffsetList:number[],wholeStride:number):void;
            bindVertexArray(vao:any):any;
            deleteVertexArray(vao:any):void;
        }

    }
}
