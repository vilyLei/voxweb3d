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
            slotId:number = 0;
            slotIndex:number = 0;
            uniformsTotal:number = 0;
            locationIndexList:number[] = null;
            locations:any[] = null;

            rst:number = 0;
            constructor()
            {
                super();
                this.always = false;
            }
            // for multi uniforms data src, for example: camera, lightGroup
            copyDataFromProbe(probe:ShaderUniformProbe):void
            {
                this.types = probe.uniformTypes.slice(0);
                this.dataSizeList = probe.dataSizeList.slice(0);
                this.slotIndex = probe.getSlotBeginIndex();
                this.uniformsTotal = probe.uniformsTotal;
                this.slotId = probe.getSlotUid();
            }
            copyDataFromProbeAt(i:number, probe:ShaderUniformProbe):void
            {
                if(this.types == null)
                {
                    this.types = [];
                    this.dataSizeList = [];
                }
                this.slotIndex = probe.getSlotBeginIndex();
                this.uniformsTotal = probe.uniformsTotal;
                this.slotId = probe.getSlotUid();
                this.types[i] = probe.uniformTypes[i];
                this.dataSizeList[i] = probe.dataSizeList[i];
            }
            use(rc:IRenderShader):void
            {
                let slot:UniformDataSlot = UniformDataSlot.GetSlotAt(rc.getRCUid());
                if(this.always || this.rst != slot.flagList[this.slotIndex])
                {
                    this.rst = slot.flagList[this.slotIndex];
                    let i:number = 0;
                    if(RendererDeviece.IsWebGL1())
                    {
                        for(; i < this.uniformsTotal; ++i)
                        {
                            rc.useUniformV1(this.locations[i],this.types[i],slot.dataList[this.slotIndex + i],this.dataSizeList[i]);
                        }
                    }
                    else
                    {
                        for(; i < this.uniformsTotal; ++i)
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
                this.uniformsTotal = 0;
            }
        }
    }
}