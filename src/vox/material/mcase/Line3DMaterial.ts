/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ShaderUniformData from "../../../vox/material/ShaderUniformData";
import ShaderCodeBuffer from "../../../vox/material/ShaderCodeBuffer";
import MaterialBase from "../../../vox/material/MaterialBase";


class Line3DShaderBuffer extends ShaderCodeBuffer
{
    constructor()
    {
        super();
    }
    private static ___s_instance:Line3DShaderBuffer = null;
    private m_uniqueName:string = "";
    dynColorEnabled:boolean = false;
    initialize(texEnabled:boolean):void
    {
        //console.log("Line3DShaderBuffer::initialize()...");
        this.m_uniqueName = "Line3DShd";
        if(this.dynColorEnabled)
        {
            this.m_uniqueName += "_dynColor";
        }
    }
    getFragShaderCode():string
    {
        let fragCode:string = 
`precision mediump float;
varying vec3 v_vtxColor;
void main()
{
gl_FragColor = vec4(v_vtxColor, 1.0);
}
`;
        return fragCode;
    }
    getVtxShaderCode():string
    {
        let vtxCode:string = 
"\
precision mediump float;\n\
attribute vec3 a_vs;\n\
";
        if(this.dynColorEnabled)
        {
            vtxCode +=
"\
uniform vec4 u_color;\n\
";
        }
        else
        {
            vtxCode +=
"\
attribute vec3 a_cvs;\n\
";
        }
            vtxCode +=
`
uniform mat4 u_objMat;
uniform mat4 u_viewMat;
uniform mat4 u_projMat;
varying vec3 v_vtxColor;
void main()
{
vec4 pv = u_projMat * u_viewMat * u_objMat * vec4(a_vs,1.0);
// pixels move offset, and no perspective error.
//  pv.xy = (pv.xy/pv.w - vec2(0.5)) * pv.w;
gl_Position = pv;
`;

        if(this.dynColorEnabled)
        {
            vtxCode +=
"\
v_vtxColor = u_color.xyz;\n\
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
    getUniqueShaderName()
    {
        //console.log("H ########################### this.m_uniqueName: "+this.m_uniqueName);
        return this.m_uniqueName;
    }
    toString():string
    {
        return "[Line3DShaderBuffer()]";
    }

    static GetInstance():Line3DShaderBuffer
    {
        if(Line3DShaderBuffer.___s_instance != null)
        {
            return Line3DShaderBuffer.___s_instance;
        }
        Line3DShaderBuffer.___s_instance = new Line3DShaderBuffer();
        return Line3DShaderBuffer.___s_instance;
    }
}

export default class Line3DMaterial extends MaterialBase
{
    private m_dynColorEnabled:boolean = false;
    private m_colorArray:Float32Array = null;
    constructor(dynColorEnabled:boolean = false)
    {
        super();
        if(dynColorEnabled)
        {
            this.m_colorArray = new Float32Array([1.0,1.0,1.0,1.0]);
        }
        this.m_dynColorEnabled = dynColorEnabled;
    }
    
    getCodeBuf():ShaderCodeBuffer
    {
        Line3DShaderBuffer.GetInstance().dynColorEnabled = this.m_dynColorEnabled;
        return Line3DShaderBuffer.GetInstance();
    }
    
    
    setRGB3f(pr:number,pg:number,pb:number)
    {
        if(this.m_colorArray != null)
        {
            this.m_colorArray[0] = pr;
            this.m_colorArray[1] = pg;
            this.m_colorArray[2] = pb;
        }
    }
    createSelfUniformData():ShaderUniformData
    {
        if(this.m_dynColorEnabled)
        {
            let oum:ShaderUniformData = new ShaderUniformData();
            oum.uniformNameList = ["u_color"];
            oum.dataList = [this.m_colorArray];
            return oum;
        }
        return null;
    }
}