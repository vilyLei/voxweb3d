/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ShaderCodeBuffer from "../../vox/material/ShaderCodeBuffer";
import ShaderUniformData from "../../vox/material/ShaderUniformData";
import MaterialBase from "../../vox/material/MaterialBase";
/*

struct pixel
{
    uint8_t red;
    uint8_t green;
    uint8_t blue;
};

struct vector3d; // a 3-vector with doubles
struct texture; // a 2d array of pixels

// determine intensity of pixel, from 0 - 1
const double intensity(const pixel& pPixel)
{
    const double r = static_cast<double>(pPixel.red);
    const double g = static_cast<double>(pPixel.green);
    const double b = static_cast<double>(pPixel.blue);

    const double average = (r + g + b) / 3.0;

    return average / 255.0;
}

const int clamp(int pX, int pMax)
{
    if (pX > pMax)
    {
        return pMax;
    }
    else if (pX < 0)
    {
        return 0;
    }
    else
    {
        return pX;
    }
}

// transform -1 - 1 to 0 - 255
const uint8_t map_component(double pX)
{
    return (pX + 1.0) * (255.0 / 2.0);
}

texture normal_from_height(const texture& pTexture, double pStrength = 2.0)
{
    // assume square texture, not necessarily true in real code
    texture result(pTexture.size(), pTexture.size());

    const int textureSize = static_cast<int>(pTexture.size());
    for (size_t row = 0; row < textureSize; ++row)
    {
        for (size_t column = 0; column < textureSize; ++column)
        {
            // surrounding pixels
            const pixel topLeft = pTexture(clamp(row - 1, textureSize), clamp(column - 1, textureSize));
            const pixel top = pTexture(clamp(row - 1, textureSize), clamp(column, textureSize));
            const pixel topRight = pTexture(clamp(row - 1, textureSize), clamp(column + 1, textureSize));
            const pixel right = pTexture(clamp(row, textureSize), clamp(column + 1, textureSize));
            const pixel bottomRight = pTexture(clamp(row + 1, textureSize), clamp(column + 1, textureSize));
            const pixel bottom = pTexture(clamp(row + 1, textureSize), clamp(column, textureSize));
            const pixel bottomLeft = pTexture(clamp(row + 1, textureSize), clamp(column - 1, textureSize));
            const pixel left = pTexture(clamp(row, textureSize), clamp(column - 1, textureSize));

            // their intensities
            const double tl = intensity(topLeft);
            const double t = intensity(top);
            const double tr = intensity(topRight);
            const double r = intensity(right);
            const double br = intensity(bottomRight);
            const double b = intensity(bottom);
            const double bl = intensity(bottomLeft);
            const double l = intensity(left);

            // sobel filter
            const double dX = (tr + 2.0 * r + br) - (tl + 2.0 * l + bl);
            const double dY = (bl + 2.0 * b + br) - (tl + 2.0 * t + tr);
            const double dZ = 1.0 / pStrength;

            math::vector3d v(dX, dY, dZ);
            v.normalize();

            // convert to rgb
            result(row, column) = pixel(map_component(v.x), map_component(v.y), map_component(v.z));
        }
    }

    return result;
}
// */
class NormalMapBuilderShaderBuffer extends ShaderCodeBuffer {
    constructor() {
        super();
    }
    private static s_instance: NormalMapBuilderShaderBuffer = null;
    private m_uniqueName: string = "";
    private m_hasTex: boolean = false;
    mapLodEnabled: boolean = false;
    initialize(texEnabled: boolean): void {
        this.m_uniqueName = "NormalMapBuilderShd";
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
        coder.addFragUniform("vec4", "u_params", 2);
        // coder.useVertSpaceMats(true, false, false);
		coder.addFragFunction(
			`
float colorToGray(vec3 color)
{
 	return dot(color, vec3(0.2126, 0.7152, 0.0722) );
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
	// color4.z *= -1.0;
	// float k = 3.0;
	// color4.xy = pow(color4.xy, vec2(k)) * 1.5;
	// color4.xyz = normalize(color4.xyz);
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
    gl_Position = u_projMat * u_viewMat * u_objMat * vec4(a_vs,1.0);
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
    constructor() {
        super();
    }

    protected buildBuf(): void {
        let buf = NormalMapBuilderShaderBuffer.GetInstance();
        buf.mapLodEnabled = this.mapLodEnabled;
    }
    getCodeBuf(): ShaderCodeBuffer {
        return  NormalMapBuilderShaderBuffer.GetInstance();
    }
    private m_param = new Float32Array(
        [
            256.0, 256.0, 1.0, 5.0,
			1.0, 1.0, 1.0, 1.0
        ]);
    setTexSize(w: number, h: number): void {
        this.m_param[0] = w;
        this.m_param[1] = h;
    }
	setStrength(p: number): void {
        this.m_param[3] = p;
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
}
