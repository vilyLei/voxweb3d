
import RendererDeviece from "../vox/render/RendererDeviece";
import RendererParam from "../vox/scene/RendererParam";
import Vector3D from "../vox/math/Vector3D";
import Color4 from "../vox/material/Color4";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";

import TextureProxy from "../vox/texture/TextureProxy";
import {TextureConst} from "../vox/texture/TextureConst";

import DisplayEntity from "../vox/entity/DisplayEntity";
import Axis3DEntity from "../vox/entity/Axis3DEntity";

import MouseEvent from "../vox/event/MouseEvent";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import CameraTrack from "../vox/view/CameraTrack";
import RendererScene from "../vox/scene/RendererScene";
import CameraViewRay from "../vox/view/CameraViewRay";

import BoxPartStore from "../app/robot/BoxPartStore";
import BoFrameAxis from "../app/robot/BoFrameAxis";
import TwoFeetUnit from "../app/robot/TwoFeetUnit";
import FourFeetUnit from "../app/robot/FourFeetUnit";
import SixFeetUnit from "../app/robot/SixFeetUnit";
import TwoFeetBody from "../app/robot/TwoFeetBody";
import LinePartStore from "../app/robot/LinePartStore";

export namespace app
{
    /**
     * a robot leg app example
     */
    export class BoFrame
    {
        constructor(){}

        private m_rscene:RendererScene = null;
        private m_texLoader:ImageTextureLoader = null;
        private m_camTrack:CameraTrack = null;
        private m_statusDisp:RenderStatusDisplay = new RenderStatusDisplay();
        private m_frameAxis:BoFrameAxis = null;
        private m_frameAxis1:BoFrameAxis = null;

        private m_twoFUnit0:TwoFeetUnit = null;
        private m_fourFUnit0:FourFeetUnit = null;
        private m_sixFUnit0:SixFeetUnit = null;
        private m_twoFeetBody:TwoFeetBody = null;
        private m_targets:DisplayEntity[] = [];
        private m_viewRay:CameraViewRay = new CameraViewRay();
        getImageTexByUrl(purl:string,wrapRepeat:boolean = true,mipmapEnabled = true):TextureProxy
        {
            let ptex:TextureProxy = this.m_texLoader.getImageTexByUrl(purl);
            ptex.mipmapEnabled = mipmapEnabled;
            if(wrapRepeat)ptex.setWrap(TextureConst.WRAP_REPEAT);
            return ptex;
        }
        initialize():void
        {
            console.log("BoFrame::initialize()......");
            if(this.m_rscene == null)
            {
                RendererDeviece.SHADERCODE_TRACE_ENABLED = false;
                RendererDeviece.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
                //RendererDeviece.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;
                
                let rparam:RendererParam = new RendererParam();
                //rparam.maxWebGLVersion = 1;
                rparam.setCamPosition(800.0,800.0,800.0);
                //rparam.setCamPosition(1200.0,1200.0,0.0);
                //rparam.setCamPosition(0.0,200.0,1200.0);
                this.m_rscene = new RendererScene();
                this.m_rscene.initialize(rparam,3);
                this.m_rscene.updateCamera();
                
                this.m_viewRay.bindCameraAndStage(this.m_rscene.getCamera(), this.m_rscene.getStage3D());
                this.m_viewRay.setPlaneParam(new Vector3D(0.0,1.0,0.0),0.0);

                this.m_camTrack = new CameraTrack();
                this.m_camTrack.bindCamera(this.m_rscene.getCamera());

                this.m_statusDisp.initialize("rstatus",this.m_rscene.getStage3D().viewWidth - 200);

                this.m_texLoader = new ImageTextureLoader( this.m_rscene.textureBlock );
                
                this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this,this.mouseDown);
                
                let tex0:TextureProxy = this.getImageTexByUrl("static/assets/wood_01.jpg");
                let tex1:TextureProxy = this.getImageTexByUrl("static/assets/yanj.jpg");
                let tex2:TextureProxy = this.getImageTexByUrl("static/assets/skin_01.jpg");
                let tex3:TextureProxy = this.getImageTexByUrl("static/assets/default.jpg");
                let tex4:TextureProxy = this.m_rscene.textureBlock.createRGBATex2D(16,16,new Color4(1.0,0.0,1.0));

                let axis:Axis3DEntity = new Axis3DEntity();
                //axis.initializeCross(600.0);
                axis.initialize(300.0);
                this.m_rscene.addEntity(axis);

                axis = new Axis3DEntity();
                axis.initializeCross(200.0);
                this.m_rscene.addEntity(axis);
                /*
                let linePart:LinePartStore = new LinePartStore();
                let boxPart:BoxPartStore = new BoxPartStore();
                boxPart.initilize(tex0,tex2,tex1);
                this.m_frameAxis = new BoFrameAxis();
                //this.m_frameAxis.initialize( this.m_rscene, linePart );
                this.m_frameAxis.initialize( this.m_rscene, boxPart );
                this.m_frameAxis.moveToXZ(300.0,0.0);

                let boxPart1:BoxPartStore = new BoxPartStore();
                boxPart1.initilizeCopyFrom(boxPart);
                //boxPart1.initilize(tex0,tex2,tex1);
                this.m_frameAxis1 = new BoFrameAxis();
                this.m_frameAxis1.initialize( this.m_rscene, boxPart1 );
                this.m_frameAxis1.setXYZ(100.0,0.0,0.0);
                this.m_frameAxis1.moveToXZ(400.0,0.0);
                this.m_frameAxis1.toNegative();
                //  let plane:Plane3DEntity = new Plane3DEntity();
                //  plane.initializeXOZ(-400.0, -400.0, 800.0, 800.0, [tex0]);
                //  plane.setXYZ(0.0,-1.0,0.0);
                //  this.m_rscene.addEntity(plane);
                //  this.m_targets.push(plane);
                //*/
                ///*
                let linePart0:LinePartStore = new LinePartStore();
                let linePart1:LinePartStore = new LinePartStore();
                linePart1.setParam(80.0,-40.0,-30.0);
                let boxPart:BoxPartStore = new BoxPartStore();
                boxPart.initilize(tex0,tex2,tex1);
                
                this.m_twoFeetBody = new TwoFeetBody();
                //this.m_twoFeetBody.initialize( this.m_rscene,0, linePart0, linePart1,60.0);
                this.m_twoFeetBody.initialize( this.m_rscene,0, boxPart, linePart1,80.0);
                this.m_twoFeetBody.moveToXZ(10.0,0.0);
                //*/
                /*
                let linePart:LinePartStore = new LinePartStore();
                let boxPart:BoxPartStore = new BoxPartStore();
                boxPart.initilize(tex0,tex2,tex1);
                
                this.m_twoFUnit0 = new TwoFeetUnit();
                //this.m_twoFUnit0.initialize( this.m_rscene,0, linePart );
                this.m_twoFUnit0.initialize( this.m_rscene,0, boxPart );
                this.m_twoFUnit0.moveToXZ(10.0,0.0);
                //*/
                /*
                let boxPart0:BoxPartStore = new BoxPartStore();
                boxPart0.initilize(tex0,tex2,tex1);
                let boxPart1:BoxPartStore = new BoxPartStore();
                boxPart1.initilizeCopyFrom(boxPart0);

                this.m_fourFUnit0 = new FourFeetUnit();
                this.m_fourFUnit0.initialize( this.m_rscene,0, boxPart0, boxPart1);
                this.m_fourFUnit0.moveToXZ(300.0,0.0);
                //*/
                /*
                let boxPart0:BoxPartStore = new BoxPartStore();
                boxPart0.initilize(tex0,tex2,tex1);
                let boxPart1:BoxPartStore = new BoxPartStore();
                boxPart1.initilizeCopyFrom(boxPart0);
                let boxPart2:BoxPartStore = new BoxPartStore();
                boxPart2.initilizeCopyFrom(boxPart0);

                this.m_sixFUnit0 = new SixFeetUnit();
                this.m_sixFUnit0.initialize( this.m_rscene,0, boxPart0, boxPart1,boxPart2,100);
                this.m_sixFUnit0.moveToXZ(300.0,0.0);
                //*/
                //SixFeetUnit
                this.update();
            }
        }
        private mouseDown(evt:any):void
        {
                
            this.m_viewRay.intersectPiane();

            let pv:Vector3D = this.m_viewRay.position;
            if(this.m_frameAxis != null)this.m_frameAxis.moveToXZ(pv.x, pv.z);
            if(this.m_twoFUnit0 != null)this.m_twoFUnit0.moveToXZ(pv.x, pv.z);
            if(this.m_fourFUnit0 != null)this.m_fourFUnit0.moveToXZ(pv.x, pv.z);
            if(this.m_sixFUnit0 != null)this.m_sixFUnit0.moveToXZ(pv.x, pv.z);
            if(this.m_twoFeetBody != null)this.m_twoFeetBody.moveToXZ(pv.x, pv.z);
        }
        
        private m_timeoutId:any = -1;
        private update():void
        {
            if(this.m_timeoutId > -1)
            {
                clearTimeout(this.m_timeoutId);
            }
            this.m_timeoutId = setTimeout(this.update.bind(this),50);// 50 fps
            if(this.m_frameAxis != null)this.m_frameAxis.run();
            if(this.m_frameAxis1 != null)this.m_frameAxis1.run();
            if(this.m_twoFUnit0 != null)this.m_twoFUnit0.run();
            if(this.m_fourFUnit0 != null)this.m_fourFUnit0.run();
            if(this.m_sixFUnit0 != null)this.m_sixFUnit0.run();
            if(this.m_twoFeetBody != null)this.m_twoFeetBody.run();
        }
        run():void
        {

            this.m_statusDisp.update();

            this.m_rscene.run();

            this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
        }
    }
}