/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
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
class NormalMapBuilder1ShaderBuffer extends ShaderCodeBuffer {
    constructor() {
        super();
    }
    private static s_instance: NormalMapBuilder1ShaderBuffer = null;
    private m_uniqueName: string = "";
    private m_hasTex: boolean = false;
    mapLodEnabled: boolean = false;
    initialize(texEnabled: boolean): void {
        this.m_uniqueName = "NormalMapBuilder1Shd";
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
		coder.addFragFunction(
			`
float getVal(vec2 uv)
{
	return length(VOX_Texture2D(VOX_DIFFUSE_MAP,uv).xyz);
}
// 计算梯度
vec2 getGrad(vec2 uv,float delta)
{
	// 下降幅度和方向
	vec2 d=vec2(delta,0);
	return vec2(
		getVal(uv+d.xy)-getVal(uv-d.xy),
		getVal(uv+d.yx)-getVal(uv-d.yx)
	)/delta;
}

vec3 buildNormalMap( out vec4 fragColor, in vec2 fragCoord)
{
	vec2 uv = fragCoord.xy / u_param.xy;
	vec3 n = vec3(getGrad(uv, 1.0/u_param.y), 150.0);

	n = normalize(n);
	return n;
}
vec3 buildNormalMap2(vec2 uv)
{
	vec3 n = vec3(getGrad(uv, 1.0/u_param.y), 150.0);
	n = normalize(n);
	return n;
}
float colorToGray(vec3 color)
{
 	return dot(color, vec3(0.2126, 0.7152, 0.0722) );
 	// return length(color);
}
vec3 calcNormalByGray(vec2 uv)
{
    // 代码后有详细的讲解
	vec2 texSizeFactor = 1.0/u_param.xy;
	float df = 2.0;
    vec2 deltaU = vec2(texSizeFactor.x * df, 0.0);
    float h1_u = colorToGray(VOX_Texture2D(VOX_DIFFUSE_MAP, uv - deltaU).rgb);
    float h2_u = colorToGray(VOX_Texture2D(VOX_DIFFUSE_MAP, uv + deltaU).rgb);
    // vec3 tangent_u = vec3(1.0, 0.0, (h2_u - h1_u) / deltaU.x);
    vec3 tangent_u = vec3(deltaU.x, 0.0, (h2_u - h1_u));

    vec2 deltaV = vec2(0.0, texSizeFactor.y * df);
    float h1_v = colorToGray(VOX_Texture2D(VOX_DIFFUSE_MAP, uv - deltaV).rgb);
    float h2_v = colorToGray(VOX_Texture2D(VOX_DIFFUSE_MAP, uv + deltaV).rgb);
    // vec3 tangent_v = vec3(0.0, 1.0, (h2_v - h1_v) / deltaV.y);
    vec3 tangent_v = vec3(0.0, deltaV.y, (h2_v - h1_v));

    vec3 normal = normalize(cross(tangent_v, tangent_u));
    return normal;
}
vec3 buildWithSobel(vec2 uv) {
	vec2 dv = 0.5 * 1.0/u_param.xy;

	// vec3 topLeft = VOX_Texture2D(VOX_DIFFUSE_MAP, uv - dv).rgb;
	// vec3 top = VOX_Texture2D(VOX_DIFFUSE_MAP, uv - vec2(dv.x, 0.0)).rgb;
	// vec3 topRight = VOX_Texture2D(VOX_DIFFUSE_MAP, uv - vec2(dv.x, -dv.y)).rgb;
	// vec3 right = VOX_Texture2D(VOX_DIFFUSE_MAP, uv + vec2(0.0, dv.y)).rgb;
	// vec3 bottomRight = VOX_Texture2D(VOX_DIFFUSE_MAP, uv + dv).rgb;
	// vec3 bottom = VOX_Texture2D(VOX_DIFFUSE_MAP, uv + vec2(dv.x, 0.0)).rgb;
	// vec3 bottomLeft = VOX_Texture2D(VOX_DIFFUSE_MAP, uv + vec2(dv.x, -dv.y)).rgb;
	// vec3 left = VOX_Texture2D(VOX_DIFFUSE_MAP, uv + vec2(0.0, -dv.y)).rgb;

	vec3 topLeft = VOX_Texture2D(VOX_DIFFUSE_MAP, uv - dv).rgb;
	vec3 top = VOX_Texture2D(VOX_DIFFUSE_MAP, uv - vec2(0.0, dv.y)).rgb;
	vec3 topRight = VOX_Texture2D(VOX_DIFFUSE_MAP, uv - vec2(-dv.x, dv.y)).rgb;
	vec3 right = VOX_Texture2D(VOX_DIFFUSE_MAP, uv + vec2(dv.x, 0.0)).rgb;
	vec3 bottomRight = VOX_Texture2D(VOX_DIFFUSE_MAP, uv + dv).rgb;
	vec3 bottom = VOX_Texture2D(VOX_DIFFUSE_MAP, uv + vec2(0.0, dv.y)).rgb;
	vec3 bottomLeft = VOX_Texture2D(VOX_DIFFUSE_MAP, uv + vec2(-dv.x, dv.y)).rgb;
	vec3 left = VOX_Texture2D(VOX_DIFFUSE_MAP, uv + vec2(-dv.x, 0.0)).rgb;

	// vec3 topLeft = pTexture(clamp(row - 1, textureSize), clamp(column - 1, textureSize));
	// vec3 top = pTexture(clamp(row - 1, textureSize), clamp(column, textureSize));
	// vec3 topRight = pTexture(clamp(row - 1, textureSize), clamp(column + 1, textureSize));
	// vec3 right = pTexture(clamp(row, textureSize), clamp(column + 1, textureSize));
	// vec3 bottomRight = pTexture(clamp(row + 1, textureSize), clamp(column + 1, textureSize));
	// vec3 bottom = pTexture(clamp(row + 1, textureSize), clamp(column, textureSize));
	// vec3 bottomLeft = pTexture(clamp(row + 1, textureSize), clamp(column - 1, textureSize));
	// vec3 left = pTexture(clamp(row, textureSize), clamp(column - 1, textureSize));

	// their intensities
	// const double tl = intensity(topLeft);
	// const double t = intensity(top);
	// const double tr = intensity(topRight);
	// const double r = intensity(right);
	// const double br = intensity(bottomRight);
	// const double b = intensity(bottom);
	// const double bl = intensity(bottomLeft);
	// const double l = colorToGray(left);

	float tl = colorToGray(topLeft);
	float t = colorToGray(top);
	float tr = colorToGray(topRight);
	float r = colorToGray(right);
	float br = colorToGray(bottomRight);
	float b = colorToGray(bottom);
	float bl = colorToGray(bottomLeft);
	float l = colorToGray(left);

	float pStrength = 20.0;
    // sobel filter (Sobel operator)
    float dX = (tr + 2.0 * r + br) - (tl + 2.0 * l + bl);
    float dY = (bl + 2.0 * b + br) - (tl + 2.0 * t + tr);
    float dZ = 1.0 / pStrength;

    vec3 v3 = normalize(vec3(dX, dY, dZ));
	return v3;
}
			`
		);
        this.m_coder.addFragMainCode(
            `
void main() {
#ifdef VOX_USE_2D_MAP
	vec4 color4 = VOX_Texture2D(VOX_DIFFUSE_MAP, v_uv);
	// color4.rgb = vec3(colorToGray(color4.rgb));

	// color4.rgb = calcNormalByGray(v_uv);
	// color4.b *= -1.0;
	// color4.rgb = color4.rgb * 0.5 + 0.5;

	//// color4.rgb = buildNormalMap2(v_uv);

	// color4.xyz = buildWithSobel(v_uv);
	color4.xyz = buildWithSobel(vec2(v_uv.x, 1.0 - v_uv.y));
	// color4.z *= -1.0;
	color4.xyz = normalize(color4.xyz * 0.5 + 0.5);
    FragColor0 = color4;
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
    static GetInstance(): NormalMapBuilder1ShaderBuffer {
        if (NormalMapBuilder1ShaderBuffer.s_instance != null) {
            return NormalMapBuilder1ShaderBuffer.s_instance;
        }
        NormalMapBuilder1ShaderBuffer.s_instance = new NormalMapBuilder1ShaderBuffer();
        return NormalMapBuilder1ShaderBuffer.s_instance;
    }
}

export default class NormalMapBuilder1Material extends MaterialBase {
    mapLodEnabled: boolean = false;
    constructor() {
        super();
    }

    protected buildBuf(): void {
        let buf = NormalMapBuilder1ShaderBuffer.GetInstance();
        buf.mapLodEnabled = this.mapLodEnabled;
    }
    getCodeBuf(): ShaderCodeBuffer {
        return  NormalMapBuilder1ShaderBuffer.GetInstance();
    }
    private m_param = new Float32Array(
        [
            256.0, 256.0, 1.0, 0.0
        ]);
    setTexSize(w: number, h: number): void {
        this.m_param[0] = w;
        this.m_param[1] = h;
    }
	unitSize(p: number): void {
        this.m_param[2] = p;
    }
    createSelfUniformData(): ShaderUniformData {
        let oum: ShaderUniformData = new ShaderUniformData();
        oum.uniformNameList = ["u_param"];
        oum.dataList = [this.m_param];
        return oum;
    }
}
