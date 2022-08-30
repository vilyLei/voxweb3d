/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

interface IColor4 {
    /**
     * the default value is 1.0
     */
    r: number;
    /**
     * the default value is 1.0
     */
    g: number;
    /**
     * the default value is 1.0
     */
    b: number;
    /**
     * the default value is 1.0
     */
    a: number;

    /**
     * example: r,g,b,a => [0],[1],[2],[3]
     */
    fromArray(arr: number[] | Float32Array, offset?: number): IColor4;
    /**
     * example: [0],[1],[2],[3] => r,g,b,a
     */
    toArray(arr: number[] | Float32Array, offset?: number): IColor4;
    /**
     * example: r,g,b => [0],[1],[2]
     */
    fromArray3(arr: number[] | Float32Array, offset?: number): IColor4;
    /**
     * example: [0],[1],[2] => r,g,b
     */
    toArray3(arr: number[] | Float32Array, offset?: number): IColor4;
    setRGB3Bytes(r: number, g: number, b: number): void
    setRGB3f(r: number, g: number, b: number): void
    setRGBUint24(rgbUint24: number): void
    getRGBUint24(): number
    setRGBA4f(r: number, g: number, b: number, a: number): void
    copyFrom(c: IColor4): void
    copyFromRGB(c: IColor4): void
    scaleBy(s: number): void
    inverseRGB(): void
    randomRGB(density: number, bias?: number): void
    normalizeRandom(density?: number, bias?: number): void
    normalize(density: number): void

    /**
     * @returns for example: rgba(255,255,255,1.0)
     */
    getCSSDecRGBAColor(): string
    /**
     * @returns for example: #350b7e
     */
    getCSSHeXRGBColor(): string;
}
export default IColor4;
