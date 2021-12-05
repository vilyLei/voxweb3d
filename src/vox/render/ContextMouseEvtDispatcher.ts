/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import DivLog from "../../vox/utils/DivLog";
import RendererDevice from "../../vox/render/RendererDevice";
import IRenderStage3D from "../../vox/render/IRenderStage3D";

class ContextMouseEvtDispatcher {
    private m_singleDown: boolean = false;
    private m_mouseX: number = 0;
    private m_mouseY: number = 0;
    private m_mouseClickTime: number = 0;
    dpr: number = 1.0;
    constructor() {
    }
    initMobile(canvas: any, div: any, stage: IRenderStage3D): void {
        var pdocument: any = null;
        try {
            if (document != undefined) {
                pdocument = document;
            }
        }
        catch (err) {
            console.log("ContextMouseEvtDispatcher::initMobile(), document is undefined.");
        }
        if (pdocument != null) {
            let selfT: ContextMouseEvtDispatcher = this;
            div.addEventListener('touchstart', (evt: any): void => {
                /*
                e.touches：当前位于屏幕上的所有手指的列表
                e.targetTouches：位于当前DOM元素上手指的列表
                e.changedTouches：涉及当前事件手指的列表
                */
                //获取手指的位置

                let list: any[] = evt.targetTouches;
                let px: number = 0;
                let py: number = 0;
                if (list.length < 2) {
                    px = 0 | (this.dpr * evt.targetTouches[0].pageX);
                    py = 0 | (this.dpr * evt.targetTouches[0].pageY);

                    stage.mouseX = px;
                    stage.mouseY = stage.stageHeight - py;
                    stage.mouseViewX = px;
                    stage.mouseViewY = py;
                    this.m_singleDown = true;
                    this.m_mouseX = stage.mouseX;
                    this.m_mouseY = stage.mouseY;
                    this.m_mouseClickTime = Date.now();
                    stage.mouseDown(1);
                }
                else {
                    let posArray: any[] = [];
                    for (let i: number = 0; i < list.length; ++i) {
                        px = 0 | (this.dpr * evt.targetTouches[i].pageX);
                        py = 0 | (this.dpr * evt.targetTouches[i].pageY);
                        posArray.push({ x: px, y: py });
                    }
                    stage.mouseMultiDown(posArray);
                    this.m_singleDown = false;
                }

                evt.preventDefault();
                evt.stopPropagation();
            }, false)
            div.addEventListener('touchend', (evt: any): void => {
                //获取手指的位置
                this.m_singleDown = false;
                let list: any[] = evt.targetTouches;
                let px = 0;
                let py = 0;
                if (list.length < 1) {
                    stage.mouseUp(1);                    
                    this.m_mouseClickTime = Date.now() - this.m_mouseClickTime;
                    if(Math.abs(this.m_mouseX - stage.mouseX) < 3 && Math.abs(this.m_mouseY - stage.mouseY) < 3 && this.m_mouseClickTime < 900) {
                        this.m_mouseX = stage.mouseX;
                        this.m_mouseY = stage.mouseY;
                        stage.mouseClick();
                    }
                }
                else {
                    let posArray: any[] = [];
                    for (let i: number = 0; i < list.length; ++i) {
                        px = 0 | (this.dpr * evt.targetTouches[i].pageX);
                        py = 0 | (this.dpr * evt.targetTouches[i].pageY);
                        posArray.push({ x: px, y: py });
                    }
                    stage.mouseMultiUp(posArray);
                }

                evt.preventDefault();
            }, false);
            div.addEventListener('touchcancel', (e: any): void => {
                //获取手指的位置
                selfT.m_singleDown = false;
                let list: any[] = e.targetTouches;
                stage.mouseCancel();
                e.preventDefault();

            }, false);

            div.addEventListener('touchmove', (evt: any): void => {
                evt.preventDefault(); //阻止屏幕滚动的默认行为
                let list: any[] = evt.targetTouches;
                let px: number = 0;
                let py: number = 0;
                if (this.m_singleDown) {
                    px = 0 | (this.dpr * list[0].pageX);
                    py = 0 | (this.dpr * list[0].pageY);
                    stage.mouseViewX = px;
                    stage.mouseViewY = py;
                    stage.mouseX = px;
                    stage.mouseY = stage.stageHeight - py;
                    stage.mouseMove();
                }
                if (list.length > 1) {
                    let posArray: any[] = [];
                    for (let i: number = 0; i < list.length; ++i) {
                        px = 0 | (this.dpr * evt.targetTouches[i].pageX);
                        py = 0 | (this.dpr * evt.targetTouches[i].pageY);
                        posArray.push({ x: px, y: py });
                    }
                    stage.mouseMultiMove(posArray);
                }
                //DivLog.ShowLog("touchmove "+list.length+", px,py: "+(px|0)+","+(0|py));
            }, { passive: false }, false);

            if (RendererDevice.IsIpadOS()) {
                let meta = document.createElement('meta');
                meta.name = "viewport";
                meta.content = "width=device-width,initial-scale=1.0,minimum-scale=1.0, maximum-scale=1.0, user-scalable=no";
                document.getElementsByTagName('head')[0].appendChild(meta);
            }
        }
    }
    initialize(canvas: any, div: any, stage: IRenderStage3D): void {
        if (RendererDevice.IsMobileWeb() || RendererDevice.IsIpadOS()) {
            this.initMobile(canvas, div, stage);
        }
        else {
            this.initPC(canvas, div, stage);
            this.initMobile(canvas, div, stage);
        }
    }
    private initPC(canvas: any, div: any, stage: IRenderStage3D): void {
        var pdocument: any = null;
        try {
            if (document != undefined) {
                pdocument = document;
            }
        }
        catch (err) {
            console.log("ContextMouseEvtDispatcher::initPC(), document is undefined.");
        }
        if (pdocument != null) {
            if (canvas.onmousewheel == undefined && canvas.addEventListener != undefined) {
                //use firefox browser mousewheel evt
                let func: any = function (evt: any): void {
                    evt.wheelDeltaY = -evt.detail;
                    stage.mouseWheel(evt);
                }
                canvas.addEventListener('DOMMouseScroll', func, false);
            }
            canvas.onmousewheel = (evt: any): void => {
                evt.preventDefault();
                evt.stopPropagation();
                stage.mouseWheel(evt);
            }
            canvas.onmousedown = (evt: any): void => {
                let rect: any = div.getBoundingClientRect();
                let px = 0 | (this.dpr * (evt.clientX - rect.left));
                let py = 0 | (this.dpr * (evt.clientY - rect.top));
                stage.mouseX = px;
                stage.mouseY = stage.stageHeight - py;
                stage.mouseViewX = px;
                stage.mouseViewY = py;
                this.m_mouseX = stage.mouseX;
                this.m_mouseY = stage.mouseY;
                this.m_mouseClickTime = Date.now();
                
                if (evt.button == 0) {
                    stage.mouseDown(1);
                } else if (evt.button == 2) {
                    stage.mouseRightDown(1);
                }
            }
            
            canvas.onmouseup = (evt: any): void => {
                let rect = div.getBoundingClientRect();
                let px = 0 | (this.dpr * (evt.clientX - rect.left));
                let py = 0 | (this.dpr * (evt.clientY - rect.top));
                stage.mouseX = px;
                stage.mouseY = stage.stageHeight - py;

                // console.log("ContextMouseEvtDispatcher::onmouseup(),"+stage.mouseViewX+","+stage.mouseViewY);
                if (evt.button == 0) {
                    stage.mouseUp(1);
                }
                else if (evt.button == 2) {
                    stage.mouseRightUp(1);
                }
            }
            
            document.onmouseup = (evt: any): void => {
                if (evt.button == 0) {
                    stage.mouseWindowUp(1);
                }
                else if (evt.button == 2) {
                    stage.mouseWindowRightUp(1);
                }
            }
            
            canvas.onmousemove = (evt: any): void => {
                // console.log("ContextMouseEvtDispatcher::onmouseMove"+evt.pageX+","+evt.pageY);
                let rect: any = div.getBoundingClientRect();
                let px = 0 | (this.dpr * (evt.clientX - rect.left));
                let py = 0 | (this.dpr * (evt.clientY - rect.top));
                stage.mouseX = px;
                stage.mouseY = stage.stageHeight - py;
                stage.mouseViewX = px;
                stage.mouseViewY = py;
                stage.mouseMove();
            }

            canvas.onclick = (evt: any): void => {
                let rect: any = div.getBoundingClientRect();
                let px = 0 | (this.dpr * (evt.clientX - rect.left));
                let py = 0 | (this.dpr * (evt.clientY - rect.top));
                stage.mouseX = px;
                stage.mouseY = stage.stageHeight - py;
                stage.mouseViewX = px;
                stage.mouseViewY = py;

                this.m_mouseClickTime = Date.now() - this.m_mouseClickTime;
                if(Math.abs(this.m_mouseX - stage.mouseX) < 3 && Math.abs(this.m_mouseY - stage.mouseY) < 3 && this.m_mouseClickTime < 900) {
                    this.m_mouseX = stage.mouseX;
                    this.m_mouseY = stage.mouseY;
                    //console.log("ContextMouseEvtDispatcher::onclick()," + stage.mouseViewX + "," + stage.mouseViewY + ",evt.button: " + evt.button);
                    if (evt.button == 0) {
                        stage.mouseClick();
                    } else if (evt.button == 2) {
                        stage.mouseRightClick();
                    }
                }
            }
            canvas.ondblclick = (evt: any): void => {
                let rect: any = div.getBoundingClientRect();
                let px = 0 | (this.dpr * (evt.clientX - rect.left));
                let py = 0 | (this.dpr * (evt.clientY - rect.top));
                stage.mouseX = px;
                stage.mouseY = stage.stageHeight - py;
                stage.mouseViewX = px;
                stage.mouseViewY = py;
                // console.log("ContextMouseEvtDispatcher::ondoubleclick()," + stage.mouseViewX + "," + stage.mouseViewY + ",evt.button: " + evt.button);
                if (evt.button == 0) {
                    stage.mouseDoubleClick();
                } else if (evt.button == 2) {
                    //stage.mouseRightDoubleClick();
                }
            }
        }
    }
}

export default ContextMouseEvtDispatcher;