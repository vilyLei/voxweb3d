/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IRenderTexture from '../../vox/render/IRenderTexture';
import ShaderCodeBuilder from "../../vox/material/code/ShaderCodeBuilder";

class ShaderCodeBuffer
{
    private static ___s_csBuf:ShaderCodeBuffer = null;
    protected static s_coder:ShaderCodeBuilder = new ShaderCodeBuilder();
    constructor()
    {
    }
    private m_texList:IRenderTexture[] = null;
    private m_texEnabled:boolean = true;
    initialize(texEnabled:boolean):void
    {
        if(ShaderCodeBuffer.___s_csBuf != null)
        {
            if(ShaderCodeBuffer.___s_csBuf != this)
            {
                ShaderCodeBuffer.___s_csBuf.initialize(texEnabled);
            }
        }
        this.m_texEnabled = texEnabled;
    }
    isTexEanbled():boolean
    {
        return this.m_texEnabled;
    }
    setIRenderTextureList(texList:IRenderTexture[]):void
    {
        this.m_texList = texList;
    }
    getIRenderTextureList():IRenderTexture[]
    {
        return this.m_texList;
    }
    buildShader():void
    {
    }
    getFragShaderCode():string
    {
        if(ShaderCodeBuffer.___s_csBuf != this) return ShaderCodeBuffer.___s_csBuf.getFragShaderCode();
        //
        let codeStr:string = "";
        if(this.m_texEnabled)
        {
            codeStr = 
`#version 300 es
precision mediump float;
uniform sampler2D u_sampler0;
uniform vec4 u_color;
in vec2 v_uvs;
layout(location = 0) out vec4 FragColor;
void main(){
    FragColor = u_color * texture(u_sampler0, v_uvs);
}
`;
        }
        else
        {
            codeStr = 
`#version 300 es
precision mediump float;
uniform vec4 u_color;
layout(location = 0) out vec4 FragColor;
void main(){
    FragColor = u_color;
}
`;

        }
        return codeStr;
    }
    getVtxShaderCode():string
    {
        if(ShaderCodeBuffer.___s_csBuf != this) return ShaderCodeBuffer.___s_csBuf.getVtxShaderCode();
        //
        let codeStr:string = "";
        if(this.m_texEnabled)
        {
            codeStr =
`#version 300 es
precision mediump float;
layout(location = 0) in vec3 a_vs;
layout(location = 1) in vec2 a_uvs;
uniform mat4 u_objMat;
uniform mat4 u_viewMat;
uniform mat4 u_projMat;
out vec2 v_uvs;
void main(){
    gl_Position = u_projMat * u_viewMat * u_objMat * vec4(a_vs,1.0);
    v_uvs = a_uvs;
}
`;
        }
        else
        {
                   
codeStr =
`#version 300 es
precision mediump float;
layout(location = 0) in vec3 a_vs;
uniform mat4 u_objMat;
uniform mat4 u_viewMat;
uniform mat4 u_projMat;
void main(){
    gl_Position = u_projMat * u_viewMat * u_objMat * vec4(a_vs,1.0);
}
`;
        }
        return codeStr;
    }
    getUniqueShaderName():string
    {
        if(ShaderCodeBuffer.___s_csBuf != this) return ShaderCodeBuffer.___s_csBuf.getUniqueShaderName();
        if(this.m_texEnabled)
        {
            return "vox_default_shd_tex";
        }                
        return "vox_default_shd";
    }
    toString():string
    {
        return "[ShaderCodeBuffer()]";
    }
    static UseShaderBuffer(buf:ShaderCodeBuffer):void
    {
        ShaderCodeBuffer.___s_csBuf = buf;
    }
}
export default ShaderCodeBuffer;