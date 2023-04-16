/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import MouseEvent from "../../vox/event/MouseEvent";
import RendererState from "../../vox/render/RendererState";
import IRendererScene from "../../vox/scene/IRendererScene";
import ColorRectImgButton from "../../orthoui/button/ColorRectImgButton";
import DisplayEntityContainer from "../../vox/entity/DisplayEntityContainer";
import CanvasTextureTool from "../assets/CanvasTextureTool";
import Plane3DEntity from "../../vox/entity/Plane3DEntity";
import BoundsButton from "./BoundsButton";
import MathConst from "../../vox/math/MathConst";
import EventBaseDispatcher from "../../vox/event/EventBaseDispatcher";
import ProgressDataEvent from "../../vox/event/ProgressDataEvent";
import EventBase from "../../vox/event/EventBase";
import Vector3D from "../../vox/math/Vector3D";
import UIBarTool from "./UIBarTool";
import Color4 from "../../vox/material/Color4";
import AABB2D from "../../vox/geom/AABB2D";
import IColorMaterial from "../../vox/material/mcase/IColorMaterial";
import ProgressBarStyle from "./ProgressBarStyle";

export class ProgressBar {
    private m_ruisc: IRendererScene = null;
    private m_dispatcher: EventBaseDispatcher = new EventBaseDispatcher();
    private m_currEvent: ProgressDataEvent = new ProgressDataEvent();

    private m_container: DisplayEntityContainer = null;
    private m_addBtn: ColorRectImgButton = null;
    private m_subBtn: ColorRectImgButton = null;
    private m_nameBtn: ColorRectImgButton = null;
    private m_barBoundsBtn: BoundsButton = null;
    private m_barPlane: Plane3DEntity = null;
    private m_barBgPlane: Plane3DEntity = null;
    private m_rect: AABB2D = new AABB2D();

    private m_btnSize: number = 64;
    private m_barInitLength: number = 1.0;
    private m_barLength: number = 1.0;
    private m_barBgX: number = 1.0;
    private m_progress: number = 0.0;
    private m_barName: string = "";

    private m_posZ: number = 0.0;
    private m_value: number = 0.0;
    readonly fontColor: Color4 = new Color4(1.0, 1.0, 1.0, 1.0);
    readonly fontBgColor: Color4 = new Color4(1.0, 1.0, 1.0, 0.3);
	bgBarAlpha = 0.3;
	bgPlaneAlpha = 0.25;
    uuid: string = "ProgressBar";
    minValue: number = 0.0;
    maxValue: number = 1.0;
    step: number = 0.1;
	style: ProgressBarStyle = null;
    constructor() { }

    open(): void {
        this.m_container.setVisible(true);
    }
    close(): void {
        this.m_container.setVisible(false);
    }
    isOpen(): boolean {
        return this.m_container.getVisible();
    }
    isClosed(): boolean {
        return !this.m_container.getVisible();
    }
    initialize(ruisc: IRendererScene, name: string = "prog", btnSize: number = 64.0, barBgLength: number = 200.0): void {

        if (this.m_ruisc == null) {

            this.m_ruisc = ruisc;
            this.m_barName = name;
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

    getPosition(pv: Vector3D): void {
        if (this.m_container != null) {
            this.m_container.getPosition(pv);
        }
    }
    setPosition(pv: Vector3D): void {
        if (this.m_container != null) {
            this.m_container.setPosition(pv);
        }
    }
    setXY(px: number, py: number, force: boolean = true): void {
        if (this.m_container != null) {
            this.m_container.setXYZ(px, py, this.m_posZ);
            if (force)
                this.m_container.update();
        }
    }
    getRect(): AABB2D {
        return this.m_rect;
    }
    private initBody(): void {

        let style = this.style;
		let rst = 0;
		if(style) {
			this.m_btnSize = style.fontSize;
			rst = style.renderState;
		}

        let size = this.m_btnSize;
        let container = new DisplayEntityContainer();
        this.m_container = container;

		let fc = this.fontColor;
        let fbc = this.fontBgColor;

        let haveNameBt = this.m_nameBtn == null && this.m_barName != "" && (style == null || style.headVisible);
        if (haveNameBt) {

			if(style) {
				fc = style.headFontColor;
				fbc = style.headFontBgColor;
			}
            let nameBtn = UIBarTool.CreateBtn(this.m_barName, size, fc, fbc);
            nameBtn.setXYZ(-1.0 * nameBtn.getWidth() - 1.0, 0.0, 0.0);
            container.addEntity(nameBtn);

            this.m_nameBtn = nameBtn;
            this.m_nameBtn.addEventListener(MouseEvent.MOUSE_DOWN, this, this.nameBtnMouseDown);
        }

		if(style) {
			fc = style.progressBtnFontColor;
			fbc = style.progressBtnFontBgColor;
			this.m_barInitLength = style.progressBarLength;
		}
        let subBtn = UIBarTool.CreateBtn("-", size, fc, fbc);
        container.addEntity(subBtn);
        let addBtn = UIBarTool.CreateBtn("+", size, fc, fbc);
        addBtn.setXYZ(this.m_barInitLength + addBtn.getWidth(), 0, 0);
        container.addEntity(addBtn);
        this.m_rect.y = 0;
        if (this.m_nameBtn != null) {
            this.m_rect.x = -1.0 * this.m_nameBtn.getWidth() - 1.0;
        }
        else {
            this.m_rect.x = 0;
        }
        this.m_rect.height = subBtn.getHeight();
        let pos = new Vector3D();
        addBtn.getPosition(pos);
        this.m_rect.width = (pos.x + addBtn.getWidth()) - this.m_rect.x;
        this.m_rect.update();
        this.m_barBgX = size;
        this.initProBg(container, this.m_barBgX, 2.0, this.m_barInitLength, addBtn.getHeight() - 2);

        this.m_ruisc.addContainer(container, 1);

        this.m_subBtn = subBtn;
        this.m_addBtn = addBtn;

        this.m_addBtn.addEventListener(MouseEvent.MOUSE_DOWN, this, this.btnMouseDown);
        this.m_subBtn.addEventListener(MouseEvent.MOUSE_DOWN, this, this.btnMouseDown);

        if(style) {
            style.applyToBtn(this.m_nameBtn);
            style.applyToBodyBtn(subBtn);
            style.applyToBodyBtn(addBtn);
            
            let headAlignType = style.headAlignType;
            let nsBtn = this.m_nameBtn;
            if(nsBtn) {
				nsBtn.mouseEnabled = style.headEnabled;
                nsBtn.update();
                let p = style.headAlignPosValue;
                let width = nsBtn.getGlobalBounds().getWidth();
                switch(headAlignType) {
                    case "left":
                        nsBtn.setXYZ(p, 0.0, 0.0);
                        break;                    
                    case "right":
                        nsBtn.setXYZ(p - width, 0.0, 0.0);
                        break;
                    default:
                        break;
                }
            }
            
        }
		container.update();
		let bounds = container.getGlobalBounds();
		let minV = bounds.min;
        this.m_rect.setTo(minV.x, minV.y, bounds.getWidth(), bounds.getHeight());
        this.setProgress(this.m_progress);

		if(rst > 0) {
			container.setRenderState(rst);
		}
    }
    private initProBg(container: DisplayEntityContainer, px: number, py: number, width: number, height: number): void {
		let style = this.style;
        let bgPlane = new Plane3DEntity();
        bgPlane.premultiplyAlpha = true;
        bgPlane.initializeXOY(0, 0, 1, height, [CanvasTextureTool.GetInstance().createWhiteTex()]);
        bgPlane.setScaleXYZ(width, 1.0, 1.0);
        bgPlane.setXYZ(px, py, 0.0);

		let c = this.fontBgColor;
		if(style) {
			c = style.progressBarBgOutColor;
			(bgPlane.getMaterial() as IColorMaterial).setRGB3f(c.r, c.g, c.b);
		}else {
			(bgPlane.getMaterial() as any).setAlpha(this.bgPlaneAlpha);
		}
        bgPlane.setRenderState(RendererState.BACK_TRANSPARENT_STATE);
        container.addEntity(bgPlane);
		this.m_barBgPlane = bgPlane;

        let barPlane = new Plane3DEntity();
        barPlane.premultiplyAlpha = true;
        barPlane.initializeXOY(0, 0, 1, height, [CanvasTextureTool.GetInstance().createWhiteTex()]);
        barPlane.setXYZ(px, py, 0.0);
		c = this.fontBgColor;
		if(style) {
			c = style.progressBarOutColor;
		}
		(barPlane.getMaterial() as IColorMaterial).setRGB3f(c.r, c.g, c.b);
        (barPlane.getMaterial() as any).setAlpha(this.bgBarAlpha);
        barPlane.setRenderState(RendererState.BACK_TRANSPARENT_STATE);
        container.addEntity(barPlane);
        this.m_barPlane = barPlane;

        this.m_barBoundsBtn = new BoundsButton();
        this.m_barBoundsBtn.initializeBtn2D(width, height);
        this.m_barBoundsBtn.setXYZ(px, py, 0.1);
        container.addEntity(this.m_barBoundsBtn);
        this.m_barBoundsBtn.addEventListener(MouseEvent.MOUSE_DOWN, this, this.barMouseDown);
        this.m_ruisc.addEventListener(MouseEvent.MOUSE_UP, this, this.barMouseUp, true, false);
        this.m_barBoundsBtn.addEventListener(MouseEvent.MOUSE_OVER, this, this.barMouseOver);
        this.m_barBoundsBtn.addEventListener(MouseEvent.MOUSE_OUT, this, this.barMouseOut);
    }
    setValue(value: number, sendEvtEnabled: boolean = true): void {
        value = MathConst.Clamp(value, this.minValue, this.maxValue);
        this.m_progress = (value - this.minValue) / (this.maxValue - this.minValue);
        this.setProgress(this.m_progress, sendEvtEnabled);
    }
    getValue(): number {
        return this.m_value;
    }
    setProgress(barProgress: number, sendEvtEnabled: boolean = true): void {

        this.m_progress = MathConst.Clamp(barProgress, 0.0, 1.0);
        this.m_barLength = this.m_barInitLength * this.m_progress;
        this.m_barPlane.setScaleXYZ(this.m_barLength, 1.0, 1.0);
        this.m_barPlane.update();

        this.m_value = this.minValue + (this.maxValue - this.minValue) * this.m_progress;
        if (sendEvtEnabled) {
            this.sendEvt(2);
        }
    }
    getProgress(): number {
        return this.m_progress;
    }
    private sendEvt(status: number): void {

        this.m_currEvent.target = this;
        this.m_currEvent.status = status;
        this.m_currEvent.type = ProgressDataEvent.PROGRESS;
        this.m_currEvent.minValue = this.minValue;
        this.m_currEvent.maxValue = this.maxValue;
        this.m_currEvent.value = this.m_value;
        this.m_currEvent.progress = this.m_progress;
        this.m_currEvent.phase = 1;
        this.m_currEvent.uuid = this.uuid;
        this.m_dispatcher.dispatchEvt(this.m_currEvent);
    }
    setProgressLength(length: number, sendEvtEnabled: boolean = true): void {

        this.m_barLength = MathConst.Clamp(length, 0.0, this.m_barInitLength);
        this.m_progress = this.m_barLength / this.m_barInitLength;
        this.m_barPlane.setScaleXYZ(this.m_barLength, 1.0, 1.0);
        this.m_barPlane.update();

        this.m_value = this.minValue + (this.maxValue - this.minValue) * this.m_progress;
        if (sendEvtEnabled) {
            this.sendEvt(2);
        }
    }
    private m_moveMin: number = 0;
    private nameBtnMouseDown(evt: any): void {
        this.sendEvt(0);
    }
	private m_barDown = false;
    private barMouseDown(evt: any): void {
		if(this.style) {
			let c = this.style.progressBarDownColor;
			(this.m_barPlane.getMaterial() as IColorMaterial).setRGB3f(c.r, c.g, c.b);
		}
		this.m_barDown = true;
        this.m_moveMin = evt.mouseX - this.m_progress * this.m_barInitLength;
        this.setProgress(this.m_progress);
        this.m_ruisc.addEventListener(MouseEvent.MOUSE_MOVE, this, this.barMouseMove, true, false);
    }
    private barMouseMove(evt: any): void {
        this.setProgress((evt.mouseX - this.m_moveMin) / this.m_barInitLength);
    }
    private barMouseUp(evt: any): void {
        //console.log("barMouseUp");
		if(this.m_barDown) {
			if(this.style) {
				let c = this.style.progressBarOverColor;
				(this.m_barPlane.getMaterial() as IColorMaterial).setRGB3f(c.r, c.g, c.b);
			}
		}
		this.m_ruisc.removeEventListener(MouseEvent.MOUSE_MOVE, this, this.barMouseMove);
		this.m_ruisc.removeEventListener(EventBase.ENTER_FRAME, this, this.barEnterFrame);
		this.m_barDown = false;
    }
    private m_autoDelay: number = 0;
    private m_changeStep: number = 0;
    private barEnterFrame(evt: any): void {
        //console.log("barEnterFrame");
        if (this.m_autoDelay > 20) {
            if ((this.m_autoDelay % 7) == 0) {
                this.setProgressLength(this.m_barLength + this.m_changeStep);
            }
        }
        this.m_autoDelay++;
    }
    private barMouseOver(evt: any): void {
		if(this.style) {
			let c = this.style.progressBarOverColor;
			(this.m_barPlane.getMaterial() as IColorMaterial).setRGB3f(c.r, c.g, c.b);
			c = this.style.progressBarBgOverColor;
			(this.m_barBgPlane.getMaterial() as IColorMaterial).setRGB3f(c.r, c.g, c.b);
		}else{
			(this.m_barPlane.getMaterial() as any).setAlpha(this.bgBarAlpha + 0.1);
		}
    }
    private barMouseOut(evt: any): void {
		if(this.style) {
			let c = this.style.progressBarOutColor;
			(this.m_barPlane.getMaterial() as IColorMaterial).setRGB3f(c.r, c.g, c.b);
			c = this.style.progressBarBgOutColor;
			(this.m_barBgPlane.getMaterial() as IColorMaterial).setRGB3f(c.r, c.g, c.b);
		}else{
			(this.m_barPlane.getMaterial() as any).setAlpha(this.bgBarAlpha);
		}
    }
    private btnMouseDown(evt: any): void {
        this.m_autoDelay = 0;
        if (evt.target == this.m_subBtn) {
            this.m_changeStep = -this.step;
            this.setProgressLength(this.m_barLength - this.step);
            this.m_ruisc.addEventListener(EventBase.ENTER_FRAME, this, this.barEnterFrame, true, false);
        } else if (evt.target == this.m_addBtn) {
            this.m_changeStep = this.step;
            this.setProgressLength(this.m_barLength + this.step);
            this.m_ruisc.addEventListener(EventBase.ENTER_FRAME, this, this.barEnterFrame, true, false);
        }
    }

    update(): void {
        if (this.m_container != null) {
            this.m_container.update();
			let bounds = this.m_container.getGlobalBounds();
			let minV = bounds.min;
			this.m_rect.setTo(minV.x, minV.y, bounds.getWidth(), bounds.getHeight());
        }
    }
    destroy(): void {

    }
}
export default ProgressBar;
