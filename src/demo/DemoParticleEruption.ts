
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
import TextureProxy from "../vox/texture/TextureProxy";
import { TextureConst, TextureFormat, TextureDataType, TextureTarget } from "../vox/texture/TextureConst";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import CameraTrack from "../vox/view/CameraTrack";
import EruptionEffectPool from "../particle/effect/EruptionEffectPool";
import EruptionSmokePool from "../particle/effect/EruptionSmokePool";

export class DemoParticleEruption {
    constructor() { }

    private m_rscene: RendererScene = null;
    private m_texLoader: ImageTextureLoader = null;
    private m_camTrack: CameraTrack = null;
    private m_statusDisp: RenderStatusDisplay = new RenderStatusDisplay();
    private m_axis: Axis3DEntity = null;
    private m_textures: TextureProxy[] = null;
    private m_eff0Pool: EruptionEffectPool = null;
    private m_eff1Pool: EruptionSmokePool = null;
    private m_viewRay: CameraViewRay = new CameraViewRay();
    getImageTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): TextureProxy {
        let ptex: TextureProxy = this.m_texLoader.getImageTexByUrl(purl);
        ptex.mipmapEnabled = mipmapEnabled;
        if (wrapRepeat) ptex.setWrap(TextureConst.WRAP_REPEAT);
        return ptex;
    }

    initialize(): void {
        let boo0: any = true;
        let boo1: any = false;
        console.log("DemoParticleEruption::initialize()......: " + (boo0 + boo1));
        if (this.m_rscene == null) {
            RendererDevice.SHADERCODE_TRACE_ENABLED = true;

            let rparam: RendererParam = new RendererParam();
            //rparam.setAttriAlpha(false);
            rparam.setMatrix4AllocateSize(4096);
            rparam.setCamProject(45.0, 10.0, 5000.0);
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
            /*
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
            textures.push(this.getImageTexByUrl("static/assets/wood_02.jpg"));
            textures.push(this.getImageTexByUrl("static/assets/arrow01.png"));
            textures.push(this.getImageTexByUrl("static/assets/partile_tex_001.jpg"));
            textures.push(this.getImageTexByUrl("static/assets/stones_02.png"));

            textures.push(this.getImageTexByUrl("static/assets/guangyun_H_0007.png"));
            textures.push(this.getImageTexByUrl("static/assets/flare_core_01.jpg"));
            textures.push(this.getImageTexByUrl("static/assets/flare_core_02.jpg"));
            textures.push(this.getImageTexByUrl("static/assets/a_02_c.jpg"));

            textures.push(this.getImageTexByUrl("static/assets/testEFT4.jpg"));
            textures.push(this.getImageTexByUrl("static/assets/xulie_02_07.png"));
            textures.push(this.getImageTexByUrl("static/assets/color_02.jpg"));
            textures.push(this.getImageTexByUrl("static/assets/particle/xuelie/xulie_00046.png"));
            textures.push(this.getImageTexByUrl("static/assets/testTex.png"));
            this.m_textures = textures;

            ///*
            let plane: Plane3DEntity = new Plane3DEntity();
            plane.initializeXOZ(-500.0, -500.0, 1000.0, 1000.0, [textures[0]]);
            //plane.toTransparentBlend(false);
            plane.setXYZ(0.0, -80.0, 0.0);
            this.m_rscene.addEntity(plane);
            let material: any = plane.getMaterial();
            //material.setRGB3f(0.8,0.8,0.8);
            //*/
            this.m_rscene.setClearRGBColor3f(0.1, 0.1, 0.1);
            this.update();
        }
    }
    private initializeEffect(): void {
        // if (this.m_eff0Pool == null) {
        //     let texFlame: TextureProxy = this.m_textures[8];
        //     let texSolid: TextureProxy = this.m_textures[3];
        //     this.m_eff0Pool = new EruptionEffectPool();
        //     this.m_eff0Pool.solidPremultiplyAlpha = true;
        //     this.m_eff0Pool.initialize(this.m_rscene, 1, 60, 50, texFlame, texSolid, true);
        //     //  this.m_eff0Pool.createEffect(null);
        // }
        if (this.m_eff1Pool == null) {

            let texture: TextureProxy = this.m_textures[9];
            let colorTexture: TextureProxy = this.m_textures[10];
            this.m_eff1Pool = new EruptionSmokePool();
            
            this.m_eff1Pool.initialize(this.m_rscene, 1, 10, texture, colorTexture, true);
            //  this.m_eff1Pool.createEffect(null);
        }
    }

    mouseDownListener(evt: any): void {
        //console.log("mouseDownListener call, this.m_rscene: "+this.m_rscene.toString());

        if (this.m_eff0Pool != null || this.m_eff1Pool != null) {
            this.m_viewRay.intersectPlane();

            // //this.m_eff0Pool.createEffect(this.m_viewRay.position);
            this.m_eff1Pool.createEffect(this.m_viewRay.position);
            return;

            if (Math.random() > 0.5) {
                this.m_eff0Pool.createEffect(this.m_viewRay.position);
            }
            else {
                this.m_eff1Pool.createEffect(this.m_viewRay.position);
            }
        }
    }
    private m_effInited: boolean = true;
    private m_timeoutId: any = -1;
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

            if (this.m_eff0Pool != null) {
                this.m_eff0Pool.run();
            }
            if (this.m_eff1Pool != null) {
                this.m_eff1Pool.run();
            }
            this.m_camTrack.rotationOffsetAngleWorldY(-0.1);
            this.m_statusDisp.statusInfo = "/" + RendererState.DrawCallTimes;
        }
    }
    run(): void {
        this.m_rscene.run();

        this.m_statusDisp.update();
    }
}
export default DemoParticleEruption;