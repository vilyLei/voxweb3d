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
import IDefault3DMaterial from "./IDefault3DMaterial";

class Default3DShaderCodeBuffer extends ShaderCodeBuffer {

    private m_uniqueName: string = "";
    normalEnabled: boolean = false;
    vtxMatrixTransform: boolean = true;
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

        if (this.vtxMatrixTransform) {
            coder.addDefine("VOX_VTX_MAT_TRANSFORM");
            coder.useVertSpaceMats(true, true, true);
        }
        else {
            coder.useVertSpaceMats(false, false, false);
        }

        if (this.m_texEnabled) {
            this.m_uniform.addDiffuseMap();
            coder.addVertLayout("vec2", "a_uvs");
            coder.addVarying("vec2", "v_uv");
        }

        if (this.normalEnabled) {
            coder.addFragHeadCode("const vec3 direc = normalize(vec3(0.3,0.6,0.9));")
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
        float nDotL = max(dot(v_worldNormal.xyz, direc), 0.0);
        FragColor0.xyz = FragColor0.xyz * 0.7 + 0.3 * FragColor0.xyz * vec3(nDotL);
    #endif
`
        );

        coder.addVertMainCode(
            `
    localPosition = vec4(a_vs.xyz,1.0);
    #ifdef VOX_VTX_MAT_TRANSFORM
        worldPosition = u_objMat * localPosition;
        oWorldPosition = worldPosition;
        viewPosition = u_viewMat * worldPosition;
        gl_Position = u_projMat * viewPosition;
        #ifdef VOX_USE_NORMAL
            v_worldNormal = normalize( a_nvs.xyz * inverse(mat3(u_objMat)) );
        #endif
    #else
        gl_Position = localPosition;
        #ifdef VOX_USE_NORMAL
            v_worldNormal = normalize( a_nvs.xyz );
        #endif
    #endif

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
export default class Default3DMaterial extends MaterialBase implements IDefault3DMaterial {

    private static s_shdCodeBuffer: Default3DShaderCodeBuffer = null;
    private m_data: Float32Array = new Float32Array([1.0, 1.0, 1.0, 1.0]);
    vertColorEnabled: boolean = false;
    premultiplyAlpha: boolean = false;
    normalEnabled: boolean = false;
    shadowReceiveEnabled: boolean = false;
    vtxMatrixTransform: boolean = true;
    constructor() {
        super();
        if (Default3DMaterial.s_shdCodeBuffer == null) {
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
        buf.vtxMatrixTransform = this.vtxMatrixTransform;
    }
    /**
     * get a shader code buf instance, for sub class override
     * @returns a ShaderCodeBuffer class instance
     */
    getCodeBuf(): ShaderCodeBuffer {
        return Default3DMaterial.s_shdCodeBuffer;
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
    setColor(color: Color4): void {
        color.toArray(this.m_data);
    }
    getColor(color: Color4): void {
        color.fromArray(this.m_data);
    }
    createSelfUniformData(): ShaderUniformData {
        let oum = new ShaderUniformData();
        oum.uniformNameList = ["u_color"];
        oum.dataList = [this.m_data];
        return oum;
    }

}