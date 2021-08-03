/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ShaderUniformData from "../../../vox/material/ShaderUniformData";
import ShaderCodeBuffer from "../../../vox/material/ShaderCodeBuffer";
import MaterialBase from "../../../vox/material/MaterialBase";
class BrokenQuadLine3DShaderBuffer extends ShaderCodeBuffer
{
    constructor()
    {
        super();
    }
    private static s_instance:BrokenQuadLine3DShaderBuffer = null;
    private m_uniqueName:string = "";
    dynColorEnabled:boolean = false;
    initialize(texEnabled:boolean):void
    {
        //console.log("BrokenQuadLine3DShaderBuffer::initialize()...");
        this.m_uniqueName = "BrokenQuadLine3DShd";
        if(this.dynColorEnabled)
        {
            this.m_uniqueName += "_dynColor";
        }
    }
    getFragShaderCode():string
    {
        let fragCode:string = 
`
precision mediump float;
varying vec4 v_vtxColor;
void main()
{
gl_FragColor = v_vtxColor;
}
`;
        return fragCode;
    }
    getVtxShaderCode():string
    {
        let vtxCode:string = 
`
precision mediump float;
attribute vec4 a_vs;
attribute vec4 a_vs2;
`;
        if(this.dynColorEnabled)
        {
            vtxCode += "\nuniform vec4 u_color;";
        }
        else
        {
            vtxCode += "\nattribute vec4 a_cvs;";
        }
        vtxCode +=
`
attribute vec4 a_cvs2;
uniform vec4 u_stageParam;
uniform vec4 u_cameraParam;
uniform mat4 u_objMat;
uniform mat4 u_viewMat;
uniform mat4 u_projMat;
varying vec4 v_vtxColor;
void main()
{
mat4 voMat4 = u_viewMat * u_objMat;
vec4 pv0 = voMat4 * vec4(a_cvs2.xyz, 1.0);
vec4 pv1 = voMat4 * vec4(a_vs.xyz, 1.0);
vec4 pv1b = pv1;
vec4 pv2 = voMat4 * vec4(a_vs2.xyz, 1.0);

float f = (pv1.z > -u_cameraParam[0]) ? 1.0 : 0.0;
vec3 dir = pv2.xyz - pv1.xyz;
vec3 pv3 = ((pv1.z - 1.0)/(pv1.z - pv2.z + 0.000001)) * dir;
pv3 = (pv1.xyz + pv3) * f;
pv1.xyz = pv1.xyz * (1.0 - f) + pv3;
// calc screen pos
dir = pv2.xyz - pv1.xyz;
f = abs(pv1.z) * u_cameraParam[3] / u_cameraParam[0] / u_stageParam[2];
pv3 = normalize(cross(dir, pv1.xyz)) * f;

f = (pv0.z > -u_cameraParam[0]) ? 1.0 : 0.0;
dir = pv1b.xyz - pv0.xyz;
vec3 pv3b = ((pv0.z - 1.0)/(pv0.z - pv1b.z + 0.000001)) * dir;
pv3b = (pv0.xyz + pv3b) * f;
pv0.xyz = pv0.xyz * (1.0 - f) + pv3b;
// calc screen pos
dir = pv1b.xyz - pv0.xyz;
f = abs(pv0.z) * u_cameraParam[3] / u_cameraParam[0] / u_stageParam[2];
pv3b = normalize(cross(dir, pv0.xyz)) * f;

//  if(dot(pv3,pv3b) < 0.0)
//  {
dir = pv3;
pv3 = normalize(pv3 + pv3b);
//pv3 *= a_vs.w / max(abs(dot(pv3,dir)),0.01);
//pv3 *= a_vs.w / min(abs(dot(pv3,dir)),10.0);
pv3 *= a_vs.w / abs(dot(pv3,dir));
//  }
//  else
//  {
//      pv3 *= a_vs.w;
//  }
gl_Position = u_projMat * vec4(pv3 + pv1.xyz, 1.0);
v_vtxColor = a_cvs;
`

        if(this.dynColorEnabled)
        {
            vtxCode += "\nv_vtxColor = u_color;";
        }
        else
        {
            vtxCode += "\nv_vtxColor = a_cvs;";
        }
        vtxCode += "\n}";
        return vtxCode;
    }
    getUniqueShaderName(): string
    {
        //console.log("H ########################### this.m_uniqueName: "+this.m_uniqueName);
        return this.m_uniqueName;
    }
    toString():string
    {
        return "[BrokenQuadLine3DShaderBuffer()]";
    }

    static GetInstance():BrokenQuadLine3DShaderBuffer
    {
        if(BrokenQuadLine3DShaderBuffer.s_instance != null)
        {
            return BrokenQuadLine3DShaderBuffer.s_instance;
        }
        BrokenQuadLine3DShaderBuffer.s_instance = new BrokenQuadLine3DShaderBuffer();
        return BrokenQuadLine3DShaderBuffer.s_instance;
    }
}

export default class BrokenQuadLine3DMaterial extends MaterialBase
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
        BrokenQuadLine3DShaderBuffer.GetInstance().dynColorEnabled = this.m_dynColorEnabled;
        return BrokenQuadLine3DShaderBuffer.GetInstance();
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