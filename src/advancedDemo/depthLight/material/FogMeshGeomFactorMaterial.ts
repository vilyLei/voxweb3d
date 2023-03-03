/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Vector3D from "../../../vox/math/Vector3D";
import ShaderCodeBuffer from "../../../vox/material/ShaderCodeBuffer";
import ShaderUniformData from "../../../vox/material/ShaderUniformData";
import Color4 from "../../../vox/material/Color4";
import MaterialBase from "../../../vox/material/MaterialBase";

class FogMeshGeomFactorShaderBuffer extends ShaderCodeBuffer {
    constructor() {
        super();
    }
    private static s_instance: FogMeshGeomFactorShaderBuffer = new FogMeshGeomFactorShaderBuffer();
    private m_uniqueName: string = "";
    initialize(texEnabled: boolean): void {
        //console.log("FogMeshGeomFactorShaderBuffer::initialize()...");
        this.m_uniqueName = "FogMeshGeomFactorShd";
    }
    getFragShaderCode(): string {
        let fragCode =
`#version 300 es
precision mediump float;
uniform sampler2D u_sampler0;
uniform sampler2D u_sampler1;
uniform vec4 u_sphParam[5];
uniform vec4 u_frustumParam;
uniform vec4 u_viewParam;
layout(location = 0) out vec4 OutputColor0;
layout(location = 1) out vec4 OutputColor1;
void main()
{
    vec2 sv2 = vec2(gl_FragCoord.x/u_viewParam.z,gl_FragCoord.y/u_viewParam.w);
    vec4 middColor4 = texture(u_sampler0, sv2);
    middColor4.w *= u_frustumParam.y;
    float radius = u_sphParam[1].w;
    sv2 = 2.0 * (sv2 - 0.5);
    vec3 nearPV = vec3(sv2 * u_frustumParam.zw,-u_frustumParam.x);
    vec3 ltv = normalize(nearPV);
    vec3 sphCV = u_sphParam[1].xyz;
    vec3 lpv = dot(ltv,sphCV) * ltv;
    float dis = length(lpv - sphCV);
    if(dis < radius)
    {
        float k = 0.0;
        // ray and shpere have two intersection points
        lpv = vec3(0.0);//lpv - ltv * radius * 2.0;
        vec3 outV = sphCV - lpv;
        k = dot(outV,ltv);
        // calc nearest shpere center point on the ray line.
        outV = k * ltv + lpv;
        //
        vec3 bv = ltv * sqrt(radius * radius - dis * dis);
        //float farDis = min(u_frustumParam.y,length(outV + bv));
        lpv = outV + bv;
        float farDis = length(lpv);
        float nearDis = max(length(outV - bv),length(nearPV));
        //
        dis = max(farDis - nearDis, 0.0);
        k = clamp(dis/(radius * 2.0),0.0,1.0);
        middColor4.w = max(min(middColor4.w,farDis) - nearDis, 0.0);
        //k = pow(k,3.0) * clamp( middColor4.w / (dis + 1.0), 0.0, 1.0 );
        k = clamp(dis / u_sphParam[0].w, 0.0,1.0) * pow(k,3.0) * clamp( middColor4.w / (dis + 1.0), 0.0, 1.0 );
        //k = pow(k,2.0) * clamp( middColor4.w / (dis + 1.0), 0.0, 1.0 );
        vec2 flowOffsetV = sphCV.xy * 0.0002;
        //      flowOffsetV = flowOffsetV.xx;
        vec4 noise = texture(u_sampler1, flowOffsetV + u_sphParam[2].w * (0.5 + (lpv.xy - sphCV.xy)/radius));
        k *= u_sphParam[4].w * noise.x;
        OutputColor0 = vec4(u_sphParam[0].xyz, k);
        OutputColor1 = vec4(u_sphParam[2].xyz, k);
    }else{
        OutputColor0 = vec4(1.0,1.0,1.0, 0.0);
        OutputColor1 = vec4(1.0,1.0,1.0, 0.0);
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
uniform mat4 u_viewMat;
uniform mat4 u_projMat;
void main()
{
    gl_Position = u_projMat * u_viewMat * u_objMat * vec4(a_vs, 1.0);
}
`;
        return vtxCode;
    }
    getUniqueShaderName(): string {
        return this.m_uniqueName;
    }
    toString(): string {
        return "[FogMeshGeomFactorShaderBuffer()]";
    }

    static GetInstance(): FogMeshGeomFactorShaderBuffer {
        return FogMeshGeomFactorShaderBuffer.s_instance;
    }
}

export class FogMeshGeomFactorMaterial extends MaterialBase {
    constructor() {
        super();
        this.m_sphParam[11] = 0.1 + Math.random() * 0.1 * 0.5;
    }
    setFogDis(dis: number): void {
        this.m_sphParam[3] = dis;
    }
    setRadius(pr: number): void {
        this.m_sphParam[7] = pr;
    }
    setFactorRGBColor(pcolor: Color4): void {
        this.m_sphParam[0] = pcolor.r;
        this.m_sphParam[1] = pcolor.g;
        this.m_sphParam[2] = pcolor.b;
    }
    setFactorRGB3f(pr: number, pg: number, pb: number): void {
        this.m_sphParam[0] = pr;
        this.m_sphParam[1] = pg;
        this.m_sphParam[2] = pb;
    }

    setFogRGBColor(pcolor: Color4): void {
        this.m_sphParam[8] = pcolor.r;
        this.m_sphParam[9] = pcolor.g;
        this.m_sphParam[10] = pcolor.b;
    }
    setFogRGB3f(pr: number, pg: number, pb: number): void {
        this.m_sphParam[8] = pr;
        this.m_sphParam[9] = pg;
        this.m_sphParam[10] = pb;
    }
    setXYZ3f(px: number, py: number, pz: number): void {
        this.m_sphParam[4] = px;
        this.m_sphParam[5] = py;
        this.m_sphParam[6] = pz;
    }
    setSpdXYZ3f(px: number, py: number, pz: number): void {
        this.m_sphParam[12] = px;
        this.m_sphParam[13] = py;
        this.m_sphParam[14] = pz;
    }
    setSpdV3(v3: Vector3D): void {
        this.m_sphParam[12] = v3.x;
        this.m_sphParam[13] = v3.y;
        this.m_sphParam[14] = v3.z;
    }
    setTime(t: number): void {
        this.m_sphParam[15] = t;
    }
    setDensity(d: number): void {
        this.m_sphParam[19] = d;
    }
    getCodeBuf(): ShaderCodeBuffer {
        return FogMeshGeomFactorShaderBuffer.GetInstance();
    }
    private m_sphParam: Float32Array = new Float32Array([1.0, 1.0, 1.0, 1000.0, 0.0, 0.0, 0.0, 2500, 1.0, 1.0, 1.0, 0.2, 1.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0]);

    createSelfUniformData(): ShaderUniformData {
        let oum: ShaderUniformData = new ShaderUniformData();
        oum.uniformNameList = ["u_sphParam"];
        oum.dataList = [this.m_sphParam];
        return oum;
    }
}