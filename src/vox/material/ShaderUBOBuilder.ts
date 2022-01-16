/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import RenderProxy from "../../vox/render/RenderProxy";
import IShdProgram from "../../vox/material/IShdProgram";
import ShaderUBO from "../../vox/material/ShaderUBO";

export class ShaderUBOBuilder {

    // record uniform block binding index and uniform block name
    private static s_uboBindingNSMap: Map<string, number> = new Map();
    private static s_uboBindingPosListTotal: number = 0;
    private static s_uboBindingPosList: Uint8Array = new Uint8Array(256);

    static GetBindingIndexByNS(uniform_block_ns: string): number {
        if (ShaderUBOBuilder.s_uboBindingNSMap.has(uniform_block_ns)) {
            return ShaderUBOBuilder.s_uboBindingNSMap.get(uniform_block_ns);
        }
        let index: number = ShaderUBOBuilder.s_uboBindingPosListTotal;
        ShaderUBOBuilder.s_uboBindingPosList[index] = 31;
        ++ShaderUBOBuilder.s_uboBindingPosListTotal;
        ShaderUBOBuilder.s_uboBindingNSMap.set(uniform_block_ns, index);
        return index;
    }
    static CreateBindingIndexByNS(uniform_block_ns: string, shdProgram: IShdProgram): number {
        if (ShaderUBOBuilder.s_uboBindingNSMap.has(uniform_block_ns)) {
            return ShaderUBOBuilder.s_uboBindingNSMap.get(uniform_block_ns);
        }
        let index: number = ShaderUBOBuilder.s_uboBindingPosListTotal;
        ShaderUBOBuilder.s_uboBindingPosList[index] = 31;
        ++ShaderUBOBuilder.s_uboBindingPosListTotal;
        ShaderUBOBuilder.s_uboBindingNSMap.set(uniform_block_ns, index);
        shdProgram.uniformBlockBinding(uniform_block_ns, index);
        return index;
    }
    static BindingIndexEnabledByNS(uniform_block_ns: string): boolean {
        return ShaderUBOBuilder.s_uboBindingNSMap.has(uniform_block_ns);
    }
    static CreateUBOWithDataFloatsCount(rc: RenderProxy, uniform_block_ns: string, shdProgram: IShdProgram, dataFloatsCount: number): ShaderUBO {
        let ubo: ShaderUBO = new ShaderUBO();
        let bindingIndex: number = ShaderUBOBuilder.CreateBindingIndexByNS(uniform_block_ns, shdProgram);
        ubo.initializeWithDataFloatsCount(rc, uniform_block_ns, bindingIndex, dataFloatsCount);
        return ubo;
    }
    static CreateUBOWithFloatData(uniform_block_ns: string, shdProgram: IShdProgram, dataFloatArr: Float32Array): ShaderUBO {
        let ubo: ShaderUBO = new ShaderUBO();
        let bindingIndex = ShaderUBOBuilder.CreateBindingIndexByNS(uniform_block_ns, shdProgram);
        ubo.initializeWithFloatData(uniform_block_ns, bindingIndex, dataFloatArr);
        return ubo;
    }
}