
import * as Vector3DT from "../vox/math/Vector3D";
import * as RendererDevieceT from "../vox/render/RendererDeviece";
import * as RenderConstT from "../vox/render/RenderConst";
import * as RendererStateT from "../vox/render/RendererState";
import * as RendererParamT from "../vox/scene/RendererParam";
import * as RendererSceneT from "../vox/scene/RendererScene";
import * as RenderStatusDisplayT from "../vox/scene/RenderStatusDisplay";
import * as MouseEventT from "../vox/event/MouseEvent";

import * as Axis3DEntityT from "../vox/entity/Axis3DEntity";
import * as Billboard3DEntityT from "../vox/entity/Billboard3DEntity";
import * as Plane3DEntityT from "../vox/entity/Plane3DEntity";
import * as Billboard3D3TexMixEntityT from "../vox/entity/Billboard3D3TexMixEntity";
import * as TextureProxyT from "../vox/texture/TextureProxy";
import * as TextureConstT from "../vox/texture/TextureConst";
import * as ImageTextureLoaderT from "../vox/texture/ImageTextureLoader";
import * as CameraTrackT from "../vox/view/CameraTrack";

import Vector3D = Vector3DT.vox.math.Vector3D;
import RendererDeviece = RendererDevieceT.vox.render.RendererDeviece;
import CullFaceMode = RenderConstT.vox.render.CullFaceMode;
import RenderBlendMode = RenderConstT.vox.render.RenderBlendMode;
import DepthTestMode = RenderConstT.vox.render.DepthTestMode;
import RendererState = RendererStateT.vox.render.RendererState;
import RendererParam = RendererParamT.vox.scene.RendererParam;
import RendererScene = RendererSceneT.vox.scene.RendererScene;
import RenderStatusDisplay = RenderStatusDisplayT.vox.scene.RenderStatusDisplay;
import MouseEvent = MouseEventT.vox.event.MouseEvent;

import Axis3DEntity = Axis3DEntityT.vox.entity.Axis3DEntity;
import Billboard3DEntity = Billboard3DEntityT.vox.entity.Billboard3DEntity;
import Plane3DEntity = Plane3DEntityT.vox.entity.Plane3DEntity;
import Billboard3D3TexMixEntity = Billboard3D3TexMixEntityT.vox.entity.Billboard3D3TexMixEntity;
import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
import TextureConst = TextureConstT.vox.texture.TextureConst;
import ImageTextureLoader = ImageTextureLoaderT.vox.texture.ImageTextureLoader;
import CameraTrack = CameraTrackT.vox.view.CameraTrack;

export namespace demo
{
    export class DemoParticleMixTex
    {
        constructor(){}
        private m_rscene:RendererScene = null;
        private m_texLoader:ImageTextureLoader = null;
        private m_camTrack:CameraTrack = null;
        private m_statusDisp:RenderStatusDisplay = new RenderStatusDisplay();
        private m_mixBill:Billboard3D3TexMixEntity = null;
        getImageTexByUrl(purl:string,wrapRepeat:boolean = true,mipmapEnabled = true):TextureProxy
        {
            let ptex:TextureProxy = this.m_texLoader.getImageTexByUrl(purl);
            ptex.mipmapEnabled = mipmapEnabled;
            if(wrapRepeat)ptex.setWrap(TextureConst.WRAP_REPEAT);
            return ptex;
        }
        initialize():void
        {
            console.log("DemoParticleMixTex::initialize()......");
            if(this.m_rscene == null)
            {
                RendererDeviece.SHADERCODE_TRACE_ENABLED = true;
                
                let rparam:RendererParam = new RendererParam();
                rparam.setTickUpdateTime(30);
                rparam.setMatrix4AllocateSize(8192 * 4);
                rparam.setCamProject(45.0,10.0,5000.0);
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
                /*
                let axis:Axis3DEntity = new Axis3DEntity();
                axis.name = "axis";
                axis.initialize(300.0);
                axis.setXYZ(100.0,100.0,100.0);
                this.m_rscene.addEntity(axis);
                
                axis = new Axis3DEntity();
                axis.name = "axis";
                axis.initialize(600.0);
                this.m_rscene.addEntity(axis);
                //*/
                let textures:TextureProxy[] = [];
                textures.push( this.getImageTexByUrl("static/assets/wood_02.jpg") );
                textures.push( this.getImageTexByUrl("static/assets/guangyun_H_0007.png") );
                textures.push(this.getImageTexByUrl("static/assets/flare_core_01.jpg"));
                textures.push(this.getImageTexByUrl("static/assets/a_02_c.jpg"));
                textures.push(this.getImageTexByUrl("static/assets/flare_core_02.jpg"));

                textures.push(this.getImageTexByUrl("static/assets/image_003_1.jpg"));
                textures.push(this.getImageTexByUrl("static/assets/metal_08.jpg"));
                textures.push(this.getImageTexByUrl("static/assets/warter_01.jpg"));
                textures.push(this.getImageTexByUrl("static/assets/testEFT4.jpg"));
                textures.push(this.getImageTexByUrl("static/assets/fog_01.png"));
                textures.push(this.getImageTexByUrl("static/assets/xulie_21.png"));
                textures.push(this.getImageTexByUrl("static/assets/xulie_48.png"));

                //  let bill:Billboard3DEntity = new Billboard3DEntity();
                //  bill.toBrightnessBlend();
                //  bill.initializeSquare(100.0,[textures[0]]);
                //  //bill.setFadeFactor(0.1);
                //  this.m_rscene.addEntity(bill);
                let scale:number = 2.0;
                let plane:Plane3DEntity = new Plane3DEntity();
                plane.initializeXOZ(-300.0,-300.0,600.0,600.0,[textures[0]]);
                plane.setScaleXYZ(scale,scale,scale);
                plane.setXYZ(0.0,-80.0,0.0);
                this.m_rscene.addEntity(plane);
                
                let mixBill:Billboard3D3TexMixEntity = new Billboard3D3TexMixEntity();
                //mixBill.toBrightnessBlend();
                mixBill.toTransparentBlend();
                //mixBill.initializeSquare(100.0,[textures[4],textures[5],textures[6]]);
                //mixBill.initializeSquare(100.0,[textures[7],textures[1],textures[2]]);
                //mixBill.initializeSquare(100.0,[textures[8]]);
                //  mixBill.initializeSquare(100.0,[textures[9]]);

                //  mixBill.initializeSquare(100.0,[textures[10]]);
                //  mixBill.setClipUVSize(0.25,1.0);
                //  mixBill.setClipUVPosAt(0,0.0,0.0);
                //  mixBill.setClipUVPosAt(1,0.25,0.0);
                //  mixBill.setClipUVPosAt(2,0.5,0.0);

                
                mixBill.initializeSquare(100.0,[textures[11]]);
                mixBill.setClipUVSize(0.25,0.25);
                mixBill.setClipUVPosAt(0, 0.25 * 2, 0.0);
                mixBill.setClipUVPosAt(1, 0.0, 0.25 * 2);
                mixBill.setClipUVPosAt(2, 0.25 * 2, 0.25 * 3);
                //mixBill.setFadeFactor(0.1);
                this.m_rscene.addEntity(mixBill,1);
                this.m_mixBill = mixBill;
                //this.m_mixBill.setMixFactor(0.95);
            }
        }
        private m_flagBoo:boolean = true;
        private m_time:number = 0.0;
        mouseDownListener(evt:any):void
        {
            //console.log("mouseDownListener call, this.m_rscene: "+this.m_rscene.toString());
            //this.m_flagBoo = !this.m_flagBoo;
            //  this.m_mixBill.setMixFactor(Math.abs(Math.sin(this.m_time)));
            //  this.m_time += 0.05;
        }
        position:Vector3D = new Vector3D();
        delayTime:number = 10;
        run():void
        {
            if(this.m_mixBill != null)
            {
                this.m_mixBill.setMixFactor(Math.abs(Math.sin(this.m_time)));
                this.m_time += 0.005;
            }

            this.m_rscene.run();
            this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
            
            this.m_statusDisp.statusInfo = "/"+RendererState.DrawCallTimes;
            this.m_statusDisp.update();
        }        
    }
}