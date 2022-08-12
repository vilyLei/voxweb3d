/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IRShaderUniform from "../../vox/render/uniform/IRShaderUniform";
import IRenderShader from "../../vox/render/IRenderShader";

export default interface IShaderUniform extends IRShaderUniform {
    
    uns: string;
    next: IShaderUniform;
    use(rc: IRenderShader): void;
    useByLocation(rc: IRenderShader, type: number, location: any, i: number): void;
    updateData(): void;
    destroy(): void;
}