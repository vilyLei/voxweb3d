/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
export default class MathShaderCode {
    constructor() { }
    static GetRadianByXY_Func(): string {

        let shdCode: string =
            `
// 3.141592653589793
#define MATH_PI 3.14159265
const float MATH_2PI = 2.0 * MATH_PI;
const float MATH_3PI = 3.0 * MATH_PI;
// 4.71238898038469
#define MATH_3PER2PI 4.71238898
// 1.5707963267948966
#define MATH_1PER2PI 1.57079633

float getRadianByXY(float dx, float dy) {
    float rad = atan(dy/dx);
    return dx >= 0.0 ? rad:(MATH_3PI + rad);
}
`;
        return shdCode;
    }
}