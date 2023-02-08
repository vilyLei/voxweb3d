/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import shader_frag_body from "./PBR_fragBody.glsl";
import shader_frag_head from "./PBR_fragHead.glsl";

import shader_vert_body from "./PBR_vertBody.glsl";
import shader_vert_head from "./PBR_vertHead.glsl";
const PBRShaderCode = {
    vert: "",
    vert_head: shader_vert_head,
    vert_body: shader_vert_body,
    frag: "",
    frag_head: shader_frag_head,
    frag_body: shader_frag_body,
    uuid: "pbr"
};

export { PBRShaderCode };