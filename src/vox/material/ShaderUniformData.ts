/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import { IShaderUniformProbe } from "../../vox/material/IShaderUniformProbe";
import IShaderUniformData from "../../vox/material/IShaderUniformData";

export default class ShaderUniformData implements IShaderUniformData {
    constructor() {
    }
    uns: string = "";
    types: number[] = null;
    uniformSize: number = 0;
    uniformNameList: string[] = null;
    locations: any[] = null;
    dataList: Float32Array[] = null;
    calcModels: any[] = null;
    always: boolean = true;
    next: ShaderUniformData = null;
    // for fast data's operation
    getDataRefFromUniformName(ns: string): Float32Array {
        if (this.uniformNameList != null) {
            let list = this.uniformNameList;
            let len = list.length;
            for (let i = 0; i < len; ++i) {
                if (ns == list[i]) {
                    return this.dataList[i];
                }
            }
        }
        return null;
    }
    // for fast data's operation
    setDataRefFromUniformName(ns: string, dataRef: Float32Array): void {
        if (this.uniformNameList != null) {
            let list = this.uniformNameList;
            let len = list.length;
            for (let i = 0; i < len; ++i) {
                if (ns == list[i]) {
                    this.dataList[i] = dataRef;
                    break;
                }
            }
        }
    }
    //
    copyDataFromProbe(probe: IShaderUniformProbe): void {
        this.types = [];
        for (let i = 0; i < probe.uniformsTotal; ++i) {
            this.types.push(probe.uniformTypes[i]);
        }
        this.uniformSize = probe.uniformsTotal;
    }
    destroy(): void {
        let i: number = 0;
        let len: number = this.dataList.length;
        for (; i < len; ++i) {
            this.dataList[i] = null;
        }
        if (this.calcModels != null) {
            len = this.calcModels.length;
            for (i = 0; i < len; ++i) {
                this.calcModels[i].destroy();
                this.calcModels[i] = null;
            }
        }
        this.dataList = null;
        this.types = null;
        this.locations = null;
        this.calcModels = null;
    }
}