import IVector3D from "../../vox/math/IVector3D";
import IMatrix4 from "../../vox/math/IMatrix4";
import IAABB from "../../vox/geom/IAABB";
import IAABB2D from "../../vox/geom/IAABB2D";

interface CoMathVec3 {

	ONE: IVector3D;
	ZERO: IVector3D;
	X_AXIS: IVector3D;
	Y_AXIS: IVector3D;
	Z_AXIS: IVector3D;

	/**
     * 右手法则(为正)
     */
	Cross(a: IVector3D, b: IVector3D, result: IVector3D): void;
    // (va1 - va0) 叉乘 (vb1 - vb0), 右手法则(为正)
    CrossSubtract(va0: IVector3D, va1: IVector3D, vb0: IVector3D, vb1: IVector3D, result: IVector3D): void;
    Subtract(a: IVector3D, b: IVector3D, result: IVector3D): void;
    DistanceSquared(a: IVector3D, b: IVector3D): number;
    DistanceXYZ(x0: number, y0: number, z0: number, x1: number, y1: number, z1: number): number;
	Distance(v0: IVector3D, v1: IVector3D): number;
    /**
     * get angle degree between two IVector3D objects
     * @param v0 src IVector3D object
     * @param v1 dst IVector3D object
     * @returns angle degree
     */
    AngleBetween(v0: IVector3D, v1: IVector3D): number;
    /**
     * get angle radian between two IVector3D objects
     * @param v0 src IVector3D object
     * @param v1 dst IVector3D object
     * @returns angle radian
     */
    RadianBetween(v0: IVector3D, v1: IVector3D): number;
    RadianBetween2(v0: IVector3D, v1: IVector3D): number;
    Reflect(iv: IVector3D, nv: IVector3D, rv: IVector3D): void;
}

interface ICoMath {

	Vector3D: CoMathVec3;
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
    
    isZero(v: number) : boolean;
    isNotZero(v: number) : boolean;
    /**
     * example:
     *     isGreaterPositiveZero(0.1) is true
     *     isGreaterPositiveZero(0.000000001) is false
     *     isGreaterPositiveZero(-0.1) is false
     * @param v number value
     * @returns a positive number value and its value is greater zero, return true, otherwize false
     */
    isGreaterPositiveZero(v: number) : boolean;
    /**
     * example:
     *      isLessNegativeZero(-0.1) is true
     *      isLessNegativeZero(-000000001) is false
     *      isLessNegativeZero(0.1) is false
     * @param v number value
     * @returns a negative number value and its value is less zero, return true, otherwise false
     */
    isLessNegativeZero(v: number) : boolean;
    /**
     * example:
     * 	isLessPositiveZero(+0.00000001) is true
     *  isLessPositiveZero(-1.3) is true
     *  isLessPositiveZero(1.3) is false
     * @param v number value
     * @returns true or false
     */
    isLessPositiveZero(v: number) : boolean;
    /**
     * example:
     * 	isGreaterNegativeZero(-0.00000001) is true
     *  isGreaterNegativeZero(+1.3) is true
     *  isGreaterNegativeZero(-1.3) is false
     * @param v number value
     * @returns true or false
     */
    isGreaterNegativeZero(v: number) : boolean;
    isPostiveZero(v: number) : boolean;
    isNegativeZero(v: number) : boolean;
    isGreaterRealZero(v: number) : boolean;
    isLessRealZero(v: number) : boolean;
}
export { CoMathVec3, ICoMath };
