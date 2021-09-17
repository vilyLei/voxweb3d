
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
import Matrix4 from "../vox/math/Matrix4";
import CameraViewRay from "../vox/view/CameraViewRay";
import DisplayEntity from "../vox/entity/DisplayEntity";
import { SpaceCullingMask } from "../vox/space/SpaceCullingMask";

export class DemoCameraPath
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
        console.log("DemoCameraPath::initialize()......");
        if(this.m_rscene == null)
        {
            //DivLog.SetDebugEnabled( true );
            RendererDevice.SHADERCODE_TRACE_ENABLED = true;
            RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
            
            let rparam:RendererParam = new RendererParam();
            rparam.setAttriAntialias(!RendererDevice.IsMobileWeb());
            rparam.setCamPosition(1800.0,1800.0,1800.0);
            rparam.setCamProject(45,20.0,7000.0);
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
            plane.showDoubleFace();
            plane.uScale = 5.0;
            plane.vScale = 5.0;
            plane.initializeXOZSquare(1900.0,[this.m_texLoader.getTexByUrl("static/assets/wood_02.jpg")]);
            plane.setXYZ(0.0,-300.0,0.0);
            //this.m_rscene.addEntity(plane);

            let size: number = 2500.0;
            let disY: number = 0.5 * size;
            let box:Box3DEntity = new Box3DEntity();
            box.spaceCullMask = SpaceCullingMask.NONE;
            box.uScale = 4.0;
            box.vScale = 4.0;
            //metal_08
            box.showFrontFace();
            box.initialize(new Vector3D(-size,-size * 0.5,-size), new Vector3D(size,size * 0.7,size),[this.m_texLoader.getTexByUrl("static/assets/brickwall_big.jpg")]);
            box.setXYZ(0.0,0.0,0.0);
            this.m_rscene.addEntity(box);
            
            //*/

            this.m_rscene.enableMouseEvent(true);
            this.m_cameraZoomController.bindCamera(this.m_rscene.getCamera());
            this.m_cameraZoomController.initialize(this.m_rscene.getStage3D());
            this.m_stageDragCtrl.initialize(this.m_rscene.getStage3D(), this.m_rscene.getCamera());
            this.m_cameraZoomController.setLookAtCtrlEnabled(false);

            this.update();
            
            //  this.initTest01();
            //  this.initPathAct();

            this.initTest02();
        }
    }
    private m_ls: Line3DEntity = new Line3DEntity();
    private initTest02(): void {

        this.m_ls = new Line3DEntity();
        this.m_ls.initialize(new Vector3D(), new Vector3D(100,500.0,700.0));
        this.m_rscene.addEntity( this.m_ls );

        let axis:Axis3DEntity = new Axis3DEntity();
        axis.initialize(300.0);
        this.m_rscene.addEntity( axis );

        let direcEndV: Vector3D = new Vector3D(100,0.0,0.0);
        let pv: Vector3D = new Vector3D(30,30,50);
        direcEndV.addBy(pv);
        let ls_0: Line3DEntity = new Line3DEntity();
        ls_0.initialize(pv, direcEndV);
        //ls_0.setPosition(pv);
        this.m_rscene.addEntity( ls_0 );

        let mat1: Matrix4 = new Matrix4();
        mat1.rotationZ(MathConst.DegreeToRadian(45));
        mat1.appendRotationY(MathConst.DegreeToRadian(-45));

        
        // construct camera z axis
        let lookLinePos: Vector3D = new Vector3D(300,0.0,0.0);
        mat1.transformVectorSelf(lookLinePos);
        lookLinePos.addBy( pv );
        let ls_src0: Line3DEntity = new Line3DEntity();
        ls_src0.color.setRGB3f(1.0,0.0,1.0);
        ls_src0.initialize(pv, lookLinePos);
        //ls_src0.setPosition(pv);
        this.m_rscene.addEntity( ls_src0 );

        // construct camera up axis
        let src_pos1: Vector3D = new Vector3D(0,100.0,0.0);
        let src_pos1Mat: Matrix4 = new Matrix4();
        //src_pos1Mat.rotationX(MathConst.DegreeToRadian(-90));
        //console.log("src_pos1 A: ",src_pos1);
        src_pos1Mat.transformVectorSelf(src_pos1);
        //console.log("src_pos1 B: ",src_pos1);

        mat1.transformVectorSelf(src_pos1);
        let ls_src1: Line3DEntity = new Line3DEntity();
        ls_src1.color.setRGB3f(0.0,1.0,1.0);
        ls_src1.initialize(new Vector3D(), src_pos1);
        ls_src1.setPosition(pv);
        this.m_rscene.addEntity( ls_src1 );

        let lookAtV: Vector3D = new Vector3D();
        lookAtV.addVecsTo(pv, lookLinePos);

        src_pos1.normalize();
        let camera: CameraBase = new CameraBase();
        camera.lookAtRH(pv, lookAtV, src_pos1);
        camera.perspectiveRH(MathConst.DegreeToRadian(45), 800/600, 80,500);
        camera.update();

        let frustumFrame: FrustrumFrame3DEntity = new FrustrumFrame3DEntity();
        frustumFrame.initiazlize( camera );
        this.m_rscene.addEntity(frustumFrame);
    }
    private initTest01(): void {

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
    private initPathAct(): void {

        let axis: Axis3DEntity = new Axis3DEntity();
        axis.initializeCross(70.0);
        this.m_rscene.addEntity( axis );
        this.m_pathRole = axis;
        //return;
        let posList: Vector3D[] = [
            new Vector3D( 72.13681306524768,0, 27.767672487209893),
            new Vector3D( 232.57540440645494, 0, 70.43368422643721),
            new Vector3D( 349.5954994160545, 0, 249.1118245856153),
            new Vector3D( 469.0805206640016, 0, 506.1222026231883),
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

        //  this.m_camView.setCamera( this.m_rscene.getCamera() );

        this.m_moveAction.cameraFollower.setCameraView(this.m_camView);
        this.m_moveAction.bindTarget(this.m_pathRole);
        this.m_moveAction.setPathPosList(posList, true);
    }
    private m_temV: Vector3D = new Vector3D();
    private m_tem2V: Vector3D = new Vector3D();
    private m_camTypeFlag: boolean = true;
    private switchCamera(): void {
        
        if(this.m_camTypeFlag) {
            this.m_camView.setCamera( this.m_rscene.getCamera() );
        }
        else {
            this.m_camView.setCamera( this.m_cameraTarget );
        }
        this.m_camTypeFlag = !this.m_camTypeFlag;
    }
    private mouseDown(evt:any):void
    {
        if(this.m_camView != null) {
            this.switchCamera();
        }

        this.m_viewRay.intersectPiane();
        let pv:Vector3D = this.m_viewRay.position;
        //console.log(pv.x+",",pv.y+","+pv.z);
        if(this.m_ls != null) {
            this.m_ls.setPosAt(1,pv);
            this.m_ls.updateMeshToGpu();
        }
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
        this.m_timeoutId = setTimeout(this.update.bind(this),25);// 20 fps

        this.m_statusDisp.render();
    }

    private m_pv: Vector3D = new Vector3D();

    run():void
    {
        if(this.m_slideFlag) {
            //this.m_rscene.getCamera().slideViewOffsetXY(0.0,1.0);
        }
        this.m_statusDisp.update(false);

        this.m_stageDragCtrl.runWithYAxis();
        this.m_cameraZoomController.run(null,30.0);

        if(this.m_camView != null) {
            this.m_moveAction.run();
            if(this.m_camFrame != null) {
                this.m_camFrame.updateFrame( this.m_camView.getCamera() );
                this.m_camFrame.updateMeshToGpu();
            }
        }

        //this.m_rscene.useCamera(this.m_cameraTarget);
        this.m_rscene.run();
        //this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
    }
}

export default DemoCameraPath;