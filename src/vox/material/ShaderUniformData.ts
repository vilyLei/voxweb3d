/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as ShaderUniformProbeT from "../../vox/material/ShaderUniformProbe";

import ShaderUniformProbe = ShaderUniformProbeT.vox.material.ShaderUniformProbe;

export namespace vox
{
    export namespace material
    {
        export class ShaderUniformData
        {
            constructor()
            {
            }
            types:number[] = null;
            uniformSize:number = 0;
            uniformNameList:string[] = null;
            locations:any[] = null;
            dataSizeList:number[] = null;
            dataList:Float32Array[] = null;
            calcModels:any[] = null;
            always:boolean = true;
            next:ShaderUniformData = null;
            // for fast data's operation
            getDataRefFromUniformName(ns:string):Float32Array
            {
                if(this.uniformNameList != null)
                {
                    let list = this.uniformNameList;
                    let len = list.length;
                    for(let i = 0; i < len; ++i)
                    {
                        if(ns == list[i])
                        {
                            return this.dataList[i];
                        }
                    }
                }
                return null;
            }
            // for fast data's operation
            setDataRefFromUniformName(ns:string,dataRef:Float32Array):void
            {
                if(this.uniformNameList != null)
                {
                    let list = this.uniformNameList;
                    let len = list.length;
                    for(let i = 0; i < len; ++i)
                    {
                        if(ns == list[i])
                        {
                            this.dataList[i] = dataRef;
                            break;
                        }
                    }
                }
            }
            //
            copyDataFromProbe(probe:ShaderUniformProbe):void
            {
                this.types = [];
                this.dataSizeList = [];
                for(let i = 0; i < probe.uniformSlotSize; ++i)
                {
                    this.types.push( probe.uniformTypes[i] );
                    this.dataSizeList.push( probe.dataSizeList[i] );
                }
                this.uniformSize = probe.uniformSlotSize;
            }
            destroy():void
            {
                let i:number = 0;
                let len:number = this.dataList.length;
                for(; i < len; ++i)
                {
                    this.dataList[i] = null;
                }
                if(this.calcModels != null)
                {
                    len = this.calcModels.length;
                    for(i = 0; i < len; ++i)
                    {
                        this.calcModels[i].destroy();
                        this.calcModels[i] = null;
                    }
                }
                this.dataList = null;
                this.types = null;
                this.locations = null;
                this.dataSizeList = null;
                this.calcModels = null;
            }
        }
    }
}