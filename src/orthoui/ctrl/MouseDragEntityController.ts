
/***************************************************************************/
/*                                                                         */
/*  Copyright 2018-2022 by                                                 */
/*  Vily(vily313@126.com)                                                  */
/*                                                                         */
/***************************************************************************/

import Vector3D from "../../vox/math/Vector3D";
import DisplayEntity from "../../vox/entity/DisplayEntity";
import RunnableObject from "../../vox/base/RunnableObject";
import MouseDragController from "../../orthoui/ctrl/MouseDragController";
import IRenderStage3D from "../../vox/render/IRenderStage3D";
import MouseEvent from "../../vox/event/MouseEvent";
import MouseEvt3DDispatcher from "../../vox/event/MouseEvt3DDispatcher";

export default class MouseDragEntityController extends RunnableObject {

    private m_hitFlag: boolean = false;
    private m_pos: Vector3D = new Vector3D();

    private m_stage3D: IRenderStage3D = null;
    private m_dispatcher: MouseEvt3DDispatcher = null;
    protected m_targetEntity: DisplayEntity = null;

    readonly dragController: MouseDragController = new MouseDragController();

    constructor() { super() }
    setStage3D(stage3D: IRenderStage3D): void {

        if (this.m_stage3D == null && stage3D != null) {
            this.m_stage3D = stage3D;
            stage3D.addEventListener(MouseEvent.MOUSE_UP, this, this.mouseUpListener, false, true);
        }
    }
    bindTarget(target: DisplayEntity): void {

        if (this.m_targetEntity == null && target != null) {
            this.m_targetEntity = target;
            target.getPosition(this.m_pos);
            let dispatcher: MouseEvt3DDispatcher = new MouseEvt3DDispatcher();
            dispatcher.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDownListener);
            dispatcher.addEventListener(MouseEvent.MOUSE_UP, this, this.mouseUpListener);
            dispatcher.addEventListener(MouseEvent.MOUSE_OVER, this, this.mouseOverListener);
            dispatcher.addEventListener(MouseEvent.MOUSE_OUT, this, this.mouseOutListener);
            dispatcher.addEventListener(MouseEvent.MOUSE_MOVE, this, this.mouseMoveListener);
            target.setEvtDispatcher(dispatcher);
            target.mouseEnabled = true;
            this.m_dispatcher = dispatcher;
        }
    }
    setScaleXYZ(sx: number, sy: number, sz: number): void {
        if (this.m_targetEntity != null) {
            this.m_targetEntity.setScaleXYZ(sx, sy, sz);
        }
    }
    setXYZ(px: number, py: number, pz: number): void {
        if (this.m_targetEntity != null) {
            this.m_targetEntity.setXYZ(px, py, pz);
        }
    }
    protected mouseMoveListener(evt: any): void {
    }
    protected mouseOverListener(evt: any): void {
    }
    protected mouseOutListener(evt: any): void {
    }
    protected mouseDownListener(evt: any): void {
        this.m_hitFlag = true;
        this.m_targetEntity.getPosition(this.m_pos);
        this.dragController.attach(this.m_pos.x, this.m_pos.y, evt.mouseX, evt.mouseY);
    }
    protected mouseUpListener(evt: any): void {
        this.m_hitFlag = false;
        this.dragController.detach();
    }
    protected drag(): void {

    }
    isHitFlag(): boolean {
        return this.m_hitFlag;
    }
    run(): void {
        if (this.m_stage3D != null && this.m_hitFlag && this.dragController.test(this.m_stage3D.mouseX, this.m_stage3D.mouseY)) {
            this.dragController.updateDrag(this.m_stage3D.mouseX, this.m_stage3D.mouseY);
            this.m_pos.x = this.dragController.x;
            this.m_pos.y = this.dragController.y;
            this.m_targetEntity.setPosition(this.m_pos);
            this.updateTargetEntity();
            this.drag();
        }
    }
    updateTargetEntity(): void {
        this.m_targetEntity.update();
    }
    getPosition(outV: Vector3D): void {
        outV.copyFrom(this.m_pos);
    }
    destory(): void {
        if (this.m_targetEntity != null) {
            this.m_targetEntity.mouseEnabled = false;
            this.m_targetEntity = null;
            this.m_targetEntity.setEvtDispatcher(null);
        }
        if (this.m_stage3D != null) {

            this.m_stage3D.removeEventListener(MouseEvent.MOUSE_UP, this, this.mouseUpListener);
            this.m_stage3D = null;
        }
        if (this.m_dispatcher != null) {
            this.m_dispatcher.destroy();
            this.m_dispatcher = null;
        }
    }
}