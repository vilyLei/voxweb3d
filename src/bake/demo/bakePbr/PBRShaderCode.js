/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import shader_frag_body from "./PBRFragBody.glsl";

import shader_vert_body from "./PBRVertBody.glsl";
const PBRShaderCode = {
    vert: "",
    vert_head: "",
    vert_body: shader_vert_body,
    frag: "",
    frag_head: "",
    frag_body: shader_frag_body,
    uuid: "effect"
};

export { PBRShaderCode };