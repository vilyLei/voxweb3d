/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IRenderProxy from "../../vox/render/IRenderProxy";

export default interface IShaderUBO {

    getUid(): number;
    getBindingIndex(): number;
    getUBOBuffer(): any;
    initializeWithDataFloatsCount(rc: IRenderProxy, uniform_block_ns: string, bindingIndex: number, dataFloatsCount: number): void;
    initializeWithFloatData(uniform_block_ns: string, bindingIndex: number, dataFloatArr: Float32Array): void;
    setData4At(dataIndex: number, pa: number, pb: number, pc: number, pd: number): void;
    setData3At(dataIndex: number, pa: number, pb: number, pc: number): void;
    setData2At(dataIndex: number, pa: number, pb: number): void;
    setDataAt(dataIndex: number, pa: number): void;
    setSubDataArrAt(dataIndex: number, dataArray: Float32Array): void;
    setDataChanged(boo: boolean): void;
    getDataArray(): Float32Array;
    updateData(rc: IRenderProxy): void;
    bindUBOBuffer(rc: IRenderProxy): void;
    run(rc: IRenderProxy): void;
    destroy(rc: IRenderProxy): void ;
}
