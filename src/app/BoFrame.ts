
import * as RendererDevieceT from "../vox/render/RendererDeviece";
import * as RendererParamT from "../vox/scene/RendererParam";
import * as Vector3T from "../vox/math/Vector3D";
import * as Color4T from "../vox/material/Color4";
import * as RenderStatusDisplayT from "../vox/scene/RenderStatusDisplay";

import * as TextureProxyT from "../vox/texture/TextureProxy";
import * as TextureConstT from "../vox/texture/TextureConst";

import * as Box3DMeshT from "../vox/mesh/Box3DMesh";
import * as DisplayEntityT from "../vox/entity/DisplayEntity";
import * as Axis3DEntityT from "../vox/entity/Axis3DEntity";
import * as Line3DEntityT from "../vox/entity/Line3DEntity";
import * as Box3DEntityT from "../vox/entity/Box3DEntity";

import * as MouseEventT from "../vox/event/MouseEvent";
import * as ImageTextureLoaderT from "../vox/texture/ImageTextureLoader";
import * as CameraTrackT from "../vox/view/CameraTrack";
import * as RendererSceneT from "../vox/scene/RendererScene";
import * as BoFrameAxisT from "../app/robot/BoFrameAxis";
import * as TwoFeetUnitT from "../app/robot/TwoFeetUnit";
import * as FourFeetUnitT from "../app/robot/FourFeetUnit";
import * as SixFeetUnitT from "../app/robot/SixFeetUnit";
import * as IPartStoreT from "../app/robot/IPartStore";
import * as CameraViewRayT from "../vox/view/CameraViewRay";

import RendererDeviece = RendererDevieceT.vox.render.RendererDeviece;
import RendererParam = RendererParamT.vox.scene.RendererParam;
import Vector3D = Vector3T.vox.math.Vector3D;
import Color4 = Color4T.vox.material.Color4;
import RenderStatusDisplay = RenderStatusDisplayT.vox.scene.RenderStatusDisplay;

import TextureProxy = TextureProxyT.vox.texture.TextureProxy;
import TextureConst = TextureConstT.vox.texture.TextureConst;

import Box3DMesh = Box3DMeshT.vox.mesh.Box3DMesh;
import DisplayEntity = DisplayEntityT.vox.entity.DisplayEntity;
import Axis3DEntity = Axis3DEntityT.vox.entity.Axis3DEntity;
import Line3DEntity = Line3DEntityT.vox.entity.Line3DEntity;
import Box3DEntity = Box3DEntityT.vox.entity.Box3DEntity;

import MouseEvent = MouseEventT.vox.event.MouseEvent;
import ImageTextureLoader = ImageTextureLoaderT.vox.texture.ImageTextureLoader;
import CameraTrack = CameraTrackT.vox.view.CameraTrack;
import RendererScene = RendererSceneT.vox.scene.RendererScene;
import BoFrameAxis = BoFrameAxisT.app.robot.BoFrameAxis;
import TwoFeetUnit = TwoFeetUnitT.app.robot.TwoFeetUnit;
import FourFeetUnit = FourFeetUnitT.app.robot.FourFeetUnit;
import SixFeetUnit = SixFeetUnitT.app.robot.SixFeetUnit;
import IPartStore = IPartStoreT.app.robot.IPartStore;
import CameraViewRay = CameraViewRayT.vox.view.CameraViewRay;

export namespace app
{
    class LinePartStore implements IPartStore
    {
        private m_coreCenterV:Vector3D = new Vector3D(0.0,105.0,0.0);
        private m_coreWidth:number = 60.0;
        private m_bgLong:number = -60.0;
        private m_sgLong:number = -50.0;
        constructor(){}

        getCoreWidth():number
        {
            return this.m_coreWidth;
        }
        getBGLong():number
        {
            return this.m_bgLong;
        }
        getSGLong():number
        {
            return this.m_sgLong;
        }
        getCoreCenter():Vector3D
        {
            return this.m_coreCenterV;
        }
        getEngityCore():DisplayEntity
        {
            let coreEntity:Axis3DEntity = new Axis3DEntity();
            coreEntity.initializeCross(this.getCoreWidth());
            coreEntity.setPosition(this.getCoreCenter());
            return coreEntity;
        }
        getEngityBGL():DisplayEntity
        {
            let bgL:Line3DEntity = new Line3DEntity();
            bgL.setRGB3f(0.5,0.8,0.0);
            bgL.initialize(new Vector3D(),new Vector3D(0.0, this.getBGLong(), 0.0));
            return bgL;
        }
        getEngityBGR():DisplayEntity
        {
            let bgR:Line3DEntity = new Line3DEntity();
            bgR.setRGB3f(0.5,0.8,0.0);
            bgR.initialize(new Vector3D(),new Vector3D(0.0, this.getBGLong(), 0.0));
            return bgR;
        }
        getEngitySGL():DisplayEntity
        {
            let sgL:Line3DEntity = new Line3DEntity();
            sgL.setRGB3f(0.9,0.0,0.0);
            sgL.initialize(new Vector3D(),new Vector3D(0.0,this.getSGLong(),0.0));
            return sgL;
        }
        getEngitySGR():DisplayEntity
        {
            let sgR:Line3DEntity = new Line3DEntity();
            sgR.setRGB3f(0.9,0.0,0.0);
            sgR.initialize(new Vector3D(),new Vector3D(0.0,this.getSGLong(),0.0));
            return sgR;
        }
    }
    class BoxPartStore implements IPartStore
    {
        private m_coreCenterV:Vector3D = new Vector3D(0.0,105.0,0.0);
        private m_coreWidth:number = 60.0;
        private m_bgLong:number = -60.0;
        private m_sgLong:number = -50.0;
        private m_bgBox:Box3DEntity = null;
        private m_bgLBox:Box3DEntity = null;
        private m_bgRBox:Box3DEntity = null;
        private m_sgBox:Box3DEntity = null;
        private m_sgLBox:Box3DEntity = null;
        private m_sgRBox:Box3DEntity = null;

        private static s_baseBox:Box3DEntity = null;
        
        private static s_v0:Vector3D = new Vector3D(-10,-10,-10);        
        private static s_v1:Vector3D = new Vector3D(10,10,10);

        private m_tex0:TextureProxy;
        private m_tex1:TextureProxy;
        private m_tex2:TextureProxy;
        constructor(){}
        
        initilizeCopyFrom(store:BoxPartStore):void
        {
            if(store != null)
            {
                this.m_tex0 = store.m_tex0;
                this.m_tex1 = store.m_tex1;
                this.m_tex2 = store.m_tex2;
                this.m_bgBox = store.m_bgBox;
                this.m_sgBox = store.m_sgBox;
                this.m_coreWidth = store.m_coreWidth;
                this.m_bgLong = store.m_bgLong;
                this.m_sgLong = store.m_sgLong;
                this.m_coreCenterV.copyFrom(store.m_coreCenterV);
            }
        }
        initilize(tex0:TextureProxy,tex1:TextureProxy,tex2:TextureProxy):void
        {
            if(this.m_bgBox == null)
            {
                this.m_tex0 = tex0;
                this.m_tex1 = tex1;
                this.m_tex2 = tex2;

                let boxBase:Box3DEntity;
                if(BoxPartStore.s_baseBox == null)
                {
                    boxBase = this.m_bgBox = new Box3DEntity();
                    boxBase.initialize(BoxPartStore.s_v0,BoxPartStore.s_v1,[this.m_tex1]);
                    BoxPartStore.s_baseBox = boxBase;
                }
                boxBase = BoxPartStore.s_baseBox;

                
                let bgMesh:Box3DMesh = new Box3DMesh();
                bgMesh.setBufSortFormat( boxBase.getMaterial().getBufSortFormat() );
                bgMesh.initializeWithYFace(
                    new Vector3D(-10.0,this.getBGLong(),-10.0), new Vector3D(10.0,this.getBGLong(),10.0),
                    new Vector3D(-20.0,0.0,-20.0), new Vector3D(20.0,0.0,20.0)
                );

                
                let sgMesh:Box3DMesh = new Box3DMesh();
                sgMesh.setBufSortFormat( boxBase.getMaterial().getBufSortFormat() );
                sgMesh.initializeWithYFace(
                    new Vector3D(-15.0,this.getSGLong(),-15.0), new Vector3D(15.0,this.getSGLong(),15.0),
                    new Vector3D(-10.0,0.0,-10.0), new Vector3D(10.0,0.0,10.0)
                );

                this.m_bgBox = new Box3DEntity();
                this.m_bgBox.setMesh(bgMesh);
                this.m_bgBox.initialize(new Vector3D(-15.0,this.getBGLong(),-15.0), new Vector3D(15.0,0.0,15.0),[this.m_tex1]);
                this.updateBoxUV(this.m_bgBox);
                
                this.m_sgBox = new Box3DEntity();
                this.m_sgBox.setMesh(sgMesh);
                this.m_sgBox.initialize(new Vector3D(-10.0,this.getSGLong(),-10.0), new Vector3D(10.0,0.0,10.0),[this.m_tex1]);
                this.updateBoxUV(this.m_sgBox);
            }
        }
        getCoreWidth():number
        {
            return this.m_coreWidth;
        }
        getBGLong():number
        {
            return this.m_bgLong;
        }
        getSGLong():number
        {
            return this.m_sgLong;
        }
        getCoreCenter():Vector3D
        {
            return this.m_coreCenterV;
        }
        getEngityCore():DisplayEntity
        {
            let coreEntity:Axis3DEntity = new Axis3DEntity();
            //coreEntity.initializeCross(this.getCoreWidth());
            coreEntity.initialize(this.getCoreWidth());
            coreEntity.setPosition(this.getCoreCenter());
            return coreEntity;
        }
        getEngityBGL():DisplayEntity
        {
            if(this.m_bgLBox == null)
            {
                this.m_bgLBox = new Box3DEntity();   
                this.m_bgLBox.copyMeshFrom(this.m_bgBox);
                this.m_bgLBox.initialize(BoxPartStore.s_v0,BoxPartStore.s_v1,[this.m_tex1]);
                (this.m_bgLBox.getMaterial() as any).setRGB3f(0.5,0.8,0.0);
            }
            return this.m_bgLBox;
        }
        getEngityBGR():DisplayEntity
        {
            if(this.m_bgRBox == null)
            {
                this.m_bgRBox = new Box3DEntity();
                this.m_bgRBox.copyMeshFrom(this.m_bgBox);
                this.m_bgRBox.initialize(BoxPartStore.s_v0,BoxPartStore.s_v1,[this.m_tex1]);
                (this.m_bgRBox.getMaterial() as any).setRGB3f(0.5,0.8,0.0);
            }
            return this.m_bgRBox;
        }
        getEngitySGL():DisplayEntity
        {
            if(this.m_sgLBox == null)
            {
                this.m_sgLBox = new Box3DEntity();
                this.m_sgLBox.copyMeshFrom(this.m_sgBox);
                this.m_sgLBox.initialize(BoxPartStore.s_v0,BoxPartStore.s_v1,[this.m_tex1]);
                (this.m_sgLBox.getMaterial() as any).setRGB3f(0.9,0.0,0.0);
            }
            return this.m_sgLBox;
        }
        getEngitySGR():DisplayEntity
        {
            if(this.m_sgRBox == null)
            {
                this.m_sgRBox = new Box3DEntity();   
                this.m_sgRBox.copyMeshFrom(this.m_sgBox);
                this.m_sgRBox.initialize(BoxPartStore.s_v0,BoxPartStore.s_v1,[this.m_tex1]);
                (this.m_sgRBox.getMaterial() as any).setRGB3f(0.9,0.0,0.0);
            }
            return this.m_sgRBox;
        }
        private updateBoxUV(box:Box3DEntity):void
        {
            box.scaleUVFaceAt(0, 0.5,0.5,0.5,0.5);
            box.scaleUVFaceAt(1, 0.0,0.0,0.5,0.5);
            box.scaleUVFaceAt(2, 0.5,0.0,0.5,0.5);
            box.scaleUVFaceAt(3, 0.0,0.5,0.5,0.5);
            box.scaleUVFaceAt(4, 0.5,0.0,0.5,0.5);
            box.scaleUVFaceAt(5, 0.0,0.5,0.5,0.5);
            box.reinitializeMesh();
        }
    }
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
                ///*
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
        }
        run():void
        {

            this.m_statusDisp.update();
            this.m_texLoader.run();

            this.m_rscene.run();

            this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
        }
    }
}