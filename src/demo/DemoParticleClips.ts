
import MathConst from "../vox/math/MathConst";
import Vector3D from "../vox/math/Vector3D";
import RendererDevice from "../vox/render/RendererDevice";
import RendererState from "../vox/render/RendererState";
import CameraViewRay from "../vox/view/CameraViewRay";
import RendererParam from "../vox/scene/RendererParam";
import RendererScene from "../vox/scene/RendererScene";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";
import MouseEvent from "../vox/event/MouseEvent";

import Plane3DEntity from "../vox/entity/Plane3DEntity";
import Axis3DEntity from "../vox/entity/Axis3DEntity";
import Billboard3DFlowEntity from "../vox/entity/Billboard3DFlowEntity";
import TextureProxy from "../vox/texture/TextureProxy";
import TextureConst from "../vox/texture/TextureConst";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import CameraTrack from "../vox/view/CameraTrack";

export class DemoParticleClips {
    constructor() { }

    private m_rscene: RendererScene = null;
    private m_texLoader: ImageTextureLoader = null;
    private m_camTrack: CameraTrack = null;
    private m_statusDisp: RenderStatusDisplay = new RenderStatusDisplay();
    private m_axis: Axis3DEntity = null;
    private m_textures: TextureProxy[] = null;
    private m_onceClip: Billboard3DFlowEntity = null;

    private m_viewRay: CameraViewRay = new CameraViewRay();
    getImageTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): TextureProxy {
        let ptex: TextureProxy = this.m_texLoader.getImageTexByUrl(purl);
        ptex.mipmapEnabled = mipmapEnabled;
        if (wrapRepeat) ptex.setWrap(TextureConst.WRAP_REPEAT);
        return ptex;
    }

    initialize(): void {
        //4.71238898038469
        console.log("DemoParticleClips::initialize()......");
        if (this.m_rscene == null) {
            RendererDevice.SHADERCODE_TRACE_ENABLED = true;

            let rparam: RendererParam = new RendererParam();
            rparam.setAttriAlpha(false);
            rparam.setMatrix4AllocateSize(1024);
            rparam.setCamProject(45.0, 10.0, 3000.0);
            rparam.setCamPosition(1500.0, 1500.0, 1500.0);

            this.m_rscene = new RendererScene();
            this.m_rscene.initialize(rparam, 3);
            this.m_rscene.setRendererProcessParam(1, true, true);

            this.m_viewRay.bindCameraAndStage(this.m_rscene.getCamera(), this.m_rscene.getStage3D());
            this.m_viewRay.setPlaneParam(new Vector3D(0.0, 1.0, 0.0), 0.0);

            this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);
            this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDownListener);
            this.m_camTrack = new CameraTrack();
            this.m_camTrack.bindCamera(this.m_rscene.getCamera());

            this.m_statusDisp.initialize();
            ///*
            let axis: Axis3DEntity = new Axis3DEntity();
            axis.name = "axis";
            axis.initialize(100.0);
            axis.setXYZ(100.0, 0.0, 100.0);
            this.m_rscene.addEntity(axis);
            this.m_axis = axis;

            axis = new Axis3DEntity();
            axis.name = "axis";
            axis.initialize(600.0);
            this.m_rscene.addEntity(axis);

            //*/
            let textures: TextureProxy[] = [];
            textures.push(this.getImageTexByUrl("static/assets/default.jpg"));
            textures.push(this.getImageTexByUrl("static/assets/moss_04.jpg"));
            textures.push(this.getImageTexByUrl("static/assets/color_01.jpg"));
            textures.push(this.getImageTexByUrl("static/assets/partile_tex_001.jpg"));
            textures.push(this.getImageTexByUrl("static/assets/stones_02.png"));
            textures.push(this.getImageTexByUrl("static/assets/guangyun_H_0007.png"));
            textures.push(this.getImageTexByUrl("static/assets/flare_core_01.jpg"));
            //textures.push(this.getImageTexByUrl("static/assets/flare_core_02.jpg"));
            //textures.push(this.getImageTexByUrl("static/assets/a_02_c.jpg"));
            //textures.push(this.getImageTexByUrl("static/assets/testEFT4.jpg"));
            //textures.push(this.getImageTexByUrl("static/assets/testTex.png"));
            textures.push(this.getImageTexByUrl("static/assets/xulie_02_07.png"));
            //textures.push(this.getImageTexByUrl("static/assets/explode1.png"));
            //textures.push(this.getImageTexByUrl("static/assets/Lightning4.jpg"));
            this.m_textures = textures;
            ///*
            let plane: Plane3DEntity = new Plane3DEntity();
            plane.initializeXOZ(-500.0, -500.0, 1000.0, 1000.0, [textures[0]]);
            //plane.toTransparentBlend(false);
            this.m_rscene.addEntity(plane);
            let material: any = plane.getMaterial();
            material.setRGB3f(0.7, 0.7, 0.7);
            //*/
            this.update();
        }
    }
    private initializeEffect(): void {
        if (this.m_onceClip == null) {
            let texture: TextureProxy = this.m_textures[this.m_textures.length - 1];
            let colorTexture: TextureProxy = this.m_textures[2];

            this.initClipOnceBill(texture, colorTexture, true);
        }
    }

    private initClipOnceBill(tex: TextureProxy, offsetColorTex: TextureProxy, playOnce: boolean): void {
        let size: number = 100;
        let total: number = 10;
        let clip: Billboard3DFlowEntity = new Billboard3DFlowEntity();
        clip.createGroup(total);
        let pv: Vector3D = new Vector3D();
        let uvparam: number[] = [0.0, 0.0, 1.0, 1.0];
        for (let i: number = 0; i < total; ++i) {
            size = Math.random() * Math.random() * Math.random() * 180 + 10.0;
            //clip.setSizeAndScaleAt(i,size,size,0.5,3.0);
            clip.setSizeAndScaleAt(i, size, size, 2.0, 1.0);
            clip.setUVRectAt(i, uvparam[0], uvparam[1], uvparam[2], uvparam[3]);
            //clip.setTimeAt(i, 200.0 * Math.random() + 100, 0.4,0.6, i * 10);
            //clip.setTimeAt(i, 100, 0.01,0.99, 0);
            clip.setTimeAt(i, 50.0 * Math.random() + 80, 0.01, 0.95, 0);
            //clip.setTimeAt(i, 100, 0.4,0.6, 1.0);
            //clip.setBrightnessAt(i,Math.random() * 0.8 + 0.8);
            clip.setBrightnessAt(i, 1.0);
            clip.setTimeSpeedAt(i, Math.random() * 1.0 + 0.5);
            //clip.setPositionAt(i,100.0,0.0,100.0);
            //clip.setPositionAt(i, Math.random() * 500.0 - 250.0,Math.random() * 500.0 - 250.0, Math.random() * 500.0 - 250.0);
            pv.setTo(Math.random() * 100.0 - 50.0, Math.random() * 50.0 + 50.0, Math.random() * 100.0 - 50.0);
            pv.scaleBy(0.2);
            clip.setPositionAt(i, pv.x, pv.y, pv.z);
            //clip.setAccelerationAt(i,0.003,-0.004,0.0);
            clip.setAccelerationAt(i, Math.random() * 0.006 - 0.003, -0.004, Math.random() * 0.006 - 0.003);
            clip.setVelocityAt(i, 0.0, Math.random() * 1.5 + 0.5, 0.0);
            pv.normalize();
            pv.scaleBy((Math.random() * 2.0 + 0.2) * 1.0);
            //clip.setVelocityAt(i,pv.x,pv.y,pv.z);
        }
        clip.setPlayParam(playOnce, false);
        clip.initialize(true, false, true, [tex, offsetColorTex]);
        clip.setRGBOffset3f(Math.random() * 2.0 - 1.0, Math.random() * 2.0 - 1.0, Math.random() * 2.0 - 1.0);
        clip.setRGB3f(0.1, 0.1, 0.1);
        //clip.setUVParam(3,9,0.33,0.33);
        clip.setClipUVParam(4, 16, 0.25, 0.25);
        this.m_rscene.addEntity(clip, 1);

        //clip.setTime(80.0);
        this.m_onceClip = clip;
    }
    private m_timeoutId: any = -1;

    mouseDownListener(evt: any): void {
        //console.log("mouseDownListener call, this.m_rscene: "+this.m_rscene.toString());
        if (this.m_onceClip != null) {
            this.m_viewRay.intersectPlane();
            let pv: Vector3D = this.m_viewRay.position;
            this.m_axis.setPosition(pv);
            this.m_axis.update();
            this.m_onceClip.setTime(0);
            this.m_onceClip.setPosition(pv);
            this.m_onceClip.update();
            //this.createEff(this.m_viewRay.position);
        }
    }
    private m_effInited: boolean = true;
    private update(): void {
        if (this.m_timeoutId > -1) {
            clearTimeout(this.m_timeoutId);
        }
        this.m_timeoutId = setTimeout(this.update.bind(this), 20);// 50 fps
        this.m_rscene.update();
        if (this.m_textures[0].isDataEnough()) {
            if (this.m_effInited) {
                this.initializeEffect();
                this.m_effInited = false;
            }
            this.m_camTrack.rotationOffsetAngleWorldY(-0.1);
        }
        if (this.m_onceClip != null) this.m_onceClip.updateTime(3.0);
    }
    run(): void {
        this.m_rscene.run()

        this.m_statusDisp.statusInfo = "/" + RendererState.DrawCallTimes;
        this.m_statusDisp.update();
    }
}
export default DemoParticleClips;