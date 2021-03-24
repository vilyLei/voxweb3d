/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/




/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as ShaderCodeBufferT from "../../../vox/material/ShaderCodeBuffer";
import ShaderCodeBuffer = ShaderCodeBufferT.vox.material.ShaderCodeBuffer;

export namespace vox
{
    export namespace material
    {
        export namespace mcase
        {
            export class BillboardGroupShaderBuffer extends ShaderCodeBuffer
            {
                private m_brightnessEnabled:boolean = true;
                private m_alphaEnabled:boolean = false;
                protected m_clipEnabled:boolean = false;
                private m_hasOffsetColorTex:boolean = false;
                private m_flag:number = 0;
                constructor()
                {
                    super();
                }
                protected m_uniqueName:string = "BillboardGroupFlareShader";
                initialize(texEnabled:boolean):void
                {
                }
                setParam(brightnessEnabled:boolean, alphaEnabled:boolean, clipEnabled:boolean,hasOffsetColorTex:boolean):void
                {
                    this.m_brightnessEnabled = brightnessEnabled;
                    this.m_alphaEnabled = alphaEnabled;
                    this.m_clipEnabled = clipEnabled;
                    this.m_hasOffsetColorTex = hasOffsetColorTex;
                    this.m_flag = 0;
                    if(this.m_brightnessEnabled && this.m_alphaEnabled)
                    {
                        this.m_flag = 1;
                    }
                    else if(this.m_brightnessEnabled)
                    {
                        this.m_flag = 2;
                    }
                    else if(this.m_alphaEnabled)
                    {
                        this.m_flag = 3;
                    }
                }
                getClipCalcVSCode(paramIndex:number):string
                {
                    let code:string =
`
    // calculate clip uv
    temp = u_billParam[`+paramIndex+`];
    fi = floor(fi * temp.y)/temp.x;
    vtx = (vec2(floor(fract(fi) * temp.x), floor(fi)) + a_uvs.xy) * temp.zw;
    v_texUV = vec4(vtx, kf * a_vs2.w,kf);
`;
                    return code;
                }
                getVSEndCode(paramIndex:number):string
                {
                    let vtxCode1:string = "";
                    if(this.m_clipEnabled)
                    {
                        vtxCode1 = this.getClipCalcVSCode(paramIndex);                    
                    }
                    else
                    {
                        vtxCode1 =
`
    v_texUV = vec4(a_uvs.xy, kf * a_vs2.w,kf);
`;
                    }
                    let vtxCodeEnd:string =
`
    v_colorMult = u_billParam[1];
    v_colorOffset = u_billParam[2];
}
`;
                    return vtxCode1 + vtxCodeEnd;
                }
                getFragShaderCode():string
                {
                    let fragCodeHead:string =
`#version 300 es
precision mediump float;
uniform sampler2D u_sampler0;
`;
                    let fragCode0:string = "";
                    if(this.m_hasOffsetColorTex)
                    {
                        fragCode0 =
`
uniform sampler2D u_sampler1;
`;
                    }
                    let fragCode1:string =
`
in vec4 v_colorMult;
in vec4 v_colorOffset;
in vec4 v_texUV;
layout(location = 0) out vec4 FragColor;
void main()
{
    vec4 color = texture(u_sampler0, v_texUV.xy);
`;
                    let fragCode2:string = "";
                    if(this.m_hasOffsetColorTex)
                    {
                        fragCode2 =
`
    vec3 offsetColor = v_colorOffset.xyz + texture(u_sampler1, v_texUV.xy).xyz;
`;
                    }
                    else
                    {
                        fragCode2 =
`
    vec3 offsetColor = v_colorOffset.xyz;
`;

                    }
                let fadeCode:string;
                if(this.m_flag == 1)
                {
                    fadeCode = 
 `
    color.rgb = color.rgb * v_colorMult.xyz + color.aaa * offsetColor;
    color *= v_texUV.zzzz;
`;
                }
                else if(this.m_flag == 2)
                {
                    fadeCode = 
 `
    color.rgb = color.rgb * v_colorMult.xyz + color.rgb * offsetColor;
    color.rgb *= v_texUV.zzz;
`;
                }
                else if(this.m_flag == 3)
                {
                    fadeCode = 
 `
    color.rgb = color.rgb * v_colorMult.xyz + color.aaa * offsetColor;
    color.a *= v_texUV.z;
`;
                }
                else
                {
                    fadeCode = 
 `
    color.rgb = color.rgb * v_colorMult.xyz + offsetColor;
    color.a *= v_texUV.z;
`;
                }
                let endCode:string = 
`
    FragColor = color;
}
`;
                    //return fragCode + fadeCode + endCode;
                    return fragCodeHead + fragCode0 + fragCode1 + fragCode2 + fadeCode + endCode;
                }
                getVtxShaderCode():string
                {
                    return ""
                }
                getUniqueShaderName():string
                {
                    let ns:string = this.m_uniqueName + "_" + this.m_flag;
                    if(this.m_hasOffsetColorTex && this.m_clipEnabled)
                    {
                        ns += "_clipColorTex";
                    }
                    else if(this.m_clipEnabled)
                    {
                        ns += "_clip";
                    }
                    return ns;
                }
                toString():string
                {
                    return "[BillboardFlareShaderBuffer()]";
                }
            }
        }
    }
}