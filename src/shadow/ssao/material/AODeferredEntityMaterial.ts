/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ShaderCodeBuffer from "../../../vox/material/ShaderCodeBuffer";
import ShaderCodeBuilder2 from "../../../vox/material/code/ShaderCodeBuilder2";
import ShaderUniformData from "../../../vox/material/ShaderUniformData";
import MaterialBase from "../../../vox/material/MaterialBase";

class AODeferredEntityShaderBuffer extends ShaderCodeBuffer
{
    constructor()
    {
        super();
    }
    private static s_instance:AODeferredEntityShaderBuffer = new AODeferredEntityShaderBuffer();
    private m_codeBuilder:ShaderCodeBuilder2 = new ShaderCodeBuilder2();
    private m_uniqueName:string = "";
    initialize(texEnabled:boolean):void
    {
        super.initialize(texEnabled);
        //console.log("AODeferredEntityShaderBuffer::initialize()...,texEnabled: "+texEnabled);
        this.m_uniqueName = "AODeferredEntityShd";
        this.adaptationShaderVersion = false;
    }
    private buildThisCode():void
    {

        let coder:ShaderCodeBuilder2 = this.m_codeBuilder;
        coder.reset();
        //coder.vertMatrixInverseEnabled = true;

        coder.addVertLayout("vec3","a_vs");
        coder.addVertLayout("vec2","a_uvs");
        coder.addVertLayout("vec3","a_nvs");
        
        coder.addVarying("vec2", "v_uv");
        coder.addVarying("vec3", "v_nv");

        coder.addFragOutput("vec4", "FragColor0");

        coder.addTextureSample2D();

        coder.useVertSpaceMats(true,true,true);

        coder.addFragFunction(
`

`
        );
    }
    getFragShaderCode():string
    {
        this.buildThisCode();

        this.m_codeBuilder.addFragMainCode(
`
void main() {
    vec4 color = VOX_Texture2D( u_sampler0, v_uv );
    FragColor0 = vec4(color.xyz * abs(v_nv), 1.0);
}
`
                        );
        
        return this.m_codeBuilder.buildFragCode();                    
    }
    getVtxShaderCode():string
    {
        this.m_codeBuilder.addVertMainCode(
`
void main() {
    mat4 viewMat4 = u_viewMat * u_objMat;
    vec4 viewPos = viewMat4 * vec4(a_vs, 1.0);

    gl_Position = u_projMat * viewPos;

    v_nv = a_nvs;
    v_uv = a_uvs.xy;
}
`
                        );
        return this.m_codeBuilder.buildVertCode();

    }
    getUniqueShaderName(): string
    {
        //console.log("H ########################### this.m_uniqueName: "+this.m_uniqueName);
        return this.m_uniqueName;
    }
    toString():string
    {
        return "[AODeferredEntityShaderBuffer()]";
    }
    static GetInstance():AODeferredEntityShaderBuffer
    {
        return AODeferredEntityShaderBuffer.s_instance;
    }
}

export default class AODeferredEntityMaterial extends MaterialBase
{
    constructor()
    {
        super();
    }
    
    getCodeBuf():ShaderCodeBuffer
    {        
        return AODeferredEntityShaderBuffer.GetInstance();
    }

    createSelfUniformData():ShaderUniformData
    {
        return null;
    }
}