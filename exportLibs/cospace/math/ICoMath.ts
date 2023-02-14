import IVector3D from "../../vox/math/IVector3D";
import IMatrix4 from "../../vox/math/IMatrix4";
import IAABB from "../../vox/geom/IAABB";
import IAABB2D from "../../vox/geom/IAABB2D";

import { CoVec3 } from "../voxengine/ICoRScene";

interface CoMathConst {

    readonly MATH_MIN_POSITIVE: number;
    readonly MATH_MAX_NEGATIVE: number;
    readonly MATH_MAX_POSITIVE: number;
    readonly MATH_MIN_NEGATIVE: number;
    readonly MATH_1_OVER_255: number;
    readonly MATH_PI: number;
    readonly MATH_2PI: number;
    readonly MATH_3PER2PI: number;
    readonly MATH_1PER2PI: number;
    readonly MATH_1_OVER_PI: number;
    readonly MATH_1_OVER_360: number;
    readonly MATH_1_OVER_180: number;
    readonly MATH_180_OVER_PI: number;
    readonly MATH_PI_OVER_180: number;
    readonly MATH_LN2: number;

    Clamp(value: number, min: number, max: number): number;
    IsPowerOf2(value: number): boolean;
    CalcCeilPowerOfTwo(value: number): number;
    CalcNearestCeilPow2(int_n: number): number;
    CalcFloorCeilPow2(int_n: number): number;
    DegreeToRadian(degree: number): number;
    Log2(f: number): number;
    GetMaxMipMapLevel(width: number, height: number): number;
    SafeACos(x: number): number;
    GetNearestCeilPow2(int_n: number): number;
    /**
     * ccw is positive
     * @param r0 radian 0
     * @param r1 radian 1
     */
    GetMinRadian(r0: number, r1: number): number;
    /**
     * get the directional angle offset degree value: dst_angle_degree = src_angle_degree + directional_angle_offset_degree_value
     * @param a0 src angle degree
     * @param a1 dst angle degree
     * @returns directional angle offset degree value 
     */
    GetMinDegree(a0: number, a1: number): number;
    GetDegreeByXY(dx: number, dy: number): number;
    GetRadianByXY(dx: number, dy: number): number;
    GetRadianByCos(cosv: number, dx: number, dy: number): number;
}

interface CoOrientationType {
    /**
     * the value is 0
     */
    readonly AXIS_ANGLE: number;
    /**
     * the value is 1
     */
    readonly QUATERNION: number;
    /**
     * the value is 2
     */
    readonly EULER_ANGLES: number;
}

interface ICoMath {

    Vector3D: CoVec3;
    MathConst: CoMathConst;
    OrientationType: CoOrientationType;
    /**
     * create a Vector3D instance
     * @param px the default vaue is 0.0
     * @param py the default vaue is 0.0
     * @param pz the default vaue is 0.0
     * @param pw the default vaue is 1.0
     */
    createVec3(px?: number, py?: number, pz?: number, pw?: number): IVector3D;
    createMat4(pfs32?: Float32Array, index?: number): IMatrix4;
    createAABB(): IAABB;
    createAABB2D(px?: number, py?: number, pwidth?: number, pheight?: number): IAABB2D;

    isZero(v: number): boolean;
    isNotZero(v: number): boolean;
    /**
     * example:
     *     isGreaterPositiveZero(0.1) is true
     *     isGreaterPositiveZero(0.000000001) is false
     *     isGreaterPositiveZero(-0.1) is false
     * @param v number value
     * @returns a positive number value and its value is greater zero, return true, otherwize false
     */
    isGreaterPositiveZero(v: number): boolean;
    /**
     * example:
     *      isLessNegativeZero(-0.1) is true
     *      isLessNegativeZero(-000000001) is false
     *      isLessNegativeZero(0.1) is false
     * @param v number value
     * @returns a negative number value and its value is less zero, return true, otherwise false
     */
    isLessNegativeZero(v: number): boolean;
    /**
     * example:
     * 	isLessPositiveZero(+0.00000001) is true
     *  isLessPositiveZero(-1.3) is true
     *  isLessPositiveZero(1.3) is false
     * @param v number value
     * @returns true or false
     */
    isLessPositiveZero(v: number): boolean;
    /**
     * example:
     * 	isGreaterNegativeZero(-0.00000001) is true
     *  isGreaterNegativeZero(+1.3) is true
     *  isGreaterNegativeZero(-1.3) is false
     * @param v number value
     * @returns true or false
     */
    isGreaterNegativeZero(v: number): boolean;
    isPostiveZero(v: number): boolean;
    isNegativeZero(v: number): boolean;
    isGreaterRealZero(v: number): boolean;
    isLessRealZero(v: number): boolean;
}

export { IVector3D, CoMathConst, CoOrientationType, CoVec3, IMatrix4, IAABB, IAABB2D, ICoMath };
