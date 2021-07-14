/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import UniformVec4Probe from "../../vox/material/UniformVec4Probe";

interface IRenderStage3D
{
    uProbe:UniformVec4Probe;
    /**
     * @returns return renderer context unique id
     */
    getRCUid():number;
    pixelRatio:number;// = 1.0;
    stageWidth:number;// = 800;
    stageHeight:number;// = 600;
    // 实际宽高, 和gpu端对齐
    stageHalfWidth:number;// = 400;
    stageHalfHeight:number;// = 300;
    mouseX:number;// = 0;
    mouseY:number;// = 0;
    // sdiv页面实际占据的像素宽高
    viewWidth:number;// = 800;
    viewHeight:number;// = 600;
    mouseViewX:number;// = 0;
    mouseViewY:number;// = 0;
    
    getDevicePixelRatio():number;
    getViewX():number;
    getViewY():number;
    getViewWidth():number;
    getViewHeight():number;
    setViewPort(px:number,py:number,pw:number,ph:number):void;
    
    update():void;
    
    mouseWindowUp(phase:number):void;
    mouseWindowRightUp(phase:number):void;

    mouseDown(phase:number):void;
    mouseUp(phase:number):void;
    mouseBgDown():void;
    mouseBgUp():void;
    mouseClick():void;
    mouseDoubleClick():void;
    mouseRightDown(phase:number):void;
    mouseRightUp(phase:number):void;
    
    mouseRightClick():void;
    mouseMove():void;
    mouseWheel(evt:any):void;
    // 等同于 touchCancle
    mouseCancel():void;
    //param [{x,y},{x,y},...]
    mouseMultiDown(posArray:any[]):void;
    //param [{x,y},{x,y},...]
    mouseMultiUp(posArray:any[]):void;
    //param [{x,y},{x,y},...]
    mouseMultiMove(posArray:any[]):void;
    addEventListener(type:number,target:any,func:(evt:any)=>void,captureEnabled:boolean,bubbleEnabled:boolean):void;
    removeEventListener(type:number,target:any,func:(evt:any)=>void):void;
}

export default IRenderStage3D;