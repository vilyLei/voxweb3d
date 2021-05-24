/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import RendererDeviece from "../../../vox/render/RendererDeviece";
import ShaderCodeBuffer from "../../../vox/material/ShaderCodeBuffer";
import ShaderUniformData from "../../../vox/material/ShaderUniformData";
import MaterialBase from "../../vox/../material/MaterialBase";

class AdsLightShaderBuffer extends ShaderCodeBuffer {
    constructor() {
        super();
    }
    private static ___s_instance: AdsLightShaderBuffer = new AdsLightShaderBuffer();
    private m_uniqueName: string = "";
    initialize(texEnabled: boolean): void {
        //console.log("AdsLightShaderBuffer::initialize()...");
        this.m_uniqueName = "AdsLightShd";
    }
    getFragShaderCode(): string {
        let fragCode: string =
            `#version 300 es
precision mediump float;
uniform sampler2D u_sampler0;

uniform vec4 u_colors[1];
uniform vec4 u_params[1];
uniform vec4 u_gloss;

in vec3 v_vs;
in vec2 v_uvs;
in vec3 v_nvs;
in vec4 v_positions[1];

vec3 getFragAdsLight(vec3 baseColor, vec3 lightPos, vec3 lightColor, vec3 paramVec3, vec3 specVec3,vec3 pnvs)
{
    vec3 lightDirVec3 = lightPos - v_vs;
    float disFloat = length(lightDirVec3);
    lightDirVec3 = normalize(lightDirVec3);
    float nDotL = max(dot(pnvs, lightDirVec3), 0.0);
    lightPos = nDotL * baseColor * lightColor;
    vec3 viewDir = normalize(lightDirVec3 + normalize(-v_vs));
    lightColor = specVec3 * lightColor * nDotL * pow(max(dot(pnvs, viewDir), 0.0), 16.0);
    disFloat = 1.0 / (1.0 + paramVec3.x * disFloat + paramVec3.y * disFloat * disFloat);
    return (lightPos * u_gloss.x + lightColor * u_gloss.y) * disFloat * paramVec3.z;
}
vec3 calcLight(vec3 baseColor, vec3 lightPos, vec3 lightColor, vec3 specColor, vec3 lightParam) {

    vec3 nvs = normalize(v_nvs);
	float linear = lightParam.x;
	float quadratic = lightParam.y;
	float density = lightParam.z;
	vec3 viewDir = normalize(-v_vs);
	vec3 lightDir = lightPos - v_vs;
	float d = length(lightDir);
	lightDir = normalize(lightDir);
    float nDotL = max(dot(nvs, lightDir), 0.0);
	lightPos = nDotL * baseColor * lightColor;
	viewDir = normalize(lightDir + viewDir);
	lightColor = specColor * nDotL * pow(max(dot(nvs, viewDir), 0.0), 32.0);
	d = 1.0 / (1.0 + linear * d + quadratic * d * d);
	return (lightPos * u_gloss.x + lightColor * u_gloss.y) * d * density;
}

layout(location = 0) out vec4 FragColor0;
void main()
{
    vec4 color4 = texture(u_sampler0, v_uvs);
    
    vec3 destColor = calcLight(
        color4.xyz,
        v_positions[0].xyz,
        u_colors[0].xyz,
        vec3(0.3,0.2,0.8),
        u_params[0].xyz
        );
    FragColor0 = vec4(destColor * u_gloss.w + u_gloss.z * color4.xyz, 1.0);
}
`;
        return fragCode;
    }
    getVtxShaderCode(): string {
        let vtxCode: string =
            `#version 300 es
precision mediump float;

layout(location = 0) in vec3 a_vs;
layout(location = 1) in vec2 a_uvs;
layout(location = 2) in vec3 a_nvs;

uniform vec4 u_positions[1];

uniform mat4 u_objMat;
uniform mat4 u_viewMat;
uniform mat4 u_projMat;

out vec3 v_vs;
out vec2 v_uvs;
out vec3 v_nvs;
out vec4 v_positions[1];

void main(){

    mat4 viewMat4 = u_viewMat * u_objMat;
    vec4 viewPos = viewMat4 * vec4(a_vs, 1.0);
    gl_Position = u_projMat * viewPos;

    v_vs = viewPos.xyz;
    v_uvs = a_uvs;
    v_nvs = normalize(a_nvs * inverse(mat3(viewMat4)));
    v_positions[0] = viewMat4 * u_positions[0];
}
`;
        return vtxCode;
    }
    getUniqueShaderName() {
        //console.log("H ########################### this.m_uniqueName: "+this.m_uniqueName);
        return this.m_uniqueName;
    }
    toString(): string {
        return "[AdsLightShaderBuffer()]";
    }

    static GetInstance(): AdsLightShaderBuffer {
        return AdsLightShaderBuffer.___s_instance;
    }
}

export default class AdsLightMaterial extends MaterialBase {
    constructor() {
        super();
    }

    getCodeBuf(): ShaderCodeBuffer {
        return AdsLightShaderBuffer.GetInstance();
    }

    private m_colorArray: Float32Array = new Float32Array([1.0, 0.0, 1.0, 8.0]);
    private m_positions: Float32Array = new Float32Array([400.0, 400.0, -400.0, 1.0]);
    private m_params: Float32Array = new Float32Array([0.0001, 0.000003, 1.0, 0.0]);
    private m_gloss: Float32Array = new Float32Array([0.8, 0.8, 0.2, 0.8]);

    createSelfUniformData(): ShaderUniformData {
        let oum: ShaderUniformData = new ShaderUniformData();
        oum.uniformNameList = ["u_colors", "u_positions", "u_params", "u_gloss"];
        oum.dataList = [this.m_colorArray, this.m_positions, this.m_params, this.m_gloss];
        return oum;
    }
}