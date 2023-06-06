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

class NormalShaderCodeBuffer extends ShaderCodeBuffer {

    private m_uniqueName: string = "";
    normalEnabled = false;
    vtxMatrixTransform = true;
    tns = "";
    fragBodyTailCode = "\n";
    fragHeadTailCode = "\n";
    alignScreen = false;
    fixAlignScreen = false;
    mapLodEnabled = false;
    useBake = false;
    fragUniformData: Float32Array = null;
    constructor() {
        super();
    }
    initialize(texEnabled: boolean): void {
        super.initialize(texEnabled);
        this.m_uniqueName = "VOX_NormalShd";
        if (this.m_texEnabled) this.m_uniqueName += "Tex";
        if (this.vertColorEnabled) this.m_uniqueName += "VtxColor";
        if (this.premultiplyAlpha) this.m_uniqueName += "PreMulAlpha";
        this.adaptationShaderVersion = false;
        if (this.fixAlignScreen) {
            this.m_uniqueName += "FixAlScr";
        } else if (this.alignScreen) {
            this.m_uniqueName += "AlScr";
        }
        if (this.mapLodEnabled) {
            this.m_uniqueName += "TLod";
        }
        if (this.fragUniformData) {
            this.m_uniqueName += "FUDL" + this.fragUniformData.length;
        }
		if(this.useBake) {
            this.m_uniqueName += "Bake";
		}
    }

    buildShader(): void {

        let coder = this.m_coder;
        coder.addVertLayout("vec3", "a_vs");
        coder.addFragUniform("vec4", "u_fragParams", 3);

        coder.useVertSpaceMats(false, false, false);
        if (this.fixAlignScreen) {
            this.vtxMatrixTransform = false;
            coder.addDefine("VOX_FIX_ALIGN_SCREEN");
        } else if (this.alignScreen) {
            this.vtxMatrixTransform = false;
            coder.useVertSpaceMats(true, false, false);
            coder.addDefine("VOX_ALIGN_SCREEN");
        }
        if (this.vtxMatrixTransform) {
            coder.addDefine("VOX_VTX_MAT_TRANSFORM");
            coder.useVertSpaceMats(true, true, true);
        }
		if(this.useBake) {
			coder.addDefine("VOX_USE_BAKE");
		}
        if (this.fragUniformData) {
            coder.addFragUniform("vec4", "u_fragDatas", Math.floor(this.fragUniformData.length / 4));
        }

		coder.addVarying("vec3", "v_viewNormal");
        coder.mapLodEnabled = false;
        if (this.m_texEnabled) {
            this.m_uniform.addDiffuseMap();
            coder.mapLodEnabled = this.mapLodEnabled;
            coder.addVertLayout("vec2", "a_uvs");
            coder.addVarying("vec2", "v_uv");
            coder.addVertUniform("vec4", "u_uvTrans");
        }

        if (this.normalEnabled) {
            coder.addFragHeadCode("const vec3 direc = normalize(vec3(1.0,0.6,0.9));");
        }
        if (this.vertColorEnabled) {
            coder.addVertLayout("vec3", "a_cvs");
            coder.addVarying("vec3", "v_cv");
        }

        coder.addFragOutput("vec4", "FragColor0");
        coder.addFragHeadCode(this.fragHeadTailCode);

        coder.addFragMainCode(
            `
    FragColor0 = vec4(1.0);
    #ifdef VOX_USE_2D_MAP
        #ifdef VOX_Texture2DLod
            vec4 color4 = VOX_Texture2DLod(VOX_DIFFUSE_MAP, v_uv, u_param[2].w);
        #else
            FragColor0 *= VOX_Texture2D(VOX_DIFFUSE_MAP, v_uv.xy);
        #endif
    #endif
    #ifdef VOX_USE_VTX_COLOR
        FragColor0.xyz *= v_cv.xyz;
    #endif
    vec4 param = u_fragParams[0];
    vec4 offsetParam = u_fragParams[1];
    #ifdef VOX_PREMULTIPLY_ALPHA
        FragColor0 *= param;
        FragColor0.xyz += offsetParam.xyz;
        param.w += offsetParam.w;
        FragColor0.xyz *= param.www;
    #else
        FragColor0 *= param;
        FragColor0 += offsetParam;
    #endif
    #ifdef VOX_USE_NORMAL
        float nDotL = max(dot(v_viewNormal.xyz, normalize(direc)), 0.0);
        FragColor0.xyz = FragColor0.xyz * 0.3 + 0.7 * vec3(1.0,0.0,0.6) * vec3(nDotL);
    #endif
	${this.fragBodyTailCode}
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
            v_viewNormal = normalize( a_nvs.xyz * inverse(mat3(u_viewMat * u_objMat)) );
        #endif
    #else
        #ifdef VOX_ALIGN_SCREEN
            gl_Position = u_objMat * localPosition;
			#ifdef VOX_USE_NORMAL
				v_viewNormal = normalize( a_nvs.xyz * inverse(mat3(u_objMat)) );
			#endif
        #else
            gl_Position = localPosition;
			#ifdef VOX_USE_NORMAL
				v_viewNormal = normalize( a_nvs.xyz );
			#endif
        #endif
    #endif

    #ifdef VOX_USE_2D_MAP
        v_uv = (a_uvs.xy * u_uvTrans.zw) + u_uvTrans.xy;
    #endif
    #ifdef VOX_USE_VTX_COLOR
        v_cv = a_cvs.xyz;
    #endif
	#ifdef VOX_USE_BAKE
	// for test
	vec2 uvpos = (a_uvs.xy);
    // uvpos.y = 1.0 - uvpos.y;
    uvpos = vec2(2.0) * vec2(uvpos - vec2(0.5));
    gl_Position = vec4(uvpos, 0.0,1.0);
	#endif
`
        );

    }
    getUniqueShaderName(): string {
        return this.m_uniqueName + "_" + this.tns;
    }
}
export default class NormalMaterial extends MaterialBase {

    private static s_shdCodeBuffer: NormalShaderCodeBuffer = null;
    private m_data = new Float32Array([
        1.0, 1.0, 1.0, 1.0,
        0, 0, 0, 0,
        0, 0, 0, 0,
    ]);
    private m_uvTrans = new Float32Array([0.0, 0.0, 1.0, 1.0]);
    name = "";
    fragBodyTailCode = "";
    fragHeadTailCode = "";
    vertColorEnabled = false;
    premultiplyAlpha = false;
    normalEnabled = false;
    shadowReceiveEnabled = false;
    vtxMatrixTransform = true;
    alignScreen = false;
    fixAlignScreen = false;
    mapLodEnabled = false;
    useBake = false;
    fragUniformData: Float32Array = null;
    constructor() {
        super();
        if (NormalMaterial.s_shdCodeBuffer == null) {
            NormalMaterial.s_shdCodeBuffer = new NormalShaderCodeBuffer();
        }
    }
    protected buildBuf(): void {
        let buf = NormalMaterial.s_shdCodeBuffer;
        buf.tns = this.name;
        buf.fragBodyTailCode = this.fragBodyTailCode;
        buf.fragHeadTailCode = this.fragHeadTailCode;
        buf.getShaderCodeBuilder().normalEnabled = this.normalEnabled;
        buf.vertColorEnabled = this.vertColorEnabled;
        buf.premultiplyAlpha = this.premultiplyAlpha;
        buf.normalEnabled = this.normalEnabled;
        buf.shadowReceiveEnabled = this.shadowReceiveEnabled;
        buf.vtxMatrixTransform = this.vtxMatrixTransform;

        buf.alignScreen = this.alignScreen;
        buf.fixAlignScreen = this.fixAlignScreen;
        buf.mapLodEnabled = this.mapLodEnabled;
        buf.useBake = this.useBake;
        buf.fragUniformData = this.fragUniformData;
    }
    /**
     * get a shader code buf instance, for sub class override
     * @returns a ShaderCodeBuffer class instance
     */
    getCodeBuf(): ShaderCodeBuffer {
        return NormalMaterial.s_shdCodeBuffer;
    }
    setUVOffset(px: number, py: number): void {
        this.m_uvTrans[0] = px;
        this.m_uvTrans[1] = py;
    }
    setUVScale(sx: number, sy: number): void {
        this.m_uvTrans[2] = sx;
        this.m_uvTrans[3] = sy;
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

    setOffsetRGB3f(pr: number, pg: number, pb: number): void {
        this.m_data[4] = pr;
        this.m_data[5] = pg;
        this.m_data[6] = pb;
    }
    setOffsetRGBA4f(pr: number, pg: number, pb: number, pa: number): void {
        this.m_data[4] = pr;
        this.m_data[5] = pg;
        this.m_data[6] = pb;
        this.m_data[7] = pa;
    }
    setTextureLodLevel(lodLv: number): void {
        this.m_data[11] = lodLv;
    }
    createSelfUniformData(): ShaderUniformData {
        let oum = new ShaderUniformData();
        if (this.fragUniformData) {
            oum.uniformNameList = ["u_fragParams", "u_uvTrans", "u_fragDatas"];
            oum.dataList = [this.m_data, this.m_uvTrans, this.fragUniformData];
        } else {
            oum.uniformNameList = ["u_fragParams", "u_uvTrans"];
            oum.dataList = [this.m_data, this.m_uvTrans];
        }
        return oum;
    }

}
