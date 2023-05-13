/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ShaderCodeBuffer from "../../vox/material/ShaderCodeBuffer";
import ShaderUniformData from "../../vox/material/ShaderUniformData";
import MaterialBase from "../../vox/material/MaterialBase";

class NormalMapBuilderShaderBuffer extends ShaderCodeBuffer {
    constructor() {
        super();
    }
    private static s_instance: NormalMapBuilderShaderBuffer = null;
    private m_uniqueName = "";
    private m_hasTex = false;
    mapLodEnabled = false;
	fixScreen = false;
    initialize(texEnabled: boolean): void {
        this.m_uniqueName = "NormalMapBuilderShd";
        this.m_hasTex = texEnabled;
        if (texEnabled) {
            this.m_uniqueName += "_tex";
            if(this.mapLodEnabled) this.m_uniqueName += "Lod";
        }
		if(this.fixScreen) {
			this.m_uniqueName += "FixScr";
		}
    }

    buildShader(): void {
        let coder = this.m_coder;
        coder.mapLodEnabled = false;
        if (this.m_hasTex) {
            coder.mapLodEnabled = this.mapLodEnabled;
            this.m_uniform.addDiffuseMap();
        }
		if(this.fixScreen) {
			coder.useVertSpaceMats(true, false, false);
			coder.addDefine("VOX_FIX_SCREEN");
		}
        coder.addFragUniform("vec4", "u_params", 3);
		coder.addFragFunction(
			`
float colorToGray(vec3 color)
{
	float h = dot(color, vec3(0.2126, 0.7152, 0.0722) );
 	return u_params[2].w > 0.0 ? 1.0 - h : h;
}

vec3 buildWithSobel(vec2 uv) {

	vec4 param = u_params[0];
	vec2 dv = param.zz / param.xy;

	vec3 topLeft = VOX_Texture2D(VOX_DIFFUSE_MAP, uv - dv).rgb;
	vec3 top = VOX_Texture2D(VOX_DIFFUSE_MAP, uv - vec2(0.0, dv.y)).rgb;
	vec3 topRight = VOX_Texture2D(VOX_DIFFUSE_MAP, uv - vec2(-dv.x, dv.y)).rgb;
	vec3 right = VOX_Texture2D(VOX_DIFFUSE_MAP, uv + vec2(dv.x, 0.0)).rgb;
	vec3 bottomRight = VOX_Texture2D(VOX_DIFFUSE_MAP, uv + dv).rgb;
	vec3 bottom = VOX_Texture2D(VOX_DIFFUSE_MAP, uv + vec2(0.0, dv.y)).rgb;
	vec3 bottomLeft = VOX_Texture2D(VOX_DIFFUSE_MAP, uv + vec2(-dv.x, dv.y)).rgb;
	vec3 left = VOX_Texture2D(VOX_DIFFUSE_MAP, uv + vec2(-dv.x, 0.0)).rgb;

	// their intensities
	float tl = colorToGray(topLeft);
	float t = colorToGray(top);
	float tr = colorToGray(topRight);
	float r = colorToGray(right);
	float br = colorToGray(bottomRight);
	float b = colorToGray(bottom);
	float bl = colorToGray(bottomLeft);
	float l = colorToGray(left);

	float k = 4.0;
	// tl = pow(tl, k);
	// t = pow(t, k);
	// tr = pow(tr, k);
	// r = pow(r, k);
	// br = pow(br, k);
	// b = pow(b, k);
	// bl = pow(bl, k);
	// l = pow(l, k);

	float pStrength = param.w;
    // sobel filter (Sobel operator)
    float dX = (tr + 2.0 * r + br) - (tl + 2.0 * l + bl);
    float dY = (bl + 2.0 * b + br) - (tl + 2.0 * t + tr);
    float dZ = 1.0 / pStrength;

	param = u_params[1];
    vec3 v3 = normalize(vec3(dX, dY, dZ) * vec3(param.xy, 1.0));
	return v3;
}
			`
		);
        this.m_coder.addFragMainCode(
            `
void main() {
#ifdef VOX_USE_2D_MAP

	vec4 color4 = vec4(buildWithSobel(vec2(v_uv.x, 1.0 - v_uv.y)), 1.0);
	color4.xy *= u_params[2].xy;
	color4.xyz = normalize(color4.xyz * 0.5 + 0.5);

    FragColor0 = color4;
#else
    FragColor0 = u_params[1];
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
    static GetInstance(): NormalMapBuilderShaderBuffer {
        if (NormalMapBuilderShaderBuffer.s_instance != null) {
            return NormalMapBuilderShaderBuffer.s_instance;
        }
        NormalMapBuilderShaderBuffer.s_instance = new NormalMapBuilderShaderBuffer();
        return NormalMapBuilderShaderBuffer.s_instance;
    }
}

export default class NormalMapBuilderMaterial extends MaterialBase {
    mapLodEnabled: boolean = false;
	fixScreen = false;
    constructor() {
        super();
    }

    protected buildBuf(): void {
        let buf = NormalMapBuilderShaderBuffer.GetInstance();
		buf.fixScreen = this.fixScreen;
        buf.mapLodEnabled = this.mapLodEnabled;
    }
    getCodeBuf(): ShaderCodeBuffer {
        return  NormalMapBuilderShaderBuffer.GetInstance();
    }
    private m_param = new Float32Array(
        [
            256.0, 256.0, 1.0, 5.0,
			1.0, 1.0, 1.0, 0.0,
			1.0, 1.0, 0.0, 0.0,
        ]);
    setTexSize(w: number, h: number): void {
        this.m_param[0] = w;
        this.m_param[1] = h;
    }
	setStrength(p: number): void {
        this.m_param[3] = p;
    }

	setInvertEnabled(b: boolean): void {
        this.m_param[11] = b ? 2.0 : 0.0;
    }
	setInvertXEnabled(b: boolean): void {
        this.m_param[8] = b ? -1.0 : 1.0;
    }
	setInvertYEnabled(b: boolean): void {
        this.m_param[9] = b ? -1.0 : 1.0;
    }
	setSharpness(p: number): void {
        this.m_param[2] = p;
	}
    createSelfUniformData(): ShaderUniformData {
        let oum = new ShaderUniformData();
        oum.uniformNameList = ["u_params"];
        oum.dataList = [this.m_param];
        return oum;
    }
	dataCopyFrom(src: NormalMapBuilderMaterial): void {
		if(src != null) {
			this.m_param.set(src.m_param);
		}
	}
}
