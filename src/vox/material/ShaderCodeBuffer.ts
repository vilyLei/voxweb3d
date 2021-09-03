/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IRenderTexture from '../../vox/render/IRenderTexture';
import ShaderCodeBuilder2 from "../../vox/material/code/ShaderCodeBuilder2";
import ShaderCompileInfo from "../../vox/material/code/ShaderCompileInfo";
class ShaderCodeBuffer
{
    private static ___s_csBuf:ShaderCodeBuffer = null;
    protected static s_coder:ShaderCodeBuilder2 = new ShaderCodeBuilder2();

    private m_texList:IRenderTexture[] = null;
    private m_texEnabled:boolean = true;

    vtxColorEnabled: boolean = false;
    premultiplyAlpha: boolean = false;
    /**
     * 是否自适应转换shader版本
     */
    adaptationShaderVersion: boolean = true;
    constructor()
    {
    }

    static GetPreCompileInfo():ShaderCompileInfo {
        return ShaderCodeBuffer.s_coder.getPreCompileInfo();
    }
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
        
        this.adaptationShaderVersion = false;        
        let coder = ShaderCodeBuffer.s_coder;
        coder.reset();

        coder.addVertLayout("vec3", "a_vs");
        coder.addFragOutput("vec4", "FragColor0");
        coder.addFragUniform("vec4", "u_color");

        coder.useVertSpaceMats(true, true, true);

        if(this.premultiplyAlpha) coder.addDefine("VOX_PREMULTIPLY_ALPHA", "1");
        if(this.m_texEnabled) {
            coder.addTextureSample2D();
            coder.addVertLayout("vec2", "a_uvs");
            coder.addVarying("vec2", "v_uv");
        }
        if(this.vtxColorEnabled) {
            coder.addDefine("VOX_USE_VTX_COLOR", "1");
            coder.addVertLayout("vec3", "a_cvs");
            coder.addVarying("vec3", "v_cv");
        }
        
        coder.addFragMainCode(
`
void main(){

    FragColor0 = vec4(1.0);
    #ifdef VOX_USE_2D_MAP
        //  FragColor0 *= VOX_Texture2D(u_sampler0, vec2(v_uv[0],v_uv[1]));
        FragColor0 *= VOX_Texture2D(u_sampler0, v_uv.xy);
    #endif
    #ifdef VOX_USE_VTX_COLOR
        FragColor0 *= vec4(v_cv.xyz,1.0);
    #endif
    #ifdef VOX_PREMULTIPLY_ALPHA
        FragColor0.rgb *= u_color.xyz;
        FragColor0.a *= u_color.w;
        FragColor0.rgb *= u_color.aaa;
    #else
        FragColor0 *= u_color;
    #endif
}
`
                    );
            
        return coder.buildFragCode();
    }
    getVtxShaderCode():string
    {
        if(ShaderCodeBuffer.___s_csBuf != this) return ShaderCodeBuffer.___s_csBuf.getVtxShaderCode();
        let coder: ShaderCodeBuilder2 = ShaderCodeBuffer.s_coder;
        
        coder.addVertMainCode(
`
void main(){
    
    gl_Position = u_projMat * u_viewMat * u_objMat * vec4(a_vs.xyz,1.0);

    #ifdef VOX_USE_2D_MAP
        v_uv = a_uvs.xy;
    #endif
    #ifdef VOX_USE_VTX_COLOR
        v_cv = a_cvs.xyz;
    #endif
}
`
        );
        return coder.buildVertCode();
    }
    getUniqueShaderName(): string
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