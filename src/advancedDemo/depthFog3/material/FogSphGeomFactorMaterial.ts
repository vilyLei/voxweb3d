/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as RendererDevieceT from "../../../vox/render/RendererDeviece";
import * as ShaderCodeBufferT from "../../../vox/material/ShaderCodeBuffer";
import * as ShaderUniformDataT from "../../../vox/material/ShaderUniformData";
import * as Color4T from "../../../vox/material/Color4";
import * as MaterialBaseT from "../../../vox/material/MaterialBase";

import RendererDeviece = RendererDevieceT.vox.render.RendererDeviece;
import ShaderCodeBuffer = ShaderCodeBufferT.vox.material.ShaderCodeBuffer;
import ShaderUniformData = ShaderUniformDataT.vox.material.ShaderUniformData;
import Color4 = Color4T.vox.material.Color4;
import MaterialBase = MaterialBaseT.vox.material.MaterialBase;


export namespace advancedDemo
{
    export namespace depthFog3
    {
        export namespace material
        {
            class FogSphGeomFactorShaderBuffer extends ShaderCodeBuffer
            {
                constructor()
                {
                    super();
                }
                private static ___s_instance:FogSphGeomFactorShaderBuffer = new FogSphGeomFactorShaderBuffer();
                private m_uniqueName:string = "";
                initialize(texEnabled:boolean):void
                {
                    //console.log("FogSphGeomFactorShaderBuffer::initialize()...");
                    this.m_uniqueName = "FogSphGeomFactorShd";
                }
                getFragShaderCode():string
                {
                    let fragCode:string =
"\
#version 300 es\n\
precision mediump float;\n\
uniform sampler2D u_sampler0;\n\
uniform vec4 u_sphParam[2];\n\
uniform vec4 u_cameraParam;\n\
uniform vec4 u_stageParam;\n\
layout(location = 0) out vec4 OutputColor;\n\
void main()\n\
{\n\
    vec2 sv2 = vec2(gl_FragCoord.x/u_stageParam.z,gl_FragCoord.y/u_stageParam.w);\n\
    vec4 middColor4 = texture(u_sampler0, sv2);\n\
    middColor4.w *= u_cameraParam.y;\n\
    float radius = u_sphParam[1].w;\n\
    sv2 = 2.0 * (sv2 - 0.5);\n\
    vec3 nearPV = vec3(sv2 * u_cameraParam.zw,-u_cameraParam.x);\n\
    vec3 ltv = normalize(nearPV);\n\
    vec3 sphCV = u_sphParam[1].xyz;\n\
    vec3 lpv = dot(ltv,sphCV) * ltv;\n\
    float dis = length(lpv - sphCV);\n\
    if(dis < radius)\n\
    {\n\
        float k = 0.0;\n\
        // ray and shpere have two intersection points\n\
        lpv = lpv - ltv * radius * 2.0;\n\
        vec3 outV = sphCV - lpv;\n\
        k = dot(outV,ltv);\n\
        // calc nearest shpere center point on the ray line.\n\
        outV = k * ltv + lpv;\n\
        //\n\
        vec3 bv = ltv * sqrt(radius * radius - dis * dis);\n\
        float farDis = min(u_cameraParam.y - 0.1,length(outV + bv));\n\
        float nearDis = max(length(outV - bv),length(nearPV));\n\
        //\n\
        dis = max(farDis - nearDis, 0.0);\n\
        k = clamp(dis/(radius * 2.0),0.0,1.0);\n\
        middColor4.w = max(min(middColor4.w,farDis) - nearDis, 0.0);\n\
        //k = pow(k,3.0) * clamp( middColor4.w / (dis + 1.0), 0.0, 1.0 );\n\
        k = clamp(dis / u_sphParam[0].w, 0.0,1.0) * pow(k,3.0) * clamp( middColor4.w / (dis + 1.0), 0.0, 1.0 );\n\
        OutputColor = vec4(u_sphParam[0].xyz, k);\n\
    }else{\n\
        OutputColor = vec4(0.0);\n\
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
uniform mat4 u_objMat;\n\
void main()\n\
{\n\
gl_Position = u_objMat * vec4(a_vs,1.0);\n\
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
                    return "[FogSphGeomFactorShaderBuffer()]";
                }

                static GetInstance():FogSphGeomFactorShaderBuffer
                {
                    return FogSphGeomFactorShaderBuffer.___s_instance;
                }
            }
            
            export class FogSphGeomFactorMaterial extends MaterialBase
            {
                constructor()
                {
                    super();
                }
                setFogDis(dis:number):void
                {
                    this.m_sphParam[3] = dis;
                }
                setRadius(pr:number):void
                {
                    this.m_sphParam[7] = pr;
                }
                setRGBColor(pcolor:Color4):void
                {
                    this.m_sphParam[0] = pcolor.r;
                    this.m_sphParam[1] = pcolor.g;
                    this.m_sphParam[2] = pcolor.b;
                }
                setRGB3f(pr:number,pg:number,pb:number):void
                {
                    this.m_sphParam[0] = pr;
                    this.m_sphParam[1] = pg;
                    this.m_sphParam[2] = pb;
                }
                setXYZ3f(px:number,py:number,pz:number):void
                {
                    this.m_sphParam[4] = px;
                    this.m_sphParam[5] = py;
                    this.m_sphParam[6] = pz;
                }
                getCodeBuf():ShaderCodeBuffer
                {        
                    return FogSphGeomFactorShaderBuffer.GetInstance();
                }
                private m_sphParam:Float32Array = new Float32Array([1.0,1.0,1.0,1000.0, 0.0,0.0,0.0,2500]);
                
                createSelfUniformData():ShaderUniformData
                {
                    let oum:ShaderUniformData = new ShaderUniformData();
                    oum.uniformNameList = ["u_sphParam"];
                    oum.dataList = [this.m_sphParam];
                    return oum;
                }
            }
        }
    }
}