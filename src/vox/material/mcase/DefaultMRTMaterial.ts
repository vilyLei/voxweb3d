/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import RendererDeviece from "../../../vox/render/RendererDeviece";
import ShaderCodeBuffer from "../../../vox/material/ShaderCodeBuffer";
import ShaderUniformData from "../../../vox/material/ShaderUniformData";
import MaterialBase from "../../../vox/material/MaterialBase";


class DefaultMRTShaderBuffer extends ShaderCodeBuffer
{
    constructor()
    {
        super();
    }
    private static s_instance:DefaultMRTShaderBuffer = new DefaultMRTShaderBuffer();
    private m_uniqueName:string = "";
    initialize(texEnabled:boolean):void
    {
        //console.log("DefaultMRTShaderBuffer::initialize()...");
        this.m_uniqueName = "DefaultMRTShd";
    }
    getFragShaderCode():string
    {
        let fragCode:string = "";
        if(RendererDeviece.IsWebGL2())
        {
        fragCode =
`#version 300 es
precision mediump float;
uniform sampler2D u_sampler0;
in vec2 v_uvs;
layout(location = 0) out vec4 FragColor0;
layout(location = 1) out vec4 FragColor1;
void main()
{
vec4 color = texture(u_sampler0, v_uvs);
FragColor0 = vec4(color.rgb,1.0);
FragColor1 = vec4(1.0 - color.rgb * color.rgb * color.rgb,1.0);
}
`
        }
        else
        {
            fragCode =
`
#extension GL_EXT_draw_buffers: require
precision mediump float;
uniform sampler2D u_sampler0;
varying vec2 v_uvs;
void main()
{
vec4 color = texture2D(u_sampler0, v_uvs);
gl_FragData[0] = vec4(color.rgb,1.0);
gl_FragData[1] = vec4(1.0 - color.rgb * color.rgb * color.rgb,1.0);
}
`;
        }
        return fragCode;
    }
    getVtxShaderCode():string
    {
        let vtxCode:string = "";
        if(RendererDeviece.IsWebGL2())
        {
            vtxCode =
`#version 300 es
precision mediump float;
layout(location = 0) in vec3 a_vs;
layout(location = 1) in vec2 a_uvs;
uniform mat4 u_objMat;
uniform mat4 u_viewMat;
uniform mat4 u_projMat;
out vec2 v_uvs;
void main(){
mat4 viewMat4 = u_viewMat * u_objMat;
vec4 viewPos = viewMat4 * vec4(a_vs, 1.0);
gl_Position = u_projMat * viewPos;
v_uvs = a_uvs;
}
`;
        }
        else
        {
            vtxCode =
`
precision mediump float;
attribute vec3 a_vs;
attribute vec2 a_uvs;
uniform mat4 u_objMat;
uniform mat4 u_viewMat;
uniform mat4 u_projMat;
varying vec2 v_uvs;
void main(){
mat4 viewMat4 = u_viewMat * u_objMat;
vec4 viewPos = viewMat4 * vec4(a_vs, 1.0);
gl_Position = u_projMat * viewPos;
v_uvs = a_uvs;
}
`;
        }
        return vtxCode;
    }
    getUniqueShaderName(): string
    {
        //console.log("H ########################### this.m_uniqueName: "+this.m_uniqueName);
        return this.m_uniqueName;
    }
    toString():string
    {
        return "[DefaultMRTShaderBuffer()]";
    }

    static GetInstance():DefaultMRTShaderBuffer
    {
        return DefaultMRTShaderBuffer.s_instance;
    }
}

export default class DefaultMRTMaterial extends MaterialBase
{
    constructor()
    {
        super();
    }
    
    getCodeBuf():ShaderCodeBuffer
    {        
        return DefaultMRTShaderBuffer.GetInstance();
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