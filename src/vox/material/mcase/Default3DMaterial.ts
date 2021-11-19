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
    
    constructor() {
        super();
    }
    initialize(texEnabled: boolean): void {
        super.initialize(texEnabled);
        this.m_uniqueName = "VOX_Default3DShd";
        if (this.m_texEnabled) this.m_uniqueName += "_tex";
        if (this.vtxColorEnabled) this.m_uniqueName += "_vtxColor";
        if (this.premultiplyAlpha) this.m_uniqueName += "_preMulAlpha";
        this.adaptationShaderVersion = false;
    }
    
    buildShader(): void {

        let coder = this.m_coder;        
        coder.addVertLayout("vec3", "a_vs");
        coder.addFragUniform("vec4", "u_color");
        coder.useVertSpaceMats(true, true, true);

        if (this.premultiplyAlpha) coder.addDefine("VOX_PREMULTIPLY_ALPHA", "1");
        if (this.m_texEnabled) {
            coder.addDiffuseMap();
            coder.addVertLayout("vec2", "a_uvs");
            coder.addVarying("vec2", "v_uv");
        }
        if (this.vtxColorEnabled) {
            coder.addDefine("VOX_USE_VTX_COLOR", "1");
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
    FragColor0 *= vec4(v_cv.xyz,1.0);
#endif
#ifdef VOX_PREMULTIPLY_ALPHA
    FragColor0.rgb *= u_color.xyz;
    FragColor0.a *= u_color.w;
    FragColor0.rgb *= u_color.aaa;
#else
    FragColor0 *= u_color;
#endif
`
        );
        
        coder.addVertMainCode(
            `
vec4 localPosition = vec4(a_vs.xyz,1.0);
vec4 wpos = u_objMat * localPosition;
gl_Position = u_projMat * u_viewMat * wpos;

#ifdef VOX_USE_2D_MAP
    v_uv = a_uvs.xy;
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
    private m_colorArray: Float32Array = new Float32Array([1.0, 1.0, 1.0, 1.0]);
    vtxColorEnabled: boolean = false;
    premultiplyAlpha: boolean = false;
    constructor() {
        super();
        if(Default3DMaterial.s_shdCodeBuffer == null) {
            Default3DMaterial.s_shdCodeBuffer = new Default3DShaderCodeBuffer();
        }
    }
    protected buildBuf(): void {
        let buf: Default3DShaderCodeBuffer = Default3DMaterial.s_shdCodeBuffer;
        buf.vtxColorEnabled = this.vtxColorEnabled;
        buf.premultiplyAlpha = this.premultiplyAlpha;
    }
    /**
     * get a shader code buf instance, for sub class override
     * @returns a ShaderCodeBuffer class instance
     */
    getCodeBuf(): ShaderCodeBuffer {
        return Default3DMaterial.s_shdCodeBuffer;
    }
    setRGB3f(pr: number, pg: number, pb: number): void {
        this.m_colorArray[0] = pr;
        this.m_colorArray[1] = pg;
        this.m_colorArray[2] = pb;
    }
    getRGB3f(color: Color4): void {
        let ds: Float32Array = this.m_colorArray;
        color.setRGB3f(ds[0], ds[1], ds[2]);
    }
    setRGBA4f(pr: number, pg: number, pb: number, pa: number): void {
        this.m_colorArray[0] = pr;
        this.m_colorArray[1] = pg;
        this.m_colorArray[2] = pb;
        this.m_colorArray[3] = pa;
    }
    getRGBA4f(color: Color4): void {
        let ds: Float32Array = this.m_colorArray;
        color.setRGBA4f(ds[0], ds[1], ds[2], ds[3]);
    }
    setAlpha(pa: number): void {
        this.m_colorArray[3] = pa;
    }
    createSelfUniformData(): ShaderUniformData {
        let oum: ShaderUniformData = new ShaderUniformData();
        oum.uniformNameList = ["u_color"];
        oum.dataList = [this.m_colorArray];
        return oum;
    }

}