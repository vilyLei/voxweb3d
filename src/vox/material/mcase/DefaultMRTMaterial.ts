/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import RendererDevice from "../../../vox/render/RendererDevice";
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
        this.adaptationShaderVersion = false;
    }
    
    buildShader(): void {

        let coder = this.m_coder;
        coder.addVertLayout("vec3", "a_vs");
        coder.addVertLayout("vec2", "a_uvs");
        coder.addVarying("vec2", "v_texUV");
        // coder.useVertSpaceMats(true, false, false);

        this.m_uniform.add2DMap("MAP_0");
        // this.m_uniform.add2DMap("MAP_1");

        // uniform vec4 u_sphParam[5];
        // uniform vec4 u_frustumParam;
        // uniform vec4 u_viewParam;

        coder.addFragUniform("vec4", "u_sphParam", 5);
        coder.addFragUniform("vec4", "u_frustumParam");
        coder.addFragUniform("vec4", "u_viewParam");

        coder.addFragOutput("vec4", "FragColor0");
        coder.addFragOutput("vec4", "FragColor1");

        coder.addVertMainCode(
            `
            gl_Position = u_projMat * u_viewMat * u_objMat * vec4(a_vs, 1.0);
            v_texUV = a_uvs;
        `
        );
        coder.addFragMainCode(
            `
            vec4 color = VOX_Texture2D(MAP_0, v_texUV);
            FragColor0 = vec4(color.rgb,1.0);
            FragColor1 = vec4(1.0 - color.rgb * color.rgb * color.rgb,1.0);
            `
        );
    }
    /*
    getFragShaderCode():string
    {
        let fragCode:string = "";
        if(RendererDevice.IsWebGL2())
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
    getVertShaderCode():string
    {
        let vtxCode:string = "";
        if(RendererDevice.IsWebGL2())
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
    //*/
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