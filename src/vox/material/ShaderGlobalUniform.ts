/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as RenderDataSlotT from "../../vox/material/UniformDataSlot";
import * as RendererDevieceT from "../../vox/render/RendererDeviece";
import * as ShaderUniformProbeT from "../../vox/material/ShaderUniformProbe";
import * as ShaderUniformT from "../../vox/material/ShaderUniform";
import * as IRenderShaderT from "../../vox/render/IRenderShader";

import UniformDataSlot = RenderDataSlotT.vox.material.UniformDataSlot;
import ShaderUniformProbe = ShaderUniformProbeT.vox.material.ShaderUniformProbe;
import RendererDeviece = RendererDevieceT.vox.render.RendererDeviece;
import ShaderUniform = ShaderUniformT.vox.material.ShaderUniform;
import IRenderShader = IRenderShaderT.vox.render.IRenderShader;

export namespace vox
{
    export namespace material
    {
        export class ShaderGlobalUniform extends ShaderUniform
        {
            constructor()
            {
                super();
                this.always = false;
            }
            slotId:number = 0;
            slotIndex:number = 0;
            slotSize:number = 0;
            //types:number[] = null;
            locationIndexList:number[] = null;
            //uniformNameList:string[] = null;
            locations:any[] = null;
            //dataSizeList:number[] = null;
            //always = false;
            rst = 0;
            // for mult uniform data src, for example: camera, lightGroup
            //next:ShaderGlobalUniform = null;
            //
            copyDataFromProbe(probe:ShaderUniformProbe):void
            {
                this.types = [];
                this.dataSizeList = [];
                this.slotIndex = probe.uniformSlotIndex;
                this.slotSize = probe.uniformSlotSize;
                this.slotId = probe.uniformSlotId;
                for(let i:number = 0; i < probe.uniformSlotSize; ++i)
                {
                    this.types.push( probe.uniformTypes[i] );
                    this.dataSizeList.push( probe.dataSizeList[i] );
                }
            }
            copyDataFromProbeAt(i:number, probe:ShaderUniformProbe):void
            {
                this.types = [];
                this.dataSizeList = [];
                this.slotIndex = probe.uniformSlotIndex;
                this.slotSize = probe.uniformSlotSize;
                this.slotId = probe.uniformSlotId;
                this.types.push( probe.uniformTypes[i] );
                this.dataSizeList.push( probe.dataSizeList[i] );
            }
            use(rc:IRenderShader):void
            {
                var slot:UniformDataSlot = UniformDataSlot.SlotList[this.slotId];
                if(this.always || this.rst != slot.flagList[this.slotIndex])
                {
                    this.rst = slot.flagList[this.slotIndex];
                    let i:number = 0;
                    if(RendererDeviece.IsWebGL1())
                    {
                        for(; i < this.slotSize; ++i)
                        {
                            rc.useUniformV1(this.locations[i],this.types[i],slot.dataList[this.slotIndex + i],this.dataSizeList[i]);
                        }
                    }
                    else
                    {
                        for(; i < this.slotSize; ++i)
                        {
                            rc.useUniformV2(this.locations[i],this.types[i],slot.dataList[this.slotIndex + i],this.dataSizeList[i],0);
                        }
                    }
                }
            }
            destroy():void
            {
                this.types =  null;
                this.dataSizeList = null;
                this.slotIndex = -1;
                this.slotSize = 0;
            }
        }
    }
}