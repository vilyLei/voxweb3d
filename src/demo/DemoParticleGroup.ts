
import * as Vector3DT from "../vox/math/Vector3D";
import * as RendererDevieceT from "../vox/render/RendererDeviece";
import * as RenderConstT from "../vox/render/RenderConst";
import * as RendererStateT from "../vox/render/RendererState";
import * as RendererParamT from "../vox/scene/RendererParam";
import * as RendererSceneT from "../vox/scene/RendererScene";
import * as RenderStatusDisplayT from "../vox/scene/RenderStatusDisplay";
import * as MouseEventT from "../vox/event/MouseEvent";

import * as Plane3DEntityT from "../vox/entity/Plane3DEntity";
import * as Axis3DEntityT from "../vox/entity/Axis3DEntity";
import * as Billboard3DEntityT from "../vox/entity/Billboard3DEntity";
import * as Billboard3DGroupEntityT from "../vox/entity/Billboard3DGroupEntity";
import * as Billboard3DFlareEntityT from "../vox/entity/Billboard3DFlareEntity";
import * as Billboard3DFlowEntityT from "../vox/entity/Billboard3DFlowEntity";
import * as Billboard3DFlowOnceEntityT from "../vox/entity/Billboard3DFlowOnceEntity";
import * as TextureProxyT from "../vox/texture/TextureProxy";
import * as TextureConstT from "../vox/texture/TextureConst";
import * as ImageTextureLoaderT from "../vox/texture/ImageTextureLoader";
import * as CameraTrackT from "../vox/view/CameraTrack";
import * as Color4T from "../vox/material/Color4";
import * as PlaneT from "../vox/geom/Plane";

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

import Plane3DEntity = Plane3DEntityT.vox.entity.Plane3DEntity;
import Axis3DEntity = Axis3DEntityT.vox.entity.Axis3DEntity;
import Billboard3DEntity = Billboard3DEntityT.vox.entity.Billboard3DEntity;
import Billboard3DGroupEntity = Billboard3DGroupEntityT.vox.entity.Billboard3DGroupEntity;
import Billboard3DFlareEntity = Billboard3DFlareEntityT.vox.entity.Billboard3DFlareEntity;
import Billboard3DFlowEntity = Billboard3DFlowEntityT.vox.entity.Billboard3DFlowEntity;
import Billboard3DFlowOnceEntity = Billboard3DFlowOnceEntityT.vox.entity.Billboard3DFlowOnceEntity;
import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
import TextureConst = TextureConstT.vox.texture.TextureConst;
import ImageTextureLoader = ImageTextureLoaderT.vox.texture.ImageTextureLoader;
import CameraTrack = CameraTrackT.vox.view.CameraTrack;
import Color4 = Color4T.vox.material.Color4;
import Plane = PlaneT.vox.geom.Plane;

export namespace demo
{
    export class DemoParticleGroup
    {
        constructor()
        {
        }
        private m_rscene:RendererScene = null;
        private m_texLoader:ImageTextureLoader = null;
        private m_camTrack:CameraTrack = null;
        private m_statusDisp:RenderStatusDisplay = new RenderStatusDisplay();
        
        getImageTexByUrl(purl:string,wrapRepeat:boolean = true,mipmapEnabled = true):TextureProxy
        {
            let ptex:TextureProxy = this.m_texLoader.getImageTexByUrl(purl);
            ptex.mipmapEnabled = mipmapEnabled;
            if(wrapRepeat)ptex.setWrap(TextureConst.WRAP_REPEAT);
            return ptex;
        }
        initialize():void
        {
            console.log("DemoParticleGroup::initialize()......");
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
                ///*
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
                //textures.push( this.getImageTexByUrl("static/assets/default.jpg") );
                textures.push(this.getImageTexByUrl("static/assets/guangyun_H_0007.png") );
                textures.push(this.getImageTexByUrl("static/assets/flare_core_01.jpg"));
                textures.push(this.getImageTexByUrl("static/assets/flare_core_02.jpg"));
                textures.push(this.getImageTexByUrl("static/assets/a_02_c.jpg"));
                textures.push(this.getImageTexByUrl("static/assets/testEFT4.jpg"));

                /*
                let size:number = 300;
                let srcBillboard:Billboard3DEntity = new Billboard3DEntity();
                srcBillboard.initialize(size,size, [textures[0]]);

                this.m_rscene.addEntity(srcBillboard);
                return;
                //*/
                //  let charTex:TextureProxy = this.getImageTexByUrl("static/assets/letterA.png");
                //  let ripple:TextureProxy = this.getImageTexByUrl("static/assets/pattern.png");
                //  this.m_charTex = charTex;
                //  this.m_ripple = ripple;
                
                ///*
                this.initExplodeBill(textures);
                //this.initFlowOnceBill(textures);
                //this.initFlowBillOneByOne(textures);
                //this.initFlowBill(textures);
                //this.initFlareBill(textures);
                //this.initBillGroup(textures);
                //*/
                /*
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
                */
            }
        }
        private m_flareBill:Billboard3DFlareEntity = null;
        private m_flowBill:Billboard3DFlowEntity = null;
        private m_flowOnceBill:Billboard3DFlowOnceEntity = null;
        
        private initExplodeBill(textures:TextureProxy[]):void
        {
            let size:number = 100;
            let params:number[][] = [
                [0.0,0.0,0.5,0.5],
                [0.5,0.0,0.5,0.5],
                [0.0,0.5,0.5,0.5],
                [0.5,0.5,0.5,0.5]
            ];
            let tex:TextureProxy = textures[textures.length - 1];
            let total:number = 50;
            let billboardGroup:Billboard3DFlowOnceEntity = new Billboard3DFlowOnceEntity();
            billboardGroup.createGroup(total);
            let pv:Vector3D = new Vector3D();
            for(let i:number = 0; i < total; ++i)
            {
                size = Math.random() * Math.random() * Math.random() * 180 + 10.0;
                billboardGroup.setSizeAndScaleAt(i,size,size,0.5,1.0);
                let uvparam:number[] = params[Math.floor((params.length-1) * Math.random() + 0.5)];
                billboardGroup.setUVRectAt(i, uvparam[0],uvparam[1],uvparam[2],uvparam[3]);
                //billboardGroup.setTimeAt(i, 200.0 * Math.random() + 100, 0.4,0.6, i * 10);
                billboardGroup.setTimeAt(i, 50.0 * Math.random() + 100, 0.4,0.6, Math.random() * 10);
                //billboardGroup.setTimeAt(i, 100, 0.4,0.6, 1.0);
                //billboardGroup.setBrightnessAt(i,Math.random() * 0.8 + 0.8);
                billboardGroup.setBrightnessAt(i,1.0);
                billboardGroup.setTimeSpeedAt(i,Math.random() * 1.0 + 0.5);
                //billboardGroup.setPositionAt(i,100.0,0.0,100.0);
                //billboardGroup.setPositionAt(i, Math.random() * 500.0 - 250.0,Math.random() * 500.0 - 250.0, Math.random() * 500.0 - 250.0);
                pv.setTo(Math.random() * 60.0 - 30.0,Math.random() * 50.0 + 10.0, Math.random() * 60.0 - 30.0);
                billboardGroup.setPositionAt(i, pv.x,pv.y,pv.z);
                billboardGroup.setAccelerationAt(i,0.0,-0.01,0.0);
                //billboardGroup.setVelocityAt(i,0.0,Math.random() * 1.0 + 1.0,0.0);
                pv.normalize();
                pv.scaleBy((Math.random() * 2.0 + 0.8));
                billboardGroup.setVelocityAt(i,pv.x,pv.y,pv.z);
            }
            billboardGroup.initialize([tex]);
            this.m_rscene.addEntity(billboardGroup);

            //billboardGroup.setTime(100.0);
            this.m_flowOnceBill = billboardGroup;
        }
        private initFlowOnceBill(textures:TextureProxy[]):void
        {
            let size:number = 100;
            let params:number[][] = [
                [0.0,0.0,0.5,0.5],
                [0.5,0.0,0.5,0.5],
                [0.0,0.5,0.5,0.5],
                [0.5,0.5,0.5,0.5]
            ];
            let tex:TextureProxy = textures[textures.length - 1];
            let total:number = 100;
            let billboardGroup:Billboard3DFlowOnceEntity = new Billboard3DFlowOnceEntity();
            billboardGroup.createGroup(total);
            let pv:Vector3D = new Vector3D();
            for(let i:number = 0; i < total; ++i)
            {
                size = Math.random() * Math.random() * Math.random() * 180 + 10.0;
                billboardGroup.setSizeAndScaleAt(i,size,size,0.5,1.0);
                let uvparam:number[] = params[Math.floor((params.length-1) * Math.random() + 0.5)];
                billboardGroup.setUVRectAt(i, uvparam[0],uvparam[1],uvparam[2],uvparam[3]);
                //billboardGroup.setTimeAt(i, 200.0 * Math.random() + 100, 0.4,0.6, i * 10);
                billboardGroup.setTimeAt(i, 200.0 * Math.random() + 300, 0.4,0.6, i * 10);
                //billboardGroup.setTimeAt(i, 100, 0.4,0.6, 1.0);
                //billboardGroup.setBrightnessAt(i,Math.random() * 0.8 + 0.8);
                billboardGroup.setBrightnessAt(i,1.0);
                billboardGroup.setTimeSpeedAt(i,Math.random() * 1.0 + 0.5);
                //billboardGroup.setPositionAt(i,100.0,0.0,100.0);
                //billboardGroup.setPositionAt(i, Math.random() * 500.0 - 250.0,Math.random() * 500.0 - 250.0, Math.random() * 500.0 - 250.0);
                pv.setTo(Math.random() * 500.0 - 250.0,Math.random() * 50.0 + 50.0, Math.random() * 500.0 - 250.0);
                billboardGroup.setPositionAt(i, pv.x,pv.y,pv.z);
                billboardGroup.setAccelerationAt(i,0.003,-0.004,0.0);
                billboardGroup.setVelocityAt(i,0.0,Math.random() * 2.0 + 0.2,0.0);
                pv.normalize();
                pv.scaleBy((Math.random() * 2.0 + 0.2) * -1.0);
                //billboardGroup.setVelocityAt(i,pv.x,pv.y,pv.z);
            }
            billboardGroup.initialize([tex]);
            this.m_rscene.addEntity(billboardGroup);

            //billboardGroup.setTime(100.0);
            this.m_flowOnceBill = billboardGroup;
        }
        private initFlowBillOneByOne(textures:TextureProxy[]):void
        {
            let size:number = 100;
            let params:number[][] = [
                [0.0,0.0,0.5,0.5],
                [0.5,0.0,0.5,0.5],
                [0.0,0.5,0.5,0.5],
                [0.5,0.5,0.5,0.5]
            ];
            let tex:TextureProxy = textures[textures.length - 1];
            let total:number = 15;
            let billboardGroup:Billboard3DFlowEntity = new Billboard3DFlowEntity();
            billboardGroup.createGroup(total);
            let pv:Vector3D = new Vector3D();
            for(let i:number = 0; i < total; ++i)
            {
                size = Math.random() * Math.random() * Math.random() * 180 + 10.0;
                billboardGroup.setSizeAndScaleAt(i,size,size,0.5,1.0);
                let uvparam:number[] = params[Math.floor((params.length-1) * Math.random() + 0.5)];
                billboardGroup.setUVRectAt(i, uvparam[0],uvparam[1],uvparam[2],uvparam[3]);
                billboardGroup.setTimeAt(i, 100.0 * Math.random() + 100, 0.4,0.6, i * 100);
                billboardGroup.setBrightnessAt(i,Math.random() * 0.8 + 0.8);
                billboardGroup.setTimeSpeed(i,Math.random() * 1.0 + 0.5);
                //billboardGroup.setPositionAt(i,100.0,0.0,100.0);
                //billboardGroup.setPositionAt(i, Math.random() * 500.0 - 250.0,Math.random() * 500.0 - 250.0, Math.random() * 500.0 - 250.0);
                pv.setTo(Math.random() * 500.0 - 250.0,Math.random() * 50.0 + 50.0, Math.random() * 500.0 - 250.0);
                billboardGroup.setPositionAt(i, pv.x,pv.y,pv.z);
                
                //billboardGroup.setVelocityAt(i,0.0,Math.random() * 2.0 + 0.2,0.0);
                pv.normalize();
                pv.scaleBy((Math.random() * 2.0 + 0.2) * -1.0);
                //billboardGroup.setVelocityAt(i,pv.x,pv.y,pv.z);
            }
            billboardGroup.initialize([tex]);
            this.m_rscene.addEntity(billboardGroup);

            billboardGroup.setTime(5.0);
            this.m_flowBill = billboardGroup;
        }
        
        private initFlowBill(textures:TextureProxy[]):void
        {
            let size:number = 100;
            let params:number[][] = [
                [0.0,0.0,0.5,0.5],
                [0.5,0.0,0.5,0.5],
                [0.0,0.5,0.5,0.5],
                [0.5,0.5,0.5,0.5]
            ];
            let tex:TextureProxy = textures[textures.length - 1];
            let total:number = 15;
            let billboardGroup:Billboard3DFlowEntity = new Billboard3DFlowEntity();
            billboardGroup.createGroup(total);
            let pv:Vector3D = new Vector3D();
            for(let i:number = 0; i < total; ++i)
            {
                size = Math.random() * Math.random() * Math.random() * 180 + 10.0;
                billboardGroup.setSizeAndScaleAt(i,size,size,0.5,1.0);
                let uvparam:number[] = params[Math.floor((params.length-1) * Math.random() + 0.5)];
                billboardGroup.setUVRectAt(i, uvparam[0],uvparam[1],uvparam[2],uvparam[3]);
                billboardGroup.setTimeAt(i, 200.0 * Math.random() + 300, 0.2,0.8, 0.0);
                //billboardGroup.setTimeAt(i, 500.0, 0.4,0.6, 0.0);
                billboardGroup.setBrightnessAt(i,Math.random() * 0.8 + 0.8);
                //billboardGroup.setPositionAt(i,100.0,0.0,100.0);
                //billboardGroup.setPositionAt(i, Math.random() * 500.0 - 250.0,Math.random() * 500.0 - 250.0, Math.random() * 500.0 - 250.0);
                pv.setTo(Math.random() * 500.0 - 250.0,Math.random() * 50.0 + 50.0, Math.random() * 500.0 - 250.0);
                billboardGroup.setPositionAt(i, pv.x,pv.y,pv.z);
                
                //billboardGroup.setVelocityAt(i,0.0,Math.random() * 2.0 + 0.2,0.0);
                billboardGroup.setAccelerationAt(i, 0.003, -0.003, 0.0);
                billboardGroup.setVelocityAt(i,0.0, 0.8 + Math.random() * 0.8, 0.0);
                pv.normalize();
                pv.scaleBy((Math.random() * 2.0 + 0.2) * -1.0);
                //billboardGroup.setVelocityAt(i,pv.x,pv.y,pv.z);
            }
            billboardGroup.initialize([tex]);
            this.m_rscene.addEntity(billboardGroup);

            billboardGroup.setTime(5.0);
            this.m_flowBill = billboardGroup;
        }
        private initFlareBill(textures:TextureProxy[]):void
        {
            let size:number = 100;
            let params:number[][] = [
                [0.0,0.0,0.5,0.5],
                [0.5,0.0,0.5,0.5],
                [0.0,0.5,0.5,0.5],
                [0.5,0.5,0.5,0.5]
            ];
            let tex:TextureProxy = textures[textures.length - 1];
            let total:number = 50;
            let billboardGroup:Billboard3DFlareEntity = new Billboard3DFlareEntity();
            billboardGroup.createGroup(total);
            for(let i:number = 0; i < total; ++i)
            {
                size = Math.random() * Math.random() * Math.random() * 180 + 10.0;
                billboardGroup.setSizeAndScaleAt(i,size,size,0.5,1.0);
                let uvparam:number[] = params[Math.floor((params.length-1) * Math.random() + 0.5)];
                billboardGroup.setUVRectAt(i, uvparam[0],uvparam[1],uvparam[2],uvparam[3]);
                billboardGroup.setTimeAt(i, 200.0 * Math.random() + 100, 0.4,0.6, Math.random() * 6.0 + 0.2);
                billboardGroup.setBrightnessAt(i,Math.random() * 0.8 + 0.8);
                //billboardGroup.setPositionAt(i,100.0,0.0,100.0);
                billboardGroup.setPositionAt(i, Math.random() * 500.0 - 250.0,Math.random() * 500.0 - 250.0, Math.random() * 500.0 - 250.0);
                //billboardGroup.setPositionAt(i, Math.random() * 500.0 - 250.0,Math.random() * 100.0 - 50.0, Math.random() * 500.0 - 250.0);
                
            }
            billboardGroup.initialize([tex]);
            this.m_rscene.addEntity(billboardGroup);

            billboardGroup.setTime(0.0);
            //this.m_flareBill = billboardGroup;
        }
        private initBillGroup(textures:TextureProxy[]):void
        {
            let size:number = 100;
            let params:number[][] = [
                [0.0,0.0,0.5,0.5],
                [0.5,0.0,0.5,0.5],
                [0.0,0.5,0.5,0.5],
                [0.5,0.5,0.5,0.5]
            ];
            let tex:TextureProxy = textures[textures.length - 1];
            let total:number = 800;
            let billboardGroup:Billboard3DGroupEntity = new Billboard3DGroupEntity();
            billboardGroup.createGroup(total);
            for(let i:number = 0; i < total; ++i)
            {
                size = Math.random() * Math.random() * Math.random() * 180 + 10.0;
                billboardGroup.setSizeAt(i,size,size);
                //  billboardGroup.setUVRectAt(i, 0.0,0.0, 0.5,0.5);
                let uvparam:number[] = params[Math.floor((params.length-1) * Math.random() + 0.5)];
                billboardGroup.setUVRectAt(i, uvparam[0],uvparam[1],uvparam[2],uvparam[3]);
                //billboardGroup.setPositionAt(i,100.0,0.0,100.0);
                billboardGroup.setPositionAt(i, Math.random() * 500.0 - 250.0,Math.random() * 500.0 - 250.0, Math.random() * 500.0 - 250.0);
            }
            billboardGroup.initialize([tex]);
            this.m_rscene.addEntity(billboardGroup);
        }
        private m_charTex:TextureProxy = null;
        private m_ripple:TextureProxy = null;
        
        private m_pv:Vector3D = new Vector3D();
        private m_rlpv:Vector3D = new Vector3D();
        private m_rltv:Vector3D = new Vector3D();
        private m_pnv:Vector3D = new Vector3D(0.0,1.0,0.0);
        private m_pdis:number = 0.0;
        mouseDownListener(evt:any):void
        {
            console.log("mouseDownListener call, this.m_rscene: "+this.m_rscene.toString());
            
            if(this.m_flowOnceBill != null)
            {
                this.m_rscene.getMouseXYWorldRay(this.m_rlpv, this.m_rltv);
                Plane.IntersectionSLV2(this.m_pnv, this.m_pdis, this.m_rlpv, this.m_rltv, this.m_pv);
                console.log("this.m_pv: ",this.m_pv);
                this.m_flowOnceBill.setXYZ(this.m_pv.x, this.m_pv.y, this.m_pv.z);
                this.m_flowOnceBill.setAcceleration(Math.random() * 0.01 - 0.005,Math.random() * 0.005,Math.random() * 0.01 - 0.005);
                this.m_flowOnceBill.setTime(0.0);
                this.m_flowOnceBill.setRotationXYZ(0.0,Math.random() * 360.0,0.0);
                this.m_flowOnceBill.update();
                
            }
        }
        position:Vector3D = new Vector3D();
        private testUpdate():void
        {
            if(this.m_charTex != null)
            {
                if(this.m_charTex.isDataEnough() && this.m_ripple.isDataEnough())
                {
                    let plane:Plane3DEntity;
                    ///*
                    plane = new Plane3DEntity();
                    plane.initializeXOZ(-128,-128,256,256,[this.m_charTex]);
                    plane.toTransparentBlend(false);
                    this.m_rscene.addEntity(plane);
    
                    plane = new Plane3DEntity();
                    plane.initializeXOZ(-256,-256,512,512,[this.m_ripple]);
                    plane.toTransparentBlend(false);
                    this.m_rscene.addEntity(plane);
                    //*/
                    /*
                    
                    plane = new Plane3DEntity();
                    plane.initializeXOZ(-256,-256,512,512,[this.m_ripple]);
                    plane.toTransparentBlend(false);
                    this.m_rscene.addEntity(plane);

                    plane = new Plane3DEntity();
                    plane.initializeXOZ(-128,-128,256,256,[this.m_charTex]);
                    plane.toTransparentBlend(false);
                    this.m_rscene.addEntity(plane);
                    
                    //*/
                    this.m_charTex = null;
                }
            }
        }
        run():void
        {
            this.m_texLoader.run();
            this.testUpdate();

            if(this.m_flowOnceBill != null)this.m_flowOnceBill.timeAddOffset(2.0);
            if(this.m_flowBill != null)this.m_flowBill.timeAddOffset(1.0);
            if(this.m_flareBill != null)this.m_flareBill.timeAddOffset(0.3);

            this.m_rscene.setClearRGBColor3f(0.1, 0.1, 0.1);
            this.m_rscene.renderBegin();

            this.m_rscene.update();
            this.m_rscene.run();

            this.m_rscene.runEnd();
            //this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
            
            this.m_statusDisp.statusInfo = "/"+RendererState.DrawCallTimes;
            this.m_statusDisp.update();
        }
        
    }
}