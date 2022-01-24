/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ShaderUniformData from "../../../vox/material/ShaderUniformData";
import MaterialBase from "../../../vox/material/MaterialBase";
import ShaderCodeBuffer from "../ShaderCodeBuffer";
import Color4 from "../Color4";

class Default3DShaderCodeBuffer extends ShaderCodeBuffer {

    private m_uniqueName: string = "";
    normalEnabled: boolean = false;
    constructor() {
        super();
    }
    initialize(texEnabled: boolean): void {
        super.initialize(texEnabled);
        this.m_uniqueName = "VOX_Default3DShd";
        if (this.m_texEnabled) this.m_uniqueName += "_tex";
        if (this.vertColorEnabled) this.m_uniqueName += "_vtxColor";
        if (this.premultiplyAlpha) this.m_uniqueName += "_preMulAlpha";
        this.adaptationShaderVersion = false;
    }
    
    buildShader(): void {
        
        let coder = this.m_coder;
        coder.addVertLayout("vec3", "a_vs");
        coder.addFragUniform("vec4", "u_color");
        coder.useVertSpaceMats(true, true, true);

        if (this.m_texEnabled) {
            this.m_uniform.addDiffuseMap();
            coder.addVertLayout("vec2", "a_uvs");
            coder.addVarying("vec2", "v_uv");
        }
        
        if(this.normalEnabled) {
            coder.addVertLayout("vec3", "a_nvs");
            coder.addVarying("vec3", "v_nv");
        }
        if (this.vertColorEnabled) {
            coder.addVertLayout("vec3", "a_cvs");
            coder.addVarying("vec3", "v_cv");
        }

        coder.addFragOutput("vec4", "FragColor0");

        coder.addFragMainCode(
            `
    FragColor0 = vec4(1.0);
    #ifdef VOX_USE_2D_MAP
        //  FragColor0 *= VOX_Texture2D(VOX_DIFFUSE_MAP, vec2(v_uv[0],v_uv[1]));
        FragColor0 *= VOX_Texture2D(VOX_DIFFUSE_MAP, v_uv.xy);
    #endif
    #ifdef VOX_USE_VTX_COLOR
        FragColor0.xyz *= v_cv.xyz;
    #endif
    #ifdef VOX_PREMULTIPLY_ALPHA
        FragColor0.rgb *= u_color.xyz;
        FragColor0.a *= u_color.w;
        FragColor0.rgb *= u_color.aaa;
    #else
        FragColor0 *= u_color;
    #endif
    #ifdef VOX_USE_NORMAL
        //FragColor0.xyz *= abs(v_nv.xyz);
    #endif
`
        );
        
        coder.addVertMainCode(
            `
    localPosition = vec4(a_vs.xyz,1.0);
    worldPosition = u_objMat * localPosition;
    oWorldPosition = worldPosition;
    viewPosition = u_viewMat * worldPosition;
    gl_Position = u_projMat * viewPosition;

    #ifdef VOX_USE_2D_MAP
        v_uv = a_uvs.xy;
    #endif
    #ifdef VOX_USE_NORMAL
        v_nv = a_nvs.xyz;
    #endif
    #ifdef VOX_USE_VTX_COLOR
        v_cv = a_cvs.xyz;
    #endif
`
        );

    }
    getUniqueShaderName(): string {
        return this.m_uniqueName;
    }

}
export default class Default3DMaterial extends MaterialBase {

    private static s_shdCodeBuffer: Default3DShaderCodeBuffer = null;
    private m_colorData: Float32Array = new Float32Array([1.0, 1.0, 1.0, 1.0]);
    vertColorEnabled: boolean = false;
    premultiplyAlpha: boolean = false;
    normalEnabled: boolean = false;
    shadowReceiveEnabled: boolean = false;
    constructor() {
        super();
        if(Default3DMaterial.s_shdCodeBuffer == null) {
            Default3DMaterial.s_shdCodeBuffer = new Default3DShaderCodeBuffer();
        }
    }
    protected buildBuf(): void {
        let buf: Default3DShaderCodeBuffer = Default3DMaterial.s_shdCodeBuffer;
        
        buf.getShaderCodeBuilder().normalEnabled = this.normalEnabled;
        buf.vertColorEnabled = this.vertColorEnabled;
        buf.premultiplyAlpha = this.premultiplyAlpha;
        buf.normalEnabled = this.normalEnabled;
        buf.shadowReceiveEnabled = this.shadowReceiveEnabled;
    }
    /**
     * get a shader code buf instance, for sub class override
     * @returns a ShaderCodeBuffer class instance
     */
    getCodeBuf(): ShaderCodeBuffer {
        return Default3DMaterial.s_shdCodeBuffer;
    }
    setRGB3f(pr: number, pg: number, pb: number): void {
        this.m_colorData[0] = pr;
        this.m_colorData[1] = pg;
        this.m_colorData[2] = pb;
    }
    getRGB3f(color: Color4): void {
        let ds: Float32Array = this.m_colorData;
        color.setRGB3f(ds[0], ds[1], ds[2]);
    }
    setRGBA4f(pr: number, pg: number, pb: number, pa: number): void {
        this.m_colorData[0] = pr;
        this.m_colorData[1] = pg;
        this.m_colorData[2] = pb;
        this.m_colorData[3] = pa;
    }
    getRGBA4f(color: Color4): void {
        let ds: Float32Array = this.m_colorData;
        color.setRGBA4f(ds[0], ds[1], ds[2], ds[3]);
    }
    setAlpha(pa: number): void {
        this.m_colorData[3] = pa;
    }
    createSelfUniformData(): ShaderUniformData {
        let oum: ShaderUniformData = new ShaderUniformData();
        oum.uniformNameList = ["u_color"];
        oum.dataList = [this.m_colorData];
        return oum;
    }

}