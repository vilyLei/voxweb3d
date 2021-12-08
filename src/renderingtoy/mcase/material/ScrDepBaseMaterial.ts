/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ShaderCodeBuffer from "../../../vox/material/ShaderCodeBuffer";
import ShaderUniformData from "../../../vox/material/ShaderUniformData";
import MaterialBase from "../../../vox/material/MaterialBase";

export class ScrDepBaseShaderBuffer extends ShaderCodeBuffer {
    constructor() {
        super();
    }
    private static s_instance: ScrDepBaseShaderBuffer = null;
    private m_uniqueName: string = "";
    initialize(texEnabled: boolean): void {
        //console.log("ScrDepBaseShaderBuffer::initialize()...");
        this.m_uniqueName = "ScrDepBaseShd";
    }
    getFragShaderCode(): string {
        let fragCode: string =
            `#version 300 es
precision mediump float;
in vec4 v_color;
layout(location = 0) out vec4 FragColor;
void main()
{
FragColor = vec4(vec3(v_color.w * 0.01,0.0,1.0), v_color.w);
}
`;
        return fragCode;
    }
    getVertShaderCode(): string {
        let vtxCode: string =
            `#version 300 es
precision mediump float;
layout(location = 0) in vec3 a_vs;
uniform mat4 u_objMat;
uniform mat4 u_viewMat;
uniform mat4 u_projMat;
out vec4 v_color;
void main()
{
vec4 viewPv = u_viewMat * u_objMat * vec4(a_vs, 1.0);
gl_Position = u_projMat * viewPv;
v_color = vec4(abs(viewPv.xyz),length(viewPv.xyz));
}
`;
        return vtxCode;
    }
    getUniqueShaderName(): string {
        //console.log("H ########################### this.m_uniqueName: "+this.m_uniqueName);
        return this.m_uniqueName;
    }
    toString(): string {
        return "[ScrDepBaseShaderBuffer()]";
    }

    static GetInstance(): ScrDepBaseShaderBuffer {
        if (ScrDepBaseShaderBuffer.s_instance != null) {
            return ScrDepBaseShaderBuffer.s_instance;
        }
        ScrDepBaseShaderBuffer.s_instance = new ScrDepBaseShaderBuffer();
        return ScrDepBaseShaderBuffer.s_instance;
    }
}

class ScrDepBaseMaterial extends MaterialBase {
    constructor() {
        super();
    }
    getCodeBuf(): ShaderCodeBuffer {
        return ScrDepBaseShaderBuffer.GetInstance();
    }
    colorArray: Float32Array = new Float32Array([1.0, 1.0, 1.0, 1.0]);
    createSelfUniformData(): ShaderUniformData {
        let oum: ShaderUniformData = new ShaderUniformData();
        oum.uniformNameList = ["u_color"];
        oum.dataList = [this.colorArray];
        return oum;
    }
}
export { ScrDepBaseMaterial }