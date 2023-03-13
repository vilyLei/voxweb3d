/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import shader_frag_head from "./PBRTexture_fragHead.glsl";
import shader_vert_head from "./PBRTexture_vertHead.glsl";
import shader_frag_body from "./PBRTexture_fragBody.glsl";
import shader_vert_body from "./PBRTexture_vertBody.glsl";

const PBRTexture = {
    vert: "",
    vert_head: shader_vert_head,
    vert_body: shader_vert_body,
    frag: "",
    frag_head: shader_frag_head,
    frag_body: shader_frag_body,
    uuid: "PBRTexture"
};

export { PBRTexture };