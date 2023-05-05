/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ShaderCodeBuffer from "../../../vox/material/ShaderCodeBuffer";
import MaterialBase from "../../../vox/material/MaterialBase";

class DepthShaderBuffer extends ShaderCodeBuffer {
    
    private static s_instance: DepthShaderBuffer = new DepthShaderBuffer();
    private m_uniqueName: string = "";

    constructor() {
        super();
    }
    initialize(texEnabled: boolean): void {

        super.initialize(texEnabled);
        //console.log("DepthShaderBuffer::initialize()...,texEnabled: "+texEnabled);
        this.m_uniqueName = "DepthShd";
        this.adaptationShaderVersion = false;
    }
    private buildThisCode(): void {

        let coder = this.m_coder;
        coder.addVarying("vec4", "v_pos");
        coder.addFragFunction(
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
`
        );
    }
    getFragShaderCode(): string {
        this.buildThisCode();

        this.m_coder.addFragMainCode(
            `
void main() {
    // Higher precision equivalent of gl_FragCoord.z. This assumes depthRange has been left to its default values.
    float fragCoordZ = 0.5 * v_pos[2] / v_pos[3] + 0.5;
    FragColor0 = packDepthToRGBA( fragCoordZ );
}
`
        );

        return this.m_coder.buildFragCode();
    }
    getVertShaderCode(): string {

        this.m_coder.addVertMainCode(
            `
void main() {
    vec4 wpos = u_objMat * vec4(a_vs, 1.0);
    vec4 viewPos = u_viewMat * wpos;
    gl_Position =  u_projMat * viewPos;
    v_pos = gl_Position;
}
`
        );
        return this.m_coder.buildVertCode();

    }
    getUniqueShaderName(): string {
        return this.m_uniqueName;
    }
    static GetInstance(): DepthShaderBuffer {
        return DepthShaderBuffer.s_instance;
    }
}

export default class DepthMaterial extends MaterialBase {
    getCodeBuf(): ShaderCodeBuffer {
        return DepthShaderBuffer.GetInstance();
    }
}