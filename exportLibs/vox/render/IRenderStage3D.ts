/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import {IShaderUniformProbe} from "../../vox/material/IShaderUniformProbe";

interface IRenderStage3D {
    
    uProbe: IShaderUniformProbe;
    /**
     * @returns return renderer context unique id
     */
    getRCUid(): number;
    /**
     * the default value is 1.0
     */
    pixelRatio: number;
    /**
     * gpu backbuffer pixel width, the default value is 800
     */
    stageWidth: number;
    /**
     * gpu backbuffer pixel height, the default value is 600
     */
    stageHeight: number;
    /**
     * the default value is 400
     */
    stageHalfWidth: number;
    /**
     * the default value is 300
     */
    stageHalfHeight: number;
    mouseX: number;
    mouseY: number;
    /**
     * div pixel width, the default vallue is 400
     */
    viewWidth: number;
    /**
     * div pixel height, the default vallue is 300
     */
    viewHeight: number;
    mouseViewX: number;
    mouseViewY: number;

    getDevicePixelRatio(): number;
    getViewX(): number;
    getViewY(): number;
    getViewWidth(): number;
    getViewHeight(): number;
    setViewPort(px: number, py: number, pw: number, ph: number): void;
    enterFrame(): void;
    update(): void;

    mouseWindowUp(phase?: number): void;
    mouseWindowRightUp(phase?: number): void;

    mouseDown(phase?: number): void;
    mouseUp(phase?: number): void;
    mouseClick(): void;

    mouseBgDown(): void;
    mouseBgUp(): void;
    mouseBgClick(): void;
    mouseBgRightDown(): void;
    mouseBgRightUp(): void;
    mouseBgMiddleDown(): void;
    mouseBgMiddleUp(): void;

    mouseDoubleClick(): void;
    mouseRightDown(phase?: number): void;
    mouseRightUp(phase?: number): void;
    mouseMiddleDown(phase?: number): void;
    mouseMiddleUp(phase?: number): void;

    mouseRightClick(): void;
    mouseMove(): void;
    mouseWheel(evt: any): void;
    // 等同于 touchCancle
    mouseCancel(): void;
    //param [{x,y},{x,y},...]
    mouseMultiDown(posArray: any[]): void;
    //param [{x,y},{x,y},...]
    mouseMultiUp(posArray: any[]): void;
    //param [{x,y},{x,y},...]
    mouseMultiMove(posArray: any[]): void;
    /**
     * @param type event type
     * @param target event listerner
     * @param func event listerner callback function
     * @param captureEnabled the default value is true
     * @param bubbleEnabled the default value is false
     */
    addEventListener(type: number, target: any, func: (evt: any) => void, captureEnabled?: boolean, bubbleEnabled?: boolean): void;
    removeEventListener(type: number, target: any, func: (evt: any) => void): void;
}

export default IRenderStage3D;