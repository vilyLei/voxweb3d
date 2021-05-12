
import MouseEvent from "../../vox/event/MouseEvent";
import MouseEvt3DDispatcher from "../../vox/event/MouseEvt3DDispatcher";
import DisplayEntity from "../../vox/entity/DisplayEntity";

export default class MouseEventEntityController {

    private m_dispatcher: MouseEvt3DDispatcher = null;
    private m_targetEntity: DisplayEntity = null;
    constructor() {}
    
    bindTarget(target: DisplayEntity): void {
        
        if(this.m_targetEntity == null && target != null)
        {
            this.m_targetEntity = target;
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
    mouseMoveListener(evt: any): void {
    }
    mouseOverListener(evt: any): void {
        if (this.m_targetEntity != null) {
            let m: any = this.m_targetEntity.getMaterial() as any;
            m.setRGB3f(Math.random() * 1.2, Math.random() * 1.2, Math.random() * 1.2);
        }
    }
    mouseOutListener(evt: any): void {
        if (this.m_targetEntity != null) {
            let m: any = this.m_targetEntity.getMaterial() as any;
            m.setRGB3f(1.0,1.0,1.0);
        }
    }
    mouseDownListener(evt: any): void {
        console.log("MouseEventEntityController mouse down. ");
        this.m_targetEntity.setRotationXYZ(0.0, 0.0, this.m_targetEntity.getTransform().getRotationZ() + 2.0);
        this.m_targetEntity.update();
    }
    mouseUpListener(evt: any): void {
        console.log("MouseEventEntityController mouse up. ");
    }
    destory(): void {
        if(this.m_targetEntity != null) {
            this.m_targetEntity.mouseEnabled = false;
            this.m_targetEntity = null;
            this.m_targetEntity.setEvtDispatcher(null);
        }
        if(this.m_dispatcher != null) {
            this.m_dispatcher.destroy();
            this.m_dispatcher = null;
        }
    }
}