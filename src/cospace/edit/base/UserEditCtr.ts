import IAABB from "../../../vox/geom/IAABB";
import ITransformEntity from "../../../vox/entity/ITransformEntity";
import { ICtrTarget } from "../base/ICtrTarget";
import IEvtDispatcher from "../../../vox/event/IEvtDispatcher";
import { IRenderCamera } from "../../../vox/render/IRenderCamera";
import IVector3D from "../../../vox/math/IVector3D";
import { UserEditEvent } from "../event/UserEditEvent";

import { ICoRScene } from "../../voxengine/ICoRScene";
import IEvtNode from "../../../vox/event/IEvtNode";
declare var CoRScene: ICoRScene;

class UserEditCtr {

    private m_evtMap: Map<number, IEvtNode>;
    protected m_enabled = false;
    private m_flag = -1;
    private m_dispatcher: IEvtDispatcher = null;
    protected m_target: ICtrTarget = null;
    protected m_ctrList: UserEditCtr[] = null;

    editType = "";
    runningVisible = true;
    uuid = "editCtrl";
    moveSelfEnabled = true;
    constructor() {

        let m = new Map();

        const UE = UserEditEvent;

        let node = CoRScene.createEvtNode();
        node.type = UE.EDIT_BEGIN;
        m.set(node.type, node);

        node = CoRScene.createEvtNode();
        node.type = UE.EDIT_END;
        m.set(node.type, node);

        this.m_evtMap = m;
    }
    protected editBegin(): void {
        console.log("UserEditCtr::editBegin()");
        this.m_flag = 1;
        let node = this.m_evtMap.get(UserEditEvent.EDIT_BEGIN);
        let evt = node.createEvent(this, this);
        node.dispatch(evt);
        evt.target = null;
        evt.currentTarget = null;
    }
    protected editEnd(): void {
        console.log("UserEditCtr::editEnd()");
        this.m_flag = -1;
        let node = this.m_evtMap.get(UserEditEvent.EDIT_END);
        let evt = node.createEvent(this, this);
        node.dispatch(evt);
        evt.target = null;
        evt.currentTarget = null;
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
        if (this.isSelected()) {
            this.editEnd();
            this.setAllVisible(true);
        }
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

        // let node = this.m_evtMap.get();
        // const UE = UserEditEvent;
        // if(type == UE.EDIT_BEGIN) {
        // }else if(type == UE.EDIT_END) {
        // }else {
        //     this.m_dispatcher.addEventListener(type, listener, func, captureEnabled, bubbleEnabled);
        // }

        if (this.m_evtMap.has(type)) {
            let node = this.m_evtMap.get(type);
            node.addListener(listener, func);
        } else {
            this.m_dispatcher.addEventListener(type, listener, func, captureEnabled, bubbleEnabled);
        }
    }
    removeEventListener(type: number, listener: any, func: (evt: any) => void): void {

        if (this.m_evtMap.has(type)) {
            let node = this.m_evtMap.get(type);
            node.removeListener(listener, func);
        } else {
            this.m_dispatcher.removeEventListener(type, listener, func);
        }
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


    run(camera: IRenderCamera, rtv: IVector3D): void {

    }
    destroy(): void {

        this.m_target = null;
        this.m_ctrList = null;
        if (this.m_dispatcher != null) {
            for(var [k,v] of this.m_evtMap.entries()) {
                v.destroy();
            }
            this.m_dispatcher.destroy();
            this.m_dispatcher = null;
        }
    }

    /**
     * 设置所有旋转控制器对象可见性
     * @param v true 表示可见, false表示隐藏
     */
    protected setAllVisible(v: boolean): void {
        let ls = this.m_ctrList;
        for (let i = 0; i < ls.length; ++i) {
            ls[i].setVisible(v);
        }
    }
    /**
     * 仅仅隐藏自身， 或者仅仅显示自身
     * @param v v true 表示仅自身可见其他不可见, false表示仅自身隐藏其他可见
     */
    protected setThisVisible(v: boolean): void {
        let ls = this.m_ctrList;
        if (v) {
            for (let i = 0; i < ls.length; ++i) {
                ls[i].setVisible(ls[i] == this);
            }
        } else {
            for (let i = 0; i < ls.length; ++i) {
                ls[i].setVisible(ls[i] != this);
            }
        }
    }
}

export { UserEditCtr };