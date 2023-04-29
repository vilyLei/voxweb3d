/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

export default interface IVtxDrawingInfo {
    
    lock(): void;
    unlock(): void;
    isUnlock(): boolean;
    setInstanceCount(insCount: number): void;
    setWireframe(wireframe: boolean): void;
    /**
     * @param ivsIndex the default value is -1
     * @param ivsCount the default value is -1 
     */
    setIvsParam(ivsIndex: number, ivsCount: number): void;
    applyIvsDataAt(index: number): void;
    reset(): void;
    destroy(): void;
}
