
import * as Vector3DT from "../vox/geom/Vector3";
import * as RendererDevieceT from "../vox/render/RendererDeviece";
import * as RenderConstT from "../vox/render/RenderConst";
import * as RendererStateT from "../vox/render/RendererState";
import * as RendererParamT from "../vox/scene/RendererParam";
import * as RendererSceneT from "../vox/scene/RendererScene";
import * as RenderStatusDisplayT from "../vox/scene/RenderStatusDisplay";
import * as MouseEventT from "../vox/event/MouseEvent";
import * as Stage3DT from "../vox/display/Stage3D";

import * as Axis3DEntityT from "../vox/entity/Axis3DEntity";
import * as Billboard3DEntityT from "../vox/entity/Billboard3DEntity";
import * as TextureProxyT from "../vox/texture/TextureProxy";
import * as TextureConstT from "../vox/texture/TextureConst";
import * as ImageTextureLoaderT from "../vox/texture/ImageTextureLoader";
import * as CameraTrackT from "../vox/view/CameraTrack";
import * as EntityDispT from "./base/EntityDisp";
import * as Color4T from "../vox/material/Color4";

import Vector3D = Vector3DT.vox.geom.Vector3D;
import RendererDeviece = RendererDevieceT.vox.render.RendererDeviece;
import CullFaceMode = RenderConstT.vox.render.CullFaceMode;
import RenderBlendMode = RenderConstT.vox.render.RenderBlendMode;
import DepthTestMode = RenderConstT.vox.render.DepthTestMode;
import RendererState = RendererStateT.vox.render.RendererState;
import RendererParam = RendererParamT.vox.scene.RendererParam;
import RendererScene = RendererSceneT.vox.scene.RendererScene;
import RenderStatusDisplay = RenderStatusDisplayT.vox.scene.RenderStatusDisplay;
import MouseEvent = MouseEventT.vox.event.MouseEvent;
import Stage3D = Stage3DT.vox.display.Stage3D;

import Axis3DEntity = Axis3DEntityT.vox.entity.Axis3DEntity;
import Billboard3DEntity = Billboard3DEntityT.vox.entity.Billboard3DEntity;
import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
import TextureConst = TextureConstT.vox.texture.TextureConst;
import ImageTextureLoader = ImageTextureLoaderT.vox.texture.ImageTextureLoader;
import CameraTrack = CameraTrackT.vox.view.CameraTrack;
import Color4 = Color4T.vox.material.Color4;
import EntityDispQueue = EntityDispT.demo.base.EntityDispQueue;

export namespace demo
{
    export class DemoParticle
    {
        constructor()
        {
        }
        private m_rscene:RendererScene = null;
        private m_texLoader:ImageTextureLoader = null;
        private m_camTrack:CameraTrack = null;
        private m_statusDisp:RenderStatusDisplay = new RenderStatusDisplay();
        private m_equeue:EntityDispQueue = new EntityDispQueue();
        private m_timeoutEnabled:boolean = true;
        private m_intervalEnabled:boolean = false;
        private m_timeoutId:any = -1;
        private m_timeIntervalId:any = -1;
        
        getImageTexByUrl(purl:string,wrapRepeat:boolean = true,mipmapEnabled = true):TextureProxy
        {
            let ptex:TextureProxy = this.m_texLoader.getImageTexByUrl(purl);
            ptex.mipmapEnabled = mipmapEnabled;
            if(wrapRepeat)ptex.setWrap(TextureConst.WRAP_REPEAT);
            return ptex;
        }
        initialize():void
        {
            console.log("DemoParticle::initialize()......");
            if(this.m_rscene == null)
            {
                RendererDeviece.SHADERCODE_TRACE_ENABLED = true;
                
                
                let rparam:RendererParam = new RendererParam();
                rparam.setMatrix4AllocateSize(8192 * 4);
                rparam.setCamProject(45.0,10.0,3000.0);
                rparam.setCamPosition(1500.0,1500.0,1500.0);
                
                this.m_rscene = new RendererScene();
                this.m_rscene.initialize(rparam,3);
                this.m_rscene.setRendererProcessParam(1,true,true);
                this.m_texLoader = new ImageTextureLoader( this.m_rscene.textureBlock );

                let stage3D:Stage3D = this.m_rscene.getStage3D();
                stage3D.addEventListener(MouseEvent.MOUSE_DOWN,this,this.mouseDownListener);
                this.m_camTrack = new CameraTrack();
                this.m_camTrack.bindCamera(this.m_rscene.getCamera());

                this.m_statusDisp.initialize("rstatus",this.m_rscene.getStage3D().viewWidth - 180);
                RendererState.CreateRenderState("ADD01",CullFaceMode.BACK,RenderBlendMode.ADD,DepthTestMode.RENDER_BLEND);
                RendererState.CreateRenderState("ADD02",CullFaceMode.BACK,RenderBlendMode.ADD,DepthTestMode.RENDER_ALWAYS);
                
                let axis:Axis3DEntity = new Axis3DEntity();
                axis.name = "axis";
                axis.initialize(300.0);
                axis.setXYZ(100.0,100.0,100.0);
                this.m_rscene.addEntity(axis);
                
                axis = new Axis3DEntity();
                axis.name = "axis";
                axis.initialize(600.0);
                this.m_rscene.addEntity(axis);
                
                let textures:TextureProxy[] = [];
                textures.push( this.getImageTexByUrl("static/assets/guangyun_H_0007.png") );
                textures.push(this.getImageTexByUrl("static/assets/flare_core_01.jpg"));
                textures.push(this.getImageTexByUrl("static/assets/flare_core_02.jpg"));
                textures.push(this.getImageTexByUrl("static/assets/a_02_c.jpg"));


                DecayBrnParticle.Initialize(100.0, textures, this.m_rscene);
                
                if(this.m_timeoutEnabled)
                {
                    if(this.m_intervalEnabled)
                    {
                        this.m_timeIntervalId = setInterval(this.parRun.bind(this),25);
                    }
                    else
                    {
                        this.parRun();
                    }
                }
            }
        }
        private m_flagBoo:boolean = true;
        mouseDownListener(evt:any):void
        {
            console.log("mouseDownListener call, this.m_rscene: "+this.m_rscene.toString());
            this.m_flagBoo = !this.m_flagBoo;
        }
        position:Vector3D = new Vector3D();
        delayTime:number = 10;
        run():void
        {
            this.m_texLoader.run();
            this.m_equeue.run();

            this.m_rscene.setClearRGBColor3f(0.1, 0.1, 0.1);
            this.m_rscene.renderBegin();

            this.m_rscene.update();
            this.m_rscene.run();

            this.m_rscene.runEnd();
            this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
            
            if(!this.m_timeoutEnabled)
            {
                this.parRun();
            }
            this.m_statusDisp.statusInfo = "/"+RendererState.DrawCallTimes;
            this.m_statusDisp.update();
        }
        
        parRun():void
        {
            if(this.m_flagBoo)
            {
                if(this.delayTime < 0)
                {
                    this.delayTime = 10;
                    let par:DecayBrnParticle = null;

                    let i:number = 0;
                    //let len:number = 80 + Math.round(Math.random() * 845);
                    let len:number = 10 + Math.round(Math.random() * 15);

                    for(; i < len; ++i)
                    {
                        this.position.setXYZ(Math.random() * 800.0 - 400.0, Math.random() * 800.0 - 400.0,Math.random() * 800.0 - 400.0);
                        par = DecayBrnParticle.Create();
                        par.setPosition(this.position);
                        par.awake();
                    }
                }
                else
                {
                    --this.delayTime;
                }
                DecayBrnParticle.Run();
            }
            if(this.m_timeoutEnabled && !this.m_intervalEnabled)
            {
                //console.log("setTimeout..."+this);
                if(this.m_timeoutId > -1)
                {
                    clearTimeout(this.m_timeoutId);
                }
                this.m_timeoutId = setTimeout(this.parRun.bind(this),25);
            }
        }
    }
    class DecayBrnParticle
    {
        private static s_pars:DecayBrnParticle[] = [];
        private static s_sleepPars:DecayBrnParticle[] = [];
        private static s_textures:TextureProxy[] = [];
        private static s_rscene:RendererScene = null;
        private static s_srcBillboard:Billboard3DEntity = null;
        private m_tar:Billboard3DEntity = null;
        private m_isAlive:boolean = true;
        // brightness衰减速度
        decaySpeed:number = 0.002;
        spdV0:Vector3D = new Vector3D();
        spdV1:Vector3D = new Vector3D();
        spdV2:Vector3D = new Vector3D();

        spdV:Vector3D = new Vector3D();
        position:Vector3D = new Vector3D();
        brightness:number = 1.0;
        scale:number = 0.5;
        constructor(tar:Billboard3DEntity)
        {
            this.m_tar = tar;
        }
        static Initialize(size:number,textures:TextureProxy[],rscene:RendererScene):void
        {
            DecayBrnParticle.s_rscene = rscene;
            let srcBillboard:Billboard3DEntity = new Billboard3DEntity();
            srcBillboard.initialize(size,size, [textures[0]]);
            DecayBrnParticle.s_textures = textures;
            DecayBrnParticle.s_srcBillboard = srcBillboard;
        }
        awake():void
        {
            this.m_isAlive = true;
            this.brightness = 1.0;
            this.m_tar.setVisible(true);
            this.m_tar.setBrightness(this.brightness);
            this.spdV0.setXYZ(Math.random() * 3.0 - 1.5, Math.random() * 3.0 - 1.5, Math.random() * 3.0 - 1.5);
            this.spdV1.setXYZ(Math.random() * 3.0 - 1.5, Math.random() * 3.0 - 1.5, Math.random() * 3.0 - 1.5);
            this.spdV2.setXYZ(Math.random() * 3.0 - 1.5, Math.random() * 3.0 - 1.5, Math.random() * 3.0 - 1.5);
            
            this.m_tar.update();
        }
        setPosition(position:Vector3D):void
        {
            this.position.copyFrom(position);
            this.m_tar.setPosition(position);
        }
        update():void
        {
            if(this.m_isAlive)
            {
                if(this.brightness > 0.01)
                {
                    let k0:number = Math.sin(this.brightness * 3.14) * 1.1;
                    let k1:number = 1.0 - k0;
                    let k2:number = k1 * k1;
                    this.spdV.x = (this.spdV0.x * k1 - this.spdV1.x * k0) * 0.7 + k2 * this.spdV2.x;
                    this.spdV.y = (this.spdV0.y * k1 - this.spdV1.y * k0) * 0.7 + k2 * this.spdV2.y;
                    this.spdV.z = (this.spdV0.z * k1 - this.spdV1.z * k0) * 0.7 + k2 * this.spdV2.z;
                    
                    this.m_tar.getPosition(this.position);
                    this.spdV.scaleBy(k0);
                    this.position.addBy(this.spdV);
                    k1 = this.scale * this.spdV.getLength();
                    this.m_tar.setScaleXY(k1,k1);

                    this.m_tar.setPosition(this.position);
                    this.m_tar.setBrightness(this.brightness);
                    this.m_tar.update();
                    this.brightness -= this.decaySpeed;
                }
                else
                {
                    this.m_isAlive = false;
                    this.m_tar.setVisible(false);
                }
            }
        }
        private static createParticle():DecayBrnParticle
        {
            let billboard:Billboard3DEntity = new Billboard3DEntity();
            billboard.setMesh(DecayBrnParticle.s_srcBillboard.getMesh());
            billboard.setRenderStateByName("ADD02");
            billboard.initialize(100.0,100.0, [DecayBrnParticle.s_textures[Math.floor(Math.random() * (DecayBrnParticle.s_textures.length - 0.5))]]);
            DecayBrnParticle.s_rscene.addEntity(billboard,1);
            let par:DecayBrnParticle = new DecayBrnParticle(billboard);
            DecayBrnParticle.s_pars.push(par);
            return par;
        }
        static Color:Color4 = new Color4();
        static Create():DecayBrnParticle
        {
            let par:DecayBrnParticle = null;
            if(DecayBrnParticle.s_sleepPars.length > 0)
            {
                par = DecayBrnParticle.s_sleepPars.pop();
                DecayBrnParticle.s_pars.push(par);
            }
            else
            {
                par = DecayBrnParticle.createParticle();
            }
            par.scale = Math.random() * 0.25 + 0.25;
            par.m_tar.setRGB3f(Math.random() * 1.3 + 0.4,Math.random() * 1.3 + 0.4,Math.random() * 1.3 + 0.4);
            par.m_tar.setScaleXY(par.scale,par.scale);
            return par;
        }
        static Run():void
        {
            let pars:DecayBrnParticle[] = DecayBrnParticle.s_pars;
            let i:number = 0;
            let len:number = pars.length;
            
            for(; i < len; ++i)
            {
                pars[i].update();
                if(!pars[i].m_isAlive)
                {
                    DecayBrnParticle.s_sleepPars.push(pars[i]);
                    pars.splice(i,1);
                    --i;
                    --len;
                }
            }
        }

    }
}