/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

interface IROIvsRD {
    setIvsParam(ivsIndex: number, ivsSize: number): void;
}
interface IROIvsRDP {
    
    r0: IROIvsRD;
    r1: IROIvsRD;
    ver: number;

    getUid(): number;
    applyRDPAt(index: number): void;
    setIvsParam(ivsIndex: number, ivsSize: number): void;
    setInsCount(insCount: number): void;
    toWireframe(): void;
    toShape(): void;
    toCommon(): void;
    isCommon(): boolean;
    // use(): void;
    clear(): void;
    test(): boolean;
}

export { IROIvsRD, IROIvsRDP };
