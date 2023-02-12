/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import { IShaderUniformProbe } from "../../vox/material/IShaderUniformProbe";

export default interface IShaderUniformData {
    
    uns: string;
    types: number[];
    uniformSize: number;
    uniformNameList: string[];
    locations: any[];
    dataList: Float32Array[];
    calcModels: any[];
    always: boolean;
    next: IShaderUniformData;
    // for fast data's operation
    getDataRefFromUniformName(ns: string): Float32Array;
    // for fast data's operation
    setDataRefFromUniformName(ns: string, dataRef: Float32Array): void;
    copyDataFromProbe(probe: IShaderUniformProbe): void;
}