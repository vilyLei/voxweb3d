
void useFog(inout vec3 color) {
    //#ifdef VOX_USE_FOG
        vec3 fogColor = u_envLightParams[2].xyz;
    	#ifdef VOX_FOG_EXP2
            float fogDensity = u_envLightParams[2].w;
            // v_fogDepth = -viewPos.z;
    		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * v_fogDepth * v_fogDepth );

    	#else

            float fogNear = u_envLightParams[1].z;
            float fogFar = u_envLightParams[1].w;
    		float fogFactor = smoothstep( fogNear, fogFar, v_fogDepth );

    	#endif
    	color = mix( color.rgb, fogColor, fogFactor );
    //#endif
}