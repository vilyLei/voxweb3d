/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import { ShaderCodeUUID } from "../../../vox/material/ShaderCodeUUID";
import IShaderCodeObject from "../../../vox/material/IShaderCodeObject";
import ShaderUniformData from "../../../vox/material/ShaderUniformData";
import IShaderCodeBuilder from "../../../vox/material/code/IShaderCodeBuilder";
import IRenderTexture from "../../../vox/render/texture/IRenderTexture";
import { IMaterialDecorator } from "../../../vox/material/IMaterialDecorator";
import { ShaderTextureBuilder } from "../../../vox/material/ShaderTextureBuilder";

class OccBlurDecorator implements IMaterialDecorator {

    private m_uniqueName: string;
    private m_horizonal: boolean = true;
    private m_paramData: Float32Array = new Float32Array([1.0, 1.0, 1.0, 4.0]);
    /**
     * the  default  value is false
     */
    vertColorEnabled: boolean = false;
    /**
     * the  default  value is false
     */
    premultiplyAlpha: boolean = false;
    /**
     * the  default  value is false
     */
    shadowReceiveEnabled: boolean = false;
    /**
     * the  default  value is false
     */
    lightEnabled: boolean = false;
    /**
     * the  default  value is false
     */
    fogEnabled: boolean = false;
    /**
     * the  default  value is false
     */
    envAmbientLightEnabled: boolean = false;
    /**
     * the  default  value is false
     */
    brightnessOverlayEnabeld: boolean = false;
    /**
     * the default value is true
     */
    glossinessEnabeld: boolean = false;

    private m_depthMap: IRenderTexture = null;
    
    constructor(horizonal: boolean, tex: IRenderTexture, radius: number) {
        
        this.m_horizonal = horizonal;
        this.m_uniqueName = "OccBlur";
        this.m_uniqueName += horizonal? "H" : "V";

        this.m_depthMap = tex;
        this.m_paramData[3] = radius;
    }

    setShadowRadius(radius: number): void {
        this.m_paramData[3] = radius;
    }
    buildBufParams(): void {
        
    }
    createTextureList(builder: ShaderTextureBuilder): void {
        
        builder.add2DMap(this.m_depthMap,"",false);
    }
    buildShader(coder: IShaderCodeBuilder): void {
        
        if (this.m_horizonal) {
            coder.addDefine("HORIZONAL_PASS", "1");
        }

        coder.addDefine("SAMPLE_RATE", "0.25");
        coder.addDefine("HALF_SAMPLE_RATE", "0.125");

        // coder.addTextureSample2D("", false, true, false);
        coder.uniform.useViewPort(false, true);
        coder.addFragUniform("vec4", "u_params", 0);
        coder.useVertSpaceMats(false, false, false);
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
    
    float radius = u_params[3];
    vec4 c4 = VOX_Texture2D( u_sampler0, ( gl_FragCoord.xy ) / resolution );    
    // This seems totally useless but it's a crazy work around for a Adreno compiler bug
    float depth = unpackRGBAToDepth( c4 );

    for ( float i = -1.0; i < 1.0 ; i += SAMPLE_RATE) {

        #ifdef HORIZONAL_PASS

            vec2 distribution = unpackRGBATo2Half( VOX_Texture2D( u_sampler0, ( gl_FragCoord.xy + vec2( i, 0.0 ) * radius ) / resolution ) );
            mean += distribution.x;
            squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;

        #else

            float depth = unpackRGBAToDepth( VOX_Texture2D( u_sampler0, ( gl_FragCoord.xy + vec2( 0.0, i ) * radius ) / resolution ) );
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
}
`
        );
    }
    createUniformData(): ShaderUniformData {
        let oum: ShaderUniformData = new ShaderUniformData();
        oum.uniformNameList = ["u_params"];
        oum.dataList = [this.m_paramData];
        return oum;
    }
    getShaderCodeObjectUUID(): ShaderCodeUUID {
        return ShaderCodeUUID.None;
    }
    getShaderCodeObject(): IShaderCodeObject {
        return null;
    }
    getUniqueName(): string {
        return this.m_uniqueName;
    }

}
export { OccBlurDecorator };