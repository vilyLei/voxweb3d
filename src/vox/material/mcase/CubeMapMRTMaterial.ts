/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ShaderCodeBuffer from "../../../vox/material/ShaderCodeBuffer";
import ShaderUniformData from "../../../vox/material/ShaderUniformData";
import MaterialBase from "../../../vox/material/MaterialBase";

class CubeMapMRTShaderBuffer extends ShaderCodeBuffer
{
    constructor()
    {
        super();
    }
    private static ___s_instance:CubeMapMRTShaderBuffer = new CubeMapMRTShaderBuffer();
    private m_uniqueName:string = "";
    initialize(texEnabled:boolean):void
    {
        //console.log("CubeMapMRTShaderBuffer::initialize()...");
        this.m_uniqueName = "CubeMapMRTShd";
    }
    getFragShaderCode():string
    {
        let fragCode:string = 
`#version 300 es
precision mediump float;
uniform sampler2D u_sampler0;
uniform vec4 u_color;
in vec3 v_nv;
in vec2 v_uvs;
layout(location = 0) out vec4 OutputColor0;
layout(location = 1) out vec4 OutputColor1;
layout(location = 2) out vec4 OutputColor2;
layout(location = 3) out vec4 OutputColor3;
layout(location = 4) out vec4 OutputColor4;
layout(location = 5) out vec4 OutputColor5;
void main()
{
OutputColor0 = texture(u_sampler0, v_uvs.xy) * u_color;
OutputColor1 = vec4(1.0,0.0,0.0,1.0);
OutputColor2 = vec4(0.0,1.0,0.0,1.0);
OutputColor3 = vec4(0.0,0.0,1.0,1.0);
OutputColor4 = vec4(1.0,0.0,1.0,1.0);
OutputColor5 = vec4(1.0,1.0,0.0,1.0);
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
out vec3 v_nv;
out vec2 v_uvs;
void main()
{
gl_Position = u_projMat * u_viewMat * u_objMat * vec4(a_vs,1.0);
v_nv = a_nvs;
v_uvs = a_uvs;
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
        return "[CubeMapMRTShaderBuffer()]";
    }

    static GetInstance():CubeMapMRTShaderBuffer
    {
        return CubeMapMRTShaderBuffer.___s_instance;
    }
}

export default class CubeMapMRTMaterial extends MaterialBase
{
    constructor()
    {
        super();
    }
    
    getCodeBuf():ShaderCodeBuffer
    {
        return CubeMapMRTShaderBuffer.GetInstance();
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