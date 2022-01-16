
/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IVtxShdCtr from "../../vox/material/IVtxShdCtr";

export default interface IShdProgram extends IVtxShdCtr{
    getUid(): number;
    getTexTotal(): number;
    useTexLocation(): void;
    // use texture true or false
    haveTexture(): boolean
    getUniformLocationByNS(ns: string): any;
    getUniformTypeNameByNS(ns: string): string;
    hasUniformByName(ns: string): boolean;
    getUniformLengthByNS(ns: string): number;
    getUniformTypeByNS(ns: string): number;

    getFragOutputTotal(): number;
    getUniqueShaderName(): string;
    /**
     * @returns return current gpu shader  program
     */
     getGPUProgram(): any;
     upload(gl: any, rcuid: number): void;
     uniformBlockBinding(uniform_block_ns: string, bindingIndex: number): void;
}
