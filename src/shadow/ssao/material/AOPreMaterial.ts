/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ShaderCodeBuffer from "../../../vox/material/ShaderCodeBuffer";
import ShaderCodeBuilder from "../../../vox/material/code/ShaderCodeBuilder";
import ShaderUniformData from "../../../vox/material/ShaderUniformData";
import MaterialBase from "../../../vox/material/MaterialBase";

class AOPreShaderBuffer extends ShaderCodeBuffer
{
    constructor()
    {
        super();
    }
    private static s_instance:AOPreShaderBuffer = new AOPreShaderBuffer();
    private m_uniqueName:string = "";
    initialize(texEnabled:boolean):void
    {
        super.initialize(texEnabled);
        //console.log("AOPreShaderBuffer::initialize()...,texEnabled: "+texEnabled);
        this.m_uniqueName = "AOPreShd";
        this.adaptationShaderVersion = false;
    }
    private buildThisCode():void
    {

        let coder:ShaderCodeBuilder = this.m_coder;
        coder.reset();
        coder.vertMatrixInverseEnabled = true;

        coder.addVertLayout("vec3","a_vs");
        coder.addVertLayout("vec2","a_uvs");
        coder.addVertLayout("vec3","a_nvs");
        
        coder.addVarying("float", "v_posZ");
        coder.addVarying("vec2", "v_uv");
        coder.addVarying("vec3", "v_nv");

        coder.addFragOutput("vec4", "FragColor0");
        coder.addFragOutput("vec4", "FragColor1");

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

        this.m_coder.addFragMainCode(
`
void main() {
    vec4 color = VOX_Texture2D( u_sampler0, v_uv );
    FragColor0 = vec4(color.xyz, 1.0);
    FragColor1 = vec4(normalize(v_nv), v_posZ);
}
`
                        );
        
        return this.m_coder.buildFragCode();                    
    }
    getVertShaderCode():string
    {
        this.m_coder.addVertMainCode(
`
void main() {
    mat4 viewMat4 =u_viewMat * u_objMat;
    vec4 viewPos = viewMat4 * vec4(a_vs, 1.0);

    gl_Position = u_projMat * viewPos;
    mat3 viewMat3 = inverse(mat3(viewMat4));

    v_posZ = -viewPos.z;
    v_nv = a_nvs * viewMat3;
    v_uv = a_uvs.xy;
}
`
                        );
        return this.m_coder.buildVertCode();

    }
    getUniqueShaderName(): string
    {
        //console.log("H ########################### this.m_uniqueName: "+this.m_uniqueName);
        return this.m_uniqueName;
    }
    toString():string
    {
        return "[AOPreShaderBuffer()]";
    }
    static GetInstance():AOPreShaderBuffer
    {
        return AOPreShaderBuffer.s_instance;
    }
}

export default class AOPreMaterial extends MaterialBase
{
    constructor()
    {
        super();
    }
    
    getCodeBuf():ShaderCodeBuffer
    {        
        return AOPreShaderBuffer.GetInstance();
    }

    createSelfUniformData():ShaderUniformData
    {
        return null;
    }
}