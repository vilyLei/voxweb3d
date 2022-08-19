/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

interface IVector3D {
    x: number;
    y: number;
    z: number;
    w: number;
    clone(): IVector3D;
    setTo(px: number, py: number, pz: number, pw?: number): IVector3D;
    fromArray(arr: number[] | Float32Array, offset?: number): IVector3D;
    toArray(arr?: number[] | Float32Array, offset?: number): IVector3D;
    setXYZ(px: number, py: number, pz: number): IVector3D;
    copyFrom(v3: IVector3D): IVector3D;
    dot(a: IVector3D): number;
    multBy(a: IVector3D): IVector3D;
    normalize(): IVector3D;
    normalizeTo(a: IVector3D): void;
    scaleVector(s: IVector3D): IVector3D;
    scaleBy(s: number): IVector3D;
    negate(): IVector3D;
    equalsXYZ(a: IVector3D): boolean;
    equalsAll(a: IVector3D): boolean;
    project(): void;
    getLength(): number;
    getLengthSquared(): number;
    addBy(a: IVector3D): IVector3D;
    subtractBy(a: IVector3D): IVector3D;
    subtract(a: IVector3D): IVector3D;
    add(a: IVector3D): IVector3D;
    crossProduct(a: IVector3D): IVector3D;
    crossBy(a: IVector3D): IVector3D;
    reflectBy(nv: IVector3D): IVector3D;

    scaleVecTo(va: IVector3D, scale: number): IVector3D;
    subVecsTo(va: IVector3D, vb: IVector3D): IVector3D;
    addVecsTo(va: IVector3D, vb: IVector3D): IVector3D;
    crossVecsTo(va: IVector3D, vb: IVector3D): IVector3D;
    
}
export default IVector3D;