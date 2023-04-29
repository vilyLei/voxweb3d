/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
import IVector3D from "../../vox/math/IVector3D";

const v_m_180pk = 180.0 / Math.PI;
const v_m_minp: number = 1e-7;
export default class Vector3D implements IVector3D {
    x = 0.0;
    y = 0.0;
    z = 0.0;
    w = 0.0;
    constructor(px: number = 0.0, py: number = 0.0, pz: number = 0.0, pw: number = 1.0) {
        this.x = px;
        this.y = py;
        this.z = pz;
        this.w = pw;
    }
    clone(): Vector3D {
        return new Vector3D(this.x, this.y, this.z, this.w);
    }
	abs(): Vector3D {
		this.x = Math.abs(this.x);
		this.y = Math.abs(this.y);
		this.z = Math.abs(this.z);
		return this;
	}
    setTo(px: number, py: number, pz: number, pw: number = 1.0): Vector3D {
        this.x = px;
        this.y = py;
        this.z = pz;
        this.w = pw;
        return this;
    }
    fromArray(arr: number[] | Float32Array, offset: number = 0): Vector3D {
        this.x = arr[offset];
        this.y = arr[offset + 1];
        this.z = arr[offset + 2];
        return this;
    }
    toArray(arr: number[] | Float32Array, offset: number = 0): Vector3D {
        arr[offset] = this.x;
        arr[offset + 1] = this.y;
        arr[offset + 2] = this.z;
        return this;
    }
    fromArray4(arr: number[] | Float32Array, offset: number = 0): Vector3D {
        this.x = arr[offset];
        this.y = arr[offset + 1];
        this.z = arr[offset + 2];
        this.w = arr[offset + 3];
        return this;
    }
    toArray4(arr: number[] | Float32Array, offset: number = 0): Vector3D {
        arr[offset] = this.x;
        arr[offset + 1] = this.y;
        arr[offset + 2] = this.z;
        arr[offset + 3] = this.w;
        return this;
    }
    setXYZ(px: number, py: number, pz: number): Vector3D {
        this.x = px;
        this.y = py;
        this.z = pz;
        return this;
    }
    copyFrom(v3: Vector3D): Vector3D {
        this.x = v3.x;
        this.y = v3.y;
        this.z = v3.z;
        return this;
    }
    dot(a: Vector3D): number {
        return this.x * a.x + this.y * a.y + this.z * a.z;
    }
    multBy(a: Vector3D): Vector3D {
        this.x *= a.x;
        this.y *= a.y;
        this.z *= a.z;
        return this;
    }
    normalize(): Vector3D {
        let d: number = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
        if (d > v_m_minp) {
            this.x /= d;
            this.y /= d;
            this.z /= d;
        }
        return this;
    }
    normalizeTo(a: Vector3D): void {
        let d: number = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
        if (d > v_m_minp) {
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
    scaleVector(s: Vector3D): Vector3D {
        this.x *= s.x;
        this.y *= s.y;
        this.z *= s.z;
        return this;
    }
    scaleBy(s: number): Vector3D {
        this.x *= s;
        this.y *= s;
        this.z *= s;
        return this;
    }
    negate(): Vector3D {
        this.x = -this.x;
        this.y = -this.y;
        this.z = -this.z;
        return this;
    }
    equalsXYZ(a: Vector3D): boolean {
        return Math.abs(this.x - a.x) < v_m_minp && Math.abs(this.y - a.y) < v_m_minp && Math.abs(this.z - a.z) < v_m_minp;
    }
    equalsAll(a: Vector3D): boolean {
        return Math.abs(this.x - a.x) < v_m_minp && Math.abs(this.y - a.y) < v_m_minp && Math.abs(this.z - a.z) < v_m_minp && Math.abs(this.w - a.w) < v_m_minp;
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
    addBy(a: Vector3D): Vector3D {
        this.x += a.x;
        this.y += a.y;
        this.z += a.z;
        return this;
    }
    subtractBy(a: Vector3D): Vector3D {
        this.x -= a.x;
        this.y -= a.y;
        this.z -= a.z;
        return this;
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
    crossBy(a: Vector3D): Vector3D {
        let px = this.y * a.z - this.z * a.y;
        let py = this.z * a.x - this.x * a.z;
        let pz = this.x * a.y - this.y * a.x;
        this.x = px;
        this.y = py;
        this.z = pz;
        return this;
    }
    reflectBy(nv: Vector3D): Vector3D {
        let idotn2 = (this.x * nv.x + this.y * nv.y + this.z * nv.z) * 2.0;
        this.x = this.x - idotn2 * nv.x;
        this.y = this.y - idotn2 * nv.y;
        this.z = this.z - idotn2 * nv.z;
        return this;
    }

    scaleVecTo(va: Vector3D, scale: number): Vector3D {
        this.x = va.x * scale;
        this.y = va.y * scale;
        this.z = va.z * scale;
        return this;
    }
    subVecsTo(va: Vector3D, vb: Vector3D): Vector3D {
        this.x = va.x - vb.x;
        this.y = va.y - vb.y;
        this.z = va.z - vb.z;
        return this;
    }
    addVecsTo(va: Vector3D, vb: Vector3D): Vector3D {
        this.x = va.x + vb.x;
        this.y = va.y + vb.y;
        this.z = va.z + vb.z;
        return this;
    }
    crossVecsTo(va: Vector3D, vb: Vector3D): Vector3D {
        this.x = va.y * vb.z - va.z * vb.y;
        this.y = va.z * vb.x - va.x * vb.z;
        this.z = va.x * vb.y - va.y * vb.x;
        return this;
    }
    toString(): string {
        return "Vector3D(" + this.x + "" + this.y + "" + this.z + ")"
    }
    static readonly X_AXIS = new Vector3D(1, 0, 0);
    static readonly Y_AXIS = new Vector3D(0, 1, 0);
    static readonly Z_AXIS = new Vector3D(0, 0, 1);
    static readonly ZERO = new Vector3D(0, 0, 0);
    static readonly ONE = new Vector3D(1, 1, 1);

    /**
     * 右手法则(为正)
     */
    static Cross(a: Vector3D, b: Vector3D, result: Vector3D): void {
        result.x = a.y * b.z - a.z * b.y;
        result.y = a.z * b.x - a.x * b.z;
        result.z = a.x * b.y - a.y * b.x;
    }
    // (va1 - va0) 叉乘 (vb1 - vb0), 右手法则(为正)
    static CrossSubtract(va0: Vector3D, va1: Vector3D, vb0: Vector3D, vb1: Vector3D, result: Vector3D): void {
        v_m_v0.x = va1.x - va0.x;
        v_m_v0.y = va1.y - va0.y;
        v_m_v0.z = va1.z - va0.z;

        v_m_v1.x = vb1.x - vb0.x;
        v_m_v1.y = vb1.y - vb0.y;
        v_m_v1.z = vb1.z - vb0.z;
        va0 = v_m_v0;
        vb0 = v_m_v1;
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
        v_m_v0.x = a.x - b.x;
        v_m_v0.y = a.y - b.y;
        v_m_v0.z = a.z - b.z;
        return v_m_v0.getLengthSquared();
    }
    static DistanceXYZ(x0: number, y0: number, z0: number, x1: number, y1: number, z1: number): number {
        v_m_v0.x = x0 - x1;
        v_m_v0.y = y0 - y1;
        v_m_v0.z = z0 - z1;
        return v_m_v0.getLength();
    }
    static Distance(v0: Vector3D, v1: Vector3D): number {
        v_m_v0.x = v0.x - v1.x;
        v_m_v0.y = v0.y - v1.y;
        v_m_v0.z = v0.z - v1.z;
        return v_m_v0.getLength();
    }

    /**
     * get angle degree between two Vector3D objects
     * @param v0 src Vector3D object
     * @param v1 dst Vector3D object
     * @returns angle degree
     */
    static AngleBetween(v0: Vector3D, v1: Vector3D): number {
        v0.normalizeTo(v_m_v0);
        v1.normalizeTo(v_m_v1);
        return Math.acos(v_m_v0.dot(v_m_v1)) * v_m_180pk;
    }
    /**
     * get angle radian between two Vector3D objects
     * @param v0 src Vector3D object
     * @param v1 dst Vector3D object
     * @returns angle radian
     */
    static RadianBetween(v0: Vector3D, v1: Vector3D) {
        v0.normalizeTo(v_m_v0);
        v1.normalizeTo(v_m_v1);
        return Math.acos(v_m_v0.dot(v_m_v1));
    }

    static RadianBetween2(v0: Vector3D, v1: Vector3D): number {
        //  // c^2 = a^2 + b^2 - 2*a*b * cos(x)
        //  // cos(x) = (a^2 + b^2 - c^2) / 2*a*b
        let pa: number = v0.getLengthSquared();
        let pb: number = v1.getLengthSquared();
        v_m_v0.x = v0.x - v1.x;
        v_m_v0.y = v0.y - v1.y;
        v_m_v0.z = v0.z - v1.z;
        return Math.acos((pa + pb - v_m_v0.getLengthSquared()) / (2.0 * Math.sqrt(pa) * Math.sqrt(pb)));

    }
    static Reflect(iv: Vector3D, nv: Vector3D, rv: Vector3D): void {
        let idotn2: number = (iv.x * nv.x + iv.y * nv.y + iv.z * nv.z) * 2.0;
        rv.x = iv.x - idotn2 * nv.x;
        rv.y = iv.y - idotn2 * nv.y;
        rv.z = iv.z - idotn2 * nv.z;
    }

    /**
     * 逆时针转到垂直
     */
    static VerticalCCWOnXOY(v: Vector3D): void {
        const x = v.x;
        v.x = -v.y;
        v.y = x;
    }
    /**
     * 顺时针转到垂直
     */
    static VerticalCWOnXOY(v: Vector3D): void {
        const y = v.y;
        v.y = -v.x;
        v.x = y;
    }
}

const v_m_v0 = new Vector3D();
const v_m_v1 = new Vector3D();
