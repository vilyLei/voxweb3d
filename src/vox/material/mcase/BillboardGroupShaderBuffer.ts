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
import * as BillboardFSBaseT from "../../../vox/material/mcase/BillboardFSBase";

import ShaderCodeBuffer = ShaderCodeBufferT.vox.material.ShaderCodeBuffer;
import BillboardFSBase = BillboardFSBaseT.vox.material.mcase.BillboardFSBase;

export namespace vox
{
    export namespace material
    {
        export namespace mcase
        {
            export class BillboardGroupShaderBuffer extends ShaderCodeBuffer
            {
                private m_billFS:BillboardFSBase = new BillboardFSBase();
                protected m_clipEnabled:boolean = false;
                protected m_hasOffsetColorTex:boolean = false;
                protected m_useRawUVEnabled:boolean = false
                clipMixEnabled:boolean = false;
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
                    this.m_billFS.setBrightnessAndAlpha(brightnessEnabled, alphaEnabled);
                    this.m_clipEnabled = clipEnabled;
                    this.m_hasOffsetColorTex = hasOffsetColorTex;
                }
                getClipCalcVSCode(paramIndex:number):string
                {
                    if(this.clipMixEnabled)
                    {
                        let code:string =
`
    // calculate clip uv
    temp = u_billParam[`+paramIndex+`];//(x:cn,y:total,z:du,w:dv)
    float clipf0 = floor(fi * temp.y);
    float clipf1 = min(clipf0+1.0,temp.y-1.0);
    clipf0 /= temp.x;
    // vec2(floor(fract(clipf0) * temp.x), floor(clipf0)) -> ve2(cn u,rn v)
    v_texUV.xy = (vec2(floor(fract(clipf0) * temp.x), floor(clipf0)) + a_uvs.xy) * temp.zw;
    
    v_factor.x = fract(fi * temp.y);

    clipf1 /= temp.x;
    v_texUV.zw = (vec2(floor(fract(clipf1) * temp.x), floor(clipf1)) + a_uvs.xy) * temp.zw;
`;
                        return code;
                    }
                    else
                    {
                        let code:string =
`
    // calculate clip uv
    temp = u_billParam[`+paramIndex+`];//(x:cn,y:total,z:du,w:dv)
    float clipf = floor(fi * temp.y);
    clipf /= temp.x;
    // vec2(floor(fract(clipf) * temp.x), floor(clipf)) -> ve2(cn u,rn v)
    v_texUV.xy = (vec2(floor(fract(clipf) * temp.x), floor(clipf)) + a_uvs.xy) * temp.zw;
`;
                        return code;
                    }
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
    v_texUV = vec4(a_uvs.xy, a_uvs.xy);
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
                    let fragCode1:string = "";
                    if(this.m_hasOffsetColorTex && this.m_useRawUVEnabled)
                    {
                        fragCode1 =
`
in vec4 v_uv;
`;
                    }
                    fragCode1 +=
`
in vec4 v_colorMult;
in vec4 v_colorOffset;
in vec4 v_texUV;
in vec4 v_factor;
layout(location = 0) out vec4 FragColor;
void main()
{
    vec4 color = texture(u_sampler0, v_texUV.xy);
`;
                    if(this.m_clipEnabled && this.clipMixEnabled)
                    {
                        fragCode1 +=
`
    color = mix(color,texture(u_sampler0, v_texUV.zw),v_factor.x);
`;
                    }
                    let fragCode2:string = this.m_billFS.getOffsetColorCode(1,this.m_hasOffsetColorTex);
                    let fadeCode:string = this.m_billFS.getBrnAndAlphaCode("v_factor");
                    let endCode:string = 
`
    FragColor = color;
}
`;
                    return fragCodeHead + fragCode0 + fragCode1 + fragCode2 + fadeCode + endCode;
                }
                getVtxShaderCode():string
                {
                    return ""
                }
                getUniqueShaderName():string
                {
                    let ns:string = this.m_uniqueName + "_" + this.m_billFS.getBrnAlphaStatus();
                    if(this.m_hasOffsetColorTex && this.m_clipEnabled)
                    {
                        ns += "ClipColorTex";
                    }
                    else if(this.m_clipEnabled)
                    {
                        ns += "Clip";
                    }
                    else if(this.clipMixEnabled)
                    {
                        ns += "Mix";
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