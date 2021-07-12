/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import shader_frag_body from "./defaultPBR_fragBody.glsl";
import shader_frag_head from "./defaultPBR_fragHead.glsl";

const DefaultPBRShaderCode = {
    vert: "",
    frag_head: shader_frag_head,
    frag_body: shader_frag_body
};

export {DefaultPBRShaderCode};