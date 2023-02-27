/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

// import RenderDrawMode from "../RenderDrawMode";
import IVtxDrawingInfo from "./IVtxDrawingInfo";
import { IROIvsRDP } from "./IROIvsRDP";
export default class VtxDrawingInfo implements IVtxDrawingInfo {
    
    private static s_uid = 0;
    private m_uid = VtxDrawingInfo.s_uid++;

    private m_ivsIndex = -1;
    private m_ivsCount = -1;
    private m_wireframe = false;
    private m_flag = 0;

    rdp: IROIvsRDP = null;
    constructor(){}
    destroy(): void {
        if(this.rdp != null) {
            this.rdp.clear();
            this.rdp = null;
        }
    }
    setWireframe(wireframe: boolean): void {
        if(this.m_wireframe != wireframe) {
            this.m_wireframe = wireframe;
            this.m_flag ++;
        }
        console.log("VtxDrawingInfo::setWireframe(), this.m_flag: ", this.m_flag);
    }
    setIvsParam(ivsIndex: number = -1, ivsCount: number = -1): void {
        if(ivsIndex >= 0) {
            this.m_ivsIndex = ivsIndex;
            this.m_flag ++;
        }
        if(ivsCount >= 0) {
            this.m_ivsCount = ivsCount;
            this.m_flag ++;
        }
        console.log("VtxDrawingInfo::setIvsParam(), this.m_flag: ", this.m_flag);
    }
    reset(): void {
        this.m_flag = 0;
    }
    __$$copyToRDP(): boolean {

        // console.log("__$$copyToRDP() ...rdp.getUid(): ", rdp.getUid());
        if(this.rdp != null) {
            const rdp = this.rdp;
            // console.log("info rdp.getUid(): ", rdp.getUid(), this.m_uid);
            if(this.m_flag > 0) {
                console.log("__$$copyToRDP() ...rdp.getUid(): ", rdp.getUid(), ", this.m_uid: ", this.m_uid);
                rdp.setIvsParam(this.m_ivsIndex, this.m_ivsCount);
    
                if(this.m_wireframe) {
                    rdp.toWireframe();
                }else {
                    rdp.toCommon();
                }
                this.reset();
            }
            return rdp.test();
        }
        return false;
    }
    // clone(): VtxDrawingInfo {
    //     let rd = new VtxDrawingInfo();
    //     rd.m_ivsIndex = this.m_ivsIndex;
    //     rd.m_ivsCount = this.m_ivsCount;
    //     rd.m_wireframe = this.m_wireframe;
    //     return rd;
    // }
}
