
import RendererDevice from "../vox/render/RendererDevice";
import RendererParam from "../vox/scene/RendererParam";
import RendererState from "../vox/render/RendererState";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";
import Axis3DEntity from "../vox/entity/Axis3DEntity";
import Plane3DEntity from "../vox/entity/Plane3DEntity";
import Box3DEntity from "../vox/entity/Box3DEntity";
import Sphere3DEntity from "../vox/entity/Sphere3DEntity";

import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import MouseEvent from "../vox/event/MouseEvent";
import KeyboardEvent from "../vox/event/KeyboardEvent";
import CameraTrack from "../vox/view/CameraTrack";
import RendererScene from "../vox/scene/RendererScene";
import BaseColorMaterial from "../vox/material/mcase/BaseColorMaterial";

import CameraDragController from "../voxeditor/control/CameraDragController";
import CameraZoomController from "../voxeditor/control/CameraZoomController";
import Vector3D from "../vox/math/Vector3D";
import FrustrumFrame3DEntity from "../vox/entity/FrustrumFrame3DEntity";
import CameraBase from "../vox/view/CameraBase";
import {RHCameraView} from "../vox/view/RHCameraView";
import MathConst from "../vox/math/MathConst";
import DivLog from "../vox/utils/DivLog";
import Line3DEntity from "../vox/entity/Line3DEntity";
import {PathMotionAction} from "./scene/PathMotionAction";
import CameraViewRay from "../vox/view/CameraViewRay";
import DisplayEntity from "../vox/entity/DisplayEntity";
import { SpaceCullingMask } from "../vox/space/SpaceCullingMask";

import BinaryLoader from "../vox/assets/BinaryLoader";
import { RoadPathData, RoadFile } from "../app/easyroad/io/RoadFile";
import TextureProxy from "../vox/texture/TextureProxy";
import DataMesh from "../vox/mesh/DataMesh";

export class DemoCameraMotion
{
    constructor(){}
    private m_rscene:RendererScene = null;
    private m_camTrack:CameraTrack = null;
    private m_statusDisp:RenderStatusDisplay = new RenderStatusDisplay();
    private m_texLoader:ImageTextureLoader = null;
    private m_runType:number = 0;
    private m_stageDragCtrl: CameraDragController = new CameraDragController();
    private m_cameraZoomController: CameraZoomController = new CameraZoomController();

    private m_viewRay:CameraViewRay = new CameraViewRay();
    initialize():void
    {
        console.log("DemoCameraMotion::initialize()......");
        if(this.m_rscene == null)
        {
            //DivLog.SetDebugEnabled( true );
            RendererDevice.SHADERCODE_TRACE_ENABLED = true;
            RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
            
            let rparam:RendererParam = new RendererParam();
            rparam.setAttriAntialias(!RendererDevice.IsMobileWeb());
            rparam.setCamPosition(1800.0,1800.0,1800.0);
            rparam.setCamProject(45,20.0,9000.0);
            this.m_rscene = new RendererScene();
            this.m_rscene.initialize(rparam,3);
            this.m_rscene.updateCamera();

            this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);
            
            this.m_camTrack = new CameraTrack();
            this.m_camTrack.bindCamera(this.m_rscene.getCamera());
            this.m_statusDisp.initialize();
            this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this,this.mouseDown);
            this.m_rscene.addEventListener(KeyboardEvent.KEY_DOWN, this,this.keyDown);
            
            this.m_viewRay.bindCameraAndStage(this.m_rscene.getCamera(), this.m_rscene.getStage3D());
            this.m_viewRay.setPlaneParam(new Vector3D(0.0,1.0,0.0),0.0);
            //this.m_rscene.getRenderProxy().setFrontFaceFlipped(true);
            ///*
            //  let axis:Axis3DEntity = new Axis3DEntity();
            //  axis.initialize(300.0);
            //  this.m_rscene.addEntity(axis);

            let plane:Plane3DEntity = new Plane3DEntity();
            plane.uScale = 5.0;
            plane.vScale = 5.0;
            plane.initializeXOZSquare(1900.0,[this.m_texLoader.getTexByUrl("static/assets/wood_02.jpg")]);
            plane.setXYZ(0.0,-300.0,0.0);
            this.m_rscene.addEntity(plane);

            let size: number = 3700.0;
            let disY: number = 0.5 * size;
            let box:Box3DEntity = new Box3DEntity();
            box.spaceCullMask = SpaceCullingMask.NONE;
            box.uScale = 4.0;
            box.vScale = 4.0;
            //metal_08
            box.showFrontFace();
            box.initialize(new Vector3D(-size,-size * 0.5,-size), new Vector3D(size,size * 1.5,size),[this.m_texLoader.getTexByUrl("static/assets/brickwall_big.jpg")]);
            box.setXYZ(0.0,0.0,0.0);
            this.m_rscene.addEntity(box);
            
            //*/
            /*
            let box:Box3DEntity = new Box3DEntity();
            box.initializeCube(200.0,[this.m_texLoader.getTexByUrl("static/assets/default.jpg")]);
            this.m_rscene.addEntity(box,1);
            //*/

            this.m_rscene.enableMouseEvent(true);
            this.m_cameraZoomController.bindCamera(this.m_rscene.getCamera());
            this.m_cameraZoomController.initialize(this.m_rscene.getStage3D());
            this.m_stageDragCtrl.initialize(this.m_rscene.getStage3D(), this.m_rscene.getCamera());
            this.m_cameraZoomController.setLookAtCtrlEnabled(false);

            this.update();
            
            this.loadRoadData();
            return;
            this.initCamera();
            this.initPathAct();
        }
    }
    private m_roadData: RoadPathData = null;
    private loadRoadData(): void {

        let loader: BinaryLoader = new BinaryLoader();
        loader.uuid = "road_vrd";
        loader.load("static/assets/scene/pathData_02.vrd", this);
    }
    
    loaded(buffer: ArrayBuffer, uuid: string): void {
        console.log("loaded the road data.");
        let roadFile: RoadFile = new RoadFile();
        this.m_roadData = roadFile.parsePathDataFromFileBuffer(new Uint8Array(buffer));
        console.log("roadData: ",this.m_roadData);

        this.buildRoadEntity();
    }
    loadError(status: number, uuid: string): void {

    }
    private buildRoadEntity(): void {
        
        let tex: TextureProxy = this.m_texLoader.getTexByUrl("static/assets/roadSurface04.jpg");
        let mplane: Plane3DEntity = new Plane3DEntity();
        //mplane.initializeXOYSquare(50, [this.m_engine.texLoader.getTexByUrl("static/assets/roadSurface01.jpg")]);
        mplane.initializeXOYSquare(50, [tex]);
        let mesh: DataMesh = new DataMesh();
        mesh.vs = this.m_roadData.vs;
        mesh.uvs = this.m_roadData.uvs;
        mesh.ivs = this.m_roadData.ivs;
        mesh.setBufSortFormat( mplane.getMaterial().getBufSortFormat() );
        mesh.initialize();

        let surfaceEntity: DisplayEntity = new DisplayEntity();
        surfaceEntity.setMesh( mesh );
        surfaceEntity.setMaterial( mplane.getMaterial() );
        this.m_rscene.addEntity(surfaceEntity);

        
        this.initCamera();
        this.initPathAct(this.m_roadData.pathPosList);
        
    }
    private initCamera(): void {

        let pos: Vector3D = new Vector3D(-500,300,0);
        
        let camView: RHCameraView = new RHCameraView();
        camView.setPosition(pos);
        camView.update();
        this.m_camView = camView;
        let camera2: CameraBase = new CameraBase();
        camera2.setViewMatrix(camView.getViewMatrix());
        camera2.perspectiveRH(MathConst.DegreeToRadian(45), 800/600, 80,500);
        camera2.update();
        
        let frustumFrame2: FrustrumFrame3DEntity = new FrustrumFrame3DEntity();
        frustumFrame2.initiazlize( camera2 );
        this.m_rscene.addEntity(frustumFrame2);

        this.m_cameraTarget = camera2;
        this.m_camFrame = frustumFrame2;
        this.m_camView.setCamera( this.m_cameraTarget );
    }
    private m_slideFlag: boolean = false;
    //
    private m_camView: RHCameraView = null;
    private m_cameraTarget: CameraBase = null;
    private m_camFrame: FrustrumFrame3DEntity = null;
    private m_pathRole: DisplayEntity = null;
    private m_moveAction: PathMotionAction = new PathMotionAction();
    private initPathAct(posList: Vector3D[] = null): void {

        let axis: Axis3DEntity = new Axis3DEntity();
        axis.initializeCross(70.0);
        this.m_rscene.addEntity( axis );
        this.m_pathRole = axis;
        
        if(posList == null) {
            posList = [
                new Vector3D( 72.13681306524768,0, 27.767672487209893),
                new Vector3D( 232.57540440645494, 0, 70.43368422643721),
                new Vector3D( 349.5954994160545, 0, 249.1118245856153),
                new Vector3D( 469.0805206640016, 0, 506.1222026231883),
                new Vector3D( 726.1962941671513, 0,952.0773283474781),
                new Vector3D( 797.282565704728, 0,957.4895012832981),
                new Vector3D( 886.988563966599, 0,906.612424665302),
                new Vector3D( 959.193382823809, 0,799.1431026228652),
                new Vector3D( 1002.9603798633241, 0,635.8523626329904),
                new Vector3D( 925.7715755056693, 0,522.56229219789),
                new Vector3D( 751.6705041578543, 0,396.85277546175894),
                new Vector3D( 485.7543244927572, 0,379.48625494810153),
                new Vector3D( 175.64026123332633, 0,481.229817314442),
                new Vector3D( 84.24498287944061, 0,566.1330588516862),
                new Vector3D( -34.07380417008335, 0,704.0486518930372),
                new Vector3D( -100.62421233657756, 0,829.0974507141026),
                new Vector3D( -169.17457754402494, 0,902.3925779858835),
                new Vector3D( -268.674786630811, 0,940.5287682590804),
                new Vector3D( -338.2053026173978, 0,905.7625526827653),
                new Vector3D( -391.53719551871154, 0,840.8612850793324),
                new Vector3D( -391.66407835711743, 0,746.2275974006964),
                new Vector3D( -432.8957923948808, 0,667.3725334709904),
                new Vector3D( -405.75470117828195, 0,494.0844385137923),
                new Vector3D( -415.09131983068073, 0,416.58967648035605),
                new Vector3D( -399.0999233442824, 0,232.400979310288),
                new Vector3D( -386.3711609536929, 0,71.00287704532411),
                new Vector3D( -389.3674265096629, 0,-84.03999101794761),
                new Vector3D( -305.5318818950261, 0,-264.3926193617656),
                new Vector3D( -215.93783387524513, 0,-335.41016026158377),
                new Vector3D( -27.871917976013947, 0,-364.9410411045287),
                new Vector3D( 127.75878095653206, 0,-378.1144673662734),
                new Vector3D( 267.35067660028494, 0,-380.2834737923422),
                new Vector3D( 425.22150173395266, 0,-355.6636192834526),
                new Vector3D( 502.7277634189411, 0,-350.6417982930757),
                new Vector3D( 638.2887470397126, 0,-312.17181651928104),
                new Vector3D( 735.3762145812532, 0,-245.52681228216397),
                new Vector3D( 787.4757858296327, 0,-145.21537522179688),
                new Vector3D( 799.1580428901602, 0,-39.610758195229664),
                new Vector3D( 815.6961859265716, 0,43.95180160799532),
                new Vector3D( 816.4167746077171, 0,89.29229223297352),
                new Vector3D( 784.1597197739072, 0,147.72601461284648),
                new Vector3D( 793.5147466678391, 0,207.2704045083476),
                new Vector3D( 825.3509903063741, 0,254.2688982492782),
                new Vector3D( 883.4564347189822, 0,276.1537675979389),
                new Vector3D( 938.0518532676846, 0,294.61644742553995)
            ];
            let pv: Vector3D;
            let degree: number;
            for(let i: number = 0; i < posList.length; ++i) {
                pv = posList[i];
                let cross: Axis3DEntity = new Axis3DEntity();
                cross.initializeCorssSizeXYZ(50,10,50);
                cross.setXYZ( pv.x, pv.y, pv.z );
                if(i == 0) {
                    this.m_temV.subVecsTo(posList[i+1], posList[i]);
                }
                else if(i < (posList.length - 1)) {
                    this.m_temV.subVecsTo(posList[i], posList[i-1]);
                    this.m_tem2V.subVecsTo(posList[i+1], posList[i]);
                    this.m_temV.addBy(this.m_tem2V);
                }
                else {
                    this.m_temV.subVecsTo(posList[i-1], posList[i]);
                }
                degree =  360 - MathConst.GetDegreeByXY(this.m_temV.x,this.m_temV.z);
                cross.setRotationXYZ(0, degree, 0);
                this.m_rscene.addEntity( cross );
            }
        }

        //  this.m_camView.setCamera( this.m_rscene.getCamera() );

        this.m_moveAction.cameraFollower.setCameraView(this.m_camView);
        this.m_moveAction.bindTarget(this.m_pathRole);
        this.m_moveAction.setPathPosList(posList, true);
    }
    private m_temV: Vector3D = new Vector3D();
    private m_tem2V: Vector3D = new Vector3D();
    private m_camTypeFlag: boolean = true;
    private switchCamera(): void {
        if(this.m_camView != null) {
            if(this.m_camTypeFlag) {
                this.m_camView.setCamera( this.m_rscene.getCamera() );
            }
            else {
                this.m_camView.setCamera( this.m_cameraTarget );
            }
            this.m_camTypeFlag = !this.m_camTypeFlag;
        }
    }
    private mouseDown(evt:any):void
    {
        this.switchCamera();
        
        this.m_viewRay.intersectPlane();
        let pv:Vector3D = this.m_viewRay.position;
        //console.log(pv.x+",",pv.y+","+pv.z);
        
    }
    private keyDown(evt:any):void
    {
        this.m_slideFlag = !this.m_slideFlag;
        if(this.m_slideFlag) {
            this.m_stageDragCtrl.enableSlide();
        }
        else {
            this.m_stageDragCtrl.enableSwing();
        }
    }
    
    private m_timeoutId:any = -1;
    private update():void
    {
        if(this.m_timeoutId > -1)
        {
            clearTimeout(this.m_timeoutId);
        }
        //this.m_timeoutId = setTimeout(this.update.bind(this),16);// 60 fps
        this.m_timeoutId = setTimeout(this.update.bind(this),30);// 20 fps

        this.m_stageDragCtrl.runWithYAxis();
        this.m_cameraZoomController.run(null,30.0);
        this.m_statusDisp.render();
    }

    private m_pv: Vector3D = new Vector3D();

    run():void
    {
        if(this.m_slideFlag) {
            //this.m_rscene.getCamera().slideViewOffsetXY(0.0,1.0);
        }
        this.m_statusDisp.update(false);
        if(this.m_camFrame != null) {
            this.m_moveAction.run();
            this.m_camFrame.updateFrame( this.m_camView.getCamera() );
            this.m_camFrame.updateMeshToGpu();    
        }
        this.m_rscene.run();
    }
}

export default DemoCameraMotion;