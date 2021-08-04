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

class ShadowVSMShaderBuffer extends ShaderCodeBuffer {
    constructor() {
        super();
    }
    private static s_instance: ShadowVSMShaderBuffer = new ShadowVSMShaderBuffer();
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
        coder.addVarying("vec3", "v_worldNormal");
        coder.addFragOutput("vec4", "FragColor0");

        this.vsmData.useUniforms( coder );

        if(this.envData != null) {
            this.envData.useUniformsForFog( coder );
        }
        coder.addDefine("VOX_VSM_MAP", "u_sampler0");
        coder.addFragUniform("vec4", "u_color");

        coder.useVertSpaceMats(true, true, true);
        coder.vertMatrixInverseEnabled = true;

    }
    getFragShaderCode(): string {
        this.buildThisCode();

        this.m_codeBuilder.addFragMainCode(
`
void main() {
    vec4 color = VOX_Texture2D( u_sampler1, v_uv );


    color.xyz *= u_color.xyz;

    #ifdef VOX_USE_SHADOW

    float factor = getVSMShadowFactor(v_shadowPos);
    color.xyz *= vec3(factor);

    //FragColor0 = vec4(vec3(factor), 1.0);
    //  FragColor0 = VOX_Texture2D(u_sampler0, gl_FragCoord.xy/vec2(300.0));
    //  return;

    #endif
    
    FragColor0 = vec4(color.xyz, 1.0);

    #ifdef VOX_USE_FOG

    useFog( FragColor0.rgb );

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
    v_worldNormal = normalize(a_nvs * inverse(mat3(u_objMat)));
    //wpos.xyz += a_nvs.xyz * 0.05;

    #ifdef VOX_USE_SHADOW

    calcShadowPos( wpos );

    #endif

    #ifdef VOX_USE_FOG

    calcFogDepth(viewPos);

    #endif
}
`
        );
        return this.m_codeBuilder.buildVertCode();

    }
    getUniqueShaderName(): string {
        return this.m_uniqueName;
    }
    toString(): string {
        return "[ShadowVSMShaderBuffer()]";
    }
    static GetInstance(): ShadowVSMShaderBuffer {
        return ShadowVSMShaderBuffer.s_instance;
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