/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ShaderCodeBuffer from "../../../vox/material/ShaderCodeBuffer";
import ShaderUniformData from "../../../vox/material/ShaderUniformData";
import MaterialBase from "../../../vox/material/MaterialBase";
import Color4 from "../../../vox/material/Color4";

class ChangeColorShaderBuffer extends ShaderCodeBuffer {
    constructor() {
        super();
    }
    private static s_instance: ChangeColorShaderBuffer = new ChangeColorShaderBuffer();
    private m_uniqueName: string = "";

    initialize(texEnabled: boolean): void {
        super.initialize(texEnabled);
        this.m_uniqueName = "ChangeColorShd";
        this.adaptationShaderVersion = false;
    }
    private buildThisCode(): void {

        let coder = this.m_coder;
        coder.reset();

        coder.addVertLayout("vec3", "a_vs");
        coder.addVertLayout("vec2", "a_uvs");

        coder.addVarying("vec2", "v_uv");

        coder.addFragOutput("vec4", "FragColor0");
        coder.addFragUniform("vec4", "u_params", 3);
        coder.addTextureSample2D();
        coder.addTextureSample2D();

        coder.useVertSpaceMats(true, true, true);

    }
    getFragShaderCode(): string {

        this.buildThisCode();

        this.m_coder.addFragMainCode(
`
void main() {
    vec2 puv = u_params[1].xy + v_uv.xy;
    vec4 color = VOX_Texture2D(u_sampler0, v_uv.xy);
    float f = dot(VOX_Texture2D(u_sampler1, puv).xyz,u_params[2].xyz);

    f = min(f * u_params[0].w, 1.0);
    
    vec3 dstColor = color.xyz * u_params[0].xyz;
    color.xyz = mix(color.xyz, dstColor, f);
    FragColor0 = color;
}
`
        );

        return this.m_coder.buildFragCode();
    }
    getVertShaderCode(): string {

        this.m_coder.addVertMainCode(
`
void main() {

    gl_Position = u_projMat * u_viewMat * u_objMat * vec4(a_vs.xyz,1.0);
    v_uv = a_uvs.xy;
}
`
        );
        return this.m_coder.buildVertCode();

    }
    getUniqueShaderName(): string {
        return this.m_uniqueName;
    }
    toString(): string {
        return "[ChangeColorShaderBuffer()]";
    }
    static GetInstance(): ChangeColorShaderBuffer {
        return ChangeColorShaderBuffer.s_instance;
    }
}

export default class ChangeColorMaterial extends MaterialBase {

    private m_colorArray: Float32Array = new Float32Array([
        1.0, 1.0, 1.0, 0.0, // r,g,b, time
        0.0, 0.0, 0.0, 0.0, // u offset, v offsset
        1.0, 0.0, 0.0, 0.0  // u offset, v offsset
    ]);
    constructor() {
        super();
    }

    getCodeBuf(): ShaderCodeBuffer {
        let buf: ChangeColorShaderBuffer = ChangeColorShaderBuffer.GetInstance();
        return buf;
    }
    setRGB3f(pr: number, pg: number, pb: number): void {
        this.m_colorArray[0] = pr;
        this.m_colorArray[1] = pg;
        this.m_colorArray[2] = pb;
    }
    setUVOffset(offsetU: number, offsetV: number): void {
        this.m_colorArray[4] = offsetU;
        this.m_colorArray[5] = offsetV;
    }
    getRGB3f(color: Color4): void {
        let ds: Float32Array = this.m_colorArray;
        color.setRGB3f(ds[0], ds[1], ds[2]);
    }
    setFactorXYZ(fx: number, fy: number, fz: number): void {
        this.m_colorArray[8] = fx;
        this.m_colorArray[9] = fy;
        this.m_colorArray[10] = fz;
    }
    setTime(pa: number): void {
        this.m_colorArray[3] = pa;
    }
    createSelfUniformData(): ShaderUniformData {
        let oum: ShaderUniformData = new ShaderUniformData();
        oum.uniformNameList = ["u_params"];
        oum.dataList = [this.m_colorArray];
        return oum;
    }
}