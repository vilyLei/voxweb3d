/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IShdProgram from "../../../vox/material/IShdProgram";
import IRUniformUser from "./IRUniformUser";

export default interface IRShaderUniform {
    
    uns: string;
    dataList: Float32Array[];
    use(rc: IRUniformUser): void;
    useByShd(rc: IRUniformUser, shd: IShdProgram): void;
}