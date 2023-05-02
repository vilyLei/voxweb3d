/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// import IShaderCodeObject from "../../../../vox/material/IShaderCodeObject";
interface IShaderCodeObject {
    vert: string;
    vert_head: string;
    vert_body: string;
    frag: string;
    frag_head: string;
    frag_body: string;
    uuid: string;
}
export const ShaderCode:IShaderCodeObject;