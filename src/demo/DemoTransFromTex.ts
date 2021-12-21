
import Vector3D from "../vox/math/Vector3D";
import RendererDevice from "../vox/render/RendererDevice";
import RendererParam from "../vox/scene/RendererParam";
import RenderStatusDisplay from "../vox/scene/RenderStatusDisplay";

import Box3DEntity from "../vox/entity/Box3DEntity";
import { TextureConst } from "../vox/texture/TextureConst";
import TextureProxy from "../vox/texture/TextureProxy";

import MouseEvent from "../vox/event/MouseEvent";
import ImageTextureLoader from "../vox/texture/ImageTextureLoader";
import CameraTrack from "../vox/view/CameraTrack";
import RendererScene from "../vox/scene/RendererScene";

import CameraStageDragSwinger from "../voxeditor/control/CameraStageDragSwinger";
import CameraZoomController from "../voxeditor/control/CameraZoomController";
import ChangeColorMaterial from "../renderingtoy/mcase/material/ChangeColorMaterial";
import TransFromTexMaterial,{Matrix4Texture} from "../renderingtoy/mcase/material/TransFromTexMaterial";
import Matrix4 from "../vox/math/Matrix4";
import Axis3DEntity from "../vox/entity/Axis3DEntity";
import ROTransform from "../vox/display/ROTransform";

export class DemoTransFromTex {
    constructor() { }

    private m_rscene: RendererScene = null;
    private m_texLoader: ImageTextureLoader = null;
    private m_camTrack: CameraTrack = null;
    private m_statusDisp: RenderStatusDisplay = new RenderStatusDisplay();
    private m_stageDragSwinger: CameraStageDragSwinger = new CameraStageDragSwinger();
    private m_cameraZoomController: CameraZoomController = new CameraZoomController();

    private getImageTexByUrl(purl: string, wrapRepeat: boolean = true, mipmapEnabled = true): TextureProxy {
        let ptex: TextureProxy = this.m_texLoader.getImageTexByUrl(purl);
        ptex.mipmapEnabled = mipmapEnabled;
        if (wrapRepeat) ptex.setWrap(TextureConst.WRAP_REPEAT);
        return ptex;
    }
    initialize(): void {
        console.log("DemoTransFromTex::initialize()......");
        if (this.m_rscene == null) {
            RendererDevice.SHADERCODE_TRACE_ENABLED = true;
            RendererDevice.VERT_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = true;
            //RendererDevice.FRAG_SHADER_PRECISION_GLOBAL_HIGHP_ENABLED = false;

            let rparam: RendererParam = new RendererParam();
            //rparam.maxWebGLVersion = 1;
            rparam.setCamProject(45,10.0,10000.0);
            rparam.setCamPosition(2600.0, 2600.0, 2600.0);
            this.m_rscene = new RendererScene();            
            this.m_rscene.initialize(rparam, 4);
            this.m_rscene.updateCamera();
            this.m_texLoader = new ImageTextureLoader(this.m_rscene.textureBlock);

            this.m_rscene.enableMouseEvent(true);
            this.m_cameraZoomController.bindCamera(this.m_rscene.getCamera());
            this.m_cameraZoomController.initialize(this.m_rscene.getStage3D());
            this.m_stageDragSwinger.initialize(this.m_rscene.getStage3D(), this.m_rscene.getCamera());

            this.m_camTrack = new CameraTrack();
            this.m_camTrack.bindCamera(this.m_rscene.getCamera());

            //this.m_profileInstance.initialize(this.m_rscene.getRenderer());
            this.m_statusDisp.initialize();

            this.m_rscene.addEventListener(MouseEvent.MOUSE_DOWN, this, this.mouseDown);

            let axis: Axis3DEntity = new Axis3DEntity();
            axis.initialize(300.0);
            this.m_rscene.addEntity(axis);

            
            this.initObjs();

            this.update();
            
        }
    }
    private m_mat4Tex: Matrix4Texture = null;
    private m_mat4List: Matrix4[] = [];
    private initObjs(): void {
        let mat4Tex: Matrix4Texture = new Matrix4Texture();
        mat4Tex.inittialize(this.m_rscene.textureBlock,20000);
        this.m_mat4Tex = mat4Tex;

        let mat4: Matrix4 = new Matrix4();
        let trans: ROTransform = ROTransform.Create();
        let texList: TextureProxy[] = [
                this.getImageTexByUrl("static/assets/metal_02.jpg"),
                this.m_mat4Tex.getTexture()
        ];
        let srcBox: Box3DEntity = new Box3DEntity(trans);
        srcBox.setMaterial( new TransFromTexMaterial() );
        srcBox.initializeCube(80.0, texList);
        
        trans = mat4 != null? trans : null;
        for(let i: number = 0; i < 20000; ++i) {
            let box: Box3DEntity = new Box3DEntity(trans);
            if(mat4 != null) {
                let material: TransFromTexMaterial = new TransFromTexMaterial();
                material.setTransTexSize(this.m_mat4Tex.getWidth(), this.m_mat4Tex.getHeight());
                material.setMat4Index( i );
                box.setMaterial( material );
            }
            box.copyMeshFrom( srcBox );
            box.initializeCube(80.0, texList);
            if(mat4 == null) {
                box.setXYZ(Math.random() * 1600 - 800, Math.random() * 1600 - 800, Math.random() * 1600 - 800);
            }
            this.m_rscene.addEntity(box);

            if(mat4 != null) {
                mat4.identity();
                mat4.appendRotationEulerAngle(0.3 * i,0.5 * i,0.7);
                mat4.setTranslationXYZ(Math.random() * 1600 - 800, Math.random() * 1600 - 800, Math.random() * 1600 - 800);
                this.m_mat4List.push(mat4);
                this.m_mat4Tex.setMatrix4At(i, mat4);
            }
        }
    }
    private m_flag: boolean = false;
    private mouseDown(evt: any): void {

        this.m_flag = !this.m_flag;
        if(!this.m_flag) {
            this.m_time = 0;
        }
    }
    private m_timeoutId: any = -1;
    private update(): void {
        if (this.m_timeoutId > -1) {
            clearTimeout(this.m_timeoutId);
        }
        //this.m_timeoutId = setTimeout(this.update.bind(this),16);// 60 fps
        this.m_timeoutId = setTimeout(this.update.bind(this), 40);// 20 fps

        this.m_statusDisp.render();

    }
    private m_delay: number = 0;
    private m_time: number = 0.0;
    run(): void {

        //  if(this.m_flag) {
        //      this.m_time += 0.01;
        //      this.m_material.setTime(this.m_time);
        //  }
        this.m_statusDisp.update(false);
        this.m_stageDragSwinger.runWithYAxis();
        this.m_cameraZoomController.run(Vector3D.ZERO, 30.0);

        this.m_rscene.run( true );

    }
}
export default DemoTransFromTex;