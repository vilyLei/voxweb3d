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

export class SelectionBar {
    private m_ruisc: IRendererScene = null;
    private m_dispatcher: EventBaseDispatcher = new EventBaseDispatcher();
    private m_currEvent: SelectionEvent = new SelectionEvent();

    private m_container: DisplayEntityContainer = null;
    readonly selectionButton: ColorRectImgButton = new ColorRectImgButton();
    readonly nameButton: ColorRectImgButton = new ColorRectImgButton();
    private m_rect: AABB2D = new AABB2D();

    private m_texObj0: CanvasTextureObject;
    private m_texObj1: CanvasTextureObject;

    private m_btnSize: number = 64;
    private m_flag: boolean = true;
    private m_barName: string = "select";
    private m_selectName: string = "Yes";
    private m_deselectName: string = "No";

    private m_posZ: number = 0.0;
    private m_enabled: boolean = true;

    uuid: string = "selectionBar";

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
        if (this.m_container != null) {
            this.m_container.setXYZ(px, py, this.m_posZ);
            if (force)
                this.m_container.update();
        }
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

    private initBody(): void {

        let size: number = this.m_btnSize;
        let container: DisplayEntityContainer = new DisplayEntityContainer();
        this.m_container = container;

        let haveNameBt: boolean = this.m_barName != null && this.m_barName.length > 0;
        if (haveNameBt) {

            UIBarTool.InitializeBtn(this.nameButton, this.m_barName, size, new Color4(1.0, 1.0, 1.0, 1.0));
            this.nameButton.setXYZ(-1.0 * this.nameButton.getWidth() - 1.0, 0.0, 0.0);
            container.addEntity(this.nameButton);

            this.nameButton.addEventListener(MouseEvent.MOUSE_DOWN, this, this.nameBtnMouseDown);
        }

        let image = CanvasTextureTool.GetInstance().createCharsImage(this.m_selectName, size);
        this.m_texObj0 = CanvasTextureTool.GetInstance().addImageToAtlas(this.m_selectName, image);

        image = CanvasTextureTool.GetInstance().createCharsImage(this.m_deselectName, size);
        this.m_texObj1 = CanvasTextureTool.GetInstance().addImageToAtlas(this.m_deselectName, image);

        let btn: ColorRectImgButton = this.selectionButton;
        btn.uvs = this.m_texObj0.uvs;
        btn.initialize(0.0, 0.0, 1, 1, [this.m_texObj0.texture]);
        btn.setScaleXYZ(this.m_texObj0.getWidth(), size, 1.0);
        btn.setRenderState(RendererState.BACK_TRANSPARENT_STATE);
        container.addEntity(btn);

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
    select(sendEvtEnabled: boolean = false): void {
        if (!this.m_flag) {
            this.m_flag = true;
            this.updateState();
            if (sendEvtEnabled) this.sendEvt();
        }
    }
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
        if (texObj != null) {
            this.selectionButton.setUVS(texObj.uvs);
            this.selectionButton.reinitializeMesh();
            this.selectionButton.updateMeshToGpu();
            this.selectionButton.setScaleXYZ(texObj.getWidth(), this.m_btnSize, 1.0);
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
        if (this.selectionButton != null) {

            let self: any = this;
            self.selectionButton = null;
            self.nameButton = null;

            this.m_texObj0.destroy();
            this.m_texObj1.destroy();

            this.m_texObj0 = null;
            this.m_texObj1 = null;
        }
    }
}
export default SelectionBar;