/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ShaderCodeBuffer from "../../../vox/material/ShaderCodeBuffer";
import BillboardMaterial from "../../../vox/material/mcase/BillboardMaterial";

export class BillboardRGBMaskShaderBuffer extends ShaderCodeBuffer
{
    constructor()
    {
        super();
    }
    private m_uniqueName:string = "";
    initialize(texEnabled:boolean):void
    {
        this.m_uniqueName = "BillboardRGBMaskShader";
    }
    getFragShaderCode():string
    {
        let fragCode:string =
`#version 300 es
precision mediump float;
uniform sampler2D u_sampler0;
uniform sampler2D u_sampler1;
in vec4 v_colorMult;
in vec4 v_colorOffset;
in vec2 v_texUV;
layout(location = 0) out vec4 FragColor;
void main()
{
vec4 color = texture(u_sampler0, v_texUV);
vec4 maskColor = texture(u_sampler1, v_texUV);
color.rgb = max(color.rgb * v_colorMult.xyz + v_colorOffset.xyz,0.0) * maskColor.xyz;
color.rgb *= color.rgb;
color.rgb *= 1.1;
color.a = maskColor.a;
FragColor = color;
}
`;
        return fragCode;
    }
    getVertShaderCode():string
    {
        let vtxCode:string = 
`#version 300 es
precision mediump float;
layout(location = 0) in vec2 a_vs;
layout(location = 1) in vec2 a_uvs;
uniform mat4 u_objMat;
uniform mat4 u_viewMat;
uniform mat4 u_projMat;
uniform vec4 u_billParam[3];
out vec4 v_colorMult;
out vec4 v_colorOffset;
out vec2 v_texUV;
void main()
{
vec4 temp = u_billParam[0];
float cosv = cos(temp.z);
float sinv = sin(temp.z);
vec2 vtx = vec2(a_vs.x * temp.x, a_vs.y * temp.y);
vec2 vtx_pos = vec2(vtx.x * cosv - vtx.y * sinv, vtx.x * sinv + vtx.y * cosv);
vec4 pos = u_viewMat * u_objMat * vec4(0.0,0.0,0.0,1.0);
pos.xy += vtx_pos.xy;
gl_Position =  u_projMat * pos;
v_texUV = a_uvs;
v_colorMult = u_billParam[1];
v_colorOffset = u_billParam[2];
}
`;
        return vtxCode;
    }
    getUniqueShaderName(): string
    {
        return this.m_uniqueName;
    }
    toString():string
    {
        return "[BillboardRGBMaskShaderBuffer()]";
    }
    private static s_instance:BillboardRGBMaskShaderBuffer = new BillboardRGBMaskShaderBuffer();
    static GetInstance():BillboardRGBMaskShaderBuffer
    {
        if(BillboardRGBMaskShaderBuffer.s_instance != null)
        {
            return BillboardRGBMaskShaderBuffer.s_instance;
        }
        BillboardRGBMaskShaderBuffer.s_instance = new BillboardRGBMaskShaderBuffer();
        return BillboardRGBMaskShaderBuffer.s_instance;
    }
}

export default class BillboardRGBMaskMaterial extends BillboardMaterial
{
    constructor()
    {
        super();
    }
    getCodeBuf():ShaderCodeBuffer
    {
        let buf:ShaderCodeBuffer = BillboardRGBMaskShaderBuffer.GetInstance();        
        return buf;
    }                
}