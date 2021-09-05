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
import Vector3D from "../../../vox/math/Vector3D";
import Matrix4 from "../../../vox/math/Matrix4";

class ShadowEntityShaderBuffer extends ShaderCodeBuffer {
    constructor() {
        super();
    }
    private static s_instance: ShadowEntityShaderBuffer = new ShadowEntityShaderBuffer();
    private m_codeBuilder: ShaderCodeBuilder2 = new ShaderCodeBuilder2();
    private m_uniqueName: string = "";
    initialize(texEnabled: boolean): void {
        super.initialize(texEnabled);
        //console.log("ShadowEntityShaderBuffer::initialize()...,texEnabled: "+texEnabled);
        this.m_uniqueName = "ShadowEntityShd";
        this.adaptationShaderVersion = false;
    }
    private buildThisCode(): void {

        let coder: ShaderCodeBuilder2 = this.m_codeBuilder;
        coder.reset();
        //  if(RendererDevice.IsWebGL1()) {
        //      coder.addFragExtend("#extension GL_OES_standard_derivatives : enable");
        //      //coder.addFragExtend("#extension GL_EXT_shader_texture_lod : enable");
        //  }
        coder.addVertLayout("vec3", "a_vs");
        
        coder.addVertLayout("vec2", "a_uvs");
        coder.addVertLayout("vec3", "a_nvs");
        coder.addTextureSample2D();
        coder.addTextureSample2D();

        coder.addVarying("vec2", "v_uv");
        coder.addVarying("vec3", "v_nv");
        coder.addVarying("vec4", "v_pos");
        coder.addFragOutput("vec4", "FragColor0");
        coder.addFragUniform("vec4", "u_color");
        coder.addFragUniform("vec4", "u_param[3]");
        coder.addVertUniform("mat4", "u_shadowMat");

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
        float variance = max( 0.00000, distribution.y * distribution.y );
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
    vec4 color = texture( u_sampler0, v_uv );
    
    float shadow = getVSMShadow( u_sampler1, u_param[1].xy, u_param[0].x, u_param[0].z, v_pos );
    float shadowIntensity = 1.0 - u_param[0].w;
    shadow = clamp(shadow, 0.0, 1.0) * (1.0 - shadowIntensity) + shadowIntensity;
    float f = clamp(dot(v_nv,u_param[2].xyz),0.0,1.0);
    f = f > 0.0001 ? min(shadow,clamp(f, shadowIntensity,1.0)) : shadowIntensity;
    
    FragColor0 = vec4(color.xyz * vec3(f * 0.9 + 0.1), 1.0);
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
    //v_pos.xy += vec2(-0.01);
}
`
        );
        return this.m_codeBuilder.buildVertCode();

    }
    getUniqueShaderName(): string {
        //console.log("H ########################### this.m_uniqueName: "+this.m_uniqueName);
        return this.m_uniqueName;
    }
    toString(): string {
        return "[ShadowEntityShaderBuffer()]";
    }
    static GetInstance(): ShadowEntityShaderBuffer {
        return ShadowEntityShaderBuffer.s_instance;
    }
}

export default class ShadowEntityMaterial extends MaterialBase {
    constructor() {
        super();
    }

    getCodeBuf(): ShaderCodeBuffer {
        return ShadowEntityShaderBuffer.GetInstance();
    }
    private m_shadowMat: Float32Array = null;
    private m_shadowParam: Float32Array = new Float32Array([
        -0.0005             // shadowBias
        , 0.0               // shadowNormalBias
        , 4                 // shadowRadius
        , 0.8               // shadow intensity

        , 512, 512           // shadowMapSize(width, height)
        , 0.0, 0.0           // undefined

        
        , 1.0, 1.0, 1.0      // direc light nv(x,y,z)
        , 0.0                // undefined
    ]);

    setShadowMatrix(mat4: Matrix4): void {
        this.m_shadowMat = mat4.getLocalFS32();
    }
    setShadowParam(shadowBias: number, shadowNormalBias: number, shadowRadius: number): void {
        this.m_shadowParam[0] = shadowBias;
        this.m_shadowParam[1] = shadowNormalBias;
        this.m_shadowParam[2] = shadowRadius;
    }
    setShadowIntensity(intensity: number): void {
        this.m_shadowParam[3] = intensity;
    }
    setShadowRadius(radius: number): void {
        this.m_shadowParam[2] = radius;
    }
    setShadowBias(bias: number): void {
        this.m_shadowParam[0] = bias;
    }
    setShadowSize(width: number, height: number): void {
        this.m_shadowParam[4] = width;
        this.m_shadowParam[5] = height;
    }
    setDirec(v3: Vector3D): void {
        this.m_shadowParam[8] = -v3.x;
        this.m_shadowParam[9] = -v3.y;
        this.m_shadowParam[10] = -v3.z;
    }
    createSharedUniforms():ShaderGlobalUniform[]
    {
        return null;
    }
    createSelfUniformData(): ShaderUniformData {
        let oum: ShaderUniformData = new ShaderUniformData();
        oum.uniformNameList = ["u_param", "u_shadowMat"];
        oum.dataList = [this.m_shadowParam, this.m_shadowMat];
        return oum;
    }
}