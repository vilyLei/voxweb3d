/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ShaderCodeBuffer from "../../../vox/material/ShaderCodeBuffer";
import ShaderCodeBuilder2 from "../../../vox/material/code/ShaderCodeBuilder2";
import ShaderUniformData from "../../../vox/material/ShaderUniformData";
import MaterialBase from "../../../vox/material/MaterialBase";
import SSAONoiseData from "./SSAONoiseData";
import UniformConst from "../../../vox/material/UniformConst";

class AODepTexShaderBuffer extends ShaderCodeBuffer
{
    constructor()
    {
        super();
    }
    private static s_instance:AODepTexShaderBuffer = new AODepTexShaderBuffer();
    private m_codeBuilder:ShaderCodeBuilder2 = new ShaderCodeBuilder2();
    private m_uniqueName:string = "";
    samplesTotal: number = 8;
    initialize(texEnabled:boolean):void
    {
        super.initialize(texEnabled);
        console.log("AODepTexShaderBuffer::initialize()...,texEnabled: "+texEnabled);
        this.m_uniqueName = "AOShd_"+this.samplesTotal;
        this.adaptationShaderVersion = false;
    }
    private buildThisCode():void
    {

        let coder:ShaderCodeBuilder2 = this.m_codeBuilder;
        coder.reset();

        coder.addVertLayout("vec3","a_vs");
        coder.addVertLayout("vec2","a_uvs");
        
        coder.addVarying("vec2", "v_uv");

        coder.addFragOutput("vec4", "FragColor0");

        coder.addDefine("AO_SamplesTotal", ""+this.samplesTotal);
        coder.addFragUniformParam(UniformConst.FrustumParam);
        coder.addFragUniformParam(UniformConst.ViewParam);

        // tex normal
        coder.addTextureSample2D();
        // tex noise
        coder.addTextureSample2D();
        // tex depth tex
        coder.addTextureSample2D();

        coder.useVertSpaceMats(false,false,false);
        coder.useFragSpaceMats(false,false,true);

        coder.addFragFunction(
`

`
        );
    }
    getFragShaderCode():string
    {
        this.buildThisCode();

        this.m_codeBuilder.addFragMainCode(
`
uniform vec3 u_aoSamples[AO_SamplesTotal];

const float radius = 100.0;
const float bias = 1.0;

// tile noise VOX_Texture2D over screen based on screen dimensions divided by noise size
const vec2 scale2 = vec2(2.0);
const vec2 halfOne = vec2(0.5);
vec2 noiseScale = vec2(0.0);

float perspectiveDepthToViewZ( const in float invClipZ, const in float near, const in float far ) {
    return ( near * far ) / ( ( far - near ) * invClipZ - far );
}
vec3 clacViewPosBySPAndVZ(vec2 screenPos, float viewZ)
{
    vec3 mpnv = vec3(screenPos.x * u_frustumParam.z, screenPos.y * u_frustumParam.w, u_frustumParam.x);
    return normalize(mpnv) * viewZ;
}
const vec2 noise2 = vec2(12.9898,78.233);
const vec3 noise3 = vec3(12.9898,78.233,158.5453);
vec2 rand(vec2 seed) {

    float noiseX = (fract(sin(dot(seed, noise2)) * 43758.5453));
    float noiseY = (fract(sin(dot(seed, noise2 * 2.0)) * 43758.5453));
    return vec2(noiseX,noiseY);
}
vec3 rand(vec3 seed) {
    float scale = 1.0;
    float scale2 = 43758.54;
    float noiseX = (fract(sin(scale * dot(seed, noise3)) * scale2));
    float noiseY = (fract(sin(scale * dot(seed, noise3 * 2.0)) * scale2));
    float noiseZ = (fract(sin(scale * dot(seed, noise3 * 3.0)) * scale2));
    return vec3(noiseX, noiseY, noiseZ);
}
void main()
{
    noiseScale.xy = 1.0/u_viewParam.zw;
    vec4 baseNormal = VOX_Texture2D(u_sampler0, v_uv);
    vec3 normal = normalize(baseNormal.xyz);
    float fz = VOX_Texture2D( u_sampler2, v_uv ).x;
    fz = -perspectiveDepthToViewZ(fz, u_frustumParam.x, u_frustumParam.y);
    //  FragColor0 = vec4(vec3(fz * 0.0001), 1.0);
    //  return;
    vec2 uv = scale2 * (v_uv - halfOne );
    vec3 fragPos = clacViewPosBySPAndVZ(uv, fz);
    fragPos.z = -fragPos.z;
    
    vec3 randomVec = normalize(VOX_Texture2D(u_sampler1, v_uv * noiseScale + 0.1 * rand(v_uv)).xyz);
    //  FragColor0 = vec4(vec3(randomVec), 1.0);
    //  return;
    //0.0->1.0 => -1.0 -> 1.0
    randomVec = randomVec * 2.0 - 1.0;
    randomVec.z = 0.0;
    // create TBN change-of-basis matrix: from tangent-space to view-space
    vec3 tangent = normalize(randomVec - normal * dot(randomVec, normal));
    vec3 bitangent = cross(normal, tangent);
    mat3 tbnMat3 = mat3(tangent, bitangent, normal);
    // iterate over the sample kernel and calculate occlusion factor
    float occlusion = 0.0;
    float total = float(AO_SamplesTotal);
    for(int i = 0; i < AO_SamplesTotal; i++)
    {
        // from tangent to view-space
        vec3 sample3 = tbnMat3 * u_aoSamples[i];
        float pr = radius * (0.05 + 0.95 * (fract( dot(v_uv.xy * float(i) * 12.9898, sample3.xy))));
        sample3 = fragPos + sample3 * pr;
        
        // project sample position (to sample texture) (to get position on screen/texture)
        vec4 offset = vec4(sample3, 1.0);
        // from view to clip-space
        offset = u_projMat * offset;
        // perspective divide
        offset.xy /= offset.w;
        // transform to range 0.0 - 1.0
        offset.xy = offset.xy * 0.5 + 0.5;
        // get sample depth

        float sampleDepth = VOX_Texture2D( u_sampler2, offset.xy ).x;
        sampleDepth = perspectiveDepthToViewZ(sampleDepth, u_frustumParam.x, u_frustumParam.y);
        //float sampleDepth = -VOX_Texture2D(u_sampler0, offset.xy).w;
        // range check & accumulate
        float rangeCheck = smoothstep(0.0, 1.0, pr / abs(fragPos.z - sampleDepth));
        occlusion += (sampleDepth >= (sample3.z + bias) ? 1.0 : 0.0) * rangeCheck;
    }

    FragColor0 = vec4(vec3(min(1.0 - ( occlusion / total), 1.0)), 1.0);
}
`
                        );
        
        return this.m_codeBuilder.buildFragCode();                    
    }
    getVtxShaderCode():string
    {
        this.m_codeBuilder.addVertMainCode(
`
void main()
{
    gl_Position = vec4(a_vs,1.0);
    v_uv = a_uvs.xy;
}
`
                        );
        return this.m_codeBuilder.buildVertCode();

    }
    getUniqueShaderName(): string
    {
        //console.log("H ########################### this.m_uniqueName: "+this.m_uniqueName);
        return this.m_uniqueName;
    }
    toString():string
    {
        return "[AODepTexShaderBuffer()]";
    }
    static GetInstance():AODepTexShaderBuffer
    {
        return AODepTexShaderBuffer.s_instance;
    }
}

export default class AODepTexMaterial extends MaterialBase
{
    private m_samplesTotal: number = 8;
    private m_ssaoData: SSAONoiseData = null;
    constructor(ssaoData: SSAONoiseData, samplesTotal: number = 8)
    {
        super();

        this.m_ssaoData = ssaoData;
        this.m_samplesTotal = samplesTotal;
    }
    
    getCodeBuf():ShaderCodeBuffer
    {
        let buf: AODepTexShaderBuffer = AODepTexShaderBuffer.GetInstance();
        buf.samplesTotal = this.m_samplesTotal;
        return buf;
    }
    createSelfUniformData(): ShaderUniformData {
        let oum: ShaderUniformData = new ShaderUniformData();
        oum.uniformNameList = [ "u_aoSamples" ];
        let fs: Float32Array = this.m_ssaoData.calcSampleKernel( this.m_samplesTotal, 1 );
        fs = fs.subarray(0,this.m_samplesTotal * 3);
        oum.dataList = [ fs ];
        return oum;
    }
    destroy(): void {
        super.destroy();
        this.m_ssaoData = null;
    }
}