/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

interface IROVertexBuffer {
    
    getUid(): number;
    getType(): number;
    
    getIvsUnitBytes(): number;
    getBufDataUsage(): number;
    getBuffersTotal(): number;    
    getAttribsTotal(): number;
    
    setBufSortFormat(layoutBit: number): void;
    getBufSortFormat(): number;
}
export { IROVertexBuffer }