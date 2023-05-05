/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ShaderCodeBuffer from "../../../vox/material/ShaderCodeBuffer";
import ShaderUniformData from "../../../vox/material/ShaderUniformData";
import MaterialBase from "../../../vox/material/MaterialBase";
import SSAONoiseData from "./SSAONoiseData";

class AOShaderBuffer extends ShaderCodeBuffer {
    constructor() {
        super();
    }
    private static s_instance: AOShaderBuffer = new AOShaderBuffer();
    private m_uniqueName: string = "";
    samplesTotal: number = 8;
    initialize(texEnabled: boolean): void {
        super.initialize(texEnabled);
        console.log("AOShaderBuffer::initialize()...,texEnabled: " + texEnabled);
        this.m_uniqueName = "AOShd_" + this.samplesTotal;
        this.adaptationShaderVersion = false;
    }
    buildShader(): void {

        let coder = this.m_coder;

        coder.addVertLayout("vec3", "a_vs");
        coder.addVertLayout("vec2", "a_uvs");

        coder.addDefine("AO_SamplesTotal", "" + this.samplesTotal);
        this.m_uniform.useFrustum();
        this.m_uniform.useViewPort();
        // tex normal
        coder.addTextureSample2D();
        // tex noise
        coder.addTextureSample2D();

        coder.useVertSpaceMats(false, false, false);
        coder.useFragSpaceMats(false, false, true);

        this.m_coder.addFragMainCode(
            `
uniform vec3 u_aoSamples[AO_SamplesTotal];

const float radius = 80.0;
const float bias = 0.1;

// tile noise VOX_Texture2D over screen based on screen dimensions divided by noise size
const vec2 scale2 = vec2(2.0);
const vec2 halfOne = vec2(0.5);
vec2 noiseScale = vec2(0.0);

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
    noiseScale.xy = 4.0/u_viewParam.zw;
    vec4 baseNormal = VOX_Texture2D(u_sampler0, v_uv);
    vec3 normal = baseNormal.xyz;

    vec2 uv = scale2 * (v_uv - halfOne );
    vec3 fragPos = clacViewPosBySPAndVZ(uv, baseNormal.w);
    fragPos.z = -fragPos.z;
    
    vec3 randomVec = normalize(VOX_Texture2D(u_sampler1, v_uv * noiseScale + 0.5 * rand(v_uv)).xyz);
    
    //0.0->1.0 => -1.0 -> 1.0
    //randomVec = randomVec * 2.0 - 1.0;
    //randomVec.z = 0.0;
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
        float pr = radius * (0.1 + 0.9 * (fract( dot(v_uv.xy * float(i) * 37.3197, sample3.xy))));
        sample3 = fragPos + sample3 * pr;
        
        // project sample position (to sample texture) (to get position on screen/texture)
        vec4 offset = u_projMat * vec4(sample3, 1.0);
        // from view to clip-space
        //offset = u_projMat * offset;
        // perspective divide
        offset.xy /= offset.w;
        // transform to range 0.0 - 1.0
        offset.xy = offset.xy * 0.5 + 0.5;
        // get sample depth        
        float sampleDepth = -VOX_Texture2D(u_sampler0, offset.xy).w;
        // range check & accumulate
        float rangeCheck = (pr/radius) * smoothstep(0.0, 1.0, pr / abs(fragPos.z - sampleDepth));
        //float rangeCheck = smoothstep(0.0, 1.0, pr / abs(fragPos.z - sampleDepth));
        occlusion += (sampleDepth >= (sample3.z + bias) ? 1.0 : 0.0) * rangeCheck;
        // highlight dege glow
        //occlusion += (sampleDepth < (sample3.z + bias) ? 1.0 : 0.0) * rangeCheck;
    }

    FragColor0 = vec4(vec3(min(1.0 - ( occlusion / total), 1.0)), 1.0);
}
`
        );

        this.m_coder.addVertMainCode(
            `
void main()
{
    gl_Position = vec4(a_vs,1.0);
    v_uv = a_uvs.xy;
}
`
        );
    }

    getUniqueShaderName(): string {
        //console.log("H ########################### this.m_uniqueName: "+this.m_uniqueName);
        return this.m_uniqueName;
    }
    toString(): string {
        return "[AOShaderBuffer()]";
    }
    static GetInstance(): AOShaderBuffer {
        return AOShaderBuffer.s_instance;
    }
}

export default class AOMaterial extends MaterialBase {
    private m_samplesTotal: number = 8;
    private m_ssaoData: SSAONoiseData = null;
    constructor(ssaoData: SSAONoiseData, samplesTotal: number = 8) {
        super();

        this.m_ssaoData = ssaoData;
        this.m_samplesTotal = samplesTotal;
    }

    getCodeBuf(): ShaderCodeBuffer {
        let buf: AOShaderBuffer = AOShaderBuffer.GetInstance();
        buf.samplesTotal = this.m_samplesTotal;
        return buf;
    }
    createSelfUniformData(): ShaderUniformData {
        let oum: ShaderUniformData = new ShaderUniformData();
        oum.uniformNameList = ["u_aoSamples"];
        let fs: Float32Array = this.m_ssaoData.calcSampleKernel(this.m_samplesTotal, 1);
        fs = fs.subarray(0, this.m_samplesTotal * 3);
        oum.dataList = [fs];
        return oum;
    }
    destroy(): void {
        super.destroy();
        this.m_ssaoData = null;
    }
}