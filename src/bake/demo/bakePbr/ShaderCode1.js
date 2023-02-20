/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import shader_frag_body from "./fragBody1.glsl";

import shader_vert_body from "./vertBody.glsl";
const ShaderCode1 = {
    vert: "",
    vert_head: "",
    vert_body: shader_vert_body,
    frag: "",
    frag_head: "",
    frag_body: shader_frag_body,
    uuid: "effect"
};

export { ShaderCode1 };