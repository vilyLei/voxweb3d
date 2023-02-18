import Vector3D from "../vox/math/Vector3D";
import RendererDevice from "../vox/render/RendererDevice";
import RendererState from "../vox/render/RendererState";
import RendererParam from "../vox/scene/RendererParam";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";
import MouseEvent from "../vox/event/MouseEvent";
import Plane3DEntity from "../vox/entity/Plane3DEntity";
import Axis3DEntity from "../vox/entity/Axis3DEntity";
import Sphere3DEntity from "../vox/entity/Sphere3DEntity";
import TextureProxy from "../vox/texture/TextureProxy";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import CameraTrack from "../vox/view/CameraTrack";
import { ScreenRectMaterial } from "./material/ScreenRectMaterial";
import RendererScene from "../vox/scene/RendererScene";

export class DemoSphScreenRect {
    constructor() {
    }
    
    private m_rscene: RendererScene = null;
    
    private m_texLoader: ImageTextureLoader;
    private m_camTrack: CameraTrack = null;
    private m_statusDisp: RenderStatusDisplay = new RenderStatusDisplay();
    
    private m_rectPlane: Plane3DEntity = null;
    private m_sph: Sphere3DEntity = null;
    private m_radius: number = 250.0;
    initialize(): void {
        console.log("DemoSphScreenRect::initialize()......");

        if (this.m_rscene == null) {
            RendererDevice.SHADERCODE_TRACE_ENABLED = true;

            this.m_statusDisp.initialize();
            let rparam: RendererParam = new RendererParam();
            rparam.setCamProject(45.0, 0.1, 3000.0);
            rparam.setCamPosition(1500.0, 1500.0, 1500.0);

            this.m_rscene = new RendererScene();
            this.m_rscene.initialize(rparam, 3);

            this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);
            let tex0: TextureProxy = this.m_texLoader.getImageTexByUrl("static/assets/default.jpg");
            let tex1: TextureProxy = this.m_texLoader.getImageTexByUrl("static/assets/broken_iron.jpg");
            let tex2: TextureProxy = this.m_texLoader.getImageTexByUrl("static/assets/guangyun_H_0007.png");
            let tex3: TextureProxy = this.m_texLoader.getImageTexByUrl("static/assets/flare_core_02.jpg");
            
            
            this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDownListener);

            this.m_camTrack = new CameraTrack();
            this.m_camTrack.bindCamera(this.m_rscene.getCamera());

            let i: number = 0;
            ///*
            
            let rectMaterial: ScreenRectMaterial = new ScreenRectMaterial();
            rectMaterial.setRGBA4f(0.1, 0.0, 0.2, 1.0);
            let rectPlane: Plane3DEntity = new Plane3DEntity();
            rectPlane.setRenderState(RendererState.BACK_TRANSPARENT_ALWAYS_STATE);
            rectPlane.setMaterial(rectMaterial);
            rectPlane.initializeXOY(-1.0, -1.0, 2.0, 2.0);
            this.m_rscene.addEntity(rectPlane, 0);

            let stage = this.m_rscene.getStage3D();

            let axis: Axis3DEntity = new Axis3DEntity();
            axis.uuid = "axis";
            axis.initialize(300.0);
            this.m_rscene.addEntity(axis);
            let pv: Vector3D = new Vector3D();
            let outV: Vector3D = new Vector3D();
            let radius: number = this.m_radius;
            for (i = 0; i < 1; ++i) {
                let sphere: Sphere3DEntity = new Sphere3DEntity();
                sphere.initialize(250.0, 15, 15, [tex1]);
                //pv.setXYZ(Math.random() * 600.0 - 300.0,Math.random() * 600.0 - 300.0,Math.random() * 600.0 - 300.0);
                pv.setXYZ(Math.random() * 1600.0 - 800.0, Math.random() * 1600.0 - 800.0, Math.random() * 1600.0 - 800.0);
                //pv.scaleBy(1.5);
                sphere.setPosition(pv);
                this.m_rscene.addEntity(sphere, 1);
                this.m_sph = sphere;
            }
            rectMaterial = new ScreenRectMaterial();
            rectMaterial.setRGBA4f(1.0, 1.0, 1.0, 0.5);
            rectPlane = new Plane3DEntity();
            rectPlane.setRenderState(RendererState.BACK_TRANSPARENT_ALWAYS_STATE);
            rectPlane.setMaterial(rectMaterial);
            rectPlane.initializeXOY(-0.5, -0.5, 1.0, 1.0);
            this.m_rscene.addEntity(rectPlane, 2);
            //rectPlane.setXYZ(0.3,0.2,0.0);
            let k: number = stage.stageHalfWidth / stage.stageHalfHeight;
            this.m_rscene.getCamera().calcScreenRectByWorldSphere(pv, radius + 30.0, outV);
            //outV.z *= ;
            //outV.w *= camera.getZFar;
            rectPlane.setXYZ(outV.x + outV.z * 0.5, outV.y + outV.w * 0.5, 0.0);
            rectPlane.setScaleXYZ(outV.z * k, outV.w, 1.0);

            this.m_rectPlane = rectPlane;
        }
    }
    mouseDownListener(evt: any): void {
        let outV: Vector3D = new Vector3D();
        let scale: number = Math.random() * 0.8 + 0.8;
        console.log("mouseUpListener call, this.m_rscene: " + this.m_rscene.toString());
        let pv: Vector3D = new Vector3D();
        //pv.setXYZ(Math.random() * 1600.0 - 800.0,Math.random() * 1600.0 - 800.0,Math.random() * 1600.0 - 800.0);
        pv.setXYZ(Math.random() * 2200.0 - 1100.0, Math.random() * 2200.0 - 1100.0, Math.random() * 2200.0 - 1100.0);
        this.m_sph.setScaleXYZ(scale, scale, scale);
        this.m_sph.setPosition(pv);
        this.m_sph.update();

        let stage = this.m_rscene.getStage3D();
        let camera = this.m_rscene.getCamera();

        let persK: number = camera.getViewFieldZoom() * camera.getAspect();
        console.log("getViewFieldZoom: " + camera.getViewFieldZoom() + ", getAspect: " + camera.getAspect());
        console.log("persK: " + persK + ", 1.0/persK: " + (1.0 / persK));
        let radius: number = this.m_radius * scale;
        let k: number = 0.5 * camera.getViewFieldZoom() * (stage.stageHalfWidth - stage.stageHalfHeight);
        k = (stage.stageHalfWidth - k) / stage.stageHalfHeight;

        camera.calcScreenRectByWorldSphere(pv, radius, outV);
        //camera.calcScreenRectByWorldSphere(pv,radius,outV);
        //outV.z *= 1.05;
        //outV.w *= 1.05;
        this.m_rectPlane.setXYZ(outV.x + outV.z * 0.5, outV.y + outV.w * 0.5, 0.0);
        //this.m_rectPlane.setScaleXYZ(outV.z * k, outV.w,1.0);
        this.m_rectPlane.setScaleXYZ(outV.z, outV.w, 1.0);
        this.m_rectPlane.update();
    }
    run(): void {

        this.m_statusDisp.update(true);

        // 使用1/4窗口尺寸
        //this.m_rcontext.setViewPort(0,0,Math.round(stage.stageHalfWidth),Math.round(stage.stageHalfHeight));
        this.m_rscene.run();

        //this.m_camTrack.rotationOffsetAngleWorldY(-0.2);;
        this.m_rscene.updateCamera();
    }
}
export default DemoSphScreenRect;