
import MathConst from "../vox/math/MathConst";
import Vector3D from "../vox/math/Vector3D";
import RendererDeviece from "../vox/render/RendererDeviece";
import {RenderBlendMode,CullFaceMode,DepthTestMode} from "../vox/render/RenderConst";
import RendererState from "../vox/render/RendererState";
import RendererParam from "../vox/scene/RendererParam";
import RendererScene from "../vox/scene/RendererScene";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";
import MouseEvent from "../vox/event/MouseEvent";

import Plane3DEntity from "../vox/entity/Plane3DEntity";
import Axis3DEntity from "../vox/entity/Axis3DEntity";
import Billboard3DEntity from "../vox/entity/Billboard3DEntity";
import Billboard3DGroupEntity from "../vox/entity/Billboard3DGroupEntity";
import Billboard3DFlareEntity from "../vox/entity/Billboard3DFlareEntity";
import Billboard3DFlowEntity from "../vox/entity/Billboard3DFlowEntity";
import TextureProxy from "../vox/texture/TextureProxy";
import {TextureConst,TextureFormat,TextureDataType,TextureTarget} from "../vox/texture/TextureConst";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import CameraTrack from "../vox/view/CameraTrack";
import CameraViewRay from "../vox/view/CameraViewRay";


export class DemoParticleGroup
{
    constructor(){}
    private m_rscene:RendererScene = null;
    private m_texLoader:ImageTextureLoader = null;
    private m_camTrack:CameraTrack = null;
    private m_statusDisp:RenderStatusDisplay = new RenderStatusDisplay();
    private m_axis:Axis3DEntity = null;
    private m_textures:TextureProxy[] = null;
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
        console.log("DemoParticleGroup::initialize()......");
        if(this.m_rscene == null)
        {
            RendererDeviece.SHADERCODE_TRACE_ENABLED = true;
            
            let rparam:RendererParam = new RendererParam();
            rparam.setTickUpdateTime(20);
            rparam.setAttriAlpha(false);
            rparam.setMatrix4AllocateSize(8192 * 4);
            rparam.setCamProject(45.0,10.0,3000.0);
            rparam.setCamPosition(1500.0,1500.0,1500.0);
            
            this.m_rscene = new RendererScene();
            this.m_rscene.initialize(rparam,3);
            this.m_rscene.setRendererProcessParam(1,true,true);
            this.m_viewRay.bindCameraAndStage(this.m_rscene.getCamera(),this.m_rscene.getStage3D());
            this.m_viewRay.setPlaneParam(new Vector3D(0.0,1.0,0.0),0.0);
            this.m_texLoader = new ImageTextureLoader( this.m_rscene.textureBlock );

            this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN,this,this.mouseDownListener);
            this.m_camTrack = new CameraTrack();
            this.m_camTrack.bindCamera(this.m_rscene.getCamera());

            this.m_statusDisp.initialize("rstatus",this.m_rscene.getStage3D().viewWidth - 180);
            RendererState.CreateRenderState("ADD01",CullFaceMode.BACK,RenderBlendMode.ADD,DepthTestMode.BLEND);
            RendererState.CreateRenderState("ADD02",CullFaceMode.BACK,RenderBlendMode.ADD,DepthTestMode.ALWAYS);
            /*
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
            textures.push( this.getImageTexByUrl("static/assets/default.jpg") );
            textures.push( this.getImageTexByUrl("static/assets/color_05.jpg") );
            textures.push( this.getImageTexByUrl("static/assets/color_03.jpg") );
            textures.push( this.getImageTexByUrl("static/assets/partile_tex_001.jpg") );
            textures.push( this.getImageTexByUrl("static/assets/arrow01.png") );
            textures.push(this.getImageTexByUrl("static/assets/guangyun_H_0007.png") );
            textures.push(this.getImageTexByUrl("static/assets/flare_core_01.jpg"));
            textures.push(this.getImageTexByUrl("static/assets/flare_core_02.jpg"));
            textures.push(this.getImageTexByUrl("static/assets/a_02_c.jpg"));
            textures.push(this.getImageTexByUrl("static/assets/xulie_02_07.png"));
            textures.push(this.getImageTexByUrl("static/assets/testEFT4.jpg"));
            textures.push(this.getImageTexByUrl("static/assets/testFT4.jpg"));
            this.m_textures = textures;
            //      let plane:Plane3DEntity = new Plane3DEntity();
            //      plane.initializeXOZ(-500.0,-500.0,1000.0,1000.0,[textures[0]]);
            //      //plane.toTransparentBlend(false);
            //      this.m_rscene.addEntity(plane);
            this.update();
        }
    }
    private initializeBillEntity():void
    {
        if(this.m_rscene != null)
        {
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
            //this.initFlowBillOneByOne(this.m_textures);
            //this.initFlowDirecBill(this.m_textures[7], null, false, true,true,true);
            this.initFlowDirecBill(this.m_textures[4], null, false, true,true,true);
            //this.initFlowBill(this.m_textures[this.m_textures.length - 1],this.m_textures[2], true);
            //this.initFlowBill(this.m_textures[this.m_textures.length - 1],null, false, true);
            //this.initFlowBill(this.m_textures[this.m_textures.length - 1],null, true, true);
            //this.initFlowBill(this.m_textures[this.m_textures.length - 2],null, true, true,false,true);
            //this.initFlowBill(this.m_textures[this.m_textures.length - 1],null, false, false);
            //this.initFlareBill(this.m_textures[this.m_textures.length - 1], this.m_textures[1], true);
            //this.initFlareBill(this.m_textures[this.m_textures.length - 1], this.m_textures[1], false);
            //this.initFlareBill(this.m_textures[this.m_textures.length - 1], null, true);
            //this.initFlareBill(this.m_textures[this.m_textures.length - 2], null, true, true);
            //this.initFlareBill(this.m_textures[this.m_textures.length - 1], null, false);
            //this.initBillGroup(this.m_textures);
            //*/
        }
    }
    private m_flareBill:Billboard3DFlareEntity = null;
    private m_flowBill:Billboard3DFlowEntity = null;
    
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
        let billGroup:Billboard3DFlowEntity = new Billboard3DFlowEntity();
        billGroup.createGroup(total);
        let pv:Vector3D = new Vector3D();
        for(let i:number = 0; i < total; ++i)
        {
            size = Math.random() * Math.random() * Math.random() * 180 + 10.0;
            billGroup.setSizeAndScaleAt(i,size,size,0.5,1.0);
            let uvparam:number[] = params[Math.floor((params.length-1) * Math.random() + 0.5)];
            billGroup.setUVRectAt(i, uvparam[0],uvparam[1],uvparam[2],uvparam[3]);
            billGroup.setTimeAt(i, 100.0 * Math.random() + 100, 0.4,0.6, i * 100);
            billGroup.setBrightnessAt(i,Math.random() * 0.8 + 0.8);
            billGroup.setTimeSpeed(i,Math.random() * 1.0 + 0.5);
            //billGroup.setPositionAt(i,100.0,0.0,100.0);
            //billGroup.setPositionAt(i, Math.random() * 500.0 - 250.0,Math.random() * 500.0 - 250.0, Math.random() * 500.0 - 250.0);
            pv.setTo(Math.random() * 500.0 - 250.0,Math.random() * 50.0 + 50.0, Math.random() * 500.0 - 250.0);
            billGroup.setPositionAt(i, pv.x,pv.y,pv.z);
            
            //billGroup.setVelocityAt(i,0.0,Math.random() * 2.0 + 0.2,0.0);
            pv.normalize();
            pv.scaleBy((Math.random() * 2.0 + 0.2) * -1.0);
            //billGroup.setVelocityAt(i,pv.x,pv.y,pv.z);
        }
        billGroup.initialize(true,false,false,[tex]);
        this.m_rscene.addEntity(billGroup);

        billGroup.setTime(5.0);
        this.m_flowBill = billGroup;
    }
    
    private initFlowDirecBill(tex:TextureProxy,colorTex:TextureProxy, clipEnabled:boolean = false, playOnce:boolean = false, direcEnabled:boolean = false,spdScaleEnabled:boolean = false):void
    {
        let size:number = 100;
        let params:number[][] = [
            [0.0,0.0,0.5,0.5],
            [0.5,0.0,0.5,0.5],
            [0.0,0.5,0.5,0.5],
            [0.5,0.5,0.5,0.5]
        ];
        let total:number = 5;
        let billGroup:Billboard3DFlowEntity = new Billboard3DFlowEntity();
        billGroup.createGroup(total);
        let pv:Vector3D = new Vector3D();
        for(let i:number = 0; i < total; ++i)
        {
            //size = Math.random() * Math.random() * Math.random() * 180 + 10.0;
            billGroup.setSizeAndScaleAt(i,size,size,0.5,1.0);
            if(!clipEnabled)
            {
                //  let uvparam:number[] = params[Math.floor((params.length-1) * Math.random() + 0.5)];
                //  billGroup.setUVRectAt(i, uvparam[0],uvparam[1],uvparam[2],uvparam[3]);
            }
            billGroup.setTimeAt(i, 200.0 * Math.random() + 300, 0.2,0.8, 0.0);
            //billGroup.setTimeAt(i, 500.0, 0.4,0.6, 0.0);
            billGroup.setBrightnessAt(i,Math.random() * 0.8 + 0.8);
            //billGroup.setPositionAt(i,100.0,0.0,100.0);
            //billGroup.setPositionAt(i, Math.random() * 500.0 - 250.0,Math.random() * 500.0 - 250.0, Math.random() * 500.0 - 250.0);
            pv.setTo(Math.random() * 500.0 - 250.0,Math.random() * 50.0 + 50.0, Math.random() * 500.0 - 250.0);
            billGroup.setPositionAt(i, pv.x,pv.y,pv.z);
            
            //billGroup.setVelocityAt(i,0.0,Math.random() * 2.0 + 0.2,0.0);
            billGroup.setAccelerationAt(i, 0.003, -0.003, 0.0);
            billGroup.setVelocityAt(i,0.0, 0.8 + Math.random() * 0.8, 0.0);
            pv.normalize();
            pv.scaleBy((Math.random() * 2.0 + 0.5) * 1.0);
            billGroup.setVelocityAt(i,pv.x,pv.y,pv.z);
        }
        billGroup.setPlayParam(playOnce,direcEnabled,false,spdScaleEnabled);
        billGroup.toBrightnessBlend();
        if(colorTex != null)
        {
            billGroup.initialize(true,false,clipEnabled,[tex,colorTex]);
            billGroup.setRGB3f(0.1, 0.1, 0.1);
        }
        else
        {
            billGroup.initialize(true,false,clipEnabled,[tex]);
        }
        billGroup.setSpdScaleMax(4.0,1.0);
        //billGroup.setClipUVParam(4,16,0.25,0.25);
        billGroup.setClipUVParam(2, 4,0.5,0.5);
        this.m_rscene.addEntity(billGroup);

        billGroup.setTime(5.0);
        this.m_flowBill = billGroup;
    }
    private initFlowBill(tex:TextureProxy,colorTex:TextureProxy, clipEnabled:boolean = false, playOnce:boolean = false, direcEnabled:boolean = false,clipMixEnabled:boolean = false):void
    {
        let size:number = 100;
        let params:number[][] = [
            [0.0,0.0,0.5,0.5],
            [0.5,0.0,0.5,0.5],
            [0.0,0.5,0.5,0.5],
            [0.5,0.5,0.5,0.5]
        ];
        let total:number = 15;
        let billGroup:Billboard3DFlowEntity = new Billboard3DFlowEntity();
        billGroup.createGroup(total);
        let pv:Vector3D = new Vector3D();
        for(let i:number = 0; i < total; ++i)
        {
            size = Math.random() * Math.random() * Math.random() * 180 + 10.0;
            billGroup.setSizeAndScaleAt(i,size,size,0.5,1.0);
            if(!clipEnabled)
            {
                let uvparam:number[] = params[Math.floor((params.length-1) * Math.random() + 0.5)];
                billGroup.setUVRectAt(i, uvparam[0],uvparam[1],uvparam[2],uvparam[3]);
            }
            billGroup.setTimeAt(i, 200.0 * Math.random() + 300, 0.2,0.8, 0.0);
            //billGroup.setTimeAt(i, 500.0, 0.4,0.6, 0.0);
            billGroup.setBrightnessAt(i,Math.random() * 0.8 + 0.8);
            //billGroup.setPositionAt(i,100.0,0.0,100.0);
            //billGroup.setPositionAt(i, Math.random() * 500.0 - 250.0,Math.random() * 500.0 - 250.0, Math.random() * 500.0 - 250.0);
            pv.setTo(Math.random() * 500.0 - 250.0,Math.random() * 50.0 + 50.0, Math.random() * 500.0 - 250.0);
            billGroup.setPositionAt(i, pv.x,pv.y,pv.z);
            
            //billGroup.setVelocityAt(i,0.0,Math.random() * 2.0 + 0.2,0.0);
            billGroup.setAccelerationAt(i, 0.003, -0.003, 0.0);
            billGroup.setVelocityAt(i,0.0, 0.8 + Math.random() * 0.8, 0.0);
            pv.normalize();
            pv.scaleBy((Math.random() * 2.0 + 0.2) * -1.0);
            //billGroup.setVelocityAt(i,pv.x,pv.y,pv.z);
        }
        billGroup.setPlayParam(playOnce,direcEnabled,clipMixEnabled);
        if(colorTex != null)
        {
            billGroup.initialize(true,false,clipEnabled,[tex,colorTex]);
            billGroup.setRGB3f(0.1, 0.1, 0.1);
        }
        else
        {
            billGroup.initialize(true,false,clipEnabled,[tex]);
        }
        //billGroup.setClipUVParam(4,16,0.25,0.25);
        billGroup.setClipUVParam(2, 4,0.5,0.5);
        this.m_rscene.addEntity(billGroup);

        billGroup.setTime(5.0);
        this.m_flowBill = billGroup;
    }
    private initFlareBill(tex:TextureProxy,colorTex:TextureProxy, clipEnabled:boolean = false, clipMixEnabled:boolean = false):void
    {
        let size:number = 100;
        let params:number[][] = [
            [0.0,0.0,0.5,0.5],
            [0.5,0.0,0.5,0.5],
            [0.0,0.5,0.5,0.5],
            [0.5,0.5,0.5,0.5]
        ];
        let total:number = 15;
        let billGroup:Billboard3DFlareEntity = new Billboard3DFlareEntity();
        billGroup.createGroup(total);
        for(let i:number = 0; i < total; ++i)
        {
            if(total > 1)size = Math.random() * Math.random() * Math.random() * 180 + 10.0;
            billGroup.setSizeAndScaleAt(i,size,size,0.5,1.0);
            if(!clipEnabled)
            {
                let uvparam:number[] = params[Math.floor((params.length-1) * Math.random() + 0.5)];
                billGroup.setUVRectAt(i, uvparam[0],uvparam[1],uvparam[2],uvparam[3]);
            }
            billGroup.setTimeAt(i, 200.0 * Math.random() + 100, 0.4,0.6, Math.random() * 6.0 + 0.2);
            billGroup.setBrightnessAt(i,Math.random() * 0.8 + 0.8);
            //billGroup.setPositionAt(i,100.0,0.0,100.0);
            billGroup.setPositionAt(i, Math.random() * 500.0 - 250.0,Math.random() * 500.0 - 250.0, Math.random() * 500.0 - 250.0);
            //billGroup.setPositionAt(i, Math.random() * 500.0 - 250.0,Math.random() * 100.0 - 50.0, Math.random() * 500.0 - 250.0);
            
        }
        billGroup.setPlayParam(clipMixEnabled);
        if(colorTex != null)
        {
            billGroup.initialize(true,false,clipEnabled,[tex,colorTex]);
            billGroup.setRGB3f(0.1, 0.1, 0.1);
        }
        else
        {
            billGroup.initialize(true,false,clipEnabled,[tex]);
        }
        //billGroup.setClipUVParam(4,16,0.25,0.25);
        billGroup.setClipUVParam(2,4,0.5,0.5);

        this.m_rscene.addEntity(billGroup);
        billGroup.setTime(0.0);
        this.m_flareBill = billGroup;
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
        let billGroup:Billboard3DGroupEntity = new Billboard3DGroupEntity();
        billGroup.createGroup(total);
        for(let i:number = 0; i < total; ++i)
        {
            size = Math.random() * Math.random() * Math.random() * 180 + 10.0;
            billGroup.setSizeAt(i,size,size);
            //  billGroup.setUVRectAt(i, 0.0,0.0, 0.5,0.5);
            let uvparam:number[] = params[Math.floor((params.length-1) * Math.random() + 0.5)];
            billGroup.setUVRectAt(i, uvparam[0],uvparam[1],uvparam[2],uvparam[3]);
            //billGroup.setPositionAt(i,100.0,0.0,100.0);
            billGroup.setPositionAt(i, Math.random() * 500.0 - 250.0,Math.random() * 500.0 - 250.0, Math.random() * 500.0 - 250.0);
        }
        billGroup.initialize([tex]);
        this.m_rscene.addEntity(billGroup);
    }
    private m_charTex:TextureProxy = null;
    private m_ripple:TextureProxy = null;
    
    private m_timeoutId:any = -1;

    mouseDownListener(evt:any):void
    {
        console.log("mouseDownListener call, this.m_rscene: "+this.m_rscene.toString());
        
        if(this.m_flowBill != null)
        {
            //this.m_rscene.updateCamera();
            //this.m_rscene.getMouseXYWorldRay(this.m_rlpv, this.m_rltv);
            //Plane.IntersectionSLV2(this.m_pnv, this.m_pdis, this.m_rlpv, this.m_rltv, this.m_pv);
            this.m_viewRay.intersectPiane();
            let pv:Vector3D = this.m_viewRay.position;
            this.m_axis.setPosition(pv);
            this.m_axis.update();

            this.m_flowBill.setVisible(true);
            
            this.m_flowBill.setPosition(pv);
            this.m_flowBill.setAcceleration(Math.random() * 0.01 - 0.005,Math.random() * 0.002,Math.random() * 0.01 - 0.005);
            this.m_flowBill.setTime(0.0);
            this.m_flowBill.setRotationXYZ(0.0,Math.random() * 360.0,0.0);
            this.m_flowBill.update();
            
        }
    }
    position:Vector3D = new Vector3D();
    private m_billInited:boolean = true;
    private update():void
    {
        if(this.m_timeoutId > -1)
        {
            clearTimeout(this.m_timeoutId);
        }
        //this.m_timeoutId = setTimeout(this.update.bind(this),16);// 60 fps
        this.m_timeoutId = setTimeout(this.update.bind(this),20);// 50 fps

        //console.log(this.m_textures[0].isDataEnough());
        this.m_rscene.update();
        if(this.m_textures[0].isDataEnough())
        {
            if(this.m_billInited)
            {
                this.initializeBillEntity();
                this.m_billInited = false;
            }
            if(this.m_flowBill != null)this.m_flowBill.updateTime(1.0);
            if(this.m_flareBill != null)this.m_flareBill.updateTime(0.3);

        }
        //this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
    }
    private testUpdate():void
    {
        if(this.m_charTex != null)
        {
            if(this.m_charTex.isDataEnough() && this.m_ripple.isDataEnough())
            {
                let plane:Plane3DEntity;
                let sortFlag:boolean = true;
                if(sortFlag)
                {
                    plane = new Plane3DEntity();
                    plane.initializeXOZ(-128,-128,256,256,[this.m_charTex]);
                    plane.toTransparentBlend(false);
                    this.m_rscene.addEntity(plane);
                    
                    plane = new Plane3DEntity();
                    plane.initializeXOZ(-256,-256,512,512,[this.m_ripple]);
                    plane.toTransparentBlend(false);
                    this.m_rscene.addEntity(plane);
                }
                else
                {
                    plane = new Plane3DEntity();
                    plane.initializeXOZ(-256,-256,512,512,[this.m_ripple]);
                    plane.toTransparentBlend(false);
                    this.m_rscene.addEntity(plane);

                    plane = new Plane3DEntity();
                    plane.initializeXOZ(-128,-128,256,256,[this.m_charTex]);
                    plane.toTransparentBlend(false);
                    this.m_rscene.addEntity(plane);
                }
                this.m_charTex = null;
            }
        }
    }
    run():void
    {
        this.testUpdate();

        this.m_rscene.run();
        
        this.m_statusDisp.statusInfo = "/"+RendererState.DrawCallTimes;
        this.m_statusDisp.update();
    }
    
}
export default DemoParticleGroup;