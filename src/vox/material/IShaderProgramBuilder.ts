
/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IShaderData from "../../vox/material/IShaderData";
import ShdProgram from "../../vox/material/ShdProgram";

interface IShaderProgramBuilder {
    
    /**
     * @returns return renderer context unique id
     */
    getRCUid(): number;
    /**
     * 这里的program生成过程已经能适配多GPU context的情况了
     */
    create(shdData: IShaderData): ShdProgram;
    findShdProgramByUid(uid: number): ShdProgram;
    findShdProgram(unique_name_str: string): ShdProgram;
    findShdProgramByShdData(shdData: IShaderData): ShdProgram;
    hasUid(resUid: number): boolean;
    getTotal(): number;
    containsUid(uid: number): boolean;
}
export {IShaderProgramBuilder}
