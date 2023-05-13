/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

// import terrain_frag_head from "./terrainShader_fragHead.glsl";
// import terrain_vert_head from "./terrainShader_vertHead.glsl";
import terrain_frag_body from "./terrainShader_fragBody.glsl";
import terrain_vert_body from "./terrainShader_vertBody.glsl";

const TerrainShaderCode = {
    vert: "",
    vert_head: "",//terrain_vert_head,
    vert_body: terrain_vert_body,
    frag: "",
    frag_head: "",//terrain_frag_head,
    frag_body: terrain_frag_body
};

export { TerrainShaderCode };