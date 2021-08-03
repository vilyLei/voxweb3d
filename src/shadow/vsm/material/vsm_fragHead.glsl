
vec4 pack2HalfToRGBA( vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ));
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w);
}
vec2 unpackRGBATo2Half( vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}

vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {

    return unpackRGBATo2Half( VOX_Texture2D( shadow, uv ) );

}
float VSMShadow (sampler2D shadow, vec2 uv, float compare ) {

    float occlusion = 1.0;

    vec2 distribution = texture2DDistribution( shadow, uv );

    float hard_shadow = step( compare , distribution.x ); // Hard Shadow

    if (hard_shadow != 1.0 ) {

        float distance = compare - distribution.x ;
        float variance = max( 0.0, distribution.y * distribution.y );
        float softness_probability = variance / (variance + distance * distance ); // Chebeyshevs inequality
        softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 ); // 0.3 reduces light bleed
        occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );

    }
    return occlusion;

}
float getVSMShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord ) {

    float shadow = 1.0;
    
    shadowCoord.xyz /= shadowCoord.w;
    shadowCoord.z += shadowBias;
    
    // if ( something && something ) breaks ATI OpenGL shader compiler
    // if ( all( something, something ) ) using this instead

    bvec4 inFrustumVec = bvec4 ( shadowCoord.x >= 0.0, shadowCoord.x <= 1.0, shadowCoord.y >= 0.0, shadowCoord.y <= 1.0 );
    bool inFrustum = all( inFrustumVec );

    bvec2 frustumTestVec = bvec2( inFrustum, shadowCoord.z <= 1.0 );

    bool frustumTest = all( frustumTestVec );

    if ( frustumTest ) {
        shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
    }
    return shadow;
}
float getVSMShadowFactor(vec4 shadowPos) {
    
    float shadow = getVSMShadow( VOX_VSM_MAP, u_vsmParams[1].xy, u_vsmParams[0].x, u_vsmParams[0].z, shadowPos );
    float shadowIntensity = 1.0 - u_vsmParams[0].w;
    shadow = clamp(shadow, 0.0, 1.0) * (1.0 - shadowIntensity) + shadowIntensity;
    float f = clamp(dot(v_nv,u_vsmParams[2].xyz),0.0,1.0);
    shadow = f > 0.0001 ? min(shadow,clamp(f, shadowIntensity,1.0)) : shadowIntensity;
    f = u_vsmParams[1].z;
    return shadow * (1.0 - f) + f;
}