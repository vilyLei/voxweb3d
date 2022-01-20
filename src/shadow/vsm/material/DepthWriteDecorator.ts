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
import { ISimpleMaterialDecorator } from "../../../vox/material/ISimpleMaterialDecorator";
import { ShaderTextureBuilder } from "../../../vox/material/ShaderTextureBuilder";

class DepthWriteDecorator implements ISimpleMaterialDecorator {

    private m_uniqueName: string;
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
    fogEnabled: boolean = false;
    
    constructor() {
        
        this.m_uniqueName = "DepthWrite";
    }

    buildBufParams(): void {
    }
    buildTextureList(builder: ShaderTextureBuilder): void {        
    }
    buildShader(coder: IShaderCodeBuilder): void {
        
        coder.addVarying("vec4", "v_pos");
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
void main() {
    // Higher precision equivalent of the gl_FragCoord.z. This assumes depthRange has been left to its default values.
    float fragCoordZ = 0.5 * v_pos[2] / v_pos[3] + 0.5;
    FragColor0 = packDepthToRGBA( fragCoordZ );
}
`
        );
        coder.addVertMainCode(
`
void main() {
    worldPosition = u_objMat * vec4(a_vs, 1.0);
    viewPosition = u_viewMat * worldPosition;
    gl_Position =  u_projMat * viewPosition;
    v_pos = gl_Position;
}
`
        );
    }
    createUniformData(): ShaderUniformData {
        return null;
    }
    getUniqueName(): string {
        return this.m_uniqueName;
    }

}
export { DepthWriteDecorator };