/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

// import RenderDrawMode from "../RenderDrawMode";
import { IROIvsRDP } from "./IROIvsRDP";
export default interface IVtxDrawingInfo {
    
    toStatic(): void;
    toDynamic(): void;
    setWireframe(wireframe: boolean): void;
    /**
     * @param ivsIndex the default value is -1
     * @param ivsCount the default value is -1 
     */
    setIvsParam(ivsIndex: number, ivsCount: number): void;
    applyIvsDataAt(index: number): void;
    reset(): void;
    // __$$copyToRDP(rdp: IROIvsRDP): void;
    // clone(): IVtxDrawingInfo;
    destroy(): void;
}
