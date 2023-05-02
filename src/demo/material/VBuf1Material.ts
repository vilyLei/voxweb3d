/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ShaderUniformData from "../../vox/material/ShaderUniformData";
import MaterialBase from "../../vox/material/MaterialBase";
import ShaderCodeBuffer from "../../vox/material/ShaderCodeBuffer";
import Color4 from "../../vox/material/Color4";

class VBuf1ShaderCodeBuffer extends ShaderCodeBuffer {

    private m_uniqueName: string = "";
    constructor() {
        super();
    }
    initialize(texEnabled: boolean): void {
        super.initialize(texEnabled);
        this.m_uniqueName = "VOX_VBuf1Shd";
        this.adaptationShaderVersion = false;
    }

    buildShader(): void {

        let coder = this.m_coder;

        // coder.addVertLayout("vec3", "a_vs");

        coder.addFragUniform("vec4", "u_color");

        coder.useVertSpaceMats(true, true, true);

        coder.addFragOutput("vec4", "FragColor0");

        coder.addFragMainCode(
            `
    FragColor0 = vec4(1.0);
    FragColor0 *= u_color;
`
        );

        coder.addVertMainCode(
            `
    localPosition = vec4(a_vs.xyz,1.0);
    worldPosition = u_objMat * localPosition;
    oWorldPosition = worldPosition;
    viewPosition = u_viewMat * worldPosition;
    gl_Position = u_projMat * viewPosition;
`
        );

    }
    getUniqueShaderName(): string {
        return this.m_uniqueName;
    }

}
export default class VBuf1Material extends MaterialBase {

    private static s_shdCodeBuffer: VBuf1ShaderCodeBuffer = null;
    private m_data = new Float32Array([1.0, 1.0, 1.0, 1.0]);
    constructor() {
        super();
        if (VBuf1Material.s_shdCodeBuffer == null) {
            VBuf1Material.s_shdCodeBuffer = new VBuf1ShaderCodeBuffer();
        }
    }
    protected buildBuf(): void {
        
        let buf: VBuf1ShaderCodeBuffer = VBuf1Material.s_shdCodeBuffer;
    }
    /**
     * get a shader code buf instance, for sub class override
     * @returns a ShaderCodeBuffer class instance
     */
    getCodeBuf(): ShaderCodeBuffer {
        return VBuf1Material.s_shdCodeBuffer;
    }
    setRGB3f(pr: number, pg: number, pb: number): void {
        this.m_data[0] = pr;
        this.m_data[1] = pg;
        this.m_data[2] = pb;
    }
    getRGB3f(color: Color4): void {
        let ds = this.m_data;
        color.setRGB3f(ds[0], ds[1], ds[2]);
    }
    setRGBA4f(pr: number, pg: number, pb: number, pa: number): void {
        this.m_data[0] = pr;
        this.m_data[1] = pg;
        this.m_data[2] = pb;
        this.m_data[3] = pa;
    }
    getRGBA4f(color: Color4): void {
        color.fromArray4(this.m_data);
    }
    setAlpha(pa: number): void {
        this.m_data[3] = pa;
    }
    getAlpha(): number {
        return this.m_data[3];
    }
    setColor(color: Color4): void {
        color.toArray4(this.m_data);
    }
    getColor(color: Color4): void {
        color.fromArray4(this.m_data);
    }
    createSelfUniformData(): ShaderUniformData {
        let oum = new ShaderUniformData();
        oum.uniformNameList = ["u_color"];
        oum.dataList = [this.m_data];
        return oum;
    }

}