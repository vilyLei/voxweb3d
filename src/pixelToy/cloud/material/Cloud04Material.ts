/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ShaderCodeBuffer from "../../../vox/material/ShaderCodeBuffer";
import ShaderUniformData from "../../../vox/material/ShaderUniformData";
import MaterialBase from "../../../vox/material/MaterialBase";

class Cloud04ShaderBuffer extends ShaderCodeBuffer {
    constructor() {
        super();
    }
    private static s_instance: Cloud04ShaderBuffer = null;
    private m_uniqueName = "";
    private m_hasTex = false;
    mapLodEnabled = false;
	fixScreen = true;
    initialize(texEnabled: boolean): void {
        this.m_uniqueName = "Cloud04Shd";
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

		// thanks: https://www.shadertoy.com/view/Xsc3R4
let codeStr = `

/*

	Cheap Cloud Flythrough
	----------------------

	"Cheap" should probably refer to the quality of the physics in this shader, which is
	virtually non-existent, but it actually refers to the fake cloud algorithm... if you could
	call it that. :)

	This is merely an attempt to give the impression of a cloud flythrough, whilst maintaining
	a reasonably acceptable framerate. The key to that is keeping the distance field as simple
	as possible.

	Due to the amount of cost cutting, it's far from  perfect. However, there's still plenty
	of room for improvement.

    I've used density based accumulation, which in one way or another, uses concepts from many
	volumetric examples, but particularly from the following:

	Cloudy Spikeball - Duke
    https://www.shadertoy.com/view/MljXDw
    // Port from a demo by Las - Worth watching.
    // http://www.pouet.net/topic.php?which=7920&page=29&x=14&y=9

    Other shaders worth looking at:

	Clouds - IQ: One of my favorite shaders, and everyone elses, it seems.
	https://www.shadertoy.com/view/XslGRr

	Sample Pinning - huwb: Fast, and pretty.
	https://www.shadertoy.com/view/XdfXzn

	FakeVolumetricClouds - Kuvkar: Fast, using parallax layers. Really cool.
	https://www.shadertoy.com/view/XlsXzN

    Emission clouds - Duke: Nice, and straight forward.
    https://www.shadertoy.com/view/ltBXDm


*/

// Hash function. This particular one probably doesn't disperse things quite
// as nicely as some of the others around, but it's compact, and seems to work.
//
vec3 hash33(vec3 p){
    float n = sin(dot(p, vec3(7, 157, 113)));
    return fract(vec3(2097152, 262144, 32768)*n);
}


// IQ's texture lookup noise... in obfuscated form. There's less writing, so
// that makes it faster. That's how optimization works, right? :) Seriously,
// though, refer to IQ's original for the proper function.
//
// By the way, you could replace this with the non-textured version, and the
// shader should run at almost the same efficiency.
float pn( in vec3 p ){

    vec3 i = floor(p); p -= i; p *= p*(3. - 2.*p);
	p.xy = VOX_Texture2D(VOX_DIFFUSE_MAP, (p.xy + i.xy + vec2(37, 17)*i.z + .5)/256., -100.).yx;
	return mix(p.x, p.y, p.z);
}



// Basic low quality noise consisting of three layers of rotated, mutated
// trigonometric functions. Needs work, but sufficient for this example.
float trigNoise3D(in vec3 p){


    float res = 0., sum = 0.;

    // IQ's cheap, texture-lookup noise function. Very efficient, but still
    // a little too processor intensive for multiple layer usage in a largish
    // "for loop" setup. Therefore, just one layer is being used here.
    float n = pn(p*8. + iTime*2.);


    // Two sinusoidal layers. I'm pretty sure you could get rid of one of
    // the swizzles (I have a feeling the GPU doesn't like them as much),
    // which I'll try to do later.

    vec3 t = sin(p.yzx*3.14159265 + cos(p.zxy*3.14159265+1.57/2.))*0.5 + 0.5;
    p = p*1.5 + (t - 1.5); //  + iTime*0.1
    res += (dot(t, vec3(0.333)));

    t = sin(p.yzx*3.14159265 + cos(p.zxy*3.14159265+1.57/2.))*0.5 + 0.5;
    res += (dot(t, vec3(0.333)))*0.7071;

	return ((res/1.7071))*0.85 + n*0.15;
}

// Distance function.
float map(vec3 p) {

    return trigNoise3D(p*0.5);

    // Three layers of noise, for comparison.
    //p += iTime;
    //return pn(p*.75)*0.57 + pn(p*1.875)*0.28 + pn(p*4.6875)*0.15;
}



void mainImage( out vec4 fragColor, in vec2 fragCoord )
{

    // Unit direction ray vector: Note the absence of a divide term. I came across
    // this via a comment Shadertoy user "coyote" made. I'm pretty easy to please,
    // but I thought it was pretty cool.
    vec3 rd = normalize(vec3(fragCoord - iResolution.xy*.5, iResolution.y*.75));

    // Ray origin. Moving along the Z-axis.
    vec3 ro = vec3(0, 0, iTime*4.);

    // Cheap camera rotation.
    //
    // 2D rotation matrix. Note the absence of a cos variable. It's there, but in disguise.
    // This one came courtesy of Shadertoy user, "Fabrice Neyret."
    vec2 a = sin(vec2(1.5707963, 0) + iTime*0.1875);
    mat2 rM = mat2(a, -a.y, a.x);
    rd.xy = rd.xy*rM; // Apparently, "rd.xy *= rM" doesn't work on some setups. Crazy.
    rd.xz = rd.xz*rM;

    // Placing a light in front of the viewer and up a little, then rotating it in sync
    // with the camera. I guess a light beam from a flying vehicle would do this.
    vec3 lp = vec3( 0, 1, 4);
    lp.xy = lp.xy*rM;
    lp.xz = lp.xz*rM;
    lp += ro;

    // The ray is effectively marching through discontinuous slices of noise, so at certain
    // angles, you can see the separation. A bit of randomization can mask that, to a degree.
    // At the end of the day, it's not a perfect process. Note, the ray is deliberately left
    // unnormalized... if that's a word.
    //
    // Randomizing the direction.
    rd = (rd + (hash33(rd.zyx)*.006 - .003));
    // Randomizing the length also.
    rd *= (1. + fract(sin(dot(vec3(7, 157, 113), rd.zyx))*43758.5453)*0.06-0.03);

    // Local density, total density, and weighting factor.
    float lDe = 0., td = 0., w = 0.;

    // Closest surface distance, and total ray distance travelled.
    float d = 1., t = 0.;

    // Distance threshold. Higher numbers give thicker clouds, but fill up the screen too much.
    const float h = .5;


    // Initializing the scene color to black, and declaring the surface position vector.
    vec3 col = vec3(0), sp;



    // Particle surface normal.
    //
    // Here's my hacky reasoning. I'd imagine you're going to hit the particle front on, so the normal
    // would just be the opposite of the unit direction ray. However particles are particles, so there'd
    // be some randomness attached... Yeah, I'm not buying it either. :)
    vec3 sn = normalize(hash33(rd.yxz)*.03-rd);

    // Raymarching loop.
    for (int i=0; i<64; i++) {

        // Loop break conditions. Seems to work, but let me
        // know if I've overlooked something.
        if((td>1.) || d<.001*t || t>80.)break;


        sp = ro + rd*t; // Current ray position.
        d = map(sp); // Closest distance to the surface... particle.

        // If we get within a certain distance, "h," of the surface, accumulate some surface values.
        // The "step" function is a branchless way to do an if statement, in case you're wondering.
        //
        // Values further away have less influence on the total. When you accumulate layers, you'll
        // usually need some kind of weighting algorithm based on some identifying factor - in this
        // case, it's distance. This is one of many ways to do it. In fact, you'll see variations on
        // the following lines all over the place.
        //
        lDe = (h - d)*step(d, h);
        w = (1. - td)*lDe;

        // Use the weighting factor to accumulate density. How you do this is up to you.
        td += w*w*8. + 1./64.; //w*w*5. + 1./50.;
        //td += w*.4 + 1./45.; // Looks cleaner, but a little washed out.


        // Point light calculations.
        vec3 ld = lp-sp; // Direction vector from the surface to the light position.
        float lDist = max(length(ld), .001); // Distance from the surface to the light.
        ld/=lDist; // Normalizing the directional light vector.

        // Using the light distance to perform some falloff.
        float atten = 1./(1. + lDist*.125 + lDist*lDist*.05);

        // Ok, these don't entirely correlate with tracing through transparent particles,
        // but they add a little anglular based highlighting in order to fake proper lighting...
        // if that makes any sense. I wouldn't be surprised if the specular term isn't needed,
        // or could be taken outside the loop.
        float diff = max(dot( sn, ld ), 0.);
        float spec = pow(max( dot( reflect(-ld, sn), -rd ), 0. ), 4.);


        // Accumulating the color. Note that I'm only adding a scalar value, in this case,
        // but you can add color combinations. Note the "d*3. - .1" term. It's there as a bit
        // of a fudge to make the clouds a bit more shadowy.
        col += w*(d*3. - .1)*(.5 + diff + spec*.5)*atten;

        // Try this instead, to see what it looks like without the fake contrasting. Obviously,
        // much faster.
        //col += w*atten*1.25;


        // Enforce minimum stepsize. This is probably the most important part of the procedure.
        // It reminds me a little of of the soft shadows routine.
        t +=  max(d*.5, .02); //
        // t += .2; // t += d*.5;// These also work, but don't seem as efficient.

    }

    col = max(col, 0.);

    // trigNoise3D(rd*1.)
	vec3 color = vec3(1.5, 1.0, 1.0);
    col = mix(pow(color*col,  vec3(1.0, 2.0, 8.0)), col,
              dot(cos(rd*6. +sin(rd.yzx*6.)), vec3(.333))*.35 + .65);
    col = mix(col.zyx, col, dot(cos(rd*9. + sin(rd.yzx*9.)), vec3(.333))*.15 + .85);//xzy


    //col = mix(col.zyx, col, dot(rd, vec3(.5))+.5);

    fragColor = vec4(sqrt(max(col, 0.)), 1.0);
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
    static GetInstance(): Cloud04ShaderBuffer {
        if (Cloud04ShaderBuffer.s_instance != null) {
            return Cloud04ShaderBuffer.s_instance;
        }
        Cloud04ShaderBuffer.s_instance = new Cloud04ShaderBuffer();
        return Cloud04ShaderBuffer.s_instance;
    }
}

export default class Cloud04Material extends MaterialBase {
    mapLodEnabled: boolean = false;
	fixScreen = true;
    constructor() {
        super();
    }

    protected buildBuf(): void {
        let buf = Cloud04ShaderBuffer.GetInstance();
		buf.fixScreen = this.fixScreen;
        buf.mapLodEnabled = this.mapLodEnabled;
    }
    getCodeBuf(): ShaderCodeBuffer {
        return  Cloud04ShaderBuffer.GetInstance();
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
	dataCopyFrom(dst: Cloud04Material): void {
		this.m_data.set(dst.m_data);
	}
    createSelfUniformData(): ShaderUniformData {
        let oum: ShaderUniformData = new ShaderUniformData();
        oum.uniformNameList = ["u_params"];
        oum.dataList = [this.m_data];
        return oum;
    }
}
