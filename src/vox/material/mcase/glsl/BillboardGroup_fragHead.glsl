vec3 getOffsetColor() {
    #ifdef VOX_OFFSET_COLOR_MAP
        #ifdef VOX_USE_RAW_UV
            vec3 offsetColor = clamp(v_colorOffset.xyz + VOX_Texture2D(VOX_OFFSET_COLOR_MAP, v_uv.xy).xyz,vec3(0.0),vec3(1.0));
        #else
            vec3 offsetColor = clamp(v_colorOffset.xyz + texture(VOX_OFFSET_COLOR_MAP, v_texUV.xy).xyz,vec3(0.0),vec3(1.0));
        #endif
    #else
        vec3 offsetColor = v_colorOffset.xyz;
    #endif
    return offsetColor;
}

void blendBrightnessORAlpha(inout vec4 color, in vec3 offsetColor) {

    #if FADE_STATUS == 11
        color.rgb = color.rgb * v_colorMult.xyz + color.aaa * offsetColor;
        color *= FADE_VAR.zzzz;
    #elif FADE_STATUS == 10
        color.rgb = min(color.rgb * v_colorMult.xyz + color.rgb * offsetColor, vec3(1.0));
        color.rgb *= FADE_VAR.zzz;
    #elif FADE_STATUS == 1
        color.rgb = color.rgb * v_colorMult.xyz + color.aaa * offsetColor;
        color.a *= FADE_VAR.z;
    #else
        color.rgb = color.rgb * v_colorMult.xyz + offsetColor;
        color.a *= FADE_VAR.z;
    #endif
}