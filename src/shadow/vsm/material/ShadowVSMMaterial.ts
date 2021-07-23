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
import ShaderCodeBuilder from "../../../vox/material/code/ShaderCodeBuilder";
import Vector3D from "../../../vox/math/Vector3D";
import RendererDeviece from "../../../vox/render/RendererDeviece";
import Matrix4 from "../../../vox/math/Matrix4";
import ShadowVSMData from "./ShadowVSMData";
import UniformConst from "../../../vox/material/UniformConst";

class ShadowVSMShaderBuffer extends ShaderCodeBuffer {
    constructor() {
        super();
    }
    private static ___s_instance: ShadowVSMShaderBuffer = new ShadowVSMShaderBuffer();
    private m_codeBuilder: ShaderCodeBuilder2 = new ShaderCodeBuilder2();
    private m_uniqueName: string = "";
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
        coder.addFragOutput("vec4", "FragColor0");
        coder.addFragUniform("vec4", UniformConst.ShadowVSMParamsUNS, 3);
        coder.addVertUniform("mat4", UniformConst.ShadowMatrixUNS);
        coder.addFragUniform("vec4", "u_color");

        coder.useVertSpaceMats(true, true, true);
        coder.addFragFunction(
            `

vec4 pack2HalfToRGBA( vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ));
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w);
}
vec2 unpackRGBATo2Half( vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}

vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {

    return unpackRGBATo2Half( texture( shadow, uv ) );

}
float VSMShadow (sampler2D shadow, vec2 uv, float compare ) {

    float occlusion = 1.0;

    vec2 distribution = texture2DDistribution( shadow, uv );

    float hard_shadow = step( compare , distribution.x ); // Hard Shadow

    if (hard_shadow != 1.0 ) {

        float distance = compare - distribution.x ;
        float variance = max( 0.0, distribution.y * distribution.y );
        float softness_probability = variance / (variance + distance * distance ); // Chebeyshevs inequality
        softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 ); // 0.3 reduces light bleed
        occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );

    }
    return occlusion;

}
float getVSMShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord ) {

    float shadow = 1.0;
    
    shadowCoord.xyz /= shadowCoord.w;
    shadowCoord.z += shadowBias;
    
    // if ( something && something ) breaks ATI OpenGL shader compiler
    // if ( all( something, something ) ) using this instead

    bvec4 inFrustumVec = bvec4 ( shadowCoord.x >= 0.0, shadowCoord.x <= 1.0, shadowCoord.y >= 0.0, shadowCoord.y <= 1.0 );
    bool inFrustum = all( inFrustumVec );

    bvec2 frustumTestVec = bvec2( inFrustum, shadowCoord.z <= 1.0 );

    bool frustumTest = all( frustumTestVec );

    if ( frustumTest ) {
        shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
    }
    return shadow;
}
`
        );
    }
    getFragShaderCode(): string {
        this.buildThisCode();

        this.m_codeBuilder.addFragMainCode(
`
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
}
`
        );
        return this.m_codeBuilder.buildVertCode();

    }
    getUniqueShaderName() {
        //console.log("H ########################### this.m_uniqueName: "+this.m_uniqueName);
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
    constructor() {
        super();
    }

    getCodeBuf(): ShaderCodeBuffer {
        return ShadowVSMShaderBuffer.GetInstance();
    }
    setVSMData( vsm: ShadowVSMData ): void {
        this.m_vsmData = vsm;
    }
    private m_colorData: Float32Array = new Float32Array([1.0,1.0,1.0,1.0]);
    
    setRGB3f(r: number, g: number, b: number): void {
        this.m_colorData[0] = r;
        this.m_colorData[1] = g;
        this.m_colorData[2] = b;
    }
    createSharedUniform():ShaderGlobalUniform
    {
        return this.m_vsmData.getGlobalUinform();
    }
    createSelfUniformData(): ShaderUniformData {
        let oum: ShaderUniformData = new ShaderUniformData();
        oum.uniformNameList = ["u_color"];
        oum.dataList = [this.m_colorData];
        return oum;
    }
}