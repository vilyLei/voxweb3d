
import * as RendererDevieceT from "../vox/render/RendererDeviece";
import * as RendererParamT from "../vox/scene/RendererParam";
import * as Vector3T from "../vox/math/Vector3D";
import * as Color4T from "../vox/material/Color4";
import * as RenderStatusDisplayT from "../vox/scene/RenderStatusDisplay";

import * as TextureProxyT from "../vox/texture/TextureProxy";

import * as DisplayEntityT from "../vox/entity/DisplayEntity";
import * as Axis3DEntityT from "../vox/entity/Axis3DEntity";
import * as Box3DEntityT from "../vox/entity/Box3DEntity";
import * as Plane3DEntityT from "../vox/entity/Plane3DEntity";

import * as MouseEventT from "../vox/event/MouseEvent";
import * as ImageTextureLoaderT from "../vox/texture/ImageTextureLoader";
import * as CameraTrackT from "../vox/view/CameraTrack";
import * as RendererSceneT from "../vox/scene/RendererScene";
import * as TwoFeetUnitT from "../app/robot/TwoFeetUnit";
import * as FourLimbRoleT from "../app/robot/base/FourLimbRole";
import * as LinePartStoreT from "../app/robot/LinePartStore";
import * as BoxPartStoreT from "../app/robot/BoxPartStore";
import * as CampMoudleT from "../app/robot/camp/CampMoudle";
import * as CampT from "../app/robot/camp/Camp";
import * as AssetsModuleT from "../app/robot/assets/AssetsModule";
import * as RedRoleT from "../app/robot/RedRole";
import * as RunnableModuleT from "../app/robot/scene/RunnableModule";
import * as TerrainT from "../app/robot/scene/Terrain";
import * as SillyRoleT from "../app/robot/base/SillyRole";

import * as CameraViewRayT from "../vox/view/CameraViewRay";

import RendererDeviece = RendererDevieceT.vox.render.RendererDeviece;
import RendererParam = RendererParamT.vox.scene.RendererParam;
import Vector3D = Vector3T.vox.math.Vector3D;
import Color4 = Color4T.vox.material.Color4;
import RenderStatusDisplay = RenderStatusDisplayT.vox.scene.RenderStatusDisplay;

import TextureProxy = TextureProxyT.vox.texture.TextureProxy;

import DisplayEntity = DisplayEntityT.vox.entity.DisplayEntity;
import Axis3DEntity = Axis3DEntityT.vox.entity.Axis3DEntity;
import Box3DEntity = Box3DEntityT.vox.entity.Box3DEntity;
import Plane3DEntity = Plane3DEntityT.vox.entity.Plane3DEntity;

import MouseEvent = MouseEventT.vox.event.MouseEvent;
import ImageTextureLoader = ImageTextureLoaderT.vox.texture.ImageTextureLoader;
import CameraTrack = CameraTrackT.vox.view.CameraTrack;
import RendererScene = RendererSceneT.vox.scene.RendererScene;
import TwoFeetUnit = TwoFeetUnitT.app.robot.TwoFeetUnit;
import FourLimbRole = FourLimbRoleT.app.robot.base.FourLimbRole;
import LinePartStore = LinePartStoreT.app.robot.LinePartStore;
import BoxPartStore = BoxPartStoreT.app.robot.BoxPartStore;
import CampMoudle = CampMoudleT.app.robot.CampMoudle;
import CampType = CampT.app.robot.camp.CampType;
import AssetsModule = AssetsModuleT.app.robot.assets.AssetsModule;
import RedRole = RedRoleT.app.robot.RedRole;
import RunnableModule = RunnableModuleT.app.robot.scene.RunnableModule;
import Terrain = TerrainT.app.robot.scene.Terrain;
import SillyRole = SillyRoleT.app.robot.base.SillyRole;

import CameraViewRay = CameraViewRayT.vox.view.CameraViewRay;

export namespace app
{
    export class RbtDrama
    {
        constructor(){}

        private m_rscene:RendererScene = null;
        private m_texLoader:ImageTextureLoader = null;
        private m_camTrack:CameraTrack = null;
        private m_statusDisp:RenderStatusDisplay = new RenderStatusDisplay();

        //FourLimbRole
        private m_twoFeetBody:FourLimbRole = null;
        private m_twoFeetBodys:FourLimbRole[] = [];
        private m_targets:DisplayEntity[] = [];
        private m_viewRay:CameraViewRay = new CameraViewRay();

        private m_campModule:CampMoudle = new CampMoudle();
        
        initialize():void
        {
            console.log("RbtDrama::initialize()......");
            if(this.m_rscene == null)
            {
                RendererDeviece.SHADERCODE_TRACE_ENABLED = true;
                RendererDeviece.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
                RendererDeviece.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
                
                let rparam:RendererParam = new RendererParam();
                rparam.setAttriAntialias(true);
                rparam.setCamProject(45.0,30.0,9000.0);
                //rparam.maxWebGLVersion = 1;
                //rparam.setCamPosition(10.0,1800.0,10.0);
                //rparam.setCamPosition(3500.0,3500.0,3500.0);
                //rparam.setCamPosition(1200.0,1200.0,1200.0);
                rparam.setCamPosition(1800.0,1800.0,1800.0);
                //rparam.setCamPosition(800.0,800.0,800.0);
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
                let texLoader:ImageTextureLoader = this.m_texLoader;
                this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this,this.mouseDown);
                AssetsModule.GetInstance().initialize(this.m_texLoader);

                this.m_campModule.initialize(this.m_rscene);

                let tex0:TextureProxy = texLoader.getTexByUrl("static/assets/wood_01.jpg");
                let tex1:TextureProxy = texLoader.getTexByUrl("static/assets/yanj.jpg");
                let tex2:TextureProxy = texLoader.getTexByUrl("static/assets/skin_01.jpg");
                let tex3:TextureProxy = texLoader.getTexByUrl("static/assets/default.jpg");
                let tex4:TextureProxy = texLoader.getTexByUrl("static/assets/warter_01.jpg");
                let tex5:TextureProxy = texLoader.getTexByUrl("static/assets/metal_02.jpg");
                //let tex4:TextureProxy = this.m_rscene.textureBlock.createRGBATex2D(16,16,new Color4(1.0,0.0,1.0));

                
                let plane:Plane3DEntity = new Plane3DEntity();
                plane.initializeXOZ(-500.0,-500.0,1000.0,1000.0,[texLoader.getTexByUrl("static/assets/wood_01.jpg")]);
                //plane.toTransparentBlend(false);
                plane.setScaleXYZ(2.0,2.0,2.0);
                plane.setXYZ(0.0,-10.0,0.0);
                (plane.getMaterial() as any).setRGB3f(0.5,0.5,0.5);
                this.m_rscene.addEntity(plane);

                let axis:Axis3DEntity = new Axis3DEntity();
                //axis.initializeCross(600.0);
                axis.initialize(300.0);
                this.m_rscene.addEntity(axis);

                axis = new Axis3DEntity();
                axis.initializeCross(200.0);
                this.m_rscene.addEntity(axis);

                let srcBox:Box3DEntity = new Box3DEntity();
                srcBox.initializeCube(100.0,[tex2]);
                let i:number = 0;
                for(; i < 0; ++i)
                {
                    let box:Box3DEntity = new Box3DEntity();
                    box.copyMeshFrom(srcBox);
                    box.initializeCube(100.0,[tex2]);
                    box.setScaleXYZ(0.5,1.0,0.5);
                    //box.setXYZ(200,0.0,200);
                    //box.setXYZ(Math.random() * 600.0 - 300.0,0.0,Math.random() * 600.0 - 300.0);
                    box.setXYZ(Math.random() * 1000.0 - 500.0,0.0,Math.random() * 1000.0 - 500.0);
                    this.m_rscene.addEntity(box);
                    let redRole:RedRole = new RedRole();
                    box.getPosition(redRole.position);
                    redRole.radius = 80;
                    redRole.dispEntity = box;
                    this.m_campModule.redCamp.addRole(redRole);
                }
                let terrain:Terrain = new Terrain();
                
                for(i = 0; i < 120; ++i)
                {
                    //let linePart0:LinePartStore = new LinePartStore();
                    //let linePart1:LinePartStore = new LinePartStore();
                    //linePart1.setParam(80.0,-40.0,-30.0);
                    let boxPart0:BoxPartStore = new BoxPartStore();
                    boxPart0.setSgSize(10,15);
                    boxPart0.initilize(tex0,tex2,tex1);
    
                    let boxPart1:BoxPartStore = new BoxPartStore();
                    boxPart1.setParam(100.0,-40.0,-30.0);
                    boxPart1.setBgSize(10, 8);
                    boxPart1.setSgSize(7,  5);
                    boxPart1.initilize(tex0,tex2,tex1);
                    
                    this.m_twoFeetBody = new FourLimbRole();
                    this.m_twoFeetBody.roleCamp = this.m_campModule.redCamp;
                    this.m_twoFeetBody.terrain = terrain;
                    //this.m_twoFeetBody.initialize( this.m_rscene,0, linePart0, linePart1,60.0);
                    //this.m_twoFeetBody.initialize( this.m_rscene,0, boxPart0, linePart1,80.0);
                    this.m_twoFeetBody.initialize(this.m_rscene, 0, boxPart0, boxPart1, 80.0);
                    //this.m_twoFeetBody.setXYZ(Math.random() * 500.0 - 250.0,0.0,Math.random() * 500.0 - 250.0);
                    
                    this.m_twoFeetBody.setXYZ(Math.random() * 1600.0 - 800.0,0.0,Math.random() * 1600.0 - 800.0);
                    this.m_twoFeetBody.moveToXZ(Math.random() * 1600.0 - 800.0,Math.random() * 1600.0 - 800.0);
                    //this.m_twoFeetBody.moveToXZ(30.0, 0.0);
                    this.m_twoFeetBodys.push(this.m_twoFeetBody);//TwoFeetBody
                }
                let srcSillyRole:SillyRole = null;
                let lowerBox:Box3DEntity = new Box3DEntity();
                lowerBox.initializeSizeXYZ(50.0,40,50,[tex3]);
                lowerBox.setXYZ(0.0,20.0,0.0);
                let upperBox:Box3DEntity = new Box3DEntity();
                upperBox.initializeSizeXYZ(30.0,20,30,[tex5]);
                upperBox.setXYZ(0.0,50.0,0.0);
                for(i = 0; i < 200; ++i)
                {

                    let sillyRole:SillyRole = new SillyRole();
                    if(srcSillyRole != null)
                    {
                        sillyRole.initializeFrom(srcSillyRole);
                    }
                    else
                    {
                        let box0:Box3DEntity = new Box3DEntity();
                        box0.copyMeshFrom(lowerBox);
                        box0.initializeSizeXYZ(50.0,40,50,[tex5]);
                        box0.setXYZ(0.0,20.0,0.0);
                        (box0.getMaterial() as any).setRGB3f(Math.random() + 0.2,Math.random() + 0.2,Math.random() + 0.2);
                        let box1:Box3DEntity = new Box3DEntity();
                        box1.copyMeshFrom(upperBox);
                        box1.initializeSizeXYZ(30.0,20,30,[tex4]);
                        box1.setXYZ(0.0,50.0,0.0);
                        (box1.getMaterial() as any).setRGB3f(Math.random() + 0.4,Math.random() + 0.4,Math.random() + 0.4);
                        sillyRole.initialize(this.m_rscene,0,box0,box1);
                    }
                    
                    sillyRole.setXYZ(Math.random() * 1600.0 - 800.0,0.0,Math.random() * 1600.0 - 800.0);
                    sillyRole.moveToXZ(Math.random() * 1600.0 - 800.0,Math.random() * 1600.0 - 800.0);
                    
                    sillyRole.campType = CampType.Red;
                    sillyRole.terrain = terrain;
                    sillyRole.attackDis = 50;
                    sillyRole.radius = 80;
                    sillyRole.lifeTime = 1000;
                    sillyRole.wake();
                    this.m_campModule.redCamp.addRole(sillyRole);
                }

                this.update();
            }
        }

        private m_runflag:boolean = true;
        private mouseDown(evt:any):void
        {
            this.m_viewRay.intersectPiane();
            let pv:Vector3D = this.m_viewRay.position;
            if(this.m_twoFeetBody != null)
            {
                this.m_twoFeetBody.moveToXZ(pv.x, pv.z,true);
                
                this.m_runflag = !this.m_runflag;
            }
        }
        
        private m_timeoutId:any = -1;
        private update():void
        {
            if(this.m_timeoutId > -1)
            {
                clearTimeout(this.m_timeoutId);
            }
            this.m_timeoutId = setTimeout(this.update.bind(this),50);// 50 fps
            
            this.m_campModule.run();
            RunnableModule.Run();
            this.m_rscene.update();
        }
        run():void
        {
            this.m_statusDisp.update();
            this.m_rscene.runBegin();
            this.m_rscene.run();
            this.m_rscene.runEnd();
            this.m_viewRay.intersectPiane();
            this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
        }
    }
}