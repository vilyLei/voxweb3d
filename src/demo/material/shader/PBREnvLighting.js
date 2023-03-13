/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import shader_frag_body from "./PBREnvLighting_fragBody.glsl";
import shader_vert_body from "./PBREnvLighting_vertBody.glsl";

const PBREnvLighting = {
    vert: "",
    vert_head: "",
    vert_body: shader_vert_body,
    frag: "",
    frag_head: "",
    frag_body: shader_frag_body,
    uuid: "pbgEnvLighting"
};

export { PBREnvLighting };