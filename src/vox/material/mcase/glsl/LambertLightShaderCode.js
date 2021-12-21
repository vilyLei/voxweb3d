/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import shader_frag_body from "./LambertLight_fragBody.glsl";
import shader_frag_head from "./LambertLight_fragHead.glsl";

import shader_vert_body from "./LambertLight_vertBody.glsl";
import shader_vert_head from "./LambertLight_vertHead.glsl";
const LambertLightShaderCode = {
    vert: "",
    vert_head: shader_vert_head,
    vert_body: shader_vert_body,
    frag: "",
    frag_head: shader_frag_head,
    frag_body: shader_frag_body,
    uuid: "lambert"
};

export { LambertLightShaderCode };