/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2020 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import RendererDevice from "../../../vox/render/RendererDevice";
import ShaderCodeBuffer from "../../../vox/material/ShaderCodeBuffer";
import ShaderUniformData from "../../../vox/material/ShaderUniformData";
import MaterialBase from "../../../vox/material/MaterialBase";


class PingpongHBlurShaderBuffer extends ShaderCodeBuffer
{
    constructor()
    {
        super();
    }
    private static s_instance:PingpongHBlurShaderBuffer = new PingpongHBlurShaderBuffer();
    private m_uniqueName:string = "";
    initialize(texEnabled:boolean):void
    {
        //console.log("PingpongHBlurShaderBuffer::initialize()...");
        this.m_uniqueName = "PingpongHBlurBlurShd";
    }
    getFragShaderCode():string
    {
        let fragCode:string = "";
        if(RendererDevice.IsWebGL2())
        {
        fragCode =
`#version 300 es
precision mediump float;
float weight[5] = float[] (0.227027, 0.1945946, 0.1216216, 0.054054, 0.016216);
uniform vec4 u_texSize;
uniform sampler2D u_sampler0;
in vec2 v_uvs;
out vec4 FragColor;
void main()
{
    vec2 tex_offset = u_texSize.w / u_texSize.xy;
    float dx = tex_offset.x;
    tex_offset.y = 0.0;
    vec4 result = texture(u_sampler0, v_uvs) * weight[0];
    for(int i = 1; i < 5; ++i)
    {
        tex_offset.x = dx * float(i);
        result += texture(u_sampler0, v_uvs + tex_offset) * weight[i];
        result += texture(u_sampler0, v_uvs - tex_offset) * weight[i];
    }
    FragColor = result;
}
`;
        }
        else
        {
            fragCode =
`
precision mediump float;
uniform vec4 u_texSize;
uniform sampler2D u_sampler0;
in vec2 v_uvs;
out vec4 FragColor;
void main()
{
    vec2 tex_offset = u_texSize.w / u_texSize.xy;
    float dx = tex_offset.x;
    tex_offset.y = 0.0;
    vec4 result = texture2D(u_sampler0, v_uvs) * 0.227027;
    result += texture2D(u_sampler0, v_uvs + tex_offset) * 0.1945946;
    result += texture2D(u_sampler0, v_uvs - tex_offset) * 0.1945946;
    tex_offset.x = dx * 2.0;
    result += texture2D(u_sampler0, v_uvs + tex_offset) * 0.1216216;
    result += texture2D(u_sampler0, v_uvs - tex_offset) * 0.1216216;
    tex_offset.x = dx * 3.0;
    result += texture2D(u_sampler0, v_uvs + tex_offset) * 0.054054;
    result += texture2D(u_sampler0, v_uvs - tex_offset) * 0.054054;
    tex_offset.x = dx * 4.0;
    result += texture2D(u_sampler0, v_uvs + tex_offset) * 0.016216;
    result += texture2D(u_sampler0, v_uvs - tex_offset) * 0.016216;
    FragColor = result;
}
`;
        }
        return fragCode;
    }
    getVertShaderCode():string
    {
        let vtxCode:string =
`#version 300 es
precision mediump float;
layout(location = 0) in vec3 a_vs;
layout(location = 1) in vec2 a_uvs;
out vec2 v_uvs;
void main()
{
    gl_Position = vec4(a_vs, 1.0);
    v_uvs = vec2(a_uvs.x, a_uvs.y);
}
`;
        return vtxCode;
    }
    getUniqueShaderName(): string
    {
        //console.log("H ########################### this.m_uniqueName: "+this.m_uniqueName);
        return this.m_uniqueName;
    }
    toString():string
    {
        return "[PingpongHBlurShaderBuffer()]";
    }

    static GetInstance():PingpongHBlurShaderBuffer
    {
        return PingpongHBlurShaderBuffer.s_instance;
    }
}

export class PingpongVBlurShaderBuffer extends ShaderCodeBuffer
{
    constructor()
    {
        super();
    }
    private static s_instance:PingpongVBlurShaderBuffer = new PingpongVBlurShaderBuffer();
    private m_uniqueName:string = "";
    initialize(texEnabled:boolean):void
    {
        //console.log("PingpongVBlurShaderBuffer::initialize()...");
        this.m_uniqueName = "PingpongVBlurBlurShd";
    }
    getFragShaderCode():string
    {
        let fragCode:string = "";
        if(RendererDevice.IsWebGL2())
        {
            fragCode =
`#version 300 es
precision mediump float;
float weight[5] = float[] (0.227027, 0.1945946, 0.1216216, 0.054054, 0.016216);
uniform vec4 u_texSize;
uniform sampler2D u_sampler0;
in vec2 v_uvs;
out vec4 FragColor;
void main()
{
    //vec2 tex_offset = u_texSize.w / vec2(textureSize(u_sampler0, 0));
    vec2 tex_offset = u_texSize.w / u_texSize.xy;
    float dy = tex_offset.y;
    tex_offset.x = 0.0;
    vec4 result = texture(u_sampler0, v_uvs) * weight[0];
    for(int i = 1; i < 5; ++i)
    {
        tex_offset.y = dy * float(i);
        result += texture(u_sampler0, v_uvs + tex_offset) * weight[i];
        result += texture(u_sampler0, v_uvs - tex_offset) * weight[i];
    }
    FragColor = result;
}
`;
            }
            else
            {
                fragCode =
`
precision mediump float;
uniform vec4 u_texSize;
uniform sampler2D u_sampler0;
in vec2 v_uvs;
out vec4 FragColor;
void main()
{
    vec2 tex_offset = u_texSize.w / u_texSize.xy;
    float dy = tex_offset.y;
    tex_offset.x = 0.0;
    vec4 result = texture2D(u_sampler0, v_uvs) * 0.227027;
    result += texture2D(u_sampler0, v_uvs + tex_offset) * 0.1945946;
    result += texture2D(u_sampler0, v_uvs - tex_offset) * 0.1945946;
    tex_offset.y = dy * 2.0;
    result += texture2D(u_sampler0, v_uvs + tex_offset) * 0.1216216;
    result += texture2D(u_sampler0, v_uvs - tex_offset) * 0.1216216;
    tex_offset.y = dy * 3.0;
    result += texture2D(u_sampler0, v_uvs + tex_offset) * 0.054054;
    result += texture2D(u_sampler0, v_uvs - tex_offset) * 0.054054;
    tex_offset.y = dy * 4.0;
    result += texture2D(u_sampler0, v_uvs + tex_offset) * 0.016216;
    result += texture2D(u_sampler0, v_uvs - tex_offset) * 0.016216;

    FragColor = result;
}
`;
        }
        return fragCode;
    }
    getVertShaderCode():string
    {
        let vtxCode:string =
`#version 300 es
precision mediump float;
layout(location = 0) in vec3 a_vs;
layout(location = 1) in vec2 a_uvs;
out vec2 v_uvs;
void main()
{
    gl_Position = vec4(a_vs, 1.0);
    v_uvs = vec2(a_uvs.x, a_uvs.y);
}
`;
        return vtxCode;
    }
    getUniqueShaderName(): string
    {
        //console.log("V ########################### this.m_uniqueName: "+this.m_uniqueName);
        return this.m_uniqueName;
    }
    toString():string
    {
        return "[PingpongVBlurShaderBuffer()]";
    }

    static GetInstance():PingpongVBlurShaderBuffer
    {
        return PingpongVBlurShaderBuffer.s_instance;
    }
}

export default class PingpongBlurMaterial extends MaterialBase
{
    private m_blurType:number = 0;
    constructor(blurType:number = 0)
    {
        super();
        this.m_blurType = blurType;
    }

    private m_texSizeArray:Float32Array = new Float32Array([800.0,600.0,0.0,0.0]);

    setTexSize(texW:number,texH:number):void
    {
        this.m_texSizeArray[0] = texW;
        this.m_texSizeArray[1] = texH;
    }
    setBlurDensity(density:number):void
    {
        this.m_texSizeArray[3] = density;
    }
    getCodeBuf():ShaderCodeBuffer
    {
        if(this.m_blurType > 0)
        {
            return PingpongVBlurShaderBuffer.GetInstance();
        }
        return PingpongHBlurShaderBuffer.GetInstance();
    }
    createSelfUniformData():ShaderUniformData
    {
        let oum:ShaderUniformData = new ShaderUniformData();
        oum.uniformNameList = ["u_texSize"];
        oum.dataList = [this.m_texSizeArray];
        return oum;
    }
}