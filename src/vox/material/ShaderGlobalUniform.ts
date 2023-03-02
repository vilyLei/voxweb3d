/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import RendererDevice from "../../vox/render/RendererDevice";
import {UniformDataSlot} from "../../vox/material/UniformDataSlot";
import { IShaderUniformProbe } from "../../vox/material/IShaderUniformProbe";
import ShaderUniform from "../../vox/material/ShaderUniform";
import IRenderShader from "../../vox/render/IRenderShader";

export default class ShaderGlobalUniform extends ShaderUniform {

    private m_slot: UniformDataSlot = null;
    private m_slotFlags: Uint16Array = null;
    private m_slotDatas: Float32Array[] = null;

    slotId: number = 0;
    slotIndex: number = 0;
    uniformsTotal: number = 0;
    locationIndexList: number[] = null;
    locations: any[] = null;

    rst: number = 0;
    constructor(slot: UniformDataSlot) {
        super();
        this.always = false;
        this.m_slot = slot;
        this.m_slotFlags = this.m_slot.flagList;
        this.m_slotDatas = this.m_slot.dataList;
    }
    applyData(): void {
    }
    clone(): ShaderGlobalUniform {

        let guniform: ShaderGlobalUniform = new ShaderGlobalUniform( this.m_slot );
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
    copyDataFromProbe(probe: IShaderUniformProbe): void {
        this.types = probe.uniformTypes.slice(0);
        this.dataSizeList = probe.dataSizeList.slice(0);
        this.slotIndex = probe.getSlotBeginIndex();
        this.uniformsTotal = probe.uniformsTotal;
        this.slotId = probe.getRCUid();
    }
    copyDataFromProbeAt(i: number, probe: IShaderUniformProbe): void {
        if (this.types == null) {
            this.types = [];
            this.dataSizeList = [];
        }
        this.slotIndex = probe.getSlotBeginIndex() + i;
        this.uniformsTotal = 1;
        this.slotId = probe.getRCUid();
        this.types[0] = probe.uniformTypes[i];
        this.dataSizeList[0] = probe.dataSizeList[i];
    }
    use(rc: IRenderShader): void {
        //let slot: UniformDataSlot = UniformDataSlot.GetSlotAt(rc.getRCUid());
        
        if (this.always || this.rst != this.m_slotFlags[this.slotIndex]) {
            //  if(rc.getGPUProgram() == null) {
            //      console.warn("current gpu shader program is null");
            //  }
            //  if(this.program != null) {
            //      console.log("have gpu shader program in this global uniform, program: ",this.program,this.locations);
            //  }
            //  if(this.program != null && rc.getGPUProgram() != this.program) {
            //      console.warn("current gpu shader program can't match this global uniform.");
            //  }
            
            // console.log("global uniform run(), names: ", this.uniformNameList);

            this.rst = this.m_slotFlags[this.slotIndex];
            let i = 0;
            let datas = this.m_slotDatas;
            if (RendererDevice.IsWebGL1()) {
                for (; i < this.uniformsTotal; ++i) {
                    rc.useUniformV1(this.locations[i], this.types[i], datas[this.slotIndex + i], this.dataSizeList[i]);
                }
            }
            else {
                //console.log(this.uns, ", GlobalUniform this.uniformsTotal: ",this.uniformsTotal,this.dataSizeList);
                for (; i < this.uniformsTotal; ++i) {
                    // if(this.types[i] == MaterialConst.SHADER_VEC4FV) {
                    //     console.log("SHADER_VEC4FV, slot.dataList["+(this.slotIndex + i)+"]: ",slot.dataList[this.slotIndex + i]);
                    // }
                    rc.useUniformV2(this.locations[i], this.types[i], datas[this.slotIndex + i], this.dataSizeList[i], 0);
                }
            }
        }
    }
    destroy(): void {
        
        this.types = null;
        this.dataSizeList = null;
        this.slotIndex = -1;
        this.uniformsTotal = 0;

        this.m_slot = null;
        this.m_slotFlags = null;
        this.m_slotDatas = null;
    }
}