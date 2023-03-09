/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ShaderCodeBuffer from "../../../vox/material/ShaderCodeBuffer";
import ShaderUniformData from "../../../vox/material/ShaderUniformData";
import Color4 from "../../../vox/material/Color4";
import MaterialBase from "../../../vox/material/MaterialBase";

class FogSphShow2ShaderBuffer extends ShaderCodeBuffer {
    constructor() {
        super();
    }
    private static s_instance: FogSphShow2ShaderBuffer = new FogSphShow2ShaderBuffer();
    private m_uniqueName: string = "";
    initialize(texEnabled: boolean): void {
        //console.log("FogSphShow2ShaderBuffer::initialize()...");
        this.m_uniqueName = "FogSphShow2Shd";
    }
    getFragShaderCode(): string {
        let fragCode =
            `#version 300 es
precision mediump float;
uniform sampler2D u_sampler0;
uniform sampler2D u_sampler1;
uniform sampler2D u_sampler2;
uniform vec4 u_color;
in vec2 v_texUV;

const float PI = 3.14159265359;
// expects values in the range of [0,1]x[0,1], returns values in the [0,1] range.
// do not collapse into a single function per: http://byteblacksmith.com/improvements-to-the-canonical-one-liner-glsl-rand-for-opengl-es-2-0/
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract(sin(sn) * c);
}
// based on https://www.shadertoy.com/view/MslGR8
vec3 dithering( vec3 color ) {
    //Calculate grid position
    float grid_position = rand( gl_FragCoord.xy );

    //Shift the individual colors differently, thus making it even harder to see the dithering pattern
    vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );

    //modify shift acording to grid position.
    dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );

    //shift the color by dither_shift
    return color + dither_shift_RGB;
}
layout(location = 0) out vec4 OutputColor;
void main()
{
    vec4 color4 = texture(u_sampler0, v_texUV);
    vec4 factor4 = texture(u_sampler1, v_texUV);
    vec4 fogColor4 = u_color;
    fogColor4.xyz = texture(u_sampler2, v_texUV).xyz;
    //OutputColor = vec4(fogColor4.xyz * factor4.xyz + (1.0 - factor4.xyz) * color4.xyz, 1.0);
    
    // current fog effect
    vec3 fogColor = fogColor4.xyz * factor4.x + (1.0 - factor4.x) * color4.xyz;
    OutputColor = vec4(fogColor.xyz, 1.0);

    //OutputColor = vec4((1.0 - factor4.xxx) * fogColor4.xyz + color4.xyz * factor4.xxx, 1.0);
    // light fog effect
    // OutputColor = vec4(fogColor4.xyz * factor4.xxx * 0.6 + color4.xyz, 1.0);
    // otrher test
    // OutputColor = vec4(factor4.xyz, 1.0);
    // OutputColor = vec4(color4.xyz, 1.0);
}
`;
        return fragCode;
    }
    getVertShaderCode(): string {
        let vtxCode =
            `#version 300 es
precision mediump float;
layout(location = 0) in vec3 a_vs;
layout(location = 1) in vec2 a_uvs;
uniform mat4 u_objMat;
out vec2 v_texUV;
void main()
{
    gl_Position = u_objMat * vec4(a_vs,1.0);
    v_texUV = vec2(a_uvs.x,a_uvs.y);
}
`;
        return vtxCode;
    }
    getUniqueShaderName(): string {
        //console.log("H ########################### this.m_uniqueName: "+this.m_uniqueName);
        return this.m_uniqueName;
    }
    static GetInstance(): FogSphShow2ShaderBuffer {
        return FogSphShow2ShaderBuffer.s_instance;
    }
}

export class FogSphShow2Material extends MaterialBase {
    constructor() {
        super();
    }

    getCodeBuf(): ShaderCodeBuffer {
        return FogSphShow2ShaderBuffer.GetInstance();
    }
    setRGBColor(pcolor: Color4): void {
        this.m_colorArray[0] = pcolor.r;
        this.m_colorArray[1] = pcolor.g;
        this.m_colorArray[2] = pcolor.b;
    }
    setRGB3f(pr: number, pg: number, pb: number): void {
        this.m_colorArray[0] = pr;
        this.m_colorArray[1] = pg;
        this.m_colorArray[2] = pb;
    }
    private m_colorArray: Float32Array = new Float32Array([1.0, 1.0, 1.0, 1.0]);

    createSelfUniformData(): ShaderUniformData {
        let oum: ShaderUniformData = new ShaderUniformData();
        oum.uniformNameList = ["u_color"];
        oum.dataList = [this.m_colorArray];
        return oum;
    }
}