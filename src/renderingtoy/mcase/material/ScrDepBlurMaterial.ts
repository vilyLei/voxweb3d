/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ShaderCodeBuffer from "../../../vox/material/ShaderCodeBuffer";
import ShaderUniformData from "../../../vox/material/ShaderUniformData";
import MaterialBase from "../../../vox/material/MaterialBase";

class ScrDepBlurShaderBuffer extends ShaderCodeBuffer {
    constructor() {
        super();
    }
    private static s_instance: ScrDepBlurShaderBuffer = null;
    private m_uniqueName: string = "";
    initialize(texEnabled: boolean): void {
        //console.log("ScrDepBlurShaderBuffer::initialize()...");
        this.m_uniqueName = "ScrDepBlurShd";
    }
    getFragShaderCode(): string {
        let fragCode: string =
            `precision mediump float;
uniform sampler2D u_sampler0;
uniform sampler2D u_sampler1;
uniform sampler2D u_sampler2;
uniform vec4 u_color;
varying vec2 v_texUV;
void main()
{
vec4 blurColor4 = texture2D(u_sampler0, v_texUV);
vec4 depthColor4 = texture2D(u_sampler1, v_texUV);
vec4 baseColor4 = texture2D(u_sampler2, v_texUV);
float k = (depthColor4.w - 1000.0) / 1000.0;
if(k > 1.0 || depthColor4.r < 0.5) k = 1.0;
if(k < 0.0) k = 0.0;
gl_FragColor = (vec4(baseColor4.xyz * (1.0 - k) + k * blurColor4.xyz, 1.0) * u_color);
}
`;
        return fragCode;
    }
    getVertShaderCode(): string {
        let vtxCode: string =
            `precision mediump float;
attribute vec3 a_vs;
attribute vec2 a_uvs;
uniform mat4 u_objMat;
varying vec2 v_texUV;
void main()
{
gl_Position = u_objMat * vec4(a_vs,1.0);
v_texUV = a_uvs.xy;
}
`;
        return vtxCode;
    }
    getUniqueShaderName(): string {
        //console.log("H ########################### this.m_uniqueName: "+this.m_uniqueName);
        return this.m_uniqueName;
    }
    toString(): string {
        return "[ScrDepBlurShaderBuffer()]";
    }

    static GetInstance(): ScrDepBlurShaderBuffer {
        if (ScrDepBlurShaderBuffer.s_instance != null) {
            return ScrDepBlurShaderBuffer.s_instance;
        }
        ScrDepBlurShaderBuffer.s_instance = new ScrDepBlurShaderBuffer();
        return ScrDepBlurShaderBuffer.s_instance;
    }
}

class ScrDepBlurMaterial extends MaterialBase {
    constructor() {
        super();
    }

    getCodeBuf(): ShaderCodeBuffer {
        return ScrDepBlurShaderBuffer.GetInstance();
    }
    colorArray: Float32Array = new Float32Array([1.0, 1.0, 1.0, 1.0]);

    createSelfUniformData(): ShaderUniformData {
        let oum: ShaderUniformData = new ShaderUniformData();
        oum.uniformNameList = ["u_color"];
        oum.dataList = [this.colorArray];
        return oum;
    }
}
export { ScrDepBlurMaterial }