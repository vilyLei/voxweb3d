/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ShaderCodeBuffer from "../../../vox/material/ShaderCodeBuffer";
import ShaderCodeBuilder from "../../../vox/material/code/ShaderCodeBuilder";
import ShaderUniformData from "../../../vox/material/ShaderUniformData";
import MaterialBase from "../../../vox/material/MaterialBase";

class AOPostShaderBuffer extends ShaderCodeBuffer
{
    constructor()
    {
        super();
    }
    private static s_instance:AOPostShaderBuffer = new AOPostShaderBuffer();
    private m_codeBuilder:ShaderCodeBuilder = new ShaderCodeBuilder();
    private m_uniqueName:string = "";
    initialize(texEnabled:boolean):void
    {
        super.initialize(texEnabled);
        //console.log("AOPostShaderBuffer::initialize()...,texEnabled: "+texEnabled);
        this.m_uniqueName = "AOPostShd";
        this.adaptationShaderVersion = false;
    }
    private buildThisCode():void
    {

        let coder:ShaderCodeBuilder = this.m_codeBuilder;
        coder.reset();

        coder.addVertLayout("vec3","a_vs");
        coder.addVertLayout("vec2","a_uvs");
        
        coder.addVarying("vec2", "v_uv");

        coder.addFragOutput("vec4", "FragColor0");

        coder.addTextureSample2D();
        coder.addTextureSample2D();

        coder.useVertSpaceMats(false,false,false);

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
    float ao = VOX_Texture2D( u_sampler1, v_uv ).r;
    ao *= ao;
    //ao = max(ao - 0.1,0.0);
    FragColor0 = vec4(vec3(ao), 1.0);
    //FragColor0 = vec4(mix(vec3(0.0), color.xyz, ao), 1.0);
    // highlight dege glow
    //FragColor0 = vec4(color.xyz + vec3(ao * 1.5), 1.0);
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
    gl_Position = vec4(a_vs,1.0);
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
        return "[AOPostShaderBuffer()]";
    }
    static GetInstance():AOPostShaderBuffer
    {
        return AOPostShaderBuffer.s_instance;
    }
}

export default class AOPostMaterial extends MaterialBase
{
    constructor()
    {
        super();
    }
    
    getCodeBuf():ShaderCodeBuffer
    {        
        return AOPostShaderBuffer.GetInstance();
    }

    createSelfUniformData():ShaderUniformData
    {
        return null;
    }
}