
import * as Vector3DT from "../../vox/geom/Vector3";
import * as KeyboardEventT from "../../vox/event/KeyboardEvent";
import * as RendererSceneT from "../../vox/scene/RendererScene";

import Vector3D = Vector3DT.vox.geom.Vector3D;
import KeyboardEvent = KeyboardEventT.vox.event.KeyboardEvent;
import RendererScene = RendererSceneT.vox.scene.RendererScene;

export namespace voxeditor
{
    export namespace control
    {
        export class CameraMoveController
        {
            constructor()
            {
            }
            
            private m_keyDownBoo:boolean = false;  
            private m_rscene:RendererScene = null;
            private m_moveSpd:number = 3.0;
            private m_moveSpdV:Vector3D = new Vector3D();
            private m_upV:Vector3D = new Vector3D();
            private m_posV:Vector3D = new Vector3D();
            private m_lookAtV:Vector3D = new Vector3D();
            private m_lockAxis:number = -1;
            private m_key:string = "";
            setSpeed(spd:number):void
            {
                this.m_moveSpd = spd;
            }
            lockXAxis():void
            {
                this.m_lockAxis = 0;
            }
            lockYAxis():void
            {
                this.m_lockAxis = 1;
            }
            lockZAxis():void
            {
                this.m_lockAxis = 1;
            }
            unlockAxis():void
            {
                this.m_lockAxis = -1;
            }
            initialize(mainRendererScene:RendererScene):void
            {
                if(this.m_rscene == null)
                {
                    this.m_rscene = mainRendererScene;
                    this.m_rscene.getStage3D().addEventListener(KeyboardEvent.KEY_DOWN,this,this.keyDownListener);
                    this.m_rscene.getStage3D().addEventListener(KeyboardEvent.KEY_UP,this,this.keyUpListener);
                }
            }
            
            private keyDownListener(evt:any):void
            {
                //console.log("keyDownListener call, this.m_rscene: "+this.m_rscene.toString());
                if(!this.m_keyDownBoo)
                {
                    let spd:number = this.m_moveSpd;
                    switch(evt.key)
                    {
                        case "w":
                            this.m_keyDownBoo = true;
                            this.m_moveSpdV.copyFrom(this.m_rscene.getCamera().getNV());
                        break;
                        case "s":
                            this.m_keyDownBoo = true;
                            this.m_moveSpdV.copyFrom(this.m_rscene.getCamera().getNV());
                            spd *= -1.0;
                        break;
                        case "a":
                            this.m_keyDownBoo = true;
                            this.m_moveSpdV.copyFrom(this.m_rscene.getCamera().getRV());
                            spd *= -1.0;
                        break;
                        case "d":
                            this.m_keyDownBoo = true;
                            this.m_moveSpdV.copyFrom(this.m_rscene.getCamera().getRV());
                        break;
                        default:
                            break;
                    }
                    if(this.m_keyDownBoo)
                    {
                        this.m_key = evt.key;
                        switch(this.m_lockAxis)
                        {
                            case 0:
                                this.m_moveSpdV.x = 0.0;
                                this.m_moveSpdV.normalize();
                            break;
                            case 1:
                                this.m_moveSpdV.y = 0.0;
                                this.m_moveSpdV.normalize();
                            break;
                            case 2:
                                this.m_moveSpdV.z = 0.0;
                                this.m_moveSpdV.normalize();
                            break;
                            default:
                                break;
                        }
                        this.m_upV.copyFrom(this.m_rscene.getCamera().getUV());
                        this.m_moveSpdV.scaleBy(spd);
                        this.m_upV.copyFrom(this.m_rscene.getCamera().getUV());
                        this.m_posV.copyFrom(this.m_rscene.getCamera().getPosition());
                        this.m_lookAtV.copyFrom(this.m_rscene.getCamera().getLookAtPosition());
                    }
                }
                
            }
            private keyUpListener(evt:any):void
            {
                if(this.m_key == evt.key)
                {
                    this.m_key = "";
                    this.m_keyDownBoo = false;
                }
                //console.log("keyUpListener call, this.m_rscene: "+this.m_rscene.toString());
            }
            run():void
            {
                // 1. 任何3D空间的物体接收到了鼠标事件，则不会产生拖动
                // 2. 只有当且仅当拖动热区有了鼠标事件 mouse down 的时候才会启动拖动 this.m_mousDragBoo = true
                // 3.一旦启动了拖动，除非主动终止，否则触发任何其他的鼠标事件(例如3D空间的mouse move 等)都不会终止拖动状态
                if(this.m_keyDownBoo)
                {
                    this.m_posV.addBy(this.m_moveSpdV);
                    this.m_lookAtV.addBy(this.m_moveSpdV);
                    this.m_rscene.getCamera().lookAtRH(this.m_posV,this.m_lookAtV,this.m_upV);
                }
            }
        }
    }        
}