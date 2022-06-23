/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ShaderCodeBuffer from "../../../vox/material/ShaderCodeBuffer";
import MaterialBase from "../../../vox/material/MaterialBase";

export class NormalViewerShaderBuffer extends ShaderCodeBuffer {
    constructor() {
        super();
    }
    private m_uniqueName: string = "";
    initialize(texEnabled: boolean): void {
        this.m_uniqueName = "NormalViewerShd";
    }
    getFragShaderCode(): string {
        let fragCode: string =
            `#version 300 es
precision mediump float;
const float MATH_PI = 3.14159265;
const float MATH_2PI = 2.0 * MATH_PI;
const float MATH_3PI = 3.0 * MATH_PI;
const float MATH_1PER2PI = 0.5 * MATH_PI;
const float MATH_3PER2PI = 3.0 * MATH_PI * 0.5;

const vec3 colors[4] = vec3[] (
    vec3(1.0,1.0,1.0),
    vec3(0.0,1.0,1.0),
    vec3(0.0,0.0,1.0),
    vec3(1.0,0.0,1.0)
    );
float getRadianByXY(float dx, float dy) {
    float rad = atan(dy/dx);
    return dx >= 0.0 ? rad:(MATH_3PI+rad);
}
vec3 getColor(float xoyf) {
    
    xoyf = fract(xoyf + 1.0);
    int i = int(floor(4.0 * xoyf));
    return colors[i];
}

in vec4 v_param;
layout(location = 0) out vec4 FragColor;
void main() {
    float flag = gl_FrontFacing ? 1.0 : 0.0;
    vec2 dv = fract(gl_FragCoord.xy/vec2(5.0)) - vec2(0.5);
    vec2 f2 = sign(dv);
    // FragColor = vec4(sign(f2.x * f2.y), 1.0, 1.0, 1.0) * (1.0 - flag) + flag * vec4(normalize(v_param.xyz), 1.0);
    vec3 nv = normalize(v_param.xyz);
    vec3 color = pow(nv, vec3(1.0/2.2));

    // float xoyf = getRadianByXY(nv.x,nv.y) / MATH_2PI;
    // color = getColor(xoyf);

    FragColor = vec4(color, 1.0);
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
out vec4 v_param;
void main()
{
    vec4 viewPv = u_viewMat * u_objMat * vec4(a_vs, 1.0);
    gl_Position = u_projMat * viewPv;
    vec3 pnv = normalize(a_nvs * inverse(mat3(u_objMat)));
    v_param = vec4(pnv, 1.0);
}
`;
        return vtxCode;
    }
    getUniqueShaderName(): string {
        return this.m_uniqueName;
    }
}

class NormalViewerMaterial extends MaterialBase {
    private static s_codeBuf: NormalViewerShaderBuffer = new NormalViewerShaderBuffer();
    constructor() {
        super();
    }

    getCodeBuf(): ShaderCodeBuffer {
        
        if(NormalViewerMaterial.s_codeBuf != null) {
            return NormalViewerMaterial.s_codeBuf;
        }
        NormalViewerMaterial.s_codeBuf = new NormalViewerShaderBuffer();
        return NormalViewerMaterial.s_codeBuf;
    }
}
export { NormalViewerMaterial }