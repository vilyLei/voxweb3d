
/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

export default interface IVtxShdCtr {
    getLayoutBit(): number;
    getMid(): number;
    getLocationsTotal(): number;
    getLocationTypeByIndex(index: number): number;
    getLocationSizeByIndex(index: number): number;
    /**
     * test whether these vertex attributes data pointer offset can match
     * @param offsetList vertex attribute data pointer offset
     */
    testVertexAttribPointerOffset(offsetList: number[]): boolean
    testVertexAttribPointerType(attribType: number): boolean;
    vertexAttribPointerTypeFloat(attribType: number, stride: number, offset: number): void;
    getVertexAttribByTpye(attribType: number): number;
    getLocationTypes(): number[];
    getLocationIVS(): number[];
}
