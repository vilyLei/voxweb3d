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
                private m_hasOffsetColorTex:boolean = false;
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
                    let code:string =
`
    // calculate clip uv
    temp = u_billParam[`+paramIndex+`];
    float clipf = floor(fi * temp.y)/temp.x;
    vtx = (vec2(floor(fract(clipf) * temp.x), floor(clipf)) + a_uvs.xy) * temp.zw;
    v_texUV = vec4(vtx, kf * a_vs2.w,fi);
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
    v_texUV = vec4(a_uvs.xy, kf * a_vs2.w,fi);
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
                    let fragCode2:string = this.m_billFS.getOffsetColorCode(1,this.m_hasOffsetColorTex);
                    let fadeCode:string = this.m_billFS.getBrnAndAlphaCode();
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