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
    setTo(px: number, py: number, pz: number, pw?: number): void;
    fromArray(arr: number[] | Float32Array, offset?: number): IVector3D;
    toArray(arr?: number[] | Float32Array, offset?: number): IVector3D;
    setXYZ(px: number, py: number, pz: number): void;
    copyFrom(v3: IVector3D): void;
    dot(a: IVector3D): number;
    multBy(a: IVector3D): void;
    normalize(): void;
    normalizeTo(a: IVector3D): void;
    scaleVector(s: IVector3D): void ;
    scaleBy(s: number): void;
    negate(): void;
    equalsXYZ(a: IVector3D): boolean;
    equalsAll(a: IVector3D): boolean;
    project(): void;
    getLength(): number;
    getLengthSquared(): number;
    addBy(a: IVector3D): void;
    subtractBy(a: IVector3D): void;
    subtract(a: IVector3D): IVector3D;
    add(a: IVector3D): IVector3D;
    crossProduct(a: IVector3D): IVector3D;
    crossBy(a: IVector3D): void;
    reflectBy(nv: IVector3D): void;

    scaleVecTo(va: IVector3D, scale: number): void;
    subVecsTo(va: IVector3D, vb: IVector3D): void;
    addVecsTo(va: IVector3D, vb: IVector3D): void;
    crossVecsTo(va: IVector3D, vb: IVector3D): void;
    
}
export default IVector3D;