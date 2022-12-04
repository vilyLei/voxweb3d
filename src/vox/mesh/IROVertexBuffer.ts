/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

interface IROVertexBuffer {
    
    getUid(): number;
    getType(): number;
    
    getIBufStep(): number;
    getBufDataUsage(): number;
    getBuffersTotal(): number;    
    getAttribsTotal(): number;
    
    setBufSortFormat(layoutBit: number): void;
    getBufSortFormat(): number;
}
export { IROVertexBuffer }