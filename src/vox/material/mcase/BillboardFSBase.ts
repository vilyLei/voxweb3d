/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/




/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

export namespace vox
{
    export namespace material
    {
        export namespace mcase
        {
            export class BillboardFSBase
            {
                private m_brnAStatus:number = 0;
                constructor()
                {
                }
                getBrnAlphaStatus():number
                {
                    return this.m_brnAStatus;
                }
                setBrightnessAndAlpha(brightnessEnabled:boolean, alphaEnabled:boolean):void
                {
                    this.m_brnAStatus = Number(brightnessEnabled) * 10 + Number(alphaEnabled);                    
                }
                getBrnAndAlphaCode():string
                {
                    let fadeCode:string;
                    if(this.m_brnAStatus == 11)
                    {
                        fadeCode = 
`
    color.rgb = color.rgb * v_colorMult.xyz + color.aaa * offsetColor;
    color *= v_texUV.zzzz;
`;
                    }
                    else if(this.m_brnAStatus == 10)
                    {
                        fadeCode = 
`
    color.rgb = color.rgb * v_colorMult.xyz + color.rgb * offsetColor;
    color.rgb *= v_texUV.zzz;
`;
                    }
                    else if(this.m_brnAStatus == 1)
                    {
                        fadeCode = 
`
    color.rgb = color.rgb * v_colorMult.xyz + color.aaa * offsetColor;
    color.a *= v_texUV.z;
`;
                    }
                    else
                    {
                        fadeCode = 
`
    color.rgb = color.rgb * v_colorMult.xyz + offsetColor;
    color.a *= v_texUV.z;
`;
                    }
                    return fadeCode;
                }
                
                getOffsetColorCode(sampleIndex:number,OffsetColorTexEnabled:boolean):string
                {
                    let fragCode2:string;
                    if(OffsetColorTexEnabled)
                    {
                        fragCode2 =
`
    vec3 offsetColor = v_colorOffset.xyz + texture(u_sampler`+sampleIndex+`, v_texUV.xy).xyz;
`;
                    }
                    else
                    {
                        fragCode2 =
`
    vec3 offsetColor = v_colorOffset.xyz;
`;
                    }
                    return fragCode2;
                }
            }
        }
    }
}