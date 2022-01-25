
import Vector3D from "../vox/math/Vector3D";
import RendererDevice from "../vox/render/RendererDevice";
import { RenderBlendMode, CullFaceMode, DepthTestMode } from "../vox/render/RenderConst";
import RendererState from "../vox/render/RendererState";
import RendererParam from "../vox/scene/RendererParam";
import RendererInstanceContext from "../vox/scene/RendererInstanceContext";
import RendererInstance from "../vox/scene/RendererInstance";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";
import MouseEvent from "../vox/event/MouseEvent";
import Stage3D from "../vox/display/Stage3D";

import Plane3DEntity from "../vox/entity/Plane3DEntity";
import Axis3DEntity from "../vox/entity/Axis3DEntity";
import Box3DEntity from "../vox/entity/Box3DEntity";
import Sphere3DEntity from "../vox/entity/Sphere3DEntity";
import Cylinder3DEntity from "../vox/entity/Cylinder3DEntity";
import Billboard3DEntity from "../vox/entity/Billboard3DEntity";
import TextureProxy from "../vox/texture/TextureProxy";
import TextureConst from "../vox/texture/TextureConst";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";

import CameraTrack from "../vox/view/CameraTrack";
import PathTrack from "../voxnav/path/PathTrack";
import CameraBase from "../vox/view/CameraBase";

export namespace voxnav {
    class WalkNavAction {
        constructor() { }
        private m_target: any = null;

        private m_spdX: number = 0.0;
        private m_spdY: number = 0.2;
        private m_spdZ: number = 0.0;
        setRotSpeedXYZ(spdX: number, spdY: number, spdZ: number): void {
            this.m_spdX = spdX;
            this.m_spdY = spdY;
            this.m_spdZ = spdZ;
        }
        bindTarget(tar: Sphere3DEntity): void {
            this.m_target = tar;
        }
        destroy(): void {
            this.m_target = null;
        }
        getTarget(): Sphere3DEntity {
            return this.m_target;
        }
        private m_dis: number = 0.0;
        private m_outV: Vector3D = new Vector3D();
        private m_flag: number = PathTrack.TRACK_END;
        update(): void {
            if (this.m_flag != PathTrack.TRACK_END) {
                this.m_dis += 0.5;
                this.m_flag = this.m_pathTrack.calcPosByDis(this.m_outV, this.m_dis, true);
                this.m_target.setPosition(this.m_outV);
                this.m_target.update();
            } else {
                if (this.moveToEnd != null) this.moveToEnd();
            }
        }
        getTrackFlag(): number {
            return this.m_flag;
        }
        moveToEnd: any = null;
        private m_pathTrack: PathTrack = new PathTrack();
        setPathPosList(posList: Vector3D[]): void {
            this.m_dis = 0;
            this.m_flag = PathTrack.TRACK_END + 100;
            //
            let i: number = 0;
            let len: number = posList.length;
            //trace("posList.length: "+posList.length);
            this.m_target.setPosition(posList[0]);
            this.m_target.update();

            this.m_pathTrack.clear();
            let pv = null;
            for (; i < len; ++i) {
                pv = posList[i];
                this.m_pathTrack.addXYZ(pv.x, pv.y, pv.z);
            }
        }
    }
    export class DemoPathWalk {
        constructor() {
        }
        private m_renderer: RendererInstance = null;
        private m_rcontext: RendererInstanceContext = null;
        private m_texLoader: ImageTextureLoader;
        private m_camTrack: CameraTrack = null;
        private m_statusDisp: RenderStatusDisplay = new RenderStatusDisplay();
        private m_walkAct: WalkNavAction = new WalkNavAction();
        initialize(): void {
            console.log("DemoPathWalk::initialize()......");
            if (this.m_rcontext == null) {
                RendererDevice.SHADERCODE_TRACE_ENABLED = true;
                let tex0: TextureProxy = this.m_texLoader.getImageTexByUrl("static/assets/default.jpg");
                let tex1: TextureProxy = this.m_texLoader.getImageTexByUrl("static/assets/broken_iron.jpg");
                let tex2: TextureProxy = this.m_texLoader.getImageTexByUrl("static/assets/guangyun_H_0007.png");
                let tex3: TextureProxy = this.m_texLoader.getImageTexByUrl("static/assets/flare_core_02.jpg");
                tex0.mipmapEnabled = true;
                tex0.setWrap(TextureConst.WRAP_REPEAT);
                tex1.mipmapEnabled = true;
                tex1.setWrap(TextureConst.WRAP_REPEAT);
                tex2.mipmapEnabled = true;
                tex2.setWrap(TextureConst.WRAP_REPEAT);
                tex3.mipmapEnabled = true;

                this.m_statusDisp.initialize();
                let rparam: RendererParam = new RendererParam();
                rparam.setCamProject(45.0, 0.1, 3000.0);
                rparam.setCamPosition(1500.0, 1500.0, 1500.0);
                this.m_renderer = new RendererInstance();
                this.m_renderer.initialize(rparam, new CameraBase());
                this.m_rcontext = this.m_renderer.getRendererContext();
                let stage3D: Stage3D = this.m_rcontext.getStage3D() as Stage3D;
                stage3D.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDownListener);
                this.m_camTrack = new CameraTrack();
                this.m_camTrack.bindCamera(this.m_rcontext.getCamera());

                RendererState.CreateRenderState("ADD01", CullFaceMode.BACK, RenderBlendMode.ADD, DepthTestMode.BLEND);
                RendererState.CreateRenderState("ADD02", CullFaceMode.BACK, RenderBlendMode.ADD, DepthTestMode.ALWAYS);

                let i: number = 0;
                let plane: Plane3DEntity = new Plane3DEntity();
                plane.showDoubleFace();
                plane.initializeXOZ(-200.0, -150.0, 400.0, 300.0, [tex0]);
                this.m_renderer.addEntity(plane);

                let axis: Axis3DEntity = new Axis3DEntity();
                axis.initialize(600.0);
                this.m_renderer.addEntity(axis);

                let srcBox: Box3DEntity = new Box3DEntity();
                srcBox.initialize(new Vector3D(-100.0, -100.0, -100.0), new Vector3D(100.0, 100.0, 100.0), [tex1]);
                //srcBox = null;
                let box: Box3DEntity = null;
                for (i = 0; i < 0; ++i) {
                    box = new Box3DEntity();
                    if (srcBox != null) box.setMesh(srcBox.getMesh());
                    box.initialize(new Vector3D(-100.0, -100.0, -100.0), new Vector3D(100.0, 100.0, 100.0), [tex1]);
                    box.setXYZ(Math.random() * 1000.0 - 500.0, Math.random() * 1000.0 - 500.0, Math.random() * 1000.0 - 500.0);
                    this.m_renderer.addEntity(box);
                }
                let sphere: Sphere3DEntity = null;
                for (i = 0; i < 1; ++i) {
                    sphere = new Sphere3DEntity();
                    sphere.initialize(50.0, 15, 15, [tex1]);
                    sphere.setXYZ(Math.random() * 1000.0 - 500.0, Math.random() * 1000.0 - 500.0, Math.random() * 1000.0 - 500.0);
                    this.m_renderer.addEntity(sphere);
                }

                let pathPosList: Vector3D[] = [new Vector3D(0.0, 0.0, 0.0), new Vector3D(200.0, 0.0, 0.0), new Vector3D(100.0, 0.0, 100.0)];
                this.m_walkAct.bindTarget(sphere);
                this.m_walkAct.setPathPosList(pathPosList);
            }
        }
        mouseDownListener(evt: any): void {
            console.log("mouseUpListener call, this.m_renderer: " + this.m_renderer.toString());
        }
        run(): void {
            //--this.m_runFlag;

            this.m_statusDisp.update();

            this.m_walkAct.update();
            //console.log("##-- begin");
            this.m_rcontext.setClearRGBColor3f(0.0, 0.5, 0.0);
            this.m_rcontext.renderBegin();

            this.m_renderer.update();
            this.m_renderer.run();

            this.m_rcontext.runEnd();
            //this.m_camTrack.rotationOffsetAngleWorldY(-0.2);
            this.m_rcontext.updateCamera();

            //  //console.log("#---  end");
        }
    }
}