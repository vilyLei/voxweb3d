/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ShaderCodeBuffer from "../../vox/material/ShaderCodeBuffer";
import ShaderUniformData from "../../vox/material/ShaderUniformData";
import MaterialBase from "../../vox/material/MaterialBase";

class VSTexturePosIdRenderShaderBuffer extends ShaderCodeBuffer
{
    constructor()
    {
        super();
    }
    private static s_instance:VSTexturePosIdRenderShaderBuffer = null;
    private m_uniqueName:string = "";
    initialize(texEnabled:boolean):void
    {
        //console.log("VSTexturePosIdRenderShaderBuffer::initialize()...");
        this.m_uniqueName = "VSTexturePosIdMaterialShd";
    }
    getFragShaderCode():string
    {
        let fragCode:string = 
`#version 300 es
precision mediump float;
uniform sampler2D u_sampler1;
uniform vec4 u_color;
in vec2 v_uvs;
in vec4 v_color;
layout(location = 0) out vec4 FragColor;
void main(){
    vec4 color4 = texture(u_sampler1, v_uvs) * u_color;
    FragColor = color4;
}
`;
        return fragCode;
    }
    getVertShaderCode():string
    {
        let vtxCode:string = 
`#version 300 es
precision highp float;
layout(location = 0) in vec4 a_vs;
layout(location = 1) in vec2 a_uvs;
uniform sampler2D u_sampler0;
uniform mat4 u_objMat;
uniform mat4 u_viewMat;
uniform mat4 u_projMat;
uniform vec4 u_param;
out vec2 v_uvs;
void main(){
    float index = abs(mod((a_vs.w + u_param[1]),u_param[2]));
    index *= u_param[0];
    float pv = floor(index) * u_param[0];
    float pu = fract(index);
    vec4 pos4 = texture(u_sampler0, vec2(pu,pv));
    vec4 objPos = vec4(a_vs.xyz,1.0);
    objPos.xyz += pos4.xyz;
    gl_Position = u_projMat * u_viewMat * u_objMat * objPos;
    v_uvs = a_uvs;
}
`;
        return vtxCode;
    }
    getUniqueShaderName(): string
    {
        //console.log("H ########################### this.m_uniqueName: "+this.m_uniqueName);
        return this.m_uniqueName;
    }
    toString():string
    {
        return "[VSTexturePosIdRenderShaderBuffer()]";
    }
    static GetInstance():VSTexturePosIdRenderShaderBuffer
    {
        if(VSTexturePosIdRenderShaderBuffer.s_instance != null)
        {
            return VSTexturePosIdRenderShaderBuffer.s_instance;
        }
        VSTexturePosIdRenderShaderBuffer.s_instance = new VSTexturePosIdRenderShaderBuffer();
        return VSTexturePosIdRenderShaderBuffer.s_instance;
    }
}
export class VSTexturePosIdMaterial extends MaterialBase
{
    constructor()
    {
        super();
    }
    getCodeBuf():ShaderCodeBuffer
    {
        return VSTexturePosIdRenderShaderBuffer.GetInstance();
    }
    private m_colorArray:Float32Array = new Float32Array([1.0,1.0,1.0,1.0]);
    private m_posParam:Float32Array = new Float32Array([1.0/16,0.0,0.0,0.0]);
    private m_texSize:number = 16.0;
    setTexSize(size:number):void
    {
        this.m_texSize = size;
        this.m_posParam[0] = 1.0 / size;
    }
    setPosTotal(total:number):void
    {
        this.m_posParam[2] = total;
    }
    setMoveDis(index:number):void
    {
        this.m_posParam[1] = index;
    }
    setRGB3f(pr:number,pg:number,pb:number):void
    {
        this.m_colorArray[0] = pr;
        this.m_colorArray[1] = pg;
        this.m_colorArray[2] = pb;
    }
    setRGBA4f(pr:number,pg:number,pb:number,pa:number):void
    {
        this.m_colorArray[0] = pr;
        this.m_colorArray[1] = pg;
        this.m_colorArray[2] = pb;
        this.m_colorArray[3] = pa;
    }
    createSelfUniformData():ShaderUniformData
    {
        let oum:ShaderUniformData = new ShaderUniformData();
        oum.uniformNameList = ["u_param","u_color"];
        oum.dataList = [this.m_posParam,this.m_colorArray];
        return oum;
    }
}
export default VSTexturePosIdMaterial;