#ifdef VOX_AMBIENT_MAP
    FragColor0.xyz += VOX_Texture2D(VOX_AMBIENT_MAP, worldPosition.xz / vec2(400.0, 400.0));
#endif
#ifdef VOX_FOG_COLOR_MAP
    getFogColorFromTexture2D( VOX_FOG_COLOR_MAP );
#endif

#ifdef VOX_USE_FOG
    useFog( FragColor0.xyz );
#endif 