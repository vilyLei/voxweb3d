/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import env_frag_head from "./env_fragHead.glsl";
let __$shader_env_vert_head =
    `
void calcFogDepth(in vec4 viewPos) {
    v_fogDepth = -viewPos.z;
}
`;
const EnvShaderCode = {
    vert: "",
    vert_head: __$shader_env_vert_head,
    vert_body: "",
    frag: "",
    frag_head: env_frag_head,
    frag_body: ""
};

export { EnvShaderCode };