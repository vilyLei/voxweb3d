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

class FogSphFactorShaderBuffer extends ShaderCodeBuffer {
    constructor() {
        super();
    }
    private static s_instance: FogSphFactorShaderBuffer = new FogSphFactorShaderBuffer();
    private m_uniqueName: string = "";
    initialize(texEnabled: boolean): void {
        super.initialize(texEnabled);
        this.adaptationShaderVersion = false;
        this.m_uniqueName = "FogSphFactorShd";
    }

    buildShader(): void {

        let coder = this.m_coder;
		coder.uns = this.m_uniqueName;
        coder.addVarying("vec4", "v_vpos");

        this.m_uniform.add2DMap("MAP_0");
        this.m_uniform.add2DMap("MAP_1");

        coder.addFragUniform("vec4", "u_sphParam", 5);
        coder.addFragUniform("vec4", "u_frustumParam");
        coder.addFragUniform("vec4", "u_viewParam");

        coder.addFragOutput("vec4", "FragColor0");
        coder.addFragOutput("vec4", "FragColor1");

        coder.addVertMainCode(
            `
            vec4 vpos = u_viewMat * u_objMat * vec4(a_vs, 1.0);
            gl_Position = u_projMat * vpos;
			v_vpos = u_viewMat *vec4(a_vs, 1.0);
        `
        );
        coder.addFragMainCode(
            `
			float radius = u_sphParam[1].w;
			// vec2 vpos = (v_vpos.xy / vec2(radius)) * 0.495 + 0.5;

            vec2 sv2 = gl_FragCoord.xy / u_viewParam.zw;
    vec4 color = VOX_Texture2D(MAP_0, sv2);
    color.w *= u_frustumParam.y;
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

        vec3 bv = ltv * sqrt(radius * radius - dis * dis);
        //float farDis = min(u_frustumParam.y,length(outV + bv));
        lpv = outV + bv;
        float farDis = length(lpv);
        float nearDis = max(length(outV - bv),length(nearPV));

        dis = max(farDis - nearDis, 0.0);
        k = clamp(dis/(radius * 2.0),0.0,1.0);
        color.w = max(min(color.w,farDis) - nearDis, 0.0);
        //k = pow(k,3.0) * clamp( color.w / (dis + 1.0), 0.0, 1.0 );
        k = clamp(dis / u_sphParam[0].w, 0.0,1.0) * pow(k,3.0) * clamp( color.w / (dis + 1.0), 0.0, 1.0 );
        //k = pow(k,2.0) * clamp( color.w / (dis + 1.0), 0.0, 1.0 );
        vec2 flowOffsetV = sphCV.xy * 0.0002;
        //      flowOffsetV = flowOffsetV.xx;
        // flowOffsetV param make the fog flowing effect
        // vec4 noise = VOX_Texture2D(MAP_1, flowOffsetV + u_sphParam[2].w * (0.5 + (lpv.xy - sphCV.xy)/radius));
        vec4 noise = VOX_Texture2D(MAP_1, u_sphParam[2].w * (0.5 + (lpv.xy - sphCV.xy)/radius));
        k *= u_sphParam[4].w * noise.x;
        FragColor0 = vec4(u_sphParam[0].xyz, k);
        FragColor1 = vec4(u_sphParam[2].xyz, k);
    }else{
        FragColor0 = vec4(1.0,1.0,1.0, 0.0);
        FragColor1 = FragColor0;
    }
        `
        );

    }
    getUniqueShaderName(): string {
        return this.m_uniqueName;
    }

    static GetInstance(): FogSphFactorShaderBuffer {
        return FogSphFactorShaderBuffer.s_instance;
    }
}

export class FogSphFactorMaterial extends MaterialBase {
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
        return FogSphFactorShaderBuffer.GetInstance();
    }
    private m_sphParam: Float32Array = new Float32Array([1.0, 1.0, 1.0, 1000.0, 0.0, 0.0, 0.0, 2500, 1.0, 1.0, 1.0, 0.2, 1.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0]);

    createSelfUniformData(): ShaderUniformData {
        let oum: ShaderUniformData = new ShaderUniformData();
        oum.uniformNameList = ["u_sphParam"];
        oum.dataList = [this.m_sphParam];
        return oum;
    }
}
