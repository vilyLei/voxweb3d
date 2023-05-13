/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ShaderCodeBuffer from "../../../vox/material/ShaderCodeBuffer";
import ShaderUniformData from "../../../vox/material/ShaderUniformData";
import MaterialBase from "../../../vox/material/MaterialBase";

class Cloud02ShaderBuffer extends ShaderCodeBuffer {
    constructor() {
        super();
    }
    private static s_instance: Cloud02ShaderBuffer = null;
    private m_uniqueName = "";
    private m_hasTex = false;
    mapLodEnabled = false;
	fixScreen = true;
    initialize(texEnabled: boolean): void {
        this.m_uniqueName = "Cloud02Shd";
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
        coder.addFragUniform("vec4", "u_params", 2);
		if(this.fixScreen) {
			coder.addDefine("VOX_FIX_SCREEN");
			coder.useVertSpaceMats(true, false, false);
		}

let paramCodeStr = `
float iTime = 0.1;
vec4 iResolution = vec4(128, 128, 1.0,1.0);
vec4 iMouse = vec4(128.0, 0.5, 0.0,0.0);
		`;

		this.m_coder.addFragFunction( paramCodeStr );

		// thanks: https://www.shadertoy.com/view/WslGWl
let codeStr = `

#define USE_LIGHT 0

mat3 m = mat3( 0.00,  0.80,  0.60,
              -0.80,  0.36, -0.48,
              -0.60, -0.48,  0.64);

float hash(float n)
{
    return fract(sin(n) * 43758.5453);
}

///
/// Noise function
///
float noise(in vec3 x)
{
    vec3 p = floor(x);
    vec3 f = fract(x);

    f = f * f * (3.0 - 2.0 * f);

    float n = p.x + p.y * 57.0 + 113.0 * p.z;

    float res = mix(mix(mix(hash(n +   0.0), hash(n +   1.0), f.x),
                        mix(hash(n +  57.0), hash(n +  58.0), f.x), f.y),
                    mix(mix(hash(n + 113.0), hash(n + 114.0), f.x),
                        mix(hash(n + 170.0), hash(n + 171.0), f.x), f.y), f.z);
    return res;
}

///
/// Fractal Brownian motion.
///
/// Refer to:
/// EN: https://thebookofshaders.com/13/
/// JP: https://thebookofshaders.com/13/?lan=jp
///
float fbm(vec3 p)
{
    float f;
    f  = 0.5000 * noise(p); p = m * p * 2.02;
    f += 0.2500 * noise(p); p = m * p * 2.03;
    f += 0.1250 * noise(p);
    return f;
}

//////////////////////////////////////////////////

///
/// Sphere distance function.
///
/// But this function return inverse value.
/// Normal dist function is like below.
///
/// return length(pos) - 0.1;
///
/// Because this function is used for density.
///
float scene(in vec3 pos)
{
    return 0.1 - length(pos) * 0.05 + fbm(pos * 0.3);
}

///
/// Get normal of the cloud.
///
vec3 getNormal(in vec3 p)
{
    const float e = 0.01;
    return normalize(vec3(scene(vec3(p.x + e, p.y, p.z)) - scene(vec3(p.x - e, p.y, p.z)),
                          scene(vec3(p.x, p.y + e, p.z)) - scene(vec3(p.x, p.y - e, p.z)),
                          scene(vec3(p.x, p.y, p.z + e)) - scene(vec3(p.x, p.y, p.z - e))));
}

///
/// Create a camera pose control matrix.
///
mat3 camera(vec3 ro, vec3 ta)
{
    vec3 cw = normalize(ta - ro);
    vec3 cp = vec3(0.0, 1.0, 0.0);
    vec3 cu = cross(cw, cp);
    vec3 cv = cross(cu, cw);
    return mat3(cu, cv, cw);
}

///
/// Main function.
///
void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    vec2 uv = (fragCoord.xy * 2.0 - iResolution.xy) / min(iResolution.x, iResolution.y);

    vec2 mo = vec2(iTime * 0.1, cos(iTime * 0.25) * 3.0);

    // Camera
    float camDist = 25.0;

    // target
    vec3 ta = vec3(0.0, 1.0, 0.0);

    // Ray origin
    //vec3 ori = vec3(sin(iTime) * camDist, 0, cos(iTime) * camDist);
    vec3 ro = camDist * normalize(vec3(cos(2.75 - 3.0 * mo.x), 0.7 - 1.0 * (mo.y - 1.0), sin(2.75 - 3.0 * mo.x)));

    float targetDepth = 1.3;

    // Camera pose.
    mat3 c = camera(ro, ta);
    vec3 dir = c * normalize(vec3(uv, targetDepth));

    // For raymarching const values.
    const int sampleCount = 64;
    const int sampleLightCount = 6;
    const float eps = 0.01;

    // Raymarching step settings.
    float zMax = 40.0;
    float zstep = zMax / float(sampleCount);

    float zMaxl = 20.0;
    float zstepl = zMaxl / float(sampleLightCount);

    // Easy access to the ray origin
    vec3 p = ro;

    // Transmittance
    float T = 1.0;

    // Substantially transparency parameter.
    float absorption = 100.0;

    // Light Direction
    vec3 sun_direction = normalize(vec3(1.0, 0.0, 0.0));

    // Result of culcration
    vec4 color = vec4(0.0);

    for (int i = 0; i < sampleCount; i++)
    {
        // Using distance function for density.
        // So the function not normal value.
        // Please check it out on the function comment.
        float density = scene(p);

        // The density over 0.0 then start cloud ray marching.
        // Why? because the function will return negative value normally.
        // But if ray is into the cloud, the function will return positive value.
        if (density > 0.0)
        {
            // Let's start cloud ray marching!

            // why density sub by sampleCount?
            // This mean integral for each sampling points.
            float tmp = density / float(sampleCount);

            T *= 1.0 - (tmp * absorption);

            // Return if transmittance under 0.01.
            // Because the ray is almost absorbed.
            if (T <= 0.01)
            {
                break;
            }

            #if USE_LIGHT == 1
            // Light scattering

            // Transmittance for Light
            float Tl = 1.0;

            // Start light scattering with raymarching.

            // Raymarching position for the light.
            vec3 lp = p;

            // Iteration of sampling light.
            for (int j = 0; j < sampleLightCount; j++)
            {
                float densityLight = scene(lp);

                // If densityLight is over 0.0, the ray is stil in the cloud.
                if (densityLight > 0.0)
                {
                    float tmpl = densityLight / float(sampleCount);
                    Tl *= 1.0 - (tmpl * absorption);
                }

                if (Tl <= 0.01)
                {
                    break;
                }

                // Step to next position.
                lp += sun_direction * zstepl;
            }
            #endif

            // Add ambient + light scattering color
            float opaity = 50.0;
            float k = opaity * tmp * T;
            vec4 cloudColor = vec4(1.0);
            vec4 col1 = cloudColor * k;

            #if USE_LIGHT == 1
            float opacityl = 30.0;
            float kl = opacityl * tmp * T * Tl;
            vec4 lightColor = vec4(1.0, 0.7, 0.9, 1.0);
            vec4 col2 = lightColor * kl;
            #else
            vec4 col2 = vec4(0.0);
            #endif

            color += col1 + col2;
        }

        p += dir * zstep;
    }

    vec3 bg = mix(vec3(0.3, 0.1, 0.8), vec3(0.7, 0.7, 1.0), 1.0 - (uv.y + 1.0) * 0.5);
    color.rgb += bg;

	fragColor = color;
}
`
		this.m_coder.addFragFunction( codeStr );
        this.m_coder.addFragMainCode(
            `
void main() {
#ifdef VOX_USE_2D_MAP
	iResolution = u_params[0];
	iMouse.xy = u_params[0].zw;
	iTime = u_params[1].w;
	// m3 *= u_params[1].z;
	vec4 color4 = VOX_Texture2D(VOX_DIFFUSE_MAP, v_uv.xy);
	mainImage(color4, v_uv.xy *  iResolution.xy);
	FragColor0 = color4;
#else
    FragColor0 = u_params[0];
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
    static GetInstance(): Cloud02ShaderBuffer {
        if (Cloud02ShaderBuffer.s_instance != null) {
            return Cloud02ShaderBuffer.s_instance;
        }
        Cloud02ShaderBuffer.s_instance = new Cloud02ShaderBuffer();
        return Cloud02ShaderBuffer.s_instance;
    }
}

export default class Cloud02Material extends MaterialBase {
    mapLodEnabled: boolean = false;
	fixScreen = true;
    constructor() {
        super();
    }

    protected buildBuf(): void {
        let buf = Cloud02ShaderBuffer.GetInstance();
		buf.fixScreen = this.fixScreen;
        buf.mapLodEnabled = this.mapLodEnabled;
    }
    getCodeBuf(): ShaderCodeBuffer {
        return  Cloud02ShaderBuffer.GetInstance();
    }
    private m_data: Float32Array = new Float32Array(
        [
            1.0, 1.0, 0.5, 0.5,
			0, 0, 1.5, 0
        ]);
    setSize(pw: number, ph: number): void {
        this.m_data[0] = pw;
        this.m_data[1] = ph;
    }
    setMouseXY(px: number, py: number): void {
        this.m_data[2] = px;
        this.m_data[3] = py;
    }
    setTime(time: number): void {
        this.m_data[7] = time;
    }
    setFactor(f: number): void {
        this.m_data[6] = f;
    }
	dataCopyFrom(dst: Cloud02Material): void {
		this.m_data.set(dst.m_data);
	}
    createSelfUniformData(): ShaderUniformData {
        let oum: ShaderUniformData = new ShaderUniformData();
        oum.uniformNameList = ["u_params"];
        oum.dataList = [this.m_data];
        return oum;
    }
}
