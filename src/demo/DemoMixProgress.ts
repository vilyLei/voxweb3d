
import * as RendererDevieceT from "../vox/render/RendererDeviece";
import * as RendererParamT from "../vox/scene/RendererParam";
import * as RenderStatusDisplayT from "../vox/scene/RenderStatusDisplay";
import * as Axis3DEntityT from "../vox/entity/Axis3DEntity";

import * as MouseEventT from "../vox/event/MouseEvent";
import * as CameraTrackT from "../vox/view/CameraTrack";
import * as RendererSceneT from "../vox/scene/RendererScene";

import RendererDeviece = RendererDevieceT.vox.render.RendererDeviece;
import RendererParam = RendererParamT.vox.scene.RendererParam;
import RenderStatusDisplay = RenderStatusDisplayT.vox.scene.RenderStatusDisplay;
import Axis3DEntity = Axis3DEntityT.vox.entity.Axis3DEntity;

import MouseEvent = MouseEventT.vox.event.MouseEvent;
import CameraTrack = CameraTrackT.vox.view.CameraTrack;
import RendererScene = RendererSceneT.vox.scene.RendererScene;

export namespace demo
{
    export class DemoMixProgress
    {
        constructor(){}

        private m_rscene:RendererScene = null;
        private m_camTrack:CameraTrack = null;
        private m_statusDisp:RenderStatusDisplay = new RenderStatusDisplay();

        initialize():void
        {
            console.log("DemoMixProgress::initialize()......");
            if(this.m_rscene == null)
            {
                RendererDeviece.SHADERCODE_TRACE_ENABLED = false;
                RendererDeviece.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
                
                let rparam:RendererParam = new RendererParam();
                rparam.setCamPosition(800.0,800.0,800.0);
                this.m_rscene = new RendererScene();
                this.m_rscene.initialize(rparam,3);
                this.m_rscene.updateCamera();

                this.m_camTrack = new CameraTrack();
                this.m_camTrack.bindCamera(this.m_rscene.getCamera());

                this.m_statusDisp.initialize("rstatus",this.m_rscene.getStage3D().viewWidth - 200);

                this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this,this.mouseDown);

                let axis:Axis3DEntity = new Axis3DEntity();
                axis.initialize(300.0);
                this.m_rscene.addEntity(axis);
                this.update();

                let totv:number = 20.0;
                for(let i:number = 0; i <= totv;++i)
                {
                    let t:number = i/totv;
                    t = 3 * t;
                    t = t - Math.floor(t);
                    console.log(i+",t: ",t.toFixed(3));
                }

                /*
                let totv:number = 10.0;
                for(let i:number = 0; i <= totv;++i)
                {
                    let t:number = i/totv;
                    let k0:number = Math.max(1.0 - 2.0 * t, 0.0);
                    let k:number = Math.max(t - 0.5, 0.0);
                    let k1:number = (1.0 - (2.0 * k)) * this.step(-0.00001,k);                    
                    k = this.step(0.00001,k0);

                    let v0:number = 100;
                    let v1:number = 200;
                    let v2:number = 300;
                    v0 = (v0 * k0 + (1.0 - k0) * v1);
                    v1 = (v1 * k1 + (1.0 - k1) * v2);
                    let v:number = v0 * k + v1 * (1.0 - k);
                    console.log(i+",k0,k1: ",k0.toFixed(2)+" % "+k1.toFixed(2),",v:"+v.toFixed(3));
                }
                //*/
                /*
                let totv:number = 10.0;
                for(let i:number = 0; i <= totv;++i)
                {
                    let t:number = i/totv;
                    let k0:number = Math.max(1.0 - 2.0 * t, 0.0);
                    let k1:number = 1.0 - (2.0 * Math.max(t - 0.5, 0.0));
                    k1 = k0 > 0.0?0.0:k1;
                    console.log(i+",k0: ",k0);
                    console.log(i+",k1: ",k1);
                }
                //*/
               
            }
        }
        private step(edge:number,value:number):number
        {
            return value < edge ? 0.0:1.0;
        }
        private mouseDown(evt:any):void
        {
        }
        private m_timeoutId:any = -1;
        private update():void
        {
            if(this.m_timeoutId > -1)
            {
                clearTimeout(this.m_timeoutId);
            }
            //this.m_timeoutId = setTimeout(this.update.bind(this),16);// 60 fps
            this.m_timeoutId = setTimeout(this.update.bind(this),50);// 20 fps
            
            this.m_statusDisp.render();
        }
        run():void
        {
            this.m_statusDisp.update(false);

            this.m_rscene.run();

            this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
        }
    }
}