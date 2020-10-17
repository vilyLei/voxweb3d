/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as ShaderUniformDataT from "../../../vox/material/ShaderUniformData";
import * as ShaderCodeBufferT from "../../../vox/material/ShaderCodeBuffer";
import * as MaterialBaseT from "../../../vox/material/MaterialBase";

import ShaderUniformData = ShaderUniformDataT.vox.material.ShaderUniformData;
import ShaderCodeBuffer = ShaderCodeBufferT.vox.material.ShaderCodeBuffer;
import MaterialBase = MaterialBaseT.vox.material.MaterialBase;

export namespace vox
{
    export namespace material
    {
        export namespace mcase
        {
            export class BrokenQuadLine3DShaderBuffer extends ShaderCodeBuffer
            {
                constructor()
                {
                    super();
                }
                private static ___s_instance:BrokenQuadLine3DShaderBuffer = null;
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
"\
precision mediump float;\n\
varying vec4 v_vtxColor;\n\
void main()\n\
{\
    gl_FragColor = v_vtxColor;\n\
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
uniform vec4 u_color;\n\
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
attribute vec4 a_cvs2;\n\
uniform vec4 u_stageParam;\n\
uniform vec4 u_cameraParam;\n\
uniform mat4 u_objMat;\n\
uniform mat4 u_viewMat;\n\
uniform mat4 u_projMat;\n\
varying vec4 v_vtxColor;\n\
void main()\n\
{\n\
    mat4 voMat4 = u_viewMat * u_objMat;\n\
    vec4 pv0 = voMat4 * vec4(a_cvs2.xyz, 1.0);\n\
    vec4 pv1 = voMat4 * vec4(a_vs.xyz, 1.0);\n\
    vec4 pv1b = pv1;\n\
    vec4 pv2 = voMat4 * vec4(a_vs2.xyz, 1.0);\n\
    \n\
    float f = (pv1.z > -u_cameraParam[0]) ? 1.0 : 0.0;\n\
    vec3 dir = pv2.xyz - pv1.xyz;\n\
    vec3 pv3 = ((pv1.z - 1.0)/(pv1.z - pv2.z + 0.000001)) * dir;\n\
    pv3 = (pv1.xyz + pv3) * f;\n\
    pv1.xyz = pv1.xyz * (1.0 - f) + pv3;\n\
    // calc screen pos\n\
    dir = pv2.xyz - pv1.xyz;\n\
    f = abs(pv1.z) * u_cameraParam[3] / u_cameraParam[0] / u_stageParam[2];\n\
    pv3 = normalize(cross(dir, pv1.xyz)) * f;\n\
    \n\
    f = (pv0.z > -u_cameraParam[0]) ? 1.0 : 0.0;\n\
    dir = pv1b.xyz - pv0.xyz;\n\
    vec3 pv3b = ((pv0.z - 1.0)/(pv0.z - pv1b.z + 0.000001)) * dir;\n\
    pv3b = (pv0.xyz + pv3b) * f;\n\
    pv0.xyz = pv0.xyz * (1.0 - f) + pv3b;\n\
    // calc screen pos\n\
    dir = pv1b.xyz - pv0.xyz;\n\
    f = abs(pv0.z) * u_cameraParam[3] / u_cameraParam[0] / u_stageParam[2];\n\
    pv3b = normalize(cross(dir, pv0.xyz)) * f;\n\
    \n\
    //  if(dot(pv3,pv3b) < 0.0)\n\
    //  {\n\
        dir = pv3;\n\
        pv3 = normalize(pv3 + pv3b);\n\
        //pv3 *= a_vs.w / max(abs(dot(pv3,dir)),0.01);\n\
        //pv3 *= a_vs.w / min(abs(dot(pv3,dir)),10.0);\n\
        pv3 *= a_vs.w / abs(dot(pv3,dir));\n\
    //  }\n\
    //  else\n\
    //  {\n\
    //      pv3 *= a_vs.w;\n\
    //  }\n\
    gl_Position = u_projMat * vec4(pv3 + pv1.xyz, 1.0);\n\
    v_vtxColor = a_cvs;\n\
";

                    if(this.dynColorEnabled)
                    {
                        vtxCode +=
"\
    v_vtxColor = u_color;\n\
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
                    return "[BrokenQuadLine3DShaderBuffer()]";
                }

                static GetInstance():BrokenQuadLine3DShaderBuffer
                {
                    if(BrokenQuadLine3DShaderBuffer.___s_instance != null)
                    {
                        return BrokenQuadLine3DShaderBuffer.___s_instance;
                    }
                    BrokenQuadLine3DShaderBuffer.___s_instance = new BrokenQuadLine3DShaderBuffer();
                    return BrokenQuadLine3DShaderBuffer.___s_instance;
                }
            }
            
            export class BrokenQuadLine3DMaterial extends MaterialBase
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
                        oum.dataSizeList = [1];
                        oum.uniformNameList = ["u_color"];
                        oum.dataList = [this.m_colorArray];
                        return oum;
                    }
                    return null;
                }
            }
        }
    }
}