/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import MouseEvent from "../../../vox/event/MouseEvent";
import RendererState from "../../../vox/render/RendererState";
import RendererSubScene from "../../../vox/scene/RendererSubScene";
import ColorRectImgButton from "../../../orthoui/button/ColorRectImgButton";
import ImageTextureProxy from "../../../vox/texture/ImageTextureProxy";
import DisplayEntityContainer from "../../../vox/entity/DisplayEntityContainer";
import UITexTool from "./UITexTool";
import Plane3DEntity from "../../../vox/entity/Plane3DEntity";
import BoundsButton from "../../button/BoundsButton";
import MathConst from "../../../vox/math/MathConst";
import TextureProxy from "../../../vox/texture/TextureProxy";
import EventBaseDispatcher from "../../../vox/event/EventBaseDispatcher";
import ProgressDataEvent from "../../../vox/event/ProgressDataEvent";
import EventBase from "../../../vox/event/EventBase";

export class ProgressBar {
    private m_ruisc: RendererSubScene = null;
    private m_dispatcher: EventBaseDispatcher = new EventBaseDispatcher();
    private m_progressEvt: ProgressDataEvent = new ProgressDataEvent();

    private m_container: DisplayEntityContainer = null;
    private m_addBtn: ColorRectImgButton = null;
    private m_subBtn: ColorRectImgButton = null;
    private m_nameBtn: ColorRectImgButton = null;
    private m_barBoundsBtn: BoundsButton = null;
    private m_barPlane: Plane3DEntity = null;

    private m_btnSize: number = 64;
    private m_barInitLength: number = 1.0;
    private m_barLength: number = 1.0;
    private m_barBgX: number = 1.0;
    private m_progress: number = 0.0;
    private m_progressName: string = "";

    private m_posZ: number = 0.0;
    private m_value: number = 0.0;
    
    uuid: string = "ProgressBar";

    minValue: number = 0.0;
    maxValue: number = 1.0;
    step: number = 1.0;
    constructor() { }

    initialize(ruisc: RendererSubScene,name:string = "", btnSize: number = 64.0, barBgLength: number = 200.0): void {
        console.log("ProgressBar::initialize()......, ruisc: ", ruisc);
        if (this.m_ruisc == null) {

            this.m_ruisc = ruisc;
            this.m_progressName = name;
            this.m_btnSize = btnSize;
            this.m_barInitLength = barBgLength;

            this.initBody();
        }
    }
    
    addEventListener(type: number, listener: any, func: (evt: any) => void, captureEnabled: boolean = true, bubbleEnabled: boolean = false): void {
        this.m_dispatcher.addEventListener(type, listener, func, captureEnabled, bubbleEnabled);
    }
    removeEventListener(type: number, listener: any, func: (evt: any) => void): void {
        this.m_dispatcher.removeEventListener(type, listener, func);
    }
    
    setXY(px: number, py: number, force: boolean = true): void {
        if (this.m_container != null) {
            this.m_container.setXYZ(px, py, this.m_posZ);
            if (force)
                this.m_container.update();
        }
    }
    private initBody(): void {

        let size: number = this.m_btnSize;
        let container: DisplayEntityContainer = new DisplayEntityContainer();
        this.m_container = container;

        if(this.m_progressName != null && this.m_progressName.length > 0) {
            let tex:TextureProxy = UITexTool.GetInstance().createCharTexture(this.m_progressName, size, "rgba(180,180,180,1.0)");
            let nameBtn: ColorRectImgButton = new ColorRectImgButton();
            nameBtn.premultiplyAlpha = true;
            nameBtn.flipVerticalUV = true;
            nameBtn.outColor.setRGB3f(1.0, 1.0, 1.0);
            nameBtn.overColor.setRGB3f(1.0, 1.0, 0.0);
            nameBtn.downColor.setRGB3f(1.0, 0.0, 1.0);
            nameBtn.initialize(0.0, 0.0, tex.getWidth(), size, [tex]);
            nameBtn.setRenderState(RendererState.BACK_TRANSPARENT_STATE);
            nameBtn.setXYZ(-1.0 * nameBtn.getWidth() - 1.0,0.0,0.0);
            //this.m_ruisc.addEntity(nameBtn);
            container.addEntity(nameBtn);

            this.m_nameBtn = nameBtn;
        }

        let subBtn: ColorRectImgButton = new ColorRectImgButton();
        subBtn.premultiplyAlpha = true;
        subBtn.flipVerticalUV = true;
        subBtn.outColor.setRGB3f(1.0, 1.0, 1.0);
        subBtn.overColor.setRGB3f(1.0, 1.0, 0.0);
        subBtn.downColor.setRGB3f(1.0, 0.0, 1.0);
        subBtn.initialize(0.0, 0.0, size, size, [UITexTool.GetInstance().createCharTexture("-", size)]);
        subBtn.setRenderState(RendererState.BACK_TRANSPARENT_STATE);
        container.addEntity(subBtn);

        let addBtn: ColorRectImgButton = new ColorRectImgButton();
        addBtn.premultiplyAlpha = true;
        addBtn.flipVerticalUV = true;
        addBtn.copyMeshFrom(subBtn);
        addBtn.outColor.setRGB3f(1.0, 1.0, 1.0);
        addBtn.overColor.setRGB3f(1.0, 1.0, 0.0);
        addBtn.downColor.setRGB3f(1.0, 0.0, 1.0);
        addBtn.initialize(0.0, 0.0, size, size, [UITexTool.GetInstance().createCharTexture("+", size)]);
        addBtn.setXYZ(this.m_barInitLength + size, 0, 0);
        addBtn.setRenderState(RendererState.BACK_TRANSPARENT_STATE);
        container.addEntity(addBtn);

        this.m_barBgX = size;
        this.initProBg(container, this.m_barBgX, 0.0, this.m_barInitLength, size);

        this.m_ruisc.addContainer(container);


        this.m_subBtn = subBtn;
        this.m_addBtn = addBtn;

        this.m_subBtn.addEventListener(MouseEvent.MOUSE_DOWN, this, this.btnDown);
        this.m_addBtn.addEventListener(MouseEvent.MOUSE_DOWN, this, this.btnDown);
        //this.m_barBoundsBtn.addEventListener(MouseEvent.MOUSE_DOWN, this, this.btnDown);
        this.setProgress( this.m_progress );
    }
    private initProBg(container: DisplayEntityContainer, px: number, py: number, width: number, height: number): void {

        let bgPlane: Plane3DEntity = new Plane3DEntity();
        bgPlane.premultiplyAlpha = true;
        bgPlane.initializeXOY(0, 0, 1, height, [UITexTool.GetInstance().createWhiteTex()]);
        bgPlane.setScaleXYZ(width, 1.0, 1.0);
        bgPlane.setXYZ(px, py, 0.0);
        (bgPlane.getMaterial() as any).setAlpha(0.15);
        bgPlane.setRenderState(RendererState.BACK_TRANSPARENT_STATE);
        container.addEntity(bgPlane);

        let barPlane: Plane3DEntity = new Plane3DEntity();
        barPlane.premultiplyAlpha = true;
        barPlane.initializeXOY(0, 0, 1, height, [UITexTool.GetInstance().createWhiteTex()]);
        barPlane.setXYZ(px, py, 0.0);
        (barPlane.getMaterial() as any).setAlpha(0.3);
        barPlane.setRenderState(RendererState.BACK_TRANSPARENT_STATE);
        container.addEntity(barPlane);
        this.m_barPlane = barPlane;

        this.m_barBoundsBtn = new BoundsButton();
        this.m_barBoundsBtn.initializeBtn2D(width, height);
        this.m_barBoundsBtn.setXYZ(px,py,0.1);
        container.addEntity(this.m_barBoundsBtn);
        this.m_barBoundsBtn.addEventListener(MouseEvent.MOUSE_DOWN, this, this.barMouseDown);
        this.m_ruisc.addEventListener(MouseEvent.MOUSE_UP, this, this.barMouseUp);
        this.m_barBoundsBtn.addEventListener(MouseEvent.MOUSE_OVER, this, this.barMouseOver);
        this.m_barBoundsBtn.addEventListener(MouseEvent.MOUSE_OUT, this, this.barMouseOut);
    }
    setValue(value: number,sendEvtEnabled: boolean = true): void {
        value = MathConst.Clamp(value, this.minValue, this.maxValue);
        this.m_progress = (value - this.minValue) / (this.maxValue - this.minValue);
        this.setProgress(this.m_progress, sendEvtEnabled);
    }
    getValue(): number {
        return this.m_value;
    }
    setProgress(barProgress: number,sendEvtEnabled: boolean = true): void {
        
        this.m_progress = MathConst.Clamp(barProgress, 0.0, 1.0);
        this.m_barLength = this.m_barInitLength * this.m_progress;
        this.m_barPlane.setScaleXYZ(this.m_barLength, 1.0, 1.0);
        this.m_barPlane.update();

        this.m_value = this.minValue + (this.maxValue - this.minValue) * this.m_progress;
        if(sendEvtEnabled) {
            this.sendEvt();
        }
    }
    getProgress(): number {
        return this.m_progress;
    }
    private sendEvt(): void {

        this.m_progressEvt.target = this;
        this.m_progressEvt.minValue = this.minValue;
        this.m_progressEvt.maxValue = this.maxValue;
        this.m_progressEvt.value = this.m_value;
        this.m_progressEvt.progress = this.m_progress;
        this.m_progressEvt.phase = 1;
        this.m_progressEvt.uuid = this.uuid;
        this.m_dispatcher.dispatchEvt( this.m_progressEvt );
    }
    setProgressLength(length: number, sendEvtEnabled: boolean = true): void {
        
        this.m_barLength = MathConst.Clamp(length, 0.0, this.m_barInitLength);
        this.m_progress = this.m_barLength / this.m_barInitLength;
        this.m_barPlane.setScaleXYZ(this.m_barLength, 1.0, 1.0);
        this.m_barPlane.update();

        this.m_value = this.minValue + (this.maxValue - this.minValue) * this.m_progress;
        if(sendEvtEnabled) {
            this.sendEvt();
        }
    }
    private m_moveMin: number = 0;
    private barMouseDown(evt: any): void {
        //console.log("barMouseDown");
        this.m_moveMin = evt.mouseX - this.m_progress * this.m_barInitLength;
        this.setProgress( this.m_progress );
        this.m_ruisc.addEventListener(MouseEvent.MOUSE_MOVE, this, this.barMouseMove);
    }
    private barMouseMove(evt: any): void {        
        this.setProgress( (evt.mouseX - this.m_moveMin) / this.m_barInitLength );
    }
    private barMouseUp(evt: any): void {
        //console.log("barMouseUp");
        this.m_ruisc.removeEventListener(MouseEvent.MOUSE_MOVE, this, this.barMouseMove);
        this.m_ruisc.removeEventListener(EventBase.ENTER_FRAME, this, this.barEnterFrame);
    }
    private m_autoDelay: number = 0;
    private m_changeStep: number = 0;
    private barEnterFrame(evt: any): void {
        //console.log("barEnterFrame");
        if(this.m_autoDelay > 20) {
            if((this.m_autoDelay % 7) == 0) {
                this.setProgressLength( this.m_barLength + this.m_changeStep);
            }
        }
        this.m_autoDelay ++;
    }
    private barMouseOver(evt: any): void {
        (this.m_barPlane.getMaterial() as any).setAlpha(0.6);
    }
    private barMouseOut(evt: any): void {
        (this.m_barPlane.getMaterial() as any).setAlpha(0.3);
    }
    private btnDown(evt: any): void {
        this.m_autoDelay = 0;
        if (evt.target == this.m_subBtn) {
            this.m_changeStep = -this.step;
            this.setProgressLength( this.m_barLength - this.step);
            this.m_ruisc.addEventListener(EventBase.ENTER_FRAME, this, this.barEnterFrame);
        } else if (evt.target == this.m_addBtn) {
            this.m_changeStep = this.step;
            this.setProgressLength( this.m_barLength + this.step);
            this.m_ruisc.addEventListener(EventBase.ENTER_FRAME, this, this.barEnterFrame);
        }
    }

    destroy(): void {

    }
}
export default ProgressBar;