/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Vector3D from "../../../vox/math/Vector3D";
import ShaderCodeBuffer from "../../../vox/material/ShaderCodeBuffer";
import ShaderUniformData from "../../../vox/material/ShaderUniformData";
import Color4 from "../../../vox/material/Color4";
import MaterialBase from "../../../vox/material/MaterialBase";

class FogPlaneConeFactorShaderBuffer extends ShaderCodeBuffer {
    constructor() {
        super();
    }
    private static s_instance: FogPlaneConeFactorShaderBuffer = new FogPlaneConeFactorShaderBuffer();
    private m_uniqueName: string = "";
    initialize(texEnabled: boolean): void {
        //console.log("FogPlaneConeFactorShaderBuffer::initialize()...");
        this.m_uniqueName = "FogPlaneConeFactorShd";
    }
    getFragShaderCode(): string {
        let fragCode =
`#version 300 es
precision mediump float;
uniform sampler2D u_sampler0;
//uniform sampler2D u_sampler1;
uniform vec4 u_coneParam[7];
uniform vec4 u_frustumParam;
uniform vec4 u_viewParam;
layout(location = 0) out vec4 OutputColor0;
layout(location = 1) out vec4 OutputColor1;
void main()
{
    vec2 sv2 = vec2(gl_FragCoord.x/u_viewParam.z,gl_FragCoord.y/u_viewParam.w);
    vec4 middColor4 = texture(u_sampler0, sv2);
    middColor4.w *= u_frustumParam.y;
    float radius = u_coneParam[1].w;
    sv2 = 2.0 * (sv2 - 0.5);
    vec3 nearPV = vec3(sv2 * u_frustumParam.zw,-u_frustumParam.x);
    vec3 ltv = normalize(nearPV);
    vec3 sphCV = u_coneParam[1].xyz;
    vec3 lpv = dot(ltv,sphCV) * ltv;
    float dis = length(lpv - sphCV);
    if(dis < radius)
    {
        float k = 1.0;
        vec3 coPV = u_coneParam[5].xyz;
        vec3 coTV = normalize(u_coneParam[6].xyz - coPV);
        vec3 slpv = nearPV;
        float mcos = u_coneParam[5].w;
        float mcos2 = mcos * mcos;
        vec3 coDV = slpv - coPV;
        float pb = dot(ltv,coTV);
        vec3 sltv = ltv;//pb > 0.0?ltv:(-1.0 * ltv);
		float pa = pb * pb - mcos2;
		float pc = dot(coDV, coTV);
		pb = 2.0 * (pb * pc - dot(coDV,sltv) * mcos2);
		pc = pc * pc - dot(coDV,coDV) * mcos2;
        float pt = max(pb * pb - 4.0 * pa * pc, 0.0);
        if(pt >= 0.0){
            pa = 1.0 / (2.0 * pa);
            pc = sqrt(pt);
			vec3 pv0 = slpv + ((-pb - pc) * pa) * sltv;
            vec3 pv1 = slpv + ((-pb + pc) * pa) * sltv;
            pa = length(pv0);
            pb = length(pv1);
            float nearDis = min(pa,pb);
            nearDis = max(nearDis, length(nearPV));
            float farDis = max(pa,pb);
            farDis = max(farDis,nearDis);
            middColor4.w = max(min(middColor4.w,farDis) - nearDis, 0.0);
            float dis = abs(farDis - nearDis);
            
            vec3 ccov = 0.5 * (pv0 + pv1) - coPV;
            pb = 1.0 - (clamp(length(ccov) - 800.0,0.0,1200.0) / 1200.0);
            float cosdensity = 6.0;
            float brightRadius = 300.0 * 2.0;
            pc = dot(normalize(ccov), coTV);
            pc = min((pc - mcos) * cosdensity,1.0);
            k = pc * pb;
            k *= clamp(dis/brightRadius,0.0,1.0);
            k *=  clamp( middColor4.w / (dis + 1.0), 0.0, 1.0 );
            OutputColor0 = vec4(u_coneParam[0].xyz, k);
            OutputColor1 = vec4(u_coneParam[2].xyz, k);
        }else{
            OutputColor0 = vec4(vec3(0.0), 0.0);
            OutputColor1 = vec4(vec3(0.0), 0.0);
        }
    }else{
        OutputColor0 = vec4(vec3(0.0), 0.0);
        OutputColor1 = vec4(vec3(0.0), 0.0);
    }
}
`;
        return fragCode;
    }
    getVertShaderCode(): string {
        let vtxCode =
`#version 300 es
precision mediump float;
layout(location = 0) in vec3 a_vs;
uniform mat4 u_objMat;
void main()
{
    gl_Position = u_objMat * vec4(a_vs,1.0);
}
`;
        return vtxCode;
    }
    getUniqueShaderName(): string {
        //console.log("H ########################### this.m_uniqueName: "+this.m_uniqueName);
        return this.m_uniqueName;
    }
    toString(): string {
        return "[FogPlaneConeFactorShaderBuffer()]";
    }

    static GetInstance(): FogPlaneConeFactorShaderBuffer {
        return FogPlaneConeFactorShaderBuffer.s_instance;
    }
}

export class FogPlaneConeFactorMaterial extends MaterialBase {
    constructor() {
        super();
        this.m_coneParam[11] = 0.1 + Math.random() * 0.1 * 0.5;
    }
    setFogDis(dis: number): void {
        this.m_coneParam[3] = dis;
    }
    setRadius(pr: number): void {
        this.m_coneParam[7] = pr;
    }
    setFactorRGBColor(pcolor: Color4): void {
        this.m_coneParam[0] = pcolor.r;
        this.m_coneParam[1] = pcolor.g;
        this.m_coneParam[2] = pcolor.b;
    }
    setFactorRGB3f(pr: number, pg: number, pb: number): void {
        this.m_coneParam[0] = pr;
        this.m_coneParam[1] = pg;
        this.m_coneParam[2] = pb;
    }

    setFogRGBColor(pcolor: Color4): void {
        this.m_coneParam[8] = pcolor.r;
        this.m_coneParam[9] = pcolor.g;
        this.m_coneParam[10] = pcolor.b;
    }
    setFogRGB3f(pr: number, pg: number, pb: number): void {
        this.m_coneParam[8] = pr;
        this.m_coneParam[9] = pg;
        this.m_coneParam[10] = pb;
    }
    setXYZ3f(px: number, py: number, pz: number): void {
        this.m_coneParam[4] = px;
        this.m_coneParam[5] = py;
        this.m_coneParam[6] = pz;
    }
    setSpdXYZ3f(px: number, py: number, pz: number): void {
        this.m_coneParam[12] = px;
        this.m_coneParam[13] = py;
        this.m_coneParam[14] = pz;
    }
    setSpdV3(v3: Vector3D): void {
        this.m_coneParam[12] = v3.x;
        this.m_coneParam[13] = v3.y;
        this.m_coneParam[14] = v3.z;
    }
    setTime(t: number): void {
        this.m_coneParam[15] = t;
    }
    setDensity(d: number): void {
        this.m_coneParam[19] = d;
    }
    setConePos(topPos: Vector3D, bottomPos: Vector3D): void {
        let fs: Float32Array = this.m_coneParam;
        fs[20] = topPos.x;
        fs[21] = topPos.y;
        fs[22] = topPos.z;

        fs[24] = bottomPos.x;
        fs[25] = bottomPos.y;
        fs[26] = bottomPos.z;
    }
    setConeMCos(coneMCos: number): void {
        this.m_coneParam[23] = coneMCos;
    }
    getCodeBuf(): ShaderCodeBuffer {
        return FogPlaneConeFactorShaderBuffer.GetInstance();
    }
    private m_coneParam: Float32Array = new Float32Array([
        1.0, 1.0, 1.0, 1000.0, 0.0, 0.0, 0.0, 2500, 1.0, 1.0, 1.0, 0.2, 1.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0
        , 0.0, 0.0, 0.0, 1.0, 0.0, -200.0, 0.0, 1.0
    ]);

    createSelfUniformData(): ShaderUniformData {
        let oum = new ShaderUniformData();
        oum.uniformNameList = ["u_coneParam"];
        oum.dataList = [this.m_coneParam];
        return oum;
    }
}