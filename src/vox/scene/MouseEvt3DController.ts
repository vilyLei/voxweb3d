/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/
// 渲染场景内物体的鼠标事件控制类

import Vector3D from "../../vox/math/Vector3D";
import MouseEvent from "../../vox/event/MouseEvent";
import IRenderStage3D from "../../vox/render/IRenderStage3D";

import IRenderEntity from "../../vox/render/IRenderEntity";
import RaySelectedNode from '../../vox/scene/RaySelectedNode';
import IRaySelector from '../../vox/scene/IRaySelector';
import IEvt3DController from '../../vox/scene/IEvt3DController';
import IEvtDispatcher from "../../vox/event/IEvtDispatcher";
import IRenderEntityContainer from "../../vox/render/IRenderEntityContainer";

export default class MouseEvt3DController implements IEvt3DController {

    private static s_unlockMouseEvt: boolean = true;
    private static s_uid: number = 0;
    private m_uid: number = 0;
    private m_mainStage: IRenderStage3D = null;
    private m_currStage: IRenderStage3D = null;
    private m_raySelector: IRaySelector = null;
    private m_unlockBoo: boolean = true;
    private m_mouseEvt: MouseEvent = new MouseEvent();
    private m_mouseOverEvt: MouseEvent = new MouseEvent();
    private m_mouseOutEvt: MouseEvent = new MouseEvent();
    private m_evtTypes: Float32Array = new Float32Array(64);
    private m_evtXList: Float32Array = new Float32Array(64);
    private m_evtYList: Float32Array = new Float32Array(64);
    private m_evtWheelDeltaYs: Float32Array = new Float32Array(64);
    private m_evtTotal: number = 0;

    private m_evtEntity: IRenderEntity = null;
    private m_evtContainer: IRenderEntityContainer = null;
    private m_evtFlowPhase: number = -1;
    constructor() {
        this.m_uid = MouseEvt3DController.s_uid++;
    }

    initialize(mainStage: IRenderStage3D, currStage: IRenderStage3D): void {
        //console.log("MouseEvt3DController::initialize()......");
        if (this.m_mainStage == null) {
            this.m_mainStage = mainStage;
            this.m_currStage = currStage;
            let ME = MouseEvent;
            mainStage.addEventListener(ME.MOUSE_DOWN, this, this.mouseDownListener, true, false);
            mainStage.addEventListener(ME.MOUSE_UP, this, this.mouseUpListener, true, false);
            mainStage.addEventListener(ME.MOUSE_CLICK, this, this.mouseClickListener, true, false);
            mainStage.addEventListener(ME.MOUSE_MOVE, this, this.mouseMoveListener, true, false);
            mainStage.addEventListener(ME.MOUSE_WHEEL, this, this.mouseWheeelListener, true, false);

            mainStage.addEventListener(ME.MOUSE_RIGHT_DOWN, this, this.mouseDownListener, true, false);
            mainStage.addEventListener(ME.MOUSE_RIGHT_UP, this, this.mouseUpListener, true, false);
            mainStage.addEventListener(ME.MOUSE_MIDDLE_DOWN, this, this.mouseDownListener, true, false);
            mainStage.addEventListener(ME.MOUSE_MIDDLE_UP, this, this.mouseUpListener, true, false);
        }
    }
    setRaySelector(raySelector: IRaySelector): void {
        this.m_raySelector = raySelector;
    }
    private mouseWheeelListener(evt: any): void {
        if (this.m_currStage != null) {
            this.m_currStage.mouseX = this.m_mainStage.mouseX;
            this.m_currStage.mouseY = this.m_mainStage.mouseY;
        }
        this.m_evtTypes[this.m_evtTotal] = (evt.type);
        this.m_evtXList[this.m_evtTotal] = (evt.mouseX);
        this.m_evtYList[this.m_evtTotal] = (evt.mouseY);
        this.m_evtWheelDeltaYs[this.m_evtTotal] = (evt.wheelDeltaY);
        this.m_mouseEvt.type = evt.type;
        this.m_evtTotal++;
    }
    // 鼠标动了, 摄像机动了, 被渲染对象本身动了,都可能形成mouse move事件
    private mouseMoveListener(evt: any): void {
        if (this.m_currStage != null) {
            this.m_currStage.mouseX = this.m_mainStage.mouseX;
            this.m_currStage.mouseY = this.m_mainStage.mouseY;
        }
        this.m_evtTypes[this.m_evtTotal] = (evt.type);
        this.m_evtXList[this.m_evtTotal] = (evt.mouseX);
        this.m_evtYList[this.m_evtTotal] = (evt.mouseY);
        this.m_evtWheelDeltaYs[this.m_evtTotal] = (0);
        this.m_mouseEvt.type = evt.type;
        this.m_evtTotal++;
    }
    private mouseDownListener(evt: any): void {
        if (this.m_currStage != null) {
            this.m_currStage.mouseX = this.m_mainStage.mouseX;
            this.m_currStage.mouseY = this.m_mainStage.mouseY;
        }
        if (MouseEvt3DController.s_unlockMouseEvt) {
            this.m_evtTypes[this.m_evtTotal] = (evt.type);
            this.m_evtXList[this.m_evtTotal] = (evt.mouseX);
            this.m_evtYList[this.m_evtTotal] = (evt.mouseY);
            this.m_evtWheelDeltaYs[this.m_evtTotal] = (0);
            this.m_mouseEvt.type = evt.type;
            this.m_evtTotal++;
        }
    }
    private mouseUpListener(evt: any): void {
        if (this.m_currStage != null) {
            this.m_currStage.mouseX = this.m_mainStage.mouseX;
            this.m_currStage.mouseY = this.m_mainStage.mouseY;
        }
        if (MouseEvt3DController.s_unlockMouseEvt) {
            this.m_evtTypes[this.m_evtTotal] = (evt.type);
            this.m_evtXList[this.m_evtTotal] = (evt.mouseX);
            this.m_evtYList[this.m_evtTotal] = (evt.mouseY);
            this.m_evtWheelDeltaYs[this.m_evtTotal] = (0);
            this.m_mouseEvt.type = evt.type;
            this.m_evtTotal++;
        }
    }
    private mouseClickListener(evt: any): void {
        if (this.m_currStage != null) {
            this.m_currStage.mouseX = this.m_mainStage.mouseX;
            this.m_currStage.mouseY = this.m_mainStage.mouseY;
        }
        if (MouseEvt3DController.s_unlockMouseEvt) {
            this.m_evtTypes[this.m_evtTotal] = (evt.type);
            this.m_evtXList[this.m_evtTotal] = (evt.mouseX);
            this.m_evtYList[this.m_evtTotal] = (evt.mouseY);
            this.m_evtWheelDeltaYs[this.m_evtTotal] = (0);
            this.m_mouseEvt.type = evt.type;
            this.m_evtTotal++;
        }
    }

    mouseOutEventTarget(): number {
        if (this.m_currStage != null) {
            this.m_currStage.mouseX = this.m_mainStage.mouseX;
            this.m_currStage.mouseY = this.m_mainStage.mouseY;
        }
        if (this.m_evtEntity != null) {
            let dispatcher: IEvtDispatcher = this.m_evtEntity.getEvtDispatcher(MouseEvent.EventClassType);
            if (dispatcher != null) {
                this.m_mouseOutEvt.phase = this.m_evtFlowPhase;
                this.m_mouseOutEvt.type = MouseEvent.MOUSE_OUT;
                this.m_mouseOutEvt.mouseX = this.m_mouseEvt.mouseX;
                this.m_mouseOutEvt.mouseY = this.m_mouseEvt.mouseY;
                this.m_mouseOutEvt.target = this.m_evtEntity;
                this.m_raySelector.getRay(this.m_mouseOutEvt.raypv, this.m_mouseOutEvt.raytv);
                this.m_evtEntity = null;
                return dispatcher.dispatchEvt(this.m_mouseOutEvt);
            }
            this.m_evtEntity = null;
        }
        return 0;
    }
    /**
     * @param       evtFlowPhase: 0(none phase),1(capture phase),2(bubble phase)
     * @param       status: 1(default process),1(deselect ray pick target)
     * @return      1 is send evt yes,0 is send evt no,-1 is event nothing
     */
    run(evtFlowPhase: number, status: number): number {
        let flag: number = -1;
        if (this.m_unlockBoo) {
            this.m_evtFlowPhase = evtFlowPhase;
            let i: number = 0;
            flag = this.m_evtTotal > 0 ? 0 : -1;
            let dispatcher: IEvtDispatcher = null;
            let node: RaySelectedNode;
            let lpv: Vector3D;
            let wpv: Vector3D;
            if (flag > -1) {

                if (this.m_currStage != this.m_mainStage && this.m_currStage != null) {
                    MouseEvt3DController.s_unlockMouseEvt = false;
                    for (i = 0; i < this.m_evtTotal; i++) {
                        switch (this.m_evtTypes[i]) {
                            case MouseEvent.MOUSE_DOWN:
                                this.m_currStage.mouseDown(1);
                                break;
                            case MouseEvent.MOUSE_UP:
                                this.m_currStage.mouseUp(1);
                                break;
                            case MouseEvent.MOUSE_RIGHT_DOWN:
                                this.m_currStage.mouseRightDown(1);
                                break;
                            case MouseEvent.MOUSE_RIGHT_UP:
                                this.m_currStage.mouseRightUp(1);
                                break;
                            case MouseEvent.MOUSE_MIDDLE_DOWN:
                                this.m_currStage.mouseMiddleDown(1);
                                break;
                            case MouseEvent.MOUSE_MIDDLE_UP:
                                this.m_currStage.mouseMiddleUp(1);
                                break;
                            case MouseEvent.MOUSE_MOVE:
                                this.m_currStage.mouseMove();
                                break;
                            default:
                                break;
                        }
                    }
                    MouseEvt3DController.s_unlockMouseEvt = true;
                }
                node = status < 1 ? this.m_raySelector.getSelectedNode() : null;
                if (node != null) {
                    lpv = node.lpv;
                    wpv = node.wpv;
                    let entity: IRenderEntity = node.entity;
                    dispatcher = entity.getEvtDispatcher(MouseEvent.EventClassType);

                    let container: IRenderEntityContainer = entity.__$getParent();
                    let containerFlag: boolean = container != null && container.mouseEnabled;
                    let tttFlag: number = 0;
                    if (!containerFlag) {
                        flag += this.mouseOutContainer(evtFlowPhase, null, null, null);
                        // // for test
                        // if(this.m_evtContainer != null) {
                        //     tttFlag ++;
                        // }
                        this.m_evtContainer = null;
                    }
                    let preEvtEvent: IRenderEntity = this.m_evtEntity;
                    for (let i: number = 0; i < this.m_evtTotal; i++) {
                        this.m_mouseEvt.type = this.m_evtTypes[i];
                        this.m_mouseEvt.mouseX = this.m_evtXList[i];
                        this.m_mouseEvt.mouseY = this.m_evtYList[i];
                        this.m_mouseEvt.wheelDeltaY = this.m_evtWheelDeltaYs[i];

                        if (this.m_mouseEvt.type > 0) {
                            if (node != null) {
                                if (dispatcher != null) {
                                    this.m_mouseEvt.target = entity;
                                    this.m_mouseEvt.currentTarget = entity;
                                    this.m_mouseEvt.phase = evtFlowPhase;
                                    this.m_mouseEvt.lpos.copyFrom(lpv);
                                    this.m_mouseEvt.wpos.copyFrom(wpv);
                                    this.m_raySelector.getRay(this.m_mouseEvt.raypv, this.m_mouseEvt.raytv);

                                    flag += this.mouseOutEntity(evtFlowPhase, entity, lpv, wpv);
                                    if (this.m_evtEntity != entity) {
                                        this.m_mouseOverEvt.phase = evtFlowPhase;
                                        this.m_mouseOverEvt.type = MouseEvent.MOUSE_OVER;
                                        this.m_mouseOverEvt.mouseX = this.m_mouseEvt.mouseX;
                                        this.m_mouseOverEvt.mouseY = this.m_mouseEvt.mouseY;
                                        this.m_mouseOverEvt.target = entity;
                                        this.m_mouseOverEvt.currentTarget = entity;
                                        this.m_mouseOverEvt.lpos.copyFrom(lpv);
                                        this.m_mouseOverEvt.wpos.copyFrom(wpv);
                                        this.m_raySelector.getRay(this.m_mouseOverEvt.raypv, this.m_mouseOverEvt.raytv);
                                        flag += dispatcher.dispatchEvt(this.m_mouseOverEvt);
                                    }
                                    flag += dispatcher.dispatchEvt(this.m_mouseEvt);
                                    this.m_evtEntity = entity;
                                }
                            }
                        }
                    }

                    if (containerFlag) {

                        if (preEvtEvent != null && preEvtEvent.__$getParent() == null) {
                            this.m_evtEntity = preEvtEvent;
                            flag += this.mouseOutEntity(evtFlowPhase, null, null, null);
                            this.m_evtEntity = null;
                        }
                        for (let i: number = 0; i < this.m_evtTotal; i++) {
                            this.m_mouseEvt.type = this.m_evtTypes[i];
                            this.m_mouseEvt.mouseX = this.m_evtXList[i];
                            this.m_mouseEvt.mouseY = this.m_evtYList[i];
                            this.m_mouseEvt.wheelDeltaY = this.m_evtWheelDeltaYs[i];
                            if (this.m_mouseEvt.type > 0) {
                                if (node != null) {
                                    this.m_mouseEvt.target = container;
                                    this.m_mouseEvt.currentTarget = entity;
                                    this.m_mouseEvt.phase = evtFlowPhase;
                                    this.m_mouseEvt.lpos.copyFrom(lpv);
                                    this.m_mouseEvt.wpos.copyFrom(wpv);
                                    this.m_raySelector.getRay(this.m_mouseEvt.raypv, this.m_mouseEvt.raytv);
                                    flag += this.mouseOutContainer(evtFlowPhase, container, lpv, wpv);
                                    if (this.m_evtContainer != container) {
                                        this.m_mouseOverEvt.phase = evtFlowPhase;
                                        this.m_mouseOverEvt.type = MouseEvent.MOUSE_OVER;
                                        this.m_mouseOverEvt.mouseX = this.m_mouseEvt.mouseX;
                                        this.m_mouseOverEvt.mouseY = this.m_mouseEvt.mouseY;
                                        this.m_mouseOverEvt.target = container;
                                        this.m_mouseOverEvt.currentTarget = entity;
                                        this.m_mouseOverEvt.lpos.copyFrom(lpv);
                                        this.m_mouseOverEvt.wpos.copyFrom(wpv);
                                        this.m_raySelector.getRay(this.m_mouseOverEvt.raypv, this.m_mouseOverEvt.raytv);
                                        flag += container.dispatchEvt(this.m_mouseOverEvt);
                                    }
                                    flag += container.dispatchEvt(this.m_mouseEvt);
                                    this.m_evtContainer = container;
                                }
                            }
                        }
                    }
                }
                else {
                    this.mouseOutEntity(evtFlowPhase, null, null, null);
                    this.mouseOutContainer(evtFlowPhase, null, null, null);
                    this.m_evtEntity = null;
                    this.m_evtContainer = null;

                    flag += this.mouseOutEventTarget();
                    if (this.m_currStage != null) {
                        for (i = 0; i < this.m_evtTotal; i++) {
                            switch (this.m_evtTypes[i]) {
                                case MouseEvent.MOUSE_DOWN:
                                    this.m_currStage.mouseBgDown();
                                    break;
                                case MouseEvent.MOUSE_UP:
                                    this.m_currStage.mouseBgUp();
                                    break;
                                case MouseEvent.MOUSE_CLICK:
                                    this.m_currStage.mouseBgClick();
                                    break;

                                case MouseEvent.MOUSE_RIGHT_DOWN:
                                    this.m_currStage.mouseBgRightDown();
                                    break;
                                case MouseEvent.MOUSE_RIGHT_UP:
                                    this.m_currStage.mouseBgRightUp();
                                    break;
                                case MouseEvent.MOUSE_MIDDLE_DOWN:
                                    this.m_currStage.mouseBgMiddleDown();
                                    break;
                                case MouseEvent.MOUSE_MIDDLE_UP:
                                    this.m_currStage.mouseBgMiddleUp();
                                    break;
                                default:
                                    break;
                            }
                        }
                    }
                }
                if (this.m_currStage != null) {
                    MouseEvt3DController.s_unlockMouseEvt = false;
                    for (i = 0; i < this.m_evtTotal; i++) {
                        switch (this.m_evtTypes[i]) {
                            case MouseEvent.MOUSE_DOWN:
                                this.m_currStage.mouseDown(2);
                                break;
                            case MouseEvent.MOUSE_UP:
                                this.m_currStage.mouseUp(2);
                                break;
                            case MouseEvent.MOUSE_RIGHT_DOWN:
                                this.m_currStage.mouseRightDown(2);
                                break;
                            case MouseEvent.MOUSE_RIGHT_UP:
                                this.m_currStage.mouseRightUp(2);
                                break;
                            case MouseEvent.MOUSE_MIDDLE_DOWN:
                                this.m_currStage.mouseMiddleDown(2);
                                break;
                            case MouseEvent.MOUSE_MIDDLE_UP:
                                this.m_currStage.mouseMiddleUp(2);
                                break;
                            default:
                                break;
                        }
                    }
                    MouseEvt3DController.s_unlockMouseEvt = true;
                }
            }
            if (flag == 0 && dispatcher != null) {
                //任何 在 evtFlowPhase 值所代表的阶段的事件能被接收，则表示这个事件应该无法穿透到下一个过程
                flag = dispatcher.passTestPhase(evtFlowPhase);
            }
        }
        return flag > 0 ? 1 : 0;
    }
    private mouseOutEntity(evtFlowPhase: number, entity: IRenderEntity, lpv: Vector3D, wpv: Vector3D): number {
        if (this.m_evtEntity != null && this.m_evtEntity != entity) {
            let dispatcher = this.m_evtEntity.getEvtDispatcher(MouseEvent.EventClassType);
            if (dispatcher != null) {
                this.m_mouseOutEvt.phase = evtFlowPhase;
                this.m_mouseOutEvt.type = MouseEvent.MOUSE_OUT;
                this.m_mouseOutEvt.mouseX = this.m_mouseEvt.mouseX;
                this.m_mouseOutEvt.mouseY = this.m_mouseEvt.mouseY;
                this.m_mouseOutEvt.target = this.m_evtEntity;
                this.m_mouseOverEvt.currentTarget = this.m_evtEntity;
                if (lpv != null) this.m_mouseOutEvt.lpos.copyFrom(lpv);
                if (wpv != null) this.m_mouseOutEvt.wpos.copyFrom(wpv);
                this.m_raySelector.getRay(this.m_mouseOutEvt.raypv, this.m_mouseOutEvt.raytv);
                return dispatcher.dispatchEvt(this.m_mouseOutEvt);
            }
        }
        return 0;
    }

    private mouseOutContainer(evtFlowPhase: number, container: IRenderEntityContainer, lpv: Vector3D, wpv: Vector3D): number {
        if (this.m_evtContainer != null && this.m_evtContainer != container) {
            this.m_mouseOutEvt.phase = evtFlowPhase;
            this.m_mouseOutEvt.type = MouseEvent.MOUSE_OUT;
            this.m_mouseOutEvt.mouseX = this.m_mouseEvt.mouseX;
            this.m_mouseOutEvt.mouseY = this.m_mouseEvt.mouseY;
            this.m_mouseOutEvt.target = this.m_evtContainer;
            this.m_mouseOutEvt.currentTarget = null;
            if (lpv != null) this.m_mouseOutEvt.lpos.copyFrom(lpv);
            if (wpv != null) this.m_mouseOutEvt.wpos.copyFrom(wpv);
            this.m_raySelector.getRay(this.m_mouseOutEvt.raypv, this.m_mouseOutEvt.raytv);
            //console.log("mouse out 01."+this.m_evtEntity.name);
            return this.m_evtContainer.dispatchEvt(this.m_mouseOutEvt);
        }
        return 0;
    }
    runEnd(): void {
        this.m_evtTotal = 0;
        this.m_mouseEvt.type = 0;
    }
    reset(): void {
        this.m_evtTotal = 0;
    }

    getEvtType(): number {
        return this.m_mouseEvt.type;
    }
    isSelected(): boolean {
        return this.m_raySelector.getSelectedNode() != null;
    }
    lock(): void {
        this.m_unlockBoo = false;
    }
    unlock(): void {
        this.m_unlockBoo = true;
    }
    isUnlock(): boolean {
        return this.m_unlockBoo;
    }
}