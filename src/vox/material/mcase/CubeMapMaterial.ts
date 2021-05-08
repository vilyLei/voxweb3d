/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ShaderCodeBuffer from "../../../vox/material/ShaderCodeBuffer";
import ShaderUniformData from "../../../vox/material/ShaderUniformData";
import MaterialBase from "../../../vox/material/MaterialBase";

class CubeMapShaderBuffer extends ShaderCodeBuffer
{
    constructor()
    {
        super();
    }
    private static ___s_instance:CubeMapShaderBuffer = null;
    private m_uniqueName:string = "";
    initialize(texEnabled:boolean):void
    {
        //console.log("CubeMapShaderBuffer::initialize()...");
        this.m_uniqueName = "CubeMapShd";
    }
    getFragShaderCode():string
    {
        let fragCode:string = 
`#version 300 es
precision mediump float;
uniform samplerCube u_sampler0;
uniform vec4 u_color;
in vec3 v_nvs;
layout(location = 0) out vec4 FragColor;
void main()
{
vec4 color4 = texture(u_sampler0, v_nvs) * u_color;
FragColor = color4 * 0.5 + 0.5 * vec4(abs(v_nvs),1.0);
}
`;
        return fragCode;
    }
    getVtxShaderCode():string
    {
        let vtxCode:string = 
`#version 300 es
precision mediump float;
layout(location = 0) in vec3 a_vs;
layout(location = 1) in vec2 a_uvs;
layout(location = 2) in vec3 a_nvs;
uniform mat4 u_objMat;
uniform mat4 u_viewMat;
uniform mat4 u_projMat;
out vec3 v_nvs;
void main()
{
vec4 wpos = u_objMat * vec4(a_vs,1.0);
gl_Position = u_projMat * u_viewMat * wpos;
v_nvs = a_nvs;
}
`;
        return vtxCode;
    }
    getUniqueShaderName()
    {
        //console.log("H ########################### this.m_uniqueName: "+this.m_uniqueName);
        return this.m_uniqueName;
    }
    toString():string
    {
        return "[CubeMapShaderBuffer()]";
    }

    static GetInstance():CubeMapShaderBuffer
    {
        if(CubeMapShaderBuffer.___s_instance != null)
        {
            return CubeMapShaderBuffer.___s_instance;
        }
        CubeMapShaderBuffer.___s_instance = new CubeMapShaderBuffer();
        return CubeMapShaderBuffer.___s_instance;
    }
}

export default class CubeMapMaterial extends MaterialBase
{
    constructor()
    {
        super();
    }
    
    getCodeBuf():ShaderCodeBuffer
    {        
        return CubeMapShaderBuffer.GetInstance();
    }
    colorArray:Float32Array = new Float32Array([1.0,1.0,1.0,1.0]);
    
    createSelfUniformData():ShaderUniformData
    {
        let oum:ShaderUniformData = new ShaderUniformData();
        oum.uniformNameList = ["u_color"];
        oum.dataList = [this.colorArray];
        return oum;
    }
}