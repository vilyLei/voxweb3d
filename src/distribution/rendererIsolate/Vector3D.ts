
interface Vector3D {
    x: number;
    y: number;
    z: number;
    copyFrom(v3: Vector3D): void;
    subtractBy(v3: Vector3D): void;
    addBy(v3: Vector3D): void;
    setXYZ(px: number, py: number, pz: number): void;
    normalize(): void;
}

export {Vector3D}