
import RendererDeviece from "../vox/render/RendererDeviece";
import RendererParam from "../vox/scene/RendererParam";
import Vector3D from "../vox/math/Vector3D";
import Color4 from "../vox/material/Color4";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";

import RendererState from "../vox/render/RendererState";
import TextureProxy from "../vox/texture/TextureProxy";
import {TextureConst,TextureFormat,TextureDataType,TextureTarget} from "../vox/texture/TextureConst";

import DisplayEntity from "../vox/entity/DisplayEntity";
import Axis3DEntity from "../vox/entity/Axis3DEntity";
import Plane3DEntity from "../vox/entity/Plane3DEntity";
import Box3DEntity from "../vox/entity/Box3DEntity";

import MouseEvent from "../vox/event/MouseEvent";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import CameraTrack from "../vox/view/CameraTrack";
import RendererScene from "../vox/scene/RendererScene";

import CameraViewRay from "../vox/view/CameraViewRay";
import WlKTModule from "../app/calc/WlKTModule";


export namespace app
{
    /**
     * 
     */
    export class LegRole
    {
        constructor(){}

        private m_rscene:RendererScene = null;
        private m_texLoader:ImageTextureLoader = null;
        private m_camTrack:CameraTrack = null;
        private m_statusDisp:RenderStatusDisplay = new RenderStatusDisplay();
        private m_viewRay:CameraViewRay = new CameraViewRay();

        private m_targets:DisplayEntity[] = [];
        private m_modules:WlKTModule[] = []
        private m_srcModule:WlKTModule = null;
        getImageTexByUrl(purl:string,wrapRepeat:boolean = true,mipmapEnabled = true):TextureProxy
        {
            let ptex:TextureProxy = this.m_texLoader.getImageTexByUrl(purl);
            ptex.mipmapEnabled = mipmapEnabled;
            if(wrapRepeat)ptex.setWrap(TextureConst.WRAP_REPEAT);
            return ptex;
        }
        initialize():void
        {
            console.log("LegRole::initialize()......");
            if(this.m_rscene == null)
            {
                RendererDeviece.SHADERCODE_TRACE_ENABLED = true;
                RendererDeviece.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
                //RendererDeviece.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;
                
                let rparam:RendererParam = new RendererParam();
                //rparam.maxWebGLVersion = 1;
                rparam.setCamPosition(800.0,800.0,800.0);
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
                let tex2:TextureProxy = this.getImageTexByUrl("static/assets/default.jpg");
                let tex3:TextureProxy = this.m_rscene.textureBlock.createRGBATex2D(16,16,new Color4(1.0,0.0,1.0));

                let axis:Axis3DEntity = new Axis3DEntity();
                axis.initializeCross(600.0);
                this.m_rscene.addEntity(axis);

                let plane:Plane3DEntity = new Plane3DEntity();
                plane.initializeXOZ(-400.0, -400.0, 800.0, 800.0, [tex0]);
                plane.setXYZ(0.0,-1.0,0.0);
                this.m_rscene.addEntity(plane);
                this.m_targets.push(plane);

                let srcModule:WlKTModule = null;
                let mdoule:WlKTModule = new WlKTModule();
                mdoule.initialize(this.m_rscene, [tex2]);
                mdoule.setRotation(Math.random() * 360);
                
                mdoule.setSpeedScale(3.0);
                //mdoule.setXYZ(Math.random() * 800 - 400.0,0, Math.random() * 800 - 400.0);
                this.m_modules.push(mdoule);
                this.m_srcModule = mdoule;
                srcModule = mdoule;
                
                let i:number = 0;
                let scale:number = 0.2 + Math.random() * 0.7;
                let total:number = 0;
                for(; i < total; ++i)
                {
                    mdoule = new WlKTModule();
                    mdoule.initializeFrom(srcModule);
                    mdoule.setScale(scale);
                    mdoule.setRotation(Math.random() * 360);
                    
                    mdoule.setXYZ(Math.random() * 800 - 400.0,0, Math.random() * 800 - 400.0);
                    scale = 1.0 - scale;
                    if(scale < 0.0)scale = 0.0;
                    mdoule.setSpeedScale(2.0 + scale + (Math.random() * 1.0 - 0.5));
                    //mdoule.setSpeedScale(1.8);
                    this.m_modules.push(mdoule);
                }
                this.update();
            }
        }
        private mouseDown(evt:any):void
        {
            if(this.m_srcModule != null)
            {
                
                this.m_viewRay.intersectPiane();

                let pv:Vector3D = this.m_viewRay.position;
                this.m_srcModule.moveToXZ(pv.x, pv.z);
            }
            /*
            if(this.m_srcModule != null)
            {
                if(this.m_srcModule.isAwake())
                {
                    this.m_srcModule.sleep();
                }
                else
                {
                    this.m_srcModule.wake();
                }
            }
            //*/
            /*
            let len:number = this.m_modules.length;
            let i:number = 0;
            for(; i < len; ++i)
            {
                //this.m_modules[i].run();
                //  this.m_modules[i].setRotation(Math.random() * 360);
                //  this.m_modules[i].setXYZ(Math.random() * 800 - 400.0,0, Math.random() * 800 - 400.0);
                if(this.m_modules[i].isAwake())
                {
                    this.m_modules[i].sleep();
                }
                else
                {
                    this.m_modules[i].wake();
                }
            }
            //*/
        }
        
        private m_timeoutId:any = -1;
        private update():void
        {
            if(this.m_timeoutId > -1)
            {
                clearTimeout(this.m_timeoutId);
            }
            this.m_timeoutId = setTimeout(this.update.bind(this),20);// 50 fps

            
            let len:number = this.m_modules.length;
            let i:number = 0;
            for(; i < len; ++i)
            {
                this.m_modules[i].run();
            }
        }
        run():void
        {
            this.m_statusDisp.update();
            this.m_rscene.run();
            
            //this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
        }
    }
}