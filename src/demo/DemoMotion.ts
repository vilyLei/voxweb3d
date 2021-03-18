
import * as MathConstT from "../vox/math/MathConst";
import * as Vector3DT from "../vox/math/Vector3D";
import * as RendererDevieceT from "../vox/render/RendererDeviece";
import * as RendererParamT from "../vox/scene/RendererParam";
import * as RendererInstanceContextT from "../vox/scene/RendererInstanceContext";
import * as RenderStatusDisplayT from "../vox/scene/RenderStatusDisplay";

import * as VtxBufConstT from "../vox/mesh/VtxBufConst";
import * as Box3DMeshT from "../vox/mesh/Box3DMesh";
import * as DisplayEntityT from "../vox/entity/DisplayEntity";
import * as Plane3DEntityT from "../vox/entity/Plane3DEntity";
import * as Box3DEntityT from "../vox/entity/Box3DEntity";
import * as Axis3DEntityT from "../vox/entity/Axis3DEntity";
import * as TextureConstT from "../vox/texture/TextureConst";
import * as TextureProxyT from "../vox/texture/TextureProxy";
import * as ImageTextureProxyT from "../vox/texture/ImageTextureProxy";

import * as MouseEventT from "../vox/event/MouseEvent";
import * as ImageTextureLoaderT from "../vox/texture/ImageTextureLoader";
import * as CameraTrackT from "../vox/view/CameraTrack";
import * as RendererSceneT from "../vox/scene/RendererScene";
import * as ProfileInstanceT from "../voxprofile/entity/ProfileInstance";
import * as PlaneT from "../vox/geom/Plane";
import * as DirectXZModuleT from "../voxmotion/primitive/DirectXZModule";

import MathConst = MathConstT.vox.math.MathConst;
import Vector3D = Vector3DT.vox.math.Vector3D;
import RendererDeviece = RendererDevieceT.vox.render.RendererDeviece;
import RendererParam = RendererParamT.vox.scene.RendererParam;
import RendererInstanceContext = RendererInstanceContextT.vox.scene.RendererInstanceContext;
import RenderStatusDisplay = RenderStatusDisplayT.vox.scene.RenderStatusDisplay;

import VtxNormalType = VtxBufConstT.vox.mesh.VtxNormalType;
import Box3DMesh = Box3DMeshT.vox.mesh.Box3DMesh;
import DisplayEntity = DisplayEntityT.vox.entity.DisplayEntity;
import Plane3DEntity = Plane3DEntityT.vox.entity.Plane3DEntity;
import Axis3DEntity = Axis3DEntityT.vox.entity.Axis3DEntity;
import Box3DEntity = Box3DEntityT.vox.entity.Box3DEntity;
import TextureConst = TextureConstT.vox.texture.TextureConst;
import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
import ImageTextureProxy = ImageTextureProxyT.vox.texture.ImageTextureProxy;

import MouseEvent = MouseEventT.vox.event.MouseEvent;
import ImageTextureLoader = ImageTextureLoaderT.vox.texture.ImageTextureLoader;
import CameraTrack = CameraTrackT.vox.view.CameraTrack;
import RendererScene = RendererSceneT.vox.scene.RendererScene;
import ProfileInstance = ProfileInstanceT.voxprofile.entity.ProfileInstance;
import Plane = PlaneT.vox.geom.Plane;
import DirectXZModule = DirectXZModuleT.voxmotion.primitive.DirectXZModule;

export namespace demo
{
    export class DemoMotion
    {
        constructor(){}

        private m_rscene:RendererScene = null;
        private m_rcontext:RendererInstanceContext = null;
        private m_texLoader:ImageTextureLoader = null;
        private m_camTrack:CameraTrack = null;
        private m_statusDisp:RenderStatusDisplay = new RenderStatusDisplay();
        private m_profileInstance:ProfileInstance = new ProfileInstance();
        private m_targets:DisplayEntity[] = [];
        private m_crossTarget:DisplayEntity = null;

        private getImageTexByUrl(purl:string,wrapRepeat:boolean = true,mipmapEnabled = true):TextureProxy
        {
            let ptex:TextureProxy = this.m_texLoader.getImageTexByUrl(purl);
            ptex.mipmapEnabled = mipmapEnabled;
            if(wrapRepeat)ptex.setWrap(TextureConst.WRAP_REPEAT);
            return ptex;
        }
        private m_tickModule:DirectXZModule = new DirectXZModule();
        initialize():void
        {
            console.log("DemoMotion::initialize()......");
            if(this.m_rscene == null)
            {
                RendererDeviece.SHADERCODE_TRACE_ENABLED = false;
                RendererDeviece.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
                //RendererDeviece.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;
                
                let rparam:RendererParam = new RendererParam();
                rparam.setCamPosition(800.0,800.0,800.0);
                this.m_rscene = new RendererScene();
                this.m_rscene.initialize(rparam,3);
                this.m_rscene.updateCamera();
                this.m_rcontext = this.m_rscene.getRendererContext();
                this.m_texLoader = new ImageTextureLoader( this.m_rscene.textureBlock );
                
                this.m_camTrack = new CameraTrack();
                this.m_camTrack.bindCamera(this.m_rscene.getCamera());

                this.m_profileInstance.initialize(this.m_rscene.getRenderer());
                this.m_statusDisp.initialize("rstatus", this.m_rscene.getStage3D().viewWidth - 200);

                this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this,this.mouseDown);

                let axis:Axis3DEntity = new Axis3DEntity();
                axis.initialize(300.0);
                this.m_rscene.addEntity(axis);
                
                let rangeMin:number = 0.3;
                let rangeMax:number = 0.6;
                let rangeD:number = 1.0 - rangeMax;
                let totValue:number = 20;
                for(let i:number = 0; i <= totValue; ++i)
                {
                    let k:number = i/totValue;
                    //  let a:number = Math.min(k/rangeMin,1.0);
                    //  let b:number = 1.0 - Math.max((k-rangeMax)/rangeD,0.0);
                    //  value  = a * b
                    //  value: 
                    k = Math.min(k/rangeMin,1.0) * (1.0 - Math.max((k-rangeMax)/rangeD,0.0));
                    //console.log("i("+i+"), ",a*b);
                    console.log("i("+i+"), ",k);
                }

                
                let box:Box3DEntity = new Box3DEntity();
                box.initializeCube(40.0, [this.getImageTexByUrl("static/assets/default.jpg")]);
                this.m_rscene.addEntity(box);

                let cross:Axis3DEntity = new Axis3DEntity();
                cross.initializeCross(60.0);
                this.m_rscene.addEntity(cross);
                this.m_tickModule.setTarget(cross);
                this.m_tickModule.setTarget(box);
                this.m_tickModule.setVelocityFactor(0.02,0.03);
                this.m_crossTarget = cross;
                this.m_tickModule.toXZ(100,0);
                // add common 3d display entity
                //      let plane:Plane3DEntity = new Plane3DEntity();
                //      plane.initializeXOZ(-400.0, -400.0, 800.0, 800.0, [this.getImageTexByUrl("static/assets/broken_iron.jpg")]);
                //      this.m_rscene.addEntity(plane);
                //      this.m_targets.push(plane);
                //      //this.m_disp = plane


                this.m_rscene.setAutoRunning(false);
                this.update();
                

            }
        }
        private m_updateId:number = 0;
        private m_currentDelta:number = 0;
        private m_previousDelta:number = 0;
        private m_fpsLimit:number = 70;

        private m_timeoutId:any = -1;
        private m_pv:Vector3D = new Vector3D();
        private m_rlpv:Vector3D = new Vector3D();
        private m_rltv:Vector3D = new Vector3D();
        private m_pnv:Vector3D = new Vector3D(0.0,1.0,0.0);
        private m_pdis:number = 0.0;

        private mouseDown(evt:any):void
        {
            this.m_rscene.getMouseXYWorldRay(this.m_rlpv, this.m_rltv);
            Plane.IntersectionSLV2(this.m_pnv, this.m_pdis, this.m_rlpv, this.m_rltv, this.m_pv);
            //  this.m_crossTarget.setPosition(this.m_pv);
            //  this.m_crossTarget.update();
            this.m_tickModule.toXZ(this.m_pv.x, this.m_pv.z);
        }
        private update():void
        {
            //  if(this.m_running)
            //  {
                if(this.m_timeoutId > -1)
                {
                    clearTimeout(this.m_timeoutId);
                }
                //this.m_timeoutId = setTimeout(this.update.bind(this),16);// 60 fps
                this.m_timeoutId = setTimeout(this.update.bind(this),50);// 20 fps
                let pcontext:RendererInstanceContext = this.m_rcontext;
                this.m_statusDisp.statusInfo = "/"+pcontext.getTextureResTotal()+"/"+pcontext.getTextureAttachTotal();
                
                this.m_texLoader.run();
                this.m_rscene.update();
                this.m_statusDisp.render();
            //  }
        }
        run():void
        {
            //  if(this.m_running)
            //  {
                this.m_tickModule.run();
                this.m_currentDelta = Date.now();
                let delta:number = this.m_currentDelta - this.m_previousDelta;
                if (this.m_fpsLimit && delta < (1000 / this.m_fpsLimit)) {
                    return;
                }
                this.m_previousDelta = this.m_currentDelta;
    
                this.m_statusDisp.update(false);
    
                this.m_rscene.runBegin();
                this.m_rscene.run();
                this.m_rscene.runEnd();
    
                ///if(this.m_camRunning)this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
                this.m_profileInstance.run();
            //}
        }
    }
}