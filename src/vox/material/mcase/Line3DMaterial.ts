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
            export class Line3DShaderBuffer extends ShaderCodeBuffer
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
"\
precision mediump float;\n\
varying vec3 v_vtxColor;\n\
void main()\n\
{\
    gl_FragColor = vec4(v_vtxColor, 1.0);\n\
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
"\
uniform mat4 u_objMat;\n\
uniform mat4 u_viewMat;\n\
uniform mat4 u_projMat;\n\
varying vec3 v_vtxColor;\n\
void main()\n\
{\n\
    vec4 pv = u_projMat * u_viewMat * u_objMat * vec4(a_vs,1.0);\n\
    // pixels move offset, and no perspective error.\n\
    //  pv.xy = (pv.xy/pv.w - vec2(0.5)) * pv.w;\n\
    gl_Position = pv;\n\
";

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
            
            export class Line3DMaterial extends MaterialBase
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