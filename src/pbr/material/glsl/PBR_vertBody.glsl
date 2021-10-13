
void main(){
    
    vec4 wpos = u_objMat * vec4(a_vs, 1.0);
    vec4 viewPos = u_viewMat * wpos;
    gl_Position = u_projMat * viewPos;
    
    v_worldPos = wpos.xyz;
    
    #ifndef VOX_VTX_FLAT_NORMAL
        v_worldNormal = normalize(a_nvs * inverse(mat3(u_objMat)));
    
        #ifdef VOX_NORMAL_NOISE
    
            v_worldNormal += (rand(a_nvs)) * 0.1;
    
        #endif
    #endif
    
    #ifdef VOX_USE_2D_MAP

        v_uv.xy = a_uvs.xy * u_paramLocal[1].xy;

    #endif
    
    #ifdef VOX_USE_SHADOW

        calcShadowPos( wpos );

    #endif
    
    #ifdef VOX_USE_FOG

    calcFogDepth( viewPos );

    #endif
}