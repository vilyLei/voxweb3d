
import * as RendererDevieceT from "../vox/render/RendererDeviece";
import * as Vector3DT from "../vox/math/Vector3D";
import * as CircleCalcT from "../vox/geom/CircleCalc";
import * as RendererParamT from "../vox/scene/RendererParam";
import * as RendererStateT from "../vox/render/RendererState";
import * as RenderStatusDisplayT from "../vox/scene/RenderStatusDisplay";
import * as Axis3DEntityT from "../vox/entity/Axis3DEntity";
import * as Plane3DEntityT from "../vox/entity/Plane3DEntity";
import * as Box3DEntityT from "../vox/entity/Box3DEntity";
import * as Sphere3DEntityT from "../vox/entity/Sphere3DEntity";
import * as BrokenLine3DEntityT from "../vox/entity/BrokenLine3DEntity";

import * as ImageTextureLoaderT from "../vox/texture/ImageTextureLoader";
import * as MouseEventT from "../vox/event/MouseEvent";
import * as CameraTrackT from "../vox/view/CameraTrack";
import * as RendererSceneT from "../vox/scene/RendererScene";
import * as BaseColorMaterialT from "../vox/material/mcase/BaseColorMaterial";

import RendererDeviece = RendererDevieceT.vox.render.RendererDeviece;
import Vector3D = Vector3DT.vox.math.Vector3D;
import CircleCalc = CircleCalcT.vox.geom.CircleCalc;
import RendererParam = RendererParamT.vox.scene.RendererParam;
import RendererState = RendererStateT.vox.render.RendererState;
import RenderStatusDisplay = RenderStatusDisplayT.vox.scene.RenderStatusDisplay;
import Axis3DEntity = Axis3DEntityT.vox.entity.Axis3DEntity;
import Plane3DEntity = Plane3DEntityT.vox.entity.Plane3DEntity;
import Box3DEntity = Box3DEntityT.vox.entity.Box3DEntity;
import Sphere3DEntity = Sphere3DEntityT.vox.entity.Sphere3DEntity;
import BrokenLine3DEntity = BrokenLine3DEntityT.vox.entity.BrokenLine3DEntity;

import ImageTextureLoader = ImageTextureLoaderT.vox.texture.ImageTextureLoader;
import MouseEvent = MouseEventT.vox.event.MouseEvent;
import CameraTrack = CameraTrackT.vox.view.CameraTrack;
import RendererScene = RendererSceneT.vox.scene.RendererScene;
import BaseColorMaterial = BaseColorMaterialT.vox.material.mcase.BaseColorMaterial;

export namespace demo
{
    export class DemoGLState
    {
        constructor(){}

        private m_rscene:RendererScene = null;
        private m_camTrack:CameraTrack = null;
        private m_statusDisp:RenderStatusDisplay = new RenderStatusDisplay();
        private m_texLoader:ImageTextureLoader = null;
        private m_target:Sphere3DEntity = null;
        private m_target2:Sphere3DEntity = null;
        private m_runType:number = 0;
        initialize():void
        {
            console.log("DemoGLState::initialize()......");
            if(this.m_rscene == null)
            {
                RendererDeviece.SHADERCODE_TRACE_ENABLED = true;
                RendererDeviece.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
                
                let rparam:RendererParam = new RendererParam();
                rparam.setAttriAntialias(true);
                rparam.setCamPosition(800.0,800.0,800.0);
                this.m_rscene = new RendererScene();
                this.m_rscene.initialize(rparam,3);
                this.m_rscene.updateCamera();

                this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);

                this.m_camTrack = new CameraTrack();
                this.m_camTrack.bindCamera(this.m_rscene.getCamera());

                this.m_statusDisp.initialize("rstatus",this.m_rscene.getStage3D().viewWidth - 200);

                this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this,this.mouseDown);

                //this.m_rscene.getRenderProxy().setFrontFaceFlip(true);
                ///*
                let axis:Axis3DEntity = new Axis3DEntity();
                axis.initialize(300.0);
                this.m_rscene.addEntity(axis);
                let plane:Plane3DEntity = new Plane3DEntity();
                plane.initializeXOZSquare(900.0,[this.m_texLoader.getTexByUrl("static/assets/wood_02.jpg")]);
                plane.setXYZ(0.0,-200.0,0.0);
                this.m_rscene.addEntity(plane);
                //*/
                //  let box:Box3DEntity = new Box3DEntity();
                //  box.initializeCube(200.0,[this.m_texLoader.getTexByUrl("static/assets/default.jpg")]);
                //  this.m_rscene.addEntity(box);
                let material:BaseColorMaterial;
                let sphere:Sphere3DEntity = new Sphere3DEntity();
                material = new BaseColorMaterial();
                material.setTextureList([this.m_texLoader.getTexByUrl("static/assets/default.jpg")]);
                sphere.setMaterial(material);
                //sphere.doubleTriFaceEnabled = true;
                //sphere.setRenderState(RendererState.FRONT_CULLFACE_NORMAL_STATE);
                //sphere.setRenderState(RendererState.NONE_CULLFACE_NORMAL_STATE);
                sphere.initialize(100,10,10,[this.m_texLoader.getTexByUrl("static/assets/default.jpg")]);
                //sphere.setIvsParam(300,30);
                sphere.setScaleXYZ(1.4,1.4,1.4);
                this.m_rscene.addEntity(sphere,1);
                //return;
                this.m_runType = 1;
                this.m_target = sphere;
                //color_02
                sphere = new Sphere3DEntity();
                sphere.copyMeshFrom(this.m_target);
                sphere.setMaterial(new BaseColorMaterial())
                sphere.setRenderState(RendererState.FRONT_CULLFACE_NORMAL_STATE);
                sphere.initialize(100,10,10,[this.m_texLoader.getTexByUrl("static/assets/color_02.jpg")]);
                //sphere.initializeFrom(this.m_target, [this.m_texLoader.getTexByUrl("static/assets/color_02.jpg")]);
                sphere.setScaleXYZ(0.4,0.4,0.4);
                sphere.setXYZ(-80.0,50.0,0.0);
                //sphere.setIvsParam(300,30);
                this.m_rscene.addEntity(sphere,1);
                this.m_target2 = sphere;

                this.update();

            }
        }
        private step(edge:number,value:number):number
        {
            return value < edge ? 0.0:1.0;
        }
        private mouseDown(evt:any):void
        {
        }
        private m_timeoutId:any = -1;
        private update():void
        {
            if(this.m_timeoutId > -1)
            {
                clearTimeout(this.m_timeoutId);
            }
            //this.m_timeoutId = setTimeout(this.update.bind(this),16);// 60 fps
            this.m_timeoutId = setTimeout(this.update.bind(this),50);// 20 fps
            
            this.m_statusDisp.render();
        }
        run():void
        {
            this.m_statusDisp.update(false);
            switch(this.m_runType)
            {
                case 1:
                this.runBlend();
                    break;
                default:
                    this.runBase();
                    break;
            }
        }

        
        private runBlend():void
        {
            this.m_rscene.update();

            this.m_rscene.runBegin();

            this.m_rscene.runAt(0);
            let ivsIndex:number = this.m_target.getIvsIndex();
            let ivsCount:number = this.m_target.getIvsCount();
            ///*
            this.m_target2.setVisible(true);
            this.m_target.setIvsParam(333, 30);
            (this.m_target.getMaterial() as any).setAlpha(1.0);
            this.m_target.setRenderState(RendererState.NONE_CULLFACE_NORMAL_STATE);
            this.m_rscene.runAt(1);

            (this.m_target.getMaterial() as any).setAlpha(0.3);
            this.m_target.setRenderState(RendererState.NONE_TRANSPARENT_ALWAYS_STATE);
            this.m_rscene.drawEntity(this.m_target);
            //*/
            this.m_target.setIvsParam(ivsIndex, ivsCount);
            
            ///*
            (this.m_target.getMaterial() as any).setAlpha(0.2);
            this.m_target.setRenderState(RendererState.FRONT_TRANSPARENT_STATE);
            this.m_rscene.drawEntity(this.m_target);
            //*/
            ///*
            (this.m_target.getMaterial() as any).setAlpha(0.2);
            this.m_target.setRenderState(RendererState.BACK_TRANSPARENT_STATE);
            this.m_rscene.drawEntity(this.m_target);
            //*/
            

            this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
        }
        
        private runBase():void
        {
            this.m_rscene.run();
            this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
        }
    }
}