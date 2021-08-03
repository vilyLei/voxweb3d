/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import RendererDeviece from "../../vox/render/RendererDeviece";
import ShaderCodeBuffer from "../../vox/material/ShaderCodeBuffer";
import ShaderUniformData from "../../vox/material/ShaderUniformData";
import MaterialBase from "../../vox/material/MaterialBase";
export class PeelColorShaderBuffer extends ShaderCodeBuffer
{
constructor()
{
    super();
}
private static s_instance:PeelColorShaderBuffer = new PeelColorShaderBuffer();
private m_uniqueName:string = "";
initialize(texEnabled:boolean):void
{
    //console.log("PeelColorShaderBuffer::initialize()...");
    this.m_uniqueName = "PeelColorShd";
}
getFragShaderCode():string
{
    let fragCode:string = 
`
precision mediump float;
uniform sampler2D u_sampler0;
uniform sampler2D u_sampler1;
uniform vec4 u_cameraParam;
uniform vec4 u_colors[2];
varying vec2 v_uvs;

const float PackUpscale = 256. / 255.; // fraction -> 0..1 (including 1)
const float UnpackDownscale = 255. / 256.; // 0..1 -> fraction (excluding 1)
const vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256., 256. );
const vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );

float unpackRGBAToDepth( const in vec4 v ) {
return dot( v, UnpackFactors );
}

float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
return ( viewZ + near ) / ( near - far );
}
float perspectiveDepthToViewZ( const in float invClipZ, const in float near, const in float far ) {
return ( near * far ) / ( ( far - near ) * invClipZ - far );
}
float readDepth( sampler2D depthSampler, vec2 coord,float cameraNear, float cameraFar ) {
float fragCoordZ = texture2D( depthSampler, coord ).x;
float viewZ = perspectiveDepthToViewZ( fragCoordZ, cameraNear, cameraFar );
return viewZToOrthographicDepth( viewZ, cameraNear, cameraFar );
}
float readDepth2( float fragCoordZ,float cameraNear, float cameraFar ) {
float viewZ = perspectiveDepthToViewZ( fragCoordZ, cameraNear, cameraFar );
return viewZToOrthographicDepth( viewZ, cameraNear, cameraFar );
}
void main()
{
vec4 color4 = texture2D(u_sampler0, v_uvs);
color4 *= u_colors[0];

vec4 param = u_colors[1];
if(param.z > 0.5)
{
param.xy = vec2(gl_FragCoord.x/param.x,gl_FragCoord.y/param.y);
float depth = texture2D(u_sampler1,param.xy).x + 0.00001;

float depthZ = gl_FragCoord.z;
if((depthZ) <= depth)
{
discard;
}
}
gl_FragColor = color4;
}
`;
    return fragCode;
}
getVtxShaderCode():string
{
    let vtxCode:string = 
`
precision mediump float;
attribute vec3 a_vs;
attribute vec2 a_uvs;
uniform mat4 u_objMat;
uniform mat4 u_viewMat;
uniform mat4 u_projMat;
varying vec2 v_uvs;
void main(){
mat4 viewMat4 = u_viewMat * u_objMat;
vec4 viewPos = viewMat4 * vec4(a_vs, 1.0);
gl_Position = u_projMat * viewPos;
v_uvs = a_uvs;
}
`;
    return vtxCode;
}
getUniqueShaderName(): string
{
    //console.log("H ########################### this.m_uniqueName: "+this.m_uniqueName);
    return this.m_uniqueName;
}
toString():string
{
    return "[PeelColorShaderBuffer()]";
}

static GetInstance():PeelColorShaderBuffer
{
    return PeelColorShaderBuffer.s_instance;
}
}

export default class PeelColorMaterial extends MaterialBase
{
constructor()
{
    super();
}

getCodeBuf():ShaderCodeBuffer
{        
    return PeelColorShaderBuffer.GetInstance();
}
private m_colorArray:Float32Array = new Float32Array([1.0,1.0,1.0,1.0, 800.0,600.0,0.0,0.0]);
setStageSize(pw:number,ph:number):void
{
    this.m_colorArray[4] = pw;
    this.m_colorArray[5] = ph;
}
setPeelEanbled(boo:boolean):void
{
    this.m_colorArray[6] = boo?1.0:0.0;
}
createSelfUniformData():ShaderUniformData
{
    let oum:ShaderUniformData = new ShaderUniformData();
    oum.uniformNameList = ["u_colors"];
    oum.dataList = [this.m_colorArray];
    return oum;
}
}