/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ShaderUniformData from "../../../vox/material/ShaderUniformData";
import ShaderCodeBuffer from "../../../vox/material/ShaderCodeBuffer";
import MaterialBase from "../../../vox/material/MaterialBase";


class QuadLine3DShaderBuffer extends ShaderCodeBuffer
{
    constructor()
    {
        super();
    }
    private static s_instance:QuadLine3DShaderBuffer = null;
    private m_uniqueName:string = "";
    dynColorEnabled:boolean = false;
    initialize(texEnabled:boolean):void
    {
        //console.log("QuadLine3DShaderBuffer::initialize()...");
        this.m_uniqueName = "QuadLine3DShd";
        if(this.dynColorEnabled)
        {
            this.m_uniqueName += "_dynColor";
        }
    }
    getFragShaderCode():string
    {
        let fragCode:string = 
"\
precision mediump float;\n\
varying vec4 v_vtxColor;\n\
uniform vec4 u_color;\n\
void main()\n\
{\
gl_FragColor = v_vtxColor * u_color;\n\
}\n\
";
        return fragCode;
    }
    getVtxShaderCode():string
    {
        let vtxCode:string = 
"\
precision mediump float;\n\
attribute vec4 a_vs;\n\
attribute vec4 a_vs2;\n\
";
        if(this.dynColorEnabled)
        {
            vtxCode +=
"\
";
        }
        else
        {
            vtxCode +=
"\
attribute vec4 a_cvs;\n\
";
        }
            vtxCode +=
"\
uniform vec4 u_stageParam;\n\
uniform vec4 u_frustumParam;\n\
uniform mat4 u_objMat;\n\
uniform mat4 u_viewMat;\n\
uniform mat4 u_projMat;\n\
varying vec4 v_vtxColor;\n\
void main()\n\
{\n\
mat4 voMat4 = u_viewMat * u_objMat;\n\
vec4 pv1 = voMat4 * vec4(a_vs.xyz, 1.0);\n\
vec4 pv2 = voMat4 * vec4(a_vs2.xyz, 1.0);\n\
vec3 dir = pv2.xyz - pv1.xyz;\n\
float f = (pv1.z > -u_frustumParam[0]) ? 1.0 : 0.0;\n\
vec3 pv3 = ((pv1.z - 1.0)/(pv1.z - pv2.z + 0.000001)) * dir;\n\
pv3 = (pv1.xyz + pv3) * f;\n\
pv1.xyz = pv1.xyz * (1.0 - f) + pv3;\n\
// calc screen pos\n\
f = a_vs.w * abs(pv1.z) * u_frustumParam[3] / u_frustumParam[0] / u_stageParam[2];\n\
dir = pv2.xyz - pv1.xyz;\n\
pv3 = normalize(cross(dir, pv1.xyz)) * f;\n\
gl_Position = u_projMat * vec4(pv3 + pv1.xyz, 1.0);\n\
v_vtxColor = a_cvs;\n\
";

        if(this.dynColorEnabled)
        {
            vtxCode +=
"\
v_vtxColor = vec4(1.0);\n\
";
        }
        else
        {
            vtxCode +=
"\
v_vtxColor = a_cvs;\n\
";
        }
                vtxCode +=
"\
}\n\
";
        return vtxCode;
    }
    getUniqueShaderName(): string
    {
        //console.log("H ########################### this.m_uniqueName: "+this.m_uniqueName);
        return this.m_uniqueName;
    }
    toString():string
    {
        return "[QuadLine3DShaderBuffer()]";
    }

    static GetInstance():QuadLine3DShaderBuffer
    {
        if(QuadLine3DShaderBuffer.s_instance != null)
        {
            return QuadLine3DShaderBuffer.s_instance;
        }
        QuadLine3DShaderBuffer.s_instance = new QuadLine3DShaderBuffer();
        return QuadLine3DShaderBuffer.s_instance;
    }
}

export default class QuadLine3DMaterial extends MaterialBase
{
    private m_dynColorEnabled:boolean = false;
    private m_colorArray:Float32Array = new Float32Array([1.0,1.0,1.0,1.0]);
    constructor(dynColorEnabled:boolean = false)
    {
        super();
        this.m_dynColorEnabled = dynColorEnabled;
    }
    
    protected buildBuf(): void {
        let buf: QuadLine3DShaderBuffer = QuadLine3DShaderBuffer.GetInstance();
        buf.dynColorEnabled = this.m_dynColorEnabled;
    }
    getCodeBuf():ShaderCodeBuffer
    {        
        return QuadLine3DShaderBuffer.GetInstance();
    }
    
    
    setRGB3f(pr:number,pg:number,pb:number)
    {
        this.m_colorArray[0] = pr;
        this.m_colorArray[1] = pg;
        this.m_colorArray[2] = pb;
    }
    setRGBA4f(pr:number,pg:number,pb:number,pa:number)
    {
        this.m_colorArray[0] = pr;
        this.m_colorArray[1] = pg;
        this.m_colorArray[2] = pb;
        this.m_colorArray[3] = pa;
    }
    createSelfUniformData():ShaderUniformData
    {
        let oum:ShaderUniformData = new ShaderUniformData();
        oum.uniformNameList = ["u_color"];
        oum.dataList = [this.m_colorArray];
        return oum;
    }
}