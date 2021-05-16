
import Vector3D from "../vox/math/Vector3D";
import RendererDeviece from "../vox/render/RendererDeviece";
import {RenderBlendMode,CullFaceMode,DepthTestMode} from "../vox/render/RenderConst";
import RendererState from "../vox/render/RendererState";
import RendererParam from "../vox/scene/RendererParam";
import RendererScene from "../vox/scene/RendererScene";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";
import MouseEvent from "../vox/event/MouseEvent";
import Stage3D from "../vox/display/Stage3D";

import Axis3DEntity from "../vox/entity/Axis3DEntity";
import Billboard3DEntity from "../vox/entity/Billboard3DEntity";
import TextureProxy from "../vox/texture/TextureProxy";
import {TextureConst} from "../vox/texture/TextureConst";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import CameraTrack from "../vox/view/CameraTrack";
import * as EntityDispT from "./base/EntityDisp";
import Color4 from "../vox/material/Color4";
import DecayBrnParticle from "../particle/base/DecayBrnParticle";

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

                this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN,this,this.mouseDownListener);
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
            this.m_equeue.run();

            this.m_rscene.setClearRGBColor3f(0.1, 0.1, 0.1);
            this.m_rscene.run();

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
}