/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as ShaderCodeBufferT from "../../../vox/material/ShaderCodeBuffer";
import * as ShaderUniformDataT from "../../../vox/material/ShaderUniformData";
import * as MaterialBaseT from "../../../vox/material/MaterialBase";

import ShaderCodeBuffer = ShaderCodeBufferT.vox.material.ShaderCodeBuffer;
import ShaderUniformData = ShaderUniformDataT.vox.material.ShaderUniformData;
import MaterialBase = MaterialBaseT.vox.material.MaterialBase;

export namespace example
{
    export namespace material
    {
        export namespace base
        {
            export class BaseTextureShaderBuffer extends ShaderCodeBuffer
            {
                constructor()
                {
                    super();
                }
                private static ___s_instance:BaseTextureShaderBuffer = null;
                private m_uniqueName:string = "";
                initialize(texEnabled:boolean):void
                {
                    //console.log("BaseTextureShaderBuffer::initialize()...");
                    this.m_uniqueName = "BaseTextureShd";
                }
                getFragShaderCode():string
                {
                    let fragCode:string = 
"\
#version 300 es\n\
precision mediump float;\n\
#define PI 3.141592653589793\n\
#define PI2 6.283185307179586\n\
#define RECIPROCAL_PI 0.3183098861837907\n\
#define RECIPROCAL_PI2 0.15915494309189535\n\
vec2 equirectUv( in vec3 dir ) {\n\
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;\n\
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;\n\
	return vec2( u, v );\n\
}\n\
highp float getRand( const in vec2 uv ) {\n\
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;\n\
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );\n\
	return fract(sin(sn) * c);\n\
}\n\
uniform sampler2D u_sampler0;\n\
uniform vec4 u_color;\n\
in vec2 v_uvs;\n\
layout(location = 0) out vec4 FragColor;\n\
void main(){\n\
    vec4 color4 = texture(u_sampler0, equirectUv(vec3(v_uvs,0.0))) * u_color;\n\
    //color4.r = getRand(v_uvs);\n\
    //color4.g = getRand(v_uvs * 2.0);\n\
    //color4.b = getRand(v_uvs * 0.5);\n\
    FragColor = color4;\n\
}\n\
";
                    return fragCode;
                }
                getVtxShaderCode():string
                {
                    let vtxCode:string = 
"\
#version 300 es\n\
precision highp float;\n\
layout(location = 0) in vec3 a_vs;\n\
layout(location = 1) in vec2 a_uvs;\n\
uniform mat4 u_objMat;\n\
uniform mat4 u_viewMat;\n\
uniform mat4 u_projMat;\n\
out vec2 v_uvs;\n\
void main(){\n\
    gl_Position = u_projMat * u_viewMat * u_objMat * vec4(a_vs,1.0);\n\
    v_uvs = a_uvs;\n\
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
                    return "[BaseTextureShaderBuffer()]";
                }

                static GetInstance():BaseTextureShaderBuffer
                {
                    if(BaseTextureShaderBuffer.___s_instance != null)
                    {
                        return BaseTextureShaderBuffer.___s_instance;
                    }
                    BaseTextureShaderBuffer.___s_instance = new BaseTextureShaderBuffer();
                    return BaseTextureShaderBuffer.___s_instance;
                }
            }
            export class BaseTextureMaterial extends MaterialBase
            {
                constructor()
                {
                    super();
                }
                
                getCodeBuf():ShaderCodeBuffer
                {        
                    return BaseTextureShaderBuffer.GetInstance();
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
                createSelfUniformData():ShaderUniformData
                {
                    let oum:ShaderUniformData = new ShaderUniformData();
                    oum.uniformNameList = ["u_color"];
                    oum.dataList = [this.m_colorArray];
                    return oum;
                }

            }
        }
    }
}