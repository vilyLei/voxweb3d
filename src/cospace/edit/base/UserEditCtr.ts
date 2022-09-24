import IAABB from "../../../vox/geom/IAABB";
import ITransformEntity from "../../../vox/entity/ITransformEntity";
import { ICtrTarget } from "../base/ICtrTarget";
import IEvtDispatcher from "../../../vox/event/IEvtDispatcher";

import { ICoRScene } from "../../voxengine/ICoRScene";
declare var CoRScene: ICoRScene;

class UserEditCtr {

    protected m_enabled = false;
    private m_flag = -1;
    private m_dispatcher: IEvtDispatcher = null;

    protected m_target: ICtrTarget = null;

    runningVisible = true;
    uuid = "editCtrl";
    moveSelfEnabled = true;

    protected editBegin(): void {
        console.log("UserEditCtr::editBegin()");
        this.m_flag = 1;
    }
    protected editEnd(): void {
        console.log("UserEditCtr::editEnd()");
        this.m_flag = -1;
    }

    enable(): void {
        this.m_enabled = true;
    }
    disable(): void {
        this.m_enabled = false;
    }
    isEnabled(): boolean {
        return this.m_enabled;
    }

    isSelected(): boolean {
        return this.m_flag > -1;
    }
    select(): void {

    }
    deselect(): void {
    }
    setVisible(visible: boolean): void {
    }
    getVisible(): boolean {
        return false;
    }


    getGlobalBounds(): IAABB {
        return null;
    }
    getLocalBounds(): IAABB {
        return null;
    }
    addEventListener(type: number, listener: any, func: (evt: any) => void, captureEnabled: boolean = true, bubbleEnabled: boolean = false): void {
        this.m_dispatcher.addEventListener(type, listener, func, captureEnabled, bubbleEnabled);
    }
    removeEventListener(type: number, listener: any, func: (evt: any) => void): void {
        this.m_dispatcher.removeEventListener(type, listener, func);
    }
    setTarget(target: ICtrTarget): void {
        this.m_target = target;
    }

    protected applyEvent(entity: ITransformEntity): void {

        if (this.m_dispatcher == null) {
            const me = CoRScene.MouseEvent;
            let dispatcher = CoRScene.createMouseEvt3DDispatcher();
            dispatcher.addEventListener(me.MOUSE_DOWN, this, this.mouseDownListener);
            dispatcher.addEventListener(me.MOUSE_OVER, this, this.mouseOverListener);
            dispatcher.addEventListener(me.MOUSE_OUT, this, this.mouseOutListener);
            this.m_dispatcher = dispatcher;
        }
        entity.setEvtDispatcher(this.m_dispatcher);
        entity.mouseEnabled = true;
    }
    protected mouseOverListener(evt: any): void {
        console.log("DragLine::mouseOverListener() ...");
        this.showOverColor();
    }
    protected mouseOutListener(evt: any): void {
        console.log("DragLine::mouseOutListener() ...");
        this.showOutColor();
    }
    protected mouseDownListener(evt: any): void {

    }
    showOverColor(): void {
        // let m = this.m_entity.getMaterial() as IColorMaterial;
        // m.setColor(this.overColor);
        // m = this.m_cone.getMaterial() as IColorMaterial;
        // m.setColor(this.overColor);
    }
    showOutColor(): void {
        // let m = this.m_entity.getMaterial() as IColorMaterial;
        // m.setColor(this.outColor);
        // m = this.m_cone.getMaterial() as IColorMaterial;
        // m.setColor(this.outColor);
    }


    destroy(): void {
        this.m_target = null;
        if (this.m_dispatcher != null) {
            this.m_dispatcher.destroy();
            this.m_dispatcher = null;
        }
    }

}

export { UserEditCtr };