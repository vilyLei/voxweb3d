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
import CanvasTextureTool, { CanvasTextureObject } from "../assets/CanvasTextureTool";
import EventBaseDispatcher from "../../vox/event/EventBaseDispatcher";
import SelectionEvent from "../../vox/event/SelectionEvent";
import Vector3D from "../../vox/math/Vector3D";
import UIBarTool from "./UIBarTool";
import Color4 from "../../vox/material/Color4";
import AABB2D from "../../vox/geom/AABB2D";
import SelectionBarStyle from "./SelectionBarStyle";

export class SelectionBar {
    private m_ruisc: IRendererScene = null;
    private m_dispatcher = new EventBaseDispatcher();
    private m_currEvent = new SelectionEvent();

    private m_container: DisplayEntityContainer = null;
    readonly selectionButton: ColorRectImgButton = null;
    readonly nameButton: ColorRectImgButton = null;
    private m_rect = new AABB2D();

    private m_texObj0: CanvasTextureObject;
    private m_texObj1: CanvasTextureObject;

    private m_btnSize = 64;
    private m_flag = true;
    private m_barName = "select";
    private m_selectName = "Yes";
    private m_deselectName = "No";

    private m_posZ = 0.0;
    private m_enabled = true;

    readonly fontColor = new Color4(1.0, 1.0, 1.0, 1.0);
    readonly fontBgColor = new Color4(1.0, 1.0, 1.0, 0.3);
    uuid = "selectionBar";
    style: SelectionBarStyle = null;
    constructor() { }
    setOverColor(color: Color4): void {

        if (this.nameButton) {
            this.nameButton.overColor.copyFrom(color);
            this.nameButton.setColor(color);
        }
        if (this.selectionButton) {
            this.selectionButton.overColor.copyFrom(color);
            this.selectionButton.setColor(color);
        }
    }
    setOutColor(color: Color4): void {

        if (this.nameButton) {
            this.nameButton.outColor.copyFrom(color);
            this.nameButton.setColor(color);
        }
        if (this.selectionButton) {
            this.selectionButton.outColor.copyFrom(color);
            this.selectionButton.setColor(color);
        }
    }
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
    initialize(ruisc: IRendererScene, barName: string = "select", select_name: string = "Yes", deselect_name: string = "No", btnSize: number = 64.0): void {

        if (this.m_ruisc == null) {

            this.m_ruisc = ruisc;
            this.m_barName = barName;
            if (select_name != "") this.m_selectName = select_name;
            if (deselect_name != "") this.m_deselectName = deselect_name;
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
        if (this.m_container) {
            this.m_container.setXYZ(px, py, this.m_posZ);
            if (force)
                this.m_container.update();
        }
    }
    getPosition(pv: Vector3D): void {
        if (this.m_container) {
            this.m_container.getPosition(pv);
        }
    }
    setPosition(pv: Vector3D): void {
        if (this.m_container) {
            this.m_container.setPosition(pv);
        }
    }
    update(): void {
        if (this.m_container) {
            this.m_container.update();
        }
    }
    private initBody(): void {

        let size: number = this.m_btnSize;
        let container: DisplayEntityContainer = new DisplayEntityContainer();
        this.m_container = container;
        let style: SelectionBarStyle = this.style;

        let haveNameBt = this.m_barName && this.m_barName.length > 0 && (style == null || style.headVisible);
        let selfT: any = this;
        let fc = this.fontColor;
        let fbc = this.fontBgColor;
        if(style) {
            fc = style.fontColor;
            fbc = style.fontBgColor;
        }
        const ctt = CanvasTextureTool.GetInstance();
        if (haveNameBt) {
            selfT.nameButton = new ColorRectImgButton();
            UIBarTool.InitializeBtn(this.nameButton, this.m_barName, size, fc, this.fontBgColor);
            this.nameButton.setXYZ(-1.0 * this.nameButton.getWidth() - 1.0, 0.0, 0.0);
            container.addEntity(this.nameButton);

            this.nameButton.addEventListener(MouseEvent.MOUSE_DOWN, this, this.nameBtnMouseDown);
        }
        
        this.m_texObj0 = ctt.createCharsImageToAtlas("", this.m_selectName, size, fc, fbc);
        this.m_texObj1 = ctt.createCharsImageToAtlas("", this.m_deselectName, size, fc, fbc);

        if(style == null || style.bodyVisible) {
            selfT.selectionButton = new ColorRectImgButton();
        }

        let btn = this.selectionButton;
        btn.uvs = this.m_texObj0.uvs;
        btn.initialize(0.0, 0.0, 1, 1, [this.m_texObj0.texture]);
        btn.setScaleXYZ(this.m_texObj0.getWidth(), this.m_texObj0.getHeight(), 1.0);
        btn.setRenderState(RendererState.BACK_TRANSPARENT_STATE);
        container.addEntity(btn);

        if(style) {
            style.applyToBtn(this.nameButton);
            style.applyToBtn(this.selectionButton);
        }
        this.m_rect.x = 0;
        this.m_rect.y = 0;
        if (haveNameBt) {
            this.m_rect.x = -1.0 * this.nameButton.getWidth() - 1.0;
        }
        this.m_rect.height = btn.getHeight();
        this.m_rect.width = this.m_texObj0.getWidth() - this.m_rect.x;
        this.m_rect.update();

        this.m_ruisc.addContainer(container, 1);
        this.selectionButton.addEventListener(MouseEvent.MOUSE_UP, this, this.btnMouseUp);
    }
    /**
     * 选中
     * @param sendEvtEnabled 是否发送选中的事件。 如果不发送事件，则只会改变状态。
     */
    select(sendEvtEnabled: boolean = false): void {
        if (!this.m_flag) {
            this.m_flag = true;
            this.updateState();
            if (sendEvtEnabled) this.sendEvt();
        }
    }
    /**
     * 取消选中
     * @param sendEvtEnabled 是否发送取消选中的事件。 如果不发送事件，则只会改变状态。
     */
    deselect(sendEvtEnabled: boolean = false): void {
        if (this.m_flag) {
            this.m_flag = false;
            this.updateState();
            if (sendEvtEnabled) this.sendEvt();
        }
    }

    private nameBtnMouseDown(evt: any): void {
        if (this.m_enabled) {
            this.m_flag = !this.m_flag;
            this.updateState();
            this.sendEvt();
        }
    }
    isSelected(): boolean {
        return this.m_flag;
    }
    private sendEvt(): void {

        this.m_currEvent.target = this;
        this.m_currEvent.type = SelectionEvent.SELECT;
        this.m_currEvent.flag = this.m_flag;
        this.m_currEvent.phase = 1;
        this.m_currEvent.uuid = this.uuid;
        this.m_dispatcher.dispatchEvt(this.m_currEvent);
    }
    private updateState(): void {

        let texObj: CanvasTextureObject = this.m_flag ? this.m_texObj0 : this.m_texObj1;
        if (texObj) {
            this.selectionButton.setUVS(texObj.uvs);
            this.selectionButton.reinitializeMesh();
            this.selectionButton.updateMeshToGpu();
            this.selectionButton.setScaleXYZ(texObj.getWidth(), texObj.getHeight(), 1.0);
            this.selectionButton.update();
        }
    }
    private btnMouseUp(evt: any): void {
        if (this.m_enabled) {
            this.m_flag = !this.m_flag;
            this.updateState();
            this.sendEvt();

        }
    }

    destroy(): void {
        if (this.m_dispatcher) {
            this.style == null
            let self: any = this;
            self.selectionButton = null;
            self.nameButton = null;

            this.m_texObj0.destroy();
            this.m_texObj1.destroy();

            this.m_texObj0 = null;
            this.m_texObj1 = null;
            this.m_dispatcher.destroy();
            this.m_dispatcher = null;
        }
    }
}
export default SelectionBar;
