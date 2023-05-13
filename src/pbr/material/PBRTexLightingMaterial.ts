/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import RendererDevice from "../../vox/render/RendererDevice";
import ShaderCodeBuffer from "../../vox/material/ShaderCodeBuffer";
import ShaderUniformData from "../../vox/material/ShaderUniformData";
import MaterialBase from "../../vox/material/MaterialBase";
import Vector3D from "../../vox/math/Vector3D";

class PBRTexLightingShaderBuffer extends ShaderCodeBuffer {
    constructor() {
        super();
    }
    private static s_instance: PBRTexLightingShaderBuffer = new PBRTexLightingShaderBuffer();
    private m_uniqueName: string = "";
    bake = false;
    initialize(texEnabled: boolean): void {
        //console.log("PBRTexLightingShaderBuffer::initialize()...");
        this.m_uniqueName = "PBRTexLightingShd";
    }
    getFragShaderCode(): string {
        let fragCode0: string =
`#version 300 es
precision highp float;
`
        let fragCode2: string =
`out vec4 FragColor;
in vec2 TexCoords;
in vec3 WorldPos;
in vec3 Normal;
in vec3 v_camPos;

// material parameters
uniform sampler2D u_sampler0;// albedoMap
uniform sampler2D u_sampler1;// normalMap
uniform sampler2D u_sampler2;// metallicMap
uniform sampler2D u_sampler3;// roughnessMap
uniform sampler2D u_sampler4;// aoMap

// lights
uniform vec4 u_lightPositions[4];
uniform vec4 u_lightColors[4];

//uniform vec3 u_camPos;

const float PI = 3.14159265359;
// ----------------------------------------------------------------------------
// Easy trick to get tangent-normals to world-space to keep PBR code simplified.
// Don't worry if you don't get what's going on; you generally want to do normal 
// mapping the usual way for performance anways; I do plan make a note of this 
// technique somewhere later in the normal mapping tutorial.
vec3 getNormalFromMap()
{
    vec3 tangentNormal = texture(u_sampler1, TexCoords).xyz * 2.0 - 1.0;

    vec3 Q1  = dFdx(WorldPos);
    vec3 Q2  = dFdy(WorldPos);
    vec2 st1 = dFdx(TexCoords);
    vec2 st2 = dFdy(TexCoords);

    vec3 N   = normalize(Normal);
    vec3 T  = normalize(Q1*st2.t - Q2*st1.t);
    vec3 B  = -normalize(cross(N, T));
    mat3 TBN = mat3(T, B, N);

    return normalize(TBN * tangentNormal);
}
// ----------------------------------------------------------------------------
float DistributionGGX(vec3 N, vec3 H, float roughness)
{
    float a = roughness*roughness;
    float a2 = a*a;
    float NdotH = max(dot(N, H), 0.0);
    float NdotH2 = NdotH*NdotH;

    float nom   = a2;
    float denom = (NdotH2 * (a2 - 1.0) + 1.0);
    denom = PI * denom * denom;

    return nom / denom;
}
// ----------------------------------------------------------------------------
float GeometrySchlickGGX(float NdotV, float roughness)
{
    float r = (roughness + 1.0);
    float k = (r*r) / 8.0;

    float nom   = NdotV;
    float denom = NdotV * (1.0 - k) + k;

    return nom / denom;
}
// ----------------------------------------------------------------------------
float GeometrySmith(vec3 N, vec3 V, vec3 L, float roughness)
{
    float NdotV = max(dot(N, V), 0.0);
    float NdotL = max(dot(N, L), 0.0);
    float ggx2 = GeometrySchlickGGX(NdotV, roughness);
    float ggx1 = GeometrySchlickGGX(NdotL, roughness);

    return ggx1 * ggx2;
}
// ----------------------------------------------------------------------------
vec3 fresnelSchlick(float cosTheta, vec3 F0)
{
    return F0 + (1.0 - F0) * pow(max(1.0 - cosTheta, 0.0), 5.0);
}
#define  OneOnLN2_x6 8.656171// == 1/ln(2) * 6 (6 is SpecularPower of 5 + 1)
vec3 fresnelSchlick3(vec3 specularColor, float dot, float glossiness)
{
	return specularColor + (max(vec3(glossiness), specularColor) - specularColor) * exp2(-OneOnLN2_x6 * dot); 
}
// ----------------------------------------------------------------------------
void main()
{
    vec3 albedo     = pow(texture(u_sampler0, TexCoords).rgb, vec3(2.2));
    float metallic  = texture(u_sampler2, TexCoords).r;
    float roughness = texture(u_sampler3, TexCoords).r;
    float ao        = texture(u_sampler4, TexCoords).r;

    vec3 N = getNormalFromMap();
    vec3 V = normalize(v_camPos - WorldPos);

    // calculate reflectance at normal incidence; if dia-electric (like plastic) use F0 
    // of 0.04 and if it's a metal, use the albedo color as F0 (metallic workflow)    
    vec3 F0 = vec3(0.04); 
    F0 = mix(F0, albedo, metallic);

    // reflectance equation
    vec3 Lo = vec3(0.0);
    for(int i = 0; i < 4; ++i) 
    {
        // calculate per-light radiance
        vec3 L = normalize(u_lightPositions[i].xyz - WorldPos);
        vec3 H = normalize(V + L);
        float distance = length(u_lightPositions[i].xyz - WorldPos);
        //float attenuation = 1.0 / (distance * distance);
        float attenuation = 1.0 / (1.0 + 0.001 * distance + 0.0003 * distance * distance);
        vec3 radiance = u_lightColors[i].xyz * attenuation;

        // Cook-Torrance BRDF
        float NDF = DistributionGGX(N, H, roughness);   
        float G   = GeometrySmith(N, V, L, roughness);      
        vec3 F    = fresnelSchlick(max(dot(H, V), 0.0), F0);
           
        vec3 nominator    = NDF * G * F; 
        float denominator = 4.0 * max(dot(N, V), 0.0) * max(dot(N, L), 0.0) + 0.001; // 0.001 to prevent divide by zero.
        vec3 specular = nominator / denominator;
        
        // kS is equal to Fresnel
        vec3 kS = F;
        // for energy conservation, the diffuse and specular light can't
        // be above 1.0 (unless the surface emits light); to preserve this
        // relationship the diffuse component (kD) should equal 1.0 - kS.
        vec3 kD = vec3(1.0) - kS;
        // multiply kD by the inverse metalness such that only non-metals 
        // have diffuse lighting, or a linear blend if partly metal (pure metals
        // have no diffuse light).
        kD *= 1.0 - metallic;	  

        // scale light by NdotL
        float NdotL = max(dot(N, L), 0.0);        

        // add to outgoing radiance Lo
        Lo += (kD * albedo / PI + specular) * radiance * NdotL;  // note that we already multiplied the BRDF by the Fresnel (kS) so we won't multiply by kS again
    }   
    
    // ambient lighting (note that the next IBL tutorial will replace 
    // this ambient lighting with environment lighting).
    vec3 ambient = vec3(0.03) * albedo * ao;
    
    vec3 color = ambient + Lo;

    // HDR tonemapping
    color = color / (color + vec3(1.0));
    // gamma correct
    color = pow(color, vec3(1.0/2.2));

    FragColor = vec4(color, 1.0);
}
`;
        return fragCode0 + fragCode2;
    }
    getVertShaderCode(): string {
        let vtxCode0: string =`#version 300 es
        precision highp float;`;
        let vtxCode1: string = "";
        if(this.bake) {
            vtxCode1 = "\n#define BAKE 1\n"
        }
        ///*
        let vtxCode2: string =
`
layout(location = 0) in vec3 a_vs;
layout(location = 1) in vec2 a_uvs;
layout(location = 2) in vec3 a_nvs;

uniform mat4 u_objMat;
uniform mat4 u_viewMat;
uniform mat4 u_projMat;
uniform vec4 u_offset;

out vec2 TexCoords;
out vec3 WorldPos;
out vec3 Normal;
out vec3 v_camPos;

void main(){

    vec4 wPos = u_objMat * vec4(a_vs, 1.0);
    vec4 viewPos = u_viewMat * wPos;
    gl_Position = u_projMat * viewPos;

    WorldPos = wPos.xyz;
    TexCoords = a_uvs;
    Normal = normalize(a_nvs * inverse(mat3(u_objMat)));
    v_camPos = (inverse(u_viewMat) * vec4(0.0,0.0,0., 1.0)).xyz;

    #ifdef BAKE
    vec2 uvpos = a_uvs.xy;
    uvpos = vec2(2.0) * vec2(uvpos - vec2(0.5));
    uvpos += u_offset.xy;
    gl_Position = vec4(uvpos, 0.0,1.0);
    #endif
}
`;
//*/
        return vtxCode0 + vtxCode1 + vtxCode2;
    }
    getUniqueShaderName(): string {
        //console.log("H ########################### this.m_uniqueName: "+this.m_uniqueName);
        return this.m_uniqueName + (this.bake ? "bake" : "");
    }
    toString(): string {
        return "[PBRTexLightingShaderBuffer()]";
    }

    static GetInstance(): PBRTexLightingShaderBuffer {
        return PBRTexLightingShaderBuffer.s_instance;
    }
}

export default class PBRTexLightingMaterial extends MaterialBase {
    private m_offset = new Float32Array([0.0, 0.0, 0.0, 0.0]);
    bake = false;
    constructor() {
        super();
    }

    setOffsetXY(px: number, py: number): void {
        this.m_offset[0] = px;
        this.m_offset[1] = py;
    }
    getCodeBuf(): ShaderCodeBuffer {

        let ins = PBRTexLightingShaderBuffer.GetInstance();
        ins.bake = this.bake;
        return ins;
    }

    private m_albedo: Float32Array = new Float32Array([0.5, 0.0, 0.0, 0.0]);
    private m_params: Float32Array = new Float32Array([0.0, 0.0, 1.0, 0.0]);
    private m_camPos: Float32Array = new Float32Array([500.0, 500.0, 500.0, 1.0]);
    private m_lightPositions: Float32Array = new Float32Array(4 * 4);
    private u_lightColors: Float32Array = new Float32Array(4 * 4);

    setMetallic(metallic: number): void {

        this.m_params[0] = metallic;
    }
    setRoughness(roughness: number): void {

        //roughness = Math.max(1.0 - j/(cn - 1), 0.05);
        roughness = Math.min(Math.max(roughness, 0.05), 1.0);
        this.m_params[1] = roughness;
    }
    setAO(ao: number): void {

        this.m_params[2] = ao;
    }
    setPosAt(i: number, px: number, py: number, pz: number): void {

        i *= 4;
        this.m_lightPositions[i] = px;
        this.m_lightPositions[i + 1] = py;
        this.m_lightPositions[i + 2] = pz;
    }
    setColor(pr: number, pg: number, pb: number): void {

        this.m_albedo[0] = pr;
        this.m_albedo[1] = pg;
        this.m_albedo[2] = pb;
    }
    setColorAt(i: number, pr: number, pg: number, pb: number): void {

        i *= 4;
        this.u_lightColors[i] = pr;
        this.u_lightColors[i + 1] = pg;
        this.u_lightColors[i + 2] = pb;
    }
    setCamPos(pos: Vector3D): void {

        this.m_camPos[0] = pos.x;
        this.m_camPos[1] = pos.y;
        this.m_camPos[2] = pos.z;
    }
    createSelfUniformData(): ShaderUniformData {

        //  console.log("this.m_albedo: ",this.m_albedo);
        //  console.log("this.m_params: ",this.m_params);
        //  console.log("this.m_camPos: ",this.m_camPos);
        let oum: ShaderUniformData = new ShaderUniformData();
        oum.uniformNameList = ["u_albedo", "u_lightPositions", "u_lightColors", "u_camPos", "u_offset"];
        oum.dataList = [this.m_albedo, this.m_lightPositions, this.u_lightColors, this.m_camPos, this.m_offset];
        return oum;
    }
}