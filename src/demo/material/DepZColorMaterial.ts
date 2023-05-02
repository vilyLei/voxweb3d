/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import ShaderCodeBuffer from "../../vox/material/ShaderCodeBuffer";
import ShaderUniformData from "../../vox/material/ShaderUniformData";
import ShaderGlobalUniform from "../../vox/material/ShaderGlobalUniform";
import MaterialBase from "../../vox/material/MaterialBase";
import RenderProxy from "../../vox/render/RenderProxy";

class DepZColorShaderBuffer extends ShaderCodeBuffer {
	constructor() {
		super();
	}
	private static s_instance: DepZColorShaderBuffer = null;
	private m_uniqueName: string = "";
	private m_hasTex: boolean = false;
	initialize(texEnabled: boolean): void {
		//console.log("DepZColorShaderBuffer::initialize()... texEnabled: "+texEnabled);
		this.m_uniqueName = "DepZColorShd";
		this.m_hasTex = texEnabled;
		if (texEnabled) {
			this.m_uniqueName += "_tex";
		}
	}
	getFragShaderCode(): string {
		let fragCode: string = `
precision mediump float;
uniform sampler2D u_sampler0;
uniform highp sampler2D u_sampler1;
varying vec2 v_texUV;
uniform vec4 u_colors[2];
uniform vec4 u_stSize;
uniform vec4 u_frustumParam;

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
    vec2 sv2 = vec2(gl_FragCoord.x/u_stSize.x,gl_FragCoord.y/u_stSize.y);
    vec4 color4 = texture2D(u_sampler0, v_texUV * 0.0 + sv2);
    color4.xyz *= u_colors[0].xyz;
    float depth = calcDepth( u_sampler1, sv2, u_frustumParam.x,u_frustumParam.y);
    color4.xyz = color4.xyz * 0.1 + vec3(1.0 - depth);
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
		//console.log("H ########################### this.m_uniqueName: "+this.m_uniqueName);
		return this.m_uniqueName;
	}
	toString(): string {
		return "[DepZColorShaderBuffer()]";
	}

	static GetInstance(): DepZColorShaderBuffer {
		if (DepZColorShaderBuffer.s_instance != null) {
			return DepZColorShaderBuffer.s_instance;
		}
		DepZColorShaderBuffer.s_instance = new DepZColorShaderBuffer();
		return DepZColorShaderBuffer.s_instance;
	}
}

export default class DepZColorMaterial extends MaterialBase {
	constructor() {
		super();
	}

	getCodeBuf(): ShaderCodeBuffer {
		return DepZColorShaderBuffer.GetInstance();
	}
	private m_colorArray: Float32Array = new Float32Array([1.0, 0.0, 1.0, 1.0, 0.0, 0.0, 0.0, 60.0]);
	private m_stSizeArray: Float32Array = new Float32Array([800.0, 600.0, 0.0, 0.0]);
	setStageSize(pw: number, ph: number): void {
		this.m_stSizeArray[0] = pw;
		this.m_stSizeArray[1] = ph;
	}
	setRaius(pr: number): void {
		this.m_colorArray[7] = pr;
	}
	setAlpha(pr: number): void {
		this.m_colorArray[3] = pr;
	}
	setPosXY(px: number, py: number): void {
		this.m_stSizeArray[2] = px;
		this.m_stSizeArray[3] = py;
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
		oum.uniformNameList = ["u_colors", "u_stSize"];
		oum.dataList = [this.m_colorArray, this.m_stSizeArray];
		return oum;
	}
}
