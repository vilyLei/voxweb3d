/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
class MathShaderCode {
    constructor() { }
    static readonly BasePredefined: string =
        `
#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
`;
//     static readonly FragPredefined: string =
//         `
// `;
//     static readonly FragDefined: string =
//         `
// `;
//     static readonly VertPredefined: string =
//         `
// `;
//     static readonly VertDefined: string =
//         `
// vec4 localPosition = vec4(0.0,0.0,0.0,1.0);
// vec4 worldPosition = vec4(0.0,0.0,0.0,1.0);
// // view space position
// vec4 viewPosition = vec4(0.0,0.0,0.0,1.0);
// `;
}
class ShaderCode {
    constructor() { }
    static readonly BasePredefined: string =
        `
vec4 localPosition = vec4(0.0,0.0,0.0,1.0);
vec4 worldPosition = vec4(0.0,0.0,0.0,1.0);
// view space position
vec4 viewPosition = vec4(0.0,0.0,0.0,1.0);
vec3 worldNormal = vec3(0.0, 0.0, 1.0);
`;
    static readonly FragPredefined: string =
        `
`;
    static readonly FragDefined: string =
        `
`;
    static readonly VertPredefined: string =
        `
// origin world position
vec4 oWorldPosition = vec4(0.0,0.0,0.0,1.0);
`;
    static readonly VertDefined: string =
        `
`;
}
export {MathShaderCode, ShaderCode};