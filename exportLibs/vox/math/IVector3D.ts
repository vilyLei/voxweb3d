/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

interface IVector3D {
    /**
     * the default value is 0.0
     */
    x: number;
    /**
     * the default value is 0.0
     */
    y: number;
    /**
     * the default value is 0.0
     */
    z: number;
    /**
     * the default value is 1.0
     */
    w: number;
    clone(): IVector3D;
	abs(): IVector3D;
    setTo(px: number, py: number, pz: number, pw?: number): IVector3D;

    /**
     * example: [0],[1],[2],[3] => x,y,z,w
     */
    fromArray4(arr: number[] | Float32Array, offset?: number): IVector3D;
    /**
     * example: x,y,z,w => [0],[1],[2],[3]
     */
    toArray4(arr?: number[] | Float32Array, offset?: number): IVector3D;
    /**
     * example: [0],[1],[2] => x,y,z
     */
    fromArray(arr: number[] | Float32Array, offset?: number): IVector3D;
     /**
      * example: x,y,z => [0],[1],[2]
      */
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
