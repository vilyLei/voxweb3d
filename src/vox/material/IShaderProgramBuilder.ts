
/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IShaderData from "../../vox/material/IShaderData";
import IShdProgram from "../../vox/material/IShdProgram";
import IRenderProxy from "../render/IRenderProxy";

interface IShaderProgramBuilder {

    /**
     * @returns return renderer context unique id
     */
    getRCUid(): number;
    /**
     * 这里的program生成过程已经能适配多GPU context的情况了
     */
    create(shdData: IShaderData, rc: IRenderProxy): IShdProgram;
    findShdProgramByUid(uid: number): IShdProgram;
    findShdProgram(unique_name_str: string): IShdProgram;
    findShdProgramByShdData(shdData: IShaderData): IShdProgram;
    hasUid(resUid: number): boolean;
    getTotal(): number;
    containsUid(uid: number): boolean;
}
export {IShaderProgramBuilder}
