/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as RendererDevieceT from "../../../vox/render/RendererDeviece";
import * as ShaderCodeBufferT from "../../../vox/material/ShaderCodeBuffer";
import * as ShaderUniformDataT from "../../../vox/material/ShaderUniformData";
import * as MaterialBaseT from "../../../vox/material/MaterialBase";

import RendererDeviece = RendererDevieceT.vox.render.RendererDeviece;
import ShaderCodeBuffer = ShaderCodeBufferT.vox.material.ShaderCodeBuffer;
import ShaderUniformData = ShaderUniformDataT.vox.material.ShaderUniformData;
import MaterialBase = MaterialBaseT.vox.material.MaterialBase;


export namespace advancedDemo
{
    export namespace depthFog
    {
        export namespace material
        {
            class FogSphShowShaderBuffer extends ShaderCodeBuffer
            {
                constructor()
                {
                    super();
                }
                private static ___s_instance:FogSphShowShaderBuffer = new FogSphShowShaderBuffer();
                private m_uniqueName:string = "";
                initialize(texEnabled:boolean):void
                {
                    //console.log("FogSphShowShaderBuffer::initialize()...");
                    this.m_uniqueName = "FogSphShowShd";
                }
                getFragShaderCode():string
                {
                    let fragCode:string =

"\
#version 300 es\n\
precision mediump float;\n\
uniform sampler2D u_sampler0;\n\
uniform sampler2D u_sampler1;\n\
//uniform vec4 u_color;\n\
in vec2 v_texUV;\n\
in mat4 v_viewMat;\n\
layout(location = 0) out vec4 OutputColor;\n\
vec4 intersectionRLByV2(vec3 pixel, vec3 lpv, vec3 ltv, vec3 spCV,float spRadius)\n\
{\n\
    vec4 outV = vec4(0.0);\n\
    // 球心在 ltv 方向上的投影\n\
    vec3 bv = ltv * dot(ltv,spCV);\n\
	// 球体和射线所在的直线相交检测计算\n\
	if(length(spCV - bv) <= spRadius)\n\
	{\n\
        float dis = length(bv);\n\
		//outV.xyz = lpv;\n\
		//outV.w = 1.0;\n\
        //return outV;\n\
        //\n\
        bv = spCV - lpv;\n\
        // 在射线的行进方向上相交\n\
        if(dot(bv,ltv) > 0.0)\n\
	    {\n\
	    	outV.xyz = spCV - lpv;\n\
	    	float f = dot(outV.xyz, ltv);\n\
	    	outV.xyz = f * ltv + lpv;\n\
	    	bv = outV.xyz;\n\
	    	bv -= spCV;\n\
	    	f = length(bv);\n\
	    	if (f <= spRadius) {\n\
	    		// outV is pos in ray line.\n\
	    		bv = ltv;\n\
	    		f = sqrt(spRadius * spRadius - f * f);\n\
	    		outV.xyz -= bv;\n\
                outV.w = 2.0;\n\
	    	}\n\
	    }\n\
    }\n\
	return outV;\n\
}\n\
void main()\n\
{\n\
    vec4 pixel = texture(u_sampler0, v_texUV);\n\
    vec4 color4 = texture(u_sampler1, v_texUV);\n\
    vec3 ltv = normalize(pixel.xyz);\n\
    vec3 lpv = vec3(0.0,0.0,0.1);\n\
    if(pixel.w > 0.001)\n\
    {\n\
        vec4 factorv4 = vec4(1.0,1.0,1.0,1.0);\n\
        vec4 sphV = v_viewMat * vec4(0.0,0.0,0.0,1.0);\n\
        sphV.w = 900.0;\n\
        //  if(length(sphV.xyz - pixel.xyz) <= sphV.w)\n\
        //  {\n\
        //  factorv4 = vec4(1.0,0.0,1.0,1.0);\n\
        //  }\n\
        // 直接基于几何计算不能实现多个球体表示的交叠空间的值得计算,所以此算法有问题\n\
        // 还是要用ray march方法\n\
        factorv4 = intersectionRLByV2(pixel.xyz,lpv,ltv,sphV.xyz,sphV.w);\n\
        if(factorv4.w > 1.0)\n\
        {\n\
            factorv4 = vec4(0.0,1.0,0.0,1.0);\n\
        }else if(factorv4.w > 0.0)\n\
        {\n\
            factorv4 = vec4(1.0,0.0,1.0,1.0);\n\
        }\n\
        if(pixel.w < 0.001)\n\
        {\n\
            pixel.w = 0.001;\n\
        }\n\
        OutputColor = vec4(factorv4.xyz * color4.xyz,1.0);\n\
    }else{\n\
        OutputColor = vec4(color4.xyz,1.0);\n\
    }\n\
}\n\
";
                    return fragCode;
                }
                getVtxShaderCode():string
                {
                    let vtxCode:string = 
"\
#version 300 es\n\
precision mediump float;\n\
layout(location = 0) in vec3 a_vs;\n\
layout(location = 1) in vec2 a_uvs;\n\
uniform mat4 u_objMat;\n\
uniform mat4 u_viewMat;\n\
out vec2 v_texUV;\n\
out mat4 v_viewMat;\n\
void main()\n\
{\n\
gl_Position = u_objMat * vec4(a_vs,1.0);\n\
v_texUV = vec2(a_uvs.x,a_uvs.y);\n\
v_viewMat = u_viewMat;\n\
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
                    return "[FogSphShowShaderBuffer()]";
                }

                static GetInstance():FogSphShowShaderBuffer
                {
                    return FogSphShowShaderBuffer.___s_instance;
                }
            }
            
            export class FogSphShowMaterial extends MaterialBase
            {
                constructor()
                {
                    super();
                }
                
                getCodeBuf():ShaderCodeBuffer
                {
                    return FogSphShowShaderBuffer.GetInstance();
                }
            }
        }
    }
}