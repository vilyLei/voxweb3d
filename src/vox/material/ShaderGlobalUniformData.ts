/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as ShaderUniformProbeT from "../../vox/material/ShaderUniformProbe";
import * as ShaderUniformDataT from "../../vox/material/ShaderUniformData";

import ShaderUniformProbe = ShaderUniformProbeT.vox.material.ShaderUniformProbe;
import ShaderUniformData = ShaderUniformDataT.vox.material.ShaderUniformData;

export namespace vox
{
    export namespace material
    {
        export class ShaderGlobalUniformData extends ShaderUniformData
        {
            constructor()
            {
                super();
                this.always = false;
            }
            slotId:number = 0;
            slotIndex:number = 0;
            slotSize:number = 0;
            locationIndexList:number[] = null;
            locations:any[] = null;
            rst = 0;
            copyDataFromProbe(probe:ShaderUniformProbe):void
            {
                this.types = [];
                this.slotIndex = probe.uniformSlotIndex;
                this.slotSize = probe.uniformSlotSize;
                this.slotId = probe.uniformSlotId;
                for(let i:number = 0; i < probe.uniformSlotSize; ++i)
                {
                    this.types.push( probe.uniformTypes[i] );
                }
            }
            copyDataFromProbeAt(i:number, probe:ShaderUniformProbe):void
            {
                this.types = [];
                this.slotIndex = probe.uniformSlotIndex;
                this.slotSize = probe.uniformSlotSize;
                this.slotId = probe.uniformSlotId;
                //for(let i:number = 0; i < probe.uniformSlotSize; ++i)
                //{
                //    this.types.push( probe.uniformTypes[i] );
                //    this.dataSizeList.push( probe.dataSizeList[i] );
                //}
                this.types.push( probe.uniformTypes[i] );
            }
            destroy():void
            {
                this.types =  null;
                this.slotIndex = -1;
                this.slotSize = 0;
            }
        }
    }
}