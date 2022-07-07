interface ICoVec3 {

	x: number;
    y: number;
    z: number;
    w: number;

	clone(): ICoVec3;
    setTo(px: number, py: number, pz: number, pw?: number): void;

    fromArray(arr: number[], offset?: number): ICoVec3;
    setXYZ(px: number, py: number, pz: number): void;
    copyFrom(v3: ICoVec3): void;
    dot(a: ICoVec3): number;
    multBy(a: ICoVec3): void;
    normalize(): void;
    normalizeTo(a: ICoVec3): void;
    scaleVector(s: ICoVec3): void;
    scaleBy(s: number): void;
    negate():void;
    equalsXYZ(a: ICoVec3): boolean;
    equalsAll(a: ICoVec3): boolean;
    project(): void;
    getLength(): number;
    getLengthSquared(): number;
    addBy(a: ICoVec3): void;
    subtractBy(a: ICoVec3): void;
    subtract(a: ICoVec3): ICoVec3;
    add(a: ICoVec3): ICoVec3;
    crossProduct(a: ICoVec3): ICoVec3;
    crossBy(a: ICoVec3): void;
    reflectBy(nv: ICoVec3): void;

    scaleVecTo(va: ICoVec3, scale: number): void;
    subVecsTo(va: ICoVec3, vb: ICoVec3): void;
    addVecsTo(va: ICoVec3, vb: ICoVec3): void;
    crossVecsTo(va: ICoVec3, vb: ICoVec3): void;
}

export { ICoVec3 }
