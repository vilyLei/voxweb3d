
/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

export default interface IShdProgram {
    getUid(): number;
    getTexTotal(): number;
    useTexLocation(): void;
    // use texture true or false
    haveTexture(): boolean
    getUniformLocationByNS(ns: string): any;
    getUniformTypeNameByNS(ns: string): string;
    hasUniformByName(ns: string): boolean;
    getUniformLengthByNS(ns: string): number;
}
