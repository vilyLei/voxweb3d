
import MathConst from "../vox/math/MathConst";
import Vector3D from "../vox/math/Vector3D";
import RendererDevice from "../vox/render/RendererDevice";
import RendererParam from "../vox/scene/RendererParam";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";

import VtxBufConst from "../vox/mesh/VtxBufConst";
import Box3DMesh from "../vox/mesh/Box3DMesh";
import DisplayEntity from "../vox/entity/DisplayEntity";
import Plane3DEntity from "../vox/entity/Plane3DEntity";
import Box3DEntity from "../vox/entity/Box3DEntity";
import Axis3DEntity from "../vox/entity/Axis3DEntity";
import { TextureConst, TextureFormat, TextureDataType, TextureTarget } from "../vox/texture/TextureConst";
import TextureProxy from "../vox/texture/TextureProxy";
import ImageTextureProxy from "../vox/texture/ImageTextureProxy";

import MouseEvent from "../vox/event/MouseEvent";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import CameraTrack from "../vox/view/CameraTrack";
import RendererScene from "../vox/scene/RendererScene";
import ProfileInstance from "../voxprofile/entity/ProfileInstance";
import Plane from "../vox/geom/Plane";
import DirectXZModule from "../voxmotion/primitive/DirectXZModule";
import {CurveMotionXZModule} from "../voxmotion/primitive/CurveMotionXZModule";
import Line3DEntity from "../vox/entity/Line3DEntity";


export class DemoMotion {
    constructor() { }

    private m_rscene: RendererScene = null;
    private m_texLoader: ImageTextureLoader = null;
    private m_camTrack: CameraTrack = null;
    private m_statusDisp: RenderStatusDisplay = new RenderStatusDisplay();
    private m_profileInstance: ProfileInstance = new ProfileInstance();
    private m_targets: DisplayEntity[] = [];
    private m_target: DisplayEntity = null;
    private m_crossTarget: DisplayEntity = null;
    private m_directModule: DirectXZModule = new DirectXZModule();
    private m_curveMotion: CurveMotionXZModule = new CurveMotionXZModule();

    private getImageTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): TextureProxy {
        let ptex: TextureProxy = this.m_texLoader.getImageTexByUrl(purl);
        ptex.mipmapEnabled = mipmapEnabled;
        if (wrapRepeat) ptex.setWrap(TextureConst.WRAP_REPEAT);
        return ptex;
    }
    initialize(): void {
        console.log("DemoMotion::initialize()......");
        if (this.m_rscene == null) {
            RendererDevice.SHADERCODE_TRACE_ENABLED = false;
            RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
            //RendererDevice.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;

            let rparam: RendererParam = new RendererParam();
            rparam.setCamPosition(800.0, 800.0, 800.0);
            this.m_rscene = new RendererScene();
            this.m_rscene.initialize(rparam, 3);
            this.m_rscene.updateCamera();
            this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);

            this.m_camTrack = new CameraTrack();
            this.m_camTrack.bindCamera(this.m_rscene.getCamera());

            this.m_profileInstance.initialize(this.m_rscene.getRenderer());
            this.m_statusDisp.initialize();

            this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);

            let axis: Axis3DEntity = new Axis3DEntity();
            axis.initialize(300.0);
            this.m_rscene.addEntity(axis);

            let rangeMin: number = 0.3;
            let rangeMax: number = 0.6;
            let rangeD: number = 1.0 - rangeMax;
            let totValue: number = 20;
            for (let i: number = 0; i <= totValue; ++i) {
                let k: number = i / totValue;
                //  let a:number = Math.min(k/rangeMin,1.0);
                //  let b:number = 1.0 - Math.max((k-rangeMax)/rangeD,0.0);
                //  value  = a * b
                //  value: 
                k = Math.min(k / rangeMin, 1.0) * (1.0 - Math.max((k - rangeMax) / rangeD, 0.0));
                //console.log("i("+i+"), ",a*b);
                console.log("i(" + i + "), ", k);
            }


            let box: Box3DEntity = new Box3DEntity();
            box.initializeCube(8.0, [this.getImageTexByUrl("static/assets/default.jpg")]);
            this.m_rscene.addEntity(box);

            let cross: Axis3DEntity = new Axis3DEntity();
            cross.initializeCross(80.0, new Vector3D(30, 0, 0));
            this.m_rscene.addEntity(cross);
            this.m_crossTarget = cross;

            this.m_target = box;
            this.m_directModule.setTarget(box);
            this.m_directModule.setSpeed(2.0);
            this.m_directModule.setVelocityFactor(0.02, 0.03);
            this.m_directModule.toXZ(50, 0);

            this.m_rscene.setAutoRunningEnabled(false);

            let motion = this.m_curveMotion.motion;
            motion.setTarget(box);
            motion.setSpeed(2.0);
            motion.setVelocityFactor(0.04, 0.04);

            let posList: Vector3D[] = [new Vector3D(0.0,0.0,0.0), new Vector3D(150.0,0.0,0.0), new Vector3D(150.0,0.0,150.0), new Vector3D(200.0,0.0,150.0)];
            let line3D: Line3DEntity = new Line3DEntity();
            line3D.initializeByPosList(posList);
            this.m_rscene.addEntity(line3D);

            //let posList: Vector3D[] = [new Vector3D(50.0,0.0,0.0), new Vector3D(50.0,0.0,50.0), new Vector3D(100.0,0.0,50.0)];
            this.m_curveMotion.setPathPosList(posList);
            this.update();


        }
    }
    private m_updateId: number = 0;
    private m_currentDelta: number = 0;
    private m_previousDelta: number = 0;
    private m_fpsLimit: number = 60;

    private m_timeoutId: any = -1;

    private m_pv: Vector3D = new Vector3D();
    private m_rlpv: Vector3D = new Vector3D();
    private m_rltv: Vector3D = new Vector3D();
    private m_pnv: Vector3D = new Vector3D(0.0, 1.0, 0.0);
    private m_pdis: number = 0.0;
    private m_flag: boolean = true;;
    private mouseDown(evt: any): void {
        // this.m_rscene.getMouseXYWorldRay(this.m_rlpv, this.m_rltv);
        // Plane.IntersectionSLV2(this.m_pnv, this.m_pdis, this.m_rlpv, this.m_rltv, this.m_pv);
        // this.m_directModule.toXZ(this.m_pv.x, this.m_pv.z);
        this.m_flag = !this.m_flag;
    }
    private updateMotion(): void {

        // this.m_directModule.run();

        this.m_curveMotion.run();

        this.m_crossTarget.copyTransformFrom(this.m_target);
        this.m_crossTarget.update();
    }
    private update(): void {
        
        if (this.m_timeoutId > -1) {
            clearTimeout(this.m_timeoutId);
        }
        //this.m_timeoutId = setTimeout(this.update.bind(this),16);// 60 fps
        this.m_timeoutId = setTimeout(this.update.bind(this), 50);// 20 fps
        if(this.m_flag) {
            this.updateMotion();
        }

        this.m_rscene.update();
        this.m_statusDisp.render();
    }
    run(): void {
        this.m_currentDelta = Date.now();
        let delta: number = this.m_currentDelta - this.m_previousDelta;
        if (delta < (1000 / this.m_fpsLimit)) {
            return;
        }
        this.m_previousDelta = this.m_currentDelta;

        this.m_statusDisp.update(false);

        this.m_rscene.runBegin();
        this.m_rscene.run();
        this.m_rscene.runEnd();

        ///if(this.m_camRunning)this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
        this.m_profileInstance.run();
    }
}
export default DemoMotion;