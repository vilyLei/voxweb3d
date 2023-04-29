
/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

export default interface IUniformLine {
    type: number;
    typeName: string;
    name: string;
    isArray: boolean;
    arrLength: number;
    isTex: boolean;
    location: any;
    parseCode(codeStr: string): boolean;
}