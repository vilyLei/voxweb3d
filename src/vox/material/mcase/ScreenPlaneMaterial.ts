/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ShaderCodeBuffer from "../../../vox/material/ShaderCodeBuffer";
import ShaderUniformData from "../../../vox/material/ShaderUniformData";
import ShaderGlobalUniform from "../../../vox/material/ShaderGlobalUniform";
import MaterialBase from "../../../vox/material/MaterialBase";

class ScreenPlaneShaderBuffer extends ShaderCodeBuffer
{
    constructor()
    {
        super();
    }
    private static ___s_instance:ScreenPlaneShaderBuffer = null;
    private m_uniqueName:string = "";
    private m_hasTex:boolean = false;
    initialize(texEnabled:boolean):void
    {
        console.log("ScreenPlaneShaderBuffer::initialize()... texEnabled: "+texEnabled);
        this.m_uniqueName = "ScreenPlaneShd";
        this.m_hasTex = texEnabled;
        if(texEnabled)
        {
            this.m_uniqueName += "_tex";
        }
    }
    getFragShaderCode():string
    {
        let fragCode:string = 
"\
precision mediump float;\n\
uniform vec4 u_color;\n\
";
        if(this.m_hasTex)
        {

            fragCode +=
"\
uniform sampler2D u_sampler0;\n\
uniform vec4 u_offsetColor;\n\
varying vec2 v_texUV;\n\
";
        }
        fragCode +=
"\
void main()\n\
{\n\
";
        if(this.m_hasTex)
        {
            fragCode +=
"\
gl_FragColor = texture2D(u_sampler0, v_texUV) * u_color + u_offsetColor;\n\
";
        }
        else
        {
            fragCode +=
"\
gl_FragColor = u_color;\n\
";
        }
        fragCode +=
"\
}\n\
";
        return fragCode;
    }
    getVtxShaderCode():string
    {
        let vtxCode:string = 
"\
precision mediump float;\n\
attribute vec3 a_vs;\n\
uniform mat4 u_objMat;\n\
";
        if(this.m_hasTex)
        {
            vtxCode +=
"\
attribute vec2 a_uvs;\n\
varying vec2 v_texUV;\n\
";
        }
        vtxCode +=
"\
void main()\n\
{\n\
gl_Position = u_objMat * vec4(a_vs,1.0);\n\
";
        if(this.m_hasTex)
        {
            vtxCode +=
"\
v_texUV = a_uvs;\n\
";
        }
        vtxCode +=
"\
}\n\
";
        return vtxCode;
    }
    getUniqueShaderName()
    {
        //console.log("H ########################### this.m_uniqueName: "+this.m_uniqueName);
        return this.m_uniqueName;
    }
    toString():string
    {
        return "[ScreenPlaneShaderBuffer()]";
    }

    static GetInstance():ScreenPlaneShaderBuffer
    {
        if(ScreenPlaneShaderBuffer.___s_instance != null)
        {
            return ScreenPlaneShaderBuffer.___s_instance;
        }
        ScreenPlaneShaderBuffer.___s_instance = new ScreenPlaneShaderBuffer();
        return ScreenPlaneShaderBuffer.___s_instance;
    }
}

export default class ScreenPlaneMaterial extends MaterialBase
{
    constructor()
    {
        super();
    }
    
    getCodeBuf():ShaderCodeBuffer
    {
        return ScreenPlaneShaderBuffer.GetInstance();
    }
    private m_colorArray:Float32Array = new Float32Array([1.0,1.0,1.0,1.0]);
    private m_offsetColorArray:Float32Array = new Float32Array([0.0,0.0,0.0,0.0]);
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
    setOffsetRGB3f(pr:number,pg:number,pb:number):void
    {
        this.m_offsetColorArray[0] = pr;
        this.m_offsetColorArray[1] = pg;
        this.m_offsetColorArray[2] = pb;
    }
    setOffsetRGBA4f(pr:number,pg:number,pb:number,pa:number):void
    {
        this.m_offsetColorArray[0] = pr;
        this.m_offsetColorArray[1] = pg;
        this.m_offsetColorArray[2] = pb;
        this.m_offsetColorArray[3] = pa;
    }
    createSharedUniform():ShaderGlobalUniform
    {
        return null;
    }
    createSelfUniformData():ShaderUniformData
    {
        let oum:ShaderUniformData = new ShaderUniformData();
        oum.uniformNameList = ["u_color", "u_offsetColor"];
        oum.dataList = [this.m_colorArray, this.m_offsetColorArray];
        return oum;
    }
}