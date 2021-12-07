/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ShaderCodeBuffer from "../../vox/material/ShaderCodeBuffer";
import ShaderUniformData from "../../vox/material/ShaderUniformData";
import MaterialBase from "../../vox/material/MaterialBase";

export class VSTextureRenderShaderBuffer extends ShaderCodeBuffer {
    constructor() {
        super();
    }
    private static s_instance: VSTextureRenderShaderBuffer = null;
    private m_uniqueName: string = "";
    initialize(texEnabled: boolean): void {
        //console.log("VSTextureRenderShaderBuffer::initialize()...");
        this.m_uniqueName = "VSTextureMaterialShd";
    }
    getFragShaderCode(): string {
        let fragCode: string =
            `#version 300 es
precision mediump float;
uniform sampler2D u_sampler1;
uniform vec4 u_color;
in vec2 v_uvs;
in vec4 v_color;
layout(location = 0) out vec4 FragColor;
void main(){
vec4 color4 = texture(u_sampler1, v_uvs) * u_color;
color4.xy *= v_uvs.xy;
FragColor = (color4 *0.1 + 0.8 *  v_color);
}
`;
        return fragCode;
    }
    getVertShaderCode(): string {
        let vtxCode: string =
            `#version 300 es
precision highp float;
layout(location = 0) in vec3 a_vs;
layout(location = 1) in vec2 a_uvs;
uniform sampler2D u_sampler0;
uniform mat4 u_objMat;
uniform mat4 u_viewMat;
uniform mat4 u_projMat;
out vec2 v_uvs;
out vec4 v_color;
void main(){
vec4 offset4 = texture(u_sampler0, a_uvs);
gl_Position = u_projMat * u_viewMat * u_objMat * vec4(a_vs,1.0);
v_uvs = a_uvs;// + 0.5 * (0.5 - 0.5 * offset4).xy;
//v_uvs = a_uvs * 0.1 + offset4.xy;
v_color = offset4;
}
`;
        return vtxCode;
    }
    getUniqueShaderName(): string {
        //console.log("H ########################### this.m_uniqueName: "+this.m_uniqueName);
        return this.m_uniqueName;
    }
    toString(): string {
        return "[VSTextureRenderShaderBuffer()]";
    }

    static GetInstance(): VSTextureRenderShaderBuffer {
        if (VSTextureRenderShaderBuffer.s_instance != null) {
            return VSTextureRenderShaderBuffer.s_instance;
        }
        VSTextureRenderShaderBuffer.s_instance = new VSTextureRenderShaderBuffer();
        return VSTextureRenderShaderBuffer.s_instance;
    }
}
class VSTextureMaterial extends MaterialBase {
    constructor() {
        super();
    }
    getCodeBuf(): ShaderCodeBuffer {
        return VSTextureRenderShaderBuffer.GetInstance();
    }
    private m_colorArray: Float32Array = new Float32Array([1.0, 1.0, 1.0, 1.0]);
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
        oum.uniformNameList = ["u_color"];
        oum.dataList = [this.m_colorArray];
        return oum;
    }
}
export {VSTextureMaterial}