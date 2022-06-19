/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

class RGBColorUtil {

    /**
     * @param uintRGB24, uint 24bit rgb color, example: 0xff003a
     */
    static uint24RGBToCSSHeXRGBColor(uintRGB24: number): string {
        let str = Math.round(uintRGB24).toString(16);
        if (str.length > 6) {
            str = str.slice(-6);
        } else if (str.length < 6) {
            let len = 6 - str.length;
            const s0 = "000000";
            str = s0.slice(0, len) + str;
        }
        return "#" + str;
    }
}

export { RGBColorUtil }