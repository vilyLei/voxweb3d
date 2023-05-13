/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import env_frag_head from "./env_fragHead.glsl";
import env_vert_head from "./env_vertHead.glsl";
import env_frag_body from "./env_fragBody.glsl";
import env_vert_body from "./env_vertBody.glsl";

const EnvShaderCode = {
    vert: "",
    vert_head: env_vert_head,
    vert_body: env_vert_body,
    frag: "",
    frag_head: env_frag_head,
    frag_body: env_frag_body
};

export { EnvShaderCode };