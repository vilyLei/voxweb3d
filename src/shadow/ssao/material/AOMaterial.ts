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
import Matrix4 from "../../../vox/math/Matrix4";
import SSAONoiseData from "./SSAONoiseData";

class AOShaderBuffer extends ShaderCodeBuffer
{
    constructor()
    {
        super();
    }
    private static s_instance:AOShaderBuffer = new AOShaderBuffer();
    private m_codeBuilder:ShaderCodeBuilder2 = new ShaderCodeBuilder2();
    private m_uniqueName:string = "";
    samplesTotal: number = 8;
    initialize(texEnabled:boolean):void
    {
        super.initialize(texEnabled);
        //console.log("AOShaderBuffer::initialize()...,texEnabled: "+texEnabled);
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
        // tex normal
        coder.addTextureSample2D();
        // tex noise
        coder.addTextureSample2D();

        coder.useVertSpaceMats(false,false,false);

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
uniform mat4 u_projection;
uniform vec4 u_viewParam;

uniform vec4 u_frustumParam;

const float radius = 100.0;
const float bias = 1.0;

// tile noise VOX_Texture2D over screen based on screen dimensions divided by noise size
const vec2 scale2 = vec2(2.0);
const vec2 halfOne = vec2(0.5);
vec2 noiseScale = vec2(0.0);

vec3 clacViewPosBySPAndVZ(vec2 screenPos, float viewZ)
{
    vec3 mpnv = vec3(screenPos.x * u_frustumParam.z, screenPos.y * u_frustumParam.w, u_frustumParam.x);
    return normalize(mpnv) * viewZ;
}
void main()
{
    noiseScale.xy = 1.0/u_viewParam.zw;
    vec4 baseNormal = VOX_Texture2D(u_sampler0, v_uv);
    vec3 normal = baseNormal.xyz;
    
    //vec2 uv = (v_uv - 0.5 ) / vec2(0.5,0.5);
    vec2 uv = scale2 * (v_uv - halfOne );
    vec3 fragPos = clacViewPosBySPAndVZ(uv, baseNormal.w);
    fragPos.z = -fragPos.z;
    
    vec3 randomVec = normalize(VOX_Texture2D(u_sampler1, v_uv * noiseScale + fract( sin(dot(v_uv.xy+fract(baseNormal.x * 12.9867), vec2(12.9898, 78.233)))* 43758.5453 )).xyz);
    
    //0.0->1.0 => -1.0 -> 1.0
    randomVec = randomVec * 2.0 - 1.0;
    randomVec.z = 0.0;
    // create TBN change-of-basis matrix: from tangent-space to view-space
    vec3 tangent = normalize(randomVec - normal * dot(randomVec, normal));
    vec3 bitangent = cross(normal, tangent);
    mat3 tbnMat3 = mat3(tangent, bitangent, normal);
    // iterate over the sample kernel and calculate occlusion factor
    float occlusion = 0.0;
    for(int i = 0; i < AO_SamplesTotal; i++)
    {
        // from tangent to view-space
        vec3 sample3 = tbnMat3 * u_aoSamples[i];
        float pr = radius * 0.7 + 0.3 * radius * fract( sin(dot(fract(v_uv.xy * float(i+1) * 12.9898), vec2(12.9898, 78.233))));
        sample3 = fragPos + sample3 * pr;
        
        // project sample position (to sample texture) (to get position on screen/texture)
        vec4 offset = vec4(sample3, 1.0);
        // from view to clip-space
        offset = u_projection * offset;
        // perspective divide
        offset.xyz /= offset.w;
        // transform to range 0.0 - 1.0
        offset.xyz = offset.xyz * 0.5 + 0.5;
        // get sample depth
        
        float sampleDepth = -VOX_Texture2D(u_sampler0, offset.xy).w;
        //          float sampleDepth = VOX_Texture2D(u_sampler0, offset.xy).a;
        //          uv = scale2 * (offset.xy - halfOne );
        //          sampleDepth = -clacViewPosBySPAndVZ(uv, sampleDepth).z;
        // range check & accumulate
        float rangeCheck = smoothstep(0.0, 1.0, pr / abs(fragPos.z - sampleDepth));
        occlusion += (sampleDepth >= (sample3.z + bias) ? 1.0 : 0.0) * rangeCheck;
        //occlusion += (sampleDepth >= (sample3.z + bias) ? 0.0 : 1.0) * rangeCheck;
    }

    FragColor0 = vec4(vec3(min(1.0 - ( occlusion / float(AO_SamplesTotal)), 1.0)), 1.0);
    //FragColor0 = vec4(vec3(u_aoSamples[0]), 1.0);
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
    //v_uv = vec2(a_uvs.x, 1.0 - a_uvs.y);
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
        return "[AOShaderBuffer()]";
    }
    static GetInstance():AOShaderBuffer
    {
        return AOShaderBuffer.s_instance;
    }
}

export default class AOMaterial extends MaterialBase
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
        let buf: AOShaderBuffer = AOShaderBuffer.GetInstance();
        buf.samplesTotal = this.m_samplesTotal;
        return buf;
    }
    private m_projMat4: Matrix4 = new Matrix4();

    setProjMat4(projMat4: Matrix4): void {
        this.m_projMat4 = projMat4;
    }
    createSelfUniformData(): ShaderUniformData {
        let oum: ShaderUniformData = new ShaderUniformData();
        oum.uniformNameList = ["u_projection","u_aoSamples"];
        //console.log("this.m_projMat4.getLocalFS32(): ",this.m_projMat4.getLocalFS32());
        let fs: Float32Array = this.m_ssaoData.calcSampleKernel( this.m_samplesTotal );
        fs = fs.subarray(0,this.m_samplesTotal * 3);
        oum.dataList = [ this.m_projMat4.getLocalFS32(), fs ];
        return oum;
    }
    destroy(): void {
        super.destroy();
        this.m_ssaoData = null;
    }
}