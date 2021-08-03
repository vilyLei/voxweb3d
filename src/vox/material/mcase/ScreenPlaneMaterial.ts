/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ShaderCodeBuffer from "../../../vox/material/ShaderCodeBuffer";
import ShaderUniformData from "../../../vox/material/ShaderUniformData";
import ShaderGlobalUniform from "../../../vox/material/ShaderGlobalUniform";
import MaterialBase from "../../../vox/material/MaterialBase";
import ShaderCodeBuilder2 from "../../../vox/material/code/ShaderCodeBuilder2";

class ScreenPlaneShaderBuffer extends ShaderCodeBuffer {
    constructor() {
        super();
    }
    private static ___s_instance: ScreenPlaneShaderBuffer = null;
    private m_codeBuilder: ShaderCodeBuilder2 = new ShaderCodeBuilder2();
    private m_uniqueName: string = "";
    private m_hasTex: boolean = false;
    mapLodEnabled: boolean = false;
    initialize(texEnabled: boolean): void {
        this.m_uniqueName = "ScreenPlaneShd";
        this.m_hasTex = texEnabled;
        if (texEnabled) {
            this.m_uniqueName += "_tex";
            if(this.mapLodEnabled) this.m_uniqueName += "Lod";
        }
    }

    private buildThisCode(): void {
        let coder: ShaderCodeBuilder2 = this.m_codeBuilder;
        coder.reset();
        coder.addVertLayout("vec3", "a_vs");
        if (this.m_hasTex) {
            coder.mapLodEnabled = this.mapLodEnabled;
            coder.addVertLayout("vec2", "a_uvs");
            coder.addTextureSample2D();
            coder.addVarying("vec2", "v_uv");
        }
        else {
            coder.mapLodEnabled = false;
        }
        coder.addFragOutput("vec4", "FragColor0");
        coder.addFragUniform("vec4", "u_param", 3);

        coder.useVertSpaceMats(true, false, false);
        coder.addFragFunction("");
    }
    getFragShaderCode(): string {
        this.buildThisCode();
        if (this.m_hasTex) {
            this.m_codeBuilder.addFragMainCode(
                `
void main() {
    #ifdef VOX_Texture2DLod
    vec4 color4 = VOX_Texture2DLod(u_sampler0, v_uv, u_param[2].w);
    #else
    vec4 color4 = VOX_Texture2D(u_sampler0, v_uv);
    #endif
    color4 *= u_param[0];
    color4 += u_param[1];
    FragColor0 = color4;
}
`
            );
        }
        else {

            this.m_codeBuilder.addFragMainCode(
                `
void main() {
    FragColor0 = u_param[0] + u_param[1];
}
`
            );
        }
        return this.m_codeBuilder.buildFragCode();
    }
    getVtxShaderCode(): string {
        if (this.m_hasTex) {
            this.m_codeBuilder.addVertMainCode(
                `
void main() {
    gl_Position = u_objMat * vec4(a_vs,1.0);
    v_uv = a_uvs.xy;
}
`
            );
        }
        else {

            this.m_codeBuilder.addVertMainCode(
                `
void main() {
    gl_Position = u_objMat * vec4(a_vs,1.0);
}
`
            );
        }
        return this.m_codeBuilder.buildVertCode();
    }
    getUniqueShaderName() {
        //console.log("H ########################### this.m_uniqueName: "+this.m_uniqueName);
        return this.m_uniqueName;
    }
    toString(): string {
        return "[ScreenPlaneShaderBuffer()]";
    }

    static GetInstance(): ScreenPlaneShaderBuffer {
        if (ScreenPlaneShaderBuffer.___s_instance != null) {
            return ScreenPlaneShaderBuffer.___s_instance;
        }
        ScreenPlaneShaderBuffer.___s_instance = new ScreenPlaneShaderBuffer();
        return ScreenPlaneShaderBuffer.___s_instance;
    }
}

export default class ScreenPlaneMaterial extends MaterialBase {
    mapLodEnabled: boolean = false;
    constructor() {
        super();
    }

    getCodeBuf(): ShaderCodeBuffer {
        let buf: ScreenPlaneShaderBuffer = ScreenPlaneShaderBuffer.GetInstance();
        buf.mapLodEnabled = this.mapLodEnabled;
        return buf;
    }
    private m_param: Float32Array = new Float32Array(
        [
            1.0, 1.0, 1.0, 1.0
            , 0.0, 0.0, 0.0, 0.0
            , 0.0, 0.0, 0.0, 0.0
        ]);
    setRGB3f(pr: number, pg: number, pb: number): void {
        this.m_param[0] = pr;
        this.m_param[1] = pg;
        this.m_param[2] = pb;
    }
    setRGBA4f(pr: number, pg: number, pb: number, pa: number): void {
        this.m_param[0] = pr;
        this.m_param[1] = pg;
        this.m_param[2] = pb;
        this.m_param[3] = pa;
    }
    setOffsetRGB3f(pr: number, pg: number, pb: number): void {
        this.m_param[0] = pr;
        this.m_param[1] = pg;
        this.m_param[2] = pb;
    }
    setOffsetRGBA4f(pr: number, pg: number, pb: number, pa: number): void {
        this.m_param[0] = pr;
        this.m_param[1] = pg;
        this.m_param[2] = pb;
        this.m_param[3] = pa;
    }
    setTextureLodLevel(lodLv: number): void {
        this.m_param[11] = lodLv;
    }
    createSelfUniformData(): ShaderUniformData {
        let oum: ShaderUniformData = new ShaderUniformData();
        oum.uniformNameList = ["u_param"];
        oum.dataList = [this.m_param];
        return oum;
    }
}