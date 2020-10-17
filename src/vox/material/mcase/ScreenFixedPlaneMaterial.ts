/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as ShaderCodeBufferT from "../../../vox/material/ShaderCodeBuffer";
import * as ShaderUniformDataT from "../../../vox/material/ShaderUniformData";
import * as ShaderGlobalUniformT from "../../../vox/material/ShaderGlobalUniform";
import * as MaterialBaseT from "../../../vox/material/MaterialBase";
import * as RenderProxyT from '../../../vox/render/RenderProxy';

import ShaderCodeBuffer = ShaderCodeBufferT.vox.material.ShaderCodeBuffer;
import ShaderUniformData = ShaderUniformDataT.vox.material.ShaderUniformData;
import ShaderGlobalUniform = ShaderGlobalUniformT.vox.material.ShaderGlobalUniform;
import MaterialBase = MaterialBaseT.vox.material.MaterialBase;
import RenderProxy = RenderProxyT.vox.render.RenderProxy;

export namespace vox
{
    export namespace material
    {
        export namespace mcase
        {
            export class ScreenFixedPlaneShaderBuffer extends ShaderCodeBuffer
            {
                constructor()
                {
                    super();
                }
                private static ___s_instance:ScreenFixedPlaneShaderBuffer = null;
                private m_uniqueName:string = "";
                private m_hasTex:boolean = false;
                initialize(texEnabled:boolean):void
                {
                    console.log("ScreenFixedPlaneShaderBuffer::initialize()... texEnabled: "+texEnabled);
                    this.m_uniqueName = "ScreenFixedPlaneShd";
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
";
                    if(this.m_hasTex)
                    {

                        fragCode +=
"\
uniform sampler2D u_sampler0;\n\
varying vec2 v_texUV;\n\
";
                    }
                    else
                    {

                        fragCode +=
"\
uniform vec4 u_color;\n\
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
    gl_FragColor = texture2D(u_sampler0, v_texUV);\n\
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
    gl_Position = vec4(a_vs,1.0);\n\
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
                    return "[ScreenFixedPlaneShaderBuffer()]";
                }

                static GetInstance():ScreenFixedPlaneShaderBuffer
                {
                    if(ScreenFixedPlaneShaderBuffer.___s_instance != null)
                    {
                        return ScreenFixedPlaneShaderBuffer.___s_instance;
                    }
                    ScreenFixedPlaneShaderBuffer.___s_instance = new ScreenFixedPlaneShaderBuffer();
                    return ScreenFixedPlaneShaderBuffer.___s_instance;
                }
            }
            
            export class ScreenFixedPlaneMaterial extends MaterialBase
            {
                constructor()
                {
                    super();
                }
                
                getCodeBuf():ShaderCodeBuffer
                {
                    return ScreenFixedPlaneShaderBuffer.GetInstance();
                }
                private m_colorArray:Float32Array = new Float32Array([1.0,1.0,1.0,1.0]);
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
                createSharedUniform(rc:RenderProxy):ShaderGlobalUniform
                {
                    return null;
                }
                createSelfUniformData():ShaderUniformData
                {
                    if(this.getTextureList() == null)
                    {
                        return null;
                    }
                    let oum:ShaderUniformData = new ShaderUniformData();
                    oum.dataSizeList = [1];
                    oum.uniformNameList = ["u_color"];
                    oum.dataList = [this.m_colorArray];
                    return oum;
                }
            }
        }
    }
}