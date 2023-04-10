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
import CameraTrack from "../vox/view/CameraTrack";
import RendererScene from "../vox/scene/RendererScene";

import { UserInteraction } from "../vox/engine/UserInteraction";
import Billboard3DEntity from "../vox/entity/Billboard3DEntity";

export class DemoGLState {

    constructor() { }
    private m_rscene: RendererScene = null;
    private m_statusDisp: RenderStatusDisplay = new RenderStatusDisplay();
    private m_texLoader: ImageTextureLoader = null;
    private m_interacion: UserInteraction = new UserInteraction();
    private m_runType: number = 0;
    initialize(): void {
        console.log("DemoGLState::initialize()......");
        if (this.m_rscene == null) {
            RendererDevice.SHADERCODE_TRACE_ENABLED = true;
            RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;

            let rparam: RendererParam = new RendererParam();
            rparam.setAttriAntialias(true);
            rparam.setPolygonOffsetEanbled(true);
            rparam.setCamPosition(800.0, 800.0, 800.0);
            this.m_rscene = new RendererScene();
            this.m_rscene.initialize(rparam, 3);
            this.m_rscene.updateCamera();

            this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);

            this.m_statusDisp.initialize();
            this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);
            this.m_interacion.initialize( this.m_rscene );
            //this.m_rscene.getRenderProxy().setFrontFaceFlipped(true);
            ///*
            let axis: Axis3DEntity = new Axis3DEntity();
            axis.initialize(300.0);
            this.m_rscene.addEntity(axis);

            let plane: Plane3DEntity = new Plane3DEntity();
            plane.initializeXOZSquare(900.0, [this.m_texLoader.getTexByUrl("static/assets/wood_02.jpg")]);
            plane.showDoubleFace();
            plane.setXYZ(0.0, -200.0, 0.0);
            this.m_rscene.addEntity(plane);
            //*/
            /*
            let box:Box3DEntity = new Box3DEntity();
            box.initializeCube(200.0,[this.m_texLoader.getTexByUrl("static/assets/default.jpg")]);
            this.m_rscene.addEntity(box,1);
            //*/

            //this.m_runType = 2;
            this.initPolygonOffsetTest();
            //this.initBlendTest();
            this.update();
        }
    }
    private initPolygonOffsetTest(): void {
        this.m_runType = 3;
        let plane: Plane3DEntity;

        // plane = new Plane3DEntity();
        // plane.initializeYOZ(-50.0, -50.0, 100.0, 100.0, [this.m_texLoader.getTexByUrl("static/assets/partile_tex_001.jpg")]);
        // plane.toBrightnessBlend();
        // plane.setXYZ(400.0,-190.0,0.0);
        // plane.getMaterial().setPolygonOffset(0.0, 0);
        // //this.m_rscene.addEntity(plane, 1);

        // plane = new Plane3DEntity();
        // plane.initializeYOZ(-50.0, -50.0, 100.0, 100.0, [this.m_texLoader.getTexByUrl("static/assets/partile_tex_001.jpg")]);
        // plane.toBrightnessBlend();
        // plane.setXYZ(-100.0,-190.0,0.0);
        // plane.getMaterial().setPolygonOffset(-130.0, 0);
        // this.m_rscene.addEntity(plane, 2);

        let bill: Billboard3DEntity;
        bill = new Billboard3DEntity();
        bill.initialize(100,100,[this.m_texLoader.getTexByUrl("static/assets/flare_core_02.jpg")]);
        bill.setXYZ(170.0,-190.0,0.0);
        bill.getMaterial().setDepthOffset(-0.4);
        this.m_rscene.addEntity(bill, 1);

        bill = new Billboard3DEntity();
        bill.initialize(100,100,[this.m_texLoader.getTexByUrl("static/assets/flare_core_02.jpg")]);
        bill.setXYZ(220.0,-190.0,0.0);
        this.m_rscene.addEntity(bill, 2);

        
        //this.m_rscene.getRenderProxy().setPolygonOffset(30.0, 0.0);
    }
    private step(edge: number, value: number): number {
        return value < edge ? 0.0 : 1.0;
    }
    private m_flag: boolean = true;
    private mouseDown(evt: any): void {
        this.m_flag = true;
    }
    private m_timeoutId: any = -1;
    private update(): void {
        if (this.m_timeoutId > -1) {
            clearTimeout(this.m_timeoutId);
        }
        //this.m_timeoutId = setTimeout(this.update.bind(this),16);// 60 fps
        this.m_timeoutId = setTimeout(this.update.bind(this), 50);// 20 fps

        this.m_statusDisp.render();
    }
    run(): void {
        // if(this.m_flag) {
        //     this.m_flag = false;
        // }
        // else {
        //     return;
        // }
        //console.log("run start...");

        this.m_statusDisp.update(false);
        this.m_interacion.run();

        switch (this.m_runType) {
            case 1:
                this.runBlend();
                break;
            case 2:
                this.runPolygonOffset();
                break;
            case 3:
                this.runPolygonOffset2();
                break;
            default:
                this.runBase();
                break;
        }
    }
    private m_target: Sphere3DEntity = null;
    private initBlendTest(): void {

        let sphere: Sphere3DEntity = new Sphere3DEntity();
        //sphere.doubleTriFaceEnabled = true;
        //sphere.setRenderState(RendererState.FRONT_CULLFACE_NORMAL_STATE);
        //sphere.setRenderState(RendererState.NONE_CULLFACE_NORMAL_STATE);
        sphere.initialize(100, 30, 30, [this.m_texLoader.getTexByUrl("static/assets/default.jpg")]);
        //sphere.setIvsParam(300,30);
        sphere.setScaleXYZ(1.4, 1.4, 1.4);
        this.m_rscene.addEntity(sphere, 1);
        //return;
        this.m_runType = 1;
        this.m_target = sphere;
        //color_02
        sphere = new Sphere3DEntity();
        sphere.copyMeshFrom(this.m_target);
        sphere.setRenderState(RendererState.FRONT_CULLFACE_NORMAL_STATE);
        sphere.initialize(100, 10, 10, [this.m_texLoader.getTexByUrl("static/assets/color_02.jpg")]);
        //sphere.initializeFrom(this.m_target, [this.m_texLoader.getTexByUrl("static/assets/color_02.jpg")]);
        sphere.setScaleXYZ(0.4, 0.4, 0.4);
        sphere.setXYZ(-80.0, 50.0, 0.0);
        //sphere.setIvsParam(300,30);
        this.m_rscene.addEntity(sphere, 1);
    }
    private runBlend(): void {
        this.m_rscene.update();
        this.m_rscene.runBegin();
        this.m_rscene.runAt(0);
        let ivsIndex: number = this.m_target.getIvsIndex();
        let ivsCount: number = this.m_target.getIvsCount();
        ///*
        // this.m_target.setIvsParam(2700, 500);
        (this.m_target.getMaterial() as any).setAlpha(1.0);
        this.m_target.setRenderState(RendererState.NONE_CULLFACE_NORMAL_STATE);
        this.m_rscene.runAt(1);

        (this.m_target.getMaterial() as any).setAlpha(0.3);
        this.m_target.setRenderState(RendererState.NONE_TRANSPARENT_ALWAYS_STATE);
        this.m_rscene.drawEntity(this.m_target);
        //*/
        // this.m_target.setIvsParam(ivsIndex, ivsCount);

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

        //this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
    }

    private runPolygonOffset(): void {
        this.m_rscene.update();
        this.m_rscene.runBegin();
        this.m_rscene.getRenderProxy().setPolygonOffset(0.0, 0.0);
        this.m_rscene.runAt(0);
        this.m_rscene.getRenderProxy().setPolygonOffset(-70, 1);
        this.m_rscene.runAt(1);
    }
    private runPolygonOffset2(): void {
        
        this.m_rscene.update();
        this.m_rscene.runBegin();
        this.m_rscene.runAt(0);
        this.m_rscene.runAt(1);
        this.m_rscene.runAt(2);
    }
    private runBase(): void {
        this.m_rscene.run();
    }
}

export default DemoGLState;