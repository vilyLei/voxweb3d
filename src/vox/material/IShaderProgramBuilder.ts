
/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IShaderData from "../../vox/material/IShaderData";
import IShdProgram from "../../vox/material/IShdProgram";

interface IShaderProgramBuilder {
    
    /**
     * @returns return renderer context unique id
     */
    getRCUid(): number;
    /**
     * 这里的program生成过程已经能适配多GPU context的情况了
     */
    create(shdData: IShaderData): IShdProgram;
    findShdProgramByUid(uid: number): IShdProgram;
    findShdProgram(unique_name_str: string): IShdProgram;
    findShdProgramByShdData(shdData: IShaderData): IShdProgram;
    hasUid(resUid: number): boolean;
    getTotal(): number;
    containsUid(uid: number): boolean;
}
export {IShaderProgramBuilder}
