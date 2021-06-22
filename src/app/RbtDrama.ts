
import RendererDeviece from "../vox/render/RendererDeviece";
import RendererParam from "../vox/scene/RendererParam";
import Vector3D from "../vox/math/Vector3D";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";
import TextureProxy from "../vox/texture/TextureProxy";
import Axis3DEntity from "../vox/entity/Axis3DEntity";
import Box3DEntity from "../vox/entity/Box3DEntity";
import Plane3DEntity from "../vox/entity/Plane3DEntity";

import MouseEvent from "../vox/event/MouseEvent";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import CameraTrack from "../vox/view/CameraTrack";
import RendererScene from "../vox/scene/RendererScene";
import FourLimbRole from "../app/robot/base/FourLimbRole";
import FourLimbRoleFactory from "../app/robot/base/FourLimbRoleFactory";
import TrackWheeRoleFactory from "../app/robot/base/TrackWheeRoleFactory";
import CampMoudle from "../app/robot/camp/CampMoudle";
import {CampType} from "../app/robot/camp/Camp";
import AssetsModule from "../app/robot/assets/AssetsModule";
import RedRole from "../app/robot/RedRole";
import RunnableModule from "../app/robot/scene/RunnableModule";
import Terrain from "../app/robot/scene/Terrain";
import SillyRole from "../app/robot/base/SillyRole";
import TrackWheelRole from "../app/robot/base/TrackWheelRole";

import CameraViewRay from "../vox/view/CameraViewRay";

export class RbtDrama
{
    constructor(){}

    private m_rscene:RendererScene = null;
    private m_texLoader:ImageTextureLoader = null;
    private m_camTrack:CameraTrack = null;
    private m_statusDisp:RenderStatusDisplay = new RenderStatusDisplay();

    private m_limbRole:FourLimbRole = null;
    private m_flrFactory:FourLimbRoleFactory = new FourLimbRoleFactory();
    private m_twrFactory:TrackWheeRoleFactory = new TrackWheeRoleFactory();
    
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
            rparam.setMatrix4AllocateSize(4096 * 8)
            rparam.setCamProject(45.0,30.0,9000.0);
            //rparam.setCamPosition(10.0,1800.0,10.0);
            //rparam.setCamPosition(3500.0,3500.0,3500.0);
            //rparam.setCamPosition(1200.0,1200.0,1200.0);
            rparam.setCamPosition(1800.0,1800.0,1800.0);
            //rparam.setCamPosition(2800.0,2800.0,2800.0);
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
            let tex6:TextureProxy = texLoader.getTexByUrl("static/assets/image_003.jpg");
            let tex7:TextureProxy = texLoader.getTexByUrl("static/assets/metal_08.jpg");
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

            this.m_flrFactory.initialize(this.m_rscene, 0, this.m_campModule.redCamp, terrain);
            this.m_twrFactory.initialize(this.m_rscene, 0, this.m_campModule.redCamp, terrain);

            let limbRole:FourLimbRole;
            let campType:CampType;
            let bodySize:number = 40.0;
            for(i = 0; i < 200; ++i)
            {
                bodySize = Math.round(Math.random() * 60.0) + 30.0;
                switch(i%3)
                {
                    case 1:
                        campType = CampType.Red;
                        break;
                    case 2:
                        campType = CampType.Green;
                        break;
                    default:
                        campType = CampType.Blue;
                        break;

                }
                limbRole = this.m_flrFactory.create(tex0,tex1,tex2,campType,bodySize);
                limbRole.lifeTime = 100 + Math.round(100.0 * Math.random());
                limbRole.setXYZ(Math.random() * 1600.0 - 800.0,0.0,Math.random() * 1600.0 - 800.0);
                limbRole.moveToXZ(Math.random() * 1600.0 - 800.0,Math.random() * 1600.0 - 800.0);
                
                this.m_campModule.redCamp.addRole(limbRole);
            }
            //this.m_limbRole = limbRole;

            for(i = 0; i < 1000; ++i)
            {
                switch(i%3)
                {
                    case 1:
                        campType = CampType.Red;
                        break;
                    case 2:
                        campType = CampType.Green;
                        break;
                    default:
                        campType = CampType.Blue;
                        break;
                }
                let twRole:TrackWheelRole = this.m_twrFactory.create(tex6,tex7,tex2,campType,bodySize);
                twRole.lifeTime = 100 + Math.round(100.0 * Math.random());
                twRole.setXYZ(Math.random() * 1600.0 - 800.0,0.0,Math.random() * 1600.0 - 800.0);
                twRole.moveToXZ(Math.random() * 1600.0 - 800.0,Math.random() * 1600.0 - 800.0);
                twRole.wake();
                this.m_campModule.redCamp.addRole(twRole);
            }
            ///*
            let srcSillyRole:SillyRole = null;
            let lowerBox:Box3DEntity = new Box3DEntity();
            lowerBox.initializeSizeXYZ(50.0,40,50,[tex3]);
            lowerBox.setXYZ(0.0,20.0,0.0);
            let upperBox:Box3DEntity = new Box3DEntity();
            upperBox.initializeSizeXYZ(30.0,20,30,[tex5]);
            upperBox.setXYZ(0.0,50.0,0.0);
            for(i = 0; i < 100; ++i)
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
                
                sillyRole.campType = CampType.Free;
                sillyRole.terrain = terrain;
                sillyRole.attackDis = 50;
                sillyRole.radius = 80;
                sillyRole.lifeTime = 200;
                sillyRole.wake();
                this.m_campModule.redCamp.addRole(sillyRole);
            }
            //*/
            this.update();
        }
    }

    private mouseDown(evt:any):void
    {
        this.m_viewRay.intersectPiane();
        let pv:Vector3D = this.m_viewRay.position;
    }
    
    private m_timeoutId:any = -1;
    private update():void
    {
        if(this.m_timeoutId > -1)
        {
            clearTimeout(this.m_timeoutId);
        }
        this.m_timeoutId = setTimeout(this.update.bind(this),50);// 20 fps
        
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
        //this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
    }
}
export default RbtDrama;