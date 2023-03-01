/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import MouseEvent from "../../vox/event/MouseEvent";
import IRendererScene from "../../vox/scene/IRendererScene";
import ColorRectImgButton from "../../orthoui/button/ColorRectImgButton";
import DisplayEntityContainer from "../../vox/entity/DisplayEntityContainer";
import EventBaseDispatcher from "../../vox/event/EventBaseDispatcher";
import SelectionEvent from "../../vox/event/SelectionEvent";
import Vector3D from "../../vox/math/Vector3D";
import UIBarTool from "./UIBarTool";
import Color4 from "../../vox/material/Color4";
import AABB2D from "../../vox/geom/AABB2D";

export class TextButton {
    private m_ruisc: IRendererScene = null;
    private m_dispatcher: EventBaseDispatcher = new EventBaseDispatcher();
    private m_currEvent: SelectionEvent = new SelectionEvent();

    private m_container: DisplayEntityContainer = null;
    readonly selectionButton: ColorRectImgButton = new ColorRectImgButton();
    readonly nameButton: ColorRectImgButton = new ColorRectImgButton();
    private m_rect: AABB2D = new AABB2D();

    private m_btnSize: number = 64;
    private m_flag: boolean = true;
    private m_barName: string = "seltextButtonect";
    private m_posZ: number = 0.0;
    private m_enabled: boolean = true;

    readonly fontColor: Color4 = new Color4(1.0, 1.0, 1.0, 1.0);
    readonly fontBgColor: Color4 = new Color4(1.0, 1.0, 1.0, 0.3);
    uuid: string = "textButton";

    constructor() { }

    enable(): void {
        this.m_enabled = true;
    }
    disable(): void {
        this.m_enabled = false;
    }
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
    getRect(): AABB2D {
        return this.m_rect;
    }
    initialize(ruisc: IRendererScene, barName: string = "textButton", btnSize: number = 64.0): void {

        if (this.m_ruisc == null) {

            this.m_ruisc = ruisc;
            this.m_barName = barName;
            this.m_btnSize = btnSize;

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
    getPosition(pv: Vector3D): Vector3D {
        if (this.m_container != null) {
            this.m_container.getPosition(pv);
        }
        return pv;
    }
    setPosition(pv: Vector3D): void {
        if (this.m_container != null) {
            this.m_container.setPosition(pv);
        }
    }

    private initBody(): void {

        let size: number = this.m_btnSize;
        let container: DisplayEntityContainer = new DisplayEntityContainer();
        this.m_container = container;

        UIBarTool.InitializeBtn(this.nameButton, this.m_barName, size, this.fontColor, this.fontBgColor);
        container.addEntity(this.nameButton);

        this.nameButton.addEventListener(MouseEvent.MOUSE_DOWN, this, this.nameBtnMouseDown);
        this.nameButton.addEventListener(MouseEvent.MOUSE_UP, this, this.nameBtnMouseUp);

        this.m_rect.y = 0;
        this.m_rect.x = 0;
        this.m_rect.width = this.nameButton.getWidth();
        this.m_rect.height = this.nameButton.getHeight();
        this.m_rect.update();

        this.m_ruisc.addContainer(container, 1);
    }
    private nameBtnMouseDown(evt: any): void {
        if (this.m_enabled) {
            this.sendEvt( MouseEvent.MOUSE_DOWN );
        }
    }    
    private nameBtnMouseUp(evt: any): void {
        if (this.m_enabled) {
            this.sendEvt( MouseEvent.MOUSE_UP );
        }
    }

    private sendEvt(evtType: number): void {

        this.m_currEvent.target = this;
        this.m_currEvent.type = evtType;
        this.m_currEvent.flag = this.m_flag;
        this.m_currEvent.phase = 1;
        this.m_currEvent.uuid = this.uuid;
        this.m_dispatcher.dispatchEvt(this.m_currEvent);
    }
    destroy(): void {
        if (this.nameButton != null) {

            let self: any = this;
            self.nameButton = null;
        }
    }
}
export default TextButton;