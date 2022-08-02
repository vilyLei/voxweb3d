/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ShaderCodeBuffer from "../../../vox/material/ShaderCodeBuffer";
import MaterialBase from "../../../vox/material/MaterialBase";

export class NormalUVViewerShaderBuffer extends ShaderCodeBuffer {
    constructor() {
        super();
    }
    private m_uniqueName: string = "";
    initialize(texEnabled: boolean): void {
        this.m_uniqueName = "NormalUVViewerShd";
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

const vec3 gama = vec3(1.0/2.2);
in vec4 v_param;
in vec4 v_uvParam;
layout(location = 0) out vec4 FragColor;
void main() {

    bool facing = gl_FrontFacing;
    vec2 dv = fract(gl_FragCoord.xy/vec2(5.0)) - vec2(0.5);
    vec2 f2 = sign(dv);

    vec3 nv = normalize(v_param.xyz);
    vec3 color = pow(nv, gama);

    vec3 frontColor = color.xyz;
    vec3 backColor = vec3(sign(f2.x * f2.y), 1.0, 1.0);
    vec3 dstColor = facing ? frontColor : backColor;

    FragColor = vec4(dstColor, 1.0);
    // FragColor = vec4(color, 1.0);
}
`;
        return fragCode;
    }
    getVertShaderCode(): string {
        let vtxCode: string =
            `#version 300 es
precision mediump float;
layout(location = 0) in vec3 a_vs;
layout(location = 1) in vec2 a_uvs;
layout(location = 2) in vec3 a_nvs;
uniform mat4 u_objMat;
uniform mat4 u_viewMat;
uniform mat4 u_projMat;
out vec4 v_param;
out vec4 v_uvParam;
void main()
{
    vec4 viewPv = u_viewMat * u_objMat * vec4(a_vs, 1.0);
    gl_Position = u_projMat * viewPv;
    vec3 pnv = normalize(a_nvs * inverse(mat3(u_objMat)));
    v_param = vec4(pnv, 1.0);
    v_uvParam = vec4(a_uvs.xy, 1.0, 1.0);
}
`;
        return vtxCode;
    }
    getUniqueShaderName(): string {
        return this.m_uniqueName;
    }
}

class NormalUVViewerMaterial extends MaterialBase {
    private static s_codeBuf: NormalUVViewerShaderBuffer = new NormalUVViewerShaderBuffer();
    constructor() {
        super();
    }

    getCodeBuf(): ShaderCodeBuffer {

        if(NormalUVViewerMaterial.s_codeBuf != null) {
            return NormalUVViewerMaterial.s_codeBuf;
        }
        NormalUVViewerMaterial.s_codeBuf = new NormalUVViewerShaderBuffer();
        return NormalUVViewerMaterial.s_codeBuf;
    }
}
export { NormalUVViewerMaterial }
