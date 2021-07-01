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
    vtxColorEnabled: boolean = false;
    premultiplyAlpha: boolean = false;
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
        
        let codeStr:string = "#version 300 es\nprecision mediump float;";
        if(this.premultiplyAlpha) codeStr += "\n#define VOX_PREMULTIPLY_ALPHA";
        if(this.m_texEnabled)
        {
            codeStr += "\n#define VOX_USE_MAP";
            codeStr +=
`
#ifdef VOX_USE_MAP
    uniform sampler2D u_sampler0;
    in vec2 v_uvs;
#endif
`;
        }
        if(this.vtxColorEnabled) codeStr += "\n#define VOX_USE_VTX_COLOR";
        codeStr += "\n";
        codeStr += 
`
#ifdef VOX_USE_VTX_COLOR
    in vec3 v_cvs;
#endif
uniform vec4 u_color;
layout(location = 0) out vec4 FragColor;
void main(){
    FragColor = vec4(1.0);
    #ifdef VOX_USE_MAP
        FragColor *= texture(u_sampler0, v_uvs);
    #endif
    #ifdef VOX_USE_VTX_COLOR
        FragColor *= vec4(v_cvs.xyz,1.0);
    #endif
    #ifdef VOX_PREMULTIPLY_ALPHA
        FragColor.rgb *= u_color.xyz;
        FragColor.a *= u_color.w;
        FragColor.rgb *= u_color.aaa;
    #else
        FragColor *= u_color;
    #endif
}
`;
        return codeStr;
    }
    getVtxShaderCode():string
    {
        if(ShaderCodeBuffer.___s_csBuf != this) return ShaderCodeBuffer.___s_csBuf.getVtxShaderCode();

        let codeStr:string = "#version 300 es\nprecision mediump float;";
        codeStr += "\nlayout(location = 0) in vec3 a_vs;";

        let layoutIndex: number = 1;
        if(this.m_texEnabled) {
            codeStr += "\n#define VOX_USE_MAP";
            codeStr +=
`
#ifdef VOX_USE_MAP
    layout(location = `+(layoutIndex++)+`) in vec2 a_uvs;
    out vec2 v_uvs;
#endif
`;
        }
        
        if(this.vtxColorEnabled)
        {
            codeStr += "\n#define VOX_USE_VTX_COLOR";
            codeStr +=
`
#ifdef VOX_USE_VTX_COLOR
    layout(location = `+(layoutIndex++)+`) in vec3 a_cvs;
    out vec3 v_cvs;
#endif
`;
        }
        codeStr +=
`
uniform mat4 u_objMat;
uniform mat4 u_viewMat;
uniform mat4 u_projMat;
void main(){
    
    gl_Position = u_projMat * u_viewMat * u_objMat * vec4(a_vs.xyz,1.0);

    #ifdef VOX_USE_MAP
        v_uvs = a_uvs.xy;
    #endif
    #ifdef VOX_USE_VTX_COLOR
        v_cvs = a_cvs.xyz;
    #endif
}
`;
        return codeStr;
    }
    getUniqueShaderName():string
    {
        if(ShaderCodeBuffer.___s_csBuf != this) return ShaderCodeBuffer.___s_csBuf.getUniqueShaderName();
        let ns: string = "vox_default_shd";

        if(this.m_texEnabled) ns += "_tex";
        if(this.vtxColorEnabled) ns += "_vtxColor";
        if(this.premultiplyAlpha) ns += "_preMulAlpha";
        return ns;
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