/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import RendererDevice from "../../../vox/render/RendererDevice";
import ShaderCodeBuffer from "../../../vox/material/ShaderCodeBuffer";
import ShaderUniformData from "../../../vox/material/ShaderUniformData";
import MaterialBase from "../../vox/../material/MaterialBase";

class LambertDirecLightShaderBuffer extends ShaderCodeBuffer {
    constructor() {
        super();
    }
    private static s_instance: LambertDirecLightShaderBuffer = new LambertDirecLightShaderBuffer();
    private m_uniqueName: string = "";
    initialize(texEnabled: boolean): void {
        //console.log("LambertDirecLightShaderBuffer::initialize()...");
        this.m_uniqueName = "LambertDirecLightShd";
    }
    getFragShaderCode(): string {
        let fragCode: string =
`#version 300 es
precision mediump float;
uniform sampler2D u_sampler0;

in vec3 v_viewDir;
in vec2 v_uv;
in vec3 v_nv;
in vec4 v_positions[1];

vec3 calcLight(vec3 baseColor, vec3 pLightDir, vec3 lightColor, vec3 specColor) {

    vec3 nvs = (v_nv);
	vec3 viewDir = v_viewDir;
    float nDotL = max(dot(nvs, pLightDir), 0.0);
	baseColor = nDotL * baseColor * lightColor;
	viewDir = normalize(pLightDir + viewDir);
	lightColor = specColor * nDotL * pow(max(dot(nvs, viewDir), 0.0), 32.0);
	return (baseColor * 0.3 + lightColor * 0.7);
}

layout(location = 0) out vec4 FragColor0;
const vec3 lightDirec = normalize(vec3(1.0,1.0,1.0));
const vec3 lightColor = vec3(1.0,1.0,1.0);
const vec3 lightSpecColor = vec3(0.3,0.2,0.8);
void main()
{
    vec4 color4 = texture(u_sampler0, v_uv);
    //vec3 destColor = color4.xyz;
    vec3 destColor = calcLight(
        color4.xyz,
        lightDirec,
        lightColor,
        lightSpecColor
        );
    FragColor0 = vec4(destColor * 0.9 + 0.2 * color4.xyz, 1.0);
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

out vec3 v_viewDir;
out vec2 v_uv;
out vec3 v_nv;
out vec4 v_positions[1];

void main(){

    mat4 viewMat4 = u_viewMat * u_objMat;
    vec4 viewPos = viewMat4 * vec4(a_vs, 1.0);
    gl_Position = u_projMat * viewPos;

    v_viewDir = -normalize(viewPos.xyz);
    v_uv = a_uvs;
    v_nv = normalize(a_nvs * inverse(mat3(viewMat4)));
    v_positions[0] = viewMat4 * u_positions[0];
}
`;
        return vtxCode;
    }
    getUniqueShaderName(): string {
        //console.log("H ########################### this.m_uniqueName: "+this.m_uniqueName);
        return this.m_uniqueName;
    }
    toString(): string {
        return "[LambertDirecLightShaderBuffer()]";
    }

    static GetInstance(): LambertDirecLightShaderBuffer {
        return LambertDirecLightShaderBuffer.s_instance;
    }
}

export default class LambertDirecLightMaterial extends MaterialBase {

    constructor() {
        super();
    }

    getCodeBuf(): ShaderCodeBuffer {
        return LambertDirecLightShaderBuffer.GetInstance();
    }

    //  private m_colorArray: Float32Array = new Float32Array([1.0, 0.0, 1.0, 8.0]);
    //  private m_positions: Float32Array = new Float32Array([400.0, 400.0, -400.0, 1.0]);
    //  private m_params: Float32Array = new Float32Array([0.0001, 0.000003, 1.0, 0.0]);
    //  private m_gloss: Float32Array = new Float32Array([0.8, 0.8, 0.2, 0.8]);

    createSelfUniformData(): ShaderUniformData {
        //  let oum: ShaderUniformData = new ShaderUniformData();
        //  oum.uniformNameList = ["u_colors", "u_positions", "u_params", "u_gloss"];
        //  oum.dataList = [this.m_colorArray, this.m_positions, this.m_params, this.m_gloss];
        //  return oum;
        return null;
    }
}