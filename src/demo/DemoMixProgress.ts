
import RendererDevice from "../vox/render/RendererDevice";
import Vector3D from "../vox/math/Vector3D";
import CircleCalc from "../vox/geom/CircleCalc";
import RendererParam from "../vox/scene/RendererParam";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";
import Axis3DEntity from "../vox/entity/Axis3DEntity";
import BrokenLine3DEntity from "../vox/entity/BrokenLine3DEntity";

import MouseEvent from "../vox/event/MouseEvent";
import CameraTrack from "../vox/view/CameraTrack";
import RendererScene from "../vox/scene/RendererScene";
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
            RendererDevice.SHADERCODE_TRACE_ENABLED = false;
            RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
            
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

            this.towCircleCals();

            this.update();

            return;
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
    private towCircleCals():void
    {

        let cv0:Vector3D = new Vector3D();
        let radius0:number = 90.0;
        
        let cv1:Vector3D = new Vector3D(-30.0,110.0,0.0);
        let radius1:number = 120.0;

        let cirL0:BrokenLine3DEntity = new BrokenLine3DEntity();
        cirL0.initializeCircleXOY(cv0, radius0,40);
        this.m_rscene.addEntity(cirL0);

        let cirL1:BrokenLine3DEntity = new BrokenLine3DEntity();
        cirL1.initializeCircleXOY(cv1, radius1,40);
        this.m_rscene.addEntity(cirL1);

        let outv0:Vector3D = new Vector3D();
        let outv1:Vector3D = new Vector3D();
        CircleCalc.CalIntersectionTwoInXOY(cv0,radius0,cv1,radius1,outv0,outv1);

        let axis0:Axis3DEntity = new Axis3DEntity();
        axis0.initialize(30.0);
        axis0.setPosition(outv0);
        this.m_rscene.addEntity(axis0);

        let axis1:Axis3DEntity = new Axis3DEntity();
        axis1.initialize(130.0);
        axis1.setPosition(outv1);
        this.m_rscene.addEntity(axis1);

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
export default DemoMixProgress;