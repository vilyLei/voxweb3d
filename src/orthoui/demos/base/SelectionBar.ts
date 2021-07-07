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
import CanvasTextureTool from "./CanvasTextureTool";
import Plane3DEntity from "../../../vox/entity/Plane3DEntity";
import BoundsButton from "../../button/BoundsButton";
import MathConst from "../../../vox/math/MathConst";
import TextureProxy from "../../../vox/texture/TextureProxy";
import EventBaseDispatcher from "../../../vox/event/EventBaseDispatcher";
import EventBase from "../../../vox/event/EventBase";
import SelectionEvent from "../../../vox/event/SelectionEvent";

export class SelectionBar {
    private m_ruisc: RendererSubScene = null;
    private m_dispatcher: EventBaseDispatcher = new EventBaseDispatcher();
    private m_currEvent: SelectionEvent = new SelectionEvent();
    private m_texList: TextureProxy[] = [null,null];
    private m_container: DisplayEntityContainer = null;
    private m_selectBtn: ColorRectImgButton = null;
    private m_nameBtn: ColorRectImgButton = null;
    
    private m_btnSize: number = 64;
    private m_flag: boolean = true;
    private m_barName: string = "select";
    private m_selectName: string = "Yes";
    private m_deselectName: string = "No";

    private m_posZ: number = 0.0;

    uuid: string = "selectionBar";

    constructor() { }

    initialize(ruisc: RendererSubScene, barName: string = "select", select_name:string = "Yes", deselect_name:string = "No", btnSize: number = 64.0): void {
       
        if (this.m_ruisc == null) {

            this.m_ruisc = ruisc;
            this.m_barName = barName;
            if(select_name != "")this.m_selectName = select_name;
            if(deselect_name != "")this.m_deselectName = deselect_name;
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
    private initBody(): void {

        let size: number = this.m_btnSize;
        let container: DisplayEntityContainer = new DisplayEntityContainer();
        this.m_container = container;

        if(this.m_barName != null && this.m_barName.length > 0) {
            let tex:TextureProxy = CanvasTextureTool.GetInstance().createCharTexture(this.m_barName, size, "rgba(180,180,180,1.0)");
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

        this.m_texList[0] = CanvasTextureTool.GetInstance().createCharTexture(this.m_selectName, size);
        this.m_texList[1] = CanvasTextureTool.GetInstance().createCharTexture(this.m_deselectName, this.m_btnSize);

        this.m_texList[0].__$attachThis();
        this.m_texList[1].__$attachThis();

        let btn: ColorRectImgButton = new ColorRectImgButton();
        btn.premultiplyAlpha = true;
        btn.flipVerticalUV = true;
        btn.outColor.setRGB3f(1.0, 1.0, 1.0);
        btn.overColor.setRGB3f(1.0, 1.0, 0.0);
        btn.downColor.setRGB3f(1.0, 0.0, 1.0);
        btn.initialize(0.0, 0.0, 1, 1, [this.m_texList[0]]);
        btn.setScaleXYZ(this.m_texList[0].getWidth(),size,1.0);
        btn.setRenderState(RendererState.BACK_TRANSPARENT_STATE);
        container.addEntity(btn);
        this.m_selectBtn = btn;


        this.m_ruisc.addContainer(container);
        this.m_selectBtn.addEventListener(MouseEvent.MOUSE_UP, this, this.btnMouseUp);

    }
    select(sendEvtEnabled: boolean = false):void {
        if(!this.m_flag) {
            this.m_flag = true;
            this.updateState();
            if(sendEvtEnabled) this.sendEvt();
        }
    }
    deselect(sendEvtEnabled: boolean = false):void {
        if(this.m_flag) {
            this.m_flag = false;
            this.updateState();
            if(sendEvtEnabled) this.sendEvt();
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
        this.m_dispatcher.dispatchEvt( this.m_currEvent );
    }
    private updateState(): void {
        let tex: TextureProxy = this.m_flag ? this.m_texList[0] : this.m_texList[1];
        this.m_selectBtn.setTextureAt(0,tex);
        this.m_selectBtn.setScaleXYZ(tex.getWidth(), this.m_btnSize, 1.0);
        this.m_selectBtn.update();
        this.m_selectBtn.updateMaterialToGpu(this.m_ruisc.getRenderProxy());
    }
    private btnMouseUp(evt: any): void {
        this.m_flag = !this.m_flag;
        this.updateState();
        this.sendEvt();
    }

    destroy(): void {
        if(this.m_selectBtn != null) {
            this.m_selectBtn = null;
            this.m_texList[0].__$detachThis();
            this.m_texList[1].__$detachThis();
        }
    }
}
export default SelectionBar;