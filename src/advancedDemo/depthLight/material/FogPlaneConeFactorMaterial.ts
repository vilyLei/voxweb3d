/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import * as Vector3DT from "../../../vox/geom/Vector3";
import * as RendererDevieceT from "../../../vox/render/RendererDeviece";
import * as ShaderCodeBufferT from "../../../vox/material/ShaderCodeBuffer";
import * as ShaderUniformDataT from "../../../vox/material/ShaderUniformData";
import * as Color4T from "../../../vox/material/Color4";
import * as MaterialBaseT from "../../../vox/material/MaterialBase";

import Vector3D = Vector3DT.vox.geom.Vector3D;
import RendererDeviece = RendererDevieceT.vox.render.RendererDeviece;
import ShaderCodeBuffer = ShaderCodeBufferT.vox.material.ShaderCodeBuffer;
import ShaderUniformData = ShaderUniformDataT.vox.material.ShaderUniformData;
import Color4 = Color4T.vox.material.Color4;
import MaterialBase = MaterialBaseT.vox.material.MaterialBase;


export namespace advancedDemo
{
    export namespace depthLight
    {
        export namespace material
        {
            class FogPlaneConeFactorShaderBuffer extends ShaderCodeBuffer
            {
                constructor()
                {
                    super();
                }
                private static ___s_instance:FogPlaneConeFactorShaderBuffer = new FogPlaneConeFactorShaderBuffer();
                private m_uniqueName:string = "";
                initialize(texEnabled:boolean):void
                {
                    //console.log("FogPlaneConeFactorShaderBuffer::initialize()...");
                    this.m_uniqueName = "FogPlaneConeFactorShd";
                }
                getFragShaderCode():string
                {
                    let fragCode:string =
"\
#version 300 es\n\
precision mediump float;\n\
uniform sampler2D u_sampler0;\n\
//uniform sampler2D u_sampler1;\n\
uniform vec4 u_coneParam[7];\n\
uniform vec4 u_cameraParam;\n\
uniform vec4 u_viewParam;\n\
layout(location = 0) out vec4 OutputColor0;\n\
layout(location = 1) out vec4 OutputColor1;\n\
void main()\n\
{\n\
    vec2 sv2 = vec2(gl_FragCoord.x/u_viewParam.z,gl_FragCoord.y/u_viewParam.w);\n\
    vec4 middColor4 = texture(u_sampler0, sv2);\n\
    middColor4.w *= u_cameraParam.y;\n\
    float radius = u_coneParam[1].w;\n\
    sv2 = 2.0 * (sv2 - 0.5);\n\
    vec3 nearPV = vec3(sv2 * u_cameraParam.zw,-u_cameraParam.x);\n\
    vec3 ltv = normalize(nearPV);\n\
    vec3 sphCV = u_coneParam[1].xyz;\n\
    vec3 lpv = dot(ltv,sphCV) * ltv;\n\
    float dis = length(lpv - sphCV);\n\
    if(dis < radius)\n\
    {\n\
        float k = 1.0;\n\
        vec3 coPV = u_coneParam[5].xyz;\n\
        vec3 coTV = normalize(u_coneParam[6].xyz - coPV);\n\
        vec3 slpv = nearPV;\n\
        float mcos = u_coneParam[5].w;\n\
        float mcos2 = mcos * mcos;\n\
        vec3 coDV = slpv - coPV;\n\
        float pb = dot(ltv,coTV);\n\
        vec3 sltv = ltv;//pb > 0.0?ltv:(-1.0 * ltv);\n\
		float pa = pb * pb - mcos2;\n\
		float pc = dot(coDV, coTV);\n\
		pb = 2.0 * (pb * pc - dot(coDV,sltv) * mcos2);\n\
		pc = pc * pc - dot(coDV,coDV) * mcos2;\n\
        float pt = max(pb * pb - 4.0 * pa * pc, 0.0);\n\
        if(pt >= 0.0){\n\
            pa = 1.0 / (2.0 * pa);\n\
            pc = sqrt(pt);\n\
			vec3 pv0 = slpv + ((-pb - pc) * pa) * sltv;\n\
            vec3 pv1 = slpv + ((-pb + pc) * pa) * sltv;\n\
            pa = length(pv0);\n\
            pb = length(pv1);\n\
            float nearDis = min(pa,pb);\n\
            nearDis = max(nearDis, length(nearPV));\n\
            float farDis = max(pa,pb);\n\
            farDis = max(farDis,nearDis);\n\
            middColor4.w = max(min(middColor4.w,farDis) - nearDis, 0.0);\n\
            float dis = abs(farDis - nearDis);\n\
            \n\
            vec3 ccov = 0.5 * (pv0 + pv1) - coPV;\n\
            pb = 1.0 - (clamp(length(ccov) - 800.0,0.0,1200.0) / 1200.0);\n\
            float cosdensity = 6.0;\n\
            float brightRadius = 300.0 * 2.0;\n\
            pc = dot(normalize(ccov), coTV);\n\
            pc = min((pc - mcos) * cosdensity,1.0);\n\
            k = pc * pb;\n\
            k *= clamp(dis/brightRadius,0.0,1.0);\n\
            k *=  clamp( middColor4.w / (dis + 1.0), 0.0, 1.0 );\n\
            OutputColor0 = vec4(u_coneParam[0].xyz, k);\n\
            OutputColor1 = vec4(u_coneParam[2].xyz, k);\n\
        }else{\n\
            OutputColor0 = vec4(vec3(0.0), 0.0);\n\
            OutputColor1 = vec4(vec3(0.0), 0.0);\n\
        }\n\
    }else{\n\
        OutputColor0 = vec4(vec3(0.0), 0.0);\n\
        OutputColor1 = vec4(vec3(0.0), 0.0);\n\
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
                    return "[FogPlaneConeFactorShaderBuffer()]";
                }

                static GetInstance():FogPlaneConeFactorShaderBuffer
                {
                    return FogPlaneConeFactorShaderBuffer.___s_instance;
                }
            }
            
            export class FogPlaneConeFactorMaterial extends MaterialBase
            {
                constructor()
                {
                    super();
                    this.m_coneParam[11] = 0.1 + Math.random() * 0.1 * 0.5;
                }
                setFogDis(dis:number):void
                {
                    this.m_coneParam[3] = dis;
                }
                setRadius(pr:number):void
                {
                    this.m_coneParam[7] = pr;
                }
                setFactorRGBColor(pcolor:Color4):void
                {
                    this.m_coneParam[0] = pcolor.r;
                    this.m_coneParam[1] = pcolor.g;
                    this.m_coneParam[2] = pcolor.b;
                }
                setFactorRGB3f(pr:number,pg:number,pb:number):void
                {
                    this.m_coneParam[0] = pr;
                    this.m_coneParam[1] = pg;
                    this.m_coneParam[2] = pb;
                }
                
                setFogRGBColor(pcolor:Color4):void
                {
                    this.m_coneParam[8] = pcolor.r;
                    this.m_coneParam[9] = pcolor.g;
                    this.m_coneParam[10] = pcolor.b;
                }
                setFogRGB3f(pr:number,pg:number,pb:number):void
                {
                    this.m_coneParam[8] = pr;
                    this.m_coneParam[9] = pg;
                    this.m_coneParam[10] = pb;
                }
                setXYZ3f(px:number,py:number,pz:number):void
                {
                    this.m_coneParam[4] = px;
                    this.m_coneParam[5] = py;
                    this.m_coneParam[6] = pz;
                }
                setSpdXYZ3f(px:number,py:number,pz:number):void
                {
                    this.m_coneParam[12] = px;
                    this.m_coneParam[13] = py;
                    this.m_coneParam[14] = pz;
                }
                setSpdV3(v3:Vector3D):void
                {
                    this.m_coneParam[12] = v3.x;
                    this.m_coneParam[13] = v3.y;
                    this.m_coneParam[14] = v3.z;
                }
                setTime(t:number):void
                {
                    this.m_coneParam[15] = t;
                }
                setDensity(d:number):void
                {
                    this.m_coneParam[19] = d;
                }
                setConePos(topPos:Vector3D, bottomPos:Vector3D):void
                {
                    let fs:Float32Array = this.m_coneParam;
                    fs[20] = topPos.x;
                    fs[21] = topPos.y;
                    fs[22] = topPos.z;

                    fs[24] = bottomPos.x;
                    fs[25] = bottomPos.y;
                    fs[26] = bottomPos.z;
                }
                setConeMCos(coneMCos:number):void
                {
                    this.m_coneParam[23] = coneMCos;
                }
                getCodeBuf():ShaderCodeBuffer
                {        
                    return FogPlaneConeFactorShaderBuffer.GetInstance();
                }
                private m_coneParam:Float32Array = new Float32Array([
                    1.0,1.0,1.0,1000.0, 0.0,0.0,0.0,2500, 1.0,1.0,1.0,0.2, 1.0,1.0,1.0,0.0, 0.0,0.0,0.0,1.0
                    ,0.0,0.0,0.0,1.0, 0.0,-200.0,0.0,1.0
                ]);
                
                createSelfUniformData():ShaderUniformData
                {
                    let oum:ShaderUniformData = new ShaderUniformData();
                    oum.dataSizeList = [7];
                    oum.uniformNameList = ["u_coneParam"];
                    oum.dataList = [this.m_coneParam];
                    return oum;
                }
            }
        }
    }
}