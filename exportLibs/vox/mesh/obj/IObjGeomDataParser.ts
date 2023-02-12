/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

export default interface IObjGeomDataParser {

    /**
     * the default value is 1.0
     */
    moduleScale: number;
    /**
     * the default value is false
     */
    baseParsering: boolean;

    getVS(): Float32Array;
    getUVS(): Float32Array;
    getNVS(): Float32Array;
    getIVS(): Uint16Array | Uint32Array;
    /**
     * 
     * @param objDataStr obj format data string
     * @param dataIsZxy the default value is false
     */
    parse(objDataStr: string, dataIsZxy?: boolean): void;
}