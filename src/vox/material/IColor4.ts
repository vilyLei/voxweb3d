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
    /**
     * @param r example: 40
     * @param g example: 50 
     * @param b example: 60 
     */
    setRGB3Bytes(r: number, g: number, b: number): IColor4
    setRGB3f(r: number, g: number, b: number): IColor4;
    setRGBUint24(rgbUint24: number): IColor4;
    /**
     * @param uint8R example: 80
     * @param uint8G example: 100
     * @param uint8B example: 200
     */
    setRGBUint8(uint8R: number, uint8G: number, uint8B: number): IColor4;
    getRGBUint24(): number;
    setRGBA4f(r: number, g: number, b: number, a: number): IColor4;
    copyFrom(c: IColor4): IColor4;
    copyFromRGB(c: IColor4): IColor4;
    scaleBy(s: number): IColor4;
    inverseRGB(): IColor4;
    randomRGB(density: number, bias?: number): IColor4;
    normalizeRandom(density?: number, bias?: number): IColor4;
    normalize(density: number): IColor4;

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
