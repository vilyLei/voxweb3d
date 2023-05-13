/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ShaderCodeBuffer from "../../../vox/material/ShaderCodeBuffer";
import ShaderUniformData from "../../../vox/material/ShaderUniformData";
import MaterialBase from "../../../vox/material/MaterialBase";

class Cloud01ShaderBuffer extends ShaderCodeBuffer {
    constructor() {
        super();
    }
    private static s_instance: Cloud01ShaderBuffer = null;
    private m_uniqueName = "";
    private m_hasTex = false;
    mapLodEnabled = false;
	fixScreen = true;
    initialize(texEnabled: boolean): void {
        this.m_uniqueName = "Cloud01Shd";
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
		// thanks: https://www.shadertoy.com/view/3l23Rh
let codeStr = `

mat2 rot(in float a){float c = cos(a), s = sin(a);return mat2(c,s,-s,c);}
// const mat3 m3 = mat3(0.33338, 0.56034, -0.71817, -0.87887, 0.32651, -0.15323, 0.15162, 0.69596, 0.61339)*1.93;
mat3 m3 = mat3(0.33338, 0.56034, -0.71817, -0.87887, 0.32651, -0.15323, 0.15162, 0.69596, 0.61339);
float mag2(vec2 p){return dot(p,p);}
float linstep(in float mn, in float mx, in float x){ return clamp((x - mn)/(mx - mn), 0., 1.); }
float prm1 = 0.;
vec2 bsMo = vec2(0);

vec2 disp(float t){ return vec2(sin(t*0.22)*1., cos(t*0.175)*1.)*2.; }
vec2 map(vec3 p)
{
    vec3 p2 = p;
    p2.xy -= disp(p.z).xy;
    p.xy *= rot(sin(p.z+iTime)*(0.1 + prm1*0.05) + iTime*0.09);
    float cl = mag2(p2.xy);
    float d = 0.;
    p *= .61;
    float z = 1.;
    float trk = 1.;
    float dspAmp = 0.1 + prm1*0.2;
    for(int i = 0; i < 5; i++)
    {
		p += sin(p.zxy*0.75*trk + iTime*trk*.8)*dspAmp;
        d -= abs(dot(cos(p), sin(p.yzx))*z);
        z *= 0.57;
        trk *= 1.4;
        p = p*m3;
    }
    d = abs(d + prm1*3.)+ prm1*.3 - 2.5 + bsMo.y;
    return vec2(d + cl*.2 + 0.25, cl);
}

vec4 render( in vec3 ro, in vec3 rd, float time )
{
	vec4 rez = vec4(0);
    const float ldst = 8.;
	vec3 lpos = vec3(disp(time + ldst)*0.5, time + ldst);
	float t = 1.5;
	float fogT = 0.;
	for(int i=0; i<130; i++)
	{
		if(rez.a > 0.99)break;

		vec3 pos = ro + t*rd;
        vec2 mpv = map(pos);
		float den = clamp(mpv.x-0.3,0.,1.)*1.12;
		float dn = clamp((mpv.x + 2.),0.,3.);

		vec4 col = vec4(0);
        if (mpv.x > 0.6)
        {

            col = vec4(sin(vec3(5.,0.4,0.2) + mpv.y*0.1 +sin(pos.z*0.4)*0.5 + 1.8)*0.5 + 0.5,0.08);
            col *= den*den*den;
			col.rgb *= linstep(4.,-2.5, mpv.x)*2.3;
            float dif =  clamp((den - map(pos+.8).x)/9., 0.001, 1. );
            dif += clamp((den - map(pos+.35).x)/2.5, 0.001, 1. );
            col.xyz *= den*(vec3(0.005,.045,.075) + 1.5*vec3(0.033,0.07,0.03)*dif);
        }

		float fogC = exp(t*0.2 - 2.2);
		col.rgba += vec4(0.06,0.11,0.11, 0.1)*clamp(fogC-fogT, 0., 1.);
		fogT = fogC;
		rez = rez + col*(1. - rez.a);
		t += clamp(0.5 - dn*dn*.05, 0.09, 0.3);
	}
	return clamp(rez, 0.0, 1.0);
}

float getsat(vec3 c)
{
    float mi = min(min(c.x, c.y), c.z);
    float ma = max(max(c.x, c.y), c.z);
    return (ma - mi)/(ma+ 1e-7);
}

//from my "Will it blend" shader (https://www.shadertoy.com/view/lsdGzN)
vec3 iLerp(in vec3 a, in vec3 b, in float x)
{
    vec3 ic = mix(a, b, x) + vec3(1e-6,0.,0.);
    float sd = abs(getsat(ic) - mix(getsat(a), getsat(b), x));
    vec3 dir = normalize(vec3(2.*ic.x - ic.y - ic.z, 2.*ic.y - ic.x - ic.z, 2.*ic.z - ic.y - ic.x));
    float lgt = dot(vec3(1.0), ic);
    float ff = dot(dir, normalize(ic));
    ic += 1.5*dir*sd*ff*lgt;
    return clamp(ic,0.,1.);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 q = fragCoord.xy/iResolution.xy;
    // vec2 p = (gl_FragCoord.xy - 0.5*iResolution.xy)/iResolution.y;
    vec2 p = (fragCoord.xy - 0.5*iResolution.xy)/iResolution.y;
    bsMo = (iMouse.xy - 0.5*iResolution.xy)/iResolution.y;

    float time = iTime*3.;
    vec3 ro = vec3(0,0,time);

    ro += vec3(sin(iTime)*0.5,sin(iTime*1.)*0.,0);

    float dspAmp = .85;
    ro.xy += disp(ro.z)*dspAmp;
    float tgtDst = 3.5;

    vec3 target = normalize(ro - vec3(disp(time + tgtDst)*dspAmp, time + tgtDst));
    ro.x -= bsMo.x*2.;
    vec3 rightdir = normalize(cross(target, vec3(0,1,0)));
    vec3 updir = normalize(cross(rightdir, target));
    rightdir = normalize(cross(updir, target));
	vec3 rd=normalize((p.x*rightdir + p.y*updir)*1. - target);
    rd.xy *= rot(-disp(time + 3.5).x*0.2 + bsMo.x);
    prm1 = smoothstep(-0.4, 0.4,sin(iTime*0.3));
	vec4 scn = render(ro, rd, time);

    vec3 col = scn.rgb;
    col = iLerp(col.bgr, col.rgb, clamp(1.-prm1,0.05,1.));

    col = pow(col, vec3(.55,0.65,0.6))*vec3(1.,.97,.9);

    col *= pow( 16.0*q.x*q.y*(1.0-q.x)*(1.0-q.y), 0.12)*0.7+0.3; //Vign

	fragColor = vec4( col, 1.0 );
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
	m3 *= u_params[1].z;
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
    static GetInstance(): Cloud01ShaderBuffer {
        if (Cloud01ShaderBuffer.s_instance != null) {
            return Cloud01ShaderBuffer.s_instance;
        }
        Cloud01ShaderBuffer.s_instance = new Cloud01ShaderBuffer();
        return Cloud01ShaderBuffer.s_instance;
    }
}

export default class Cloud01Material extends MaterialBase {
    mapLodEnabled: boolean = false;
	fixScreen = true;
    constructor() {
        super();
    }

    protected buildBuf(): void {
        let buf = Cloud01ShaderBuffer.GetInstance();
		buf.fixScreen = this.fixScreen;
        buf.mapLodEnabled = this.mapLodEnabled;
    }
    getCodeBuf(): ShaderCodeBuffer {
        return  Cloud01ShaderBuffer.GetInstance();
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
	dataCopyFrom(dst: Cloud01Material): void {
		this.m_data.set(dst.m_data);
	}
    createSelfUniformData(): ShaderUniformData {
        let oum: ShaderUniformData = new ShaderUniformData();
        oum.uniformNameList = ["u_params"];
        oum.dataList = [this.m_data];
        return oum;
    }
}
