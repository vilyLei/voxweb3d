
import Vector3D from "../vox/math/Vector3D";
import Matrix4 from "../vox/math/Matrix4";
import Matrix4Pool from "../vox/math/Matrix4Pool";
import RendererDevice from "../vox/render/RendererDevice";
import RendererParam from "../vox/scene/RendererParam";
import RendererInstanceContext from "../vox/scene/RendererInstanceContext";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";

import Box3DEntity from "../vox/entity/Box3DEntity";
import Pipe3DEntity from "../vox/entity/Pipe3DEntity";
import Axis3DEntity from "../vox/entity/Axis3DEntity";
import { TextureConst, TextureFormat, TextureDataType, TextureTarget } from "../vox/texture/TextureConst";
import TextureProxy from "../vox/texture/TextureProxy";
import ImageTextureProxy from "../vox/texture/ImageTextureProxy";

import MouseEvent from "../vox/event/MouseEvent";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import CameraTrack from "../vox/view/CameraTrack";
import RendererScene from "../vox/scene/RendererScene";
import ProfileInstance from "../voxprofile/entity/ProfileInstance";

export class DemoFlexPipe {
    constructor() { }

    private m_rscene: RendererScene = null;
    private m_rcontext: RendererInstanceContext = null;
    private m_texLoader: ImageTextureLoader = null;
    private m_camTrack: CameraTrack = null;
    private m_statusDisp: RenderStatusDisplay = new RenderStatusDisplay();
    private m_profileInstance: ProfileInstance = new ProfileInstance();
    private m_pipe: Pipe3DEntity = null;
    private getImageTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): TextureProxy {
        let ptex: TextureProxy = this.m_texLoader.getImageTexByUrl(purl);
        ptex.mipmapEnabled = mipmapEnabled;
        if (wrapRepeat) ptex.setWrap(TextureConst.WRAP_REPEAT);
        return ptex;
    }
    initialize(): void {
        console.log("DemoFlexPipe::initialize()......");
        if (this.m_rscene == null) {
            RendererDevice.SHADERCODE_TRACE_ENABLED = false;
            RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
            //RendererDevice.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;

            let rparam: RendererParam = new RendererParam();
            rparam.setCamPosition(800.0, 800.0, 800.0);
            this.m_rscene = new RendererScene();
            this.m_rscene.initialize(rparam, 3);
            this.m_rscene.updateCamera();
            this.m_rcontext = this.m_rscene.getRendererContext();
            this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);

            this.m_camTrack = new CameraTrack();
            this.m_camTrack.bindCamera(this.m_rscene.getCamera());

            this.m_profileInstance.initialize(this.m_rscene.getRenderer());
            this.m_statusDisp.initialize();

            this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);

            let axis: Axis3DEntity = new Axis3DEntity();
            axis.initialize(300.0);
            this.m_rscene.addEntity(axis);
            //skin_01
            // add common 3d display entity
            //      let plane:Plane3DEntity = new Plane3DEntity();
            //      plane.initializeXOZ(-400.0, -400.0, 800.0, 800.0, [this.getImageTexByUrl("static/assets/broken_iron.jpg")]);
            //      this.m_rscene.addEntity(plane);
            //      this.m_targets.push(plane);
            //      //this.m_disp = plane
            let posV: Vector3D = new Vector3D();

            let pipe: Pipe3DEntity = new Pipe3DEntity();
            pipe.showDoubleFace();
            //pipe.toBrightnessBlend(false,true);
            pipe.initialize(170.0, 400.0, 7, 20, [this.getImageTexByUrl("static/assets/metal_02.jpg")], 1, 0.0);
            //pipe.setXYZ(Math.random() * 500.0 - 250.0,Math.random() * 50.0 + 10.0,Math.random() * 500.0 - 250.0);
            this.m_rscene.addEntity(pipe, 1);
            this.m_pipe = pipe;
            //  pipe.getCircleCenterAt(1,posV);
            //  console.log("XXX posV: ",posV);

            //this.transformPipe(7);
            //this.transformPipeDo(21, 0.06, -0.05);
            this.transformPipeDo(21, 0.06, -0.05);
            this.m_pipe.reinitialize();
            this.m_pipe.updateMeshToGpu();

        }
    }

    private m_testFlag: boolean = true;
    private m_pos0: Vector3D = new Vector3D();
    private m_rotV: Vector3D = new Vector3D();
    private m_scaleV: Vector3D = new Vector3D(1.0, 1.0, 1.0);

    private transformPipeDo(total: number, dradius: number, dscale: number): void {
        this.m_rotV.setXYZ(0.0, 0.0, 0.0);
        this.m_rotV.z += dradius;


        let mat4: Matrix4 = new Matrix4();
        for (let i: number = 1; i < total; ++i) {
            mat4.identity();
            mat4.setScaleXYZ(this.m_scaleV.x, this.m_scaleV.y, this.m_scaleV.z);
            mat4.setRotationEulerAngle(this.m_rotV.x, this.m_rotV.y, this.m_rotV.z);
            this.m_scaleV.x += dscale;
            this.m_scaleV.z += dscale;
            this.m_rotV.z += dradius;
            this.m_pipe.transformCircleAt(i, mat4);
        }


    }
    private transformPipe(i: number): void {
        this.m_pos0.x += 13.0;
        let mat4: Matrix4 = new Matrix4();
        mat4.identity();
        mat4.setTranslation(this.m_pos0);
        mat4.setRotationEulerAngle(this.m_rotV.x, this.m_rotV.y, this.m_rotV.z);
        this.m_pipe.transformCircleAt(i, mat4);
    }
    private mouseDown(evt: any): void {
        let i: number = 0;
        let type: number = 0;
        switch (type) {
            case 0:
                //this.transformPipe(i);
                break;
            default:
                break;
        }
    }
    private m_timeoutId: any = -1;
    private update(): void {
        if (this.m_timeoutId > -1) {
            clearTimeout(this.m_timeoutId);
        }
        //this.m_timeoutId = setTimeout(this.update.bind(this),16);// 60 fps
        this.m_timeoutId = setTimeout(this.update.bind(this), 40);// 20 fps
        let pcontext: RendererInstanceContext = this.m_rcontext;
        this.m_statusDisp.statusInfo = "/" + pcontext.getTextureResTotal() + "/" + pcontext.getTextureAttachTotal();

        this.m_rscene.update();
        this.m_statusDisp.render();

    }
    run(): void {

        this.m_statusDisp.update(false);
        this.m_rscene.run();
        this.m_camTrack.rotationOffsetAngleWorldY(-0.5);
        //this.m_profileInstance.run();
    }
}
export default DemoFlexPipe;