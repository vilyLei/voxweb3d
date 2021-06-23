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
import Vector3D from "../../vox/math/Vector3D";

class TextureCubeUVShaderBuffer extends ShaderCodeBuffer {
    constructor() {
        super();
    }
    private static ___s_instance: TextureCubeUVShaderBuffer = new TextureCubeUVShaderBuffer();
    private m_uniqueName: string = "";
    initialize(texEnabled: boolean): void {
        //console.log("TextureCubeUVShaderBuffer::initialize()...");
        this.m_uniqueName = "TextureCubeUVShd";
    }
    getFragShaderCode(): string {
        let fragCode: string =
`#version 300 es
precision highp float;

uniform sampler2D u_sampler0;

#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6

out vec4 FragColor;

in vec2 v_texUV;
in vec3 v_worldPos;
in vec3 v_normal;
in vec3 v_camPos;

vec4 LinearToLinear( in vec4 value ) {
	return value;
}

vec4 GammaToLinear( in vec4 value, in float gammaFactor ) {
	return vec4( pow( value.rgb, vec3( gammaFactor ) ), value.a );
}

vec4 LinearToGamma( in vec4 value, in float gammaFactor ) {
	return vec4( pow( value.rgb, vec3( 1.0 / gammaFactor ) ), value.a );
}

vec4 sRGBToLinear( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}

vec4 LinearTosRGB( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}

vec4 envMapTexelToLinear( vec4 value ) { return sRGBToLinear( value ); }
vec4 linearToOutputTexel( vec4 value ) { return LinearTosRGB( value ); }


// These shader functions convert between the UV coordinates of a single face of
// a cubemap, the 0-5 integer index of a cube face, and the direction vector for
// sampling a textureCube (not generally normalized ).

float getFace( vec3 direction ) {

    vec3 absDirection = abs( direction );

    float face = - 1.0;

    if ( absDirection.x > absDirection.z ) {

        if ( absDirection.x > absDirection.y )

            face = direction.x > 0.0 ? 0.0 : 3.0;

        else

            face = direction.y > 0.0 ? 1.0 : 4.0;

    } else {

        if ( absDirection.z > absDirection.y )

            face = direction.z > 0.0 ? 2.0 : 5.0;

        else

            face = direction.y > 0.0 ? 1.0 : 4.0;

    }

    return face;

}

// RH coordinate system; PMREM face-indexing convention
vec2 getUV( vec3 direction, float face ) {

    vec2 uv;

    if ( face == 0.0 ) {

        uv = vec2( direction.z, direction.y ) / abs( direction.x ); // pos x

    } else if ( face == 1.0 ) {

        uv = vec2( - direction.x, - direction.z ) / abs( direction.y ); // pos y

    } else if ( face == 2.0 ) {

        uv = vec2( - direction.x, direction.y ) / abs( direction.z ); // pos z

    } else if ( face == 3.0 ) {

        uv = vec2( - direction.z, direction.y ) / abs( direction.x ); // neg x

    } else if ( face == 4.0 ) {

        uv = vec2( - direction.x, direction.z ) / abs( direction.y ); // neg y

    } else {

        uv = vec2( direction.x, direction.y ) / abs( direction.z ); // neg z

    }

    return 0.5 * ( uv + 1.0 );

}

//#ifdef ENVMAP_TYPE_CUBE_UV

#define cubeUV_maxMipLevel 8.0
#define cubeUV_minMipLevel 4.0
#define cubeUV_maxTileSize 256.0
#define cubeUV_minTileSize 16.0

vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {

    float face = getFace( direction );

    float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );

    mipInt = max( mipInt, cubeUV_minMipLevel );

    float faceSize = exp2( mipInt );

    float texelSize = 1.0 / ( 3.0 * cubeUV_maxTileSize );

    vec2 uv = getUV( direction, face ) * ( faceSize - 1.0 );

    vec2 f = fract( uv );

    uv += 0.5 - f;

    if ( face > 2.0 ) {

        uv.y += faceSize;

        face -= 3.0;

    }

    uv.x += face * faceSize;

    if ( mipInt < cubeUV_maxMipLevel ) {

        uv.y += 2.0 * cubeUV_maxTileSize;

    }

    uv.y += filterInt * 2.0 * cubeUV_minTileSize;

    uv.x += 3.0 * max( 0.0, cubeUV_maxTileSize - 2.0 * faceSize );

    uv *= texelSize;

    vec3 tl = envMapTexelToLinear( texture( envMap, uv ) ).rgb;

    uv.x += texelSize;

    vec3 tr = envMapTexelToLinear( texture( envMap, uv ) ).rgb;

    uv.y += texelSize;

    vec3 br = envMapTexelToLinear( texture( envMap, uv ) ).rgb;

    uv.x -= texelSize;

    vec3 bl = envMapTexelToLinear( texture( envMap, uv ) ).rgb;

    vec3 tm = mix( tl, tr, f.x );

    vec3 bm = mix( bl, br, f.x );

    return mix( tm, bm, f.y );

}
// These defines must match with PMREMGenerator

#define r0 1.0
#define v0 0.339
#define m0 - 2.0
#define r1 0.8
#define v1 0.276
#define m1 - 1.0
#define r4 0.4
#define v4 0.046
#define m4 2.0
#define r5 0.305
#define v5 0.016
#define m5 3.0
#define r6 0.21
#define v6 0.0038
#define m6 4.0

float roughnessToMip( float roughness ) {

    float mip = 0.0;

    if ( roughness >= r1 ) {

        mip = ( r0 - roughness ) * ( m1 - m0 ) / ( r0 - r1 ) + m0;

    } else if ( roughness >= r4 ) {

        mip = ( r1 - roughness ) * ( m4 - m1 ) / ( r1 - r4 ) + m1;

    } else if ( roughness >= r5 ) {

        mip = ( r4 - roughness ) * ( m5 - m4 ) / ( r4 - r5 ) + m4;

    } else if ( roughness >= r6 ) {

        mip = ( r5 - roughness ) * ( m6 - m5 ) / ( r5 - r6 ) + m5;

    } else {

        mip = - 2.0 * log2( 1.16 * roughness ); // 1.16 = 1.79^0.25
    }

    return mip;

}
vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {

    float mip = clamp( roughnessToMip( roughness ), m0, cubeUV_maxMipLevel );

    float mipF = fract( mip );

    float mipInt = floor( mip );

    vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );

    if ( mipF == 0.0 ) {

        return vec4( color0, 1.0 );

    } else {

        vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );

        return vec4( mix( color0, color1, mipF ), 1.0 );

    }

}

// ----------------------------------------------------------------------------
void main()
{
    float envMapIntensity = 0.8;
    vec3 color = vec3(0.0);
    vec3 worldNormal = v_normal;
    vec4 envMapColor = textureCubeUV( u_sampler0, worldNormal, 1.0 );
    color += PI * envMapColor.xyz * envMapIntensity;
    FragColor = vec4(color, 1.0);
}
`;
        return fragCode;
    }
    getVtxShaderCode(): string {
        let vtxCode: string =
`#version 300 es
precision highp float;

layout(location = 0) in vec3 a_vs;
layout(location = 1) in vec2 a_uvs;
layout(location = 2) in vec3 a_nvs;

uniform mat4 u_objMat;
uniform mat4 u_viewMat;
uniform mat4 u_projMat;

out vec2 v_texUV;
out vec3 v_worldPos;
out vec3 v_normal;

void main(){

    vec4 wPos = u_objMat * vec4(a_vs, 1.0);
    vec4 viewPos = u_viewMat * wPos;
    gl_Position = u_projMat * viewPos;

    v_worldPos = wPos.xyz;
    v_texUV = a_uvs;
    v_normal = normalize(a_nvs * inverse(mat3(u_objMat)));;
}
`;
        return vtxCode;
    }
    getUniqueShaderName() {
        //console.log("H ########################### this.m_uniqueName: "+this.m_uniqueName);
        return this.m_uniqueName;
    }
    toString(): string {
        return "[TextureCubeUVShaderBuffer()]";
    }

    static GetInstance(): TextureCubeUVShaderBuffer {
        return TextureCubeUVShaderBuffer.___s_instance;
    }
}

export default class TextureCubeUVMaterial extends MaterialBase {
    constructor() {
        super();
    }

    getCodeBuf(): ShaderCodeBuffer {
        return TextureCubeUVShaderBuffer.GetInstance();
    }

    private m_albedo: Float32Array = new Float32Array([0.5, 0.0, 0.0, 0.0]);
    private m_params: Float32Array = new Float32Array([0.0, 0.0, 1.0, 0.0]);
    private m_F0: Float32Array = new Float32Array([0.0, 0.0, 0.0, 0.0]);
    private m_camPos: Float32Array = new Float32Array([500.0, 500.0, 500.0, 1.0]);
    private m_lightPositions: Float32Array = new Float32Array(4 * 4);
    private u_lightColors: Float32Array = new Float32Array(4 * 4);

    setMetallic(metallic: number): void {

        this.m_params[0] = metallic;
    }
    setRoughness(roughness: number): void {

        roughness = Math.min(Math.max(roughness, 0.05), 1.0);
        this.m_params[1] = roughness;
    }
    setAO(ao: number): void {

        this.m_params[2] = ao;
    }
    setF0(f0x: number, f0y: number, f0z: number): void {

        this.m_F0[0] = f0x;
        this.m_F0[1] = f0y;
        this.m_F0[2] = f0z;
    }
    setPosAt(i: number, px: number, py: number, pz: number): void {

        i *= 4;
        this.m_lightPositions[i] = px;
        this.m_lightPositions[i + 1] = py;
        this.m_lightPositions[i + 2] = pz;
    }
    setColorAt(i: number, pr: number, pg: number, pb: number): void {

        i *= 4;
        this.u_lightColors[i] = pr;
        this.u_lightColors[i + 1] = pg;
        this.u_lightColors[i + 2] = pb;
    }
    setCamPos(pos: Vector3D): void {

        this.m_camPos[0] = pos.x;
        this.m_camPos[1] = pos.y;
        this.m_camPos[2] = pos.z;
    }
    createSelfUniformData(): ShaderUniformData {

        //  console.log("this.m_albedo: ",this.m_albedo);
        console.log("this.m_params: ",this.m_params);
        //  console.log("this.m_camPos: ",this.m_camPos);
        let oum: ShaderUniformData = new ShaderUniformData();
        oum.uniformNameList = ["u_albedo", "u_params", "u_lightPositions", "u_lightColors", "u_camPos", "u_F0"];
        oum.dataList = [this.m_albedo, this.m_params, this.m_lightPositions, this.u_lightColors, this.m_camPos,this.m_F0];
        return oum;
    }
}