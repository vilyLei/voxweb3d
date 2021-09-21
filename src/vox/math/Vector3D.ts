/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import MathConst from "../../vox/math/MathConst";

class Vector3D {
    x: number = 0.0;
    y: number = 0.0;
    z: number = 0.0;
    w: number = 0.0;
    constructor(px: number = 0.0, py: number = 0.0, pz: number = 0.0, pw: number = 1.0) {
        this.x = px;
        this.y = py;
        this.z = pz;
        this.w = pw;
    }
    clone(): Vector3D {
        return new Vector3D(this.x, this.y, this.z, this.w);
    }
    setTo(px: number, py: number, pz: number, pw: number = 1.0): void {
        this.x = px;
        this.y = py;
        this.z = pz;
        this.w = pw;
    }
    setXYZ(px: number, py: number, pz: number): void {
        this.x = px;
        this.y = py;
        this.z = pz;
    }
    copyFrom(v3: Vector3D): void {
        this.x = v3.x;
        this.y = v3.y;
        this.z = v3.z;
    }
    dot(a: Vector3D) {
        return this.x * a.x + this.y * a.y + this.z * a.z;
    }
    multBy(a: Vector3D) {
        this.x *= a.x;
        this.y *= a.y;
        this.z *= a.z;
    }
    normalize(): void {
        let d: number = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
        if (d > MathConst.MATH_MIN_POSITIVE) {
            this.x /= d;
            this.y /= d;
            this.z /= d;
        }
    }
    normalizeTo(a: Vector3D): void {
        let d: number = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
        if (d > MathConst.MATH_MIN_POSITIVE) {
            a.x = this.x / d;
            a.y = this.y / d;
            a.z = this.z / d;
        }
        else {
            a.x = this.x;
            a.y = this.y;
            a.z = this.z;
        }
    }
    scaleVector(s: Vector3D): void {
        this.x *= s.x;
        this.y *= s.y;
        this.z *= s.z;
    }
    scaleBy(s: number): void {
        this.x *= s;
        this.y *= s;
        this.z *= s;
    }
    negate() {
        this.x = -this.x;
        this.y = -this.y;
        this.z = -this.z;
    }
    equalsXYZ(a: Vector3D): boolean {
        return Math.abs(this.x - a.x) < MathConst.MATH_MIN_POSITIVE && Math.abs(this.y - a.y) < MathConst.MATH_MIN_POSITIVE && Math.abs(this.z - a.z) < MathConst.MATH_MIN_POSITIVE;
    }
    equalsAll(a: Vector3D): boolean {
        return Math.abs(this.x - a.x) < MathConst.MATH_MIN_POSITIVE && Math.abs(this.y - a.y) < MathConst.MATH_MIN_POSITIVE && Math.abs(this.z - a.z) < MathConst.MATH_MIN_POSITIVE && Math.abs(this.w - a.w) < MathConst.MATH_MIN_POSITIVE;
    }
    project(): void {
        let t: number = 1.0 / this.w;
        this.x *= t;
        this.y *= t;
        this.z *= t;
    }
    getLength(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }
    getLengthSquared(): number {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    }
    addBy(a: Vector3D): void {
        this.x += a.x;
        this.y += a.y;
        this.z += a.z;
    }
    subtractBy(a: Vector3D): void {
        this.x -= a.x;
        this.y -= a.y;
        this.z -= a.z;
    }
    subtract(a: Vector3D): Vector3D {
        return new Vector3D(this.x - a.x, this.y - a.y, this.z - a.z);
    }
    add(a: Vector3D): Vector3D {
        return new Vector3D(this.x + a.x, this.y + a.y, this.z + a.z);
    }
    crossProduct(a: Vector3D): Vector3D {
        return new Vector3D(
            this.y * a.z - this.z * a.y
            , this.z * a.x - this.x * a.z
            , this.x * a.y - this.y * a.x
        );
    }
    crossBy(a: Vector3D): void {
        let px: number = this.y * a.z - this.z * a.y;
        let py: number = this.z * a.x - this.x * a.z;
        let pz: number = this.x * a.y - this.y * a.x;
        this.x = px;
        this.y = py;
        this.z = pz;
    }
    reflectBy(nv: Vector3D): void {
        let idotn2: number = (this.x * nv.x + this.y * nv.y + this.z * nv.z) * 2.0;
        this.x = this.x - idotn2 * nv.x;
        this.y = this.y - idotn2 * nv.y;
        this.z = this.z - idotn2 * nv.z;
    }

    scaleVecTo(va: Vector3D, scale: number): void {
        this.x = va.x * scale;
        this.y = va.y * scale;
        this.z = va.z * scale;
    }
    subVecsTo(va: Vector3D, vb: Vector3D): void {
        this.x = va.x - vb.x;
        this.y = va.y - vb.y;
        this.z = va.z - vb.z;
    }
    addVecsTo(va: Vector3D, vb: Vector3D): void {
        this.x = va.x + vb.x;
        this.y = va.y + vb.y;
        this.z = va.z + vb.z;
    }
    crossVecsTo(va: Vector3D, vb: Vector3D): void {
        this.x = va.y * vb.z - va.z * vb.y;
        this.y = va.z * vb.x - va.x * vb.z;
        this.z = va.x * vb.y - va.y * vb.x;
    }
    toString(): string {
        return "[Vector3D(x=" + this.x + ", y=" + this.y + ",z=" + this.z + ",w=" + this.w + ")]";
    }
    static X_AXIS = new Vector3D(1, 0, 0);
    static Y_AXIS = new Vector3D(0, 1, 0);
    static Z_AXIS = new Vector3D(0, 0, 1);

    private static __vtor3Stv0: Vector3D = new Vector3D();
    private static __vtor3Stv1: Vector3D = new Vector3D();
    // 右手法则(为正)
    static Cross(a: Vector3D, b: Vector3D, result: Vector3D): void {
        result.x = a.y * b.z - a.z * b.y;
        result.y = a.z * b.x - a.x * b.z;
        result.z = a.x * b.y - a.y * b.x;
    }
    // (va1 - va0) 叉乘 (vb1 - vb0), 右手法则(为正)
    static CrossSubtract(va0: Vector3D, va1: Vector3D, vb0: Vector3D, vb1: Vector3D, result: Vector3D): void {
        Vector3D.__vtor3Stv0.x = va1.x - va0.x;
        Vector3D.__vtor3Stv0.y = va1.y - va0.y;
        Vector3D.__vtor3Stv0.z = va1.z - va0.z;

        Vector3D.__vtor3Stv1.x = vb1.x - vb0.x;
        Vector3D.__vtor3Stv1.y = vb1.y - vb0.y;
        Vector3D.__vtor3Stv1.z = vb1.z - vb0.z;
        va0 = Vector3D.__vtor3Stv0;
        vb0 = Vector3D.__vtor3Stv1;
        result.x = va0.y * vb0.z - va0.z * vb0.y;
        result.y = va0.z * vb0.x - va0.x * vb0.z;
        result.z = va0.x * vb0.y - va0.y * vb0.x;
    }
    static Subtract(a: Vector3D, b: Vector3D, result: Vector3D): void {
        result.x = a.x - b.x;
        result.y = a.y - b.y;
        result.z = a.z - b.z;
    }
    static DistanceSquared(a: Vector3D, b: Vector3D): number {
        Vector3D.__vtor3Stv0.x = a.x - b.x;
        Vector3D.__vtor3Stv0.y = a.y - b.y;
        Vector3D.__vtor3Stv0.z = a.z - b.z;
        return Vector3D.__vtor3Stv0.getLengthSquared();
    }
    static DistanceXYZ(x0: number, y0: number, z0: number, x1: number, y1: number, z1: number): number {
        Vector3D.__vtor3Stv0.x = x0 - x1;
        Vector3D.__vtor3Stv0.y = y0 - y1;
        Vector3D.__vtor3Stv0.z = z0 - z1;
        return Vector3D.__vtor3Stv0.getLength();
    }
    static Distance(v0: Vector3D, v1: Vector3D): number {
        Vector3D.__vtor3Stv0.x = v0.x - v1.x;
        Vector3D.__vtor3Stv0.y = v0.y - v1.y;
        Vector3D.__vtor3Stv0.z = v0.z - v1.z;
        return Vector3D.__vtor3Stv0.getLength();
    }

    /**
     * get angle degree between two Vector3D objects
     * @param v0 src Vector3D object
     * @param v1 dst Vector3D object
     * @returns angle degree
     */
    static AngleBetween(v0: Vector3D, v1: Vector3D): number {
        v0.normalizeTo(Vector3D.__vtor3Stv0);
        v1.normalizeTo(Vector3D.__vtor3Stv1);
        return Math.acos(Vector3D.__vtor3Stv0.dot(Vector3D.__vtor3Stv1)) * MathConst.MATH_180_OVER_PI;
    }
    /**
     * get angle radian between two Vector3D objects
     * @param v0 src Vector3D object
     * @param v1 dst Vector3D object
     * @returns angle radian
     */
    static RadianBetween(v0: Vector3D, v1: Vector3D) {
        v0.normalizeTo(Vector3D.__vtor3Stv0);
        v1.normalizeTo(Vector3D.__vtor3Stv1);
        return Math.acos(Vector3D.__vtor3Stv0.dot(Vector3D.__vtor3Stv1));
    }

    static RadianBetween2(v0: Vector3D, v1: Vector3D) {
        //  // c^2 = a^2 + b^2 - 2*a*b * cos(x)
        //  // cos(x) = (a^2 + b^2 - c^2) / 2*a*b
        let pa: number = v0.getLengthSquared();
        let pb: number = v1.getLengthSquared();
        Vector3D.__vtor3Stv0.x = v0.x - v1.x;
        Vector3D.__vtor3Stv0.y = v0.y - v1.y;
        Vector3D.__vtor3Stv0.z = v0.z - v1.z;
        return Math.acos((pa + pb - Vector3D.__vtor3Stv0.getLengthSquared()) / (2.0 * Math.sqrt(pa) * Math.sqrt(pb)));

    }
    static Reflect(iv: Vector3D, nv: Vector3D, rv: Vector3D): void {
        let idotn2: number = (iv.x * nv.x + iv.y * nv.y + iv.z * nv.z) * 2.0;
        rv.x = iv.x - idotn2 * nv.x;
        rv.y = iv.y - idotn2 * nv.y;
        rv.z = iv.z - idotn2 * nv.z;
    }
    static ZERO: Vector3D = new Vector3D();
}
export default Vector3D;