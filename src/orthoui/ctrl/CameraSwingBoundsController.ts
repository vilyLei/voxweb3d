
import * as Vector3DT from "../..//vox/math/Vector3D";
import * as MouseEventT from "../../vox/event/MouseEvent";
import * as Stage3DT from "../../vox/display/Stage3D";
import * as RendererSceneT from "../../vox/scene/RendererScene";
import * as RendererSubSceneT from "../../vox/scene/RendererSubScene";
import * as ColorButtonT from "../../orthoui/button/BoundsButton";

import Vector3D = Vector3DT.vox.math.Vector3D;
import MouseEvent = MouseEventT.vox.event.MouseEvent;
import Stage3D = Stage3DT.vox.display.Stage3D;
import RendererScene = RendererSceneT.vox.scene.RendererScene;
import RendererSubScene = RendererSubSceneT.vox.scene.RendererSubScene;
import BoundsButton = ColorButtonT.orthoui.button.BoundsButton;

export namespace orthoui
{
    export namespace ctrl
    {
        export class CameraSwingBoundsController
        {
            constructor()
            {
            }
            
            private m_mouseX:number = 0.0;
            private m_mouseY:number = 0.0;
            private m_mouseDownBoo:boolean = false;
            private m_mousDragBoo:boolean = false;
            private m_stage3D:Stage3D = null;            
            private m_rscene:RendererScene = null;
            private m_uirscene:RendererSubScene = null;
            private m_viewHotArea:BoundsButton = null;
            getViewHotArea():BoundsButton
            {
                return this.m_viewHotArea;
            }
            initialize(mainRendererScene:RendererScene, subRendererScene:RendererSubScene):void
            {
                if(this.m_rscene == null)
                {
                    this.m_rscene = mainRendererScene;
                    this.m_uirscene = subRendererScene;
                    this.m_stage3D = this.m_rscene.getStage3D() as Stage3D;
    
                    // mouse swing camera in the hot area.
                    let viewHotArea:BoundsButton = new BoundsButton();
                    viewHotArea.initializeBtn2D(this.m_stage3D.stageWidth, this.m_stage3D.stageHeight);
                    this.m_uirscene.addEntity(viewHotArea);
                    viewHotArea.addEventListener(MouseEvent.MOUSE_DOWN,this,this.mouseDownListener,false,true);
                    viewHotArea.addEventListener(MouseEvent.MOUSE_UP,this,this.mouseUpListener,false,true);
                    viewHotArea.addEventListener(MouseEvent.MOUSE_WHEEL,this,this.mouseWheeelListener,false,true);
                    this.m_stage3D.addEventListener(MouseEvent.MOUSE_UP,this,this.mouseUpListener);
                    this.m_viewHotArea = viewHotArea;
                }
            }
            
            setBounds(pw:number,ph:number):void
            {
                if(this.m_viewHotArea != null)
                {
                    this.m_viewHotArea.setBounds2D(pw,ph);
                    this.m_viewHotArea.updateBounds();
                }
            }
            private mouseDownListener(evt:any):void
            {
                //console.log("mouseDownListener call, this.m_rscene: "+this.m_rscene.toString());
                this.m_mouseX = this.m_stage3D.mouseX;
                this.m_mouseY = this.m_stage3D.mouseY;
                this.m_mouseDownBoo = true;
            }
            private mouseUpListener(evt:any):void
            {
                //console.log("mouseUpListener call, this.m_rscene: "+this.m_rscene.toString());
                this.m_mouseDownBoo = false;
                this.m_mousDragBoo = false;
            }
            private mouseWheeelListener(evt:any):void
            {
                if(evt.wheelDeltaY < 0)
                {
                    // zoom in
                    this.m_rscene.getCamera().forward(-25.0);
                }
                else if(evt.wheelDeltaY > 0)
                {
                    // zoom out
                    this.m_rscene.getCamera().forward(25.0);
                }
            }
            private updateMouseDrag():void
            {
                let dx:number = this.m_mouseX - this.m_stage3D.mouseX;
                let dy:number = this.m_mouseY - this.m_stage3D.mouseY;
                let abs_dx:number = Math.abs(dx);
                let abs_dy:number = Math.abs(dy);
                if(abs_dx > abs_dy)
                {
                    if(abs_dx > 0.5)this.m_rscene.getCamera().swingHorizontalWithAxis(dx * 0.2,Vector3D.Y_AXIS);
                }
                else
                {
                    if(abs_dy > 0.5)this.m_rscene.getCamera().swingVertical(dy * -0.2);
                }
                this.m_mouseX = this.m_stage3D.mouseX;
                this.m_mouseY = this.m_stage3D.mouseY;
            }
            run():void
            {
                // 1. 任何3D空间的物体接收到了鼠标事件，则不会产生拖动
                // 2. 只有当且仅当拖动热区有了鼠标事件 mouse down 的时候才会启动拖动 this.m_mousDragBoo = true
                // 3.一旦启动了拖动，除非主动终止，否则触发任何其他的鼠标事件(例如3D空间的mouse move 等)都不会终止拖动状态
                if(this.m_mouseDownBoo)
                {
                    if(this.m_mousDragBoo)
                    {
                        this.updateMouseDrag();
                    }
                    else
                    {
                        if(!this.m_mousDragBoo && this.m_rscene.getEvt3DController() != null && this.m_rscene.getEvt3DController().isSelected())
                        {
                            this.m_mouseDownBoo = false;
                        }
                        else
                        {
                            this.updateMouseDrag();
                            this.m_mousDragBoo = true;
                        }
                    }
                }
            }
        }
    }        
}