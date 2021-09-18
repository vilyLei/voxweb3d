
/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

class MathConst {
    static readonly MATH_MIN_POSITIVE: number = 1e-5;
    static readonly MATH_MAX_NEGATIVE: number = -1e-5;
    static readonly MATH_MAX_POSITIVE: number = 0xffffffe;
    static readonly MATH_MIN_NEGATIVE: number = -0xffffffe;
    static readonly MATH_1_OVER_255: number = 1.0 / 255.0;
    static readonly MATH_PI: number = Math.PI;
    static readonly MATH_2PI: number = MathConst.MATH_PI * 2.0;
    static readonly MATH_3PER2PI: number = MathConst.MATH_PI * 1.5;
    static readonly MATH_1PER2PI: number = MathConst.MATH_PI * 0.5;
    static readonly MATH_1_OVER_PI: number = 1.0 / MathConst.MATH_PI;
    static readonly MATH_1_OVER_360: number = 1.0 / 360.0;
    static readonly MATH_1_OVER_180: number = 1.0 / 180.0;
    static readonly MATH_180_OVER_PI: number = 180.0 / MathConst.MATH_PI;
    static readonly MATH_PI_OVER_180: number = MathConst.MATH_PI / 180.0;
    static readonly MATH_LN2: number = 0.6931471805599453;
    
    static Clamp(value: number, min: number, max: number): number {
        return Math.max( Math.min(value, max), min);
    }
    static IsPowerOf2(value: number): boolean {
        return (value & (value - 1)) == 0;
    }

    static CalcCeilPowerOfTwo(value: number): number {

        return Math.pow(2, Math.ceil(Math.log(value) / Math.LN2));

    }
    static CalcNearestCeilPow2(int_n: number): number {
        return Math.pow(2, Math.round(Math.log(int_n) / Math.LN2));
    }
    static CalcFloorCeilPow2(int_n: number): number {
        return Math.pow(2, Math.floor(Math.log(int_n) / Math.LN2));
    }
    static DegreeToRadian(degree: number): number {
        return MathConst.MATH_PI_OVER_180 * degree;
    }
    static Log2(f: number): number {
        return Math.log(f) / Math.LN2;
    }
    static GetMaxMipMapLevel(width: number, height: number): number {
        return  Math.round(MathConst.Log2(Math.max(width, height)) + 1);
    }

    static SafeACos(x: number): number {
        if (x <= -1.0) {
            return MathConst.MATH_PI;
        }
        if (x >= 1.0) {
            return 0.0;
        }
        return Math.acos(x);
    }
    static GetNearestCeilPow2(int_n: number): number {
        let x: number = 1;
        while (x < int_n) {
            x <<= 1;
        }
        return x;
    }
    // ccw is positive
    static GetMinRadian(a1: number, a0: number): number {
        a0 %= MathConst.MATH_2PI;
        a1 %= MathConst.MATH_2PI;
        if (a0 < a1) {
            a0 = MathConst.MATH_2PI - a1 + a0;
            if (a0 > MathConst.MATH_PI) return a0 - MathConst.MATH_2PI;
            return a0;
        }
        else if (a0 > a1) {
            a1 = MathConst.MATH_2PI - a0 + a1;
            if (a1 > MathConst.MATH_PI) return MathConst.MATH_2PI - a1;
            return -a1;
        }
        return 0.0;
    }
    /**
     * get the directional angle offset degree value: dst_angle_degree = src_angle_degree + directional_angle_offset_degree_value
     * @param a0 src angle degree
     * @param a1 dst angle degree
     * @returns directional angle offset degree value 
     */
    static GetMinDegree(a0: number, a1: number): number {
        let angle: number = 0;
        if (a1 >= 270 && a0 < 90) {
            angle = (a1 - (a0 + 360)) % 180;
        }
        else if (a1 <= 90 && a0 >= 270) {
            angle = (a1 + 360 - a0) % 180;
        }
        else {
            angle = (a1 - a0);
            //  if (Math.abs(angle) > 180) {
            //      angle -= 360;
            //  }

            if ((angle) > 180) {
                angle -= 360;
                angle %= 360;
            } else if ((angle) < -180) {
                angle += 360;
                angle %= 360;
            }
        }
        return angle;
    }
    static GetDegreeByXY(dx: number, dy: number): number {
        if (Math.abs(dx) < 0.00001) {
            if (dy >= 0) return 270;
            else return 90;
        }
        let angle: number = Math.atan(dy / dx) * 180 / Math.PI;
        if (dx >= 0) {
            return angle;
        }
        else {
            return 180 + angle;
        }
        //  if (dy > 0 && dx > 0) {
        //      return angle
        //  } else if (dy < 0 && dx >= 0) {
        //      return 360 + angle;
        //  } else {
        //      return dx > 0 ? angle : 180 + angle;
        //  }
    }
    static GetRadianByXY(dx: number, dy: number): number {
        if (Math.abs(dx) < MathConst.MATH_MIN_POSITIVE) {
            if (dy >= 0) return MathConst.MATH_1PER2PI;
            else return MathConst.MATH_3PER2PI;
        }
        let rad: number = Math.atan(dy / dx);
        if (dx >= 0) {
            return rad;
        }
        else {
            return MathConst.MATH_PI + rad;
        }
    }
    static GetRadianByCos(cosv: number, dx: number, dy: number): number {
        var rad = Math.acos(cosv);//Math.atan(dy/dx);
        if (dx >= 0) {
            return rad;
        }
        else {
            return MathConst.MATH_PI + rad;
        }
    }
}

export default MathConst;