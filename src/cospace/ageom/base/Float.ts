/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

/***************************************************************************************************************************************************
* if the float number value is MATH_MAX_NEGATIVE < value < MATH_MIN_POSITIVE, the value can be considered ZERO, otherwise the value is not ZERO.
***************************************************************************************************************************************************/

/**
 * principle: x < MATH_MIN_POSITIVE, or x >= MATH_MIN_POSITIVE
 */
const MATH_MIN_POSITIVE = 1e-6;
/**
 * principle: x <= MATH_MAX_NEGATIVE, or x > MATH_MAX_NEGATIVE
 */
const MATH_MAX_NEGATIVE = -1e-6;

function isZero(v: number) : boolean {
	return v > MATH_MAX_NEGATIVE && v < MATH_MIN_POSITIVE;
}
function isNotZero(v: number) : boolean {
	return v <= MATH_MAX_NEGATIVE || v >= MATH_MIN_POSITIVE;
}
/**
 * example:
 *     isPositiveGreaterZero(0.1) is true
 *     isPositiveGreaterZero(0.000000001) is false
 *     isPositiveGreaterZero(-0.1) is false
 * @param v number value
 * @returns a positive number value and its value is greater zero, return true, otherwize false
 */
function isPositiveGreaterZero(v: number) : boolean {
	return v >= MATH_MIN_POSITIVE;
}
/**
 * example:
 *      isNegativeLessZero(-0.1) is true
 *      isNegativeLessZero(-000000001) is false
 *      isNegativeLessZero(0.1) is false
 * @param v number value
 * @returns a negative number value and its value is less zero, return true, otherwise false
 */
function isNegativeLessZero(v: number) : boolean {
	return v <= MATH_MAX_NEGATIVE;
}
/**
 * example:
 * 	isLessPositiveZero(+0.00000001) is true
 *  isLessPositiveZero(-1.3) is true
 *  isLessPositiveZero(1.3) is false
 * @param v number value
 * @returns true or false
 */
function isLessPositiveZero(v: number) : boolean {
	return v < MATH_MIN_POSITIVE;
}
/**
 * example:
 * 	isGreaterNegativeZero(-0.00000001) is true
 *  isGreaterNegativeZero(+1.3) is true
 *  isGreaterNegativeZero(-1.3) is false
 * @param v number value
 * @returns true or false
 */
function isGreaterNegativeZero(v: number) : boolean {
	return v > MATH_MAX_NEGATIVE;
}

function isPostiveZero(v: number) : boolean {
	return v >= 0.0 && v < MATH_MIN_POSITIVE;
}
function isNegativeZero(v: number) : boolean {
	return v <= 0.0 && v > MATH_MAX_NEGATIVE;
}
function isGreaterRealZero(v: number) : boolean {
	return v > 0.0;
}
function isLessRealZero(v: number) : boolean {
	return v < 0.0;
}

export {
	isZero,
	isNotZero,
	isPositiveGreaterZero,
	isNegativeLessZero,
	isLessPositiveZero,
	isGreaterNegativeZero,
	isPostiveZero,
	isNegativeZero,
	isGreaterRealZero,
	isLessRealZero
}
