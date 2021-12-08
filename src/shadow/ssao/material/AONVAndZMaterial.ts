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

class AONVAndZShaderBuffer extends ShaderCodeBuffer
{
    constructor()
    {
        super();
    }
    private static s_instance:AONVAndZShaderBuffer = new AONVAndZShaderBuffer();
    private m_uniqueName:string = "";
    initialize(texEnabled:boolean):void
    {
        super.initialize(texEnabled);
        //console.log("AONVAndZShaderBuffer::initialize()...,texEnabled: "+texEnabled);
        this.m_uniqueName = "AONVAndZShd";
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
        coder.addVarying("vec3", "v_nv");
        coder.addVarying("vec2", "v_uv");

        coder.addFragOutput("vec4", "FragColor0");

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
    FragColor0 = vec4(normalize(v_nv), v_posZ);
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

    mat4 viewMat4 = u_viewMat * u_objMat;
    vec4 viewPos = viewMat4 * vec4(a_vs, 1.0);

    gl_Position = u_projMat * viewPos;
    mat3 viewMat3 = inverse(mat3(viewMat4));

    v_uv = a_uvs;
    v_posZ = -viewPos.z;
    v_nv = a_nvs * viewMat3;
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
        return "[AONVAndZShaderBuffer()]";
    }
    static GetInstance():AONVAndZShaderBuffer
    {
        return AONVAndZShaderBuffer.s_instance;
    }
}

export default class AONVAndZMaterial extends MaterialBase
{
    constructor()
    {
        super();
    }
    
    getCodeBuf():ShaderCodeBuffer
    {        
        return AONVAndZShaderBuffer.GetInstance();
    }

    createSelfUniformData():ShaderUniformData
    {
        return null;
    }
}