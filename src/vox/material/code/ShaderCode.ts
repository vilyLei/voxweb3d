/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
export default class MathShaderCode
{
    constructor(){}
    static readonly FragPredefined: string = "";
    static readonly FragDefined: string =
`
vec4 worldPosition = vec4(0.0);
vec3 worldNormal = vec3(0.0);
`;
    static readonly VertPredefined: string = "";
    static readonly VertDefined: string =
`
vec4 localPosition = vec4(0.0,0.0,0.0,1.0);
vec4 worldPosition = vec4(0.0,0.0,0.0,1.0);
// view space position
vec4 viewPosition = vec4(0.0,0.0,0.0,1.0);
`;
}