/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

export default class BillboardFSBase {
    private m_brnAStatus: number = 0;
    constructor() {
    }
    getBrnAlphaStatus(): number {
        return this.m_brnAStatus;
    }
    setBrightnessAndAlpha(brightnessEnabled: boolean, alphaEnabled: boolean): void {
        this.m_brnAStatus = Number(brightnessEnabled) * 10 + Number(alphaEnabled);
    }
    getBrnAndAlphaCode(factorNS: string = "v_texUV"): string {
        let fadeCode: string;
        if (this.m_brnAStatus == 11) {
            fadeCode =
                `
color.rgb = color.rgb * v_colorMult.xyz + color.aaa * offsetColor;
color *= FADE_VAR.zzzz;
`;
        }
        else if (this.m_brnAStatus == 10) {
            fadeCode =
                `
color.rgb = min(color.rgb * v_colorMult.xyz + color.rgb * offsetColor, vec3(1.0));
color.rgb *= FADE_VAR.zzz;
`;
        }
        else if (this.m_brnAStatus == 1) {
            fadeCode =
                `
color.rgb = color.rgb * v_colorMult.xyz + color.aaa * offsetColor;
color.a *= FADE_VAR.z;
`;
        }
        else {
            fadeCode =
                `
color.rgb = color.rgb * v_colorMult.xyz + offsetColor;
color.a *= FADE_VAR.z;
`;
        }
        return fadeCode;
    }
    getMixThreeColorsCode(): string {
        let codeStr: string =
            `
vec4 mixThreeColors(vec4 color0,vec4 color1,vec4 color2,float t)
{
    float k0 = max(1.0 - 2.0 * t, 0.0);
    float k = max(t - 0.5, 0.0);
    float k1 = (1.0 - (2.0 * k)) * step(-0.00001,k);
    k = step(0.00001,k0);
    return mix(mix(color2,color1,k1), mix(color1,color0,k0), k);
}
`;
        return codeStr;
    }
    getOffsetColorCode(OffsetColorTexEnabled: boolean, useRawUVEnabled: boolean = false): string {
        let fragCode2: string;
        if (OffsetColorTexEnabled) {
            if (useRawUVEnabled) {
                fragCode2 =
                    `
vec3 offsetColor = clamp(v_colorOffset.xyz + texture(VOX_OFFSET_COLOR_MAP, v_uv.xy).xyz,vec3(0.0),vec3(1.0));
`;
            }
            else {
                fragCode2 =
                    `
vec3 offsetColor = clamp(v_colorOffset.xyz + texture(VOX_OFFSET_COLOR_MAP, v_texUV.xy).xyz,vec3(0.0),vec3(1.0));
`;

            }
        }
        else {
            fragCode2 =
                `
vec3 offsetColor = v_colorOffset.xyz;
`;
        }
        return fragCode2;
    }
}