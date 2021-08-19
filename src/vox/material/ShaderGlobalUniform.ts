/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import UniformDataSlot from "../../vox/material/UniformDataSlot";
import RendererDeviece from "../../vox/render/RendererDeviece";
import ShaderUniformProbe from "../../vox/material/ShaderUniformProbe";
import ShaderUniform from "../../vox/material/ShaderUniform";
import IRenderShader from "../../vox/render/IRenderShader";

export default class ShaderGlobalUniform extends ShaderUniform
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
    clone(): ShaderGlobalUniform {

        let guniform: ShaderGlobalUniform = new ShaderGlobalUniform();        
        guniform.types = this.types.slice(0);
        guniform.uniformNameList = this.uniformNameList.slice(0);
        guniform.dataSizeList = this.dataSizeList.slice(0);
        guniform.slotIndex = this.slotIndex;
        guniform.uniformsTotal = this.uniformsTotal;
        guniform.slotId = this.slotId;
        guniform.always = this.always;
        guniform.rst = this.rst;
        return guniform;
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
        this.slotIndex = probe.getSlotBeginIndex() + i;
        this.uniformsTotal = 1;
        this.slotId = probe.getSlotUid();
        this.types[0] = probe.uniformTypes[i];
        this.dataSizeList[0] = probe.dataSizeList[i];
    }
    use(rc:IRenderShader):void
    {
        let slot:UniformDataSlot = UniformDataSlot.GetSlotAt(rc.getRCUid());
        if(this.always || this.rst != slot.flagList[this.slotIndex])
        {
            //  if(rc.getGPUProgram() == null) {
            //      console.warn("current gpu shader program is null");
            //  }
            //  if(this.program != null) {
            //      console.log("have gpu shader program in this global uniform, program: ",this.program,this.locations);
            //  }
            //  if(this.program != null && rc.getGPUProgram() != this.program) {
            //      console.warn("current gpu shader program can't match this global uniform.");
            //  }
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
                //console.log(this.uns, ", GlobalUniform this.uniformsTotal: ",this.uniformsTotal,this.dataSizeList);
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