/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ShaderCodeBuffer from "../../../vox/material/ShaderCodeBuffer";
import ShaderCodeBuilder2 from "../../../vox/material/code/ShaderCodeBuilder2";
import ShaderUniformData from "../../../vox/material/ShaderUniformData";
import ShaderGlobalUniform from "../../../vox/material/ShaderGlobalUniform";
import MaterialBase from "../../../vox/material/MaterialBase";
import ShadowVSMData from "./ShadowVSMData";
import EnvLightData from "../../../light/base/EnvLightData";

import { VSMShaderCode } from "./VSMShaderCode";

class ShadowVSMShaderBuffer extends ShaderCodeBuffer {
    constructor() {
        super();
    }
    private static ___s_instance: ShadowVSMShaderBuffer = new ShadowVSMShaderBuffer();
    private m_codeBuilder: ShaderCodeBuilder2 = new ShaderCodeBuilder2();
    private m_uniqueName: string = "";
    
    vsmData: ShadowVSMData = null;
    envData: EnvLightData = null;
    initialize(texEnabled: boolean): void {
        super.initialize(texEnabled);
        //console.log("ShadowVSMShaderBuffer::initialize()...,texEnabled: "+texEnabled);
        this.m_uniqueName = "ShadowVSMShd";
        this.adaptationShaderVersion = false;
    }
    private buildThisCode(): void {

        let coder: ShaderCodeBuilder2 = this.m_codeBuilder;
        coder.reset();

        coder.addVertLayout("vec3", "a_vs");

        coder.addVertLayout("vec2", "a_uvs");
        coder.addVertLayout("vec3", "a_nvs");
        coder.addTextureSample2D();
        coder.addTextureSample2D();

        coder.addVarying("vec2", "v_uv");
        coder.addVarying("vec3", "v_nv");
        coder.addVarying("vec4", "v_pos");
        coder.addVarying("float", "v_fogDepth");
        coder.addFragOutput("vec4", "FragColor0");

        this.vsmData.useUniforms( coder );
        if(this.envData != null) {
            coder.addDefine("VOX_FOG", "1");
            coder.addDefine("VOX_FOG_EXP2", "1");
            this.envData.useUniforms( coder );
        }
        
        coder.addFragUniform("vec4", "u_color");

        coder.useVertSpaceMats(true, true, true);
        coder.addFragFunction(VSMShaderCode.frag_head);

    }
    getFragShaderCode(): string {
        this.buildThisCode();

        this.m_codeBuilder.addFragMainCode(
`
const float fogNear = 500.0;
const float fogFar = 3500.0;
//const float fogDensity = 0.0005;
//const vec3 fogColor = vec3(0.3,0.0,1.0);
void main() {
    vec4 color = texture( u_sampler1, v_uv );

    float shadow = getVSMShadow( u_sampler0, u_vsmParams[1].xy, u_vsmParams[0].x, u_vsmParams[0].z, v_pos );
    float shadowIntensity = 1.0 - u_vsmParams[0].w;
    shadow = clamp(shadow, 0.0, 1.0) * (1.0 - shadowIntensity) + shadowIntensity;
    float f = clamp(dot(v_nv,u_vsmParams[2].xyz),0.0,1.0);
    shadow = f > 0.0001 ? min(shadow,clamp(f, shadowIntensity,1.0)) : shadowIntensity;
    f = u_vsmParams[1].z;
    shadow = shadow * (1.0 - f) + f;
    color.xyz *= u_color.xyz;

    FragColor0 = vec4(color.xyz * vec3(shadow), 1.0);

    #ifdef VOX_FOG
        vec3 fogColor = u_envLightParams[2].xyz;
    	#ifdef VOX_FOG_EXP2
            float fogDensity = u_envLightParams[2].w;
    		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * v_fogDepth * v_fogDepth );

    	#else

            float fogNear = u_envLightParams[1].z;
            float fogFar = u_envLightParams[1].w;
    		float fogFactor = smoothstep( fogNear, fogFar, v_fogDepth );

    	#endif

    	FragColor0.rgb = mix( FragColor0.rgb, fogColor, fogFactor );

    #endif
}
`
        );

        return this.m_codeBuilder.buildFragCode();
    }
    getVtxShaderCode(): string {
        this.m_codeBuilder.addVertMainCode(
`
void main() {
    vec4 wpos = u_objMat * vec4(a_vs, 1.0);
    vec4 viewPos = u_viewMat * wpos;
    gl_Position =  u_projMat * viewPos;
    v_uv = a_uvs.xy;
    v_nv = normalize(a_nvs * inverse(mat3(u_objMat)));
    //wpos.xyz += a_nvs.xyz * 0.05;
    v_pos = u_shadowMat * wpos;
    v_fogDepth = -viewPos.z;
}
`
        );
        return this.m_codeBuilder.buildVertCode();

    }
    getUniqueShaderName() {
        return this.m_uniqueName;
    }
    toString(): string {
        return "[ShadowVSMShaderBuffer()]";
    }
    static GetInstance(): ShadowVSMShaderBuffer {
        return ShadowVSMShaderBuffer.___s_instance;
    }
}

export default class ShadowVSMMaterial extends MaterialBase {
    private m_vsmData: ShadowVSMData = null;
    private m_envData: EnvLightData = null;
    constructor() {
        super();
    }

    getCodeBuf(): ShaderCodeBuffer {
        let buf: ShadowVSMShaderBuffer = ShadowVSMShaderBuffer.GetInstance();
        buf.vsmData = this.m_vsmData;
        buf.envData = this.m_envData;
        return buf;
    }
    setVSMData( vsm: ShadowVSMData ): void {
        this.m_vsmData = vsm;
    }
    setEnvData( envData: EnvLightData ): void {
        this.m_envData = envData;
    }
    private m_colorData: Float32Array = new Float32Array([1.0,1.0,1.0,1.0]);
    
    setRGB3f(r: number, g: number, b: number): void {
        this.m_colorData[0] = r;
        this.m_colorData[1] = g;
        this.m_colorData[2] = b;
    }
    createSharedUniforms():ShaderGlobalUniform[]
    {
        if(this.m_envData != null) {
            return [this.m_vsmData.getGlobalUinform(), this.m_envData.getGlobalUinform()];
        }
        return [this.m_vsmData.getGlobalUinform()];
    }
    createSelfUniformData(): ShaderUniformData {
        let oum: ShaderUniformData = new ShaderUniformData();
        oum.uniformNameList = ["u_color"];
        oum.dataList = [this.m_colorData];
        return oum;
    }
}