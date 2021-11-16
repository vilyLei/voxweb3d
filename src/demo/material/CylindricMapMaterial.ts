/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ShaderCodeBuffer from "../../vox/material/ShaderCodeBuffer";
import MaterialBase from "../../vox/material/MaterialBase";
import ShaderUniformData from "../../vox/material/ShaderUniformData";

class CylindricMapShaderBuffer extends ShaderCodeBuffer {
    constructor() {
        super();
    }
    private static s_instance: CylindricMapShaderBuffer = new CylindricMapShaderBuffer();
    private m_uniqueName: string = "";
    initialize(texEnabled: boolean): void {
        //console.log("CylindricMapShaderBuffer::initialize()...");
        this.m_uniqueName = "CylindricMapShd";
    }

    getFragShaderCode(): string {
        let fragCode: string =
`#version 300 es
precision mediump float;
const float PI = 3.14159265359;

uniform vec4 u_color;
uniform vec4 u_param;

uniform sampler2D u_sampler0;

in vec3 v_nv;
in vec3 v_param;
in vec3 v_wVtxPos;
in vec3 v_wViewPos;
layout(location = 0) out vec4 FragColor0;
vec2 calcUV() {
    vec3 nor = u_param.xyz * normalize(v_nv);
	vec3 viewDir = normalize(v_wViewPos - v_wVtxPos);
	vec3 refl = reflect(viewDir,nor);
	float u = ((atan(refl.x,refl.z) / PI + 1.0) * 0.5);
	float v = acos(refl.y) / PI;
	return vec2(u * u_param.w + (1.0 - u_param.w) * (1.0 - u), v);
}
void main() {

    vec2 uv = calcUV();
    vec4 color4 = texture(u_sampler0, uv);
    FragColor0 = vec4(color4.rgb * u_color.xyz, 1.0);
}
`;
        return fragCode;
    }
    getVertShaderCode(): string {
        let vtxCode: string =
`#version 300 es
precision mediump float;
layout(location = 0) in vec3 a_vs;
layout(location = 1) in vec3 a_nvs;
uniform mat4 u_objMat;
uniform mat4 u_viewMat;
uniform mat4 u_projMat;
out vec3 v_nv;
out vec3 v_param;
out vec3 v_wVtxPos;
out vec3 v_wViewPos;
void main(){
    vec4 viewWorldPos = inverse(u_viewMat) * vec4(0.0,0.0,0.0,1.0);
    vec4 wpos = u_objMat * vec4(a_vs, 1.0);
    vec4 viewPos = u_viewMat * wpos;
    gl_Position = u_projMat * viewPos;
    v_nv = a_nvs;
    v_param = vec3(length(normalize(wpos.xyz - viewWorldPos.xyz)));
    v_wVtxPos = wpos.xyz;
    v_wViewPos = viewWorldPos.xyz;
}
`;
        return vtxCode;
    }
    getUniqueShaderName(): string {
        //console.log("H ########################### this.m_uniqueName: "+this.m_uniqueName);
        return this.m_uniqueName;
    }
    toString(): string {
        return "[CylindricMapShaderBuffer()]";
    }

    static GetInstance(): CylindricMapShaderBuffer {
        return CylindricMapShaderBuffer.s_instance;
    }
}

export default class CylindricMapMaterial extends MaterialBase {
    constructor() {
        super();
    }

    getCodeBuf(): ShaderCodeBuffer {
        return CylindricMapShaderBuffer.GetInstance();
    }
    private m_colorArray: Float32Array = new Float32Array([1.0, 1.0, 1.0, 1.0]);
    private m_param: Float32Array = new Float32Array([1.0, 1.0, 1.0, 1.0]);
    showFront(): void {
        this.m_param[0] = 1.0;
        this.m_param[1] = 1.0;
        this.m_param[2] = 1.0;
        this.m_param[3] = 0.0;
    }
    showBack(): void {
        this.m_param[0] = 1.0;
        this.m_param[1] = -1.0;
        this.m_param[2] = 1.0;
        this.m_param[3] = 1.0;
    }
    setRGB3f(pr: number, pg: number, pb: number): void {
        this.m_colorArray[0] = pr;
        this.m_colorArray[1] = pg;
        this.m_colorArray[2] = pb;
    }
    setRGBA4f(pr: number, pg: number, pb: number, pa: number): void {
        this.m_colorArray[0] = pr;
        this.m_colorArray[1] = pg;
        this.m_colorArray[2] = pb;
        this.m_colorArray[3] = pa;
    }
    createSelfUniformData(): ShaderUniformData {
        let oum: ShaderUniformData = new ShaderUniformData();
        oum.uniformNameList = ["u_color","u_param"];
        oum.dataList = [this.m_colorArray, this.m_param];
        return oum;
    }

}