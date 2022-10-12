/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IRShaderUniform from "./IRShaderUniform";
import IRenderShader from "../IRenderShader";

export default interface IRenderShaderUniform extends IRShaderUniform {
    
    uns: string;
    next: IRenderShaderUniform;
    key: number;
    use(rc: IRenderShader): void;
    useByLocation(rc: IRenderShader, type: number, location: any, i: number): void;
    updateData(): void;
    destroy(): void;
}