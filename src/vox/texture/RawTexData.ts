/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as ITexDataT from "../../vox/texture/ITexData";

import ITexData = ITexDataT.vox.texture.ITexData;
export namespace vox
{
    export namespace texture
    {
        export class RawTexData implements ITexData
        {
            private static s_list:RawTexData[] = [];
            width:number = 0;
            height:number = 0;
            data:Uint8Array | Uint16Array | Float32Array = null;
            miplevel:number = 0;
            // 0表示 更新纹理数据而不会重新开辟空间, 1表示需要重新开辟空间并更新纹理数据, -1表示不需要更新
            status:number = 1;
            offsetx:number = 0;
            offsety:number = 0;
            constructor()
            {
            }
            updateToGpu(gl:any,samplerTarget:number,interType:number,format:number, type:number):void
            {
                if(this.status == 1)
                {
                    gl.texImage2D(samplerTarget, this.miplevel, interType,this.width,this.height,0,format, type, this.data);
                }
                else if(this.status == 0)
                {
                    gl.texSubImage2D(samplerTarget, this.miplevel, this.offsetx, this.offsety,this.width, this.height, format, type, this.data);
                }
                this.status = -1;
            }
            static Create():RawTexData
            {
                if(RawTexData.s_list.length > 0)
                {
                    return RawTexData.s_list.pop();
                }
                return new RawTexData();
            }
            static Restore(tsd:RawTexData):void
            {
                if(tsd != null)
                {
                    tsd.data = null;
                    RawTexData.s_list.push(tsd);
                }
            }
        }
    }
}