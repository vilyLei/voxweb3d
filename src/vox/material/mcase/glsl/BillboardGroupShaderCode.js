/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import shader_frag_body from "./BillboardGroup_fragBody.glsl";
import shader_frag_head from "./BillboardGroup_fragHead.glsl";

import shader_vert_body from "./BillboardGroup_vertBody.glsl";
import shader_vert_head from "./BillboardGroup_vertHead.glsl";
const BillboardGroupShaderCode = {
    vert: "",
    vert_head: shader_vert_head,
    vert_body: shader_vert_body,
    frag: "",
    frag_head: shader_frag_head,
    frag_body: shader_frag_body,
    uuid: "lambert"
};

export { BillboardGroupShaderCode };