/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ShaderCodeBuffer from "../../vox/material/ShaderCodeBuffer";
import ShaderUniformData from "../../vox/material/ShaderUniformData";
import MaterialBase from "../../vox/material/MaterialBase";

class DepRTTShowShaderBuffer extends ShaderCodeBuffer {
	constructor() {
		super();
	}
	private static s_instance: DepRTTShowShaderBuffer = null;
	private m_uniqueName: string = "";
	private m_hasTex: boolean = false;
	initialize(texEnabled: boolean): void {
		//console.log("DepRTTShowShaderBuffer::initialize()... texEnabled: "+texEnabled);
		this.m_uniqueName = "DepRTTShowShd";
		this.m_hasTex = texEnabled;
		if (texEnabled) {
			this.m_uniqueName += "_tex";
		}
	}
	getFragShaderCode(): string {
		let fragCode = `
precision mediump float;
uniform sampler2D u_sampler0;
uniform highp sampler2D u_sampler1;
varying vec2 v_texUV;
uniform vec4 u_colors[2];
uniform vec4 u_frustumParam;
uniform vec4 u_stageParam;

float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
    return ( viewZ + near ) / ( near - far );
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
    return (( near + viewZ ) * far ) / (( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float invClipZ, const in float near, const in float far ) {
    return ( near * far ) / ( ( far - near ) * invClipZ - far );
}
float calcDepth( sampler2D depthSampler, vec2 coord,float cameraNear, float cameraFar ) {
    float fragCoordZ = texture2D( depthSampler, coord ).x;
    float viewZ = perspectiveDepthToViewZ( fragCoordZ, cameraNear, cameraFar );
    return viewZToOrthographicDepth( viewZ, cameraNear, cameraFar );
}
void main()
{
    vec2 sv2 = gl_FragCoord.xy / u_stageParam.zw;
    vec4 color4 = texture2D(u_sampler0, sv2);
    color4.xyz *= u_colors[0].xyz;
    float depth = calcDepth( u_sampler1, sv2, u_frustumParam.x,u_frustumParam.y);
    color4.xyz = color4.xyz * 0.001 + vec3(1.0 - depth);
    gl_FragColor = color4;
}
`;
		return fragCode;
	}
	getVertShaderCode(): string {
		let vtxCode: string = `
precision mediump float;
attribute vec3 a_vs;
attribute vec2 a_uvs;
varying vec2 v_texUV;
void main()
{
    gl_Position = vec4(a_vs,1.0);
    v_texUV = a_uvs;
}
`;
		return vtxCode;
	}
	getUniqueShaderName(): string {
		return this.m_uniqueName;
	}
	static GetInstance(): DepRTTShowShaderBuffer {
		if (DepRTTShowShaderBuffer.s_instance != null) {
			return DepRTTShowShaderBuffer.s_instance;
		}
		DepRTTShowShaderBuffer.s_instance = new DepRTTShowShaderBuffer();
		return DepRTTShowShaderBuffer.s_instance;
	}
}

export default class DepRTTShowMaterial extends MaterialBase {
	private m_colorArray: Float32Array = new Float32Array([1.0, 0.0, 1.0, 1.0, 0.0, 0.0, 0.0, 60.0]);
	constructor() {
		super();
	}

	getCodeBuf(): ShaderCodeBuffer {
		return DepRTTShowShaderBuffer.GetInstance();
	}
	setRaius(pr: number): void {
		this.m_colorArray[7] = pr;
	}
	setAlpha(pr: number): void {
		this.m_colorArray[3] = pr;
	}
	setRGB3f(pr: number, pg: number, pb: number): void {
		this.m_colorArray[0] = pr;
		this.m_colorArray[1] = pg;
		this.m_colorArray[2] = pb;
	}
	setRGBA4f(pr: number, pg: number, pb: number, pa: number): void {
		this.m_colorArray[0] = pr;
		this.m_colorArray[1] = pg;
		this.m_colorArray[2] = pb;
		this.m_colorArray[3] = pa;
	}
	createSelfUniformData(): ShaderUniformData {
		if (this.getTextureList() == null) {
			return null;
		}
		let oum: ShaderUniformData = new ShaderUniformData();
		oum.uniformNameList = [ "u_colors" ];
		oum.dataList = [this.m_colorArray];
		return oum;
	}
}
