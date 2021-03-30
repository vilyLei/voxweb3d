
import * as MathConstT from "../vox/math/MathConst";
import * as Vector3DT from "../vox/math/Vector3D";
import * as RendererDevieceT from "../vox/render/RendererDeviece";
import * as RendererStateT from "../vox/render/RendererState";
import * as CameraViewRayT from "../vox/view/CameraViewRay";
import * as RendererParamT from "../vox/scene/RendererParam";
import * as RendererSceneT from "../vox/scene/RendererScene";
import * as RenderStatusDisplayT from "../vox/scene/RenderStatusDisplay";
import * as MouseEventT from "../vox/event/MouseEvent";

import * as Plane3DEntityT from "../vox/entity/Plane3DEntity";
import * as Axis3DEntityT from "../vox/entity/Axis3DEntity";
import * as TextureProxyT from "../vox/texture/TextureProxy";
import * as TextureConstT from "../vox/texture/TextureConst";
import * as ImageTextureLoaderT from "../vox/texture/ImageTextureLoader";
import * as CameraTrackT from "../vox/view/CameraTrack";
import * as EruptionEffectPoolT from "../particle/effect/EruptionEffectPool";
import * as EruptionSmokePoolT from "../particle/effect/EruptionSmokePool";

import MathConst = MathConstT.vox.math.MathConst;
import Vector3D = Vector3DT.vox.math.Vector3D;
import RendererDeviece = RendererDevieceT.vox.render.RendererDeviece;
import RendererState = RendererStateT.vox.render.RendererState;
import CameraViewRay = CameraViewRayT.vox.view.CameraViewRay;
import RendererParam = RendererParamT.vox.scene.RendererParam;
import RendererScene = RendererSceneT.vox.scene.RendererScene;
import RenderStatusDisplay = RenderStatusDisplayT.vox.scene.RenderStatusDisplay;
import MouseEvent = MouseEventT.vox.event.MouseEvent;

import Plane3DEntity = Plane3DEntityT.vox.entity.Plane3DEntity;
import Axis3DEntity = Axis3DEntityT.vox.entity.Axis3DEntity;
import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
import TextureConst = TextureConstT.vox.texture.TextureConst;
import ImageTextureLoader = ImageTextureLoaderT.vox.texture.ImageTextureLoader;
import CameraTrack = CameraTrackT.vox.view.CameraTrack;
import EruptionEffectPool = EruptionEffectPoolT.particle.effect.EruptionEffectPool;
import EruptionSmokePool = EruptionSmokePoolT.particle.effect.EruptionSmokePool;

export namespace demo
{
    export class DemoParticleEruption
    {
        constructor(){}

        private m_rscene:RendererScene = null;
        private m_texLoader:ImageTextureLoader = null;
        private m_camTrack:CameraTrack = null;
        private m_statusDisp:RenderStatusDisplay = new RenderStatusDisplay();
        private m_axis:Axis3DEntity = null;
        private m_textures:TextureProxy[] = null;
        private m_eff0Pool:EruptionEffectPool = null;
        private m_eff1Pool:EruptionSmokePool = null;
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
            let boo0:any = true;
            let boo1:any = false;
            console.log("DemoParticleEruption::initialize()......: "+(boo0 + boo1));
            if(this.m_rscene == null)
            {
                RendererDeviece.SHADERCODE_TRACE_ENABLED = true;
                
                let rparam:RendererParam = new RendererParam();
                rparam.setAttriAlpha(false);
                rparam.setMatrix4AllocateSize(4096);
                rparam.setCamProject(45.0,10.0,5000.0);
                rparam.setCamPosition(1500.0,1500.0,1500.0);
                
                this.m_rscene = new RendererScene();
                this.m_rscene.initialize(rparam,3);
                this.m_rscene.setRendererProcessParam(1,true,true);

                this.m_viewRay.bindCameraAndStage(this.m_rscene.getCamera(), this.m_rscene.getStage3D());
                this.m_viewRay.setPlaneParam(new Vector3D(0.0,1.0,0.0),0.0);

                this.m_texLoader = new ImageTextureLoader( this.m_rscene.textureBlock );
                this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN,this,this.mouseDownListener);
                this.m_camTrack = new CameraTrack();
                this.m_camTrack.bindCamera(this.m_rscene.getCamera());

                this.m_statusDisp.initialize("rstatus",this.m_rscene.getStage3D().viewWidth - 180);
                ///*
                let axis:Axis3DEntity = new Axis3DEntity();
                axis.name = "axis";
                axis.initialize(100.0);
                axis.setXYZ(100.0,0.0,100.0);
                this.m_rscene.addEntity(axis);
                this.m_axis = axis;

                axis = new Axis3DEntity();
                axis.name = "axis";
                axis.initialize(600.0);
                this.m_rscene.addEntity(axis);

                //*/
                let textures:TextureProxy[] = [];
                textures.push( this.getImageTexByUrl("static/assets/wood_02.jpg") );
                textures.push( this.getImageTexByUrl("static/assets/arrow01.png") );
                textures.push( this.getImageTexByUrl("static/assets/partile_tex_001.jpg") );
                textures.push( this.getImageTexByUrl("static/assets/stones_02.png") );
                textures.push(this.getImageTexByUrl("static/assets/guangyun_H_0007.png") );
                textures.push(this.getImageTexByUrl("static/assets/flare_core_01.jpg"));
                textures.push(this.getImageTexByUrl("static/assets/flare_core_02.jpg"));
                textures.push(this.getImageTexByUrl("static/assets/a_02_c.jpg"));
                textures.push(this.getImageTexByUrl("static/assets/testEFT4.jpg"));
                textures.push(this.getImageTexByUrl("static/assets/xulie_02_07.png"));
                this.m_textures = textures;
                let plane:Plane3DEntity = new Plane3DEntity();
                plane.initializeXOZ(-500.0,-500.0,1000.0,1000.0,[textures[0]]);
                //plane.toTransparentBlend(false);
                plane.setXYZ(0.0,-80.0,0.0);
                this.m_rscene.addEntity(plane);
                let material:any = plane.getMaterial();
                //material.setRGB3f(0.8,0.8,0.8);
                this.update();
            }
        }
        private initializeEffect():void
        {
            if(this.m_eff0Pool == null)
            {
                let texFlame:TextureProxy = this.m_textures[8];
                let texSolid:TextureProxy = this.m_textures[3];
                this.m_eff0Pool = new EruptionEffectPool();
                this.m_eff0Pool.initialize(this.m_rscene,1, 60,50, texFlame, texSolid, true);
                //  this.m_eff0Pool.createEffect(null);
            }
            if(this.m_eff1Pool == null)
            {

                let texture:TextureProxy = this.m_textures[9];
                let colorTexture:TextureProxy = this.m_textures[3];
                this.m_eff1Pool = new EruptionSmokePool();
                this.m_eff1Pool.initialize(this.m_rscene,1, 10, texture, colorTexture, true);
                //  this.m_eff1Pool.createEffect(null);
            }
        }

        mouseDownListener(evt:any):void
        {
            //console.log("mouseDownListener call, this.m_rscene: "+this.m_rscene.toString());
            
            if(this.m_eff0Pool != null)
            {
                this.m_viewRay.intersectPiane();

                this.m_axis.setPosition( this.m_viewRay.position );
                this.m_axis.update();
                //  this.m_eff1Pool.createEffect(this.m_viewRay.position);

                if(Math.random() > 0.5)
                {
                    this.m_eff0Pool.createEffect(this.m_viewRay.position);
                }
                else
                {
                    this.m_eff1Pool.createEffect(this.m_viewRay.position);
                }
            }
        }
        private m_effInited:boolean = true;
        private m_timeoutId:any = -1;
        private update():void
        {
            if(this.m_timeoutId > -1)
            {
                clearTimeout(this.m_timeoutId);
            }
            this.m_timeoutId = setTimeout(this.update.bind(this),20);// 50 fps
            
            this.m_rscene.update();
            if(this.m_textures[0].isDataEnough())
            {
                
                if(this.m_effInited)
                {
                    this.initializeEffect();
                    this.m_effInited = false;
                }

                if(this.m_eff0Pool != null)
                {
                    this.m_eff0Pool.run();
                    this.m_eff1Pool.run();
                }
                this.m_camTrack.rotationOffsetAngleWorldY(-0.1);
            }
        }
        run():void
        {
            this.m_rscene.setClearRGBColor3f(0.1, 0.1, 0.1);
            this.m_rscene.run()
            
            this.m_statusDisp.statusInfo = "/"+RendererState.DrawCallTimes;
            this.m_statusDisp.update();
        }        
    }
}