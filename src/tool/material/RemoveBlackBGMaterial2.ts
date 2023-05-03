/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ShaderCodeBuffer from "../../vox/material/ShaderCodeBuffer";
import ShaderUniformData from "../../vox/material/ShaderUniformData";
import MaterialBase from "../../vox/material/MaterialBase";
import IToTransparentPNG from "./IToTransparentPNG";
import Color4 from "../../vox/material/Color4";

class RemoveBlackBGShaderBuffer extends ShaderCodeBuffer {
    constructor() {
        super();
    }
    private static s_instance: RemoveBlackBGShaderBuffer = null;
    private m_uniqueName = "";
    private m_hasTex = false;
    mapLodEnabled = false;
	fixScreen = true;
    initialize(texEnabled: boolean): void {
        this.m_uniqueName = "RemoveBlackBGShd";
        this.m_hasTex = texEnabled;
        if (texEnabled) {
            this.m_uniqueName += "_tex";
            if(this.mapLodEnabled) this.m_uniqueName += "Lod";
        }
		if(this.fixScreen) this.m_uniqueName += "FixScreen";
    }

    buildShader(): void {
        let coder = this.m_coder;
        coder.mapLodEnabled = false;
        if (this.m_hasTex) {
            coder.mapLodEnabled = this.mapLodEnabled;
            this.m_uniform.addDiffuseMap();
        }
        coder.addFragUniform("vec4", "u_params", 4);
		if(this.fixScreen) {
			coder.addDefine("VOX_FIX_SCREEN");
			coder.useVertSpaceMats(true, false, false);
		}

        this.m_coder.addFragMainCode(
            `
void main() {
#ifdef VOX_USE_2D_MAP
	vec4 param = u_params[0];
	vec4 color4 = VOX_Texture2D(VOX_DIFFUSE_MAP, v_uv);
	vec4 initColor4 = color4;
    // invert color
	color4.xyz = mix(color4.xyz, vec3(1.0) - color4.xyz, u_params[1].xxx);
    float dis = length(color4.xyz - u_params[2].xyz);
    dis = clamp(dis/clamp(u_params[1].y, 0.01, 1.0), 0.0, 1.0);
    dis *= dis;
    vec4 c0 = vec4(color4.xyz, max(dis * param.x - param.z, 0.0));
    c0.xyz *= param.yyy;
    FragColor0 = c0 * param.wwww  + vec4(1.0 - param.w) * color4;
	FragColor0.xyz = mix(FragColor0.xyz, vec3(1.0) - FragColor0.xyz, u_params[1].www);
	float a = FragColor0.w;
	a = mix(a, 1.0 - a, u_params[1].z);
	a *= mix(1.0, initColor4.w, u_params[2].w);

	float sa = pow(u_params[3].w, 2.0);
	float atv = (a - 0.5);
	float btv = (0.5 - a);
	a = a >= 0.5 ? min(atv * sa + 0.5, 1.0) : max(0.5 - btv * sa, 0.0);
	FragColor0.w = a;
#else
    FragColor0 = u_param[0];
#endif
}
`
        );
        this.m_coder.addVertMainCode(
            `
void main() {
#ifndef VOX_FIX_SCREEN
	gl_Position = u_projMat * u_viewMat * u_objMat * vec4(a_vs,1.0);
#else
    gl_Position = u_objMat * vec4(a_vs,1.0);
#endif
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

export default class RemoveBlackBGMaterial2 extends MaterialBase implements IToTransparentPNG {
    private m_uid = -1;
    mapLodEnabled: boolean = false;
	fixScreen = true;
    version = -1;
    constructor() {
        super();
    }
    protected buildBuf(): void {
        let buf = RemoveBlackBGShaderBuffer.GetInstance();
		buf.fixScreen = this.fixScreen;
        buf.mapLodEnabled = this.mapLodEnabled;
    }
    getCodeBuf(): ShaderCodeBuffer {
        return  RemoveBlackBGShaderBuffer.GetInstance();
    }
    private m_ds: Float32Array = new Float32Array(
        [
            1.0, 1.0, 0.02, 1.0,
			0, 0.5, 0, 0,
			0, 0, 0, 1.0,		// 剔除的目标颜色r,g,b, initAlphaFactor
			0, 0, 0, 1.0  		// undefined x,y,z,
        ]);
    /**
     * @param p 色彩透明度强度值
     */
    setColorAlphaStrength(p: number): void {
        this.m_ds[0] = p;
        this.version++;
    }
    getColorAlphaStrength(): number {
        return this.m_ds[0];
    }
    /**
     * @param p 颜色强度值
     */
	setColorStrength(p: number): void {
        this.m_ds[1] = p;
        this.version++;
    }
	getColorStrength(): number {
        return this.m_ds[1];
    }
    /**
     * @param p 背景剔除比例值
     */
	setAlphaDiscardFactor(p: number): void {
        this.m_ds[2] = p;
        this.version++;
    }
	getAlphaDiscardFactor(): number {
        return this.m_ds[2];
    }
    /**
     * @param boo true 表示显示原图, false 表示显示剔除之后的结果
     */
	setShowInitImg(boo: boolean): void {
        this.m_ds[3] = boo ? 0.0 : 1.0;
        this.version++;
    }
	getShowInitImg(): boolean {
        return this.m_ds[3] < 1.0;
    }
    /**
     * 计算颜色透明情况的阈值
     * @param r 0.0, -> 1.0
     */
    setDiscardRadius(r: number): void {
        this.m_ds[5] = r;
        this.version++;
    }
    getDiscardRadius(): number {
        return this.m_ds[5];
    }
    /**
     * @param boo true or false
     */
    setInvertAlpha(boo: boolean): void {
        this.m_ds[6] = boo ? 1.0 : 0;
        this.version++;
    }
    getInvertAlpha(): boolean {
        return this.m_ds[6] > 0;
    }
    /**
     * @param boo true or false
     */
    setInvertRGB(boo: boolean): void {
        this.m_ds[7] = boo ? 1.0 : 0;
        this.version++;
    }
    getInvertRGB(): boolean {
        return this.m_ds[7] > 0;
    }
	setSeparateAlpha(v: number): void {
        this.m_ds[15] = v;
        this.version++;
    }
	getSeparateAlpha(): number {
        return this.m_ds[15];
    }
	setInvertDiscard(boo: boolean): void {
        this.m_ds[4] = boo ? 1.0 : 0.0;
        this.version++;
    }
	getInvertDiscard(): boolean {
        return this.m_ds[4] > 0.0;
    }
	setDiscardDstRGB(r: number, g: number, b: number): void {
		let ds = this.m_ds;
		ds[8] = r;
		ds[9] = g;
		ds[10] = b;
        this.version++;
	}
	getDiscardDstRGB(c: Color4): void {
		let ds = this.m_ds;
		c.r = ds[8];
		c.g = ds[9];
		c.b = ds[10];
        this.version++;
	}
	setInitAlphaFactor(f: number): void {
		this.m_ds[11] = f;
        this.version++;
	}
	getInitAlphaFactor(): number {
		return this.m_ds[11];
	}
	paramCopyFrom(dst: RemoveBlackBGMaterial2): void {
		this.m_ds.set(dst.m_ds);
        this.version++;
	}
	cloneData(): Float32Array {
		return this.m_ds.slice(0);
	}
	/**
	 * @param clone the default value is false
	 * @returns Float32Array type data
	 */
	getData(clone: boolean = false): Float32Array {
		if(clone) {
			return this.cloneData();
		}
		return this.m_ds;
	}
	/**
	 * @param ds Float32Array type data
	 * @param i the default value is 0
	 */
	setData(ds: Float32Array, i: number = 0): void {
        this.version++;
		return this.m_ds.set(ds, i);
	}
    createSelfUniformData(): ShaderUniformData {
        let oum: ShaderUniformData = new ShaderUniformData();
        oum.uniformNameList = ["u_params"];
        oum.dataList = [this.m_ds];
        return oum;
    }
}
