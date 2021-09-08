
interface Color4 {
    r: number;
    g: number;
    b: number;
    a: number;
    copyFrom(c4: Color4): void;
    setRGB3f(r: number, g: number, b: number): void;
    setRGBA4f(r: number, g: number, b: number, a: number): void;
}

export {Color4}