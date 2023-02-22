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

    clone(): IColor4;
    /**
     * example: [0],[1],[2],[3] => r,g,b,a
     */
    fromArray4(arr: number[] | Float32Array, offset?: number): IColor4;
    /**
     * example: r,g,b,a => [0],[1],[2],[3]
     */
    toArray4(arr: number[] | Float32Array, offset?: number): IColor4;
    /**
     * example: [0],[1],[2] => r,g,b
     */
    fromArray3(arr: number[] | Float32Array, offset?: number): IColor4;
    /**
     * example: r,g,b => [0],[1],[2]
     */
    toArray3(arr: number[] | Float32Array, offset?: number): IColor4;
    /**
     * example: [0],[1],[2] => r,g,b
     */
    fromBytesArray3(arr: number[] | Float32Array, offset?: number): IColor4;
    /**
     * example: r,g,b => [0],[1],[2]
     */
    toBytesArray3(arr: number[] | Float32Array, offset?: number): IColor4;
    /**
     * set rgb with three float values
     * @param r example: 0.5
     * @param g example: 0.6
     * @param b example: 0.7
     */
    setRGB3f(r: number, g: number, b: number): IColor4;
    /**
     * @param rgbUint24 example: 0xFF88cc
     */
    setRGBUint24(rgbUint24: number): IColor4;
    /**
     * @param r example: 40
     * @param g example: 50 
     * @param b example: 60 
     */
    setRGB3Bytes(r: number, g: number, b: number): IColor4;
    getRGBUint24(): number;
    /**
     * set rgba with four float values
     * @param r example: 0.5
     * @param g example: 0.6
     * @param b example: 0.7
     * @param a example: 1.0
     */
    setRGBA4f(r: number, g: number, b: number, a: number): IColor4;
    copyFrom(c: IColor4): IColor4;
    copyFromRGB(c: IColor4): IColor4;
    scaleBy(s: number): IColor4;
    inverseRGB(): IColor4;
    /**
     * @param density the default value is 1.0
     * @param bias the default value is 0.0
     */
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
