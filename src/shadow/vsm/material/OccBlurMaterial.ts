/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ShaderCodeBuilder2 from "../../../vox/material/code/ShaderCodeBuilder2";
import ShaderCodeBuffer from "../../../vox/material/ShaderCodeBuffer";
import ShaderUniformData from "../../../vox/material/ShaderUniformData";
import ShaderGlobalUniform from "../../../vox/material/ShaderGlobalUniform";
import MaterialBase from "../../../vox/material/MaterialBase";
import RendererDeviece from "../../../vox/render/RendererDeviece";

class OccBlurShaderBuffer extends ShaderCodeBuffer
{
    constructor()
    {
        super();
    }
    private static ___s_instance:OccBlurShaderBuffer = null;
    private m_codeBuilder:ShaderCodeBuilder2 = new ShaderCodeBuilder2();
    private m_uniqueName:string = "";
    private m_hasTex:boolean = false;
    horizonal: boolean = true;
    initialize(texEnabled:boolean):void
    {
        console.log("OccBlurShaderBuffer::initialize()... texEnabled: "+texEnabled);
        this.m_uniqueName = "OccBlurShd";
        this.m_hasTex = texEnabled;
        if(texEnabled)
        {
            this.m_uniqueName += "_tex";
        }
    }
    private buildThisCode():void
    {

        let coder:ShaderCodeBuilder2 = this.m_codeBuilder;
        coder.reset();
        if(this.horizonal) {
            coder.addDefine("HORIZONAL_PASS");
        }
        
        coder.addDefine("SAMPLE_RATE", "0.25");
        coder.addDefine("HALF_SAMPLE_RATE", "0.125");

        //SAMPLE_RATE
        coder.addVertLayout("vec3","a_vs");
        coder.addVertLayout("vec2","a_uvs");
        
        coder.addVarying("vec2", "v_uv");
        coder.addTextureSample2D();

        coder.addFragOutput("vec4", "FragColor0");
        coder.addFragUniform("vec4","u_viewParam");
        coder.addFragUniform("vec4","u_param");
        coder.addFragMainCode(
`
const float PackUpscale = 256. / 255.; // fraction -> 0..1 (including 1)
const float UnpackDownscale = 255. / 256.; // 0..1 -> fraction (excluding 1)

const vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256., 256. );
const vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );

const float ShiftRight8 = 1. / 256.;

vec4 packDepthToRGBA( const in float v ) {
	vec4 r = vec4( fract( v * PackFactors ), v );
	r.yzw -= r.xyz * ShiftRight8; // tidy overflow
	return r * PackUpscale;
}

float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors );
}

vec4 pack2HalfToRGBA( vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ));
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w);
}
vec2 unpackRGBATo2Half( vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
void main() {

	float mean = 0.0;
	float squared_mean = 0.0;
    
    vec2 resolution = u_viewParam.zw;
    
    float radius = u_param[3];
	// This seems totally useless but it's a crazy work around for a Adreno compiler bug
	float depth = unpackRGBAToDepth( texture( u_sampler0, ( gl_FragCoord.xy ) / resolution ) );

	for ( float i = -1.0; i < 1.0 ; i += SAMPLE_RATE) {

		#ifdef HORIZONAL_PASS

			vec2 distribution = unpackRGBATo2Half( texture( u_sampler0, ( gl_FragCoord.xy + vec2( i, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;

		#else

			float depth = unpackRGBAToDepth( texture( u_sampler0, ( gl_FragCoord.xy + vec2( 0.0, i ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;

		#endif

	}

	mean = mean * HALF_SAMPLE_RATE;
	squared_mean = squared_mean * HALF_SAMPLE_RATE;

	float std_dev = sqrt( squared_mean - mean * mean );

	FragColor0 = pack2HalfToRGBA( vec2( mean, std_dev ) );

}
`
        );
        coder.addVertMainCode(
`
void main() {
    gl_Position =  vec4(a_vs,1.0);
    //v_uv = a_uvs;
}
`
        );
    }
    getFragShaderCode():string
    {
        this.buildThisCode();
        return this.m_codeBuilder.buildFragCode();
    }
    getVtxShaderCode():string
    {
        return this.m_codeBuilder.buildVertCode();
    }
    getUniqueShaderName()
    {
        //console.log("H ########################### this.m_uniqueName: "+this.m_uniqueName);
        return this.m_uniqueName + (this.horizonal?"_h":"_v");
    }
    toString():string
    {
        return "[OccBlurShaderBuffer()]";
    }

    static GetInstance():OccBlurShaderBuffer
    {
        if(OccBlurShaderBuffer.___s_instance != null)
        {
            return OccBlurShaderBuffer.___s_instance;
        }
        OccBlurShaderBuffer.___s_instance = new OccBlurShaderBuffer();
        return OccBlurShaderBuffer.___s_instance;
    }
}

export default class OccBlurMaterial extends MaterialBase
{
    private m_horizonal: boolean = true;
    constructor(horizonal: boolean)
    {
        super();
        this.m_horizonal = horizonal;
    }
    
    getCodeBuf():ShaderCodeBuffer
    {
        let buf: OccBlurShaderBuffer = OccBlurShaderBuffer.GetInstance();
        buf.horizonal = this.m_horizonal;
        return buf;
    }
    private m_param:Float32Array = new Float32Array([1.0,1.0,1.0, 4.0]);
    setShadowRadius(radius: number):void
    {
        this.m_param[3] = radius;
    }
    createSharedUniform():ShaderGlobalUniform
    {
        return null;
    }
    createSelfUniformData():ShaderUniformData
    {
        let oum:ShaderUniformData = new ShaderUniformData();
        oum.uniformNameList = ["u_param"];
        oum.dataList = [this.m_param];
        return oum;
    }
}