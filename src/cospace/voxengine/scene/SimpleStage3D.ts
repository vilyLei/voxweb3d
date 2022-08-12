/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import { IShaderUniformProbe } from "../../../vox/material/IShaderUniformProbe";
import IRenderStage3D from "../../../vox/render/IRenderStage3D";

class SimpleStage3D implements IRenderStage3D {
    private m_rcuid: number = 0;
    private static s_document: any = null;

    uProbe: IShaderUniformProbe = null;

    pixelRatio: number = 1.0;
    stageWidth: number = 800;
    stageHeight: number = 600;
    // 实际宽高, 和gpu端对齐
    stageHalfWidth: number = 400;
    stageHalfHeight: number = 300;
    mouseX: number = 0;
    mouseY: number = 0;
    // sdiv页面实际占据的像素宽高
    viewWidth: number = 800;
    viewHeight: number = 600;
    mouseViewX: number = 0;
    mouseViewY: number = 0;
    constructor(rcuid: number, pdocument: any) {
        this.m_rcuid = rcuid;
        if (SimpleStage3D.s_document == null) {
            SimpleStage3D.s_document = pdocument;
        }
    }
    /**
     * @returns return renderer context unique id
     */
    getRCUid(): number {
        return this.m_rcuid;
    }
    private m_viewX: number = 0.0;
    private m_viewY: number = 0.0;
    private m_viewW: number = 1.0
    private m_viewH: number = 1.0;

    private m_preStageWidth: number = 0;
    private m_preStageHeight: number = 0;
    // 是否舞台尺寸和view自动同步一致
    private m_autoSynViewAndStageSize: boolean = true;
    getDevicePixelRatio(): number {
        return window.devicePixelRatio;
    }
    getViewX(): number {
        return this.m_viewX;
    }
    getViewY(): number {
        return this.m_viewY;
    }
    getViewWidth(): number {
        return this.m_viewW;
    }
    getViewHeight(): number {
        return this.m_viewH;
    }
    setViewPort(px: number, py: number, pw: number, ph: number): void {
        this.m_autoSynViewAndStageSize = false;
        this.m_viewX = px;
        this.m_viewY = py;
        if (pw != this.m_viewW || ph != this.m_viewH) {
            this.m_viewW = pw;
            this.m_viewH = ph;
            this.updateViewUData();
        }
    }
    private updateViewUData(): void {
        this.uProbe.setVec4Data(2.0 / this.stageWidth, 2.0 / this.stageHeight, this.stageWidth, this.stageHeight);
        this.uProbe.update();
        this.m_preStageWidth = this.m_viewW;
        this.m_preStageHeight = this.m_viewH;

    }
    update(): void {
        if (this.m_preStageWidth != this.stageWidth || this.m_preStageHeight != this.stageHeight) {
            if (this.m_autoSynViewAndStageSize) {
                this.m_viewW = this.stageWidth;
                this.m_viewH = this.stageHeight;
                this.updateViewUData();
            }
            this.stageHalfWidth = 0.5 * this.stageWidth;
            this.stageHalfHeight = 0.5 * this.stageHeight;
        }
    }
    mouseDown(phase: number = 1): void {
    }
    mouseUp(phase: number = 1): void {
    }
    mouseClick(): void {
    }
    mouseDoubleClick(): void {
    }
    mouseRightDown(phase: number = 1): void {
    }
    mouseRightUp(phase: number = 1): void {
    }


    mouseBgDown(): void {
    }
    mouseBgUp(): void {
    }
    mouseBgClick(): void {
    }

    mouseRightClick(): void {
    }
    mouseMove(): void {
    }
    mouseWheel(evt: any): void {
    }
    // 等同于 touchCancle
    mouseCancel(): void {
    }
    //param [{x,y},{x,y},...]
    mouseMultiDown(posArray: any[]): void {
    }
    //param [{x,y},{x,y},...]
    mouseMultiUp(posArray: any[]): void {
    }
    //param [{x,y},{x,y},...]
    mouseMultiMove(posArray: any[]): void {
    }

    mouseWindowUp(phase: number = 1): void {
    }
    mouseWindowRightUp(phase: number = 1): void {
    }
    enterFrame(): void {
    }
    addEventListener(type: number, target: any, func: (evt: any) => void, captureEnabled: boolean = true, bubbleEnabled: boolean = true): void {

    }
    removeEventListener(type: number, target: any, func: (evt: any) => void): void {

    }
}
export default SimpleStage3D;
