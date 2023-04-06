/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ShaderCodeBuffer from "../../vox/material/ShaderCodeBuffer";
import ShaderUniformData from "../../vox/material/ShaderUniformData";
import MaterialBase from "../../vox/material/MaterialBase";

class RemoveBlackBGShaderBuffer extends ShaderCodeBuffer {
    constructor() {
        super();
    }
    private static s_instance: RemoveBlackBGShaderBuffer = null;
    private m_uniqueName: string = "";
    private m_hasTex: boolean = false;
    mapLodEnabled: boolean = false;
    initialize(texEnabled: boolean): void {
        this.m_uniqueName = "RemoveBlackBGShd";
        this.m_hasTex = texEnabled;
        if (texEnabled) {
            this.m_uniqueName += "_tex";
            if(this.mapLodEnabled) this.m_uniqueName += "Lod";
        }
    }

    buildShader(): void {
        let coder = this.m_coder;
        coder.mapLodEnabled = false;
        if (this.m_hasTex) {
            coder.mapLodEnabled = this.mapLodEnabled;
            this.m_uniform.addDiffuseMap();
        }
        coder.addFragUniform("vec4", "u_param");
        coder.useVertSpaceMats(true, false, false);

        this.m_coder.addFragMainCode(
            `
void main() {
#ifdef VOX_USE_2D_MAP
	vec4 color4 = VOX_Texture2D(VOX_DIFFUSE_MAP, v_uv);
    vec4 c0 = vec4(color4.xyz, max(length(color4.xyz) * u_param.x - u_param.z, 0.0)) * u_param.y;
    FragColor0 = c0 * u_param.wwww  + vec4(1.0 - u_param.w) * color4;
#else
    FragColor0 = u_param;
#endif
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
    static GetInstance(): RemoveBlackBGShaderBuffer {
        if (RemoveBlackBGShaderBuffer.s_instance != null) {
            return RemoveBlackBGShaderBuffer.s_instance;
        }
        RemoveBlackBGShaderBuffer.s_instance = new RemoveBlackBGShaderBuffer();
        return RemoveBlackBGShaderBuffer.s_instance;
    }
}

export default class RemoveBlackBGMaterial extends MaterialBase {
    mapLodEnabled: boolean = false;
    constructor() {
        super();
    }

    protected buildBuf(): void {
        let buf = RemoveBlackBGShaderBuffer.GetInstance();
        buf.mapLodEnabled = this.mapLodEnabled;
    }
    getCodeBuf(): ShaderCodeBuffer {
        return  RemoveBlackBGShaderBuffer.GetInstance();
    }
    private m_param: Float32Array = new Float32Array(
        [
            1.0, 1.0, 0.02, 1.0
        ]);
    setParam0(p: number): void {
        this.m_param[0] = p;
    }
	setParam1(p: number): void {
        this.m_param[1] = p;
    }
	setParam2(p: number): void {
        this.m_param[2] = p;
    }
	setParam3(p: number): void {
        this.m_param[3] = p;
    }
	paramCopyFrom(dst: RemoveBlackBGMaterial): void {
		this.m_param.set(dst.m_param);
	}
    createSelfUniformData(): ShaderUniformData {
        let oum: ShaderUniformData = new ShaderUniformData();
        oum.uniformNameList = ["u_param"];
        oum.dataList = [this.m_param];
        return oum;
    }
}
