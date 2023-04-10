/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ShaderCodeBuffer from "../../../vox/material/ShaderCodeBuffer";
import ShaderUniformData from "../../../vox/material/ShaderUniformData";
import MaterialBase from "../../../vox/material/MaterialBase";

class ScreenPlaneShaderBuffer extends ShaderCodeBuffer {
    constructor() {
        super();
    }
    private static s_instance: ScreenPlaneShaderBuffer = null;
    private m_uniqueName: string = "";
    private m_hasTex: boolean = false;
    mapLodEnabled: boolean = false;
	pns = "";
	fragMainTailCode = "";
    initialize(texEnabled: boolean): void {
        this.m_uniqueName = "ScreenPlaneShd";
        this.m_hasTex = texEnabled;
        if (texEnabled) {
            this.m_uniqueName += "_tex";
            if(this.mapLodEnabled) this.m_uniqueName += "Lod";
        }
		this.m_uniqueName += this.pns;
    }

    buildShader(): void {
        let coder = this.m_coder;
        coder.mapLodEnabled = false;
        if (this.m_hasTex) {
            coder.mapLodEnabled = this.mapLodEnabled;
            this.m_uniform.addDiffuseMap();
        }
        coder.addFragUniform("vec4", "u_param", 3);
        coder.useVertSpaceMats(true, false, false);

        this.m_coder.addFragMainCode(
            `
void main() {
#ifdef VOX_USE_2D_MAP
    #ifdef VOX_Texture2DLod
    vec4 color4 = VOX_Texture2DLod(VOX_DIFFUSE_MAP, v_uv, u_param[2].w);
    #else
    vec4 color4 = VOX_Texture2D(VOX_DIFFUSE_MAP, v_uv);
    #endif
    color4 *= u_param[0];
    color4 += u_param[1];
    FragColor0 = color4;
#else
    FragColor0 = u_param[0] + u_param[1];
#endif
	${this.fragMainTailCode}
}
`
        );
        this.m_coder.addVertMainCode(
            `
void main() {
    gl_Position = u_objMat * vec4(a_vs,1.0);
#ifdef VOX_USE_2D_MAP
    v_uv = a_uvs.xy;
#endif
}
`
        );
    }

    getUniqueShaderName(): string {
        return this.m_uniqueName;
    }
    toString(): string {
        return "[ScreenPlaneShaderBuffer()]";
    }

    static GetInstance(): ScreenPlaneShaderBuffer {
        if (ScreenPlaneShaderBuffer.s_instance != null) {
            return ScreenPlaneShaderBuffer.s_instance;
        }
        ScreenPlaneShaderBuffer.s_instance = new ScreenPlaneShaderBuffer();
        return ScreenPlaneShaderBuffer.s_instance;
    }
}

export default class ScreenPlaneMaterial extends MaterialBase {
    mapLodEnabled = false;

    name = "";
	fragMainTailCode = "";
    constructor() {
        super();
    }

    protected buildBuf(): void {
        let buf = ScreenPlaneShaderBuffer.GetInstance();
		buf.pns = this.name;
		buf.fragMainTailCode = this.fragMainTailCode;
        buf.mapLodEnabled = this.mapLodEnabled;
    }
    getCodeBuf(): ShaderCodeBuffer {
        return  ScreenPlaneShaderBuffer.GetInstance();
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
