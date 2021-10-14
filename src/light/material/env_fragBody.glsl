#ifdef VOX_FOG_COLOR_MAP
    getFogColorFromTexture2D( VOX_FOG_COLOR_MAP );
#endif

#ifdef VOX_USE_FOG
    useFog( FragColor0.rgb );
#endif 