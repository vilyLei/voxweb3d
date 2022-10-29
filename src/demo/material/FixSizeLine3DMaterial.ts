/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IColorMaterial from "../../vox/material/mcase/IColorMaterial";
import Color4 from "../../vox/material/Color4";

import ShaderUniformData from "../../vox/material/ShaderUniformData";
import ShaderCodeBuffer from "../../vox/material/ShaderCodeBuffer";
import MaterialBase from "../../vox/material/MaterialBase";

class Line3DShaderBuffer extends ShaderCodeBuffer {
    constructor() {
        super();
    }
    private static s_instance: Line3DShaderBuffer = null;
    private m_uniqueName: string = "";
    dynColorEnabled: boolean = false;
    initialize(texEnabled: boolean): void {
        super.initialize(texEnabled);
        this.m_uniqueName = "FixSizeLine3DShd";
        if (this.dynColorEnabled) this.m_uniqueName += "_dynColor";
    }

    buildShader(): void {

        this.m_coder.addVertLayout("vec3", "a_vs");

        this.m_coder.addFragUniform("vec4", "u_color");
        this.m_coder.addVertUniform("vec4", "u_frustumParam");
        if (this.dynColorEnabled) {
            this.m_coder.addDefine("DYNAMIC_COLOR");
        }
        else {
            this.m_coder.addVertLayout("vec3", "a_cvs");
            this.m_coder.addVarying("vec3", "v_color");
        }

        this.m_coder.addFragOutputHighp("vec4", "FragColor0");

        this.m_coder.addFragMainCode(
            `
    #ifndef DYNAMIC_COLOR
        FragColor0 = vec4(v_color, 1.0) * u_color;
    #else
        FragColor0 = u_color;
    #endif
    FragColor0.xyz = FragColor0.xyz * 0.3 + 0.7;
`
        );
        this.m_coder.addVertMainCode(
            `
    // vec4 pv0 = u_mat * u_viewMat * u_objMat * vec4(vec3(0.0),1.0);
    // vec4 pv = u_projMat * u_viewMat * vec4(a_vs,1.0);
    // pv.xy += pv0.xy/pv0.w;
    // #ifndef DYNAMIC_COLOR
    //     v_color = a_cvs;
    // #endif
    // gl_Position = pv;

    vec4 pvv0 = u_viewMat * u_objMat * vec4(vec3(0.0),1.0);
    vec3 sv = vec3(0.02 * -pvv0.z/u_frustumParam.x);
    vec4 pv = u_projMat * u_viewMat * u_objMat * vec4(a_vs * sv,1.0);
    #ifndef DYNAMIC_COLOR
        v_color = a_cvs;
    #endif
    gl_Position = pv;
            `
        );
    }

    getUniqueShaderName(): string {
        return this.m_uniqueName;
    }

    static GetInstance(): Line3DShaderBuffer {
        let lsb = Line3DShaderBuffer;
        if (lsb.s_instance != null) {
            return lsb.s_instance;
        }
        lsb.s_instance = new Line3DShaderBuffer();
        return lsb.s_instance;
    }
}

class FixSizeLine3DMaterial extends MaterialBase implements IColorMaterial {

    private m_dynColorEnabled: boolean = false;
    private m_data: Float32Array = null;

    premultiplyAlpha: boolean = false;
    normalEnabled: boolean = false;
    shadowReceiveEnabled: boolean = false;
    /**
     * @param dynColorEnabled the default value is false
     */
    constructor(dynColorEnabled: boolean = false) {

        super();

        this.m_dynColorEnabled = dynColorEnabled;
        this.m_data = new Float32Array([1.0, 1.0, 1.0, 1.0]);

        let oum = new ShaderUniformData();
        oum.uniformNameList = ["u_color"];
        oum.dataList = [this.m_data];
        this.m_shaderUniformData = oum;
    }
    protected buildBuf(): void {
        Line3DShaderBuffer.GetInstance().dynColorEnabled = this.m_dynColorEnabled;
    }
    getCodeBuf(): ShaderCodeBuffer {
        return Line3DShaderBuffer.GetInstance();
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
        color.fromArray(this.m_data);
    }
    setAlpha(pa: number): void {
        this.m_data[3] = pa;
    }
    getAlpha(): number {
        return this.m_data[3];
    }
    setColor(color: Color4): void {
        color.toArray(this.m_data);
    }
    getColor(color: Color4): void {
        color.fromArray(this.m_data);
    }
}
export {FixSizeLine3DMaterial}