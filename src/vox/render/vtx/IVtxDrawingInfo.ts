/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

// import RenderDrawMode from "../RenderDrawMode";
import { IROIvsRDP } from "./IROIvsRDP";
export default interface IVtxDrawingInfo {
    
    setWireframe(wireframe: boolean): void;
    /**
     * @param ivsIndex the default value is -1
     * @param ivsCount the default value is -1 
     */
    setIvsParam(ivsIndex: number, ivsCount: number): void;
    reset(): void;
    // __$$copyToRDP(rdp: IROIvsRDP): void;
    // clone(): IVtxDrawingInfo;
    destroy(): void;
}
