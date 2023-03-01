/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import IVDRInfo from "./IVDRInfo";
import { IROIvsRDP } from "./IROIvsRDP";
export default class EmptyVDRInfo implements IVDRInfo {

    rdp: IROIvsRDP = null;
    constructor() { }
    destroy(): void {
        if (this.rdp != null) {
            this.rdp.clear();
            this.rdp = null;
        }
    }
    lock(): void {
    }
    unlock(): void {
    }
    isUnlock(): boolean {
        return false;
    }
    setInstanceCount(insCount: number): void {        
    }
    setWireframe(wireframe: boolean): void {
    }
    applyIvsDataAt(index: number): void {
    }
    setIvsParam(ivsIndex: number = -1, ivsCount: number = -1): void {
    }
    reset(): void {
    }
    __$$copyToRDP(): boolean {
        return false;
    }
}
