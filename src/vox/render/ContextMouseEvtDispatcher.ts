/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2023 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import DivLog from "../../vox/utils/DivLog";
import RendererDevice from "../../vox/render/RendererDevice";
import IRenderStage3D from "../../vox/render/IRenderStage3D";

class SysEvtNode {
	ls: any[] = [];
	funcs: ((evt: any) => void)[] = [];
	constructor(){
	}
	add(l: any, func: (evt: any) => void): void {
		let i = 0;
		let ls = this.ls;
		for(; i < this.ls.length; ++i) {
			if(l == ls[i]) {
				break;
			}
		}
		if(i >= this.ls.length) {
			ls.push(l);
			this.funcs.push(func);
		}
	}
	remove(l: any): void {
		let ls = this.ls;
		for(let i = 0; i < this.ls.length; ++i) {
			if(l == ls[i]) {
				ls.splice(i, 1);
				this.funcs.splice(i, 1);
				break;
			}
		}
	}
	run(evt: any): void {
		for(let i = 0; i < this.ls.length; ++i) {
			this.funcs[i](evt);
		}
	}
}
class SysEvtMana {
	evts: SysEvtNode[] = null;
	constructor(){
	}
	init(): void {
		if(this.evts == null) {
			this.evts = [];
			for(let i = 0; i < 2; ++i) {
				this.evts.push( new SysEvtNode() );
				// [new SysEvtNode(), new SysEvtNode()]
			}
		}
		var pdocument: any = null;
        var pwindow: any = null;
        if (document) {
			pdocument = document;
			pwindow = window;
			pdocument.onmouseup = (evt: any): void => {
				this.evts[1].run( evt );
			}
		}
		if(pwindow) {
			pwindow.onresize = (evt: any): void => {
				this.evts[0].run( evt );
			}
		}

	}
	addWindowResizeEvt(l: any, func: (evt: any) => void): void {
		this.evts[0].add(l, func);
	}
	removeWindowResizeEvt(l: any): void {
		this.evts[0].remove(l);
	}

	addDocMouUpEvt(l: any, func: (evt: any) => void): void {
		this.evts[1].add(l, func);
	}
	removeDocMouUpEvt(l: any): void {
		this.evts[1].remove(l);
	}
}
class ContextMouseEvtDispatcher {
    private m_singleDown = false;
    private m_mouseX = 0;
    private m_mouseY = 0;
    private m_mouseClickTime = 0;
	private static s_sevt = new SysEvtMana();
	sysEvt: SysEvtMana = null;
    dpr = 1.0;
    constructor() {
		this.sysEvt = ContextMouseEvtDispatcher.s_sevt;
		this.sysEvt.init();
    }
    initMobile(canvas: any, div: any, stage: IRenderStage3D): void {
        var pdocument: any = null;
        try {
            if (document) {
                pdocument = document;
            }
        }
        catch (err) {
            console.log("ContextMouseEvtDispatcher::initMobile(), document is undefined.");
        }
        if (pdocument) {
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
                    if (Math.abs(this.m_mouseX - stage.mouseX) < 2 && Math.abs(this.m_mouseY - stage.mouseY) < 2 && this.m_mouseClickTime < 900) {
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
	private m_canvas: HTMLCanvasElement = null;
    private initPC(canvas: any, div: any, stage: IRenderStage3D): void {
        var pdocument: any = null;
		if(this.m_canvas != null) {
			let pcanvas = this.m_canvas as any;
			pcanvas.onmousewheel = null;
			pcanvas.onmousedown = null;
			pcanvas.onmouseup = null;
			pcanvas.onmousemove = null;
			pcanvas.onclick = null;
			pcanvas.canvas = null;
		}
        try {
            if (document != undefined) {
                pdocument = document;
            }
        }
        catch (err) {
            console.log("ContextMouseEvtDispatcher::initPC(), document is undefined.");
        }
        if (pdocument != null) {
			this.m_canvas = canvas;
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

                // console.log("ContextMouseEvtDispatcher::onmousedown(),evt.button: ", evt.button);

                if (evt.button == 0) {
                    stage.mouseDown(1);
                } else if (evt.button == 1) {
                    stage.mouseMiddleDown();
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

                // console.log("ContextMouseEvtDispatcher::onmouseup(),evt.button: ", evt.button);

                if (evt.button == 0) {
                    stage.mouseUp(1);
                } else if (evt.button == 1) {
                    stage.mouseMiddleUp();
                } else if (evt.button == 2) {
                    stage.mouseRightUp(1);
                }
            }
            // document.onmouseup = (evt: any): void => {
            //     if (evt.button == 0) {
            //         stage.mouseWindowUp(1);
            //     }
            //     else if (evt.button == 1) {
            //         // stage.mouseMiddleUp();
            //     }
            //     else if (evt.button == 2) {
            //         stage.mouseWindowRightUp(1);
            //     }
            // }
            let docOnmouseup = (evt: any): void => {
                if (evt.button == 0) {
                    stage.mouseWindowUp(1);
                }
                else if (evt.button == 1) {
                    // stage.mouseMiddleUp();
                }
                else if (evt.button == 2) {
                    stage.mouseWindowRightUp(1);
                }
            }
			this.sysEvt.addDocMouUpEvt(this, docOnmouseup);

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
                if (Math.abs(this.m_mouseX - stage.mouseX) < 2 && Math.abs(this.m_mouseY - stage.mouseY) < 2 && this.m_mouseClickTime < 900) {
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
                    // stage.mouseRightDoubleClick();
                }
            }
        }
    }
}

export default ContextMouseEvtDispatcher;
