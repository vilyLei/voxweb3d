/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IRenderShaderUniform from "../../vox/render/uniform/IRenderShaderUniform";
import { IShaderUniformProbe } from "../../vox/material/IShaderUniformProbe";
import IShdProgram from "../../vox/material/IShdProgram";
import IRenderShader from "../../vox/render/IRenderShader";
// import DebugFlag from "../debug/DebugFlag";

export default interface IShaderUniform extends IRenderShaderUniform {

    uns: string;
    key: number;
    program: any;
    types: number[];
    uniformSize: number;
    uniformNameList: string[];
    locations: any[];
    dataSizeList: number[];
    dataList: Float32Array[];
    calcModels: any[];
    always: boolean;
    next: IShaderUniform;
    // for fast data's operation
    getDataRefFromUniformName(ns: string): Float32Array;
    // for fast data's operation
    setDataRefFromUniformName(ns: string, dataRef: Float32Array): void;
    copyDataFromProbe(probe: IShaderUniformProbe): void;
    useByLocation(rc: IRenderShader, type: number, location: any, i: number): void;
    useByShd(rc: IRenderShader, shd: IShdProgram): void;
    use(rc: IRenderShader): void;
    updateData(): void;
    destroy(): void;
}