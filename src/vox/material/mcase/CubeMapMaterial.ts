/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ShaderCodeBuffer from "../../../vox/material/ShaderCodeBuffer";
import ShaderUniformData from "../../../vox/material/ShaderUniformData";
import MaterialBase from "../../../vox/material/MaterialBase";
import ShaderCodeBuilder2 from "../../../vox/material/code/ShaderCodeBuilder2";

class CubeMapShaderBuffer extends ShaderCodeBuffer {
    constructor() {
        super();
    }
    private static ___s_instance: CubeMapShaderBuffer = null;
    private m_codeBuilder: ShaderCodeBuilder2 = new ShaderCodeBuilder2();
    private m_uniqueName: string = "";
    mapLodEnabled: boolean = false;
    gammaCorrectionEanbled: boolean = false;
    initialize(texEnabled: boolean): void {
        //console.log("CubeMapShaderBuffer::initialize()...");
        this.m_uniqueName = "CubeMapShd";
        if (this.mapLodEnabled) this.m_uniqueName += "Lod";
        if (this.gammaCorrectionEanbled) this.m_uniqueName += "Gamma";
    }

    private buildThisCode(): void {
        let coder: ShaderCodeBuilder2 = this.m_codeBuilder;
        coder.mapLodEnabled = this.mapLodEnabled;
        coder.reset();
        coder.addTextureSampleCube();
        coder.addVertLayout("vec3", "a_vs");
        coder.addVertLayout("vec3", "a_nvs");

        coder.addVarying("vec3", "v_nv");

        coder.addFragOutput("vec4", "FragColor0");
        coder.addFragUniform("vec4", "u_param");
        if (this.gammaCorrectionEanbled) {
            coder.addDefine("VOX_GAMMA", "2.2");
            coder.addDefine("VOX_GAMMA_CORRECTION", "1");
        }

        coder.useVertSpaceMats(true, true, true);
        coder.addFragFunction("");
    }
    getFragShaderCode(): string {
        this.buildThisCode();
        this.m_codeBuilder.addFragMainCode(
            `
#ifdef VOX_GAMMA
vec3 gammaToLinear(vec3 color)
{
    #ifdef VOX_GAMMA_CORRECTION
	    return pow(color, vec3(VOX_GAMMA));
    #else
        return color;
    #endif
}
vec3 linearToGamma(vec3 color) 
{ 
    #ifdef VOX_GAMMA_CORRECTION
	    return pow(color, vec3(1.0 / VOX_GAMMA)); 
    #else
        return color;
    #endif
}
vec4 gammaToLinear(vec4 color) {
    #ifdef VOX_GAMMA_CORRECTION
        return vec4(pow(color.rgb, vec3(VOX_GAMMA)), color.a);
    #else
        return color;
    #endif
}

vec4 linearToGamma(vec4 color) {
    #ifdef VOX_GAMMA_CORRECTION
        return vec4(pow(color.rgb, vec3(1.0 / VOX_GAMMA)), color.a);
    #else
        return color;
    #endif
}
#endif
void main()
{
    #ifdef VOX_TextureCubeLod
    vec3 color3 = VOX_TextureCubeLod(u_sampler0, v_nv, u_param.w).xyz * u_param.xyz;
    #else
    vec3 color3 = VOX_TextureCube(u_sampler0, v_nv).xyz * u_param.xyz;
    #endif
    //vec3 color3 = gammaToLinear(texture(u_sampler0, v_nvs).xyz);
    //vec3 color3 = linearToGamma(texture(u_sampler0, v_nvs).xyz);
    //vec3 color3 = textureLod(u_sampler0, v_nvs, 5.0).xyz;
    FragColor0 = vec4(color3, 1.0);
}
`
        );
        return this.m_codeBuilder.buildFragCode();
    }
    getVtxShaderCode(): string {

        this.m_codeBuilder.addVertMainCode(
            `
void main()
{
    vec4 wpos = u_objMat * vec4(a_vs,1.0);
    gl_Position = u_projMat * u_viewMat * wpos;
    v_nv = a_nvs;
}
`
        );
        return this.m_codeBuilder.buildVertCode();
    }
    getUniqueShaderName() {
        //console.log("H ########################### this.m_uniqueName: "+this.m_uniqueName);
        return this.m_uniqueName;
    }
    toString(): string {
        return "[CubeMapShaderBuffer()]";
    }

    static GetInstance(): CubeMapShaderBuffer {
        if (CubeMapShaderBuffer.___s_instance != null) {
            return CubeMapShaderBuffer.___s_instance;
        }
        CubeMapShaderBuffer.___s_instance = new CubeMapShaderBuffer();
        return CubeMapShaderBuffer.___s_instance;
    }
}

export default class CubeMapMaterial extends MaterialBase {

    private u_param: Float32Array = new Float32Array([1.0, 1.0, 1.0, 0.0]);

    private m_mapLodEnabled: boolean = false;
    private m_gammaCorrectionEanbled: boolean = false;
    constructor(mapLodEnabled: boolean = false, gammaCorrectionEanbled: boolean = false) {
        super();
        this.m_mapLodEnabled = mapLodEnabled;
        this.m_gammaCorrectionEanbled = gammaCorrectionEanbled;
    }

    getCodeBuf(): ShaderCodeBuffer {
        let buf: CubeMapShaderBuffer = CubeMapShaderBuffer.GetInstance();
        buf.mapLodEnabled = this.m_mapLodEnabled;
        buf.gammaCorrectionEanbled = this.m_gammaCorrectionEanbled;
        return buf;
    }

    setTextureLodLevel(lodLv: number): void {
        this.u_param[3] = lodLv;
    }
    createSelfUniformData(): ShaderUniformData {
        let oum: ShaderUniformData = new ShaderUniformData();
        oum.uniformNameList = ["u_param"];
        oum.dataList = [this.u_param];
        return oum;
    }
}