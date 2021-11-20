/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import vsm_frag_head from "./vsm_fragHead.glsl";
let __$shader_vsm_vert_head =
`
void calcShadowPos(in vec4 wpos) {
    v_shadowPos = u_shadowMat * wpos;
}
`;
const VSMShaderCode = {
    vert: "",
    vert_head: __$shader_vsm_vert_head,
    vert_body:
`
#ifdef VOX_USE_SHADOW
// calcShadowPos( worldPosition );// if use worldPosition , it make shadow calculation error.
calcShadowPos( u_objMat * vec4(a_vs.xyz, 1.0) );
#endif
`,
    frag: "",
    frag_head: vsm_frag_head,
    frag_body:
`
#ifdef VOX_USE_SHADOW
useVSMShadow( FragColor0 );
#endif
`
};

export { VSMShaderCode };