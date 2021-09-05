
import Vector3D from "../vox/math/Vector3D";
import RendererDevice from "../vox/render/RendererDevice";
import RendererParam from "../vox/scene/RendererParam";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";

import Plane3DEntity from "../vox/entity/Plane3DEntity";
import Axis3DEntity from "../vox/entity/Axis3DEntity";
import Line3DEntity from "../vox/entity/Line3DEntity";
import DashedLine3DEntity from "../vox/entity/DashedLine3DEntity";
import TextureProxy from "../vox/texture/TextureProxy";
import {TextureConst,TextureFormat,TextureDataType,TextureTarget} from "../vox/texture/TextureConst";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import CameraTrack from "../vox/view/CameraTrack";
import RendererScene from "../vox/scene/RendererScene";
import BoxGroupTrack from "../voxanimate/primitive/BoxGroupTrack";

//import Vector3D = Vector3DT.vox.math.Vector3D;
//import RendererDevice = RendererDeviceT.vox.render.RendererDevice;
//import RendererParam = RendererParamT.vox.scene.RendererParam;
//import RenderStatusDisplay = RenderStatusDisplayT.vox.scene.RenderStatusDisplay;

//import Plane3DEntity = Plane3DEntityT.vox.entity.Plane3DEntity;
//import Axis3DEntity = Axis3DEntityT.vox.entity.Axis3DEntity;
//import DashedLine3DEntity = DashedLine3DEntityT.vox.entity.DashedLine3DEntity;
//import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
//import TextureConst = TextureConstT.vox.texture.TextureConst;
//import ImageTextureLoader = ImageTextureLoaderT.vox.texture.ImageTextureLoader;
//import CameraTrack = CameraTrackT.vox.view.CameraTrack;
//import RendererScene = RendererSceneT.vox.scene.RendererScene;
//import BoxGroupTrack = BoxGroupTrackT.voxanimate.primtive.BoxGroupTrack;

export namespace demo
{
    class TrackWheelRole
    {
        private m_pz:number = Math.random() * 400.0 - 200.00;
        private m_px:number = Math.random() * 200.0 - 100.00;
        private m_spdx:number = 1.0;
        private m_tspdx:number = 3.0;

        boxTrack:BoxGroupTrack = null;        
        maxV:Vector3D = new Vector3D(400.0,0.0,0.0);
        minV:Vector3D = new Vector3D(-400.0,0.0,0.0);
        constructor(){}
        initialize():void
        {
            if(this.boxTrack != null)
            {
                this.boxTrack.setXYZ(this.m_px, 0.0, this.m_pz);
                let f:number =  Math.random() > 0.5 ? 1:-1;
                this.m_spdx = f * 2.0;
                this.m_tspdx = 2.0 * f;
            }
        }
        run():void
        {
            if(this.boxTrack != null)
            {
                this.boxTrack.moveDistanceOffset(this.m_tspdx * 0.25);
                this.m_px += this.m_spdx;
                if(this.m_spdx > 0 && this.m_px > this.maxV.x)
                {
                    this.m_spdx *= -1.0;
                    this.m_tspdx *= -1.0;
                }
                else if(this.m_spdx < 0 && this.m_px < this.minV.x)
                {
                    this.m_spdx *= -1.0;
                    this.m_tspdx *= -1.0;
                }
                this.boxTrack.setXYZ(this.m_px,0.0,this.m_pz);
                this.boxTrack.update();
            }
        }

    }
    export class DemoBoxGroupTrack
    {
        constructor()
        {
        }
        private m_rscene:RendererScene = null;
        private m_texLoader:ImageTextureLoader = null;
        private m_camTrack:CameraTrack = null;
        private m_statusDisp:RenderStatusDisplay = new RenderStatusDisplay();
        private m_boxTrack:BoxGroupTrack = new BoxGroupTrack();
        private m_role0:TrackWheelRole = new TrackWheelRole();
        private m_role1:TrackWheelRole = new TrackWheelRole();
        private getImageTexByUrl(purl:string,wrapRepeat:boolean = true,mipmapEnabled = true):TextureProxy
        {
            let ptex:TextureProxy = this.m_texLoader.getImageTexByUrl(purl);
            ptex.mipmapEnabled = mipmapEnabled;
            if(wrapRepeat)ptex.setWrap(TextureConst.WRAP_REPEAT);
            return ptex;
        }
                
        
        initialize():void
        {
            console.log("DemoBoxGroupTrack::initialize()......");
            if(this.m_rscene == null)
            {
                RendererDevice.SHADERCODE_TRACE_ENABLED = true;
                RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
                //RendererDevice.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;

                let rparam:RendererParam = new RendererParam();
                //rparam.maxWebGLVersion = 1;
                //rparam.setCamPosition(500.0,500.0,500.0);
                rparam.setCamPosition(1200.0,1200.0,1200.0);
                this.m_rscene = new RendererScene();
                this.m_rscene.initialize(rparam,3);
                this.m_rscene.updateCamera();
                
                this.m_texLoader = new ImageTextureLoader( this.m_rscene.textureBlock );

                this.m_camTrack = new CameraTrack();
                this.m_camTrack.bindCamera(this.m_rscene.getCamera());

                this.m_statusDisp.initialize("rstatus",this.m_rscene.getStage3D().stageWidth - 180);

                let tex0:TextureProxy = this.getImageTexByUrl("static/assets/metal_02.jpg");
                let tex1:TextureProxy = this.getImageTexByUrl("static/assets/green.jpg");
                
                let axis:Axis3DEntity = new Axis3DEntity();
                axis.initialize(310);
                this.m_rscene.addEntity(axis);

                //  this.m_boxTrack.setTrackScaleXYZ(0.2,0.2,0.2);
                //  this.m_boxTrack.initialize(this.m_rscene.textureBlock,0.5,[tex0]);
                
                this.m_boxTrack.setTrackScaleXYZ(0.4,0.4,1.0);
                //this.m_boxTrack.setFactor(2,5,2);
                //this.m_boxTrack.initialize(this.m_rscene.textureBlock,0.5,[tex0]);
                this.m_boxTrack.setFactor(5,5,5);
                this.m_boxTrack.initialize(this.m_rscene.textureBlock,5.0,[tex0]);
                //this.m_boxTrack.setScale(2.2);
                this.m_rscene.addEntity(this.m_boxTrack.animator);

                this.m_role0.boxTrack = this.m_boxTrack;
                this.m_role0.initialize();
                ///*
                let boxTrack:BoxGroupTrack = new BoxGroupTrack();
                boxTrack.initializeFrom(this.m_boxTrack,[tex0]);
                this.m_rscene.addEntity(boxTrack.animator);
                //this.m_role1
                this.m_role1.boxTrack = boxTrack;
                this.m_role1.initialize();
                //*/
                let curveLine:DashedLine3DEntity = new DashedLine3DEntity();
                curveLine.initializeByPosition(this.m_boxTrack.getTrackPosList());
                this.m_rscene.addEntity(curveLine);

                this.update();
            }
        }
        private m_timeoutId:any = -1;
        private update():void
        {
            if(this.m_timeoutId > -1)
            {
                clearTimeout(this.m_timeoutId);
            }
            //this.m_timeoutId = setTimeout(this.update.bind(this),16);// 60 fps
            this.m_timeoutId = setTimeout(this.update.bind(this),30);// 33 fps
            this.m_statusDisp.render();
            
            this.m_role0.run();
            this.m_role1.run();
        }
        run():void
        {
            
            // show fps status
            this.m_statusDisp.update(false);
            
            this.m_rscene.run();
            
            // render end
            this.m_rscene.runEnd();

            //this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
        }
    }
}