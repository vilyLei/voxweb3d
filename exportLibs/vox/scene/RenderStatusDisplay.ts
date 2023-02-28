/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */

import EventBase from "../event/EventBase";
import IEventBase from "../event/IEventBase";
import IRendererScene from "./IRendererScene";

/***************************************************************************/
interface I_RenderStatusDisplay {

}
class RenderStatusDisplay {
    private m_rsc: IRendererScene;
    private m_lastTime = 0;
    private m_fps = 60;
    private m_canvas2D: any = null;
    private m_ctx2D: any = null;
    private m_delayTime = 10;
    private m_preWidth = 128;
    private m_width = 128;
    private m_height = 70;
    private m_auto = false;
    delayTime = 40;
    statusInfo = "";
    statusEnbled = true;

    constructor(rsc: IRendererScene = null, auto: boolean = false) {
        if(rsc != null) {
            this.initialize(rsc, auto);
        }
    }

    initialize(rsc: IRendererScene = null, auto: boolean = false): void {

        if (this.m_canvas2D == null) {
            this.m_rsc = rsc;
            this.m_auto = auto;

            var pdocument: any = null;
            try {
                if (document != undefined) {
                    pdocument = document;
                }
            }
            catch (err) {
                console.log("RenderStatusDisplay::initialize(), document is undefined.");
            }
            if (pdocument != null) {
                this.m_preWidth = window.innerWidth;
                let pwith: number = this.m_preWidth - 20;
                this.createCanvas(pwith);
            }
            if(rsc != null && this.m_auto) {
                this.m_rsc.addEventListener(EventBase.ENTER_FRAME, this, this.enterFrame);
                this.autoUpdate();
            }
        }
    }
    private enterFrame(evt: IEventBase): void {

        this.updateDo(false);
    }
    private m_timeoutId: any = -1;

    private autoUpdate(): void {
        if (this.m_timeoutId > -1) {
            clearTimeout(this.m_timeoutId);
        }
        //this.m_timeoutId = setTimeout(this.update.bind(this),16);// 60 fps
        this.m_timeoutId = setTimeout(this.update.bind(this), 50);// 20 fps

        this.renderDo();
    }
    private createCanvas(width: number): void {

        if (this.m_canvas2D == null) {
            this.m_canvas2D = document.createElement('canvas');
            document.body.appendChild(this.m_canvas2D);
            this.m_canvas2D.style.display = 'bolck';
            this.m_canvas2D.style.left = '0px';
            this.m_canvas2D.style.top = '0px';
            this.m_canvas2D.style.position = 'absolute';
            this.m_canvas2D.style.backgroundColor = 'transparent';
            this.m_canvas2D.style.pointerEvents = 'none';
            this.m_canvas2D.height = this.m_height;
        }
        width = width < 10 ? 10 : width;
        this.m_canvas2D.width = width;
        this.m_ctx2D = this.m_canvas2D.getContext("2d");
        this.m_ctx2D.font = "50px Verdana";
        this.m_ctx2D.fillStyle = "red";
        this.m_ctx2D.textAlign = "left";
        this.m_width = this.m_canvas2D.width;
    }
    getFPS(): number { return this.m_fps; };
    getFPSStr(): string {
        //return this.m_fps;
        if (this.m_fps > 60) {
            return "FPS: 60";
        }
        else if (this.m_fps < 10) {
            return "FPS: 0" + this.m_fps;
        }
        return "FPS: " + this.m_fps;
    }

    private renderDo(): void {
        
        if (this.m_preWidth != window.innerWidth) {
            this.m_preWidth = window.innerWidth;
            let pwith: number = this.m_preWidth - 20;
            this.createCanvas(pwith);
        }
        if (this.statusEnbled) {
            this.m_ctx2D.clearRect(0, 0, this.m_width, this.m_height);
            this.m_ctx2D.fillText("FPS:" + this.m_fps + this.statusInfo, 5, 50);
            //  this.m_ctx2D.fillRect(0, 0, this.m_width, this.m_height);
        }
    }
    private updateDo(immediaterender: boolean = true): void {
        if (this.m_delayTime > 0) {
            --this.m_delayTime;
            this.m_lastTime = Date.now();
        }
        else {
            if (this.m_ctx2D != null) {
                let t = Date.now();
                if (this.m_lastTime > 0) {
                    this.m_lastTime = t - this.m_lastTime;
                    if (this.m_lastTime < 1) this.m_lastTime = 1;
                    this.m_fps = Math.round(1000.0 / this.m_lastTime);
                    if (immediaterender) {
                        this.render();
                    }
                }
                this.m_lastTime = t;
            }
            this.m_delayTime = this.delayTime;
        }
    }
    render(): void {
        if(!this.m_auto) {
            this.renderDo();
        }
    }
    update(immediaterender: boolean = true): void {
        if(!this.m_auto) {
            this.updateDo(immediaterender);
        }
    }
}

export default RenderStatusDisplay;